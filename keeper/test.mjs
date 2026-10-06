// The keeper's tests — moved with the code from di-bo's test.mjs (master 91268bd)
// on 2026-10-07, plus the factories the move made testable on their own.
//
//   node keeper/test.mjs                 everything, including two live probes
//                                        against the prod mesh
//   KEEPER_TEST_OFFLINE=1 node keeper/test.mjs   skips the two live probes,
//                                        and says so
//
// Zero dependencies, Node 22+. Exit 1 on any failure.
import { existsSync, readFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const OFFLINE = process.env.KEEPER_TEST_OFFLINE === '1'
const MESH = process.env.MESH_URL || 'wss://di-studio.xyz/serverXR/mesh'

let failed = 0
let passed = 0
const ok = (name, cond, detail = '') => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${detail ? ' — ' + detail : ''}`)
  if (cond) passed++
  else failed++
}
const quiet = { log() {}, error() {} }

// The keeper's rules, driven on a fake clock — no mesh, no robot, no model.
// The handover is the one that matters: two keepers answering the same visitor
// is worse than none, and the field prints whichever line arrived last.
console.log('\nthe keeper — standing down for di.jet')
{
  const { makeKeeper, AWAKE_MS, ASK_MIN_GAP_MS } = await import('./keeper.mjs')
  let clock = 1_000_000
  const k = makeKeeper({ name: 'di.bo', now: () => clock })

  ok('keeps while the room is empty', k.shouldBeat() === true)
  ok('answers while the room is empty', Boolean(k.takeAsk({ text: 'barev' }).text))
  k.doneAnswering()

  clock += ASK_MIN_GAP_MS + 1
  k.heardKeeper({ name: 'di.jet' })
  ok('names who took the room', k.standingDownTo() === 'di.jet')
  ok('stops keeping when di.jet is on the mesh', k.shouldBeat() === false)
  ok('refuses the visitor to di.jet', k.takeAsk({ text: 'barev' }).skip === 'di.jet is keeping')

  clock += AWAKE_MS + 1
  ok('keeps again once di.jet goes quiet', k.shouldBeat() === true)
  ok('and answers again', Boolean(k.takeAsk({ text: 'barev' }).text))

  // Still mid-answer: a held return key must not start a second generation.
  ok('one answer at a time', k.takeAsk({ text: 'again' }).skip === 'busy')
  k.doneAnswering()
  ok('and not two in the same breath', k.takeAsk({ text: 'again' }).skip === 'too fast')
  clock += ASK_MIN_GAP_MS + 1
  ok('but the next breath is fine', Boolean(k.takeAsk({ text: 'again' }).text))
  k.doneAnswering()

  clock += ASK_MIN_GAP_MS + 1
  ok('empty words are not an ask', k.takeAsk({ text: '   ' }).skip === 'empty')
  clock += ASK_MIN_GAP_MS + 1
  ok('trims a shouted paragraph', k.takeAsk({ text: 'x'.repeat(500) }).text.length === 120)
  k.doneAnswering()

  // A second di.bo (a stale process on the old box) must not silence this one
  // forever — only a DIFFERENT keeper counts as someone else in the room.
  const solo = makeKeeper({ name: 'di.bo', now: () => clock })
  solo.heardKeeper({ name: 'di.bo' })
  ok('its own name is not a handover', solo.shouldBeat() === true)
  solo.heardKeeper({})
  ok('a nameless heartbeat is not a handover', solo.shouldBeat() === true)
}

// Until 2026-08-20 heardKeeper() yielded to any name at all. On an open mesh
// that is an off switch for the field's keeper, and standing down also made the
// health check report the keeper GREEN — the light on while nobody keeps.
console.log('\nthe keeper — who it will hand the room to')
{
  const { makeKeeper, YIELD_TO } = await import('./keeper.mjs')
  let t = 1_000_000
  const strangers = []
  const k = makeKeeper({ name: 'di.bo', now: () => t, onStranger: (n) => strangers.push(n) })

  ok('both of the robot\'s names are on the list', YIELD_TO.includes('jet.di') && YIELD_TO.includes('di.jet'),
     YIELD_TO.join(','))

  ok('a stranger does not get the room', k.heardKeeper({ name: 'nobody' }) === false)
  ok('and di.bo keeps beating', k.shouldBeat() === true)
  ok('and nothing is standing down to it', k.standingDownTo() === '')
  ok('and a visitor is still answered', !k.takeAsk({ text: 'barev' }).skip)
  k.doneAnswering()
  ok('the stranger is named once', strangers.length === 1 && strangers[0] === 'nobody')
  for (let i = 0; i < 5; i++) { t += 5000; k.heardKeeper({ name: 'nobody' }) }
  ok('and never named again, however long it beats', strangers.length === 1, `${strangers.length} report(s)`)

  // The name the protocol doc uses, and the name the robot's own agent uses.
  // Whichever body turns up, di.bo gets out of its way.
  for (const robot of ['jet.di', 'di.jet']) {
    const r = makeKeeper({ name: 'di.bo', now: () => t })
    ok(`di.bo stands down for ${robot}`, r.heardKeeper({ name: robot }) === true && r.shouldBeat() === false)
  }
  ok('an empty name is not a keeper', k.heardKeeper({ name: '' }) === false)
  ok('and neither is di.bo hearing itself', k.heardKeeper({ name: 'di.bo' }) === false)
}

// The socket race: a closing socket used to null its live successor, which left
// the keeper publishing into nothing while an orphan sat in the room.
console.log('\nthe keeper — a closing socket does not take its successor with it')
{
  const src = readFileSync(new URL('./keeper.mjs', import.meta.url), 'utf8')
  const conn = src.slice(src.indexOf('const connect = ()'), src.indexOf('  }, HEARTBEAT_MS)'))
  for (const h of ['onopen', 'onclose', 'onmessage']) {
    const bound = new RegExp(`dialed\\.${h} = `).test(conn)
    ok(`${h} is bound to its own socket`, bound, bound ? '' : 'assigned to the live ref again')
  }
  ok('and onclose checks it is still the live one',
     /dialed\.onclose = \(\) => \{\s*\n\s*if \(ws !== dialed\) return/.test(conn))
}

console.log('\nthe keeper — its one line')
{
  const { KEPT_LINE, MAX_SAY_CHARS } = await import('./keeper.mjs')
  console.log('   ' + KEPT_LINE)
  ok('one line, no newlines', !KEPT_LINE.includes('\n'))
  ok('fits the keeper window', KEPT_LINE.length <= MAX_SAY_CHARS)
  ok('in register — no error text at a visitor', !/error|failed|null|undefined|config/i.test(KEPT_LINE))
}

// The silent-socket bug, live against the real hub: a mesh connection can stop
// carrying without ever closing, and the field then shows a keeper that is not
// there. The hub's pong is the only proof the pipe still works.
console.log('\nthe keeper — the mesh pipe answers when spoken to')
{
  const { KEEPER_ROOM, DEAF_MS, HEARTBEAT_MS, DIAL_MS } = await import('./keeper.mjs')
  ok('the watchdog waits longer than a heartbeat', DEAF_MS > HEARTBEAT_MS * 2)
  // The failure that actually happened: no socket at all for 22 hours, because
  // a dial that never resolved was never abandoned and an unopened socket was
  // never redialled. Both deadlines have to exist, and both have to be longer
  // than one heartbeat and shorter than a visitor's patience.
  ok('a dial that never answers is abandoned', DIAL_MS > HEARTBEAT_MS && DIAL_MS <= 30000)
  ok('being off the mesh is itself a redial trigger', DEAF_MS > HEARTBEAT_MS)
  if (OFFLINE) {
    console.log('  skip  live: the hub pong (KEEPER_TEST_OFFLINE=1) — nothing proved')
  } else {
    const url = new URL(MESH)
    url.searchParams.set('room', `${KEEPER_ROOM}-selftest`)
    url.searchParams.set('node', 'test-' + Math.random().toString(36).slice(2, 8))
    const pong = await new Promise((resolve) => {
      let ws
      const done = (v) => { try { ws.close() } catch {} ; resolve(v) }
      const timer = setTimeout(() => done(false), 10000)
      try { ws = new WebSocket(url.toString()) } catch { clearTimeout(timer); return resolve(false) }
      ws.onopen = () => ws.send(JSON.stringify({ type: 'control', cmd: 'ping', sentAt: Date.now() }))
      ws.onmessage = (ev) => {
        let m; try { m = JSON.parse(ev.data) } catch { return }
        if (m.type === 'control:pong') { clearTimeout(timer); done(true) }
      }
      ws.onerror = () => { clearTimeout(timer); done(false) }
    })
    ok(`live: the hub pongs — a dead pipe is detectable (${MESH})`, pong)
  }
}

// ── which crossings are not people ────────────────────────────────────────
// Both directions are tested, and the second matters more: a mash that slips
// through is annoying, a real crossing that gets swallowed is invisible.
console.log('\nthe junk filter')
{
  const { junkReason } = await import('./crossings.mjs')
  const blocked = [
    ['—', 'գևորգ', 'end-probe'],           // window.__end() writes the dash itself
    ['__probe', '__probe', 'reserved prefix'],
    ['66666665446@@)(((', '))))', 'no letters'],
    // Doubled AND mashed — a hand on a keyboard, written twice.
    ['asdfgh', 'asdfgh', 'doubled keyboard run'],
    ['aaaa', 'aaaa', 'doubled character repeat'],
    ['lkjhgfdsa', 'lkjhgfdsa', 'doubled reverse run'],
    ['qwertyuiopas', 'qwertyuiopas', 'doubled and far too long for a name'],
  ]
  for (const [n, w, why] of blocked) ok(`blocked: ${n} · ${w}`, junkReason(n, w) !== null, why)

  // Every one of these is a crossing that must survive the filter.
  const kept = [
    ['գևորգ', 'կամուրջ'],      // Armenian, the most-carried word
    ['esem', 'barev'],
    ['Hey', 'its me'],
    ['22194', 'Blob'],          // an all-digit NAME is still a person if the word has letters
    ['Ki', 'diamond'],
    ['gugugu', 'bububu'],       // deliberate: indistinguishable from a short real word
    // The shape that caused this rule to be retuned: it reached PROD and was
    // swallowed, because 'name equals word' used to be enough on its own.
    // Writing one short word twice is something a person does.
    ['yuyu', 'yuyu'],
    ['xer', 'xer'],
    ['ha', 'ha'],
    ['ՊԱՀ', 'ՊԱՀ'],           // and the same in Armenian
  ]
  for (const [n, w] of kept) ok(`kept: ${n} · ${w}`, junkReason(n, w) === null)

  // No phonotactic rule may creep back in — the field is Armenian-first and an
  // English-shaped "looks like a word" test would eat these.
  ok('a non-Latin script is never junk on shape alone', junkReason('ՊԱՀԱՊԱՆ', 'ՆԵՐԿԱ') === null)
  // Repeats stay a design question, not a filter decision.
  ok('a repeat crossing is not junk', junkReason('գևորգ', 'կամուրջ') === null)

  // The historical field is the real fixture: 16 of 49 are provably junk. It is
  // a backup on the owner's machine, never in this public repo.
  const scene = process.env.FIELD_FIXTURE || join(homedir(), 'di-backups/field/br-id-ge-scene-20260809.json')
  if (existsSync(scene)) {
    const raw = JSON.parse(readFileSync(scene, 'utf8'))
    const objs = (raw.objects || raw.scene?.objects || []).filter((o) => String(o.id || '').startsWith('insc-'))
    ok('the fixture actually loaded', objs.length > 0, `${objs.length} stones`)
    const n = objs.filter((s) => {
      const [a, b] = String(s.data || '').split('·').map((x) => x.trim())
      return junkReason(a || '', b || '') !== null
    }).length
    // Was 17 before the rule was softened: `xer · xer` is now announced, and
    // that is the point of the change. The `__probe` doublings are still caught.
    ok('the 2026-08-09 field: 16 of 49 caught', n === 16, `caught ${n} of ${objs.length}`)
  } else {
    console.log('  skip  historical field fixture absent — nothing proved')
  }
}

// ── the announcer ─────────────────────────────────────────────────────────
// A crossing is heard once or not at all — there is no backlog to replay. On
// prod the recipient list was empty, delivery to nobody counted as delivered,
// and seven real crossings were marked seen and lost.
console.log('\nthe crossings — every new core spoken once, and never lost')
{
  const { makeCrossingPoller, landed, crossingText } = await import('./crossings.mjs')
  ok('nobody to tell counts as delivered', landed([]) === true)
  ok('one landing is enough', landed([undefined, { message_id: 1 }]) === true)
  ok('all failed is not delivered', landed([undefined, undefined]) === false)

  const stone = (id, data) => ({ id: `insc-${id}`, data })
  let field = [stone('a', 'Ani · river')]
  const state = { seen: [] }
  const said = []
  let deliver = true
  const poll = makeCrossingPoller({
    broadcast: async (chats, text) => { said.push({ chats, text }); return chats.map(() => (deliver ? { message_id: 1 } : undefined)) },
    getState: () => state, save: async () => {},
    announceChats: ['-100777'], alertChats: ['42'], read: async () => field, log: quiet,
  })
  await poll()
  ok('a first run adopts the field rather than shouting it', state.seen.length === 1 && !said.some((s) => /crossed the bridge/.test(s.text)))
  ok('and says so, to the alert chats', said.length === 1 && said[0].chats[0] === '42' && /adopted/.test(said[0].text))

  said.length = 0
  field = [...field, stone('b', 'Aram · stone'), stone('c', 'asdfgh · asdfgh')]
  await poll()
  ok('a new crossing is announced to the room', said.length === 1 && said[0].chats[0] === '-100777' && /Aram/.test(said[0].text))
  ok('with its own place in the field', /core 2 in the field/.test(said[0].text))
  ok('a mash is not announced, but it is seen', !said.some((s) => /asdfgh/.test(s.text)) && state.seen.includes('insc-c'))

  said.length = 0
  deliver = false
  field = [...field, stone('d', 'Lilit · light')]
  await poll()
  ok('a crossing nobody heard is NOT marked seen', !state.seen.includes('insc-d'))
  deliver = true
  said.length = 0
  await poll()
  ok('and is spoken on the next poll', said.length === 1 && /Lilit/.test(said[0].text) && state.seen.includes('insc-d'))
  ok('the name is escaped', /&lt;b&gt;/.test(crossingText({ name: '<b>', word: 'x', nth: 1, fieldUrl: '' })))
}

// ── the keeper's mind ─────────────────────────────────────────────────────
// The mind is allowed to fail. What is NOT allowed is a visitor seeing that it
// failed, or the owner never hearing the question because a laptop was asleep.
console.log('\nthe keeper — its mind, and what happens without one')
{
  const { KEPT_LINE } = await import('./keeper.mjs')
  // startKeeper needs a mesh it cannot reach here; exercise the seam directly
  // by replaying what the ask handler does with each answer() outcome.
  const said = []
  const publish = (ch, p) => said.push({ ch, ...p })
  const run = async (answer, onAsk) => {
    said.length = 0
    onAsk('barev')                                    // always first, always
    try {
      const t = String((await answer('barev')) || '').trim()
      if (t) publish('keeper:say', { text: t.slice(0, 200), voice: 'ai' })
      else publish('keeper:say', { text: KEPT_LINE, voice: 'keeper' })
    } catch { publish('keeper:say', { text: KEPT_LINE, voice: 'keeper' }) }
  }

  let told = 0
  await run(async () => 'the field keeps what you left in it', () => { told++ })
  ok('a mind that answers speaks as the ai', said[0].voice === 'ai')
  ok('and the owner still heard the question', told === 1)

  await run(async () => null, () => { told++ })
  ok('no mind → the line it always said', said[0].text === KEPT_LINE)
  // A fallback labelled 'ai' would claim a mind that had just failed to answer.
  ok('and it is credited to the keeper, not the ai', said[0].voice === 'keeper')

  await run(async () => { throw new Error('mac asleep') }, () => { told++ })
  ok('a mind that throws is still silence, not an error', said[0].text === KEPT_LINE)
  ok('the visitor never sees the failure', !/error|mac|asleep/i.test(said[0].text))

  ok('every ask reached telegram regardless of the mind', told === 3)

  await run(async () => 'x'.repeat(500), () => {})
  ok('an over-long answer is cut, not sent whole', said[0].text.length === 200)
}

console.log('\nthe keeper — the mind on the relay (telegram.mjs)')
{
  const { makeKeeperMind, makeMindBudget } = await import('./telegram.mjs')
  const calls = []
  const post = (status, body) => async (path, init) => { calls.push({ path, body: JSON.parse(init.body) }); return { ok: status < 400, status, json: async () => body } }
  ok('off unless enabled', await makeKeeperMind({ enabled: false, token: 't', post: post(200, { text: 'x' }) })('hi') === null)
  ok('off without a token', await makeKeeperMind({ enabled: true, token: '', post: post(200, { text: 'x' }) })('hi') === null)
  const said = await makeKeeperMind({ enabled: true, token: 't', post: post(200, { text: 'the field holds' }) })('hi')
  ok('an answer comes back whole', said === 'the field holds')
  ok('it asks /public, as the keeper, in the keeper\'s voice',
     calls[0].path === '/public' && calls[0].body.who === 'keeper' && calls[0].body.voice === 'keeper')
  // di.bo's relay now refuses a voice it does not hold (400). Refused is silence,
  // and silence is KEPT_LINE — never the platform's voice in the artwork's mouth.
  ok('a relay that refuses the voice is silence', await makeKeeperMind({ enabled: true, token: 't', post: post(400, { error: 'unknown voice' }) })('hi') === null)
  ok('an unreachable relay is silence', await makeKeeperMind({ enabled: true, token: 't', post: async () => { throw new Error('down') } })('hi') === null)
  const none = makeMindBudget({ perHour: 1 })
  ok('over budget is silence, and no call is made',
     none('field') === true && await makeKeeperMind({ enabled: true, token: 't', post: post(200, { text: 'x' }), budget: none, log: quiet })('hi') === null)

  // THE FIELD WINS — the ladder, through the real budget.
  const b = makeMindBudget({ perHour: 40, perDay: 200 })
  let chat = 0
  for (let i = 0; i < 40; i++) if (b('chat', `s${i}`)) chat++
  ok('a Telegram group gets its rung of the hour and no more', chat === 14, `${chat} of 40`)
  let field = 0
  for (let i = 0; i < 40; i++) if (b('field', `f${i}`)) field++
  ok('and the field may still spend the rest', field === 26, `${field}`)
  const one = makeMindBudget({ perHour: 40 })
  let mine = 0
  for (let i = 0; i < 20; i++) if (one('room', 'same-voice')) mine++
  ok('no single voice takes more than its quarter', mine === 10, `${mine}`)
}

// ── being addressed in the room ───────────────────────────────────────────
// The room is one conversation. An aside to the keeper is still something the
// room heard, so it rides the same channel with a token on the front.
console.log('\nthe room — who the keeper answers')
{
  const { addressed, stripAddress, TALK_CHANNEL, ASK_CHANNEL } = await import('./keeper.mjs')
  // Asserting a constant here proves only that it has not changed by accident.
  // It cannot prove the FIELD publishes on it — that is contract.mjs's job.
  ok('the room channel is the one the field publishes', TALK_CHANNEL === 'talk')
  ok('the uncrossed have their own way in', ASK_CHANNEL === 'keeper:ask')

  // These are the forms the FIELD actually composes. The first matcher wanted
  // 'ՊԱՀԱՊԱՆ→' exactly while the UI emitted 'պահապան ' — different codepoints,
  // so it could never fire, and the keeper sat silent through a real crossing.
  for (const t of [
    'պահապան what is a core?',        // what field.html actually sends
    'ՊԱՀԱՊԱՆ→ what is a core?',
    'ՊԱՀԱՊԱՆ what is a core?',
    '  պահապան → hi',
    'keeper, who are you',
    '@keeper hello',
    'di.bo hello',
    'Պահապան barev',                  // mixed case, as someone would type it
  ]) ok(`addressed: ${t}`, addressed(t) === true)

  // Start-anchored, and the alias has to END. Otherwise the keeper answers
  // people talking about it, and answers 'keepers of the field' as well.
  for (const t of [
    'barev, anyone here?',
    'I asked պահապան earlier',
    'keepers of the field',
    'di.bomb',
    'the keeper is quiet tonight',
  ]) ok(`not addressed: ${t}`, addressed(t) === false)

  ok('the token comes off, whatever form it took',
    stripAddress('պահապան what is a core?') === 'what is a core?'
    && stripAddress('ՊԱՀԱՊԱՆ→  who keeps this?') === 'who keeps this?'
    && stripAddress('@keeper   hello') === 'hello')
  ok('an empty address is not a question', stripAddress('պահապան   ') === '')
}

// ── the cut ───────────────────────────────────────────────────────────────
// The first answer the room gave in public ended "...and then it stays he".
console.log('\nthe room — where an answer stops')
{
  const { fit, MAX_SAY_CHARS } = await import('./keeper.mjs')
  const long = 'A core is what is left after someone crosses, a small permanent shape made from the two answers they gave, which nobody chooses and which simply takes the form the crossing left behind, and then it stays here with the others'
  const cut = fit(long)
  ok('a long answer is cut to the cap', cut.length <= MAX_SAY_CHARS)
  ok('and it is marked as stopped', cut.endsWith('…'))
  ok('the last word is whole', long.startsWith(cut.slice(0, -1)) && /^\s|^$/.test(long.slice(cut.length - 1)))
  ok('a short answer is left alone', fit('the keeper hears you.') === 'the keeper hears you.')
  ok('an answer exactly at the cap is not marked', fit('x'.repeat(MAX_SAY_CHARS)).endsWith('…') === false)
  ok('a spaceless wall still gets cut', fit('x'.repeat(400)).length <= MAX_SAY_CHARS)
  ok('nothing in, nothing out', fit('') === '' && fit(null) === '')
  ok('no dangling punctuation before the mark', /[\s,;:—-]…$/.test(fit(`${'a b '.repeat(60)}word, tail`)) === false)
}

// docs/the-tunnel.md is the source; this is the code tested against it.
console.log('\nthe tunnel — the token')
{
  const { mintToken, readToken, TOKEN_CHARS } = await import('./tunnel.mjs')
  const SECRET = 'a-test-secret'
  const INSC = 'insc-a012122a-cbfa-4155-84e1-69d0a532c251'
  const t = mintToken(INSC, SECRET)

  ok('a token is 50 chars — inside Telegram\'s 64', t.length === TOKEN_CHARS, `${t.length}`)
  // Telegram's ?start= payload permits A-Za-z0-9_- and nothing else.
  ok('and uses only the alphabet Telegram accepts', /^[A-Za-z0-9_-]+$/.test(t))
  ok('it round-trips to the crossing it was minted for', readToken(t, SECRET).insc === INSC)

  ok('a token signed with another secret is refused', readToken(mintToken(INSC, 'someone-elses-secret'), SECRET).ok === false)
  // The whole point of not using the inscription id: the field is public, so
  // every id is public. Forging must require the secret.
  const forged = Buffer.concat([
    Buffer.from([1]), Buffer.from(INSC.replace(/^insc-|-/g, ''), 'hex'),
    Buffer.alloc(4, 0xff), Buffer.alloc(16),
  ]).toString('base64url')
  ok('a hand-built token with a public id is refused', readToken(forged, SECRET).ok === false)

  const old = mintToken(INSC, SECRET, { now: Date.now() - 25 * 3600 * 1000 })
  ok('an expired token is refused', readToken(old, SECRET).reason === 'expired')
  // Mutate inside the signature, not at either end: the FIRST char is always
  // 'A' (version byte 0x01 → six zero bits).
  const tampered = t.slice(0, 30) + (t[30] === 'Z' ? 'Y' : 'Z') + t.slice(31)
  let junkTaken = ''
  for (const junk of ['', 'x', 'not a token', '.'.repeat(50), 'A'.repeat(64), tampered]) {
    if (readToken(junk, SECRET).ok) { junkTaken = junk; break }
  }
  ok('junk of every shape is refused without throwing', junkTaken === '', junkTaken.slice(0, 12))

  // 37 bytes is 296 bits where 50 base64url chars carry 300, so the final char
  // has two slack bits; a token must still have exactly one spelling.
  const slack = t.slice(0, -1) + (t.endsWith('A') ? 'B' : 'A')
  ok('a re-spelled token is refused, so one token has one string', slack === t || readToken(slack, SECRET).ok === false, slack)
  ok('no secret configured refuses rather than accepts', readToken(t, '').ok === false)

  // THE VECTOR. serverXR mints and the bot verifies; this asserts against a file
  // both implementations read, so a change on either side fails HERE.
  const v = JSON.parse(readFileSync(new URL('./docs/tunnel-vector.json', import.meta.url), 'utf8'))
  const at = (v.vector.exp_unix_minutes - 1440) * 60000
  const minted = mintToken(v.vector.inscription, v.vector.secret, { now: at })
  ok('the shared vector reproduces byte for byte', minted === v.vector.token, minted)
  ok('and verifies back to its crossing', readToken(v.vector.token, v.vector.secret, { now: at }).insc === v.vector.inscription)
}

console.log('\nthe tunnel — binding and memory')
{
  const { TunnelStore, bind, laneAllowed, TUNNEL_MIND_SHARE, LANE_CEILING, SPEAKER_SHARE } = await import('./tunnel.mjs')
  const { mkdtemp, rm, readFile } = await import('node:fs/promises')
  const dir = await mkdtemp(join(tmpdir(), 'keeper-tunnel-'))
  const store = new TunnelStore(dir)
  const INSC = 'insc-a012122a-cbfa-4155-84e1-69d0a532c251'

  const first = await bind(store, { insc: INSC, who: 'A · word', tgId: 111 })
  ok('the first arrival binds', first.ok === true && first.first === true)
  const again = await bind(store, { insc: INSC, who: 'A · word', tgId: 111 })
  ok('the same person arriving twice is not a new binding', again.ok === true && again.first === false)
  // The link travelled. Whoever is holding it now is a stranger.
  const stolen = await bind(store, { insc: INSC, who: 'A · word', tgId: 222 })
  ok('a second account on the same link is refused', stolen.ok === false && stolen.reason === 'already bound')

  ok('the record is found by telegram id', (await store.byTelegram(111))?.insc === INSC)
  ok('and an unknown account holds nothing', (await store.byTelegram(999)) === null)
  const onDisk = JSON.parse(await readFile(join(dir, `${INSC}.json`), 'utf8'))
  ok('the record is one file per crossing', onDisk.insc === INSC && onDisk.tg_id === '111')
  ok('forget removes it', (await store.forget(INSC)) === true && (await store.read(INSC)) === null)
  ok('and forgetting twice is not an error', (await store.forget(INSC)) === false)

  // THE FIELD WINS. A preference would be a comment; this is the number.
  ok('the tunnel may spend its share', laneAllowed('tunnel', 0, 40) === true)
  ok('the tunnel is cut off at its share', laneAllowed('tunnel', 20, 40) === false)
  ok('the field is never cut off by the tunnel\'s share', laneAllowed('field', 39, 40) === true)
  ok('the share leaves the field a real reserve', TUNNEL_MIND_SHARE < 1)
  // The ladder, asserted as an ORDER: the numbers are a judgement call and may
  // be retuned, but the day `room` outlives `field` is the day someone
  // mid-crossing meets silence because a room was chatty.
  ok('the rite is on no rung — it is what the others yield to', LANE_CEILING.field === undefined)
  ok('a Telegram group gives way before anything at the work', LANE_CEILING.chat < LANE_CEILING.tunnel)
  ok('and it is cut off with most of the hour still standing', laneAllowed('chat', 14, 40) === false)
  ok('while the field is not', laneAllowed('field', 14, 40) === true)
  ok('the tunnel gives way first of the ones at the work', LANE_CEILING.tunnel < LANE_CEILING.ask)
  ok('then the uncrossed, then the room', LANE_CEILING.ask < LANE_CEILING.room)
  ok('and the room still gives way to the rite', LANE_CEILING.room < 1)
  ok('a chatty room is cut off with budget still standing', laneAllowed('room', 34, 40) === false)
  ok('and the rite may still spend it', laneAllowed('field', 34, 40) === true)
  ok('one voice may take its quarter', laneAllowed('room', 0, 40, { spentBySpeaker: 9 }) === true)
  ok('but no more than its quarter', laneAllowed('room', 0, 40, { spentBySpeaker: 10 }) === false)
  ok('a second voice in the same hour is unaffected', laneAllowed('room', 10, 40, { spentBySpeaker: 0 }) === true)
  ok('the cap never floors to zero on a small budget', laneAllowed('room', 0, 2, { spentBySpeaker: 0 }) === true)
  ok('the speaker cap leaves room for four voices', SPEAKER_SHARE <= 0.25)

  await rm(dir, { recursive: true, force: true })
}

// The Telegram side of the tunnel, with a fake `say` and a fake field — what
// handleTunnelStart did inside di.bo, now a factory any bot can host.
console.log('\nthe tunnel — the threads (telegram.mjs)')
{
  const { mintToken, TunnelStore } = await import('./tunnel.mjs')
  const { makeTunnelThreads, KEPT_ANYWAY, tunnelGreeting } = await import('./telegram.mjs')
  const { mkdtemp, rm } = await import('node:fs/promises')
  const dir = await mkdtemp(join(tmpdir(), 'keeper-threads-'))
  const store = new TunnelStore(dir)
  const SECRET = 'threads-test-secret'
  const INSC = 'insc-a012122a-cbfa-4155-84e1-69d0a532c251'
  const sent = []
  const say = async (chat, text) => { sent.push({ chat: String(chat), text }); return { message_id: sent.length } }
  const field = [{ id: INSC, data: 'A · river' }]
  const T = makeTunnelThreads({ say, ownerId: '900000001', secret: SECRET, store, readField: async () => field, log: quiet })
  const dm = (id) => ({ chat: { id, type: 'private' }, from: { id, username: `u${id}` } })
  const good = mintToken(INSC, SECRET)

  const shut = makeTunnelThreads({ say, ownerId: '900000001', secret: '', store, readField: async () => field, log: quiet })
  ok('with no secret the tunnel is shut, and nobody is woken', await shut.handleTunnelStart(dm(5), good) === false && sent.length === 0)

  ok('a real token for a standing crossing is an arrival', await T.handleTunnelStart(dm(111), good) === true)
  ok('the traveller is greeted by their own word', sent.some((s) => s.chat === '111' && s.text === tunnelGreeting('river')))
  ok('and the owner is told who came through', sent.some((s) => s.chat === '900000001' && /came through/.test(s.text)))
  sent.length = 0
  ok('the same person again is just them, back', await T.handleTunnelStart(dm(111), good) === true && /already here/.test(sent[0]?.text || ''))
  sent.length = 0
  ok('a forwarded link is not an arrival', await T.handleTunnelStart(dm(222), good) === false)
  ok('and the owner hears which crossing was claimed', sent.some((s) => s.chat === '900000001' && /already bound/.test(s.text)))
  ok('a token for a crossing that was unmade falls through',
     await makeTunnelThreads({ say, secret: SECRET, store, readField: async () => [], log: quiet }).handleTunnelStart(dm(333), mintToken('insc-00000000-0000-4000-8000-000000000000', SECRET)) === false)

  const traveller = await T.travellerFor(111)
  ok('the traveller is found for a question', traveller?.insc === INSC)
  ok('and the mind is told who it is speaking to', /private thread with A · river/.test(T.travellerPrompt(traveller, 'hello')))
  for (let i = 0; i < 45; i++) await T.keepNote(traveller, `note ${i}`)
  ok('what they told the keeper is kept, capped at 40', (await store.read(INSC)).notes.length === 40)

  sent.length = 0
  await T.handleMine(dm(111))
  ok('/mine shows the crossing and the notes', /your crossing/.test(sent[0]?.text || '') && /note 44/.test(sent[0]?.text || ''))
  sent.length = 0
  await T.handleMine(dm(999))
  ok('/mine for someone with no crossing says what IS still held', sent[0]?.text.includes(KEPT_ANYWAY))
  sent.length = 0
  await T.handleForget(dm(111))
  ok('/forget deletes the record', (await store.read(INSC)) === null)
  ok('and says what it cannot delete', sent[0]?.text.includes(KEPT_ANYWAY) && /core still stands/.test(sent[0]?.text))
  await rm(dir, { recursive: true, force: true })
}

console.log('\nthe mirror and the mouth (telegram.mjs)')
{
  const { makeKeeperMirror, sayCommand } = await import('./telegram.mjs')
  const sent = []
  const errors = []
  const broadcast = async (chats, text) => { sent.push({ chats, text }); return chats.map(() => ({ message_id: 1 })) }
  await makeKeeperMirror({ broadcast, chats: [], log: { log() {}, error: (m) => errors.push(m) } })('hello')
  ok('an empty mirror is said out loud, never silent', sent.length === 0 && errors.some((e) => /NOBODY/.test(e)))
  await makeKeeperMirror({ broadcast, chats: ['900000001'], log: quiet })('<what is a core?>')
  ok('an addressed line reaches the owner, escaped, with /say under it',
     /someone speaks to the keeper/.test(sent[0].text) && /&lt;what is a core\?&gt;/.test(sent[0].text) && /\/say/.test(sent[0].text))
  await makeKeeperMirror({ broadcast, chats: ['900000001'], log: quiet })('two people talking', false)
  ok('an overheard line is marked as overheard, with no /say', /overheard in the room/.test(sent[1].text) && !/\/say/.test(sent[1].text))

  const keeper = { say: (l) => l === 'the bridge holds.' }
  ok('/say is silent for anyone but the owner', sayCommand({ isRoot: false, keeper, line: 'x' }) === null)
  ok('/say with nothing asks what to say', /say what\?/.test(sayCommand({ isRoot: true, keeper, line: ' ' })))
  ok('/say with no keeper says so', /not on the mesh/.test(sayCommand({ isRoot: true, keeper: null, line: 'x' })))
  ok('/say speaks into the field', /spoken into the field/.test(sayCommand({ isRoot: true, keeper, line: 'the bridge holds.' })))
}

// ── the shape of the source, where a comment is not a guard ───────────────
console.log('\nthe shape of the source')
{
  const keeper = readFileSync(new URL('./keeper.mjs', import.meta.url), 'utf8')
  const telegram = readFileSync(new URL('./telegram.mjs', import.meta.url), 'utf8')
  // The ask must reach Telegram before the throttle decides whether the mind
  // spends itself. These two lines were the wrong way round once: an uncrossed
  // visitor's words were dropped whenever di.jet was keeping.
  const ask = keeper.slice(keeper.indexOf('THE UNCROSSED'))
  ok('the uncrossed ask reaches Telegram before the throttle',
     ask.indexOf('onAsk(') > 0 && ask.indexOf('onAsk(') < ask.indexOf('k.takeAsk('),
     ask.indexOf('onAsk(') < ask.indexOf('k.takeAsk(') ? 'onAsk first' : 'the throttle is in front of the seam again')
  // One line, one DM. onTalk carries the room; onAsk belongs to the uncrossed
  // channel alone. Both firing sent the owner the same sentence twice.
  const talk = keeper.slice(keeper.indexOf('m.channel === TALK_CHANNEL'), keeper.indexOf('THE UNCROSSED'))
  ok('a room line is carried once, not twice', !/\bonAsk\(/.test(talk))
  // Both halves: the keeper must send the flag, and the host must keep it. It
  // was sent and silently dropped in the destructure for as long as it existed.
  ok('the keeper says whether a line was addressed', /addressed: forKeeper/.test(talk))
  ok('and the Telegram half keeps the flag rather than dropping it',
     /onTalk: \(\{[^}]*\baddressed\b[^}]*\}\)/.test(telegram) && /mirror\([^\n]*\baddressed\b/.test(telegram))
  // /mine and /forget both claimed more than they do, once. The owner chose to
  // change the words rather than widen the deletion, so the words must stay.
  const forgetSrc = telegram.slice(telegram.indexOf('async function handleForget'), telegram.indexOf('// ONE KEEPER, TWO BODIES'))
  const mineSrc = telegram.slice(telegram.indexOf('async function handleMine'), telegram.indexOf('async function handleForget'))
  ok('/forget says what it cannot delete', /KEPT_ANYWAY/.test(forgetSrc))
  ok('/mine says it too, for someone with no crossing', /KEPT_ANYWAY/.test(mineSrc))
}

console.log('\nevery caller that speaks as the keeper must SAY so')
{
  // The relay picks the brief from `voice`. Nothing on the relay's side can
  // prove a CALLER sends one, and on 2026-08-23 keeper.mjs did not: running the
  // standalone keeper with --mind asked as di.bo and answered into the field as
  // ՊԱՀԱՊԱՆ. The seam had a test on each side of it and none across it.
  for (const f of ['keeper.mjs', 'telegram.mjs']) {
    const src = readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')
    const calls = [...src.matchAll(/who:\s*'keeper'/g)]
    ok(`${f} asks the relay as the keeper somewhere`, calls.length > 0, `${calls.length} call site(s)`)
    for (const m of calls) {
      const from = src.lastIndexOf('{', m.index)
      const to = src.indexOf('}', m.index)
      const body = src.slice(from, to + 1)
      ok(`${f}: the call at char ${m.index} also sends voice: 'keeper'`, /voice:\s*'keeper'/.test(body),
         body.replace(/\s+/g, ' ').slice(0, 110))
    }
  }
}

// `to` on keeper:say is a RENDERING rule, not privacy — the hub broadcasts to
// every member of the room and has no directed send. A private thing published
// with `to` set is still published. Asserted against the real hub, by
// publishing and reading back what a DIFFERENT member receives.
console.log('\nthe tunnel — nothing private reaches the field')
if (OFFLINE) {
  console.log('  skip  live: the privacy guard (KEEPER_TEST_OFFLINE=1) — nothing proved')
} else {
  const room = `tunnel-privacy-test-${process.pid}`
  const heard = await new Promise((resolve) => {
    const got = []
    const a = new WebSocket(`${MESH}?room=${room}&node=watcher-${process.pid}`)
    const b = new WebSocket(`${MESH}?room=${room}&node=speaker-${process.pid}`)
    const done = setTimeout(() => { try { a.close(); b.close() } catch {} ; resolve(got) }, 6000)
    a.onmessage = (e) => { try { got.push(JSON.parse(e.data)) } catch {} }
    // Both ends must be IN the room before anything is said. Firing on b's open
    // alone made this flaky at about one run in four.
    let open = 0
    const speak = () => {
      if (++open < 2) return
      setTimeout(() => {
        b.send(JSON.stringify({ type: 'publish', channel: 'keeper:say',
          payload: { text: 'A PRIVATE THING', voice: 'ai', to: 'someone-else' } }))
        setTimeout(() => { clearTimeout(done); try { a.close(); b.close() } catch {} ; resolve(got) }, 2500)
      }, 600)
    }
    a.onopen = speak
    b.onopen = speak
    a.onerror = b.onerror = () => { clearTimeout(done); resolve(null) }
  }).catch(() => null)
  if (heard === null) {
    console.log('  ..   the mesh was unreachable — this guard did not run')
  } else {
    const leaked = heard.some((m) => JSON.stringify(m).includes('A PRIVATE THING'))
    ok('live: `to` does NOT hide a message from other members — so nothing private may be published',
       leaked === true, leaked ? 'confirmed: every member receives it' : 'the hub did not deliver at all — guard inconclusive')
  }
}

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed || !passed ? 1 : 0)
