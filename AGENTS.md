# AGENTS — br_id_ge

Short routing guide for AI agents working in `br_id_ge`.

## What This Project Is

`br_id_ge` ("bridge") is a tele-symbiotic XR performance prototype and interactive spatial node editor. It is a node within the **di.iiii Spatial Platform** ecosystem — deployed as a standalone GitHub Pages site and as an integrated space on di-studio.xyz.

Core concept: N-Node mesh connecting geographic stages (Munich, Gyumri, Leipzig) through an AI core ("The Stitch"), using network latency as a choreographic element.

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
3. `docs/MASTER_CONTEXT.md` — N-Node rollout plan and aesthetic baseline (Void theme)
4. `DEVELOPMENT.md` — dev workflow, auto-push setup, secret scanning

## File Map

| File | Role |
|------|------|
| `index.html` | Main SPA — all UI, Three.js particle scene, node editor, markdown render |
| `serverXR/wsMesh.js` | WebSocket N-Node mesh server (draft — no auth, single-threaded) |
| `src/components/NodeCanvas.jsx` | Draft React node canvas (not yet active in index.html) |
| `docs/PROJECT.md` | Canonical project docs (synced from di.iiii) |
| `docs/MASTER_CONTEXT.md` | Curatorial framework, N-Node phases, aesthetic spec |
| `scripts/auto-push-readme.sh` | Auto-commit watcher with secret scan |
| `scripts/auto-push-space.sh` | Multi-file repo sync watcher |

## Aesthetic Baseline (Void Theme)

- Background: `#081423`, `#07121f`
- Lines/borders: `#2b4d6d`
- Typography: `#b9cfe4` (primary), `#78b9e8` (accent)
- Fonts: Outfit (primary), Space Mono (data/CLI)
- Style: terminal-art, ASCII borders, minimal UI

## Known Draft Status

- `serverXR/wsMesh.js` — no auth (anyone can join any room), single process, Ghost Hand prediction is linear placeholder. Not production-ready.
- `src/components/NodeCanvas.jsx` — unused draft; not imported by index.html.
- No test suite, no lint configuration.

## Default Safe Actions

- edit `index.html` for UI/visual changes
- edit `serverXR/wsMesh.js` for mesh/latency/Ghost Hand logic (keep it backward-compatible)
- edit `docs/MASTER_CONTEXT.md` for curatorial updates (do not let it drift from `docs/PROJECT.md`)
- do not commit `.env` or any API keys — secret scan in `auto-push-readme.sh` will block it

## Deployment

- GitHub Pages: push to `main` → `.github/workflows/pages.yml` → `dob-0.github.io/br_id_ge/`
- di-studio.xyz: hosted as a space within the di.iiii platform

## Validation

No automated test/lint pipeline. Before committing:

```bash
bash -n scripts/auto-push-readme.sh    # syntax check shell scripts
node --check serverXR/wsMesh.js        # syntax check Node.js
```
