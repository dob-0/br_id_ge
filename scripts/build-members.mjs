#!/usr/bin/env node
// members.json is the info center; members.html is what ships. This injects the
// former into the latter between the <!--members-data--> markers, so the page
// stays a single self-contained file the space sync can carry as-is.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(await readFile(path.join(ROOT, 'members.json'), 'utf8'))
for (const m of data.members) {
  if (!m.slug || !m.name || !m.scale) throw new Error(`member missing slug/name/scale: ${JSON.stringify(m)}`)
}
const dupes = data.members.map((m) => m.slug).filter((s, i, a) => a.indexOf(s) !== i)
if (dupes.length) throw new Error(`duplicate slugs: ${dupes}`)

const htmlPath = path.join(ROOT, 'members.html')
const html = await readFile(htmlPath, 'utf8')
const block = `/*<members-data>*/const DATA=${JSON.stringify({ labCount: data.labCount, members: data.members })}/*</members-data>*/`
const next = html.replace(/\/\*<members-data>\*\/[\s\S]*?\/\*<\/members-data>\*\//, block)
if (next === html && !html.includes('<members-data>')) throw new Error('markers not found in members.html')
await writeFile(htmlPath, next)
console.log(`members.html ← members.json  (${data.members.length} named, lab ${data.labCount})`)
