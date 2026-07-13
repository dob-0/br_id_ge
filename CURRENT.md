# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · the rite: https://di-studio.xyz/br_id_ge/p/newww · the landing: https://di-studio.xyz/br_id_ge
near milestone: **Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · ~7 days to arrival as of 2026-07-13

**Title:** `br_id_ge XR_ Notations:vi.ritual` (vi = virtual; plural vi.rituals, plain s).
**versions:** `v.oooooo` = legacy Space Node · `v.oooooo 2` = the corridor rite (git history) ·
**`v.oooooo 3` = THE SCAN** — total rewrite 2026-07-13 (`index.html` → project `newww`, presented as **vi.ritual**). Repo is master; space syncs from it.

## Focus

**The hosq collaboration only.** Canonical concept & recap: `docs/MASTER_CONTEXT.md` §0
(one line / one paragraph / one page — every other about-text derives from it).

## Last session (2026-07-13 later — THE SCAN + di.iiii-only links)

- **The rite rewritten totally → "the scan" (v.oooooo 3):** your camera is the lamp; what it
  sees enters the bridge as Armenian letters (glyph-atlas point shader, 64×36 shell). Sweep to
  crystallize — the real arrives CRIMSON, settles to stone/amber. Same liturgy: five acts,
  Keeper's two questions, inscription POST + mesh presence unchanged. At inscription the whole
  remembered world CONDENSES into the digitalkar (name above, word upon it) → Echo shows the
  field. No camera / sandboxed → "memory mode": the bridge dreams a room, same mechanic, still
  completes. Privacy stated on the intro: no image leaves the device. HUD is honest now (no fake
  bpm/latency). Verified end-to-end headless (fake cam + denied cam): full loop, POST lands, 0 errors.
- **LINKS CANON (user command): di.iiii URLs ONLY — no GitHub links ever again.** Rite =
  `/br_id_ge/p/newww`, field = `/p/br-id-ge-field`, hosq/jam = `/p/br-id-ge-hosq|jam` (the
  `/:space/p/:id` public viewer). Both repos rewritten; graduate.sh prints di.iiii links;
  Pages/repo = backend mirror only. Remaining github URLs: og:image jpgs (3 stills need one
  prod asset upload, then patch) + package.json machinery + field.html hostname check (functional).
- **Camera-in-viewer finding:** `/p/` viewer iframes are sandboxed srcDoc (opaque origin) →
  getUserMedia impossible there BY DESIGN. Full scan needs a top-level di.iiii URL — proposed:
  small serverXR raw-page route, owner/admin-gated per space (NOT built yet). Inside the viewer
  the rite auto-falls back to memory mode, so /p/newww still completes.
- **digitalkar / khachkar-implicit canon unchanged; rider status unchanged (see hosq track).**

## What works

- The full loop LIVE on the internet: cross at di-studio.xyz/br_id_ge/p/newww → mesh co-presence
  → digitalkar lands in prod space `br_id_ge` → visible in the field (/p/br-id-ge-field) and in Act V.
- ONE space holds everything (landing · rite · field scene · board · map · guide · drafts · beta lab).
- CI: push main → Pages + space sync; ops sync via `sync-ops.sh` (or the /sync skill).

## Open (hosq track)

- ⚠ Projector: venue's unit confirmed, or which di.ii backup? (last rider blank)
- ⚠ hosq recipient for the one-pager + send the approved blurb to Lusine → then `graduate.sh hosq`.
- ⚠ Jam slot dates → `graduate.sh jam`.
- Staging format (projection / devices / hybrid) — decided during the lab.
- **Scan on prod needs:** (a) user push of `main` (commits 3a9acb0 + the scan are local-only),
  (b) the serverXR raw-page route so phones/projection get the camera tier, (c) og:image stills
  as prod assets. Until then /p/newww serves the scan in memory mode.
- Felt-impact polish: Keeper dialogue depth, sound (real duduk vs synth), letter legibility.
- **SECURITY (pending):** rotate the GitHub App private key + webhook secret.

## Parked (not now)

- Biometrics (rPPG + EVM) — researched, not built.
- Fellowship materials — private in `dob-0/br_id_ge-ops` `applications/`.
- N-Node multi-city phases, ROS actuation — git history.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (3 manifests;
publish pointer is admin-set, CI token can't move it). Ops: `bash scripts/sync-ops.sh`
(local/staging/prod token auto-pick). Mesh + inscriptions deploy with di.iiii (`dev`→staging, `main`→prod).
