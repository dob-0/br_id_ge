// The live rehearsal: cross the bridge, mint a tunnel link with the proof, check
// the link is real, then unmake the crossing so the field is left as it was.
//
//   node scripts/tunnel-live.mjs                    staging (default)
//   node scripts/tunnel-live.mjs --tier prod --yes  production, and it will say so
//
// NEEDS NO SECRET. The token's inscription id and expiry are readable by anyone
// — only the HMAC needs the key — so this can prove the mint bound the right
// crossing, for the right length of time, in the right alphabet, without ever
// holding TUNNEL_SHARED_SECRET. What it cannot prove is that the signature
// verifies; scripts/tunnel-crosscheck.mjs proves that against the real
// verifier, and the two together cover the whole path except Telegram itself.
//
// It writes to the field it is pointed at, so it cleans up after itself with
// the same proof-of-authorship a visitor would use to unmake their own core.
// If the unmake fails it says so LOUDLY — a rehearsal that silently leaves a
// fake crossing standing in a real field is worse than no rehearsal.

const TIERS = {
  staging: 'https://staging.di-studio.xyz',
  prod: 'https://di-studio.xyz',
}

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const tier = arg('tier', 'staging')
const base = TIERS[tier]
if (!base) { console.error(`unknown tier: ${tier}`); process.exit(2) }
if (tier === 'prod' && !argv.includes('--yes')) {
  console.error('prod places a real core in the live field, briefly, in front of anyone watching.\nre-run with --yes if that is what you mean.')
  process.exit(2)
}

const API = `${base}/serverXR/api/spaces/br_id_ge`
let failed = 0
const ok = (label, pass, detail = '') => {
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!pass) failed += 1
}
const post = async (path, body) => {
  const r = await fetch(`${API}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(20000),
  })
  return { code: r.status, body: await r.json().catch(() => ({})) }
}

console.log(`the tunnel, rehearsed on ${tier} — ${base}\n`)

// 1. cross
const crossed = await post('/inscriptions', { name: 'rehearsal', word: 'rehearsal' })
ok('a crossing can be made', crossed.code === 201 && Boolean(crossed.body.proof), `${crossed.code}`)
if (!crossed.body?.proof) {
  console.log('\ncannot rehearse without a crossing to mint against\n')
  process.exit(1)
}
const { id, proof } = crossed.body
console.log(`       ${id}`)

let unmade = false
try {
  // 2. mint
  const minted = await post(`/inscriptions/${encodeURIComponent(id)}/tunnel`, { proof })
  if (minted.code === 404 && /Not found/.test(JSON.stringify(minted.body))) {
    ok('the tunnel is switched on', false, 'the route is inert — TUNNEL_SHARED_SECRET is not set on this tier')
  } else {
    ok('the mint answers for a real proof', minted.code === 200 && minted.body.ok === true, `${minted.code}`)
    const token = String(minted.body.token || '')
    ok('the token is 50 chars in Telegram\'s alphabet',
       token.length === 50 && /^[A-Za-z0-9_-]+$/.test(token), `${token.length} chars`)

    // The id and expiry are plaintext in the token — no secret needed to read
    // them, which is exactly why the HMAC is what carries the binding.
    const raw = Buffer.from(token, 'base64url')
    ok('it is version 1 and 37 bytes', raw.length === 37 && raw[0] === 1, `${raw.length} bytes, v${raw[0]}`)
    const hex = raw.subarray(1, 17).toString('hex')
    const named = `insc-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    ok('it names the crossing that was just made', named === id, named)

    const mins = raw.readUInt32BE(17) - Math.floor(Date.now() / 60000)
    ok('it expires in about 24 hours', mins > 23 * 60 && mins <= 24 * 60, `${mins} minutes`)
    ok('the url is the finished deep link',
       minted.body.url === `https://t.me/${new URL(minted.body.url || 'https://x/y').pathname.slice(1)}?start=${token}`,
       minted.body.url)

    // 3. the negative, on the live route rather than in a unit test
    const forged = await post(`/inscriptions/${encodeURIComponent(id)}/tunnel`, { proof: 'not-the-proof' })
    ok('a wrong proof is refused by the live route', forged.code === 403, `${forged.code}`)
    const bare = await post(`/inscriptions/${encodeURIComponent(id)}/tunnel`, {})
    ok('the public id alone buys nothing', bare.code === 400, `${bare.code}`)
  }
} finally {
  // 4. leave the field as it was found
  const gone = await fetch(`${API}/inscriptions/${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proof }), signal: AbortSignal.timeout(20000),
  }).then((r) => r.ok).catch(() => false)
  unmade = gone
  ok('the rehearsal unmakes its own crossing', gone)
  if (!gone) {
    console.error(`\n!! ${id} IS STILL STANDING IN THE ${tier.toUpperCase()} FIELD — unmake it by hand`)
  }
}

console.log(failed ? `\n${failed} failed\n` : `\nthe tunnel is real on ${tier}\n`)
process.exit(failed ? 1 : 0)
