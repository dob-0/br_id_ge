// The crossings — who crossed the bridge, read off the field, and which of them
// are people. Moved out of di.bo's bot.mjs on 2026-10-07 (di-bo master 91268bd),
// when di.bo became the team's assistant and stopped announcing crossings.
//
// Two parts, the same as before the move:
//   readField / junkReason / looksMashed   pure enough to test without a bot
//   makeCrossingPoller                     the announcer: give it a `broadcast`
//                                          and a place to keep `seen`, and it
//                                          speaks every new core exactly once
//
// Standing alone, with no bot and no Telegram:
//
//     node keeper/crossings.mjs                      what is in the prod field now,
//                                                    and what would be announced
//     node keeper/crossings.mjs --server https://staging.di-studio.xyz/serverXR
//
// It reads, prints and exits. Nothing is written and nothing is sent.

export const SERVER = (process.env.DI_SERVER || 'https://di-studio.xyz/serverXR').replace(/\/+$/, '')
export const SITE = (process.env.DI_SITE || 'https://di-studio.xyz').replace(/\/+$/, '')
export const SPACE = process.env.BR_SPACE || 'br_id_ge'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── the field — every stone that is a crossing ────────────────────────────
export async function readField({ server = SERVER, space = SPACE } = {}) {
  const r = await fetch(`${server}/api/spaces/${space}/scene`, { signal: AbortSignal.timeout(20000) })
  if (!r.ok) throw new Error(`scene HTTP ${r.status}`)
  const j = await r.json()
  const objects = j.objects || j.scene?.objects || []
  return objects.filter((o) => String(o.id || '').startsWith('insc-'))
}

