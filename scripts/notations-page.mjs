#!/usr/bin/env node
/**
 * notations-page.mjs — the readable face of the festival.
 *
 * Renders docs/notations/programme.json into ONE static page: the numbers, the
 * two days as they ran, all 62 works with their posters, the co-authorship
 * matrix, and the building. Everything is pre-rendered — no client-side fetch —
 * so it reads the same inside a published di.iiii iframe as it does on disk.
 *
 * It is the landing of the SAME project that holds the spatial festival
 * (`n2-hub`): "enter the field" calls window.diiEnterExhibition(), the recordar
 * pattern, and the viewer swaps this document's code view for its scene.
 *
 * Usage:
 *   node scripts/notations-page.mjs                    # → build/notations/index.html
 *   node scripts/notations-page.mjs --push [--to <url>] [--token <t>]
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROGRAMME = path.join(ROOT_DIR, 'docs', 'notations', 'programme.json')
const OUT = path.join(ROOT_DIR, 'build', 'notations', 'index.html')
const SPACE_ID = 'br-id-ge'
const HUB_ID = 'n2-hub'
const PREFIX = 'n2-'

const args = { push: false, to: null, token: null, prod: false }
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i]
  if (a === '--push') args.push = true
  else if (a === '--prod') args.prod = true
  else if (a === '--to') args.to = process.argv[++i]
  else if (a === '--token') args.token = process.argv[++i]
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const slugify = (s) => s.normalize('NFKD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

const DAY_NAMES = { '2026-07-24': '24 July', '2026-07-30': '30 July', '2026-08-01': '1 August', '2026-08-02': '2 August' }

// esora's description field is mostly the room name and the credits again — the
// card already carries both. Keep only the lines that actually say something,
// or the grid fills with its own echo.
const cleanDesc = (e) => {
  const names = new Set([...e.artists, ...e.curators].map((n) => n.toLowerCase()))
  const kept = (e.desc || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => {
      const low = l.toLowerCase()
      if (e.room && low === e.room.toLowerCase()) return false
      if (/^(by|curated by|curator)\b/i.test(l)) return false
      if (names.has(low)) return false
      // a line that is mostly names in a row, e.g. "Kino Pinto, Lerk, Embers"
      const parts = low.split(/[,·|]/).map((p) => p.trim()).filter(Boolean)
      if (parts.length > 1 && parts.filter((p) => names.has(p)).length / parts.length > 0.5) return false
      return true
    })
    .join(' ')
  return kept.length > 60 ? kept : ''
}
const timeOf = (iso) => (iso || '').split('T')[1]?.slice(0, 5) || ''
const dayOf = (iso) => (iso || '').slice(0, 10)

const load = async () => {
  const raw = JSON.parse(await fs.readFile(PROGRAMME, 'utf8'))
  const seen = new Map()
  return raw.map((e) => {
    const base = PREFIX + (slugify(e.work || e.title) || `work-${e.id.slice(0, 6)}`)
    const n = (seen.get(base) || 0) + 1
    seen.set(base, n)
    return { ...e, projectId: n === 1 ? base : `${base}-${n}`, isWork: e.artists.length > 0 }
  })
}

// ------------------------------------------------------------------ sections

const statRow = (works, people, venues, rooms) => `
<section class="stats" id="numbers">
  ${[
    [works.length, 'works'],
    [people, 'named people'],
    [venues, 'venues'],
    [rooms, 'named rooms'],
    ['2', 'festival days'],
    ['12', 'lab days'],
  ].map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}
</section>`

const daysSection = (works) => {
  const byDay = new Map()
  for (const w of works) {
    const d = dayOf(w.start)
    if (!byDay.has(d)) byDay.set(d, [])
    byDay.get(d).push(w)
  }
  const days = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]))

  return `
<section id="days">
  <h2>The days</h2>
  <p class="lede">Two of the twelve carried almost everything: 42 works opened on 1 August, 18 more on 2 August.
     Times are as the programme ran them — an installation holds its room all day, a performance takes a slot.</p>
  ${days.map(([d, list]) => {
    const byVenue = new Map()
    for (const w of list) {
      const v = w.venue || '—'
      if (!byVenue.has(v)) byVenue.set(v, [])
      byVenue.get(v).push(w)
    }
    return `
  <div class="day">
    <h3>${esc(DAY_NAMES[d] || d)} <span class="count">${list.length} works</span></h3>
    ${[...byVenue.entries()].sort((a, b) => b[1].length - a[1].length).map(([venue, ws]) => `
    <div class="venue-block">
      <div class="venue-name">${esc(venue)}</div>
      <ol class="slots">
        ${ws.sort((a, b) => (a.start || '').localeCompare(b.start || '')).map((w) => `
        <li>
          <span class="t">${esc(timeOf(w.start))}</span>
          <a class="w" href="/${SPACE_ID.replace(/-/g, '_')}/${w.projectId}">${esc(w.work || w.title)}</a>
          <span class="by">${esc(w.artists.join(' · '))}</span>
          <span class="rm">${esc([w.room, w.form].filter(Boolean).join(' · ').toLowerCase())}</span>
        </li>`).join('')}
      </ol>
    </div>`).join('')}
  </div>`
  }).join('')}
</section>`
}

const worksSection = (works) => `
<section id="works">
  <h2>The works</h2>
  <p class="lede">All ${works.length} of them, in the order the programme listed them. Every one has a room of its own —
     the title is the link, and that link is what an artist can send to anybody.</p>
  <div class="grid">
    ${works.map((w) => `
    <article class="card" id="w-${esc(w.projectId)}">
      ${w.image ? `<a class="shot" href="/${SPACE_ID.replace(/-/g, '_')}/${w.projectId}"><img loading="lazy" src="${esc(w.image)}" alt=""></a>` : '<div class="shot noshot"></div>'}
      <h4><a href="/${SPACE_ID.replace(/-/g, '_')}/${w.projectId}">${esc(w.work || w.title)}</a></h4>
      <p class="by">${esc(w.artists.join(' · '))}</p>
      ${w.curators.length ? `<p class="cur">curated by ${esc(w.curators.join(' · '))}</p>` : ''}
      <p class="meta">${esc([w.venue, w.room, w.form].filter(Boolean).join(' · ').toLowerCase())}</p>
      ${cleanDesc(w) ? `<p class="desc">${esc(cleanDesc(w).slice(0, 200))}${cleanDesc(w).length > 200 ? '…' : ''}</p>` : ''}
    </article>`).join('')}
  </div>
</section>`

// The lab's output is not 62 separate objects, it is a graph. A matrix says that
// faster than any prose — but only if it is SORTED. Left in programme order the
// filled cells scatter and read as noise. So both axes are seriated: columns by
// venue, then by the average position of their authors; rows by the average
// position of their works. Two passes are enough to pull the collaborating
// clusters onto the diagonal, where the eye finds them without being told.
const seriate = (works, multi) => {
  let cols = works.map((w, i) => ({ w, i }))
  let rows = multi.map(([person, ws]) => ({ person, ws, i: 0 }))
  const colKey = (c) => `${c.w.venue || ''}`

  for (let pass = 0; pass < 4; pass++) {
    const colPos = new Map(cols.map((c, i) => [c.w.id, i]))
    rows = rows
      .map((r) => ({ ...r, i: r.ws.reduce((s, w) => s + (colPos.get(w.id) ?? 0), 0) / r.ws.length }))
      .sort((a, b) => a.i - b.i || b.ws.length - a.ws.length)
    const rowPos = new Map(rows.map((r, i) => [r.person, i]))
    cols = cols
      .map((c) => {
        const mine = c.w.artists.map((a) => rowPos.get(a)).filter((v) => v !== undefined)
        return { ...c, i: mine.length ? mine.reduce((s, v) => s + v, 0) / mine.length : Infinity }
      })
      // venue stays the outer grouping — the building is the thing people remember
      .sort((a, b) => colKey(a).localeCompare(colKey(b)) || a.i - b.i)
  }
  return { cols, rows }
}

const matrixSection = (works, multi, peopleCount) => {
  const { cols, rows } = seriate(works, multi)
  const venueRun = []
  for (const c of cols) {
    const v = c.w.venue || '—'
    if (venueRun.length && venueRun[venueRun.length - 1].venue === v) venueRun[venueRun.length - 1].span++
    else venueRun.push({ venue: v, span: 1 })
  }
  const isEdge = new Set()
  let acc = 0
  for (const r of venueRun) { acc += r.span; isEdge.add(acc - 1) }

  return `
<section id="together">
  <h2>Who made what with whom</h2>
  <p class="lede">${multi.length} of the ${peopleCount} named people appear in
     more than one work. Each row is a person, each column one of the ${works.length} works. Both axes are sorted so that
     people who worked together end up next to each other — the blocks along the diagonal are the festival's real
     working groups, and they do not respect the boundaries between works.</p>
  <div class="matrix-wrap">
    <table class="matrix">
      <thead>
        <tr><th></th>${venueRun.map((r) => `<td class="vhead" colspan="${r.span}"><span>${esc(r.venue)}</span></td>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows.map((r) => `
        <tr>
          <th scope="row">${esc(r.person)}<i>${r.ws.length}</i></th>
          ${cols.map((c, ci) => {
            const on = r.ws.some((x) => x.id === c.w.id)
            const edge = isEdge.has(ci) ? ' edge' : ''
            return `<td class="${on ? 'on' : ''}${edge}"${on ? ` title="${esc(r.person)} — ${esc(c.w.work || c.w.title)}"` : ''}></td>`
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>`
}

const roomsSection = (works) => {
  const byVenue = new Map()
  for (const w of works) {
    const v = w.venue || '—'
    if (!byVenue.has(v)) byVenue.set(v, new Map())
    const r = w.room || 'unplaced'
    const rooms = byVenue.get(v)
    if (!rooms.has(r)) rooms.set(r, [])
    rooms.get(r).push(w)
  }
  return `
<section id="rooms">
  <h2>The building</h2>
  <p class="lede">The Philharmonia's rooms are named in Armenian and transliterated on the programme. This is the
     spatial index — what stood where.</p>
  <div class="rooms">
    ${[...byVenue.entries()].sort((a, b) => [...b[1].values()].flat().length - [...a[1].values()].flat().length).map(([venue, rooms]) => `
    <div class="venue-col">
      <h3>${esc(venue)}</h3>
      ${[...rooms.entries()].sort((a, b) => b[1].length - a[1].length).map(([room, ws]) => `
      <div class="room">
        <div class="room-name">${esc(room.toLowerCase())}</div>
        <ul>${ws.map((w) => `<li><a href="/${SPACE_ID.replace(/-/g, '_')}/${w.projectId}">${esc(w.work || w.title)}</a></li>`).join('')}</ul>
      </div>`).join('')}
    </div>`).join('')}
  </div>
</section>`
}

const restSection = (rest) => `
<section id="also">
  <h2>Also on the record</h2>
  <p class="lede">Programme entries with no named authorship — lectures, room programmes, the festival pass.
     They stay in the record without a room of their own.</p>
  <ul class="plain">
    ${rest.map((e) => `<li><span class="t">${esc(DAY_NAMES[dayOf(e.start)] || dayOf(e.start))} ${esc(timeOf(e.start))}</span> ${esc(e.title)} <span class="rm">${esc(e.venue || '')}</span></li>`).join('')}
  </ul>
</section>`

// ---------------------------------------------------------------------- page

const page = (entries) => {
  const works = entries.filter((e) => e.isWork)
  const rest = entries.filter((e) => !e.isWork)

  const byPerson = new Map()
  for (const w of works) for (const a of w.artists) {
    if (!byPerson.has(a)) byPerson.set(a, [])
    byPerson.get(a).push(w)
  }
  const multi = [...byPerson.entries()].filter(([, ws]) => ws.length > 1).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
  const rooms = new Set(works.filter((w) => w.room).map((w) => `${w.venue} / ${w.room}`))
  const venues = new Set(works.map((w) => w.venue).filter(Boolean))

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>br_id_ge XR_ Notations:vi.ritual — the record</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Armenian:wght@300;400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{
  --paper:#f3f1ec; --ink:#131313; --graphite:#8f8b83; --hairline:#dcd8cf;
  --live:#1d4bff;
  --arm:'Noto Serif Armenian',Georgia,serif;
  --mono:'Space Mono',ui-monospace,Menlo,monospace;
}
*{box-sizing:border-box}
html,body{margin:0;background:var(--paper);color:var(--ink)}
body{font-family:var(--arm);font-weight:300;line-height:1.45;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
a:hover{color:var(--live)}

/* chrome is mono, lowercase, letterspaced */
.mono,nav,.t,.rm,.meta,.cur,.count,.stat span,.venue-name,.room-name,footer{
  font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:lowercase;color:var(--graphite)}

