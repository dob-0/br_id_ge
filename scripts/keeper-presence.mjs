#!/usr/bin/env node
// The keeper announces itself. Run this on the jetson (di_bot) and the field's
// keeper core wakes to the live blue: the ai is with us, as a body among the
// cores. Stop it and the keeper falls asleep again within ~15s.
//
//     node scripts/keeper-presence.mjs                 → prod mesh
//     node scripts/keeper-presence.mjs --to staging    → staging mesh
//     node scripts/keeper-presence.mjs --name di_bot
//
// Needs Node >= 21 (native WebSocket). On an older jetson node, `npm i ws`
// next to this script and it will pick that up instead.

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = argv.indexOf(name)
  return i === -1 ? fallback : argv[i + 1]
}

const TO = String(arg('--to', 'prod')).toLowerCase()
const NAME = String(arg('--name', 'di_bot')).slice(0, 14)
const ORIGINS = {
  prod: 'wss://di-studio.xyz/serverXR/mesh',
  staging: 'wss://staging.di-studio.xyz/serverXR/mesh',
  local: 'ws://localhost:4000/serverXR/mesh',
}
const MESH = ORIGINS[TO] || TO // any full ws:// url passes through

let WS = globalThis.WebSocket
if (!WS) WS = (await import('ws')).default

const HEARTBEAT_MS = 5000
let ws = null

function connect() {
  const u = new URL(MESH)
  u.searchParams.set('room', 'bridge')
  u.searchParams.set('node', 'keeper-' + Math.random().toString(36).slice(2, 8))
  ws = new WS(u.toString())
  ws.onopen = () => console.log(`[keeper] on the mesh (${TO}) as ${NAME}`)
  ws.onclose = () => { console.log('[keeper] mesh gone, retrying…'); setTimeout(connect, 5000) }
  ws.onerror = () => {}
}
connect()

setInterval(() => {
  if (!ws || ws.readyState !== 1) return
  ws.send(JSON.stringify({
    type: 'publish', channel: 'keeper', pingTs: Date.now(),
    payload: { name: NAME, state: 'awake' },
  }))
}, HEARTBEAT_MS)
