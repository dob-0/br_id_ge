# What di.iiii can already carry

An audit of the platform as it stands on 2026-08-04, read specifically as: *what
is available today to give 57 works and ~110 artists a place?* Nothing here is a
proposal — it is all shipped and running on prod.

## The three exhibition patterns already in production

di.iiii has solved "show many people's work" three separate times. They are not
rivals; each answers a different question.

| pattern | live example | shape | what it is good at |
|---|---|---|---|
| **portal hub** | space `wcc` | one `main` project holding **10 portal entities** → one project per artist, each a 3D scene of their own models/images/videos | many authors, each owning a room, no code |
| **landing → scene** | space `platform-recordar` | code-mode HTML landing → `window.diiEnterExhibition()` → the same document's 39 entities render as a 3D scene, in place, no reload | one clean public face in front of a 3D body |
| **repo-synced surface** | space `br-id-ge` | repo is master; CI pushes `bridge.html` / `index.html` / `field.html` into projects on every push | anything hand-written, versioned, and iterated fast |

`wcc` also has a bespoke platform surface — `src/wcc/` (`/wcc` landing +
`/wcc/scene`) — proof that an exhibition can earn first-class routes when it needs
them. That was built out of one small piece of reusable plumbing (a per-space
`isPublic` flag) plus the `diiEnterExhibition()` bridge, **not** a fork. The
precedent matters: an exhibition can be added without touching platform core.

## The pieces that matter for this

**Entities.** 19 types: `box · sphere · cone · cylinder · plane · torus · capsule ·
ring · text · image · video · audio · model · pointLight · spotLight ·
directionalLight · ambientLight · group · portal`. Each carries transform,
appearance (with Matte/Metal/Glass/Glow presets) and per-object idle animation
(bob / spin / float / sway / orbit) authored in Studio, not hardcoded.

**Portals** are the important one. A portal entity has `mode: portal | embed` and
targets a `spaceId` + `projectId`. *Embed* means a project can appear **inside**
another project rather than as a doorway out of it. That is the mechanism for
letting 57 works nest without 57 separate visits.

**The field / inscriptions.** `serverXR/src/routes/inscriptionRoutes.js`:
per-space opt-in `openInscriptions`; anonymous
`POST /api/spaces/:id/inscriptions {name, word}` sits *before* the auth gate; the
op is server-built so it is append-only by construction; rate-limited 12/10min,
cap 999. Since 2026-08-01 a POST returns a one-time `proof`, and
`DELETE /inscriptions/:id {proof}` lets a crossing unmake itself. Inscriptions
persist as real scene objects. This is live on prod and `br-id-ge` has it on.

**Co-presence mesh.** `serverXR/src/meshHub.js`, live at
`wss://di-studio.xyz/serverXR/mesh`, path-routed alongside Socket.IO. The rite
already speaks the protocol; the field already uses channel `keeper` for the
di_bot eye. Multi-visitor is a client meta flip, not a build.

**Camera in published pages.** Solved 2026-07-31 — `deviceAccess` in
`di-space.json` makes the viewer grant a real origin, so `getUserMedia` works
inside a published di.iiii page. Phone-verified. The old "needs a top-level
route" limitation is gone.

**XR.** `src/xr/ExperienceXr.jsx` uses `@react-three/xr` with `XROrigin` and
handles both `immersive-vr` and `immersive-ar` (AR repositions the scene to
`[0, 0, -1.2]`). So Studio-authored scenes are already enterable in headset and
in phone AR. Note the rite itself is deliberately **not** in this lane — v.oooooo 3
is a 2D canvas ("THE READING"), no Three.js.

**Vanity links.** `/:space/:slug` resolves cleanly and falls back to project ids,
so every work can have a human URL like `/br_id_ge/echo` without extra plumbing.

## Where the platform actually is right now

From `di.iiii/CURRENT.md` (2026-08-01) and the git log:

- All three tiers were in sync at `7466e41c`; **dev has moved ahead again and is
  not yet on main** — an owed promotion.
- Shipped recently: express 5, three 0.185, the prod blank-images fix (documents
  store `assets[].url` as `/api/…`, only `/serverXR/api/…` reaches the backend —
  fixed in the shared `buildAssetMap`), Raw promoted over Beta, inscription proofs.
- **Audit batches 2+ are mid-flight**: ~32 unverified findings still sitting in a
  workflow journal. Named unaddressed items include Beta's copy of the Raw
  enter-world fullscreen race, 409 catch-up dropping op batches, staging compose
  falling back to `:latest` prod images, and more silent-fallback asset fetches
  (export, archive, PDF).
- Owed product calls: no account-deletion path, no export, no session revocation;
  backup archives unencrypted at rest. URL spec §7 needs sign-off and blocks
  Stage 2.

**Read for this project:** the platform is stable enough to build an exhibition on
today, and the open items are all in areas an exhibition doesn't touch — except
one. *Silent-fallback asset fetches* is exactly the class of bug that already ate
images on `/main` once. An exhibition of 57 works is an asset-heavy build, so the
asset path is the thing to watch, and every batch of uploads should be verified
rendered, not assumed.

## Known traps, from the record

- The legacy importer drops embedded-GLB links (`media.assetId: null`) and does
  not register image/video assets in `document.assets`; **unregistered assetIds
  silently do not render**. Repaired by hand for platform-recordar.
- `PublicProjectViewer`'s "enter exhibition" renders the **project** document's
  scene, not the space's `scene.json`. A landing must be published on the project
  that holds the artwork entities.
- serverXR rate-limits uploads per address (429, ~10 min); re-running resumes.
- `LIVE_*` = staging, `PROD_*` = production in `serverXR/.env.local`. The old
  `LIVE_API_TOKEN` is stale.
- Prod/staging writes are sometimes classifier-blocked agent-side — hand the user
  one `!`-prefixed command rather than retrying.

## What is genuinely missing for an exhibition of this size

1. **No batch authoring path.** Every pattern above assumes a human placing
   entities in Studio. 57 works × credits × media is a data-entry problem, and
   the only bulk route is writing documents through the API from a manifest —
   which is exactly what `scripts/sync-space.mjs` already does for br_id_ge. It
   generalises; nobody has generalised it.
2. **No per-work metadata model.** Entities carry transform and appearance, not
   authorship. Credits would live in `text` entities or in the manifest, with no
   schema behind them.
3. **No search or index surface.** 57 works with no way to find one by artist.
4. **Media.** The platform can hold it; we do not have it (see the archive gap in
   the private ops note).

None of these need platform changes. All four are solved by a manifest + a
generator, which is the br_id_ge house pattern already.
