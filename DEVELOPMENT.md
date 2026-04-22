# Development & Workflow Setup

## Quick Start & Development Workflow

### Auto-Push Mode

Enable automatic commits and pushes whenever you save changes to project files.

#### Option 1: Terminal

```bash
chmod +x scripts/auto-push-readme.sh
./scripts/auto-push-readme.sh
```

- Keep the terminal open while editing.
- Each detected change is committed and pushed to `origin/main`.
- Custom branch: `./scripts/auto-push-readme.sh my-branch`
- Custom interval: `./scripts/auto-push-readme.sh main 1` (check every 1 second)

#### Option 2: VS Code (One-Click)

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: `Tasks: Run Task`
3. Select: `Auto Push: Start README Watcher`
4. To stop: Run `Tasks: Run Task` and select `Auto Push: Stop README Watcher`

---

## Repository Structure

```
br_id_ge/
├── README.md                    # Project overview & getting started
├── DEVELOPMENT.md               # This file (dev workflow & setup)
├── docs/
│   └── PROJECT.md              # Full project documentation
├── scripts/
│   └── auto-push-readme.sh      # Auto-push watcher script
├── hardware/                    # Hardware specifications & assets
├── node_bridge/                 # Node.js backend & middleware
├── touchdesigner/               # TouchDesigner projects & assets
├── index.html                   # Live project interface
└── .vscode/
    └── tasks.json               # VS Code workflow tasks
```

---

## Contributing

For inquiries, collaboration, or to join the network, contact **Gevorg Aram Grigoryan (dob-0)**.
