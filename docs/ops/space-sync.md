# Linked Space — auto-sync to di.iiii

This repo is a **linked space**: a push to `main` updates the di.iiii space at
`di-studio.xyz/br_id_ge` on every tier, staging first, in step with the GitHub
Pages mirror. Canonical how-to lives in `DEVELOPMENT.md` ("Syncing the space")
and `AGENTS.md` (the golden rule); this note keeps the binding reference.

```
edit + push main ─┬─► GitHub Pages    (.github/workflows/pages.yml — mirror only)
                  └─► di.iiii space   (.github/workflows/sync-space.yml → scripts/sync-space.mjs)
                        staging first, then prod, then a read-only --audit of both
```

## The binding — two manifest kinds

`di-space.space.json` owns the **space**: label, visibility, `minEngine`, the
tier map (prod / staging / local, each with its URL and token env var), and the
list of project manifests that must exist. `di-space.<page>.json` owns one
**project**:

| field | meaning |
|-------|---------|
| `spaceId` | the di.iiii space (`br_id_ge`; canonical id `br-id-ge`) |
| `projectId` | the project inside it (`landing` · `newww` · `br-id-ge-field`) |
| `slug` | the public URL segment (`rite`, `field`); the door has none |
| `label` | the project's title — the repo is master for names, PATCHed on every run |
| `entry` | the HTML file pushed into the project (`bridge.html` / `index.html` / `field.html`) |
| `include` / `assets` | extra css/js to inline · binary globs to upload (all empty — the surfaces are self-contained) |
| `publish` | whether this project is the space's published face (only the landing) |
| `deviceAccess` | viewer grants a real origin so the camera can open (the rite) |

There is no `live` field any more — the caller names the tier
(`--tier staging|prod|local` or `--to <url>`), and the engine rewrites
`di-studio.xyz` hosts to the target tier so a staging copy never writes into the
live field.

## Run it

```bash
node scripts/sync-space.mjs --all --tier staging   # every project, one command
node scripts/sync-space.mjs --audit                # all tiers, read-only, exit 1 on drift
```

Tokens come from `.env.local` (gitignored): `PROD_API_TOKEN`, `LIVE_API_TOKEN`
(staging), `API_TOKEN` (local :4000).

## The connection — one secret per tier

The Action needs **`DI_SPACE_TOKEN`** (prod) and **`DI_SPACE_TOKEN_STAGING`** —
di.iiii **editor** tokens scoped to this space, one per tier because the tiers
do not share a database:

1. On the di.iiii server: `EDITOR_API_TOKEN=<random>` and
   `EDITOR_ALLOWED_SPACES=br-id-ge` (so the token can only edit this space).
2. In this repo: Settings → Secrets and variables → Actions → the two secrets.

Rotate by changing both ends. A tier with no token turns the run red — a
skipped tier used to stay silently green, which is how staging once drifted a
whole redesign behind.

`scripts/sync-space.mjs` is **vendored** from di.iiii's `scripts/space-sync.mjs`
— never edit it here; `vendor-check.yml` compares it against di.iiii `dev` on
every push and weekly, and the sync workflow gates on that check.
