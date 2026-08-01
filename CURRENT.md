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

## This pass (2026-08-01)

- **Door redesigned** to the paper-and-ink face, minimal: կամուրջ serif title, one lede,
  cross + field links, event essentials in the frame corners. Old void/cyan face gone.
- **Field**: every crossing now leaves its OWN shape (seeded by inscription id, permanent);
  "all together ↔ each alone" toggle gathers all cores into one shared body;
  the keeper (պահապան, graphite knot at center) wakes to live blue when the jetson
  runs `scripts/keeper-presence.mjs` (mesh channel `keeper`, room `bridge`, 15s timeout;
  probe: `window.__keeper()`). After a crossing the rite links `field?just=<word>` —
  camera meets your core, then the gather plays.
- **Rite**: letters respond to touch (ink bloom + ripple); body motion surfaces edge
  letters (digitizing feel); inscription gathers letters into the core before it grows;
  act changes breathe across the letter field. All reduced-motion-safe.
- **Second pass, same day:** Rite — THE REVEAL: camera opens as a paper-toned photo,
  the analysis becomes visible (skeleton hairlines, silhouette ink wash, one blue scan),
  the photo drains, the measurement holds, then the reading takes over; persistent faint
  skeleton through the whole rite (camera path only; dreamed path untouched).
  Field — Unfinished Swan: opens blank, taps throw ink stains that reveal the crossings
  they touch (gather/arrival print all); keeper is now an AI lattice (wireframe
  icosahedron + eye + orbits, not a knot); tap it → keeper window: see through di_bot's
  eye (`keeper:eye` jpeg frames) and speak with it (`keeper:ask`/`keeper:say` over the
  mesh; jetson: `keeper-presence.mjs --eye /dev/video0 --ollama http://127.0.0.1:11434`);
  invisible wire — hairline thread sewing every revealed core through the keeper,
  blue-tinted when awake.
- Still open from the brainstorm: 3D letter-body gather, AR/VR field entry,
  keeper TTS/physical-witness on the show rig.

## What works

- Full loop LIVE on prod: cross at /br_id_ge/rite → core lands in the space →
  visible in the field and Act V. Camera lamp opens on mobile.
- CI: push main → GitHub Pages (mirror) + Sync di.iiii Space (rite + landing manifests).
- Staging mirrors prod (space-bundle realign 2026-07-31).

## Open

- **New face shipped 2026-07-31 — paper & ink & chrome** (user brief: contemporary /
  brutalist / minimalist / metamodern): warm paper ground, hairline frame, mono HUD
  corners, ink letters, one live blue; the core is the piece's single Three.js
  object — an iridescent chrome knot that recedes for the shared body. Sound added
  the same pass: glass grains per letter read + a breathing room tone that follows
  the acts and hushes for the Keeper (all synthesized, unlocked by the door touch).
  Awaiting the user's verdict on the look.
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
