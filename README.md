# br_id_ge (Beta Version) 🌉

**An open-source, tele-symbiotic XR ecosystem by the di.ii studio_network.**

`br_id_ge` represents a foundational shift in telepresence, moving beyond simple audiovisual transmission toward a state of **"tele-symbiosis."** By connecting geographically distant locations—the historic, stone-carved environment of Gyumri, Armenia, and the industrial, steel-framed landscape of Munich, Germany—the project manifests a "Shared Body" mediated by autonomous robotic actuation and real-time AI processing.

---

## 📖 Table of Contents
1. [Thematic Framework & Tele-Symbiosis](#thematic-framework--tele-symbiosis)
2. [Technical Architecture & The Stack](#technical-architecture--the-stack)
3. [Latency & "The Latent Handshake"](#latency--the-latent-handshake)
4. [Institutional Network & Nodes](#institutional-network--nodes)
5. [Core Team & Leadership](#core-team--leadership)
6. [Open Talent Search & Documentation Needs](#open-talent-search--documentation-needs)

---

## 🎭 Thematic Framework & Tele-Symbiosis

### The Trialogue & The Shared Body
The project centers on a "Trialogue"—a performance between a human in Munich, a human in Gyumri, and the AI "Stitch." The AI does not merely transmit data; it stitches the two distant bodies together into a singular, hybrid entity known as the **Shared Body**. It creates a state of distributed embodiment where a performer’s hand in Munich controls a robotic arm in Gyumri.

### Architectural Morphing: Tuff-Stone vs. Munich Steel
The project utilizes the architectural history of its locations as a primary aesthetic:
* **Gyumri (Tuff-Stone):** Volcanic rock representing resilience, weight, and the earth.
* **Munich (Steel):** Industrial framing symbolizing modernization and technology.
In the XR void, a material transmutation occurs: the Armenian performer is rendered as a Steel-lattice avatar, while the Munich performer is rendered as a Tuff-Stone monolith—symbolizing the cultural exchange and process of becoming the "other."

---

## ⚙️ Technical Architecture & The Stack

`br_id_ge` overcomes physical and temporal barriers via a sophisticated assembly of volumetric capture sensors, robotic actuators, and an AI-mediated communication bridge.

### 1. Volumetric Telepresence
* **RealSense D435if:** Focuses on high-fidelity body tracking. The "if" variant's infrared filter allows effective operation under challenging theatrical lighting.
* **RealSense D405:** Captures macro/detail interactions (sub-millimeter precision for hand gestures/facial expressions).
* **Astra/Kinect:** Provides macro-spatial capture, establishing the wide-angle architectural context.
* **TouchDesigner:** Serves as the primary engine for visual synthesis, manipulating dense point clouds into the "Shared Body" aesthetic.

### 2. The AI Bridge ("Stitch")
Built on **MediaPipe** and **TensorFlow.js**, the AI performs real-time feature extraction to transmit simplified skeletal metadata rather than bandwidth-prohibitive point clouds. 
* Bidirectional data, including video and robotic control signals, is managed via a **Node.js** server and **WebSockets**.

### 3. Physical Actuation & Robotic Surrogacy
**ROSMASTER X1** omnidirectional robots act as physical proxies. Running on the Robot Operating System (ROS) and equipped with LiDAR and IMUs, they navigate complex theatrical environments (like Hayfilm Cluster). Human spatial velocity is mapped to robotic motor commands, providing a physical "weight" to remote telepresence.

---

## ⏱️ Latency & "The Latent Handshake"

The primary bottleneck of a 3,500km trans-European connection is an inherent latency of 121–228ms. Rather than treating this as a technical failure, `br_id_ge` aestheticizes it as **"The Latent Handshake."** The AI acts as a temporal buffer, predicting movements and highlighting the labor and fragility of maintaining global connection.

| Latency Source | Typical Delay (ms) | Mitigation Strategy |
| :--- | :--- | :--- |
| **Propagation** (Speed of Light) | ~35 ms | Unavoidable; constant factor. |
| **Network Routing/Jitter** | 40-80 ms | UDP prioritization and jitter buffering. |
| **Sensor Capture** (30-60fps) | 16-33 ms | High-frame-rate sensors (RealSense). |
| **AI Inference/Processing** | 10-30 ms | GPU acceleration / lightweight models (MediaPipe). |
| **Robotic Mechanical Delay** | 20-50 ms | Predictive control and "Dead Reckoning." |
| **Total Cumulative Latency** | **121-228 ms** | *Conceptual integration as "The Latent Handshake."* |

---

## 🏛️ Institutional Network & Nodes

The `br_id_ge` ecosystem is supported by a robust network of cultural and technical institutions:

* **[hosq.co](https://hosq.co) (Armenia):** Primary administrative and research hub; manages "Labs, Residencies & Education."
* **di.ii studio_network (Global):** Core decentralized development collective for the `dii platform`.
* **XR HUB Bavaria (Munich, DE):** Funding and platform support (New Realities Award).
* **Gyumri State Drama Theater (Armenia):** Physical performance venue (Tuff-Stone integration).
* **Hayfilm Cluster (Armenia):** Post-industrial studio space for large-scale XR/robotic testing.
* **Pathos Theater (Munich, DE):** Performance venue and experimental laboratory.
* **V2_ Lab for Unstable Media (Rotterdam, NL):** Residency support and archival context for "Unstable Media" practices.
* **Culture Moves Europe (CME):** Crucial mobility grant facilitating physical exchanges between Munich and Armenia for hardware calibration.

---

## 👥 Core Team & Leadership

The decentralized workflow relies on a multidisciplinary team integrating technical expertise with artistic vision:

* **Gevorg Aram Grigoryan** ([@dob______](https://instagram.com/dob______)): Head/Founder, Lead Technical Architect (ROS/Computer Vision).
* **Emilya Nikoghosyan:** Co-founder, Multimedia Artist (Armenian Node conceptual framing).
* **Syuzanna Ginosyan:** Primary Curator (Armenian Node / Transnational collaborations).
* **Hannes Köpke** ([@ritagrechen](https://instagram.com/ritagrechen)): Directing / Storytelling (Munich Theater connection).
* **Oliver Seibert:** Experience Manager (XR HUB Bavaria / Munich ecosystem link).
* **Ani Khachikyan** ([@ani___khachikyan](https://instagram.com/ani___khachikyan)): AI Entity / Performer.
* **Arsen Miqayelyan** ([@arsentrampmiqayelyan](https://instagram.com/arsentrampmiqayelyan)): Armenian Performer.
* **Fe** ([@fansplusvzhaowo](https://instagram.com/fansplusvzhaowo)): Sound Architecture.
* **Albert Avetisyan:** Developer / Visual & Sound Artist.
* **Taron Grigoryan** ([@taronx_x_x](https://instagram.com/taronx_x_x)): Developer / Multimedia Artist.

---

## 🤝 Open Talent Search & Documentation Needs

As `br_id_ge` transitions into a fully open-source ecosystem, we are actively seeking "open talent" developers and engineers. We are currently working on releasing the following critical technical documentation:

1. **API Specifications for dii platform 0.2.0:** Interfaces for external developers.
2. **ROS-Mapping Protocols:** Transformation matrices mapping human movement to ROSMASTER X1 units.
3. **Point Cloud Compression Algorithms:** Optimizations for transmitting dense volumetric data over standard internet protocols.
4. **Hardware Calibration Guides:** Setup manuals for the RealSense/Astra sensor arrays in theatrical environments.

*If you are interested in contributing to the core stack or participating in upcoming residencies, reach out via the GitHub repository or [hosq.co](https://hosq.co).*
