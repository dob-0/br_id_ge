# br-id-ge-needs — the ghost project, and the one command that removes it

**State, measured 2026-08-10 (read-only GETs against both tiers):**

- **prod** carries FOUR projects: `landing` · `newww` (rite) · `br-id-ge-field`
  — plus **`br-id-ge-needs`** (slug `needs`, title "needs dash").
- **staging** carries exactly the repo's three — its copy was deleted by hand
  with `bcee345` (2026-08-08, "the needs dash leaves the space").
- The repo holds **no** `di-space.needs.json` (none ever existed in git history)
  and no `dash.html` (removed in `bcee345`), so a push cannot resurrect it.

The sync engine reports extras and never deletes them — by design, because
deleting a project is the one operation that can destroy work nobody has a copy
of. So prod's copy stands until a person removes it.

## The backup exists

`di-spaces` (the daily prod snapshot repo) holds the full document at
`~/di-spaces/spaces/br-id-ge/projects/br-id-ge-needs.json`, and its recorded
`updatedAt` (2026-08-07 12:32:47 UTC) matches prod's last save — the snapshot IS
the final state. Nothing is lost by deleting.

## The command (user-only — prod writes are deliberately not agent-runnable)

Run from a shell (the `!` prefix in a Claude session runs it verbatim):

```bash
!cd /home/nooo/br_id_ge && set -a && . ./.env.local && set +a && curl -sS -X DELETE -H "Authorization: Bearer $PROD_API_TOKEN" https://di-studio.xyz/serverXR/api/projects/br-id-ge-needs
```

Expected reply: `{"ok":true}`. (Staging needs nothing — already clean.)

Then verify, read-only:

```bash
node scripts/sync-space.mjs --repo . --audit
```

The audit should stop reporting `br-id-ge-needs` as a prod extra and read
`✓ every governed tier matches the repo`.

## If resurrect instead of delete

The full worksheet survives twice: the di-spaces snapshot above, and the source
at `git show bcee345^:dash.html`. Bringing it back would mean a new
`di-space.<page>.json` added to `di-space.space.json` — but note why it left:
a fourth public project on a space whose whole point is one door.