header{padding:56px 24px 28px;border-bottom:1px solid var(--hairline)}
.wrap{max-width:1180px;margin:0 auto}
h1{font-family:var(--arm);font-weight:400;font-size:clamp(34px,7vw,76px);line-height:1;margin:0 0 14px;letter-spacing:-.01em}
.sub{font-family:var(--mono);font-size:13px;letter-spacing:.16em;color:var(--live);margin:0 0 10px}
.where{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--graphite);margin:0}
.enter{margin-top:26px;display:flex;gap:10px;flex-wrap:wrap}
.enter button,.enter a.btn{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:lowercase;
  background:none;border:1px solid var(--ink);color:var(--ink);padding:9px 16px;cursor:pointer}
.enter button:hover,.enter a.btn:hover{background:var(--ink);color:var(--paper)}
.enter .primary{border-color:var(--live);color:var(--live)}
.enter .primary:hover{background:var(--live);color:var(--paper)}

nav{position:sticky;top:0;z-index:5;background:var(--paper);border-bottom:1px solid var(--hairline);padding:10px 24px}
nav .wrap{display:flex;gap:22px;flex-wrap:wrap}

section{padding:52px 24px;border-bottom:1px solid var(--hairline);max-width:1180px;margin:0 auto}
h2{font-weight:400;font-size:clamp(22px,3vw,32px);margin:0 0 10px;letter-spacing:-.01em}
h3{font-weight:400;font-size:19px;margin:30px 0 10px}
.lede{max-width:62ch;color:#3b3b3b;font-size:15px;margin:0 0 22px}

.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1px;background:var(--hairline);
  border:1px solid var(--hairline);padding:0}
