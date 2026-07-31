# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · the door: https://di-studio.xyz/br_id_ge · the rite: /br_id_ge/rite · the field: /br_id_ge/field
**Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · festival days Aug 1–2

**Title:** `br_id_ge XR_ Notations:vi.ritual` (vi = virtual).
**The rite:** `v.oooooo 3` — THE READING (2D canvas, no Three.js): your silhouette reads
Armenian letters along its own edge. Repo is master; the space syncs from it on push.

## The shape (after the 2026-07-31 declutter)

- **One public face.** The door (`landing`) is the only published entry; its links are
  the rite and the field. Everything else left the space (members, jam, hosq one-pager,
  ops-board, guide, lab, constellation, legacy v-oooooo) — full snapshots in di-spaces git.
- **Camera works online** (phone-verified): di.iiii published pages opt in via
  `deviceAccess` in `di-space.json` → the viewer grants a real origin. The old
  "camera needs a top-level route" limitation is gone.
- Repo carries only what runs: `bridge.html` (door) · `index.html` (rite) ·
  `field.html` · `dash.html` (show-rig planning, internal) · `scripts/`
  (serve.mjs local mirror, sync-space.mjs engine, auto-push watchers) · `docs/`.

## What works

- Full loop LIVE on prod: cross at /br_id_ge/rite → core lands in the space →
  visible in the field and Act V. Camera lamp opens on mobile.
- CI: push main → GitHub Pages (mirror) + Sync di.iiii Space (rite + landing manifests).
- Staging mirrors prod (space-bundle realign 2026-07-31).

## Open

- **Visual direction still not accepted** — user has rejected every pass incl. the
  current black/one-ink build. Next: design research before another repaint.
- **Concept pass pending:** MASTER_CONTEXT §6 describes tuff/light; the rite is
  black one-ink. Do together with the visual pass.
- Sound — biggest untouched lever.
- og:image stills point at the github.io mirror (3 URLs) — works, but di.iiii-hosted
  would match the "di.iiii URLs only" rule.
- User-only: rotate GitHub App key + webhook secret; di-bo `ANNOUNCE_CHATS` ids +
  token rotation; clear test stones from the field if still present.

## Deploy

`git push origin main` → Pages + space sync. Local: `node scripts/serve.mjs`
(staging tier; `--to prod` when you mean it). Mesh + inscriptions deploy with di.iiii.
