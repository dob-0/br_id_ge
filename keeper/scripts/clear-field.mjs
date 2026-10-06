#!/usr/bin/env node
// Clear the crossings out of the br_id_ge field.
//
// Backs up first, always, to ~/di-backups/field/ — and prints the one command
// that puts them back. Only `insc-` objects are touched; whatever else the
// scene holds (the lattice, the ground) is written back untouched.
//
//   set -a && . ~/di.iiii/serverXR/.env.local; set +a
//   node scripts/clear-field.mjs --tier staging
//   node scripts/clear-field.mjs --tier prod
//   node scripts/clear-field.mjs --tier prod --keep insc-abc,insc-def
//   node scripts/clear-field.mjs --tier prod --dry-run
//   node scripts/clear-field.mjs --restore ~/di-backups/field/<file>.json --tier prod

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1] }
const tier = arg('--tier', 'staging')
const dry = argv.includes('--dry-run')
const restore = arg('--restore')
const keep = new Set((arg('--keep', '') || '').split(',').map((s) => s.trim()).filter(Boolean))

const HOST = tier === 'prod' ? 'https://di-studio.xyz' : 'https://staging.di-studio.xyz'
const token = process.env[tier === 'prod' ? 'PROD_API_TOKEN' : 'LIVE_API_TOKEN'] || process.env.API_TOKEN
if (!token) {
  console.error(`no token for ${tier}. Source the env first:\n  set -a && . ~/di.iiii/serverXR/.env.local; set +a`)
  process.exit(2)
}

const url = `${HOST}/serverXR/api/spaces/br-id-ge/scene`
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
const isCrossing = (o) => String(o?.id || '').startsWith('insc-')

const get = async () => {
  const r = await fetch(url, { headers })
  if (!r.ok) { console.error(`GET ${url} → ${r.status}`); process.exit(2) }
  const body = await r.json()
  return body.scene || body
}

const put = async (scene) => {
  const r = await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ scene }) })
  if (!r.ok) { console.error(`PUT → ${r.status} ${await r.text().catch(() => '')}`); process.exit(2) }
}

if (restore) {
  const saved = JSON.parse(readFileSync(restore, 'utf8'))
  const scene = saved.scene || saved
  const n = (scene.objects || []).filter(isCrossing).length
  if (dry) { console.log(`would restore ${n} crossings to ${tier} from ${restore}`); process.exit(0) }
  await put(scene)
  console.log(`restored ${n} crossings to ${tier}`)
  process.exit(0)
}

const scene = await get()
const objects = scene.objects || []
const crossings = objects.filter(isCrossing)
const kept = crossings.filter((o) => keep.has(o.id))

console.log(`${tier}: ${crossings.length} crossings, ${objects.length} objects total`)
for (const c of crossings) console.log(`  ${keep.has(c.id) ? 'keep  ' : 'clear '} ${c.id}  ${JSON.stringify(c.data || '')}`)

if (dry) { console.log(`\ndry run — nothing written. Would leave ${kept.length}.`); process.exit(0) }

const dir = join(homedir(), 'di-backups', 'field')
mkdirSync(dir, { recursive: true })
// slice(0,15) left a trailing dot on the second, so the first two real backups
// are named `…120657..json`. Harmless, but these filenames are the undo path
// and an undo path should not look like a typo.
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
const backup = join(dir, `br-id-ge-${tier}-${stamp}.json`)
writeFileSync(backup, JSON.stringify({ scene }, null, 2))
console.log(`\nbacked up → ${backup}`)

scene.objects = objects.filter((o) => !isCrossing(o) || keep.has(o.id))
await put(scene)

const after = await get()
const left = (after.objects || []).filter(isCrossing)
console.log(`cleared. ${left.length} crossings left on ${tier}.`)
console.log(`\nto undo:\n  node scripts/clear-field.mjs --restore ${backup} --tier ${tier}`)
