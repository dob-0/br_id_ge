// The contract between the keeper and the field it listens to. (Moved from di-bo
// on 2026-10-07, master 91268bd; "di.bo" below is the keeper's mesh name.)
//
// test.mjs cannot catch a drift like this, and did not: it asserts di.bo agrees
// with di.bo. Twice now the two halves of the room have been separately correct
// and jointly silent —
//
//   the token   the matcher wanted 'ՊԱՀԱՊԱՆ→' while the field composed
//               'պահապան ' (different Armenian codepoints, no arrow)
//   the channel the field published on 'talk' while di.bo listened on
//               'bridge:talk'
//
// — and in both cases every unit test passed while a visitor stood in front of
// a keeper that could not hear them. So this file reads the field HTML that is
// ACTUALLY SERVED and checks di.bo against it. It needs the network and a token
// on purpose: a contract test that can pass without the other side present is
// the thing that already failed.
//
//   node keeper/contract.mjs --tier staging        # what staging serves right now
//   node keeper/contract.mjs --file field.html
//
// Run it before deploying a change to either side.

import { readFile } from 'node:fs/promises'
import { addressed, stripAddress, TALK_CHANNEL, ASK_CHANNEL } from './keeper.mjs'

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1] }

// Channels di.bo knows about. The field may publish presence frames di.bo does
// not act on — that is fine — but a channel NOBODY on this side has heard of is
// how a room goes quiet, so it is a failure, not a warning.
const KNOWN = new Set([TALK_CHANNEL, `${TALK_CHANNEL}:here`, `${TALK_CHANNEL}:gone`, `${TALK_CHANNEL}:who`, ASK_CHANNEL, 'keeper', 'keeper:say'])