.stat{background:var(--paper);padding:20px 16px;text-align:left}
.stat b{display:block;font-family:var(--arm);font-weight:400;font-size:34px;line-height:1}
.stat span{display:block;margin-top:6px}

.day{margin-bottom:14px}
.day h3{display:flex;align-items:baseline;gap:12px;border-bottom:1px solid var(--hairline);padding-bottom:8px}
.venue-block{margin:18px 0 24px}
.venue-name{margin-bottom:6px}
.slots{list-style:none;margin:0;padding:0}
.slots li{display:grid;grid-template-columns:56px minmax(180px,1.4fr) minmax(140px,1fr) minmax(120px,.8fr);
  gap:14px;padding:7px 0;border-top:1px solid var(--hairline);align-items:baseline}
.slots .w{font-size:16px}
.slots .by{font-size:13px;color:#3b3b3b}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:30px 22px;align-items:start}
.card .desc{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.card h4{font-weight:400;font-size:17px;margin:10px 0 4px;line-height:1.2}
.card .by{margin:0;font-size:13px;color:#3b3b3b}
.card .desc{margin:8px 0 0;font-size:12.5px;color:#4a4a4a}
.card .meta,.card .cur{margin:5px 0 0;display:block}
.shot{display:block;aspect-ratio:4/3;overflow:hidden;background:var(--hairline);border:1px solid var(--hairline)}
.shot img{width:100%;height:100%;object-fit:cover;display:block;
  filter:grayscale(1) contrast(1.04) brightness(1.02);transition:filter .35s}
.card:hover .shot img{filter:none}
.noshot{aspect-ratio:4/3}

.matrix-wrap{overflow-x:auto;border:1px solid var(--hairline);background:var(--paper)}
.matrix{border-collapse:collapse;font-family:var(--mono);font-size:10px}
.matrix th[scope=row]{position:sticky;left:0;background:var(--paper);text-align:left;font-weight:400;letter-spacing:.04em;
  padding:0 10px 0 8px;white-space:nowrap;border-right:1px solid var(--hairline);color:var(--ink)}
.matrix th i{color:var(--graphite);font-style:normal;margin-left:7px}
.matrix td{width:11px;height:11px;padding:0;border:1px solid rgba(0,0,0,.05)}
.matrix td.on{background:var(--ink)}
.matrix td.edge{border-right:1px solid var(--graphite)}
.matrix tr:hover td{background:rgba(29,75,255,.07)}
.matrix tr:hover td.on{background:var(--live)}
.matrix .vhead{height:auto;width:auto;border:0;border-bottom:1px solid var(--hairline);
  vertical-align:bottom;padding:0 0 5px}
.matrix .vhead span{display:block;writing-mode:vertical-rl;transform:rotate(180deg);
  font-size:9px;letter-spacing:.06em;color:var(--graphite);white-space:nowrap;padding-left:2px}

.rooms{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:28px}
.room{margin:0 0 16px}
.room ul{list-style:none;margin:4px 0 0;padding:0}
.room li{font-size:14px;padding:2px 0}
.plain{list-style:none;margin:0;padding:0}
.plain li{padding:7px 0;border-top:1px solid var(--hairline);font-size:14px;display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}

footer{padding:40px 24px 70px;max-width:1180px;margin:0 auto}
@media (max-width:640px){
  .slots li{grid-template-columns:48px 1fr;gap:4px 12px}
  .slots .rm{grid-column:2}
}
</style>

<header><div class="wrap">
  <p class="sub">կ_ա_մ_ու_ր_ջ &nbsp;XR_&nbsp; vi.ritual</p>
  <h1>Notations #2</h1>
  <p class="where">yerevan · lab 20–31 july · festival 1–2 august 2026 · hosted by hosq · theme: rituals</p>
  <div class="enter">
    <button class="primary" onclick="if(window.diiEnterExhibition)window.diiEnterExhibition()">enter the field →</button>
    <a class="btn" href="/br_id_ge/rite">cross the bridge</a>
    <a class="btn" href="/br_id_ge">the door</a>
  </div>
</div></header>

<nav><div class="wrap">
  <a href="#numbers">numbers</a><a href="#days">the days</a><a href="#works">the works</a>
  <a href="#together">who with whom</a><a href="#rooms">the building</a><a href="#also">also</a>
</div></nav>

<div class="wrap">
${statRow(works, byPerson.size, venues.size, rooms.size)}
${daysSection(works)}
${worksSection(works)}
${matrixSection(works, multi, byPerson.size)}
${roomsSection(works)}
${restSection(rest)}
</div>

<footer class="wrap">
  built from the official esora programme, which every participant was asked to check on 1 august —
  the closest thing to an authoritative record. corrections welcome: <em>matagh</em> is missing from it entirely,
  and several names are misspelled there.
</footer>
`
}

// --------------------------------------------------------------------- push

const loadEnvFile = async (p) => {
  try {
    const raw = await fs.readFile(p, 'utf8')
    const env = {}
    for (const line of raw.split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
    }
    return env
  } catch { return {} }
}

const push = async (html) => {
  const env = {
    ...(await loadEnvFile(path.join(ROOT_DIR, '..', 'di.iiii', 'serverXR', '.env.local'))),
  }
  const key = args.prod ? 'PROD' : 'LIVE'
  const live = (args.to || env[`${key}_API_URL`] || 'https://staging.di-studio.xyz/serverXR').replace(/\/+$/, '')
  const token = args.token || process.env[`${key}_API_TOKEN`] || env[`${key}_API_TOKEN`] || env.API_TOKEN || ''
  if (!token) { console.error('editor token required'); process.exitCode = 1; return }
  const H = { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const docUrl = `${live}/api/projects/${HUB_ID}/document`
  const got = await fetch(docUrl, { headers: H })
  if (!got.ok) { console.error(`  ✗ read ${HUB_ID}: HTTP ${got.status}`); process.exitCode = 1; return }
  const doc = (await got.json()).document

  // the page becomes the project's FACE; its scene stays underneath, one click away
  const next = {
    ...doc,
    presentationState: {
      ...(doc.presentationState || {}),
      mode: 'code',
      entryView: 'code',
      codeFiles: [{ name: 'index.html', content: html }],
    },
    publishState: { ...(doc.publishState || {}), shareEnabled: true },
  }
  const put = await fetch(docUrl, { method: 'PUT', headers: H, body: JSON.stringify(next) })
  console.log(put.ok ? `  ✓ ${HUB_ID} landing updated (${(html.length / 1024).toFixed(0)} KB)` : `  ✗ HTTP ${put.status}`)
  console.log(`\n  → ${live.replace(/\/serverXR$/, '')}/br_id_ge/${HUB_ID}`)
}

const main = async () => {
  const entries = await load()
  const html = page(entries)
  await fs.mkdir(path.dirname(OUT), { recursive: true })
  await fs.writeFile(OUT, html)
  console.log(`[page] ${entries.length} entries → ${path.relative(ROOT_DIR, OUT)} (${(html.length / 1024).toFixed(0)} KB)`)
  if (args.push) await push(html)
}

main().catch((e) => { console.error(e?.message || e); process.exitCode = 1 })
