// The glue: handleTunnelStart against the REAL field, end to end.
//
//   node keeper/scripts/tunnel-glue.mjs
//
// The unit tests cover the token and the store; tunnel-live.mjs covers the mint
// over the wire. NEITHER covers this — the part that looks the crossing up in
// the field, composes the greeting, and decides whether an arrival is a
// traveller, a returning traveller, or a stranger holding a forwarded link.
// That glue is what the first real person meets.
//
// Safe to run against production: `say` here only records what it was asked to
// send — there is no Telegram token in this process at all — and the store is a
// fresh temp dir, so no real binding is written. (Before 2026-10-07 this drove
// di.bo's bot.mjs; the same handler now lives in keeper/telegram.mjs.)
const { mkdtemp } = await import('node:fs/promises')
const { tmpdir } = await import('node:os')
const { mintToken, TunnelStore } = await import('../tunnel.mjs')
const { makeTunnelThreads } = await import('../telegram.mjs')
const { readField } = await import('../crossings.mjs')

const SECRET = 'a-secret-only-this-test-holds'
const tunnel = new TunnelStore(await mkdtemp(`${tmpdir()}/glue-`))
const sent = []
const { handleTunnelStart } = makeTunnelThreads({
  say: async (chat, text) => { sent.push({ chat, text }); return { message_id: sent.length } },
  ownerId: '900000001', secret: SECRET, store: tunnel, readField: () => readField(), log: { log() {}, error() {} },
})
process.env.TUNNEL_SHARED_SECRET = SECRET

let failed = 0
const ok = (l, p, d = '') => { console.log(`${p ? '  ok  ' : ' FAIL '} ${l}${d ? ` — ${d}` : ''}`); if (!p) failed++ }

const stones = await readField()
const real = stones[0]
console.log(`the real prod field holds ${stones.length}; using ${real.id} (${real.data})\n`)

const msg = (over = {}) => ({ chat: { id: 999001, type: 'private' }, from: { id: 999001, username: 'traveller' }, message_id: 1, ...over })

const good = mintToken(real.id, process.env.TUNNEL_SHARED_SECRET)
ok('a real token for a real crossing is taken as an arrival', await handleTunnelStart(msg(), good) === true)

const rec = await tunnel.read(real.id)
ok('it bound the crossing to that telegram account', rec?.tg_id === '999001', JSON.stringify(rec?.who))
ok('and remembered who they are', rec?.who === real.data, rec?.who)

ok('the same person arriving again is still an arrival', await handleTunnelStart(msg(), good) === true)

// the link travelled to someone else
ok('a different account on the same link is NOT taken in',
   await handleTunnelStart(msg({ chat: { id: 999002, type: 'private' }, from: { id: 999002 } }), good) === false)

const forged = mintToken(real.id, 'not-the-secret')
ok('a token signed with another secret falls through to the ordinary door',
   await handleTunnelStart(msg(), forged) === false)

const ghost = mintToken('insc-00000000-0000-4000-8000-000000000000', process.env.TUNNEL_SHARED_SECRET)
ok('a token for a crossing not in the field falls through',
   await handleTunnelStart(msg({ from: { id: 999003 }, chat: { id: 999003, type: 'private' } }), ghost) === false)

for (const junk of ['', 'nonsense', 'A'.repeat(64), good.slice(0, -1)]) {
  if (await handleTunnelStart(msg({ from: { id: 999004 }, chat: { id: 999004, type: 'private' } }), junk) !== false) {
    ok(`junk accepted: ${junk.slice(0, 10)}`, false); break
  }
}
ok('junk of every shape falls through without throwing', true)

console.log(failed ? `\n${failed} failed\n` : '\nthe glue holds\n')
process.exit(failed ? 1 : 0)
