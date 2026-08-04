#!/usr/bin/env node
/**
 * notations-space.mjs — turn docs/notations/programme.json into a di.iiii exhibition.
 *
 * Emits scene documents, the wcc pattern (portal hub → one project per work) with
 * recordar's single clean face in front:
 *   - one HUB project: the festival standing together — venue plinths, room clusters,
 *     one portal entity (mode: embed) per work
 *   - one project PER WORK: its own room — title, credits, time, place, a core
 *   - reachable at /br_id_ge/<projectId>, so every artist has one link to their own thing
 *
 * Build is offline and idempotent: same programme.json → same documents, same ids.
 *
 * Usage:
 *   node scripts/notations-space.mjs                       # write build/notations/*.json
 *   node scripts/notations-space.mjs --push [--to <url>] [--token <t>] [--only <slug>]
 *   node scripts/notations-space.mjs --push --seed-field   # + one core per work in the field
 *   node scripts/notations-space.mjs --push --dry-run      # show what push would do
 *   node scripts/notations-space.mjs --push --seed-field --prod   # the live door
 *
 * Auth: --token, else LIVE_/PROD_API_TOKEN (env or di.iiii/serverXR/.env.local).
 * Staging is the default tier — look at it there before anyone points prod at it.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PROGRAMME = path.join(ROOT_DIR, 'docs', 'notations', 'programme.json')
const OUT_DIR = path.join(ROOT_DIR, 'build', 'notations')
const SPACE_ID = 'br-id-ge'
const HUB_ID = 'n2-hub'
const PREFIX = 'n2-' // project ids are GLOBAL across di.iiii — namespace or collide

// the door's face, carried into three dimensions
const PAPER = '#f3f1ec'
const INK = '#131313'
const GRAPHITE = '#8f8b83'
const HAIRLINE = '#dcd8cf'
const LIVE = '#1d4bff'

const parseArgs = (argv) => {
  const a = { push: false, seedField: false, prod: false, dryRun: false, to: null, token: null, only: null, out: OUT_DIR }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--push') { a.push = true; continue }
    if (argv[i] === '--seed-field') { a.seedField = true; continue }
    if (argv[i] === '--prod') { a.prod = true; continue }
    if (argv[i] === '--dry-run') { a.dryRun = true; continue }
    if (argv[i] === '--to') { a.to = argv[++i]; continue }
    if (argv[i] === '--token') { a.token = argv[++i]; continue }
    if (argv[i] === '--only') { a.only = argv[++i]; continue }
    if (argv[i] === '--out') { a.out = path.resolve(argv[++i]); continue }
  }
  return a
}

// ---------------------------------------------------------------- shaping data

const slugify = (s) => s
  .normalize('NFKD')
  .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40)

// deterministic per-work seed — the same rule crossings use: a shape is yours forever
const hash = (s) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) / 4294967296
}

const fmtWhen = (e) => {
  if (!e.start) return ''
  const d = (iso) => {
    const [date, time] = iso.split('T')
    const [, m, day] = date.split('-')
    return { day: `${Number(day)}.${Number(m)}`, time: (time || '').slice(0, 5) }
  }
  const s = d(e.start)
  if (!e.end) return `${s.day} · ${s.time}`
  const t = d(e.end)
  return s.day === t.day ? `${s.day} · ${s.time}–${t.time}` : `${s.day} ${s.time} → ${t.day} ${t.time}`
}

const place = (e) => [e.venue, e.room].filter(Boolean).join(' · ')

const load = async () => {
  const raw = JSON.parse(await fs.readFile(PROGRAMME, 'utf8'))
  const seen = new Map()
  const entries = raw.map((e) => {
    const base = PREFIX + (slugify(e.work || e.title) || `work-${e.id.slice(0, 6)}`)
    const n = (seen.get(base) || 0) + 1
    seen.set(base, n)
    return { ...e, projectId: n === 1 ? base : `${base}-${n}`, isWork: e.artists.length > 0 }
  })
  return entries
}

// ------------------------------------------------------------ entity factories

const xf = (position, rotation = [0, 0, 0], scale = [1, 1, 1]) => ({ transform: { position, rotation, scale } })

const look = (color, extra = {}) => ({
  appearance: {
    color, opacity: 1, textureAssetId: null, roughness: 0.9, metalness: 0,
    emissive: '#000000', emissiveIntensity: 1, wireframe: false, ...extra,
  },
})

// Two renderers, two completely different objects from the same component:
//
//   walk view (LiveProjectScene) → a BILLBOARD that faces the visitor, stacking
//     per-line `lines` with their own sizes. Long text is fine; `maxWidth` wraps it.
//   orbit view (StudioViewport → Text2DObject) → `value` painted on a canvas at
//     64px and laid FLAT on the ground, scaled 0.02 m/px. Nothing wraps, nothing
//     shrinks: a 20-character title is a THIRTEEN-METRE plate lying in the field.
//
// Orbit is where a visitor lands. So `value` gets one short line, sized to a real
// width in metres by scaling the entity, and the full reading stays in `lines`
// for the walk. Anything long is walk-only — value '' draws nothing.
const CANVAS_SCALE = 0.02
const BASE_PX = 64
// canvas width ≈ chars × ~0.55em + 2×20px padding, back into metres
const flatWidth = (s) => ((s.length * BASE_PX * 0.55) + 40) * CANVAS_SCALE

// The two renderers cannot share one entity: the transform scale that sizes a
// flat plate would also shrink the walk-mode billboard to nothing. So each
// caption is authored twice — a plate for the plan view, a billboard for the
// walk — and each is invisible to the other renderer.
const textEntity = (id, name, position, value, lines, opts) => ({
  id, type: 'text', name, parentId: null,
  components: {
    ...xf(position, opts.rotation || [0, 0, 0], opts.scale || [1, 1, 1]),
    ...look(opts.color || lines[0]?.color || INK),
    // unauthored entities float by default — a caption must hold still
    animation: { mode: 'static', speed: 1, amplitude: 1 },
    text: {
      value,
      variant: '2d', billboard: Boolean(opts.billboard),
      fontFamily: opts.mono ? 'Space Mono, monospace' : 'Noto Serif Armenian, Georgia, serif',
      fontWeight: opts.weight || '400', fontStyle: 'normal', align: opts.align || 'center',
      fontSize3D: 0.3, depth3D: 0.06, font3D: 'helvetiker_regular',
      bevelEnabled3D: false, bevelThickness3D: 0.02, bevelSize3D: 0.01,
      maxWidth: opts.maxWidth || 14,
      lines,
    },
  },
})

// lies flat on the ground, scaled to an actual width in metres — the plan view
const plate = (id, name, position, value, opts = {}) => {
  const widest = value.split('\n').reduce((a, b) => (a.length > b.length ? a : b), '')
  const s = Math.min(1, (opts.width || 2.4) / Math.max(0.4, flatWidth(widest)))
  return textEntity(id, name, position, value, [{ value, fontSize: 0.3, color: opts.color || INK }], {
    ...opts, billboard: false, scale: [s, s, s],
  })
}

// faces the visitor at full size, invisible to the plan view (value '' draws nothing)
const billboard = (id, name, position, lines, opts = {}) =>
  textEntity(id, name, position, '', lines, { ...opts, billboard: true })

const portal = (id, name, position, projectId, label) => ({
  id, type: 'portal', name, parentId: null,
  components: {
    ...xf(position),
    appearance: { color: LIVE, opacity: 1 },
    reference: { spaceId: SPACE_ID, projectId, mode: 'embed', label },
  },
})

// a doorway out: PortalGateway navigates to /<spaceId> and ignores projectId
const gateway = (id, name, position, label) => ({
  id, type: 'portal', name, parentId: null,
  components: {
    ...xf(position),
    appearance: { color: LIVE, opacity: 1 },
    reference: { spaceId: SPACE_ID, projectId: '', mode: 'portal', label },
  },
})

const disc = (id, name, position, radius, color, height = 0.04) => ({
  id, type: 'cylinder', name, parentId: null,
  components: {
    ...xf(position), ...look(color),
    animation: { mode: 'static', speed: 1, amplitude: 1 },
    primitive: { radiusTop: radius, radiusBottom: radius, height },
  },
})

// the core: one chrome object per work, the same object the rite leaves behind
const core = (id, name, position, seed) => ({
  id, type: 'sphere', name, parentId: null,
  components: {
    ...xf(position, [0, seed * Math.PI * 2, 0], [1, 0.82 + seed * 0.4, 1]),
    ...look('#c9cdd3', { roughness: 0.12, metalness: 1 }),
    primitive: { radius: 0.26 + seed * 0.12 },
    // `mode`, not `type` — projectSchema normalizes any unknown key to 'static',
    // which is a core that silently never moves
    animation: { mode: 'float', speed: 0.4 + seed * 0.5, amplitude: 0.5 + seed * 0.6 },
  },
})

// ------------------------------------------------------------------- documents

const now = 1785000000000 // fixed: rebuilding must not churn the diff

const docScaffold = (projectId, title, spawn, background) => ({
  version: 4,
  projectMeta: { id: projectId, spaceId: SPACE_ID, title, createdAt: now, updatedAt: now, source: 'notations-space.mjs' },
  nodes: [], edges: [], templates: [],
  workspaceState: { activeSurface: 'world', selectedNodeId: null },
  entities: [],
  worldState: {
    backgroundColor: background,
    environmentAssetId: null, environmentIntensity: 1, atmosphereBlend: true, hubDecor: false,
    spawn,
    gridVisible: false, gridSize: 60, gridCellSize: 1, gridCellThickness: 0.2, gridCellColor: HAIRLINE,
    gridSectionSize: 4, gridSectionThickness: 0.6, gridSectionColor: HAIRLINE,
    gridFadeDistance: 80, gridFadeStrength: 1.1, gridOffset: 0.015,
    ambientLight: { color: '#ffffff', intensity: 0.95 },
    directionalLight: { color: '#fffaf2', intensity: 1.05, position: [8, 14, 6] },
    savedView: { mode: 'perspective', position: [0, 2.4, 8], target: [0, 1.2, 0], fov: 50, zoom: 1, near: 0.1, far: 1000 },
  },
  renderSettings: { shadows: true, antialias: true, toneMapping: 'ACESFilmic', toneMappingExposure: 1, dprMin: 1, dprMax: 2 },
  xrState: { mode: 'none', debugVisible: false, vrSupported: false, arSupported: false },
  presentationState: {
    mode: 'scene',
    fixedCamera: { projection: 'perspective', position: [0, 2.4, 8], target: [0, 1.2, 0], fov: 50, zoom: 1, near: 0.1, far: 400, locked: false },
    codeHtml: '', codeSourceType: 'html', codeUrl: '', codeFiles: [], entryView: 'scene',
  },
  publishState: { shareEnabled: true, xrDefaultMode: 'none', lastExportAt: 0 },
  windowLayout: { activeWindowId: 'viewport', windows: {} },
  assets: [],
})

// A work room is deliberately SMALL — about 3m across. The hub reaches its works
// with `mode: embed`, which renders the target project inline (a `portal`-mode
// gateway can only jump to a space, never to a project), so this same document
// has to read twice: as the page an artist links to, and as one object standing
// in the festival. A room-sized floor would have swallowed its neighbours.
const WORK_FOOTPRINT = 3.4

const buildWork = (e) => {
  const seed = hash(e.id)
  const doc = docScaffold(e.projectId, e.work || e.title, { x: 0, z: 5.5, yaw: Math.PI, pitch: 0.05, altY: 1.6 }, PAPER)
  const credits = []
  if (e.artists.length) credits.push({ value: e.artists.join(' · '), fontSize: 0.24, color: INK })
  if (e.curators.length) credits.push({ value: `curated by ${e.curators.join(' · ')}`, fontSize: 0.18, color: GRAPHITE })

  const when = [fmtWhen(e), place(e)].filter(Boolean).join('   /   ').toLowerCase()

  doc.entities = [
    disc('base', 'ground plate', [0, 0, 0], WORK_FOOTPRINT / 2, HAIRLINE, 0.05),
    core('core', 'the work as a core', [0, 1.15, 0], seed),
    // plan view: the title on the plate, and nothing else — 62 of these have to
    // stand next to each other without a single word touching its neighbour
    plate('label', 'plate label', [0, 0.06, 0], e.work || e.title, { width: WORK_FOOTPRINT - 0.6 }),
    // walk view: the whole reading, at the work's own height
    billboard('caption', 'caption', [0, 2.4, 0], [
      { value: e.work || e.title, fontSize: 0.38, color: INK },
      ...credits,
      ...(when ? [{ value: when, fontSize: 0.15, color: GRAPHITE }] : []),
      ...(e.desc ? [{ value: e.desc.replace(/\s*\n\s*/g, ' ').slice(0, 320), fontSize: 0.14, color: GRAPHITE }] : []),
    ], { maxWidth: 7 }),
  ]
  return doc
}

