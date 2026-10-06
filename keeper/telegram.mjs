// The keeper's Telegram half — what di.bo's bot.mjs did FOR the keeper, moved
// here on 2026-10-07 (di-bo master 91268bd) when di.bo became the team's
// assistant. Nothing in this file holds a token or polls Telegram: every piece is
// a factory that is handed `say` / `broadcast` by whichever bot process hosts it.
// No process hosts it today. keeper.mjs runs on its own without any of this —
// asks print to its console and the keeper answers with KEPT_LINE.
//
//   makeKeeperMirror   a visitor's words in the field, carried to a person
//   makeMindBudget     THE FIELD WINS — the hour's budget as a ladder of lanes
//   makeKeeperMind     the mind on the relay's fenced /public path, as the keeper
//   startKeeperForBot  startKeeper with the mirror, the mind and the dedupe wired
//   sayCommand         /say — the owner speaking into the field by hand
//   makeTunnelThreads  a crossing continued into a private Telegram thread
//                      (docs/the-tunnel.md): /start <token>, /mine, /forget,
//                      and the traveller's context on a question
//
// The relay half: the keeper's brief (relay-brief.md) is NOT in di.bo's relay any
// more, and that relay now refuses any `voice` it does not hold. So a mind pointed
// at it gets an error, and the keeper falls back to KEPT_LINE — never di.bo's
// voice in the artwork's mouth.

import { startKeeper } from './keeper.mjs'
import { readToken, bind, laneAllowed } from './tunnel.mjs'

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── the mirror ────────────────────────────────────────────────────────────
// Someone spoke to the piece. Echoed where /say can answer it by hand — the
// keeper's mouth is open to the owner whether or not a model is reachable.
// Logs on the way through, not only on failure. Someone had a whole
// conversation with the keeper in the field on 2026-08-10 — five questions,
// answered in three languages — and it was reported as "no speech observed"
// because this function said nothing when it worked and the only evidence was on
// another machine. An event with no success line is invisible to everyone
// reading the log, and absence of a line then gets read as absence of the event.
// `addressed` is the difference between a question aimed at the keeper and two
// people talking to each other in a room the keeper happens to be standing in.
export function makeKeeperMirror({ broadcast, chats = [], log = console }) {
  return async function keeperHeard(text, addressed = true) {
    log.log(`keeper: the field ${addressed ? 'speaks' : 'is overheard'} — ${String(text).slice(0, 120)}`)
    if (!chats.length) {
      // The ANNOUNCE_CHATS lesson: an empty recipient list is not delivery.
      return log.error('keeper: NOBODY holds the keeper mirror — this was heard and told to no one')
    }
    const head = addressed ? 'someone speaks to the keeper' : 'overheard in the room'
    const foot = addressed ? '\n\n<i>/say &lt;line&gt; answers into the field</i>' : ''
    const results = await broadcast(chats, `:: <b>the field</b> — ${head}\n\n&gt; ${esc(text)}${foot}`)
      .catch((e) => { log.error('keeper: mirror:', e.message); return [] })
    if (!results.some(Boolean)) log.error('keeper: mirror reached nobody')
  }
}

// ── the mind's budget ─────────────────────────────────────────────────────
// Returns false rather than a message when it will not spend: silence is a
// state the keeper already knows how to be, and it is indistinguishable to a
// visitor from the keeper simply keeping its answer.
//
// THE FIELD WINS — the owner's decision, and a reserve rather than a
// preference. Someone standing in front of a camera mid-crossing must never
// find the keeper silent because a Telegram thread, or a busy room, spent the
// hour's budget. See LANE_CEILING in tunnel.mjs for who gives way first.
export function makeMindBudget({ perHour = 40, perDay = 200, now = () => Date.now() } = {}) {
  const hour = []
  let day = 0
  let dayStamp = 0
  return function mindBudget(lane = 'field', speaker = '') {
    const t = now()
    const d = Math.floor(t / 86_400_000)
    if (d !== dayStamp) { dayStamp = d; day = 0 }
    if (day >= perDay) return false
    while (hour.length && t - hour[0].t > 3_600_000) hour.shift()
    if (hour.length >= perHour) return false
    const bySpeaker = speaker ? hour.filter((e) => e.speaker === speaker).length : 0
    if (!laneAllowed(lane, hour.length, perHour, { spentBySpeaker: bySpeaker })) return false
    hour.push({ t, lane, speaker: String(speaker || '') }); day += 1
    return true
  }
}

