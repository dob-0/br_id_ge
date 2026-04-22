br_id_ge (Beta Version) 🌉

## Auto Push Mode (README)

If you want every saved README change to be committed and pushed automatically:

1. Start the watcher from the repo root:

```bash
chmod +x scripts/auto-push-readme.sh
./scripts/auto-push-readme.sh
```

2. Keep that terminal open while editing `README.md`.
3. Each detected README change will be committed and pushed to `origin/main`.

Optional:

- Custom branch: `./scripts/auto-push-readme.sh my-branch`
- Custom interval seconds: `./scripts/auto-push-readme.sh main 1`

A tele-symbiotic XR performance framework and interactive node by the di.ii studio_network

br_id_ge represents a foundational shift in telepresence. It moves beyond simple audiovisual transmission toward a state of Tele-Symbiosis—a performance of shared consciousness where the machine is the only entity keeping two geographically distant humans (in Gyumri, Armenia, and Munich, Germany) from drifting apart.

📖 Table of Contents

Thematic Core: Tele-Symbiosis & The AI Gaze

Hardware & Technical Stack

Active Production Environments

Modular Expansion & Upcoming Milestones

Core Team & Partners

🎭 1. Thematic Core: Tele-Symbiosis & The AI Gaze

The Trialogue

The project is structured as a three-actor performance involving the Munich performer, the Gyumri performer, and the AI itself.

The AI's Role ("Stitch")

The AI acts as the Third Performer, the Shared Body, and the Unseen Narrator. It is the "Stitch" holding the two locations together, functioning primarily as a Translator: it converts Armenian emotion into German light and Physical movement into Digital architecture.

The AI Gaze (Latent Vectors): The AI "sees" a human performer not as an object, but as a Latent Vector—a shifting cloud of probability. It visualizes human emotions in the Latent Space: "Joy" is rendered as bright, high-frequency particles, while "Melancholy" drifts into a slow, dark, geometric void.

The Reciprocal Trap: In the climax of the performance, the AI intervenes by recording the Gyumri actor's dance and forcing a physical robotic surrogate to perform that dance. It effectively "steals" the human movement, turning the performers into the audience of their own data.

The Latent Handshake (A Critique of Infrastructure)

Network lag, packet loss, and sensorimotor friction are embraced as active choreographic agents, framing the piece as a critique of modern digital infrastructure. The AI acts as a temporal buffer, predicting movements and creating a visual "Ghost Hand" to bridge the gap when the 121–228ms trans-European latency causes performers to miss each other.

⚙️ 2. Hardware & Technical Stack

The core development utilizes a custom Spatial-Sync backend, aiming to maintain sub-120ms latency between digital nodes and physical hardware. The framework is hardware-agnostic, capable of translating an infinite variety of physical inputs into digital/architectural responses.

The Omnisensory Capture Pipeline

While the current spatial baseline relies heavily on depth cameras (Kinect, Azure Kinect, Astra, LiDAR) and MediaPipe (JS) for real-time skeletal extraction, the ecosystem is designed to ingest data from an exhaustive taxonomy of sensor arrays:

Motion & Spatial: IMUs (6/9-DOF), UWB Anchors, LiDAR, ToF, Radar (mmWave), and PIR arrays.

Biometrics & Optics: EMG, EEG, ECG, PPG, Thermal Imaging (FLIR), and Spectrometers.

Environmental & Tactile: Force Sensitive Resistors, Piezoelectric discs, VOC/eCO2 arrays, and Hydrophones.

AI Bridge & Interpretation (The Brain)

Sentiment Interpretation: TensorFlow.js and the OpenAI API operate as the "AI Brain" to interpret the meaning and emotional sentiment of the movement and sensory data.

3D Generation & Processing: Utilizing Meshy 6 alongside Spline (powered by Nano Banana 2 / Hana AI) for real-time visual generation, remixing, and refinement.

Data Transport: Bidirectional data flow is managed via a decentralized Node.js server pipeline and WebSockets.

Visual & Physical Output (The Canvas & Hands)

Volumetric Telepresence: TouchDesigner reconstructs the "Ghost" in 3D (Point Clouds). This 3D data is compressed into a texture and projected onto physical scrims or steam screens.

Physical Actuation: Simultaneous 3D printing operates in response to real-time performance data, alongside ROSMASTER X1 robots acting as physical proxies via the Robot Operating System (ROS).

🔗 3. Active Production Environments

The Main Production Spatial Editor Platform is currently undergoing security hardening (secret-scanning, deployment config isolation) in preparation for full open-sourcing. It is actively operating across:

Main WCC Platform: staging.di-studio.xyz/wcc

Studio (v.1): staging.di-studio.xyz/studio

Beta (V2 Experiments): staging.di-studio.xyz/beta

RecordAR Platform: staging.di-studio.xyz/recordar_platform

🌍 4. Modular Expansion & Upcoming Milestones

The core Munich-Gyumri connection is a modular prototype intended to transform into an ever-expanding mixed reality series with new cities and stages continuously joining the network.

Upcoming 2026 Project Milestones:

Imminent Release: Open-sourcing of the dii platform v0.2.0 API Specifications, ROS-Mapping protocols, and hardware calibration guides.

April 30: Final submission for the Culture Moves Europe (CME) Individual Mobility Grant.

May 15: "New Realities Award" submission for the Festival of the Future (Hosted by XR HUB Bavaria).

Aug–Sep: Proposed in-person residency phase at the V2_ Lab for Unstable Media in Rotterdam.

👥 5. Core Team & Partners

Core Project Leadership:

Gevorg Aram Grigoryan (gevorg_aram1@thedi.studio): Head of di.ii, Technical, Software & Conceptual Development.

Creative & Technical Team:

Hannes Köpke: Directing / Storytelling.

Fe: Sound Design / Sonic Architecture.

Albert Avetisyan & Taron Grigoryan: Developers / Artists.

Ani Khachikyan & Arsen Miqayelyan: Gyumri Anchor Performers.

Institutional Partners & Affiliates:

V2_ Lab for the Unstable Media (Netherlands) — Pending proposal

XR Hub Bavaria (Germany)

iMAL Digital Culture Center — Pending collaboration outreach

hosq.co (Artistic & Technical Partner)

Hayfilm Cluster & Gyumri State Drama Theater

For inquiries regarding the open-source platform, hardware collaboration, or joining the network, please contact Gevorg Grigoryan directly.