const buildHub = (entries) => {
  const works = entries.filter((e) => e.isWork)
  const byVenue = new Map()
  for (const e of works) {
    const v = e.venue || 'elsewhere'
    if (!byVenue.has(v)) byVenue.set(v, [])
    byVenue.get(v).push(e)
  }
  const venues = [...byVenue.entries()].sort((a, b) => b[1].length - a[1].length)

  const doc = docScaffold(HUB_ID, 'Notations #2', { x: 0, z: 34, yaw: Math.PI, pitch: 0.1, altY: 1.7 }, PAPER)
  const ents = [
    disc('ground', 'paper ground', [0, -0.05, 0], 62, PAPER, 0.1),
    plate('title', 'title plate', [0, 0.08, 0], 'NOTATIONS #2', { width: 16 }),
    plate('subtitle', 'subtitle plate', [0, 0.08, 5], 'կ_ա_մ_ու_ր_ջ  XR_  vi.ritual', { width: 9, color: LIVE }),
    plate('dates', 'dates plate', [0, 0.08, 8], 'Yerevan · lab 20–31 July · festival 1–2 August 2026 · hosted by hosq', { width: 13, color: GRAPHITE, mono: true }),
    billboard('title-b', 'title', [0, 6.4, 0], [
      { value: 'NOTATIONS #2', fontSize: 1.05, color: INK },
      { value: 'կ_ա_մ_ու_ր_ջ  XR_  vi.ritual', fontSize: 0.42, color: LIVE },
      { value: 'Yerevan · lab 20–31 July · festival 1–2 August 2026 · hosted by hosq', fontSize: 0.24, color: GRAPHITE },
    ], { maxWidth: 26 }),
    // a gateway can only address a SPACE, so this leads back to the door —
    // the rite and the field are one click further, where they already live
    gateway('to-door', 'back to the door', [0, 0, 24], 'կ_ա_մ_ու_ր_ջ'),
  ]

  // Each venue keeps its own ground; its works stand on it in concentric rings,
  // never closer than one footprint apart. The embedded work carries its own
  // title, so the portal's label stays empty — one name per work, not two.
  const GAP = WORK_FOOTPRINT + 1.8
  const ringsFor = (n) => {
    const rings = []
    let placed = 0
    let ring = 1
    while (placed < n) {
      const r = ring * GAP
      const capacity = Math.max(1, Math.floor((2 * Math.PI * r) / GAP))
      const take = Math.min(capacity, n - placed)
      rings.push({ r, take, offset: ring * 0.7 })
      placed += take
      ring++
    }
    return rings
  }

  venues.forEach(([venue, list], vi) => {
    const rings = ringsFor(list.length)
    const outer = rings[rings.length - 1].r + GAP * 0.9
    // venues sit on one wide circle, each pushed out far enough not to touch
    const a = (vi / venues.length) * Math.PI * 2
    const R = 34 + outer
    const cx = Math.cos(a) * R
    const cz = Math.sin(a) * R
    const vs = slugify(venue) || `venue-${vi}`

    ents.push(disc(`v-${vs}`, `${venue} ground`, [cx, 0.02, cz], outer, PAPER, 0.06))
    ents.push(disc(`v-${vs}-edge`, `${venue} ground edge`, [cx, 0.015, cz], outer + 0.35, HAIRLINE, 0.05))
    // the venue name reads on the plan from above; the same name faces you on foot
    ents.push(plate(`v-${vs}-plate`, `${venue} plate`, [cx, 0.07, cz - outer + 1.6], `${venue}  ·  ${list.length} works`, { width: Math.min(outer * 1.4, 10) }))
    ents.push(billboard(`v-${vs}-label`, `${venue} label`, [cx, 4.6, cz], [
      { value: venue, fontSize: 0.5, color: INK },
      { value: `${list.length} works`, fontSize: 0.22, color: GRAPHITE },
    ], { maxWidth: 14 }))

    let i = 0
    for (const ring of rings) {
      for (let k = 0; k < ring.take; k++, i++) {
        const t = ring.offset + (k / ring.take) * Math.PI * 2
        const x = cx + Math.cos(t) * ring.r
        const z = cz + Math.sin(t) * ring.r
        ents.push(portal(`p-${list[i].projectId}`, list[i].work || list[i].title, [x, 0, z], list[i].projectId, ''))
      }
    }
  })

  // the entries with no named authorship stay on the record without a room of their own
  const rest = entries.filter((e) => !e.isWork)
  // laid out as a column of plates, one per row, so nothing overlaps in plan
  rest.forEach((e, i) => {
    const x = -9 + (i % 2) * 18
    const z = 16 + Math.floor(i / 2) * 2.4
    ents.push(plate(`o-${i}`, e.title, [x, 0.07, z], e.title, { width: 7, color: GRAPHITE, mono: true }))
    ents.push(billboard(`o-${i}-b`, `${e.title} caption`, [x, 1.6, z], [
      { value: e.title, fontSize: 0.22, color: GRAPHITE },
      { value: [fmtWhen(e), e.venue].filter(Boolean).join(' · ').toLowerCase(), fontSize: 0.14, color: GRAPHITE },
    ], { maxWidth: 8 }))
  })

  doc.entities = ents
  return doc
}