// ── the keeper's mind ─────────────────────────────────────────────────────
// The keeper was present and silent from 2026-08-05 — it heard a visitor, said
// one fixed line, and carried the words to Telegram. With a mind it answers in
// its own voice, and the promise it makes ("the keeper will be told") is still
// kept by the mirror, which runs BEFORE this and does not depend on it.
//
// The path is the fenced one: /public on a relay, `--allowedTools ""`, no
// --add-dir, no repo. A visitor's words cannot become an instruction because
// there is nothing for an instruction to reach.
//   post(path, init) → Response   (di.bo's relayFetch, or plain fetch to one URL)
export function makeKeeperMind({ enabled = false, token = '', post, budget, timeoutMs = 9000, log = console }) {
  return async function keeperMind(text, lane = 'field', speaker = '') {
    if (!enabled || !token || !post) return null
    if (budget && !budget(lane, speaker)) { log.log(`keeper: mind — over budget (${lane}), keeping its answer`); return null }
    try {
      const r = await post('/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-relay-token': token },
        // `voice` is what selects the keeper's brief on the relay, and only the
        // caller can set it. The marker in the prompt is context for the model,
        // not a switch — it used to be the switch, which meant a stranger who
        // began a message with that literal string was answered as the keeper.
        body: JSON.stringify({ prompt: `[the keeper, in the field] ${text}`, who: 'keeper', voice: 'keeper' }),
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!r.ok) return null
      const j = await r.json().catch(() => ({}))
      const said = String(j.text || '').trim()
      return said || null
    } catch {
      // The relay host sleeps, reboots, or leaves the tailnet. A visitor
      // mid-rite must never see that; the keeper simply keeps its answer.
      return null
    }
  }
}

// ── the keeper, from inside a bot ─────────────────────────────────────────
// startKeeper with the Telegram seams wired the way bot.mjs wired them.
export function startKeeperForBot({ meshUrl, name = 'di.bo', chats = [], broadcast, mirror, mind, log = console }) {
  // Line ids already carried to the owner. Insertion-ordered and trimmed from the
  // front, so it is a window over the recent room rather than a leak that grows
  // for as long as the process lives.
  const heardLines = new Set()
  return startKeeper({
    meshUrl,
    name,
    onAsk: mirror,
    answer: mind,
    // A body nobody recognises claiming the room. Once per name, on the keeper's
    // own channel rather than the health one. If the robot is renamed, THIS is
    // the line that says so; without it a rename shows up as two keepers beating
    // at each other and nobody the wiser.
    onStranger: (heard) => {
      broadcast(chats, `:: <b>the keeper</b> — a body calling itself <b>${esc(heard)}</b> ` +
        `is beating on the mesh and I do not know it, so I am NOT giving it the room.\n\n` +
        `<i>if the robot was renamed, add it to KEEPER_YIELD_TO. if it was not, someone else is ` +
        `publishing on the keeper channel.</i>`)
    },
    // Dedupe on the hub's line id, which is stable across a replay and a live
    // send of the same line — a reconnect redelivering the tail of a room would
    // otherwise reach the owner as the same sentence twice.
    onTalk: ({ id, who, text, addressed }) => {
      if (id) {
        if (heardLines.has(id)) return
        heardLines.add(id)
        if (heardLines.size > 500) heardLines.delete(heardLines.values().next().value)
      }
      return mirror(`${who || 'someone'}: ${text}`, Boolean(addressed))
    },
    log,
  })
}

