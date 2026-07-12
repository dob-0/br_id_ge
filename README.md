# br_id_ge 🌉

**Portal & collaborative process lab of di.iiii — performed as an XR rite in five acts**

`br_id_ge` (կամուրջ, "bridge") is the portal of the **di.iiii Spatial Platform**:
the process, framed by notation, by which the real enters the platform and becomes
shared space — places as scans, people through the rite's questions, artists
through curation. Built on the open web — Three.js/WebGL, no install, no engine.

It is no longer one page but a connected system:

- **vi.ritual** — the five-act rite (`index.html`): cross a bridge of glowing
  Armenian letters, answer the Keeper of Memory, inscribe a khachkar with your
  name and a carried word.
- **the field** — every crossing appends a permanent stone into a di.iiii space
  (`vi-ritual`): anonymous, append-only, never erased. Ritual in br_id_ge →
  result in di.iiii — the recursion is literal.
- **live co-presence** — a WebSocket mesh; visitors crossing at the same moment
  appear to one another.
- **the open visual jam** — the portal held open for artists at Notations #2;
  their notations are bridged into the same field.
- **the constellation** — the lab's private node-graph map, where all of this is
  seen and managed as one space.

Full anatomy: [docs/PROJECT.md](docs/PROJECT.md) · concept: [docs/MASTER_CONTEXT.md](docs/MASTER_CONTEXT.md) §0.

Now in preparation for **Notations #2** (July 20 – Aug 2, 2026, State Philharmonia
of Armenia), a laboratory-festival hosted by [**hosq**](https://hosq.co/) under the
theme **"Rituals"**. Curatorial ground truth: [docs/MASTER_CONTEXT.md](docs/MASTER_CONTEXT.md).

---

## Quick Links

**Live:**
- **GitHub Pages (stable):** [dob-0.github.io/br_id_ge](https://dob-0.github.io/br_id_ge/)
- **Production (di-studio.xyz):** [di-studio.xyz/br_id_ge](https://di-studio.xyz/br_id_ge/)
- **Staging (preview):** [staging.di-studio.xyz/br_id_ge](https://staging.di-studio.xyz/br_id_ge/)

**Resources:**
- [di.iiii Platform (GitHub)](https://github.com/dob-0/di.iiii) | [Creator @dob-0](https://github.com/dob-0) | [di-studio.xyz](https://di-studio.xyz/)
- [DEVELOPMENT.md](DEVELOPMENT.md) | [docs/PROJECT.md](docs/PROJECT.md) | [docs/MASTER_CONTEXT.md](docs/MASTER_CONTEXT.md)

---

## Versions — same names everywhere

The project ships **two versions**. These names are canonical and identical across
the repo, the di.iiii space, and the docs:

| Name | What it is | Repo file | Space project | Live |
|------|-----------|-----------|---------------|------|
| **`v.oooooo`** | the original "Space Node" (legacy) | `v.oooooo.html` | `v-oooooo` | space only |
| **`v.oooooo 2`** | the current five-act rite (Threshold → Crossing → Witness → Inscription → Echo) | `index.html` *(Pages entry)* | `newww` | Pages + space |

Source of truth is **this repo**; the space syncs from it (`index.html` → `v.oooooo 2`).
`index.html` stays the entry because GitHub Pages serves it as the site root.

---

## The Rite — five acts

1. **Threshold** — the UI strips away; a dark void lit by a single *gantegh* lamp
2. **Crossing** — a bridge of Armenian letters (Erkatagir/Trchnagir, MSDF); breathing-paced movement with the *duduk* dam-drone
3. **Witness** — the Keeper of Memory asks: *"Who are you, and what do you carry across the bridge?"*
4. **Inscription** — an Epigraphic-Semantic Hybrid khachkar: your name in *Erkatagir*, your word in *Trchnagir*
5. **Echo** — the shared field of inscribed stones; live co-presence when a mesh endpoint is set

**Co-presence:** append `?mesh=wss://…/serverXR/mesh` (or set
`<meta name="mesh-url">`) to cross together; the hub runs in di.iiii serverXR.
Without it, the rite is solo.

---

## Deployments

| Tier | Environment | URL | Status |
|---|---|---|---|
| **PRODUCTION** | GitHub Pages | [dob-0.github.io/br_id_ge](https://dob-0.github.io/br_id_ge/) | 🟢 Stable |
| **PRODUCTION** | di.iiii Platform | [di-studio.xyz/br_id_ge](https://di-studio.xyz/br_id_ge/) | 🟢 Stable |
| **STAGING** | Preview Lane | [staging.di-studio.xyz/br_id_ge](https://staging.di-studio.xyz/br_id_ge/) | 🟡 Experimental |
| **DEV** | Source Repository | [github.com/dob-0/br_id_ge](https://github.com/dob-0/br_id_ge) | 🟢 Active |

Deploy: `git push origin main` → GitHub Pages (`pages.yml`) + di.iiii space sync
(`sync-space.yml`). See [DEVELOPMENT.md](DEVELOPMENT.md).

---

## Team & Partners

**Core:**
* [**Gevorg Aram Grigoryan**](https://github.com/dob-0) ([Instagram](https://www.instagram.com/dob______/) | [Twitch](https://www.twitch.tv/dob__________)): Head of di.ii, lead technical & conceptual development. Creator of br_id_ge and the di.iiii Platform.
* [**Emilya Nikoghosyan**](https://github.com/emilyanikoghosyan) ([Instagram](https://www.instagram.com/emilya_nikogosyan/)): Co-founder & multimedia artist.
* [**Syuzanna Ginosyan**](https://www.instagram.com/ginosyansuzy/): Curator & German partnership liaison.

**Creative & technical:**
* [**Hannes Köpke**](https://www.instagram.com/ritagrechen/): Directing & storytelling.
* [**Fe**](https://www.instagram.com/fansplusvzhaowo/): Sound design & sonic architecture.
* [**Yokozo**](https://www.instagram.com/yokozo__/), [**Taronx**](https://www.instagram.com/taronx_x_x/), [**Yeva**](https://www.instagram.com/6addreams.art/): Developers & artists.

**Host & partner:**
* [**hosq.co**](https://hosq.co/) — host of Notations #2, artistic & technical partner.

---

## Contributing

For inquiries or collaboration, contact **Gevorg Aram Grigoryan (dob-0)**.
See [DEVELOPMENT.md](DEVELOPMENT.md) for contributor setup.
