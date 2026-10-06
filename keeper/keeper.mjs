// di.bo as the keeper's voice.
//
// Moved here from di-bo (master 91268bd) on 2026-10-07, when di.bo became the
// team's assistant. "di.bo" stays the keeper's name on the mesh; the Telegram
// half that bot.mjs wired around it is keeper/telegram.mjs, and this file still
// stands alone (bottom of the file) with no bot at all.
//
// The field page (br_id_ge/field.html) draws ՊԱՀԱՊԱՆ — the keeper — as a
// lattice at the centre of the cores. It is graphite until something publishes
// a `keeper` heartbeat on the mesh, and then it wakes to the one live blue.
// The body that heartbeat was written for is di.jet, the robot car: it has a
// camera for an eye and a speaker for a mouth, and it stands in the room.
//
// di.jet is not always powered. di.bo is — it already sits on the VPS watching
// the bridge. So it takes the keeper's place when the room is empty: no eye, no
// speaker, only the voice on the wire. The moment di.jet comes back, di.bo
// stands down mid-sentence, because a keeper with a body in the room beats a
// keeper that is only a process.
//
//   channels (see serverXR/src/meshHub.js for the hub, field.html for the client)
//     -> 'keeper'      {name, body}   heartbeat; any of them marks it awake
//     <- 'keeper:ask'  {text}         someone who has NOT crossed, to the keeper
//     <- 'talk'        {id,who,text}  someone who crossed, speaking in the room
//     -> 'keeper:say'  {text, voice, to?}  what the keeper answers — see below
//
// Channels are NOT prefixed with the room. An earlier version of this file said
// they were, and argued that `talk` unqualified would be the bridge's talk
// forever — that argument was wrong on the facts. The hub keys every room
// separately (`state.rooms`, roomId from the query string) and only ever
// broadcasts a publish to members of the SAME room, so a second space's `talk`
// can never reach this one. `bridge:talk` was a prefix on top of a namespace
// that already existed, and it cost a silent room: the field shipped `talk`,
// di.bo listened on `bridge:talk`, and the two never met.
//
// `voice` is the only thing separating the mind that is always here from the
// owner speaking as the keeper, and the field MUST show that difference. A
// visitor who cannot tell which one answered has been misled by omission — the
// whole point of the AI saying "the keeper will be told" is that it is not the
// keeper. Absent voice means 'keeper', so an older field keeps working.
//
// The hub caps a message at 8KB and never echoes a publish back to its sender,
// so hearing a `keeper` heartbeat always means SOMEONE ELSE is keeping.

export const KEEPER_ROOM = 'bridge'
export const HEARTBEAT_MS = 5000
// The field calls the keeper asleep after 15s of silence. Standing down has to
// use the same window, or di.bo would go quiet while the page still shows it
// awake and every visitor would speak into nothing.
export const AWAKE_MS = 15000
// A visitor can hold the return key down. One answer at a time, and never two
// within this window — the voice behind this is a language model.
export const ASK_MIN_GAP_MS = 2500
// Nothing heard back from the hub for this long means the pipe is dead, however
// open the socket claims to be. Three missed heartbeats' worth.
export const DEAF_MS = 20000
// A websocket dial that never resolves — no open, no close, no error. Node will
// wait forever; this is how long the keeper waits before starting over.
export const DIAL_MS = 12000
export const MAX_ASK_CHARS = 120
export const MAX_SAY_CHARS = 200

