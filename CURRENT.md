# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · the rite: https://di-studio.xyz/br_id_ge/p/newww · the landing: https://di-studio.xyz/br_id_ge
**Notations #2 is RUNNING — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · day 9 of 14 as of 2026-07-28

**Title:** `br_id_ge XR_ Notations:vi.ritual` (vi = virtual; plural vi.rituals, plain s).
**versions:** `v.oooooo` = legacy Space Node · `v.oooooo 2` = the corridor rite (git history) ·
**`v.oooooo 3` = THE SCAN** — total rewrite 2026-07-13 (`index.html` → project `newww`, presented as **vi.ritual**). Repo is master; space syncs from it.

## Focus

**The hosq collaboration only.** Canonical concept & recap: `docs/MASTER_CONTEXT.md` §0
(one line / one paragraph / one page — every other about-text derives from it).

## Last session (2026-07-29 — the field was closed the whole time; di-bo built)

- **THE BIG ONE: `openInscriptions` was `false` on the prod space.** Every inscription
  POST 403'd and the rite's client swallowed it (`.catch(()=>{})`), so Act V played its
  "your word joins everyone who crossed before you" lines unchanged. **Nine days of
  festival, zero visitor cores** — the field still holds only gevorg·կամուրջ from
  Jul 13. Flipped back to `true` on prod (verified in the space meta).
- **The rite no longer lies:** a failed inscription now shows one quiet line in its own
  register (`#unjoined`), and only on failure — verified headlessly both ways (403 → line
  shown, 200 → nothing). Pushed; CI auto-synced to prod (token fix from yesterday works).
- **di-bo built** → `/home/nooo/di-bo`, deployed to VPS `/opt/di-bo`, systemd unit
  installed but **not started — needs the BotFather token**. Announces crossings to the
  di + hosq groups, alerts *you* when prod/mesh/inscriptions break, serves the canonical
  links, owner-only claude relay (off by default). Tests pass from laptop and VPS.
- ⚠ **Still unproven end to end:** a live crossing. The write test was blocked, so
  cross at `/p/newww` yourself — it puts a real stone in the field instead of test junk.

## Previous session (2026-07-28 — THE SCAN finally shipped, mid-festival)

- **The scan + the keeper had been sitting unpushed on local `main` for 14 days.**
  Pushed (`3a9acb0`, `534c5d0`, `1eaea46` + the landing pass `f1277bd`). Until today the
  festival audience was crossing the *old corridor rite*. Verified in a real browser on prod:
  `/p/newww` serves "you are the lamp", privacy line intact; landing shows the lamp glow,
  parallax letters, kamurj gloss, three doors, badge/footer overlap gone.
- **CI space-sync is broken and stayed broken:** the `Sync di.iiii Space` workflow 401s because
  its repo secret `LIVE_API_TOKEN` holds the **staging** token while the workflow targets prod.
  Worked around by syncing all three manifests manually with `PROD_API_TOKEN`. ⚠ **Every future
  push to `main` will fail this workflow until the GitHub secret is updated** (user-only).
- **Co-presence was dead the whole run-up, not just today.** `wss://…/serverXR/mesh` 404s on prod
  AND staging. Cause is in di.iiii, not here: the VPS migration (2026-07-15) rebuilt `nginx.conf`
  with the socket.io upgrade rule but not the mesh one, so nginx strips the `Upgrade` headers.
  `meshHub.test.js` bypasses nginx, so it stayed green. Fixed on di.iiii `dev` + regression guard
  that parses `nginx.conf`. **Reaches prod only when di.iiii `dev → main` is promoted.**
- Also fixed on di.iiii `dev`: a `setState`-after-unmount in `useDriveImport` that made CI exit 1
  with all tests green — it was blocking the prod deploy.

## Previous session (2026-07-13 later — THE SCAN + di.iiii-only links)

- **The rite rewritten totally → "the scan" (v.oooooo 3):** your camera is the lamp; what it
  sees enters the bridge as Armenian letters (glyph-atlas point shader, 64×36 shell). Sweep to
  crystallize — the real arrives CRIMSON, settles to stone/amber. Same liturgy: five acts,
  Keeper's two questions, inscription POST + mesh presence unchanged. At inscription the whole
  remembered world CONDENSES into the core (name above, word upon it) → Echo shows the
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
- **the core is the canonical name (2026-07-30); "digitalkar" is retired and the khachkar
  lineage with it — see MASTER_CONTEXT §4. Rider status unchanged (see hosq track).**

## What works

- The full loop LIVE on the internet: cross at di-studio.xyz/br_id_ge/p/newww → mesh co-presence
  → the core lands in prod space `br_id_ge` → visible in the field (/p/br-id-ge-field) and in Act V.
- ONE space holds everything (landing · rite · field scene · board · map · guide · drafts · beta lab).
- CI: push main → Pages + space sync; ops sync via `sync-ops.sh` (or the /sync skill).

## Open (hosq track)

- ⚠ Projector: venue's unit confirmed, or which di.ii backup? (last rider blank)
- ⚠ hosq recipient for the one-pager + send the approved blurb to Lusine → then `graduate.sh hosq`.
- ⚠ Jam slot dates → `graduate.sh jam`.
- Staging format (projection / devices / hybrid) — decided during the lab.
- ⚠ **Update the `LIVE_API_TOKEN` GitHub secret** on `dob-0/br_id_ge` to the prod token, or CI
  space-sync keeps 401ing on every push to `main` (user-only — token must not pass through chat).
- ⚠ **Promote di.iiii `dev → main`** to restore co-presence on prod (mesh nginx fix). User-only.
- **Scan on prod: DONE** (pushed + synced 2026-07-28). Still open for the full camera tier:
  (a) the serverXR raw-page route so phones/projection get camera instead of memory mode —
  `/p/` viewer iframes are sandboxed by design, (b) og:image stills as prod assets.
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
