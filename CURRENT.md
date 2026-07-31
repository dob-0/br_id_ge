# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · the rite: https://di-studio.xyz/br_id_ge/rite · the landing: https://di-studio.xyz/br_id_ge
**Notations #2 is RUNNING — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · day 11 of 14 as of 2026-07-30

**Title:** `br_id_ge XR_ Notations:vi.ritual` (vi = virtual; plural vi.rituals, plain s).
**versions:** `v.oooooo` legacy · `v.oooooo 2` corridor rite (git history) · scan rewrite 2026-07-13 ·
**`v.oooooo 3` = THE READING** — rewritten from zero 2026-07-29 (2D canvas, no Three.js). Repo is master; space syncs from it.

## Focus

**The hosq collaboration only.** Canonical concept & recap: `docs/MASTER_CONTEXT.md` §0.

## Last session (2026-07-29/30 — rewrite from zero; the shared body; the core)

- **The rite rewritten from zero** (`index.html`, 793 lines, 2D canvas): black ground, one ink,
  three layers only. Your silhouette (MediaPipe segmentation, optional, graceful fallback) reads
  Armenian letters along its own edge by heat; act IV renamed **ՆՈԹԱԳՐՈՒԹՅՈՒՆ · notation** (user
  rejected արձանագրություն). Fixed on the way: outline accretion (cap 300 read), frame border
  read as body edge, unreachable read-target (now `everSeen*0.62` clamp 32–220), act/question
  card collision, mobile reload-on-swipe.
- **A crossing now ends in the shared body, not "cross again":** one figure whose outline is the
  words every crossing carried; presence-reactive — words near your centroid brighten, swell,
  get pushed aside (`d90bc63`). User's last note: still visually too weak — see Open.
- **Concept canon shifted: the digitalkar is a *core*** — sun-baked rock, mineral in water for
  billions of years, us, manipulating light. Khachkar lineage RETIRED (`da0e566`); ☩ purged
  from atlas + field. MASTER_CONTEXT rewritten (§6 = Light — the medium, §3 Khaz DECIDED).
- **One local link:** `node scripts/serve.mjs` → `http://localhost:8899/br_id_ge` — whole space,
  top-level (camera works), field+mesh point at **staging** by default.
- Synced to **staging only**. ⚠ **Prod `newww` is still the older warm-stele build** — deploying
  mid-festival is the user's call.
- di.iiii side: mesh nginx fix + regression test on `dev` (prod co-presence waits on promote);
  `useDriveImport` unmount fix. **di-bo live as @diiii111bot** on the VPS (needs group ids +
  token rotation).
- **Uncommitted working-tree changes not from this session** (slug rename `/p/newww`→`/rite`,
  `field`, `hosq`, `jam` across docs/bridge/field/serve.mjs) — looks like another agent's pass;
  left uncommitted deliberately.

## What works

- Full loop LIVE: cross at di-studio.xyz/br_id_ge/rite → the core lands in prod space
  `br_id_ge` → visible in the field (/field) and in Act V. Field is OPEN (was closed 9 days).
- New rite verified end-to-end on staging + `serve.mjs` (fake cam, denied cam, mobile).
- CI: push main → Pages + space sync (`DI_SPACE_TOKEN` fixed); ops via `sync-ops.sh`.

## Open

- **Visual direction still not accepted** — user rejected every pass so far incl. the current
  black/one-ink build ("i still don't like the style", elements overlap). Next: deep design
  research for reference points before another repaint; React/modern stack is allowed.
- **Concept pass pending** (user asked to "work on concept"): MASTER_CONTEXT §6 is stale again
  (describes tuff/light; rite is black one-ink) and the shared body is in code but not in §0/§4.
  Deferred until the look settles — do both in one pass.
- ⚠ **Deploy decision:** ship the new rite to prod, or hold until the design lands? Prod runs
  the old build mid-festival.
- User-only: cross once live to prove end-to-end (then clear the 8 test stones — confirm if
  `գևորգ · կամուրջ` was you); promote di.iiii `dev → main` (prod co-presence); DNS
  `sandbox.di-studio.xyz → 167.233.216.253` (camera tier inside di.iiii); rotate di-bo token +
  supply `ANNOUNCE_CHATS` ids; hosq one-pager recipient; jam slot dates; projector question;
  rotate GitHub App key.
- og:image stills as prod assets (3 URLs still point at github.io).
- Sound — biggest untouched lever; rider already accounts for it.

## Parked (not now)

- Biometrics (rPPG + EVM) · fellowship materials (`br_id_ge-ops`) · N-Node/ROS (git history).

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (3 manifests;
publish pointer is admin-set). Ops: `bash scripts/sync-ops.sh`. Local: `node scripts/serve.mjs`
(staging tier; `--to prod` when you mean it). Mesh + inscriptions deploy with di.iiii
(`dev`→staging, `main`→prod).

## Declutter pass (2026-07-31)

- One public face: the door (`landing`) is the single published entry; rite and
  field are its clean links (`/br_id_ge/<name>`). members / jam / hosq removed
  2026-07-31 (stale info) — snapshots in di-spaces git.
- Removed from repo: `serverXR/wsMesh.js` (mesh lives in di.iiii meshHub),
  legacy `v.oooooo.html` + `di-space.v1.json` (CI line dropped), stale
  copilot-instructions; `ws` dep gone. dash (show-rig planning) folded into
  main from the old needs-dash worktree — worktree removed.
- Space-side archive (user-run): delete `ops-board`, `br-id-ge-guide`,
  `br-id-ge-lab`, `br-id-ge-graph`, `v-oooooo` from prod br-id-ge; snapshots
  live in di-spaces git. `br-id-ge-hosq` kept (possibly shared with press).
