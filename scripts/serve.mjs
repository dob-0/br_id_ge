#!/usr/bin/env node
// One link for the whole space, locally:
//
//     node scripts/serve.mjs        →  http://localhost:8899/br_id_ge
//
// It mirrors the di.iiii URL shape (/br_id_ge, /br_id_ge/p/<project>) so the local
// links are the real links, and it serves the rite as a TOP-LEVEL page — which is
// the only way the camera can open. Inside di.iiii the rite runs in a sandboxed
// srcDoc iframe with an opaque origin, and browsers refuse camera to those.
//
// The field and mesh are pointed at STAGING by default, so a test crossing never
// lands a permanent stone in the live field. `--to prod` when you mean it.

import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = argv.indexOf(name)
  return i === -1 ? fallback : argv[i + 1]
}

const PORT = Number(arg('--port', process.env.PORT || 8899))
const TO = String(arg('--to', 'staging')).toLowerCase()
const ORIGINS = {
  staging: 'https://staging.di-studio.xyz',
  prod: 'https://di-studio.xyz',
  local: 'http://localhost:4000',
}
if (!ORIGINS[TO]) {
  console.error(`unknown --to ${TO}. use staging | prod | local`)
  process.exit(1)
}
const SERVER = TO === 'local' ? 'http://localhost:4000/serverXR' : `${ORIGINS[TO]}/serverXR`
const MESH = SERVER.replace(/^http/, 'ws') + '/mesh'

// the space, as di.iiii serves it
const SPACE = '/br_id_ge'
// Both the public slug and the internal project id, because prod resolves both:
// the viewer looks a segment up as a slug first and falls back to the project
// id, so every link ever shared keeps working. Mirroring that here means a URL
// that works on localhost works on prod, and vice versa.
const PROJECTS = {
  '': 'bridge.html',                       // the published face — the door
  'rite': 'index.html',                    // the rite
  'newww': 'index.html',                   // …its project id, the old link
  'field': 'field.html',                   // the field viewer
  'br-id-ge-field': 'field.html',          // …its project id, the old link
  'members': 'members.html',               // the members — artist-scale crossings
  'v-oooooo': 'v.oooooo.html',             // legacy
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon' }

// Point the page at the chosen tier and keep every in-page link local, so the whole
// space is navigable from the one link without ever leaving localhost.
function localize(html) {
  return String(html)
    .replaceAll('https://di-studio.xyz/serverXR', SERVER)
    .replaceAll('wss://di-studio.xyz/serverXR/mesh', MESH)
    .replaceAll('https://staging.di-studio.xyz/serverXR', SERVER)
    .replaceAll('https://di-studio.xyz/br_id_ge', SPACE)
    .replaceAll('https://staging.di-studio.xyz/br_id_ge', SPACE)
}

async function sendFile(res, file, { rewrite = false } = {}) {
  const full = path.join(ROOT, file)
  if (!full.startsWith(ROOT)) { res.writeHead(403).end('no'); return }
  let body
  try { body = await readFile(full) } catch { res.writeHead(404).end('not here'); return }
  const type = TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream'
  if (rewrite) body = Buffer.from(localize(body.toString('utf8')), 'utf8')
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    // a top-level page on localhost is a secure context; this keeps the camera
    // available to it and to nothing else
    'Permissions-Policy': 'camera=(self), microphone=(self)',
  })
  res.end(body)
}

// The document API addresses projects by id, not by public slug, so a canonical
// link has to be translated back before it can be fetched.
const REMOTE_IDS = { jam: 'br-id-ge-jam', hosq: 'br-id-ge-hosq', rite: 'newww', field: 'br-id-ge-field' }

// Studio-authored projects live only in the space; fetch and serve them here so the
// links on the door all work locally.
async function sendRemote(res, slugOrId) {
  const id = REMOTE_IDS[slugOrId] || slugOrId
  try {
    const r = await fetch(`${SERVER}/api/projects/${encodeURIComponent(id)}/document`,
      { signal: AbortSignal.timeout(15000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const j = await r.json()
    const files = j?.document?.presentationState?.codeFiles || []
    const html = files.find((f) => /\.html?$/i.test(f?.name || '') || /<html|<!DOCTYPE/i.test(f?.content || ''))?.content
    if (!html) throw new Error('no html in that project')
    res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' })
    res.end(localize(html))
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`"${id}" is authored in Studio and could not be fetched from ${TO}: ${e.message}`)
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  let p = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/'

  if (p === '/' ) { res.writeHead(302, { Location: SPACE }).end(); return }
  if (p === SPACE) return sendFile(res, PROJECTS[''], { rewrite: true })

  // Two shapes, because prod serves two. `/br_id_ge/<slug>` is the canonical
  // public link — only that one resolves a project's slug. `/br_id_ge/p/<id>`
  // takes the project id verbatim and is what every older link uses.
  const segment = p.startsWith(`${SPACE}/p/`) ? p.slice(`${SPACE}/p/`.length)
    : p.startsWith(`${SPACE}/`) ? p.slice(`${SPACE}/`.length)
    : null
  if (segment && !segment.includes('/')) {
    const file = PROJECTS[segment]
    if (file) return sendFile(res, file, { rewrite: true })
    // Projects with no repo file — hosq, the jam — are authored in Studio. Pull the
    // document from the space so the whole space really is reachable from one link.
    return sendRemote(res, segment)
  }

  // everything else (assets, the raw html files) straight from the repo
  return sendFile(res, p.replace(/^\//, ''), { rewrite: p.endsWith('.html') })
})

server.listen(PORT, '127.0.0.1', () => {
  const base = `http://localhost:${PORT}`
  console.log('')
  console.log(`  br_id_ge — the whole space, one link`)
  console.log('')
  console.log(`    ${base}${SPACE}`)
  console.log('')
  console.log(`  the door      ${base}${SPACE}`)
  console.log(`  the rite      ${base}${SPACE}/rite            ← camera works here`)
  console.log(`  the field     ${base}${SPACE}/field`)
  console.log('')
  console.log(`  field + mesh: ${TO}${TO === 'prod' ? '  ⚠ crossings land in the LIVE field' : '  (crossings stay off prod)'}`)
  console.log('')
})
