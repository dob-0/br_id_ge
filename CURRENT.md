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

## This pass (2026-08-05, fourth) — the crossing keeps the drawing, and the end moves

**NOT COMMITTED — br_id_ge working tree is dirty; the di.iiii half is a worktree.**

- **The mark.** The threshold ink used to dry in seven seconds and be thrown away,
  and the form a crossing wore in the field was a torus knot picked by a hash of
  its own id — unique, permanent, and nobody's. The drawing is now KEPT: quantized
  to a byte per axis inside its own box, carried as an opaque `m1.…` base64url
  token (~1KB), and stood up in the field as a chrome tube in the same material as
  every knot. A crossing with no mark still gets its knot.
- **The end is a page you can write on again.** Once the shared body has finished
  arriving the ink returns; what you leave there replaces what you left at the
  door. Letters are NOT born at the ending — the page is already full of everyone's
  words, and a letter born there would belong to nobody. The mark writes itself
  back in where the core stood, at a hand's speed.
- **The field is IN the ending.** The passage went through three shapes — a 40s
  lapse, then a 14s rule that travelled by itself — and both were answers to the
  wrong question. What was wanted was to SEE the field at "you are part of it
  now.", not to be taken somewhere. So the field itself now opens inside the
  ending: `field.html?…&embed=1` in a transparent iframe filling everything above
  the closing line, arriving the moment the shared body has finished. The cores
  stand among the letters and over the drawn mark. A **tap** goes in; a **drag**
  is still ink, so the ending is a page you can write on with the field on it. Two
  hard refusals stay — nothing opens over the unmake question, and nothing opens
  when the far field refused the crossing. `?embed=1` strips the field's own
  furniture (hud, frame, keeper panel, ground ring, dust, contact shadows,
  captions) and skips its mesh socket: the rite is already in that room.
- **The hand-off is exact.** `?just=<word>` alone matched on a word six people have
  carried, so "your core is there" could walk a visitor to a stranger's. It now
  carries `&me=<inscription id>`; the word stays as the fallback.
- **⚠ A pre-existing showstopper, found and fixed: the rite could not be finished
  under `prefers-reduced-motion`.** The dreamed circle was snapped onto the
  fingertip with no lag, which welded its EDGE — the only thing a pointer can read
  — exactly one radius from the hand, forever. Nothing was ever read, the reading
  never advanced, and the rite ended at act ii. Reproduced on committed HEAD before
  the fix. The lag is the mechanic, not decoration; it is now the same for everyone.
  Reduced motion can also draw now (it could not lay ink at all, so it had no mark).
- Two smaller ones: the memento's footer ran off both edges of the sheet whenever
  the mono font had not loaded into the canvas, and it now carries the drawing.
- **Every crossing looks like a different crossing.** Ten knot pairs on one
  geometry made two dozen near-twins; "each one = a crossing" was a caption the
  picture did not support. The id now seeds a FAMILY first — knot, the same knot
  pulled to wire, a ring, a line drawn through space, a cut stone — and the family
  is what the eye tells apart. Same id, same form, forever.
- **The letters, together.** A crossing's word was a caption that vanished the
  moment the field gathered. Every core now carries its own Armenian word around
  itself, letter by letter, and the letters ride the group — so gathering the
  cores gathers the alphabet. Apart they are a whisper; together they ARE the body.

### The mobile audit (asked for, and it was overdue)

The rule the whole repo runs on is "see it before it ships" — and everything was
being seen on a desk. Four things were desktop-only by accident:

1. **The reading was a smear on a phone.** The mask grid is 96 × 54 — a landscape
   grid. Stretched onto 412 × 915 a cell is 4px wide and 17px tall, so capitals
   overlapped horizontally while whole bands of the screen stayed empty. One
   `STEP` for both axes could not fix it: thinning enough to stop the collision
   emptied the vertical. Each axis is now thinned by what that axis actually
   measures (`STEPX`/`STEPY`, never under 12px between glyphs) and the glyph is
   sized to the gap it was given. Wide screens are unchanged — the letters are
   meant to crowd a little there.
2. **The field's two top corners crossed each other** at 412px (470px of text in
   412px of room), and "all together" sat on "cross the bridge" in the bottom row.
   Smaller type, one row per thing, and the keeper's panel — which was a floating
   card over the middle of the screen, i.e. over the whole phone — is a sheet that
   stops short of the bottom row.
