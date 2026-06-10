# Development & Workflow Setup

## ⚠️ Security First

### Never commit sensitive data:
- **API Keys** — Use `.env` files (ignored by git)
- **Passwords & Tokens** — Store locally only
- **Private Keys** — Use `.gitignore`
- **Database Credentials** — Use environment variables

### Auto-Push Safety
The auto-push watcher scans files before committing for patterns like:
- `api_key`, `password`, `secret`, `token`
- `private_key`, `credentials`
- Database URLs with passwords

**If sensitive data is detected:** The commit is BLOCKED and you'll see a warning.

### Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your real values to `.env` (never commit this file)
3. Update `.env` locally as needed—it's automatically ignored

---

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

#### Option 2: Multi-file repo sync

```bash
chmod +x scripts/auto-push-space.sh
./scripts/auto-push-space.sh
```

- Watches `index.html`, `README.md`, `docs/`, `src/`, `scripts/`, `serverXR/`, and related repo files.
- Use this for the multi-file project workflow instead of the README-only watcher.
- Or run `npm run sync:space` (pass branch/interval after `--` if needed).
- Custom branch: `./scripts/auto-push-space.sh my-branch`
- Custom interval: `./scripts/auto-push-space.sh main 1`

#### Option 3: VS Code (One-Click)

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
│   ├── auto-push-readme.sh      # README-only auto-push watcher
│   └── auto-push-space.sh       # Multi-file repo sync watcher
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
