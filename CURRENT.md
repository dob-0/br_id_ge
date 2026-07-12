# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · live: https://dob-0.github.io/br_id_ge/ · space: https://di-studio.xyz/br_id_ge
near milestone: **Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · program: 3d research → 8d lab → 1d install → 2d festival · ~8 days to arrival as of 2026-07-12

**versions:** `v.oooooo` = legacy Space Node (`v.oooooo.html` → space `v-oooooo`, renders `docs/PROJECT.md` live) · `v.oooooo 2` = the five-act rite (`index.html` → space `newww`). Repo is master; space syncs from it.

## Focus

**The hosq collaboration only.** Everything else (fellowship, grants, N-Node phases, biometrics) is parked. Curatorial ground truth: `docs/MASTER_CONTEXT.md` — rebuilt 2026-07-12 from the NotebookLM briefing (collaboration facts, festival program, notation concept incl. Khaz, canonical vocabulary, research→practice).

## Last session (2026-07-13)

- **The point is canonical** (`docs/MASTER_CONTEXT.md` §0): br_id_ge = di.iiii's portal &
  collaborative process lab, framed by notation; reality → scan → notation → space →
  connection; the loop is recursive. All docs lead with it.
- **vi.ritual → di.iiii is BUILT:** finishing the rite writes the inscription into di.iiii
  space `vi-ritual` as a permanent object (append-only "open inscriptions" API on di.iiii
  `dev`). Client wiring in `index.html`, gated by `<meta name="field-url">` (commented) /
  `?field=`. The rite also READS the shared field into Act V. Live locally end-to-end.
- **One design language** across all surrounding surfaces (void #05080d · cyan=di.iiii/live ·
  crimson=the real/drafts · amber=lamp/⚠ · stone=memory/letterforms); the rite itself untouched.
- Docs now describe br_id_ge as a system (rite · field · mesh · jam · constellation · scanners).

## What works

- Playable rite in five acts (Threshold → Crossing → Witness → Inscription → Echo), single-file Three.js in `index.html`; synthesized duduk drone.
- Repo = master of both space projects; CI syncs both + Pages.
- Co-presence mesh live on staging AND prod backends; client speaks it via `?mesh=`.
- Field writes live locally + backend on staging; ops constellation space `br-id-ge-ops` (local).

## Open (hosq track)

- **Go-live pair:** uncomment `<meta name="mesh-url">` AND `<meta name="field-url">` in
  `index.html` + push — after di.iiii dev→main promotion and creating prod spaces
  `vi-ritual` (public + openInscriptions) and `br-id-ge-ops` (private) while signed in.
- **Staging format** (projection / devices / spatial tracking) — decided during the lab; determines what co-presence means in the hall.
- **Notation reading of the piece:** whether the Khaz/score framing of the letter bridge becomes explicit in the artwork.
- **Felt-impact polish:** Keeper dialogue depth, sound (real duduk vs synth), khachkar craft, letter legibility.
- **On-screen wording:** rite still shows "v.oooooo 2"; external materials say "v.0000" — deliberately left as the artwork's face.
- **SECURITY (pending):** rotate the GitHub App private key + webhook secret (both passed through chat).

## Parked (not now)

- Biometrics (rPPG + EVM, "the measurable shadow") — researched, not built.
- Fellowship/grant materials — moved to the private ops repo `dob-0/br_id_ge-ops` (2026-07-12); see `docs/ops/README.md`.
- N-Node multi-city phases, ROS actuation — git history.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (`sync-space.yml`) + App webhook. Verify space: GET `/serverXR/api/spaces/br_id_ge/github-link` → `lastSyncSha`. Mesh backend deploys with di.iiii (`dev`→staging, `main`→prod).
