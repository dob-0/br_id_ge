// Is the tunnel deployed on this tier, and is it switched on?
//
//   node scripts/tunnel-state.mjs            both tiers
//   node scripts/tunnel-state.mjs --tier prod
//
// Answers without holding the secret and without touching anything: it POSTs a
// syntactically valid but nonexistent crossing with a junk proof, and reads
// which refusal comes back. Three states, three different answers, and they are
// distinguishable — which is the only reason this is worth running.
//
//   "Unauthorized"    the route is NOT on this tier; the request fell through
//                     to the /api auth gate registered below the open routes
//   "Not found."      the route is there and INERT — TUNNEL_SHARED_SECRET unset
//   anything else     the route is there and SWITCHED ON (it got far enough to
//                     judge the crossing rather than refusing to exist)
//
// Written because "I set the variable and restarted" is not evidence: the
// compose environment block is an allow-list, and for one merge the secret
// could be set correctly in .env and still never reach the container. A check
// that reads the running service is the only one that cannot be fooled by that.

const TIERS = {
  staging: 'https://staging.di-studio.xyz',
  prod: 'https://di-studio.xyz',
}

const argv = process.argv.slice(2)
const pick = argv.indexOf('--tier')
const chosen = pick >= 0 && argv[pick + 1] ? [argv[pick + 1]] : Object.keys(TIERS)

// A real uuid shape, deliberately all zeros: it can never be a crossing, so the
// probe can never touch anyone's.
const NOBODY = 'insc-00000000-0000-4000-8000-000000000000'

for (const tier of chosen) {
  const base = TIERS[tier]
  if (!base) { console.log(`${tier.padEnd(8)} unknown tier`); continue }
  const url = `${base}/serverXR/api/spaces/br_id_ge/inscriptions/${NOBODY}/tunnel`
  let code = 0
  let body = ''
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof: 'probe-not-a-real-proof' }),
      signal: AbortSignal.timeout(15000),
    })
    code = r.status
    body = (await r.text()).slice(0, 200)
  } catch (e) {
    console.log(`${tier.padEnd(8)} unreachable — ${e.message}`)
    continue
  }

  const state = /Unauthorized/.test(body) ? 'NOT DEPLOYED — the mint is not on this tier'
    : /"Not found\."/.test(body) ? 'deployed, SWITCHED OFF — no TUNNEL_SHARED_SECRET'
    : 'deployed and SWITCHED ON'
  console.log(`${tier.padEnd(8)} ${state}`)
  console.log(`${''.padEnd(8)}   ${code} ${body}`)
}