// A hard slice cuts mid-word: the first answer the room ever gave in public
// ended "...and then it stays he". The cap has to stay — it is what keeps one
// answer from filling the field — but a visitor should see a keeper that
// stopped, not a string that ran out. Break at the last space and mark it.
export function fit(text, max = MAX_SAY_CHARS) {
  const s = String(text || '').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  // No space in 199 characters is not prose. Take the hard cut rather than
  // return nothing.
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.—-]+$/, '') + '…'
}
// What di.bo will carry out of the room. The field caps input too, but a cap
// that only exists in the page is a request, not a limit — anything can publish
// to an open mesh.
export const MAX_TALK_CHARS = 200
// What field.html actually publishes. Pinned here and in docs/the-room.md, and
// changed on neither side alone.
export const TALK_CHANNEL = 'talk'
export const ASK_CHANNEL = 'keeper:ask'
// The field marks a line meant for the keeper with this token rather than
// sending it on a separate channel: the room should read as one conversation,
// and an aside to the keeper is still something the room heard. Everything else
// the keeper hears and stays out of — humans talking to humans is the point,
// and it is also the only voice that costs nothing.
// How a visitor addresses the keeper. The field composes this, so the two must
// not drift: the first version of this matcher wanted `\u054a\u0531\u0540\u0531\u054a\u0531\u0546\u2192` exactly
// while the UI was emitting `\u057a\u0561\u0570\u0561\u057a\u0561\u0576 ` — lower case, a space, no arrow. Armenian
// \u054a and \u057a are different codepoints, so a strict match could never fire, and the
// keeper sat silent through a real crossing. The unit tests passed the whole
// time because they tested the token against itself.
//
// Accepted, case-insensitively, at the START of a line only:
//     \u057a\u0561\u0570\u0561\u057a\u0561\u0576   \u054a\u0531\u0540\u0531\u054a\u0531\u0546   keeper   @keeper   di.bo
// each optionally followed by \u2192 and/or whitespace.
export const ADDRESS_ALIASES = ['\u057a\u0561\u0570\u0561\u057a\u0561\u0576', 'keeper', '@keeper', 'di.bo']

// Start-anchored on purpose. Mentioning the keeper mid-sentence is talking
// ABOUT it, and a keeper that answers that is eavesdropping.
//
// The alias must END somewhere — an arrow, whitespace, punctuation, or the end
// of the line. Without that, "keepers of the field" addresses the keeper and
// "di.bomb" does too.
const ADDRESS_RE = new RegExp(
  '^\\s*(?:' + ADDRESS_ALIASES.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')'
  + '(?:\u2192|[\\s,:;!?\u2014-]|$)',
  'i',
)

export const addressed = (text) => ADDRESS_RE.test(String(text || ''))
export const stripAddress = (text) =>
  String(text || '').replace(ADDRESS_RE, '').replace(/^[\s\u2192,:;\u2014-]+/, '').trim()

// di.bo does not think. There was a local model behind this for one evening and
// it was worse than silence: an 8B model answered a visitor's Armenian in
// transliterated mush and broke the register in every third line. A keeper that
// says one true thing beats a keeper that improvises badly, so what it says when
// it has nothing of its own to say is fixed — and in register, because a visitor
// spoke to the piece and must get the piece back, never a configuration error.
//
// The words that ARE answers come from a person: the ask lands in Telegram and
// `/say` speaks it into the field. When a machine worth its voice is on hand,
// it will be di.jet's, spoken out loud in the room — not a process on a VPS.
export const KEPT_LINE = 'The keeper hears you. Tonight it keeps its answer.'

// ── the part with no sockets in it ────────────────────────────────────────
// Everything above the transport, so the handover and the throttle can be
// tested without a mesh, a robot, or a language model.
// WHO di.bo is willing to hand the room to. Until 2026-08-20 this was "anyone
// with a name that is not mine", which meant any node on an open mesh could
// publish {name:'x'} on `keeper` and put di.bo to sleep for 15s at a time — and
// standing down ALSO makes the health check read the keeper green, so the field
// would show nobody keeping while the light stayed on.
//
// It is a list and not a name because the robot's two bodies disagree with each
// other and with the protocol. br_id_ge/docs/KEEPER.md says "on the mesh and on
// the page, it is jet.di"; br_id_ge/scripts/keeper-presence.mjs defaults
// --name to `jet.di`; and the robot's own di-jet/deploy/scripts/keeper_agent.py
// sets NAME = "di.jet". Picking one would have left di.bo refusing to stand down
// for the real robot — two keepers on one mesh, which is worse than the bug this
// replaces. So: both, and a way to add more without a deploy.
export const YIELD_TO = String(process.env.KEEPER_YIELD_TO || 'jet.di,di.jet')
  .split(',').map((s) => s.trim()).filter(Boolean)

