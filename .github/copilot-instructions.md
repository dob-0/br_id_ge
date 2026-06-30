Copilot instructions for br_id_ge

1) Build / test / lint commands

- No build step, test runner, or linter is configured in package.json.
- Install deps (root):
  - npm install
- Run the realtime WS mesh server (dev):
  - Ensure deps installed (ws is a dependency).
  - Unix / macOS / Linux: PORT=8080 node serverXR/wsMesh.js
  - Windows PowerShell: $env:PORT=8080; node serverXR/wsMesh.js
  - Default PORT used by code is 8080 if PORT is unset.
- Serve the static site locally (for quick preview):
  - npx http-server . -p 8080
  - or: python -m http.server 8080
- Auto-push README watcher (dev convenience):
  - Make executable: chmod +x scripts/auto-push-readme.sh
  - Run: ./scripts/auto-push-readme.sh [branch] [interval_seconds]
  - VS Code task: "Auto Push: Start README Watcher" (see .vscode/tasks.json)
  - To stop (UNIX): use pkill -f scripts/auto-push-readme.sh || true or kill <PID> found via ps
- GitHub Pages deployment: push to main triggers .github/workflows/pages.yml (artifact path: repository root)
- Running a single test: no tests are configured. Recommended pattern if adding tests:
  - Mocha example:
    - npm install --save-dev mocha
    - Add script: "test:single": "mocha test/some.test.js"
    - Run: npm run test:single
  - Jest example:
    - npm install --save-dev jest
    - Add script: "test:single": "jest path/to/test -t \"name\""
    - Run: npm run test:single
- If adding test/lint/build tools: add npm scripts to package.json and document the exact single-test command here.

2) High-level architecture (big picture)

- Frontend: single static SPA (index.html) using CDN Three.js (r128) + marked.js and space-mono font. Lightweight React components (src/) are draft/migration artifacts (NodeCanvas.jsx).
- Realtime mesh: serverXR/wsMesh.js — a small Node.js WebSocket mesh implementing room-based pub/sub. Clients connect as ws://host?room=ROOM&node=NODEID. Server attaches timestamps, per-target latency and predicted ghost-hand vectors for motion messages.
- Docs & content: docs/PROJECT.md and README.md are canonical docs; live markdown is rendered client-side (marked.js).
- Deploy: GitHub Pages via workflow (.github/workflows/pages.yml). Static artifact path is repository root.
- Utilities: scripts/auto-push-readme.sh (auto-commit README with secret-scan), .env.example for local env variables.

3) Key conventions and patterns

- WebSocket query params: ?room=ROOM&node=NODEID — used for routing and presence.
- Message schema (serverXR): JSON objects with types such as:
  - { type: 'publish', channel: 'motion'|'bio'|'env', payload: {...}, pingTs? }
  - { type: 'nodes:add', node: {...} }
  - server emits: 'peer:join', 'peer:leave', 'nodes:update', and 'mesh:event' (with meta.perTargetLatency and meta.predicted for motion)
- Client conventions (NodeCanvas.jsx): sends motion updates as { type: 'motion:publish', nodeId, x, y, timestamp } and expects 'nodes:update' and motion event payloads.
- Latency handling: server includes perTargetLatency estimates and simple predictGhostHand() output (x,y,z,predictedAt). Keep message handlers resilient to missing fields.
- Security: scripts/auto-push-readme.sh includes forbidden-pattern checks (api_key, password, secret, token, credentials, private_key, aws_secret, DATABASE_URL, STRIPE_, GITHUB_TOKEN). Do not commit secrets; copy .env.example -> .env for local secrets.
- Files used as single-sources:
  - docs/PROJECT.md (project docs rendered live)
  - README.md (project overview; auto-watcher exists)
  - serverXR/wsMesh.js (realtime server behavior and message shapes)
  - index.html (primary UI shell)

4) Where to look first (quick pointers)

- serverXR/wsMesh.js — realtime message shapes, room logic, predictGhostHand
- index.html — overall UI, assets, CSS variables, CDN libraries (Three.js r128, marked.js)
- src/components/NodeCanvas.jsx — example React node editor (draft)
- docs/PROJECT.md and DEVELOPMENT.md — design, deployment and workflow notes
- scripts/auto-push-readme.sh and .vscode/tasks.json — auto-push workflow and secret scanning
- .github/workflows/pages.yml — GitHub Pages deployment
- package.json — no scripts except test placeholder

5) AI assistant / agent configs

- No Claude/OpenCode, Cursor, Aider, Windsurf, or Cline assistant config files were found (CLAUDE.md, .cursorrules, AGENTS.md, CONVENTIONS.md, AIDER_CONVENTIONS.md, .windsurfrules, .clinerules, .cline_rules).

Notes / maintenance tips for Copilot sessions

- When editing realtime behavior, keep message compatibility between serverXR/wsMesh.js and any client code.
- Small, surgical edits are preferred: this repo contains many single-file drafts and a static deploy pipeline.
- If adding a test/lint/build system, add npm scripts to package.json and update this file with exact commands for single-test invocation.

Summary

This file records repository-specific commands, architecture and conventions to help future Copilot sessions reason about code and make safe, focused edits.
