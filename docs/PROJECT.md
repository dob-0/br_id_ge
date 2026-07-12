# br_id_ge — portal & process lab of di.iiii

**By Gevorg Aram Grigoryan / di.ii studio — performed as an interactive XR rite in five acts**

`br_id_ge` (կամուրջ, "bridge") is the **portal of di.iiii** (di-studio.xyz), the
artist's own spatial platform — a collaborative process lab, framed by notation,
where the real world enters the platform and becomes shared space: places enter
as depth scans, people enter by answering, artists enter by being curated in.
The flow is always the same: **reality → scan → notation → space → connection.**

Its demonstration piece is a playable rite: you cross a bridge of glowing Armenian
letters (Erkatagir / Trchnagir, MSDF-rendered), answer the Keeper of Memory —
"Who are you, and what do you carry across the bridge?" — inscribe a khachkar with
your name and a chosen word, and arrive in a shared field of everyone who crossed
before you. The rite is the portal performing itself; the field is its memory.

## 1. The Rite — five acts

1. **Threshold** — the UI strips away; a dark void lit by a single *gantegh* lamp.
2. **Crossing** — a bridge of Armenian letters; breathing-paced movement with the
   *duduk* dam-drone.
3. **Witness** — the Keeper (archivist, not oracle) blocks the span and asks who
   you are and what you carry.
4. **Inscription** — an **Epigraphic-Semantic Hybrid** khachkar: your name in rigid
   *Erkatagir* on the base, your word in decorative *Trchnagir* woven through the
   cross.
5. **Echo** — the shared field: every inscribed stone persists; with the live
   co-presence mesh, others crossing now are present with you.

## 2. Notations #2 · hosted by hosq

The rite is being prepared for **Notations #2** (July 20 – August 2, 2026, State
Philharmonia of Armenia and other Yerevan venues), a laboratory-festival by
**hosq** ([hosq.co](https://hosq.co/)) under the theme **"Rituals"** — non-goal-oriented
repetition as a path to *Communitas*. Within the laboratory's notation practice —
where a score can be "sound and text, movement and light, architecture and mistake,
silence and interaction," and where the Armenian *Khaz* neumes sit beside code —
the bridge of letters reads as a score the visitor performs.

## 3. Technical

- **Stack:** single-file `index.html` — Three.js/WebGL, WebAudio (synthesized duduk
  drone), MSDF typography. Open web, no build step, no external engine.
- **Co-presence:** optional WebSocket mesh (`?mesh=` param or
  `<meta name="mesh-url">`); hub lives in di.iiii serverXR. Solo rite when unset.
- **Versions:** `v.oooooo` = legacy Space Node (`v.oooooo.html`, renders this
  document live) · `v.oooooo 2` = the current rite (`index.html`). This repo is the
  source of truth; the di.iiii space syncs from it via CI.

## 4. Deployments

| Tier | Environment | URL |
|---|---|---|
| Production | GitHub Pages | [dob-0.github.io/br_id_ge](https://dob-0.github.io/br_id_ge/) |
| Production | di.iiii space | [di-studio.xyz/br_id_ge](https://di-studio.xyz/br_id_ge/) |
| Staging | Preview lane | [staging.di-studio.xyz/br_id_ge](https://staging.di-studio.xyz/br_id_ge/) |
| Dev | Source repo | [github.com/dob-0/br_id_ge](https://github.com/dob-0/br_id_ge) |

## 5. Team & Partners

**Core:**
* [**Gevorg Aram Grigoryan**](https://github.com/dob-0) ([@dob______](https://www.instagram.com/dob______/)): Head of di.ii, technical & conceptual development.
* [**Emilya Nikoghosyan**](https://github.com/emilyanikoghosyan): Co-founder & multimedia artist.
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