export function makeKeeper({ name = 'di.bo', now = () => Date.now(), yieldTo = YIELD_TO, onStranger = () => {} } = {}) {
  let otherSeen = -Infinity   // last heartbeat from a keeper that is not us
  let otherName = ''
  const strangers = new Set()   // named once each, never repeated
  let lastAsk = -Infinity
  let answering = false

  const yielding = () => now() - otherSeen < AWAKE_MS

  return {
    get name() { return name },
    // Who else is keeping, if anyone — the caller logs the handover.
    standingDownTo() { return yielding() ? otherName : '' },

    // A heartbeat from another keeper. The hub never echoes our own publishes
    // back to us, so anything arriving here is by definition someone else —
    // but the name is checked anyway, because a second di.bo (a stale process
    // on the old box, say) must not make this one stand down forever.
    heardKeeper(payload) {
      const heard = String(payload?.name || '').slice(0, 14)
      if (!heard || heard === name) return false
      // A name nobody recognises does NOT get the room. But it is said out loud
      // exactly once: if the robot is ever renamed, this line is how that is
      // discovered — rather than by finding two keepers beating at each other
      // on the same mesh, which is what silence here would produce.
      if (!yieldTo.includes(heard)) {
        if (!strangers.has(heard)) { strangers.add(heard); onStranger(heard) }
        return false
      }
      otherSeen = now()
      otherName = heard
      return true
    },

    // Should we announce ourselves right now?
    shouldBeat() { return !yielding() },

    // A visitor's words. Returns the text to answer, or a reason not to.
    takeAsk(payload) {
      const text = String(payload?.text || '').trim().slice(0, MAX_ASK_CHARS)
      if (!text) return { skip: 'empty' }
      if (yielding()) return { skip: 'di.jet is keeping' }
      if (answering) return { skip: 'busy' }
      if (now() - lastAsk < ASK_MIN_GAP_MS) return { skip: 'too fast' }
      lastAsk = now()
      answering = true
      return { text }
    },
    doneAnswering() { answering = false },
  }
}