// The keeper's mouth, by hand. Owner only: this speaks in the piece's voice to
// whoever is standing at the field, and that voice is not a group chat's to
// borrow. Silent for everyone else.
export function sayCommand({ isRoot, keeper, line }) {
  if (!isRoot) return null
  const l = String(line || '').trim()
  if (!l) return 'say what? <code>/say the bridge holds.</code>'
  if (!keeper) return 'the keeper is not on the mesh — nothing to speak through.'
  return keeper.say(l) ? `spoken into the field —\n<i>${esc(l)}</i>` : 'the mesh is not here; nothing carried it.'
}

// ── the tunnel threads ────────────────────────────────────────────────────
// The greeting, approved by the owner on 2026-08-10, is doing three things on
// purpose and none of them are decoration:
//   1. it names their word back — continuity across the keeper's two bodies,
//      proven in the first line rather than claimed
//   2. it says the private side is private, before they have typed anything
//   3. it gives permission to leave. A tunnel that only opens one way is a
//      funnel, and the crossing is already complete; nothing here is owed.
export const tunnelGreeting = (word) =>
  `you crossed. you carried <b>${esc(word || '—')}</b>.\n\n` +
  'I keep the field, and I am also here — this side is only you and me.\n\n' +
  'the bridge is an exhibition being built. if the thing you carried is a work, ' +
  'or wants to be a room, tell me about it and I will make one.\n\n' +
  '<i>or say nothing. the core stands either way.</i>'

// A memory a person cannot see is a file about them they were never shown.
// What /mine and /forget say and what they do have to be the same thing.
// `/forget` deletes the tunnel record — the binding and every note taken through
// it — and nothing else. It does not reach the host bot's message log, so the
// honest fix is the sentence, not the deletion. Decided by the owner, 2026-08-20.
export const KEPT_ANYWAY =
  'what you have sent me stays in the record of messages this bot received. ' +
  '/forget does not reach that, and I would rather say so than let you think otherwise.'