// -------------------------------------------------------------- seeding the field

// The field reads the SPACE scene and draws every object whose id starts with
// `insc-` as a core. A crossing writes one through the open-inscriptions route,
// which mints `insc-<uuid>` and returns a one-time proof so the visitor can
// unmake their own. A work is not a visitor: it gets a DETERMINISTIC id, so
// re-running this seeds nothing twice, and no proofHash, so nobody can unmake it
// — these were always here.
//
// field.html splits `data` on '·': the last part is the word, the rest the name.
// So artists must be joined with a comma, never a middle dot, or the last artist
// would be read as the word.
const INSCRIPTION_COLOR = '#cdb98f'

// The same golden-angle spiral the server places crossings on, so a seeded work
// sits in the same ring as the crossing that follows it.
const spiralPosition = (index) => {
  const a = index * 2.399
  const r = 3 + index * 0.35
  return [Math.cos(a) * r, 1.4, Math.sin(a) * r]
}

const inscriptionFor = (e, index) => ({
  id: `insc-${e.projectId}`,
  type: 'text-2d',
  data: `${e.artists.join(', ').slice(0, 40) || '—'} · ${(e.work || e.title).slice(0, 60)}`,
  position: spiralPosition(index),
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  color: INSCRIPTION_COLOR,
  isVisible: true,
  fontWeight: 'normal',
  fontStyle: 'normal',
  source: 'notations-2',
})