// ── the transport ─────────────────────────────────────────────────────────
// Node 22 carries WebSocket natively, which is the whole reason di-bo can join
// the mesh and still have zero dependencies.
export function startKeeper({
  meshUrl,
  // The relay gates only the ids worth impersonating: anyone joins anonymously,
  // nobody claims `keeper-*` without proving MESH_ROOM_SECRET (di.iiii
  // serverXR/src/meshHub.js, MESH_PROTECTED_NODE_PREFIXES). Unset on either side
  // and the room is open, which is what it was before the gate existed.
  meshSecret = process.env.MESH_ROOM_SECRET || '',
  name = 'di.bo',
  onAsk = () => {},             // (text) => void — carries the ask into Telegram
  // (text) => Promise<string|null> — the mind on the Mac. null means "say
  // nothing of your own", which is not a failure: it is the state this keeper
  // was in for its whole life before today, and the state it returns to the
  // moment the Mac is unreachable.
  answer = async () => null,
  onTalk = () => {},            // ({id,who,text}) => void — the room, overheard
  // (name) => void — a body nobody recognises is claiming the room. Once per
  // name, and it does NOT get the room; see YIELD_TO.
  onStranger = () => {},
  log = console.log,
}) {
  if (typeof WebSocket !== 'function') {
    log('di-bo: keeper needs a Node with a global WebSocket (22+) — not joining the mesh')
    return { say: () => false, online: () => false, standingDownTo: () => '' }
  }

  const k = makeKeeper({
    name,
    onStranger: (heard) => {
      log(`di-bo: keeper: an unknown body calls itself "${heard}" on the keeper channel — NOT standing down for it`)
      onStranger(heard)
    },
  })
  let ws = null
  let toldStandDown = ''
  // A websocket through a proxy can stop carrying without ever closing: the
  // socket stays readyState 1, every publish "succeeds", and the field shows a
  // keeper that is not there. That is exactly how this bot's own subject —
  // silence — gets you. So the pipe has to prove itself: the hub answers
  // {type:'control',cmd:'ping'} with a pong, and a pipe that goes quiet past
  // DEAF_MS is torn down and rebuilt rather than trusted.
  let lastHeard = 0
  // …and that watchdog only ever ran on an OPEN socket, which left the failure
  // that actually happened uncovered: 22 hours with no socket at all. A dial
  // that never resolves sits in readyState 0 forever — no open, no close, no
  // error — so nothing retried and nothing complained, while the field showed
  // the keeper asleep. Two things close that hole: a dial has a deadline, and
  // a keeper that is not on the mesh redials on the same heartbeat that would
  // have carried it, out loud.
  let lastLive = Date.now()   // last moment the pipe was demonstrably open
  let dialing = false

  const publish = (channel, payload) => {
    if (!ws || ws.readyState !== 1) return false
    try {
      ws.send(JSON.stringify({ type: 'publish', channel, pingTs: Date.now(), payload }))
      return true
    } catch { return false }
  }

  // Tearing the current socket down and forgetting it, from anywhere.
  const drop = () => { if (ws) { try { ws.close() } catch {} } ws = null; dialing = false }

  const connect = () => {
    if (dialing) return
    let u
    try { u = new URL(meshUrl) } catch { log('di-bo: keeper: bad MESH_URL'); return }
    u.searchParams.set('room', KEEPER_ROOM)
    u.searchParams.set('node', 'keeper-dibo-' + Math.random().toString(36).slice(2, 8))
    // `keeper-*` is reserved on the relay — the room stays open to visitors,
    // but this identity needs the secret. Unset stays valid: the server only
    // enforces when it has one.
    if (meshSecret) u.searchParams.set('secret', meshSecret)
    dialing = true
    try { ws = new WebSocket(u.toString()) } catch { dialing = false; return void setTimeout(connect, 5000) }
    const dialed = ws
    // A dial with no deadline is how a keeper disappears for a day.
    setTimeout(() => {
      if (ws === dialed && ws && ws.readyState === 0) {
        log('di-bo: keeper: the dial never answered — starting over')
        drop(); setTimeout(connect, 2000)
      }
    }, DIAL_MS)

    // EVERY handler is bound to the socket it belongs to and checks that it is
    // still the live one. The dial deadline above already did this (`ws ===
    // dialed`); onclose did not, and that was the hole: drop() closes a socket
    // and schedules a new dial, the new socket is assigned to `ws`, and THEN the
    // old socket's close event arrives and runs `ws = null` on its successor.
    // The keeper then stops publishing — every beat sees a null socket — while a
    // live, orphaned socket sits in the room nobody holds a reference to, and a
    // second dial is queued behind it. Both live logs carry the double
    // "keeper on the mesh" signature that shape produces.
    dialed.onopen = () => {
      if (ws !== dialed) return
      dialing = false; lastHeard = Date.now(); lastLive = Date.now()
      log(`di-bo: keeper on the mesh as ${name}`)
    }
    // A dropped mesh is the failure this whole bot exists to notice, so the
    // reconnect is unconditional and quiet — pollHealth is what tells you.
    dialed.onclose = () => {
      if (ws !== dialed) return
      dialing = false; ws = null; setTimeout(connect, 5000)
    }
    dialed.onerror = () => {}
    dialed.onmessage = (ev) => {
      if (ws !== dialed) return
      // Anything at all, including the hub's pong, proves the pipe is alive.
      lastHeard = Date.now()
      let m
      try { m = JSON.parse(ev.data) } catch { return }
      if (m.type === 'control:pong') return
      // THE MIND MUST NEVER ANSWER HISTORY. The room is kept now: the hub can
      // replay a room's past as `mesh:history` envelopes to a client that asks
      // for them with {type:'control',cmd:'history'}. di.bo never asks — and
      // this line is why it could not be hurt even if the hub sent them
      // unbidden, because anything that is not a live `mesh:event` is dropped
      // before it reaches an ear. Whitelisting the ONE live type is what makes
      // that true; a blacklist of history types would fail open the day the hub
      // invents a second one. Do not turn this into `!== 'mesh:history'`.
      if (m.type !== 'mesh:event') return

      if (m.channel === 'keeper') {
        if (k.heardKeeper(m.payload) && toldStandDown !== k.standingDownTo()) {
          toldStandDown = k.standingDownTo()
          log(`di-bo: keeper: ${toldStandDown} has the room — standing down`)
        }
        return
      }
      if (m.channel === TALK_CHANNEL) {
        // The room is public writes on an open mesh: di.bo cannot stop anyone
        // publishing here, only decline to carry what it hears. Real limits on
        // people need the hub (serverXR meshHub.js); these are di.bo's own.
        const p = m.payload || {}
        const raw = String(p.text || '').trim().slice(0, MAX_TALK_CHARS)
        if (!raw) return
        const who = String(p.who || '').slice(0, 60)
        const forKeeper = addressed(raw)
        onTalk({ id: String(p.id || ''), who, text: raw, addressed: forKeeper })
        if (!forKeeper) return
        const asked = stripAddress(raw)
        if (!asked) return
        const taken = k.takeAsk({ text: asked })
        if (taken.skip) return
        // No onAsk here. onTalk above already carried this line to Telegram —
        // with `addressed` set — and calling both sent the owner two DMs for one
        // sentence, in two different wordings, with nothing to say they were the
        // same line. The room's seam to Telegram is onTalk; onAsk belongs to the
        // uncrossed channel, which has no onTalk of its own.
        // `room` and the speaker's name: the budget ladder needs to know which
        // voice this is, or one person in a kept room can spend the hour.
        answer(taken.text, 'room', who).then((said) => {
          const t = String(said || '').trim()
          if (t) publish('keeper:say', { text: fit(t), voice: 'ai' })
          else publish('keeper:say', { text: KEPT_LINE, voice: 'keeper' })
        }).catch(() => {
          publish('keeper:say', { text: KEPT_LINE, voice: 'keeper' })
        }).finally(() => k.doneAnswering())
        return
      }
      if (m.channel !== ASK_CHANNEL) return

      // THE UNCROSSED. `keeper:ask` is not retired — it is now specifically the
      // way in for someone who has not crossed. Their line is seen by the keeper
      // and by nobody else: it never enters the room, because the room is what
      // crossing earns. Humans reach humans only through `talk`.
      //
      // Which is exactly why the answer cannot be broadcast like a room answer.
      // Every open panel would show a reply to a question it never saw. So the
      // answer carries `to` — the asker's node id, straight back off the hub's
      // own `from` — and a field renders a `to` line only when it is its own.
      //
      // `to` is a rendering rule, NOT privacy. The hub broadcasts to every
      // member of the room and has no directed send, so all of them receive
      // these bytes and any of them could read them. An aside to the keeper is
      // unseen, not secret, and the UI must not promise otherwise.
      const asked = String(stripAddress(String(m.payload?.text || '')) || m.payload?.text || '')
        .trim().slice(0, MAX_ASK_CHARS)
      if (!asked) return
      const to = String(m.from || '').slice(0, 64) || undefined
      // The ask reaches Telegram FIRST and unconditionally. Whatever the mind
      // says, the owner still hears the question — that is what "the keeper
      // will be told" promises, and it must not depend on a laptop answering.
      //
      // This line used to sit BELOW the throttle, which meant it was not
      // unconditional at all: an uncrossed visitor's words were dropped before
      // Telegram whenever di.jet was keeping, whenever an answer was already in
      // flight, and within 2.5s of the previous ask. takeAsk decides whether the
      // MIND spends itself; it was never meant to decide whether the owner hears
      // a person. The two questions are separate and are now asked in that order.
      onAsk(asked)
      const taken = k.takeAsk({ text: asked })
      if (taken.skip) return
      answer(taken.text, 'ask', to).then((said) => {
        const text = String(said || '').trim()
        // A fallback labelled 'ai' would be claiming a mind that just failed to
        // answer. Silence in register, credited to the keeper, is the truth.
        if (text) publish('keeper:say', { text: fit(text), voice: 'ai', to })
        else publish('keeper:say', { text: KEPT_LINE, voice: 'keeper', to })
      }).catch(() => {
        publish('keeper:say', { text: KEPT_LINE, voice: 'keeper', to })
      }).finally(() => k.doneAnswering())
    }
  }
  connect()

  setInterval(() => {
    if (!k.shouldBeat()) {
      // di.jet took the room back. Say so once, then keep quiet until it goes.
      if (toldStandDown !== k.standingDownTo()) {
        toldStandDown = k.standingDownTo()
        log(`di-bo: keeper: ${toldStandDown} has the room — standing down`)
      }
      return
    }
    if (toldStandDown) { log('di-bo: keeper: the room is empty again — keeping'); toldStandDown = '' }
    // Not on the mesh at all: the heartbeat that cannot go out is the one that
    // has to notice. Silent forever was the bug.
    if (!ws || ws.readyState !== 1) {
      if (Date.now() - lastLive > DEAF_MS) {
        log(`di-bo: keeper: off the mesh for ${Math.round((Date.now() - lastLive) / 1000)}s — dialling again`)
        lastLive = Date.now()
        drop(); connect()
      }
      return
    }
    lastLive = Date.now()
    publish('keeper', { name, body: 'chat' })
    // Ride the heartbeat: one ping out with it, and if nothing has come back
    // for DEAF_MS the pipe is dead however open it claims to be.
    if (ws && ws.readyState === 1) {
      try { ws.send(JSON.stringify({ type: 'control', cmd: 'ping', sentAt: Date.now() })) } catch {}
      if (lastHeard && Date.now() - lastHeard > DEAF_MS) {
        log('di-bo: keeper: the mesh went quiet — rebuilding the connection')
        lastHeard = 0
        drop()
        setTimeout(connect, 1000)
      }
    }
  }, HEARTBEAT_MS).unref?.()

  return {
    // Lets the owner speak into the field by hand — see sayCommand in telegram.mjs.
    say: (text) => publish('keeper:say', { text: fit(text) }),
    online: () => Boolean(ws && ws.readyState === 1),
    standingDownTo: () => k.standingDownTo(),
  }
}

