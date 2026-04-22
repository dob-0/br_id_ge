# br_id_ge (Beta Version) 🌉

**A tele-symbiotic XR performance framework and interactive node by the di.ii studio_network**

`br_id_ge` is an open-source Extended Reality (XR) network utilizing a custom WebXR Node-Based Reality Creation Language. It moves beyond simple audiovisual transmission toward a state of **Tele-Symbiosis**—a performance of shared consciousness where the machine is the only entity keeping two geographically distant humans from drifting apart.

---

## Getting Started

- **Developers & Contributors:** See [DEVELOPMENT.md](DEVELOPMENT.md) for setup and workflow
- **Project Details:** Full documentation in [docs/PROJECT.md](docs/PROJECT.md)

---

## 📖 Table of Contents

1. [Thematic Core: Tele-Symbiosis & The AI Gaze](#1-thematic-core-tele-symbiosis--the-ai-gaze)
2. [Hardware & Technical Stack](#2-hardware--technical-stack)
3. [Active Production Environments](#3-active-production-environments)
4. [Modular Expansion & Upcoming Milestones](#4-modular-expansion--upcoming-milestones)
5. [Core Team & Partners](#5-core-team--partners)

---

## 🎭 1. Thematic Core: Tele-Symbiosis & The AI Gaze

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

## 🔗 3. Active Production Environments

The Main Production Spatial Editor Platform is currently undergoing security hardening in preparation for full open-sourcing. It is actively operating across:
* **Main WCC Platform:** [staging.di-studio.xyz/wcc](https://staging.di-studio.xyz/wcc)
* **Studio (v.1):** [staging.di-studio.xyz/studio](https://staging.di-studio.xyz/studio)
* **Beta (V2 Experiments):** [staging.di-studio.xyz/beta](https://staging.di-studio.xyz/beta)
* **RecordAR Platform:** [staging.di-studio.xyz/recordar_platform](https://staging.di-studio.xyz/recordar_platform)

---

## 🌍 4. Modular Expansion & Upcoming Milestones

The core Munich-Gyumri connection is a modular prototype. Conceptually, the network is an ever-expanding mixed reality series, designed so that new cities, actors, and stages can continuously join.

**Upcoming 2026 Project Milestones:**
* **Imminent Release:** Open-sourcing of the `dii platform v0.2.0` API Specifications and ROS-Mapping protocols.
* **April 30:** Final submission for the Culture Moves Europe (CME) Individual Mobility Grant.
* **May 15:** "New Realities Award" submission for the Festival of the Future (XR HUB Bavaria).
* **July–Dec Target:** Proposed in-person residency phase at the V2\_ Lab for Unstable Media in Rotterdam, focusing on the fragility of digital infrastructure.
* **Open Talent Search:** An Open Call for visual, digital, 3D printing, and performative artists to join the network.

---

## 👥 5. Core Team & Partners

**Core Project Leadership:**
* **Gevorg Aram Grigoryan (dob-0):** Head of di.ii, Lead Technical, Software & Conceptual Developer.
* **Emilya Nikoghosyan:** Co-founder & Multimedia Artist (socio-political/youth-activist dimensions).
* **Syuzanna Ginosyan:** Primary Curator & German Partnership Liaison.

**Creative & Technical Team:**
* **Hannes Köpke:** Directing & Storytelling.
* **Fe:** Sound Design & Sonic Architecture.
* **Albert Avetisyan & Taron Grigoryan:** Developers & Multimedia Artists.
* **Ani Khachikyan & Arsen Miqayelyan:** Lead Performers (Gyumri Node).

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