// Whether the field is even open to crossings. During Notations #2
// openInscriptions sat false while visitors crossed and left nothing behind.
export async function checkInscriptionsOpen({ server = SERVER, space = SPACE } = {}) {
  const r = await fetch(`${server}/api/spaces/${space}`, { signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`space HTTP ${r.status}`)
  const m = (await r.json()).space || {}
  return Boolean(m.openInscriptions && m.isPublic && m.allowEdits)
}

// Which crossings are not people. On 2026-08-09 the field held 48 objects and
// 32 distinct, of which the eleven most recent were one keyboard mash repeated —
// and di-bo had announced every one, because it could not tell a person from a
// fist on a keyboard.
//
// The asymmetry decides how hard this filter is allowed to try: a crossing that
// happens and is never announced is INVISIBLE, a mash that gets announced is
// merely annoying. So every rule here needs a proof, not a guess about intent,
// and anything unproven is left to a human eye. In particular there is no
// phonotactic rule — the field is Armenian-first and "looks like a word to
// English eyes" would quietly eat real crossings.
//
// Repeats are deliberately NOT filtered: whether crossing twice makes a second
// core is an open design question (see CURRENT.md), and a filter is the wrong
// place to settle it.
const EM_DASH = '—'
// Rows of a keyboard, for spotting a hand dragged across one. Reversed too,
// because a drag goes both ways.
const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890']
const KEY_RUNS = new Set(KEY_ROWS.flatMap((row) => {
  const both = [row, [...row].reverse().join('')]
  return both.flatMap((r) => Array.from({ length: Math.max(0, r.length - 3) }, (_, i) => r.slice(i, i + 4)))
}))

// Whether a token looks like a hand on a keyboard rather than a word. Only
// consulted when someone wrote the SAME thing twice — on its own, repetition is
// not evidence of anything.
export function looksMashed(token) {
  const t = String(token || '').toLowerCase()
  // A name is short. Twelve characters of anything, typed twice, is not one.
  if (t.length >= 12) return true
  // aaaa, )))) — three of the same character in a row is not a word in any
  // script that reaches this field.
  if (/(.)\1{2,}/u.test(t)) return true
  for (let i = 0; i + 4 <= t.length; i++) if (KEY_RUNS.has(t.slice(i, i + 4))) return true
  return false
}

export function junkReason(name, word) {
  // window.__end() writes '—' as the name itself, so this is an artefact by
  // construction rather than a shy visitor who left the field blank.
  if (name === EM_DASH) return 'end-probe'
  // Writing the same short thing twice is something a PERSON does — `yuyu ·
  // yuyu` crossed on prod and this rule swallowed it, which is the wrong way
  // for it to fail. A missed crossing means someone was there and nobody
  // heard; a wrong announcement costs one line in Telegram. So repetition
  // alone is no longer enough: the thing repeated has to look mashed too.
  if (name && name === word && looksMashed(name)) return 'doubled mash'
  if (name.startsWith('__') || word.startsWith('__')) return 'reserved prefix'
  // No letter in ANY script, in either half — \p{L} covers Armenian, Latin and
  // Cyrillic alike, so this catches ')))) ' without assuming an alphabet.
  if (!/\p{L}/u.test(name + word)) return 'no letters'
  return null
}

// "name · word" as the server composed it.
export const splitStone = (s) => String(s?.data || '').split('·').map((x) => x.trim())

export const crossingText = ({ name, word, nth, fieldUrl }) =>
  `<b>${esc(name || '—')}</b> crossed the bridge.\n` +
  `they carried: <b>${esc(word || '—')}</b>\n\n` +
  `<i>core ${nth} in the field</i>\n${fieldUrl}`

// say() in di.bo swallowed failures, so "reached nobody" and "had nobody to
// reach" looked the same from outside. Tell them apart before writing anything
// down as told.
export const landed = (results) => results.length === 0 || results.some(Boolean)

// ── the announcer ─────────────────────────────────────────────────────────
// Everything it needs is handed in, so it can live in any process that holds a
// Telegram token — or in none, for a test.
//   broadcast(chats, text) → Promise<Array<sent|undefined>>
//   getState() → { seen: [...] }, save() → Promise
//   announceChats  where a crossing is spoken
//   alertChats     where "I started with no memory" is spoken (falls back to
//                  announceChats)
//   fieldUrl()     the door printed under each crossing
export function makeCrossingPoller({
  broadcast,
  getState,
  save,
  announceChats = [],
  alertChats = [],
  fieldUrl = () => `${SITE}/${SPACE}/field`,
  read = () => readField(),
  log = console,
  onBeat = () => {},
} = {}) {
  return async function pollField() {
    const state = getState()
    if (!Array.isArray(state.seen)) state.seen = []
    let stones
    try { stones = await read() } catch (e) { return log.error('keeper: field poll:', e.message) }
    // only a poll that actually reached the field counts as a beat
    onBeat(Date.now())

    const seen = new Set(state.seen)
    const fresh = stones.filter((s) => !seen.has(s.id))

    // First run: adopt the field rather than shouting every old stone. But SAY SO.
    //
    // This used to be silent, and silence here is expensive in one specific way:
    // `seen` is the only record of which crossings have been announced. Lose it
    // and this branch runs again, quietly adopts every stone standing in the
    // field, and every crossing between the loss and the restore is marked seen
    // without anyone ever being told — the seven lost crossings again, at scale.
    //
    // A first run and a lost state are genuinely indistinguishable from in here,
    // so this does not guess between them. It reports what it DID, once, and the
    // owner is the one who knows which of the two it was.
    if (!state.seen.length) {
      state.seen = stones.map((s) => s.id)
      await save()
      log.log(`keeper: adopted ${stones.length} existing stones`)
      if (stones.length) {
        await broadcast(alertChats.length ? alertChats : announceChats,
          `:: <b>the field</b> — I started with no memory of the field and adopted ` +
          `<b>${stones.length}</b> core(s) without announcing them.\n\n` +
          `<i>if this is the first run, that is correct. if it is not, the record of what was announced was lost ` +
          `and any crossing since then went unannounced — the field is at ${SITE}/${SPACE}.</i>`)
      }
      return
    }
    if (!fresh.length) return

    const lost = new Set()
    for (const s of fresh) {
      const [name, word] = splitStone(s)
      // Filtered, never silent: the stone still counts and is still marked seen —
      // it just does not wake anyone. Logged so a wrongly-swallowed crossing can
      // be found in the journal rather than vanishing.
      const junk = junkReason(name || '', word || '')
      if (junk) { log.log(`keeper: not announcing ${s.id} (${junk}): ${s.data}`); continue }
      // the stone's own place in the field — the batch total made three crossings
      // between two polls all claim to be the same core
      const nth = stones.indexOf(s) + 1
      if (!landed(await broadcast(announceChats, crossingText({ name, word, nth, fieldUrl: fieldUrl() })))) lost.add(s.id)
    }
    // A crossing nobody heard is not seen. Leave it for the next poll instead of
    // burying it — TOPIC_CLOSED in a forum silently ate three of them this way.
    state.seen = stones.map((s) => s.id).filter((id) => !lost.has(id))
    await save()
    if (fresh.length > lost.size) log.log(`keeper: announced ${fresh.length - lost.size} crossing(s)`)
    if (lost.size) log.error(`keeper: ${lost.size} crossing(s) undelivered — will retry`)
  }
}

// ── standing it up alone ──────────────────────────────────────────────────
if (process.argv[1] && process.argv[1].endsWith('crossings.mjs')) {
  const argv = process.argv.slice(2)
  const arg = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1] }
  const server = String(arg('--server', SERVER)).replace(/\/+$/, '')
  const space = arg('--space', SPACE)
  try {
    const stones = await readField({ server, space })
    const open = await checkInscriptionsOpen({ server, space }).catch(() => null)
    console.log(`${server} /${space}: ${stones.length} core(s); open to crossings: ${open === null ? '?' : open ? 'yes' : 'NO'}`)
    stones.forEach((s, i) => {
      const [name, word] = splitStone(s)
      const junk = junkReason(name || '', word || '')
      console.log(`  ${String(i + 1).padStart(3)}  ${junk ? `[not announced: ${junk}]` : '[a person]           '}  ${s.data || s.id}`)
    })
  } catch (e) {
    console.error(`could not read the field at ${server}: ${e.message}`)
    process.exit(2)
  }
}