let failed = 0
const ok = (label, pass, detail = '') => {
  if (!pass) failed++
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${label}${detail && !pass ? ` — ${detail}` : ''}`)
}

async function fieldHtml() {
  const file = arg('--file')
  if (file) return { source: file, html: await readFile(file, 'utf8') }

  const tier = arg('--tier', 'staging')
  const base = process.env[tier === 'prod' ? 'PROD_API_BASE' : 'LIVE_API_BASE']
    || (tier === 'prod' ? 'https://di-studio.xyz/serverXR' : 'https://staging.di-studio.xyz/serverXR')
  const token = process.env[tier === 'prod' ? 'PROD_API_TOKEN' : 'LIVE_API_TOKEN'] || process.env.API_TOKEN
  if (!token) {
    console.error(`no token for ${tier}. Source di.iiii/serverXR/.env.local first:`)
    console.error('  set -a && . ../di.iiii/serverXR/.env.local; set +a')
    process.exit(2)
  }
  const url = `${base}/api/projects/br-id-ge-field/document`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!r.ok) { console.error(`GET ${url} → ${r.status}`); process.exit(2) }
  const doc = (await r.json()).document
  const files = doc?.presentationState?.codeFiles || []
  const entry = files.find((f) => (f.name || f.path || '').endsWith('field.html')) || files[0]
  if (!entry) { console.error('no code files on the served document'); process.exit(2) }
  return { source: `${tier}: ${url}`, html: String(entry.content ?? entry.code ?? '') }
}

const { source, html } = await fieldHtml()
console.log(`\nthe field ↔ di.bo contract\n  ${source}\n`)

// A page that failed to load reads as a page with no violations. Prove it is
// the field before believing anything it does not say.
ok('the field actually loaded', html.length > 5000 && /pub\s*\(/.test(html), `${html.length} bytes`)

// ── channels ──────────────────────────────────────────────────────────────
const published = [...html.matchAll(/\bpub\s*\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
const unique = [...new Set(published)]
ok('the field publishes at all', unique.length > 0, 'no pub() calls found')
ok(`the field speaks on '${TALK_CHANNEL}'`, unique.includes(TALK_CHANNEL), `it publishes: ${unique.join(', ')}`)
for (const c of unique) ok(`di.bo knows the channel '${c}'`, KNOWN.has(c), 'nothing on this side listens to it')

// ── the address ───────────────────────────────────────────────────────────
// The field carries its own ADDR list and its own addressed(). Two implementations
// of one rule will drift; what has to hold is that di.bo accepts EVERYTHING the
// field marks as addressed. di.bo may be more forgiving — someone typing by hand
// gets punctuation and capitals wrong — but never less.
const addrMatch = html.match(/ADDR\s*=\s*\[([^\]]+)\]/)
ok('the field declares its aliases', Boolean(addrMatch))
const aliases = addrMatch ? [...addrMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]) : []
for (const a of aliases) {
  ok(`di.bo hears '${a}' alone`, addressed(a))
  ok(`di.bo hears '${a} what is a core?'`, addressed(`${a} what is a core?`))
  ok(`and takes the alias off '${a}'`, stripAddress(`${a} what is a core?`) === 'what is a core?')
}

// The button prepends a literal. Find what it really prepends rather than
// trusting the alias list — the button is the one-tap path most visitors use.
const prepends = [...html.matchAll(/kIn\.value\s*=\s*['"]([^'"]+)['"]\s*\+/g)].map((m) => m[1])
ok('the address button prepends something', prepends.length > 0)
for (const p of prepends) {
  ok(`di.bo hears what the button composes: ${JSON.stringify(p)}`, addressed(`${p}what is a core?`))
  ok('and it survives the strip', stripAddress(`${p}what is a core?`) === 'what is a core?')
}

// ── the kept room ─────────────────────────────────────────────────────────
// Two states are coherent and both must pass, because a tier that has not been
// switched on yet is not broken:
//
//   the old room   does not ask for history, and still says words are not kept
//   the kept room  asks for history, handles the history FRAME, reads line ids,
//                  and the impermanence promise is gone from the page
//
// What fails is either mixture, and the dangerous one is real: a page that keeps
// history while still telling people it doesn't is a lie in the product, and it
// is exactly the lie the person least able to afford it would believe.
const asksHistory = /cmd\s*:\s*['"]history['"]/.test(html)
const knowsFrame = /['"]mesh:history['"]/.test(html)
const readsLines = /\.lines\b/.test(html)
// The dead promise, matched loosely enough to catch a re-wording of it.
const promisesGone = /live\s+only\s+while\s+the\s+room\s+is\s+open/i.test(html)

if (asksHistory || knowsFrame || promisesGone === false) {
  ok('the field asks the hub for history', asksHistory, 'it never sends {cmd:\'history\'}')
  ok('and handles the history FRAME, not a flag on a live event', knowsFrame,
     'nothing on the page mentions mesh:history — a replay would arrive unread')
  ok('and reads the lines it is given', readsLines, 'the history payload is never opened')
  ok('the impermanence promise is gone from the page', promisesGone === false,
     'the room still tells people their words are not kept, while the hub keeps them')

  // Decision (a): the uncrossed ask is a public line in the one conversation.
  // The failure this guards is specific and was nearly shipped — the ANSWER
  // rendering for everyone while the QUESTION stays hidden, so the room fills
  // with the keeper replying to nobody. Both paths must render the ask: the
  // live one and the replay one. One of the two is exactly how you get a room
  // that reads whole tonight and full of half-conversations tomorrow.
  // Only comparisons that OPEN a branch. An earlier version of this counted
  // every `channel === 'keeper:ask'` and passed a field with its replay branch
  // deleted, because the kept-channel filter mentions the channel too — the
  // check was counting the page's opinion about the channel rather than its
  // handling of it.
  const askBranches = [...html.matchAll(/(?:else\s+)?if\s*\(\s*\w+\.channel\s*===\s*['"]keeper:ask['"]/g)].length
  const asideStillPromised = /(seen by the keeper and by nobody else|only the keeper sees)/i.test(html)
  ok('the uncrossed ask renders live AND in replay', askBranches >= 2,
     `${askBranches} branch(es) — an answer whose question nobody sees is worse than either choice`)
  ok('and the page no longer promises the ask is unseen', asideStillPromised === false,
     'the uncrossed are still told nobody else sees their line, while the room shows it')
} else {
  ok('the old room is consistent: nothing kept, nothing promised otherwise',
     !asksHistory && !knowsFrame && promisesGone)
  console.log('  ..   this field predates the kept room — replay checks skipped, and it SAID so')
}

console.log(failed ? `\n${failed} failed — the room would be silent\n` : '\nthe two halves agree\n')
process.exit(failed ? 1 : 0)
