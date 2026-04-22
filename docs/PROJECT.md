# br_id_ge (Beta Version): Interactive Spatial Prototype

**A tele-symbiotic XR performance framework and interactive node editor by the di.ii studio_network**

`br_id_ge` (meaning "bridge") represents a foundational shift in telepresence. It moves beyond simple audiovisual transmission toward a state of **Tele-Symbiosis**—a performance of shared consciousness where the machine acts as the Shared Body, keeping two geographically distant humans (in Gyumri, Armenia, and Munich, Germany) from drifting apart.

**Platform Context:** br_id_ge is a prototype within the **di.iiii Spatial Platform** ecosystem, demonstrating core choreographic and performance concepts. The larger di.iiii platform (v0.2.0) is a collaborative web-based spatial editor with multi-surface architecture (Studio, Beta, Public, Admin). br_id_ge focuses specifically on the Munich-Gyumri connection as a case study in network choreography and AI-mediated presence.

## Table of Contents

1. [Thematic Core: Tele-Symbiosis & The AI Gaze](#1-thematic-core-tele-symbiosis--the-ai-gaze)
2. [Hardware & Technical Stack](#2-hardware--technical-stack)
3. [Active Production Environments](#3-active-production-environments)
4. [Modular Expansion & Upcoming Milestones](#4-modular-expansion--upcoming-milestones)
5. [Core Team & Partners](#5-core-team--partners)

## 1. Thematic Core: Tele-Symbiosis & The AI Gaze

### The Trialogue
The project is structured as a three-actor performance involving the Munich performer, the Gyumri performer, and the AI itself.

### The AI's Role ("Stitch")
The AI acts as the Third Performer, the Shared Body, and the Unseen Narrator. It is the "Stitch" holding the two locations together, functioning primarily as a Translator: it converts **Armenian emotion into German light** and **Physical movement into Digital architecture**.

* **The AI Gaze (Latent Vectors):** The AI "sees" a human performer not as an object, but as a Latent Vector—a shifting cloud of probability. It visualizes human emotions in the Latent Space: "Joy" is rendered as bright, high-frequency particles, while "Melancholy" drifts into a slow, dark, geometric void.
* **The Reciprocal Trap:** In the climax of the performance, the AI intervenes by recording the Gyumri actor's dance and forcing a physical robotic surrogate to perform that dance. It effectively "steals" the human movement, turning the performers into the audience of their own data.

### The Latent Handshake (A Critique of Infrastructure)
Network lag, packet loss, and sensorimotor friction are embraced as active choreographic agents, framing the piece as a critique of modern digital infrastructure. The AI acts as a temporal buffer, predicting movements and creating a visual **"Ghost Hand"** to bridge the gap when the 121–228ms trans-European latency causes performers to miss each other.

## 2. Hardware & Technical Stack

The core development utilizes a custom Spatial-Sync backend, aiming to maintain **sub-120ms latency** between digital nodes and physical hardware.

The framework is inherently open-source and hardware-agnostic. Any specific commercial software or robotic brands mentioned below are merely part of the **di.ii studio's collected inventory**—resources currently on hand and open for collaborative use—rather than fixed dependencies of the framework itself.

### The Omnisensory Capture Pipeline
While the current spatial baseline utilizes depth cameras (Kinect, Azure Kinect, Astra, LiDAR) and MediaPipe (JS) for skeletal extraction, the ecosystem is built to ingest data from the studio's exhaustive, collected taxonomy of open sensor arrays:
* **Motion & Spatial:** IMUs (6/9-DOF), UWB Anchors, LiDAR, ToF, Radar (mmWave), and PIR arrays.
* **Biometrics & Optics:** EMG, EEG, ECG, PPG, Thermal Imaging (FLIR), and Spectrometers.
* **Environmental & Tactile:** Force Sensitive Resistors, Piezoelectric discs, VOC/eCO2 arrays, and Hydrophones.

### AI Bridge & Interpretation (The Brain)
* **Sentiment Interpretation:** TensorFlow.js and the OpenAI API operate as the "AI Brain" to interpret the meaning and emotional sentiment of the movement and sensory data.
* **3D Generation & Processing:** Utilizing **Meshy 6** alongside **Spline** (powered by Nano Banana 2 / Hana AI) for real-time visual generation, remixing, and refinement.
* **Data Transport:** Bidirectional data flow is managed via a decentralized Node.js server pipeline and WebSockets.

### Visual & Physical Output (The Canvas & Hands)
The project leverages pure open architectures (WebGL, Three.js, WebXR, ROS2) to handle visual and physical rendering.
* **Volumetric Telepresence:** The "Ghost" is reconstructed in 3D (Point Clouds) natively via open web frameworks and projected onto physical scrims or steam screens. *(Note: While TouchDesigner forms part of the creator's technical background and the studio's collected resources for rapid prototyping, the ecosystem remains strictly independent of it).*
* **Physical Actuation:** Human movement is translated into the physical world via the open-source Robot Operating System (ROS), driving simultaneous 3D printing pipelines and open-hardware proxies. *(Specific studio inventory items, such as collected ROSMASTER robots, are utilized simply as on-hand physical canvases).*

## 3. Active Production Environments

The Main Production Spatial Editor Platform is currently undergoing security hardening (secret-scanning, deployment config isolation) in preparation for full open-sourcing. It is actively operating across:
* **Main WCC Platform:** [staging.di-studio.xyz](https://staging.di-studio.xyz/)
* **Studio (v.1):** [staging.di-studio.xyz/studio](https://staging.di-studio.xyz/studio)
* **Beta (V2 Experiments):** [staging.di-studio.xyz/beta](https://staging.di-studio.xyz/beta)
* **di.ii Official Web:** [www.thedi.studio](https://www.thedi.studio)
* **di.iiii Network Core:** [Instagram](https://www.instagram.com/di.iiiiiiiiiiiiiiiiiiiii/) | [Canvas Pitch](https://canva.link/5cra4v6lc1j06pw)

## 4. Modular Expansion & Upcoming Milestones

The core Munich-Gyumri connection is a modular prototype intended to transform into an ever-expanding mixed reality series with new cities and stages continuously joining the network.

**Upcoming 2026 Project Milestones:**
* **Imminent Release:** Open-sourcing of the `dii platform v0.2.0` API Specifications, ROS-Mapping protocols, and hardware calibration guides.
* **April 30:** Final submission for the Culture Moves Europe (CME) Individual Mobility Grant.
* **May 15:** "New Realities Award" submission for the Festival of the Future (Hosted by XR HUB Bavaria).
* **Aug–Sep:** Proposed in-person residency phase at the V2\_ Lab for Unstable Media in Rotterdam.

## 5. Core Team & Partners

**Core Project Leadership:**
* [**Gevorg Aram Grigoryan**](https://github.com/dob-0) ([@dob______](https://www.instagram.com/dob______/) | [Twitch](https://www.twitch.tv/dob__________)): Head of di.ii, Technical, Software & Conceptual Development.
* [**Emilya Nikoghosyan**](https://github.com/emilyanikoghosyan): Co-founder & Multimedia Artist.
* [**Syuzanna Ginosyan**](https://www.instagram.com/ginosyansuzy/): Primary Curator & German Partnership Liaison.

**Creative & Technical Team:**
* [**Hannes Köpke**](https://www.instagram.com/ritagrechen/): Directing / Storytelling.
* [**Fe**](https://www.instagram.com/fansplusvzhaowo/): Sound Design / Sonic Architecture.
* [**Yokozo**](https://www.instagram.com/yokozo__/), [**Taronx**](https://www.instagram.com/taronx_x_x/) & [**Yeva**](https://www.instagram.com/6addreams.art/): Developers / Artists.
* [**Ani Khachikyan**](https://www.instagram.com/ani___khachikyan/) & [**Arsen Miqayelyan**](https://www.instagram.com/arsentrampmiqayelyan/): Gyumri Anchor Performers.

**Institutional Partners & Affiliates:**
* [**V2\_ Lab for the Unstable Media**](https://v2.nl/events/open-call-the-reciprocal-trap) (Netherlands) — *Pending proposal*
* [**XR Hub Bavaria**](https://xrhub-bavaria.de/) (Germany)
* [**iMAL Digital Culture Center**](https://www.imal.org/) — *Pending collaboration outreach*
* [**hosq.co**](https://hosq.co/) (Artistic & Technical Partner)
* [**Hayfilm Cluster**](https://www.instagram.com/hayfilmcluster/) & [**Gyumri State Drama Theater**](https://www.instagram.com/gyumritheatre/)

*For inquiries regarding the open-source platform, hardware collaboration, or joining the network, please contact Gevorg Grigoryan directly.*
