# Linked Space — auto-sync to di.iiii

This repo is a **linked space**: a push to `main` updates the live di.iiii space at
`di-studio.xyz/br_id_ge` automatically, in step with the GitHub Pages deploy.

```
edit + push main ─┬─► GitHub Pages   (.github/workflows/pages.yml)
                  └─► di.iiii space   (.github/workflows/sync-space.yml → scripts/sync-space.mjs)
```

## The binding — `di-space.json`

| field | meaning |
|-------|---------|
| `spaceId` | the di.iiii space (`br_id_ge`; canonical id `br-id-ge`) |
| `projectId` | the project inside it (`newww`, the published one) |
| `entry` | the HTML file pushed into the space's code presentation (`index.html`) |
| `include` | extra local css/js to inline (empty — `index.html` is self-contained) |
| `assets` | globs of binaries (e.g. `references/*.mp4`); only ones **referenced** in the HTML are uploaded, with their URLs rewritten to the live asset endpoints |
| `publish` | set the space's `publishedProjectId` after sync |
| `live` | the serverXR base URL (production) |

## The engine — `scripts/sync-space.mjs`

Dependency-free Node. Idempotent: first run creates the space + project, every later
run updates. Renders inside a sandboxed `<iframe sandbox="allow-scripts">`, so CDN
`<script>` tags (Three.js) and the WebGL hero run normally.

Run it manually:

```bash
LIVE_API_TOKEN=<editor-token> node scripts/sync-space.mjs --repo .
# preview without writing:
LIVE_API_TOKEN=<editor-token> node scripts/sync-space.mjs --repo . --dry-run
# target staging instead of prod:
node scripts/sync-space.mjs --repo . --to https://staging.di-studio.xyz/serverXR --token <tok>
```

## The connection — one secret

The Action needs **`DI_SPACE_TOKEN`** = a di.iiii **editor** token authorized for this space.

1. On the di.iiii server, set a scoped editor token:
   `EDITOR_API_TOKEN=<random>` and `EDITOR_ALLOWED_SPACES=br-id-ge` (so this token can
   only edit this space — never the whole platform).
2. In this repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `DI_SPACE_TOKEN`
   - Value: the same `<random>` token.

That's the whole "connection." No OAuth, no per-push token juggling. Rotate by changing
both values.

> Quick/insecure alternative for a first test: use the admin `API_TOKEN` as the secret.
> Works, but it's unscoped — prefer the editor token above for anything lasting.