3. **The field was framed from a desk seat.** A flat disc seen low is a band across
   the middle of a wide window and a stripe with empty paper above and below it in
   a tall one, with half the cores off both edges. On portrait the spiral winds
   tighter, the seat rises (more of a look down), and the camera steps back by how
   much taller than wide the screen is. Captions are smaller and sit further clear.
4. **`#hint` was `display:none` on phones** — and it is the only place the piece
   says that a tap reveals the crossings, so the field's one mechanic was a desktop
   feature by accident. It stays now; only the mouse half ("drag orbit · scroll
   zoom") goes.

### di.iiii side — worktree `.claude/worktrees/inscription-mark`, branch `feat/inscription-mark`, NOT committed

- `POST /inscriptions` accepts an optional `mark`; `PUT /inscriptions/:id/mark`
  replaces it later with the same proof that unmakes a crossing (the ending's
  drawing happens after the crossing was posted). Validated by SHAPE and never
  parsed server-side; a malformed or oversized mark is DROPPED and the crossing
  still succeeds. Added to `PUBLIC_CORS_ROUTES` alongside its DELETE sibling.
- 14 new tests (`inscriptionRoutes.test.js`); **282/282 serverXR tests pass**, eslint clean.
  Wiki entry `open-inscriptions` updated — it still claimed "update and delete are
  impossible on this path", which the proof-gated DELETE had already made untrue.

### Seen, not assumed

Local mirror on **:8907** (`serve.mjs`, staging tier) and a second rig on **:8912**
against a local serverXR carrying the change on **:4111**. Playwright at a Pixel-7
viewport, DPR 2.6, and 1440x800 DPR 2:

- full crossing, threshold drawing to act v, both questions, normal AND reduced motion
- the ending drawn on, the mark rewritten, the memento downloaded and opened
- the field opening inside the ending, its iframe reporting its own core count, a
  drag over it still drawing, and a tap travelling to the real field
- the reading at 412x915 before and after the per-axis fix — the same screenshot
  went from an unreadable run of overlapping capitals to separated letters
- the field at 412x915 and 360x740: measured corner boxes, no overlaps left
- **a stranger's browser with an empty localStorage seeing the drawn marks** — the
  proof that the server half works — and a rejected mark falling back to a knot
- one regression caught by looking: opening the passage grew the closing block and
  walked "you are part of it now." into the body's bottom arc. The passage now
  holds its space from the first frame.

## This pass (2026-08-05, third) — the sync engine, and a keeper that was lying

- **The engine upstream had it backwards.** di.iiii's `scripts/space-sync.mjs` is
  documented as THE copy the linked repos vendor — and it was the stale one, four
  months behind, still defaulting a target-less sync to the **live site** and missing
  the staging host rewrite, `deviceAccess`, `minEngine` and slug enforcement. Promoted
  to v4 in di.iiii `aa2205f7`; all four copies are byte-equal for the first time.
- **Three reasons nobody saw it**, each now closed: `space-sync-vendor.mjs` — the
  equality check the engine header has always told people to run — **did not exist**;
  two literal **NUL bytes** in the glob translator made git call the file binary, so it
  had no diff and no grep in either drift; and nothing tested it. `space-sync.test.js`
  guards all three, and every assertion fails against the version it replaced.
- **The repo is master for names again.** `title` was only ever sent in the POST that
  creates a project, so a rename in a manifest reached no tier that already had one —
  `di-space.field.json` read "the field — every crossing, together" while prod and
  staging both said "the field". PATCHed on every run now; both tiers carry it.
- **Prod is byte-identical to this repo** on all four surfaces; staging differs only by
  the host rewrite (+40/+40/+24/+32 chars). Seen on a Pixel 7 viewport at prod: the rite
  reads, the door opens, and with no camera the lamp now says **"the bridge still
  carries you — touch to read"** instead of standing there silent. The field draws its
  15 cores and the keeper panel.
- **⚠ The keeper was dead on BOTH tiers and said it was fine.** `systemctl` active,
  log reading `keeper on the mesh as di.bo`, and **not one `keeper` heartbeat on
  either mesh in 32s** of listening from a third machine. The mesh itself was healthy
  (a two-client probe carried a message on both tiers). A restart brought both back —
  6 heartbeats in 32s. This is the dead pipe KEEPER.md describes, and **the DEAF_MS
  guard written to catch it did not fire**: see Open.

## This pass (2026-08-05, second) — the rite can be crossed on a phone, and it is live

- **`9190846` — three faults in the rite, each fatal alone.** (1) Touch only read when
  the camera saw *no body*, but a torso filling a front camera IS a body with no edge —
  so a phone's only input was switched off and the advice was "step back", impossible for
  whoever holds the camera. The test is now whether the body gives an **edge**; over ~90%
  cover the finger takes the reading back. An 8s stall guard catches everything else.
  (2) `target` was recomputed each frame from `everSeen`, which only grows — progress went
  *down* while the visitor did everything right; it now fixes at 20 marks read, and
  `frac()` is a high-water mark. (3) `advance()` scanned from the top, so a fast reading
  skipped **the crossing** and **the witness** entirely; it steps one act at a time now.
  Plus: the pointer ring was hidden whenever a camera existed — exactly when reading had
  fallen back to touch.
- **Seen, not assumed.** Complete crossing on a Pixel 7 viewport at DPR 2.6, touch only,
  through the real di.iiii viewer iframe on staging: acts i → ii → iii → iv → echo in
  order, both questions, the core, "you are part of it now."
- **All three repos are committed and `main` is pushed** — br_id_ge `c3ff684`, di-bo
  `303974a`, dibot `94cef99`, every tree clean. CI ran: **prod and staging both carry the
  rite fix and the `keeperFace()` name fix**; the dash answers 200 at `/br_id_ge/needs`.
- **di.bo learned di.iiii** (in `di-bo`, deployed to the Mac): `--add-dir` onto a live
  `origin/dev` checkout that was 121 commits behind, a daily ff-only refresh, a knowledge
  `CLAUDE.md`, a narrow tool allowlist, and a `dii` wrapper as the *only* network it gets —
  so a prompt-injected question cannot POST anywhere.
- **Ollama is gone from both machines** and from di.iiii's 13 documenting files
  (`377a8110`, 402 deletions). The reason is recorded, not just the removal: this desktop
  goes offline, which made a local-only fallback the least available thing in the stack.

## Previous pass (2026-08-05, first) — the keeper has a second body, and the names are settled

- **Names, decided.** **jet.di** = the robot car (repo `dibot`, hostname stays
  `di_bot`) · **di.bo** = the Telegram messenger on the VPS (repo `di-bo`).
  "the jetson" is gone from the field's copy. Written down once, in
  **[docs/KEEPER.md](docs/KEEPER.md)** — the canonical keeper doc: both bodies,
  the four channels, how to bring either up, the four states to LOOK at, and the
  failure modes. READMEs in all three repos point at it.
- **di.bo now keeps the field** while jet.di is off (`di-bo/keeper.mjs`, wired
  into `bot.mjs`): heartbeat as `di.bo`, `keeper:ask` → one fixed line back →
  the visitor's words into the owner's Telegram, and it **stands down within
  15s** of hearing jet.di. `/say` (owner DM) speaks the real answer into the
  field; `/status` names whoever holds the room.
- **Bug found by the handover test and fixed in `field.html`:** `keeperFace()`
  redrew only on the awake/asleep flip, so jet.di taking the room from di.bo left
  the page printing the old name — during a show, the wrong body. The name is now
  part of the compared face. The eye also clears when the keeper sleeps, so no
  stale frame hangs over a keeper that cannot see.
- **Verified on prod's mesh, with eyes on the page** (local `serve.mjs --to prod`):
  asleep → di.bo blue and answering a typed question → both bodies up, page says
  jet.di, di.bo logs "standing down" → jet.di gone, di.bo keeps again. di-bo's
  test suite covers the handover and the throttle on a fake clock (all passed).
- **di.bo is LIVE on the VPS**: prod's field shows `di.bo · awake — it can hear
  you` with no laptop involved. **It does not think** — a local model lasted one
  evening and answered a visitor's Armenian in transliterated mush, so it is out
  (user call). di.bo answers ONE fixed line in the same breath the visitor
  spoke; the ask lands in the owner's Telegram and `/say` speaks the real answer
  into the field. A voice worth having will be jet.di's, out loud in the room.
- **A dead-pipe bug the human pass caught:** the first deploy went silent within
  minutes — the mesh websocket stopped carrying without ever closing, so every
  publish "succeeded" into a void while the field said asleep. The heartbeat now
  carries a `control:ping` and rebuilds a pipe that goes deaf for 20s.
- ~~Nothing is committed in any of the three repos~~ — all three landed later the same
  day; the `keeperFace()` name fix is on prod.
- **jet.di is still offline** (no ping to 192.168.1.11): `keeper_agent.py` +
  `dibot-keeper.service` remain uninstalled from the 2026-08-01 drop.
- **What visiting prod as a stranger showed, unfixed:** the door sits **~15s
  black** before it paints and the field ~10s, with nothing on screen saying
  anything is coming · the keeper window **opens by itself** on plain arrival
  though every hint and doc says *tap the lattice* · the **invisible wire is no
  longer invisible** — awake, 28 cores each sewn to the keeper turn the field
  into a dominant blue web, a state nobody had seen because until tonight the
  keeper was never actually awake.

## Previous pass (2026-08-04, second) — the ending reads, and every tier gets it

- **The tiers had drifted three ways, and each held something the others lacked.**
  Prod carried two fixes that were never in git (the ink cursor `#cur` in the rite;
  `revealAll()` on plain arrival at the field) — hand-applied, unrecorded. The repo
  carried two prod never got (the srcdoc `?just=` hand-off, the detector rest that
  stopped the ending grinding). Staging was a whole redesign behind — still wearing
  the old void-and-cyan door from before the 2026-07-31 declutter. All four are now
  in the repo, which is master again.
