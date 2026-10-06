// Does the token serverXR MINTS open in the verifier di.bo ACTUALLY RUNS?
//
// docs/tunnel-vector.json makes both suites agree with a fixed string, which
// catches a changed byte layout. This catches the rest: it loads the real
// serverXR route handler and the real di.bo verifier, in one process, and puts
// a token through both. Same slot as contract.mjs, which checks di.bo against
// the field's real HTML — a check that has to reach across a repo boundary
// cannot live in either side's CI, so it is run by hand and named in the docs.
//
//   node scripts/tunnel-crosscheck.mjs [--dii /path/to/di.iiii]
//
// Neither repo's tests can fail the way this can: both were green on the day
// the field and the keeper could not hear each other, twice, because each side
// only ever asserted that it agreed with itself.

import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readToken } from '../tunnel.mjs'

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const DII = arg('dii', process.env.DII_PATH || '../di.iiii')
const ROUTE = join(DII, 'serverXR/src/routes/inscriptionRoutes.js')

if (!existsSync(ROUTE)) {
  console.error(`no serverXR at ${ROUTE}\npass --dii /path/to/di.iiii (or a worktree holding the tunnel branch)`)
  process.exit(2)
}

const require = createRequire(import.meta.url)
const { registerInscriptionRoutes } = require(ROUTE)

const SECRET = 'crosscheck-secret-neither-side-ships'
const INSC = 'insc-a012122a-cbfa-4155-84e1-69d0a532c251'
const PROOF = 'a-real-looking-proof-from-a-crossing'
const sha256 = (v) => createHash('sha256').update(v, 'utf8').digest('hex')

const routes = {}
const router = { get() {}, post(p, ...h) { routes[p] = h }, put() {}, delete() {}, use() {} }
registerInscriptionRoutes(router, {
  appendOpsHistory: async () => {},
  applySceneOps: (s) => s,
  blankScene: { objects: [] },
  broadcastLiveEvent: () => {},
  ensureSpaceScene: async () => {},
  ensureSpaceWritable: async () => {},
  getSpacePaths: () => ({ scenePath: '/dev/null' }),
  loadSpaceMeta: async () => ({ openInscriptions: true, isPublic: true, sceneVersion: 1 }),
  maxOpHistory: 10,
  normalizeSpaceId: (id) => id,
  readJson: async () => ({ objects: [{ id: INSC, proofHash: sha256(PROOF), data: 'YN · skin' }] }),
  upsertSpaceMeta: async () => {},
  writeJson: async () => {},
  tunnelSecret: SECRET,
  tunnelBotUsername: 'diiii111bot',
})

const key = '/api/spaces/:spaceId/inscriptions/:id/tunnel'
if (!routes[key]) {
  console.error(`serverXR does not register ${key} — the mint is not on this branch`)
  process.exit(1)
}

const call = async (body) => {
  const handlers = routes[key]
  let out = null
  const res = { code: 200, json(b) { out = b; return this }, status(c) { this.code = c; return this } }
  await handlers[handlers.length - 1]({ params: { spaceId: 'br_id_ge', id: INSC }, body }, res, (e) => { throw e })
  return { code: res.code, body: out }
}

let failed = 0
const ok = (label, pass, detail = '') => {
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!pass) failed += 1
}

const minted = await call({ proof: PROOF })
ok('serverXR mints for a real proof', minted.body?.ok === true, minted.body?.token)

const seen = readToken(minted.body?.token, SECRET)
ok('di.bo opens what serverXR minted', seen.ok === true, seen.reason || '')
ok('and it names the right crossing', seen.insc === INSC, seen.insc || '(none)')

ok('the url is the finished deep link',
   minted.body?.url === `https://t.me/diiii111bot?start=${minted.body?.token}`, minted.body?.url)

ok('di.bo refuses it under any other secret',
   readToken(minted.body?.token, 'a-different-secret').ok === false)

const noProof = await call({})
ok('serverXR refuses a request carrying only the public id', noProof.code === 400)

const wrongProof = await call({ proof: 'not-the-proof' })
ok('serverXR refuses a proof that does not match', wrongProof.code === 403)

console.log(failed ? `\n${failed} failed — THE TWO HALVES DISAGREE\n` : '\nthe two halves agree\n')
process.exit(failed ? 1 : 0)
