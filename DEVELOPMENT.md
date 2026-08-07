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

## Syncing the space

Two manifests, two jobs. `di-space.space.json` owns the **space** — its label,
visibility, the tier map, and the list of pages that are supposed to exist.
`di-space.<page>.json` owns one **page** — entry file, slug, title, assets.

```bash
node scripts/sync-space.mjs --all --tier staging   # every page, one command
node scripts/sync-space.mjs --all --tier prod      # the live door
node scripts/sync-space.mjs --audit                # compare every tier, exit 1 on drift
node scripts/sync-space.mjs --all --tier staging --dry-run
```

`--audit` is the one to reach for first. It reads all three tiers and prints a
table; it never writes, so it is safe against prod. Anything a tier is allowed
to differ on is declared in the manifest (staging keeps
`openInscriptions:false`) — anything else that differs is reported as a fault
and fails the run. The dev box is `governed:false`: shown in the table, never
enforced, never a failure.

Nothing here deletes. Projects a tier has and the repo does not are reported so
you can see them; removing one is a deliberate act, not a side effect of a sync.

Tokens come from `.env.local` (gitignored) — `PROD_API_TOKEN`,
`LIVE_API_TOKEN` (staging), `API_TOKEN` (local :4000). CI passes its own.

**Adding a surface:** add its `di-space.<page>.json`, then add that filename to
`projects` in `di-space.space.json`. `--all` and the audit both pick it up; the
workflow needs no edit.

`scripts/sync-space.mjs` is a **vendored copy** of di.iiii's
`scripts/space-sync.mjs`. Never edit it here — change it upstream and run
`npm run space:sync:release` in di.iiii (one command: writes the engine here,
bumps `minEngine` to match, commits, pushes — see `docs/ai/space-sync-vendoring.md`
there), or the copies drift apart again. `scripts/sync-space-check.mjs` (also
vendored) verifies this in CI on every push and weekly — see `AGENTS.md`.

---

## Repository Structure

```
br_id_ge/
├── README.md                    # Project overview & getting started
├── DEVELOPMENT.md               # This file (dev workflow & setup)
├── docs/
│   ├── PROJECT.md               # Full project documentation
│   └── MASTER_CONTEXT.md        # Curatorial ground truth — hosq / Notations #2
├── di-space.space.json          # The SPACE: label, tiers, which pages must exist
├── di-space.*.json              # One per page (landing/rite/field)
├── scripts/
│   ├── serve.mjs                # Local mirror of the whole space (localhost:8899)
│   ├── sync-space.mjs           # Linked-space sync engine — VENDORED from di.iiii
│   ├── auto-push-readme.sh      # README-only auto-push watcher
│   └── auto-push-space.sh       # Multi-file repo sync watcher
├── bridge.html                  # The door (published face of the space)
├── index.html                   # The rite (Pages entry)
├── field.html                   # The field
└── .vscode/
    └── tasks.json               # VS Code workflow tasks
```

---

## Contributing

For inquiries, collaboration, or to join the network, contact **Gevorg Aram Grigoryan (dob-0)**.