- **The ending overlapped itself.** The shared body's floor was a guessed `H*0.66`
  while the closing block — line, count, three links — is fixed rem and reaches up
  past `0.62H` on a short screen. On a 1440×800 laptop the bottom arc of letters ran
  straight through "you are part of it now." The floor is now measured off the live
  box (`endFloor()`), and the block is written before the body is laid out.
- **The shared body arrived nearly empty on a phone.** The outline was sampled on the
  96×54 reading grid, whose cells are 4× taller than wide in portrait; every ordinary
  step between neighbours exceeded the concavity threshold and was skipped. It now
  samples on a square-celled grid of its own, and the threshold is measured in cells
  rather than glyphs. Verified at 430×932, 1280×720, 1440×800, 1290×1300.
- **CI syncs every tier, staging first.** It only ever pushed prod, which is how
  staging drifted; and its `paths:` filter never listed `field.html` at all, so field
  changes did not trigger a sync. `sync-space.mjs` now retargets `di-studio.xyz` to
  the tier it is syncing into, so a staging copy stops writing crossings to the live
  field. The manifests no longer pin `live` — the caller names the tier.
- **⚠ Needs the user:** a `DI_SPACE_TOKEN_STAGING` repo secret (the tiers do not share
  a database, so the prod token will not work there). Until it exists the workflow
  warns and skips staging, and staging keeps drifting.
