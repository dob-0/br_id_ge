# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · live: https://dob-0.github.io/br_id_ge/ · space: https://di-studio.xyz/br_id_ge
near milestone: **Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · program: 3d research → 8d lab → 1d install → 2d festival · ~8 days to arrival as of 2026-07-12

**versions:** `v.oooooo` = legacy Space Node (`v.oooooo.html` → space `v-oooooo`, renders `docs/PROJECT.md` live) · `v.oooooo 2` = the five-act rite (`index.html` → space `newww`). Repo is master; space syncs from it.

## Focus

**The hosq collaboration only.** Everything else (fellowship, grants, N-Node phases, biometrics) is parked. Curatorial ground truth: `docs/MASTER_CONTEXT.md` — rebuilt 2026-07-12 from the NotebookLM briefing (collaboration facts, festival program, notation concept incl. Khaz, canonical vocabulary, research→practice).

## Last session (2026-07-12)

- **Docs cleared of odd data, recentered on hosq/Notations #2:** rewrote `docs/MASTER_CONTEXT.md` (hosq team, program, "Rituals"/Communitas theme, notation concept, core vocabulary, research→practice, parked directions), `docs/PROJECT.md` (now describes the actual rite; legacy node renders this live), `README.md`; updated `AGENTS.md`, `DEVELOPMENT.md`, copilot-instructions. Old N-Node/Munich-Gyumri/ROS/Ghost-Hand framing removed — recoverable from git history.
- **Deleted dead files:** `README.md.backup`, `index.content.html`, `src/components/NodeCanvas.jsx`.
- **Mesh status corrected:** the co-presence backend **IS live on prod** — di.iiii `466066b3` is on `origin/main`, `wss://di-studio.xyz/serverXR/mesh` accepts connections (verified 2026-07-12). Deployed rite is solo only because `<meta name="mesh-url">` in `index.html` is still commented out.

## What works

- Playable rite in five acts (Threshold → Crossing → Witness → Inscription → Echo), single-file Three.js in `index.html`; synthesized duduk drone.
- Repo = master of both space projects; CI syncs both + Pages.
- Co-presence mesh live on staging AND prod backends; client speaks it via `?mesh=`.

## Open (hosq track)

- **Co-presence go-live:** uncomment/set `<meta name="mesh-url" content="wss://di-studio.xyz/serverXR/mesh">` in `index.html`, push. That's the whole step.
- **Staging format** (projection / devices / spatial tracking) — decided during the lab; determines what co-presence means in the hall.
- **Notation reading of the piece:** whether the Khaz/score framing of the letter bridge becomes explicit in the artwork.
- **Felt-impact polish:** Keeper dialogue depth, sound (real duduk vs synth), khachkar craft, letter legibility.
- **On-screen wording:** rite still shows "v.oooooo 2"; external materials say "v.0000" — deliberately left as the artwork's face.
- **SECURITY (pending):** rotate the GitHub App private key + webhook secret (both passed through chat).

## Parked (not now)

- Biometrics (rPPG + EVM, "the measurable shadow") — researched, not built.
- Fellowship/grant materials (`docs/ops/` untracked, left alone).
- N-Node multi-city phases, ROS actuation — git history.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (`sync-space.yml`) + App webhook. Verify space: GET `/serverXR/api/spaces/br_id_ge/github-link` → `lastSyncSha`. Mesh backend deploys with di.iiii (`dev`→staging, `main`→prod).
