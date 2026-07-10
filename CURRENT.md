# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · live: https://dob-0.github.io/br_id_ge/ · space: https://di-studio.xyz/br_id_ge
near milestone: **Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, Communitas; **hosq.co HOST**) · ~9 days out as of 2026-07-11

**versions (canonical names, same everywhere):** `v.oooooo` = legacy Space Node (`v.oooooo.html` → space project `v-oooooo`, space-only) · `v.oooooo 2` = the current five-act rite (`index.html` = Pages entry → space project `newww`). Repo is master; space syncs from it. See README "Versions".

## Last commit

`86a397d` (origin/main) — align on-screen version text `v.0000 → v.oooooo 2` (tab title + badge). Working tree clean; `docs/ops/` fellowship files untracked (external, left alone).

## Last session (2026-07-10/11)

- **Names unified everywhere** — `v.oooooo` (legacy, `v.oooooo.html`→`v-oooooo`) and `v.oooooo 2` (the rite, `index.html`→`newww`) across repo, space, README, and the artwork's on-screen text; renamed `index.legacy.html → v.oooooo.html`.
- **Repo is now single source of truth for BOTH projects** — CI (`sync-space.yml`) syncs both (`di-space.json` + new `di-space.v1.json`, legacy `publish:false` so it can't steal the landing); verified green on prod, `publishedProjectId` stays `newww`.
- **Backup of both projects** pulled + committed + pushed to `dob-0/di-spaces` (`79ddec4`); nothing stranded — confirmed both space projects are byte-identical to the repo files.
- **Co-presence mesh backend** built in **di.iiii** serverXR (`serverXR/src/meshHub.js`, raw-ws hub coexisting with Socket.IO at `/serverXR/mesh`), on di.iiii `dev` `466066b3` + `meshHub.test.js`; **verified 5/5 on STAGING**, NOT on prod. LiteSpeed proxies native WS only under `/serverXR/*` (in di.iiii `known-fixes.md`).
- Client unchanged; try co-presence now: open `https://dob-0.github.io/br_id_ge/?mesh=wss://staging.di-studio.xyz/serverXR/mesh` in two windows.

## What works

- Playable rite in five acts (Threshold → Crossing → Witness → Inscription → Echo), single-file Three.js in `index.html`.
- Repo = master of both projects; CI syncs both to the space + GitHub **App webhook** + Pages.
- Co-presence proven on staging; the client just needs a prod endpoint.

## Open / deferred (for the show)

- **Co-presence → prod:** promote di.iiii `dev→main`, then set `<meta name="mesh-url" content="wss://di-studio.xyz/serverXR/mesh">` in `index.html` and push (Pages + space sync). Currently the deployed rite is still **solo**.
- **Biometrics (rPPG + EVM)** — the "measurable shadow"; status unknown / likely not built. Riskiest to land before Jul 20.
- **Keeper dialogue** depth; **sound** (duduk dam-drone), khachkar craft, Armenian-letter legibility — polish, high felt-impact.
- **Show logistics undecided** — screen vs projection vs personal devices — changes what co-presence/biometrics mean physically.
- **SECURITY (pending):** rotate the GitHub App private key + webhook secret (both passed through chat).
- **External `v.0000` wording** — fellowship application (`docs/ops/creative-innovation-fellowship-2026.md`) + lookbook still say "v.0000"; left untouched (submission materials), not yet aligned to "v.oooooo 2".
- `wsMesh.js` in this repo is now superseded by di.iiii `meshHub.js` for hosting; keep for local/offline runs. `src/components/NodeCanvas.jsx` unused.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (`sync-space.yml`) + App webhook. Verify space: GET `/serverXR/api/spaces/br_id_ge/github-link` → `lastSyncSha`. Mesh backend deploys with di.iiii (`dev`→staging, `main`→prod).