- `window.__end()` in the rite — the twin of the field's `window.__keeper()`. The
  ending is a camera, a crossing and twenty seconds away, which made the screen with
  the most text on it the one hardest to look at.

## Previous pass (2026-08-04) — the record, no code

- **The festival is now data.** Scraped all 76 esora programme pages (JSON-LD) into
  `docs/notations/programme.json` — 57 works, 186 named people, ~28 rooms, credits and
  times. Rendered as `PROGRAMME.md` (by time), `ARTISTS.md` (by person, with the
  name-variant table), `ROOMS.md` (by place). **`programme.json` is the build input.**
- **`docs/notations/PLATFORM.md`** — audit of what di.iiii already carries: the three
  shipped exhibition patterns (wcc portal hub · recordar landing→scene · repo-synced),
  19 entity types, portals with `mode: portal | embed`, live inscriptions + mesh +
  `deviceAccess` camera. Missing piece is batch authoring, not platform features.
- **Advice (in `docs/notations/README.md`): the field IS the exhibition.** Seed the 57
  works into the field as cores that were already there; rooms become portal clusters;
  one vanity slug per work; feed `programme.json` to the keeper. Keeps the 2026-07-31
  one-public-face rule — no new published sibling, no `notations` space.
- Chat reading kept OUT of this public repo → `br_id_ge-ops/notations/CHAT_READING.md`.
- Corrections owed to hosq: Artak's *Matagh* missing from the programme entirely;
  *Short Songs* merges two people into one name; recurring misspellings (table in
  `ARTISTS.md`).