const seedField = async (works, { live, token, dryRun }) => {
  const H = { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const r = await fetch(`${live}/api/spaces/${SPACE_ID}/scene`, { headers: H })
  if (!r.ok) { console.error(`  ✗ read scene: HTTP ${r.status}`); return }
  const body = await r.json()
  const objects = (body.scene || {}).objects || []
  const have = new Set(objects.map((o) => String(o.id)))
  const already = objects.filter((o) => String(o.id).startsWith('insc-')).length

  const missing = works.filter((e) => !have.has(`insc-${e.projectId}`))
  console.log(`\n[field] ${already} cores standing · ${works.length} works · ${missing.length} to seed`)
  if (!missing.length) return

  const ops = missing.map((e, i) => ({
    opId: `n2-seed-${e.projectId}`, // stable: a retry is recognised, not re-applied
    clientId: 'notations-space.mjs',
    type: 'addObject',
    payload: { object: inscriptionFor(e, already + i) },
  }))

  if (dryRun) {
    console.log(`  would ADD ${ops.length} inscriptions at baseVersion ${body.version}`)
    console.log(`  e.g. ${ops[0].payload.object.id} → "${ops[0].payload.object.data}"`)
    return
  }

  const w = await fetch(`${live}/api/spaces/${SPACE_ID}/ops`, {
    method: 'POST', headers: H, body: JSON.stringify({ baseVersion: body.version, ops }),
  })
  const out = await w.json().catch(() => ({}))
  if (!w.ok) { console.error(`  ✗ ops: HTTP ${w.status} ${out?.error || ''}`); return }
  if (out.conflict) { console.error('  ✗ scene moved under us — re-run'); return }
  console.log(`  ✓ seeded ${ops.length} cores → version ${out.version || out.nextVersion}`)
}

// ------------------------------------------------------------------- pushing

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

// Tier and token travel together: LIVE_* is staging, PROD_* is prod, and both
// live in the platform repo next door. Reading the token from the tier keeps a
// rehearsal from landing on the live door by way of a stale env var.
const resolveTarget = async (args) => {
  const env = {
    ...(await loadEnvFile(path.join(ROOT_DIR, '.env'))),
    ...(await loadEnvFile(path.join(ROOT_DIR, '.env.local'))),
    ...(await loadEnvFile(path.join(ROOT_DIR, 'serverXR', '.env.local'))),
    ...(await loadEnvFile(path.join(ROOT_DIR, '..', 'di.iiii', 'serverXR', '.env.local'))),
  }
  const key = args.prod ? 'PROD' : 'LIVE'
  const live = (args.to || env[`${key}_API_URL`] || 'https://staging.di-studio.xyz/serverXR').replace(/\/+$/, '')
  const token = args.token || process.env[`${key}_API_TOKEN`] || env[`${key}_API_TOKEN`] || env.API_TOKEN || ''
  return { live, token }
}

const push = async (docs, args, { live, token }) => {
  const H = (json = true) => ({ Accept: 'application/json', ...(json ? { 'Content-Type': 'application/json' } : {}), Authorization: `Bearer ${token}` })

  console.log(`[notations] → ${live}   ${args.dryRun ? '(dry run)' : ''}`)
  const existing = await fetch(`${live}/api/spaces/${SPACE_ID}/projects`, { headers: H() })
    .then((r) => r.json()).then((b) => new Set((b.projects || []).map((p) => p.id))).catch(() => new Set())

  for (const doc of docs) {
    const id = doc.projectMeta.id
    if (args.only && id !== args.only) continue
    if (!existing.has(id)) {
      if (args.dryRun) { console.log(`  would CREATE ${id}`) }
      else {
        const r = await fetch(`${live}/api/spaces/${SPACE_ID}/projects`, {
          method: 'POST', headers: H(), body: JSON.stringify({ title: doc.projectMeta.title, slug: id }),
        })
        if (!r.ok) { console.error(`  ✗ create ${id}: HTTP ${r.status}`); continue }
        console.log(`  + created ${id}`)
      }
    }
    if (args.dryRun) { console.log(`  would WRITE ${id} (${doc.entities.length} entities)`); continue }
    const r = await fetch(`${live}/api/projects/${id}/document`, { method: 'PUT', headers: H(), body: JSON.stringify(doc) })
    console.log(r.ok ? `  ✓ ${id} (${doc.entities.length} entities)` : `  ✗ ${id}: HTTP ${r.status}`)
  }
  console.log(`\n  hub → ${live.replace(/\/serverXR$/, '')}/${SPACE_ID.replace(/-/g, '_')}/${HUB_ID}`)
}

// ---------------------------------------------------------------------- main

const main = async () => {
  const args = parseArgs(process.argv.slice(2))
  const entries = await load()
  const works = entries.filter((e) => e.isWork)
  const docs = [buildHub(entries), ...works.map(buildWork)]

  await fs.mkdir(args.out, { recursive: true })
  for (const doc of docs) {
    await fs.writeFile(path.join(args.out, `${doc.projectMeta.id}.json`), JSON.stringify(doc, null, 1) + '\n')
  }
  const index = works.map((e) => ({ projectId: e.projectId, work: e.work || e.title, artists: e.artists, venue: e.venue, room: e.room, when: fmtWhen(e) }))
  await fs.writeFile(path.join(args.out, 'index.json'), JSON.stringify(index, null, 1) + '\n')

  console.log(`[notations] ${entries.length} entries → ${works.length} rooms + 1 hub`)
  console.log(`  written to ${path.relative(ROOT_DIR, args.out)}/`)
  console.log(`  hub entities: ${docs[0].entities.length}`)

  if (args.push || args.seedField) {
    const target = await resolveTarget(args)
    if (!target.token) {
      console.error(`editor token required (--token or ${args.prod ? 'PROD' : 'LIVE'}_API_TOKEN)`)
      process.exitCode = 1
      return
    }
    if (args.push) await push(docs, args, target)
    if (args.seedField) await seedField(works, { ...target, dryRun: args.dryRun })
  }
}

main().catch((e) => { console.error(e?.message || e); process.exitCode = 1 })
