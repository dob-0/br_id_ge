# AGENTS — br_id_ge

Short routing guide for AI agents working in `br_id_ge`.

## What This Project Is

`br_id_ge` (կամուրջ, "bridge") is **how the real world enters the di.iiii Spatial Platform** — places as scans, people through the rite's two questions, artists through the jam; every entry leaves a permanent stone (canonical recap: `docs/MASTER_CONTEXT.md` §0). Its playable piece is an XR rite in five acts (Threshold → Crossing → Witness → Inscription → Echo), single-file Three.js in `index.html` — deployed as a standalone GitHub Pages site and as an integrated space on di-studio.xyz.

Current focus: **Notations #2** (Jul 20–Aug 2 2026, State Philharmonia, hosted by hosq) — theme "Rituals"/Communitas. Curatorial ground truth: `docs/MASTER_CONTEXT.md`. Older N-Node/Ghost-Hand/ROS framing is parked (git history).

## Ecosystem Position

```
di.iiii platform (dob-0/di.iiii)   ← canonical platform, auth, hosting
    └── br_id_ge (this repo)        ← performance prototype, node within di.iiii
_ii (sibling)                       ← live terminal visual engine for br_id_ge shows
wcc (Emilya's branch)               ← World Creative Commons, sibling space on di.iiii
```

**Upstream:** di.iiii provides hosting, auth, serverXR backend, and sync tooling.
**This repo is NOT upstream** — changes here do not feed back into di.iiii core.

## Start Here

1. `README.md` — project overview, live links, team
2. `docs/PROJECT.md` — full technical and curatorial documentation
3. `docs/MASTER_CONTEXT.md` — hosq collaboration, Notations #2, notation concept, aesthetic baseline (Void theme)
4. `DEVELOPMENT.md` — dev workflow, auto-push setup, secret scanning

## File Map

| File | Role |
|------|------|
| `index.html` | The rite (`v.oooooo 2`) — five acts, Three.js, WebAudio drone, optional co-presence via `?mesh=`/`<meta name="mesh-url">` |
| `v.oooooo.html` | Legacy Space Node (renders `docs/PROJECT.md` live) |
| `serverXR/wsMesh.js` | Local/offline mesh server (hosting superseded by di.iiii `serverXR/src/meshHub.js`) |
| `docs/PROJECT.md` | Canonical project docs |
| `docs/MASTER_CONTEXT.md` | Curatorial ground truth — hosq collaboration, Notations #2, notation concept |
| `scripts/auto-push-readme.sh` | Auto-commit watcher with secret scan |
| `scripts/auto-push-space.sh` | Multi-file repo sync watcher |

## Aesthetic Baseline (Void Theme)

- Background: `#081423`, `#07121f`
- Lines/borders: `#2b4d6d`
- Typography: `#b9cfe4` (primary), `#78b9e8` (accent)
- Fonts: Outfit (primary), Space Mono (data/CLI)
- Style: terminal-art, ASCII borders, minimal UI

## Known Draft Status

- `serverXR/wsMesh.js` — local/offline only (no auth, single process); production mesh is di.iiii `serverXR/src/meshHub.js`.
- No test suite, no lint configuration.

## Default Safe Actions

- edit `index.html` for UI/visual changes
- edit `serverXR/wsMesh.js` only for local/offline mesh runs (hosting lives in di.iiii meshHub.js)
- edit `docs/MASTER_CONTEXT.md` for curatorial updates (do not let it drift from `docs/PROJECT.md`)
- do not commit `.env` or any API keys — secret scan in `auto-push-readme.sh` will block it

## Golden Rule — see it before it ships

Everything we build is LOOKED AT before it graduates, in this order:

1. **local** — open the page in a browser (file:// or the di.iiii dev stack on :4000)
2. **staging** — sync into the `br_id_ge` space at `staging.di-studio.xyz`
   (`node scripts/sync-space.mjs` in `br_id_ge-ops` with `--to https://staging.di-studio.xyz/serverXR`)
3. only then merge/publish — Pages and prod follow

**GitHub is the backend** — the place where things are KEPT, not where they are
first seen. Never merge a visual surface to `main` that nobody has looked at on
local + staging.

## Deployment

- GitHub Pages: push to `main` → `.github/workflows/pages.yml` → `dob-0.github.io/br_id_ge/`
- di-studio.xyz: hosted as a space within the di.iiii platform

## Validation

No automated test/lint pipeline. Before committing:

```bash
bash -n scripts/auto-push-readme.sh    # syntax check shell scripts
node --check serverXR/wsMesh.js        # syntax check Node.js
```
