# AGENTS — br_id_ge

Short routing guide for AI agents working in `br_id_ge`.

## What This Project Is

`br_id_ge` (կամուրջ, "bridge") is **how the real world enters the di.iiii Spatial Platform** — places as scans, people through the rite's two questions, artists through the jam; every entry leaves a permanent stone (canonical recap: `docs/MASTER_CONTEXT.md` §0). Its playable piece is an XR rite in five acts (Threshold → Crossing → Witness → Notation → Echo), a single-file 2D-canvas `index.html` (v.oooooo 3 — THE READING) — lives as an integrated space on di-studio.xyz (canonical); GitHub is backend only, never linked publicly.

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
3. `docs/MASTER_CONTEXT.md` — hosq collaboration, Notations #2, notation concept, design tokens (§6)
4. `DEVELOPMENT.md` — dev workflow, auto-push setup, secret scanning

## File Map

| File | Role |
|------|------|
| `index.html` | The rite (`v.oooooo 3` — THE READING) — five acts, 2D canvas, optional MediaPipe silhouette, co-presence via the di.iiii mesh |
| `docs/PROJECT.md` | Canonical project docs |
| `docs/MASTER_CONTEXT.md` | Curatorial ground truth — hosq collaboration, Notations #2, notation concept |
| `scripts/auto-push-readme.sh` | Auto-commit watcher with secret scan |
| `scripts/auto-push-space.sh` | Multi-file repo sync watcher |

## Aesthetic Baseline

Canonical design tokens live in `docs/MASTER_CONTEXT.md` §6 — colors are concept
actors, not decoration. The rite and the door carry the artwork's own face.

## Known Draft Status

- No test suite, no lint configuration.

## Default Safe Actions

- edit `index.html` for UI/visual changes
- edit `docs/MASTER_CONTEXT.md` for curatorial updates (do not let it drift from `docs/PROJECT.md`)
- do not commit `.env` or any API keys — secret scan in `auto-push-readme.sh` will block it

## Golden Rule — the repo declares the space, and the audit proves it

`di-space.space.json` owns the space (label, tiers, which pages must exist);
`di-space.<page>.json` owns one page. Sync with **one** command and check with
another:

```bash
node scripts/sync-space.mjs --all --tier staging
node scripts/sync-space.mjs --audit        # all tiers, read-only, exit 1 on drift
```

Never hand-sync a single manifest and call the space synced — that is how prod,
staging and the dev box ended up with three different names for it. Never edit
`scripts/sync-space.mjs` here: it is vendored from di.iiii's
`scripts/space-sync.mjs`.

## Golden Rule — see it before it ships

Everything we build is LOOKED AT before it graduates, in this order:

1. **local** — open the page in a browser (file:// or the di.iiii dev stack on :4000)
2. **staging** — sync into the `br_id_ge` space at `staging.di-studio.xyz`
   (`node scripts/sync-space.mjs --repo . --to https://staging.di-studio.xyz/serverXR`, or `node scripts/serve.mjs` locally)
3. only then merge/publish — Pages and prod follow

**GitHub is the backend** — the place where things are KEPT, not where they are
first seen. Never merge a visual surface to `main` that nobody has looked at on
local + staging.

**We work IN di.iiii** — if something can run on di.iiii, it runs there: as a
space project, on serverXR, through the mesh. Build for the platform first;
standalone hosting (Pages, anything else) is a mirror of the di.iiii thing, not
the thing itself.

## Deployment

- Canonical (the only URLs ever linked or shared): di.iiii space `br_id_ge` — door `di-studio.xyz/br_id_ge`, rite `di-studio.xyz/br_id_ge/rite`, field `/field`
- GitHub Pages still deploys on push to `main` (`.github/workflows/pages.yml`) but is backend/mirror only — never link it anywhere

## Validation

No automated test/lint pipeline. Before committing:

```bash
bash -n scripts/auto-push-readme.sh    # syntax check shell scripts
```
