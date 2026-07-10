# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · live: https://dob-0.github.io/br_id_ge/ · space: https://di-studio.xyz/br_id_ge
near milestone: **Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, Communitas; **hosq.co HOST**) · ~10 days out as of 2026-07-10

**versions (canonical names, same everywhere):** `v.oooooo` = legacy Space Node (`v.oooooo.html` → space project `v-oooooo`, space-only) · `v.oooooo 2` = the current five-act rite (`index.html` = Pages entry → space project `newww`). Repo is master; space syncs from it. See README "Versions".

## Last commit

`ef29aff` (origin/main) — act v "Echo" + live co-presence client (graceful solo fallback). Local `c305a1e` (CURRENT.md) is 1 ahead, unpushed. No br_id_ge code changed this session — the co-presence *backend* was built in di.iiii.

## Last session (2026-07-10)

- Built the **co-presence WebSocket mesh backend** the deployed client was waiting for — in **di.iiii** serverXR, not this repo: `serverXR/src/meshHub.js`, a raw-ws hub attached to the same HTTP server as Socket.IO, path-routed to `${basePath}/mesh` so both coexist. On di.iiii `dev`, commit `466066b3`, with `meshHub.test.js` regression guard.
- **Verified end-to-end on STAGING** (`wss://staging.di-studio.xyz/serverXR/mesh`): 101 upgrade through the LiteSpeed proxy, motion fan-out, ghost-hand prediction, ping/pong RTT, peer:leave — 5/5. Socket.IO still upgrades on the same server (no regression).
- Discovered LiteSpeed proxies native WS **only under `/serverXR/*`** (root `/socket.io` = SPA 200) — recorded in di.iiii `docs/ai/known-fixes.md`.
- **This repo's client is unchanged** and already speaks the protocol via `?mesh=` / `<meta name="mesh-url">`. Try it: open `https://dob-0.github.io/br_id_ge/?mesh=wss://staging.di-studio.xyz/serverXR/mesh` in two windows → you meet as named lamps with live RTT.

## What works

- Playable rite in five acts (Threshold → Crossing → Witness → Inscription → Echo), single-file Three.js in `index.html`.
- Two sync paths to the di.iiii space: GitHub **App webhook** (auto, prod, entry file) + **token CI** (`sync-space.yml`, also `references/**`).
- Co-presence proven on staging; the client just needs a prod endpoint.

## Open / deferred (for the show)

- **Co-presence → prod:** promote di.iiii `dev→main`, then set `<meta name="mesh-url" content="wss://di-studio.xyz/serverXR/mesh">` in `index.html` and push (Pages + space sync). Currently the deployed rite is still **solo**.
- **Biometrics (rPPG + EVM)** — the "measurable shadow"; status unknown / likely not built. Riskiest to land before Jul 20.
- **Keeper dialogue** depth; **sound** (duduk dam-drone), khachkar craft, Armenian-letter legibility — polish, high felt-impact.
- **Show logistics undecided** — screen vs projection vs personal devices — changes what co-presence/biometrics mean physically.
- **SECURITY (pending):** rotate the GitHub App private key + webhook secret (both passed through chat).
- `wsMesh.js` in this repo is now superseded by di.iiii `meshHub.js` for hosting; keep for local/offline runs. `src/components/NodeCanvas.jsx` unused.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (`sync-space.yml`) + App webhook. Verify space: GET `/serverXR/api/spaces/br_id_ge/github-link` → `lastSyncSha`. Mesh backend deploys with di.iiii (`dev`→staging, `main`→prod).
