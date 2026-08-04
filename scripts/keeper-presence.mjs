#!/usr/bin/env node
// The keeper announces itself. Run this on jet.di — the robot car on the Jetson
// (repo dob-0/dibot, hostname di_bot) — and the field's keeper lattice wakes to
// the live blue: the ai is with us, as a body among the cores. Stop it and the
// keeper falls asleep again within ~15s, unless di.bo picks the wire back up.
//
// Two bodies may keep, and they are not the same thing:
//   jet.di  the robot car in the room — eye (camera) and voice (speaker)
//   di.bo   the Telegram messenger on the VPS — voice only, no eye
// jet.di always wins: di.bo stands down the moment it hears this heartbeat.
// The whole arrangement is written down in docs/KEEPER.md.
//
//     node scripts/keeper-presence.mjs                 → prod mesh
//     node scripts/keeper-presence.mjs --to staging    → staging mesh
//     node scripts/keeper-presence.mjs --name jet.di
//
// The eye — tap the keeper in the field and see what jet.di sees:
//     --eye /dev/video0        publish a small frame every few seconds (needs ffmpeg)
//     --eye-every 4000         ms between frames
//
// The voice — speak to it from the field's keeper window (needs Ollama):
//     --ollama http://127.0.0.1:11434 --model llama3.1:8b
//
// Needs Node >= 21 (native WebSocket). On an older Jetson node, `npm i ws`
// next to this script and it will pick that up instead.
import { execFile } from 'node:child_process'

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = argv.indexOf(name)
  return i === -1 ? fallback : argv[i + 1]
}

const TO = String(arg('--to', 'prod')).toLowerCase()
const NAME = String(arg('--name', 'jet.di')).slice(0, 14)
const ORIGINS = {
  prod: 'wss://di-studio.xyz/serverXR/mesh',
  staging: 'wss://staging.di-studio.xyz/serverXR/mesh',
  local: 'ws://localhost:4000/serverXR/mesh',
}
const MESH = ORIGINS[TO] || TO // any full ws:// url passes through

let WS = globalThis.WebSocket
if (!WS) WS = (await import('ws')).default

const EYE = arg('--eye', '')                    // e.g. /dev/video0
const EYE_EVERY = Number(arg('--eye-every', 4000))
const OLLAMA = String(arg('--ollama', '')).replace(/\/$/, '')
const MODEL = arg('--model', 'llama3.1:8b')

const KEEPER_SYS = 'You are ՊԱՀԱՊԱՆ, the Keeper of կամուրջ, the bridge of ' +
  'Armenian letters between the real world and a shared digital one. You live in a ' +
  'small robot body (jet.di, a four-wheeled machine) standing in the exhibition ' +
  'room, watching the field ' +
  'of cores — one for every person who crossed. A visitor speaks to you through the ' +
  'field. Reply with exactly ONE line in English, at most 20 words, spare and ' +
  'luminous — one breath of thought, the way Narekatsi ends a prayer. ' +
  'At most one Armenian word. No emoji, no quotes, no lists. ' +
  // Kept in step with di-bo/keeper.mjs: visitors write in latin-letter Armenian
  // ("mard ka?") and the model mirrors it straight back, which reads as a
  // machine guessing rather than as the keeper speaking.
  'Answer in English WHATEVER language the visitor used — never in transliterated ' +
  'Armenian, never in Russian. Armenian script only for that one optional word.'

const HEARTBEAT_MS = 5000
let ws = null

function publish(channel, payload) {
  if (!ws || ws.readyState !== 1) return
  ws.send(JSON.stringify({ type: 'publish', channel, pingTs: Date.now(), payload }))
}

async function answer(text) {
  if (!OLLAMA) { publish('keeper:say', { text: 'The keeper hears you, but its voice is not running.' }); return }
  try {
    const r = await fetch(OLLAMA + '/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, system: KEEPER_SYS, stream: false,
        prompt: 'A visitor at the field says: "' + text.slice(0, 120) + '". Answer them.' }),
      signal: AbortSignal.timeout(20000),
    })
    const line = String(((await r.json()) || {}).response || '').trim().split('\n')[0].slice(0, 200)
    publish('keeper:say', { text: line || '…' })
  } catch {
    publish('keeper:say', { text: 'The keeper heard you; its thought did not arrive in time.' })
  }
}

function see() {
  if (!EYE || !ws || ws.readyState !== 1) return
  // one small paper-toned frame, never stored — straight from the lens to the mesh
  execFile('ffmpeg', ['-loglevel', 'error', '-f', 'v4l2', '-i', EYE,
    '-frames:v', '1', '-vf', 'scale=320:-2', '-q:v', '12', '-f', 'mjpeg', 'pipe:1'],
  { encoding: 'buffer', maxBuffer: 1 << 20, timeout: 8000 }, (err, out) => {
    if (err || !out || !out.length) return
    publish('keeper:eye', { jpg: 'data:image/jpeg;base64,' + out.toString('base64') })
  })
}

function connect() {
  const u = new URL(MESH)
  u.searchParams.set('room', 'bridge')
  u.searchParams.set('node', 'keeper-' + Math.random().toString(36).slice(2, 8))
  ws = new WS(u.toString())
  ws.onopen = () => console.log(`[keeper] on the mesh (${TO}) as ${NAME}` +
    (EYE ? ' · eye open' : '') + (OLLAMA ? ` · voice ${MODEL}` : ''))
  ws.onclose = () => { console.log('[keeper] mesh gone, retrying…'); setTimeout(connect, 5000) }
  ws.onerror = () => {}
  ws.onmessage = (ev) => {
    let m; try { m = JSON.parse(ev.data) } catch { return }
    if (m.type === 'mesh:event' && m.channel === 'keeper:ask' && m.payload && m.payload.text) {
      const text = String(m.payload.text)
      console.log('[keeper] asked:', text)
      answer(text)
    }
  }
}
connect()

setInterval(() => publish('keeper', { name: NAME, body: 'robot', state: 'awake' }), HEARTBEAT_MS)
if (EYE) setInterval(see, Math.max(2000, EYE_EVERY))
