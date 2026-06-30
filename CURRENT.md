# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · live: https://dob-0.github.io/br_id_ge/ · space: https://di-studio.xyz/br_id_ge

## Last commit

`ef29aff` — feat(rite): act v "Echo" + live co-presence mesh (graceful solo fallback). On `main`, deployed to Pages + di.iiii space (`lastSyncSha` ef29aff).

## Last session (2026-07-01)

- Added **act v — ԱՐՁԱԳԱՆՔ (Echo)**: after inscription the field + those present gather around the khachkar with a drone swell; hero/meta now read "five acts".
- Added a **live co-presence client** in `index.html` — real peers as named lamps via `wsMesh.js` (latency-compensated ghost-hand), real RTT, live "present" HUD count.
- Co-presence **degrades to the existing simulated ghosts** when no endpoint is set, so the deployed (solo) rite is unchanged; endpoint via `?mesh=`, `<meta name="mesh-url">`, or `window.BR_MESH_URL`.
- `wsMesh.js` already carried **server-side EMA motion prediction + optional `ROOM_SECRET`** (commit ebc3c61); protocol verified end-to-end with a headless 2-client test (motion fan-out, payload, ping/pong, join).
- **CI space sync is green**: `.github/workflows/sync-space.yml` + repo secret `DI_SPACE_TOKEN` (a br_id_ge-scoped di.iiii sync-key, 1y TTL) pushes `index.html`+`references/**` to the space on every push.

## What works

- Playable rite in five acts (Threshold → Crossing → Witness → Inscription → Echo), single-file Three.js in `index.html`.
- Two sync paths to the di.iiii space: GitHub **App webhook** (auto, prod, entry file) + **token CI** (`sync-space.yml`, also `references/**` assets).
- Local preview: `python3 -m http.server 8091 --directory .` ; mesh: `PORT=8090 node serverXR/wsMesh.js` ; co-presence: open `?mesh=ws://localhost:8090` in 2 tabs.

## Open / deferred

- **Co-presence is solo online** — the deployed file has no mesh endpoint. To go live for real visitors: host `wsMesh.js` at a public `wss://` URL and set `<meta name="mesh-url">` (+ a `ROOM_SECRET`).
- `wsMesh.js` still single-process / no scaling / no persistence (draft); `src/components/NodeCanvas.jsx` unused.
- No automated test/lint. Before commit: `node --check serverXR/wsMesh.js`; HTML script can be extracted + `node --check`.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (`sync-space.yml`) + App webhook. Verify space: GET `/serverXR/api/spaces/br_id_ge/github-link` → `lastSyncSha`.