//   say(chatId, html) → Promise   ownerId   secret (TUNNEL_SHARED_SECRET)
//   store (TunnelStore)   readField() → stones   whoOf(msg) → label
export function makeTunnelThreads({ say, ownerId = '', secret = '', store, readField, whoOf = (m) => String(m.from?.id || 'someone'), log = console }) {
  // Returns true when the arrival was handled AS a tunnel arrival. False means
  // "this was not a traveller" and the caller shows the ordinary door — the one
  // outcome that is never allowed is silence, because this person was invited.
  async function handleTunnelStart(msg, token) {
    // Until the secret exists on both sides the tunnel is not open, and a
    // /start payload is just a payload — deep links to a bot are used for all
    // sorts of things. Without this, every one of them would wake the owner.
    if (!secret) return false
    const read = readToken(token, secret)
    const who = whoOf(msg)
    if (!read.ok) {
      log.log(`keeper: tunnel — token refused (${read.reason}) from ${who}`)
      // A bad token is not an accusation. They get the ordinary door, and the
      // owner hears that someone came down the tunnel and it did not open.
      if (ownerId && read.reason !== 'malformed') {
        await say(ownerId, `<b>[tunnel] ${esc(who)}</b> — a link arrived that I could not open (${esc(read.reason)})`).catch(() => {})
      }
      return false
    }

    // The crossing has to still stand. Someone can unmake their own core, and
    // greeting a person by a word they deliberately withdrew would be worse than
    // not greeting them at all.
    const stones = await readField().catch(() => null)
    if (!stones) {
      log.error('keeper: tunnel — field unreadable, arrival deferred to the ordinary door')
      return false
    }
    const stone = stones.find((s) => s.id === read.insc)
    if (!stone) {
      log.log(`keeper: tunnel — ${read.insc} is no longer in the field`)
      return false
    }
    const [, word] = String(stone.data || '').split('·').map((x) => x.trim())

    const result = await bind(store, { insc: read.insc, who: stone.data, tgId: msg.from?.id })
    if (!result.ok) {
      // The link travelled. The person now holding it is a stranger, and the
      // owner needs to know WHICH crossing was claimed.
      log.log(`keeper: tunnel — ${read.insc} is already bound; ${who} arrived on a forwarded link`)
      if (ownerId) {
        await say(ownerId, `<b>[tunnel] ${esc(who)}</b> arrived on a link for <b>${esc(result.record?.who || read.insc)}</b>, which is already bound to someone else.`).catch(() => {})
      }
      return false
    }

    // A second arrival on your own link is just you, opening the app again.
    if (!result.first) {
      await say(msg.chat.id, `you are already here, ${esc(word || 'friend')}.`).catch(() => {})
      return true
    }

    await say(msg.chat.id, tunnelGreeting(word))
    if (ownerId) {
      await say(ownerId, `<b>[tunnel] ${esc(who)}</b> came through — <b>${esc(stone.data || read.insc)}</b>`).catch(() => {})
    }
    log.log(`keeper: tunnel — ${who} bound to ${read.insc}`)
    return true
  }

  async function handleMine(msg) {
    const record = await store.byTelegram(msg.from?.id)
    // "I hold nothing about you" was the same untruth from the other side: no
    // crossing bound here is not the same as nothing held.
    if (!record) return say(msg.chat.id, `no crossing of yours is bound to this chat.\n\n<i>${KEPT_ANYWAY}</i>`)
    const lines = [
      `your crossing: <b>${esc(record.who || record.insc)}</b>`,
      `here since: ${new Date(record.bound_at).toISOString().slice(0, 10)}`,
      record.notes?.length ? `\nwhat you told me:\n${record.notes.map((n) => `· ${esc(n.text || '')}`).join('\n')}` : '\nyou have told me nothing yet.',
      '\n<i>/forget deletes everything above.</i>',
    ]
    return say(msg.chat.id, lines.join('\n'))
  }

  async function handleForget(msg) {
    const record = await store.byTelegram(msg.from?.id)
    if (!record) return say(msg.chat.id, 'I hold nothing about you.')
    await store.forget(record.insc)
    log.log(`keeper: tunnel — forgot ${record.insc} at their request`)
    // Say plainly what cannot be deleted. The core is theirs and public, and
    // implying otherwise would be a promise the keeper cannot keep.
    return say(msg.chat.id,
      'gone — your crossing is unbound, and everything you told the keeper through it is deleted.\n\n' +
      `your core still stands in the field, because you placed it there yourself. ` +
      `only the keeper can lift it; ask and it will be lifted.\n\n` +
      `<i>${KEPT_ANYWAY}</i>`)
  }

  // ONE KEEPER, TWO BODIES. If this person came through the tunnel, the mind
  // behind this thread is the same mind that keeps the field, and it is told who
  // it is speaking to. The relay is stateless, so the connectedness lives in what
  // the host composes.
  const travellerFor = (tgId) => store.byTelegram(tgId).catch(() => null)
  const travellerPrompt = (traveller, text) =>
    `[the keeper, in a private thread with ${traveller.who}, who crossed the bridge]\n${text}`
  // What they told the keeper is kept, so it does not have to be told twice.
  // Capped and dated; docs/the-tunnel.md holds the retention rule.
  async function keepNote(traveller, text, now = Date.now()) {
    traveller.notes = [...(traveller.notes || []), { at: now, text }].slice(-40)
    traveller.last_at = now
    await store.write(traveller).catch((e) => log.error('keeper: tunnel write:', e.message))
  }

  return { handleTunnelStart, handleMine, handleForget, travellerFor, travellerPrompt, keepNote }
}
