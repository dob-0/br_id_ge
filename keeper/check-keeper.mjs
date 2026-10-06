#!/usr/bin/env node
// Is anything actually keeping?
//
// The field draws ՊԱՀԱՊԱՆ awake only while a `keeper` heartbeat is arriving on
// the mesh. Every other way of asking has now lied at least once: the process was
// active, the log's last keeper line said it had joined, and `checkMesh` said the
// mesh was healthy — while the socket had been gone for 22 hours and every
// visitor saw the keeper asleep.
//
// So this asks the room, as a stranger, exactly the way a visitor's browser does.
// The hub never echoes a publish back to its sender, so anything heard here is
// somebody else keeping.
//
//     node keeper/check-keeper.mjs                    → prod
//     node keeper/check-keeper.mjs --to staging
//     node keeper/check-keeper.mjs --mesh ws://localhost:4000/serverXR/mesh --for 30
//
// Exit 0 if a keeper is heard, 1 if the room is silent, 2 if the mesh itself is
// unreachable — so it can stand in a deploy script or a cron.

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1] }
const ORIGINS = {
  prod: 'wss://di-studio.xyz/serverXR/mesh',
  staging: 'wss://staging.di-studio.xyz/serverXR/mesh',
  local: 'ws://localhost:4000/serverXR/mesh',
}
const TO = String(arg('--to', 'prod')).toLowerCase()
const MESH = arg('--mesh', ORIGINS[TO] || TO)
// The field calls the keeper asleep after 15s of silence, so a window shorter
// than that could call a live keeper dead.
const FOR = Math.max(16, Number(arg('--for', 20)) || 20)

let WS = globalThis.WebSocket
if (!WS) WS = (await import('ws')).default

const u = new URL(MESH)
u.searchParams.set('room', 'bridge')
u.searchParams.set('node', 'check-' + Math.random().toString(36).slice(2, 8))

let opened = false
const heard = new Map()   // name -> beats
let ws
try { ws = new WS(u.toString()) } catch { console.log('the mesh is unreachable:', MESH); process.exit(2) }
ws.onopen = () => { opened = true; console.log(`listening in room bridge on ${MESH} for ${FOR}s…`) }
ws.onerror = () => {}
ws.onmessage = (ev) => {
  let m
  try { m = JSON.parse(ev.data) } catch { return }
  if (m.type === 'peer:join' || m.type === 'peer:leave') {
    console.log(`  room: ${(m.members || []).join(', ') || '(empty)'}`)
    return
  }
  if (m.type !== 'mesh:event' || m.channel !== 'keeper') return
  const name = String(m.payload?.name || '?').slice(0, 14)
  heard.set(name, (heard.get(name) || 0) + 1)
}

setTimeout(() => {
  try { ws.close() } catch {}
  if (!opened) { console.log('✗ never opened — the mesh itself is down or the proxy refuses websockets'); process.exit(2) }
  if (!heard.size) { console.log('✗ nobody is keeping — the field shows ՊԱՀԱՊԱՆ asleep'); process.exit(1) }
  for (const [name, beats] of heard) console.log(`✓ ${name} is keeping — ${beats} beat(s) in ${FOR}s`)
  process.exit(0)
}, FOR * 1000)