## Earlier pass (2026-08-01)

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
- **Third pass:** Rite — untracked shape is now a breathing CIRCLE (center; follows
  touch/mouse without camera; morphs to body when tracked, back when lost); sturdier
  hands (smoothing, pinch hysteresis, frame confirmation, grace hold); end choices —
  "keep a copy ↓" (client-side PNG memento) and "unmake my crossing" (proof-based
  DELETE, feature-detected; `unmade` guard stops the field link resurrecting).
  Tone sweep: gravestone register removed everywhere — ՊԱՀԱՊԱՆ (was ՎԿԱ), ՆԵՐԿԱ
  act III, հուշ (was հիշատակ), "keeps walking" over "forever".
  serverXR (di.iiii dev): inscriptions POST now returns one-time `proof`
  (sha256 stored as proofHash); DELETE /inscriptions/:id {proof} unmakes own
  crossing; legacy crossings 403. Contract tests green (64+8).
- Still open from the brainstorm: 3D letter-body gather, AR/VR field entry,
  keeper TTS/physical-witness on the show rig.

## What works

- Full loop LIVE on prod: cross at /br_id_ge/rite → core lands in the space →
  visible in the field and Act V. Camera lamp opens on mobile.
- CI: push main → GitHub Pages (mirror) + Sync di.iiii Space (rite + landing manifests).
- CI syncs staging AND prod on every push to main (staging needs its own token secret).

## Open

- **⚠ The keeper's dead-pipe guard does not fire.** Both tiers ran ~5h publishing
  into nothing while logging success. `keeper.mjs` rebuilds a pipe that hears nothing
  for `DEAF_MS`, but the rebuild path sets `lastHeard = 0` and the guard is written
  `if (lastHeard && …)` — so between the reset and the next `onopen` the check is
  disabled, and any state where nothing is ever heard leaves it disabled for good.
  Restarting both units restored it (verified: 6 heartbeats/32s on each mesh). **Not
  fixed** — the exact hole needs reproducing before a guess is pushed into a live
  service. Worse than the bug: nothing alerted. The way to check is never the sender's
  log — listen on room `bridge` from a third machine.
- **⚠ Unconfirmed by the user: the mobile stuck.** The three fixes are live, but the
  original symptom was never reproduced here — a fake camera emits a test pattern, not a
  human silhouette, so the lamp correctly sits at "needs your edge" forever, which is
  indistinguishable from the reported bug. **Needs one crossing on a real phone at
  https://di-studio.xyz/br_id_ge/rite.**
- **A counter disagreement, undecided:** the rite dedupes by `name · word` (23) while the
  field counts objects (28) — `գևորգ · կամուրջ` appears 6 times. Whether a repeat crossing
  makes a second core is a design call, not a bug.
- **di.iiii viewer chrome sits on the piece:** the `br_id_ge ▾` space chip
  (`ProjectSwitcher.jsx:155`, `position:absolute; top:1rem; left:1rem; zIndex:30`) lands on
  the rite's header, and `◈ Made with di.iiii` on its bottom status line. Affects every
  published project — owner's call, not a repo fix.
- **Staging has `openInscriptions: false`**, so a test crossing there ends "the far field
  did not answer". Correct, not a regression. Prod is `true`.
- **Three calls owed on the field as it now reads:** tone the awake wire back to
  a hairline? keep or drop the keeper window's auto-open? the black screen
  before paint is di.iiii's viewer, not this repo — a bigger fix.
- ~~Still user-only: the `DI_SPACE_TOKEN_STAGING` repo secret.~~ **Present and working** — run `30961676793` synced staging *and* prod, title change included, on both tiers. Original note: Without it CI skips
  staging and every staging surface is synced by hand; since `c3ff684` a skipped tier at
  least turns the run red instead of passing green.
- **Next session starts here:** build the field seeding from `programme.json` —
  generalise `scripts/sync-space.mjs` to emit entities from a manifest. Nothing about
  di.iiii needs to change first.
- **⚠ Time-sensitive, user-only:** the 278 photos/videos in the hosq Telegram group are
  NOT recoverable from di-bo's log (media type recorded, no `file_id` — verified). Only
  a Telegram Desktop export of full history + media saves them, and the group is
  dispersing. Also worth asking hosq for the *aritsts mapping & archive* data (Uliana
  Pyadushkina + Christian Ginosyan) and the zine.
- Notations date conflict is **closed**: esora confirms lab Jul 20–31, festival Aug 1–2,
  Philharmonia + National Gallery + Hayfilm, hosq as host.
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
