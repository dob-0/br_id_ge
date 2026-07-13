# Current State — br_id_ge

Read first. Updated at end of each session. Replace, don't append.

active_branch: main · the rite: https://dob-0.github.io/br_id_ge/ · the landing: https://di-studio.xyz/br_id_ge
near milestone: **Notations #2 — Jul 20–Aug 2 2026** (State Philharmonia, hosted by **hosq**) · ~7 days to arrival as of 2026-07-13

**Title:** `br_id_ge XR_ Notations:vi.ritual` (vi = virtual; plural vi.rituals, plain s).
**versions:** `v.oooooo` = legacy Space Node · `v.oooooo 2` = the five-act rite (`index.html` → project `newww`, presented as **vi.ritual**). Repo is master; space syncs from it.

## Focus

**The hosq collaboration only.** Canonical concept & recap: `docs/MASTER_CONTEXT.md` §0
(one line / one paragraph / one page — every other about-text derives from it).

## Last session (2026-07-13 — GO-LIVE)

- **LIVE ON PROD, all tiers identical:** di.iiii dev→main promoted; `di-studio.xyz/br_id_ge`
  = the landing (published face); both metas flipped — **the rite is communal** (live mesh)
  and every crossing leaves a permanent stone in the space's scene; first prod stone laid.
- **digitalkar** is the stone's canonical name (digital + kar/քար "stone"); the word
  "khachkar" is excluded from ALL surfaces — it is the deep lineage, recorded once in
  MASTER_CONTEXT §4 as implicit. Evolution canon: stone became human; the human returns into stone.
- **Rider FILLED** (requirements-not-questions, from studio inventory) — hosq one-pager has
  ONE ⚠ left (projector backup confirm); PDF exported; graduation still user-gated.
- **House-pattern cleanup** (analyzed vs beyond_form/platform_recordar): 31MB unreferenced
  `references/` cut from Pages, og:meta added, project titles polished ("vi.ritual — the
  rite", "the landing — the door"), motion pass (reduced-motion-safe) on landing/field.
- Ops repo got its toolkit: AGENTS.md/CLAUDE.md, `/sync` `/publish` `/status` skills,
  autosync hook, permission allowlist.

## What works

- The full loop LIVE on the internet: cross at dob-0.github.io/br_id_ge → mesh co-presence
  → digitalkar lands in prod space `br_id_ge` → visible at /field.html and in Act V.
- ONE space holds everything (landing · rite · field scene · board · map · guide · drafts · beta lab).
- CI: push main → Pages + space sync; ops sync via `sync-ops.sh` (or the /sync skill).

## Open (hosq track)

- ⚠ Projector: venue's unit confirmed, or which di.ii backup? (last rider blank)
- ⚠ hosq recipient for the one-pager + send the approved blurb to Lusine → then `graduate.sh hosq`.
- ⚠ Jam slot dates → `graduate.sh jam`.
- Staging format (projection / devices / hybrid) — decided during the lab.
- Felt-impact polish: Keeper dialogue depth, sound (real duduk vs synth), letter legibility.
- On-screen wording: rite shows "v.oooooo 2"; presented as vi.ritual — deliberate.
- **SECURITY (pending):** rotate the GitHub App private key + webhook secret.

## Parked (not now)

- Biometrics (rPPG + EVM) — researched, not built.
- Fellowship materials — private in `dob-0/br_id_ge-ops` `applications/`.
- N-Node multi-city phases, ROS actuation — git history.

## Deploy

`git push origin main` → GitHub Pages (`pages.yml`) + `Sync di.iiii Space` (3 manifests;
publish pointer is admin-set, CI token can't move it). Ops: `bash scripts/sync-ops.sh`
(local/staging/prod token auto-pick). Mesh + inscriptions deploy with di.iiii (`dev`→staging, `main`→prod).
