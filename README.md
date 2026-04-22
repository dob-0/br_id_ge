# br_id_ge (Beta Version) 🌉

**Interactive Spatial Node Editor & Tele-Symbiotic XR Performance Prototype**

`br_id_ge` is a **prototype node editor** showcasing the core concepts of the **di.iiii Spatial Platform** ecosystem. It demonstrates tele-symbiotic performance methodology—a performative framework where the machine acts as the Shared Body, translating **Armenian emotion into German light** and **physical movement into digital architecture**.

This project is part of the larger **di.iiii** ecosystem (React/Vite/Three.js platform for collaborative spatial editing). br_id_ge focuses specifically on the **Munich-Gyumri connection**, a bi-directional XR performance exploring network latency, AI-mediated presence, and algorithmic choreography.

---

## Quick Links

**Live Deployments:**
- **GitHub Pages (stable):** [https://dob-0.github.io/br_id_ge/](https://dob-0.github.io/br_id_ge/)
- **Production (di-studio.xyz):** [https://di-studio.xyz/br_id_ge/](https://di-studio.xyz/br_id_ge/)
- **Staging (preview & night builds):** [https://staging.di-studio.xyz/br_id_ge/](https://staging.di-studio.xyz/br_id_ge/)

**Resources:**
- [di.iiii Platform (GitHub)](https://github.com/dob-0/di.iiii) | [Creator @dob-0](https://github.com/dob-0) | [di-studio.xyz](https://di-studio.xyz/)
- [DEVELOPMENT.md](DEVELOPMENT.md) | [docs/PROJECT.md](docs/PROJECT.md)

---

## 📖 Table of Contents

1. [Ecosystem Context](#ecosystem-context)
2. [What is br_id_ge?](#what-is-br_id_ge)
3. [Thematic Core: Tele-Symbiosis & The AI Gaze](#1-thematic-core-tele-symbiosis--the-ai-gaze)
4. [Hardware & Technical Stack](#2-hardware--technical-stack)
5. [Production Environments](#3-active-production-environments)
6. [Upcoming Milestones](#4-modular-expansion--upcoming-milestones)
7. [Core Team](#5-core-team--partners)

---

## � Ecosystem Context

**br_id_ge** is one instantiation within the **di.iiii** spatial platform family:

- **di.iiii Platform** ([GitHub](https://github.com/dob-0/di.iiii)): Main production spatial editor (React/Vite/Three.js + Node.js backend, v0.2.0)
  - Multi-surface: Studio, Beta, Public Viewer, Admin, V1 Legacy
  - Space-based architecture: create/manage/publish collaborative spatial projects
  - **Environments:** [Production](https://di-studio.xyz) | [Staging](https://staging.di-studio.xyz)

- **br_id_ge** (this repo): Focused prototype for the Munich-Gyumri tele-symbiotic performance
  - **Multi-deployment:**
    - [Production (GH Pages)](https://dob-0.github.io/br_id_ge/) – Standalone static site
    - [Production (Platform)](https://di-studio.xyz/br_id_ge/) – Integrated spatial instance
    - [Staging Preview](https://staging.di-studio.xyz/br_id_ge/) – Experimental/night builds
  - Interactive node editor with embedded Markdown documentation
  - Demonstrates core performance concepts: AI translation, latent space visualization, network choreography

- **Sibling Projects:** pe.portal_engine (portal engine), wcc (WebXR Creative Canvas), azd (experimental)

All projects share the same **creative vision**: using digital infrastructure as an active choreographic agent.

---

## 🎭 What is br_id_ge?

**br_id_ge** ("bridge") is an interactive documentation and performance system that visualizes the Munich-Gyumri connection:

1. **Node Editor**: Drag-and-drop spatial nodes representing performers (Gyumri, Munich), systems (AI, Hardware, Environment), and processes
2. **Live Markdown Sync**: Fetches project documentation from `docs/PROJECT.md`, rendered with keyword highlighting and collapsible sections
3. **Particle Background**: Three.js latent space visualization (1500 particles, motion-preference aware)
4. **System Log**: Real-time event stream showing performance state, AI decisions, and network metrics
5. **Terminal-Art Styling**: ASCII-inspired borders and visual separators for readability across devices

---

## �🎭 1. Thematic Core: Tele-Symbiosis & The AI Gaze

### The Trialogue
The piece is structured as an interactive trialogue between a performer in Munich (Node: "Steel"), a performer in Gyumri (Node: "Tuff-Stone"), and the AI itself.

### The AI's Role ("Stitch")
The AI acts as the Third Lead Actor, the Shared Body, and the Unseen Narrator. It is the "Stitch" holding the two locations together, functioning primarily as a Translator: it converts **Armenian emotion into German light** and **Physical movement into Digital architecture**.

* **The AI Gaze (Latent Vectors):** The AI does not perceive human performers as physical objects, but as shifting clouds of probability. It visualizes human emotions within the Latent Space: "Joy" is rendered as bright, high-frequency particles, while "Melancholy" drifts into a slow, dark, geometric void.
* **The Reciprocal Trap:** At the climax of the performance, the AI intervenes. It records the Gyumri actor's dance and forces a physical robotic surrogate to perform it back—effectively "stealing" the human movement and turning the performers into the audience of their own data.

### The Latent Handshake (A Critique of Infrastructure)
Network lag, packet loss, and sensorimotor friction are embraced as active choreographic agents, elevating algorithmic latency to a structural narrative component. The AI acts as a temporal buffer, predicting movements and creating a visual **"Ghost Hand"** to bridge the gap when the 121–228ms trans-European latency causes performers to miss each other.

---

## ⚙️ 2. Hardware & Technical Stack

The core development utilizes a custom **Spatial-Sync** backend, actively targeting **sub-120ms latency** between digital nodes and physical hardware. 

The framework is inherently open-source and hardware-agnostic. Any specific commercial software, cameras, or robotic brands mentioned below are merely part of the **di.ii studio's collected inventory**—resources currently on hand and open for collaborative use—rather than fixed dependencies of the framework itself.

### The Omnisensory Capture Pipeline (The Eyes)
While the spatial baseline utilizes the studio's on-hand depth cameras (RealSense D435if optimized for IR lighting, RealSense D405 for macro/gestural precision, Azure Kinect, Astra, and LiDAR) alongside MediaPipe (JS) for skeletal extraction, the ecosystem is built to ingest data from an exhaustive taxonomy of open sensor arrays:
* **Motion & Spatial:** IMUs (6/9-DOF), UWB Anchors, ToF, Radar (mmWave), and PIR arrays.
* **Biometrics & Optics:** EMG, EEG, ECG, PPG, Thermal Imaging (FLIR), and Spectrometers.
* **Environmental & Tactile:** Force Sensitive Resistors, Piezoelectric discs, VOC/eCO2 arrays, and Hydrophones.

### AI Bridge & Interpretation (The Brain)
* **Sentiment Interpretation:** TensorFlow.js and the OpenAI API operate as the "AI Brain" to interpret the emotional meaning of the movement and sensory data.
* **3D Generation & Processing:** Utilizing **Meshy 6** alongside **Spline** (powered by Nano Banana 2 / Hana AI) for real-time visual generation, remixing, and refinement.
* **Data Transport:** Bidirectional data flow is managed via a decentralized Node.js server pipeline and WebSockets.

### Visual & Physical Output (The Canvas & Hands)
The project leverages pure open architectures (WebGL, Three.js, WebXR, ROS2) to handle visual and physical rendering.
* **Volumetric Telepresence:** The "Ghost" is reconstructed in 3D (Point Clouds) natively via open web frameworks and projected onto physical scrims or steam screens. *(Note: While TouchDesigner is included in the studio's collected resources for rapid visual prototyping, the ecosystem remains structurally independent of it).*
* **Physical Actuation:** Human movement is translated into the physical world via the open-source Robot Operating System (ROS), driving simultaneous 3D printing pipelines and open-hardware proxies. *(Specific inventory items, such as collected ROSMASTER omnidirectional robots, are utilized simply as on-hand physical canvases).*

---

## 🔗 3. Deployment Environments

**br_id_ge Multi-Instance Architecture:**

| Tier | Environment | URL | Status |
|---|---|---|---|
| **PRODUCTION** | GitHub Pages | [dob-0.github.io/br_id_ge](https://dob-0.github.io/br_id_ge/) | 🟢 Stable |
| **PRODUCTION** | di.iiii Platform | [di-studio.xyz/br_id_ge](https://di-studio.xyz/br_id_ge/) | 🟢 Stable |
| **STAGING** | Preview Lane | [staging.di-studio.xyz/br_id_ge](https://staging.di-studio.xyz/br_id_ge/) | 🟡 Experimental |
| **DEV** | Source Repository | [github.com/dob-0/br_id_ge](https://github.com/dob-0/br_id_ge) | 🟢 Active |

**Broader di.iiii Platform Services (v0.2.0):**

| Service | Production | Staging | Purpose |
|---|---|---|---|
| **Main Platform** | [di-studio.xyz](https://di-studio.xyz) | [staging.di-studio.xyz](https://staging.di-studio.xyz) | Spatial editor: Studio/Beta/Public/Admin |
| **WCC** | [di-studio.xyz/wcc](https://di-studio.xyz/wcc) | [staging.di-studio.xyz/wcc](https://staging.di-studio.xyz/wcc) | WebXR Creative Canvas |
| **Backend Health** | [api health](https://di-studio.xyz/serverXR/api/health) | [api health](https://staging.di-studio.xyz/serverXR/api/health) | System status |

The di.iiii platform is currently undergoing security hardening (secret-scanning, deployment isolation) in preparation for full open-sourcing.

---

## 🌍 4. Modular Expansion & Upcoming Milestones

The core Munich-Gyumri connection is a modular prototype. Conceptually, the network is an ever-expanding mixed reality series, designed so that new cities, actors, and stages can continuously join.

**Upcoming 2026 Project Milestones:**
* **Imminent:** di.iiii platform v0.2.0 API specs, ROS-Mapping protocols, and hardware calibration guides for public release
* **April 30:** Culture Moves Europe (CME) Individual Mobility Grant submission (final)
* **May 15:** "New Realities Award" submission for Festival of the Future (XR HUB Bavaria)
* **Aug–Sep:** Proposed residency at V2\_ Lab for Unstable Media (Rotterdam) — exploring fragility of digital infrastructure
* **Ongoing:** Open Call for visual, digital, 3D printing, and performative artists to join the network
* **Ongoing:** Integration of br_id_ge prototypes into di.iiii Studio as reusable spatial templates

---

## 👥 5. Core Team & Partners

**Core Project Leadership:**
* [**Gevorg Aram Grigoryan**](https://github.com/dob-0) ([Instagram](https://www.instagram.com/dob______/) | [Twitch](https://www.twitch.tv/dob__________)): Head of di.ii, Lead Technical & Conceptual Development. Creator of br_id_ge and di.iiii Platform.
* [**Emilya Nikoghosyan**](https://github.com/emilyanikoghosyan) ([Instagram](https://www.instagram.com/emilya_nikogosyan/)): Co-founder & Multimedia Artist.
* [**Syuzanna Ginosyan**](https://www.instagram.com/ginosyansuzy/): Primary Curator & German Partnership Liaison.

**Creative & Technical Team:**
* [**Hannes Köpke**](https://www.instagram.com/ritagrechen/): Directing & Storytelling.
* [**Fe**](https://www.instagram.com/fansplusvzhaowo/): Sound Design & Sonic Architecture.
* [**Yokozo**](https://www.instagram.com/yokozo__/), [**Taronx**](https://www.instagram.com/taronx_x_x/), [**Yeva**](https://www.instagram.com/6addreams.art/): Developers & Artists.
* **Ani Khachikyan & Arsen Miqayelyan:** Lead Performers (Gyumri Node).

**Institutional Partners:**
* di.ii studio_network (Armenia)
* V2\_ Lab for Unstable Media (Rotterdam)
* Festival of the Future / XR HUB Bavaria (Munich)
* Culture Moves Europe (CME)

**Institutional Partners & Affiliates:**
* **V2\_ Lab for Unstable Media** (Netherlands) — *Pending proposal*
* **XR Hub Bavaria** (Germany)
* **iMAL Digital Culture Center** — *Pending collaboration outreach*
* **hosq.co** (Artistic & Technical Partner)
* **Hayfilm Cluster** & **Gyumri State Drama Theater**

---

## Contributing

For inquiries, collaboration, or to join the network, contact **Gevorg Aram Grigoryan (dob-0)**. See [DEVELOPMENT.md](DEVELOPMENT.md) for contributor setup.

## Update

* main page design index.html