// Both units write with systemd's `StandardOutput=append:`, so nothing else adds
// a time to these lines — and the only question anyone has ever asked of this
// file is WHEN. "keeper on the mesh as di.bo" eight times over says nothing about
// whether that was eight reconnects in a minute or eight restarts in a fortnight,
// and the difference between those two is the difference between a bug and a
// boring week. Installed at each entry point rather than at import, so importing
// this module from bot.mjs does not stamp anything twice.
export function stampConsole() {
  for (const level of ['log', 'error']) {
    const out = console[level].bind(console)
    console[level] = (...a) => out(new Date().toISOString(), ...a)
  }
}

// ── standing it up alone ──────────────────────────────────────────────────
// The keeper without the bot around it — for the show rig, and for seeing the
// lattice actually turn blue before trusting that it does:
//
//     node keeper/keeper.mjs
//     node keeper/keeper.mjs --mesh wss://staging.di-studio.xyz/serverXR/mesh --name di.bo
//
// No Telegram, no token, nothing announced anywhere — asks print to the console
// instead. Ctrl-C and the field's keeper falls asleep within 15s, exactly as if
// the body had left the room.
if (process.argv[1] && process.argv[1].endsWith('keeper.mjs')) {
  stampConsole()
  const argv = process.argv.slice(2)
  const arg = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1] }
  const k = startKeeper({
    meshUrl: arg('--mesh', process.env.MESH_URL || 'wss://di-studio.xyz/serverXR/mesh'),
    meshSecret: arg('--secret', process.env.MESH_ROOM_SECRET || ''),
    name: String(arg('--name', 'di.bo')).slice(0, 14),
    onAsk: (text) => console.log('keeper: asked:', text),
    // The mind, when it is asked for. This is how the keeper gets a voice on a
    // tier BEFORE prod: the staging unit runs this file directly, so `--mind`
    // (or KEEPER_MIND=1) gives staging a thinking keeper while prod keeps its
    // one line until someone has actually stood in the field and looked.
    answer: (argv.includes('--mind') || process.env.KEEPER_MIND === '1')
      ? async (text) => {
        const url = process.env.RELAY_URL
        const token = process.env.PUBLIC_RELAY_TOKEN
        if (!url || !token) return null
        try {
          const r = await fetch(`${url}/public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-relay-token': token },
            // `voice` is what selects the keeper's brief on the relay
            // (di-relay.py: `brief = KEEPER_BRIEF if voice == "keeper"`).
            // Without it this asked as di.bo and answered INTO THE FIELD as
            // \u054a\u0531\u0540\u0531\u054a\u0531\u0546 — the platform's voice in the artwork's
            // mouth. Inert only because di-bo-staging passes no --mind; it
            // armed the moment anyone followed the comment above. bot.mjs's
            // keeperMind has always sent it; this caller was written later and
            // never got it, and voice.test.py tests the relay's side of the
            // seam, never a caller's.
            body: JSON.stringify({ prompt: `[the keeper, in the field] ${text}`, who: 'keeper', voice: 'keeper' }),
            signal: AbortSignal.timeout(Number(process.env.KEEPER_MIND_TIMEOUT_MS || 9000)),
          })
          if (!r.ok) return null
          return String((await r.json()).text || '').trim() || null
        } catch { return null }
      }
      : undefined,
  })
  setInterval(() => {
    const down = k.standingDownTo()
    if (down) console.log(`keeper: ${down} has the room`)
  }, 30000)
}
