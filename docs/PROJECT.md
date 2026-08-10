# br_id_ge — the bridge where the real enters di.iiii

**By Gevorg Aram Grigoryan / di.ii studio**

`br_id_ge` (կամուրջ, "bridge") is how the real world enters **di.iiii**
(di-studio.xyz), the artist's own spatial platform — and becomes shared space.
Three doors: **places** enter as 3D scans; **people** enter through a short rite —
cross a bridge built of glowing Armenian letters and answer two questions, *who
are you, and what do you carry?*; **artists** enter through an open jam, curated
in (the jam's page was retired 2026-07-31; the door stands as concept — see
MASTER_CONTEXT §0, "honest state"). Every entry leaves a permanent mark — an inscribed stone — a *core*
(*kar* is Armenian for stone) — in a shared field that is never erased. And the
bridge runs both ways: what is built inside di.iiii can be carried back out.

## The system

One artwork grew into a small organism. The space `br_id_ge` holds **three
projects — the live surfaces**: the door, the rite, the field. Two more layers
carry them: live co-presence (a di.iiii platform capability, not a project) and
the scanner array (physical kit, not a project). All speak one visual language —
the canonical tokens live in [MASTER_CONTEXT.md](MASTER_CONTEXT.md) §6
(colors are concept actors, not decoration):

| | in one sentence | where |
|---|---|---|
| **the door** (project `landing`) | The public door — blurb + "cross the bridge →"; the one link to share. | [di-studio.xyz/br_id_ge](https://di-studio.xyz/br_id_ge) |
| **the rite** — vi.ritual (project `newww`, slug `rite`) | Five acts: cross the letter bridge, answer the Keeper, inscribe your core. | [di-studio.xyz/br_id_ge/rite](https://di-studio.xyz/br_id_ge/rite) |
| **the field** (project `br-id-ge-field`, slug `field`) | Everything that crossed: cores first, then scans and artists’ works — all objects in the one space’s scene. | [di-studio.xyz/br_id_ge/field](https://di-studio.xyz/br_id_ge/field) · the `br_id_ge` space |
| **live co-presence** (platform capability) | Visitors crossing at the same moment see each other. | WebSocket mesh in di.iiii serverXR |
| **the scanner array** (physical kit) | Depth cameras and LiDAR — how places will enter. | staged per show |

(When other texts count differently, they are counting something else: the five
**acts** are the rite's movements, the three **doors** are ways in — places /
people / artists — and the exhibition's **parts** in the estate glossary are
vi.ritual + algovrithm. The space's projects are these three.)

## 1. The Rite — five acts

1. **Threshold** — the UI strips away; a dark void lit by a single *gantegh* lamp.
2. **Crossing** — a bridge of Armenian letters read along your own outline;
   breathing-paced.
3. **Witness** — the Keeper (archivist, not oracle) blocks the span and asks who
   you are and what you carry.
4. **Notation** (ՆՈԹԱԳՐՈՒԹՅՈՒՆ) — a **core**: your name in
   rigid *Erkatagir*, your word in decorative *Trchnagir* upon the face of the core.
5. **Echo** — the shared field: every core persists; with the live
   co-presence mesh, others crossing now are present with you.

## 2. Notations #2 · hosted by hosq

The rite opened publicly at **Notations #2** (July 20 – August 2, 2026, State
Philharmonia of Armenia and other Yerevan venues), a laboratory-festival by
**hosq** ([hosq.co](https://hosq.co/)) under the theme **"Rituals"** — non-goal-oriented
repetition as a path to *Communitas*. Within the laboratory's notation practice —
where a score can be "sound and text, movement and light, architecture and mistake,
silence and interaction," and where the Armenian *Khaz* neumes sit beside code —
the bridge of letters reads as a score the visitor performs.

## 3. Technical

- **Stack:** single-file `index.html` — 2D canvas, one ink; optional MediaPipe
  silhouette reading (graceful fallback to a dreamed body); WebAudio. Open web,
  no build step, no external engine.
- **Co-presence:** optional WebSocket mesh (`?mesh=` param or
  `<meta name="mesh-url">`); hub lives in di.iiii serverXR. Solo rite when unset.
- **Versions:** `v.oooooo 3` — THE READING is the current rite (`index.html`);
  earlier builds live in git history. This repo is the source of truth; the
  di.iiii space syncs from it via CI.

## 4. Deployments

| Tier | Environment | URL |
|---|---|---|
| Production | di.iiii — the rite | [di-studio.xyz/br_id_ge/rite](https://di-studio.xyz/br_id_ge/rite) |
| Production | di.iiii space | [di-studio.xyz/br_id_ge](https://di-studio.xyz/br_id_ge/) |
| Dev | Source repo (backend — never linked publicly) | `dob-0/br_id_ge` |

## 5. Team & Partners

**Core:**
* [**Gevorg Aram Grigoryan**](https://di-studio.xyz) ([@dob______](https://www.instagram.com/dob______/)): Head of di.ii, technical & conceptual development.
* **Emilya Nikoghosyan**: Co-founder & multimedia artist.
* [**Syuzanna Ginosyan**](https://www.instagram.com/ginosyansuzy/): Curator & German partnership liaison.

**Creative & technical:**
* [**Hannes Köpke**](https://www.instagram.com/ritagrechen/): Directing & storytelling.
* [**Fe**](https://www.instagram.com/fansplusvzhaowo/): Sound design & sonic architecture.
* [**Yokozo**](https://www.instagram.com/yokozo__/), [**Taronx**](https://www.instagram.com/taronx_x_x/), [**Yeva**](https://www.instagram.com/6addreams.art/): Developers & artists.

**Host & partner:**
* [**hosq.co**](https://hosq.co/) — host of Notations #2, artistic & technical partner.

*For inquiries or collaboration, contact Gevorg Aram Grigoryan (dob-0).*

---

The curatorial ground truth for the hosq collaboration is
[docs/MASTER_CONTEXT.md](MASTER_CONTEXT.md). Earlier framings (N-Node mesh phases,
robotic actuation, biometric capture) are parked there and preserved in git history.
