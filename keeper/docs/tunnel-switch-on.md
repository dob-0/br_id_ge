# Switching the tunnel on

> Moved from di-bo `docs/` on 2026-10-07 (di-bo master `91268bd`), when di.bo became the team's
> assistant. Where this says `bot.mjs`, the code now lives in `keeper/telegram.mjs` (the Telegram
> half, hosted by no bot today) and `keeper/crossings.mjs`; `keeper.mjs` and `tunnel.mjs` moved whole.
> It is kept as written: the history, not a description of what runs now.

Two commands, one per tier, each run **in a shell on the VPS** (`ssh dii-vps`).
Neither prints the secret. Both prove the variable landed without showing its
value.

**Do not run either until PR #134 is merged and deployed to that tier.** Before
#134 the compose `environment:` block does not carry `TUNNEL_SHARED_SECRET`, so
the secret would sit in `.env`, never reach the container, and the route would
go on answering 404 while every step of the switch-on looked correct.

Check first, from anywhere, no secret and no ssh needed:

    node scripts/tunnel-state.mjs

    staging  deployed, SWITCHED OFF — no TUNNEL_SHARED_SECRET
    prod     NOT DEPLOYED — the mint is not on this tier

It reads the running service rather than a file, which is the only check finding
1 below cannot fool. Run it again after each switch-on: the tier must move to
**deployed and SWITCHED ON**. If it still says SWITCHED OFF, the secret is in
`.env` and not in the container, and no amount of restarting will change that
until the compose carries it.

---

## 1. Staging

Mints links only; there is no staging bot to open them (see **What staging
cannot rehearse**). Its secret exists so that a staging-minted token can never
be one production would accept.

    cd /opt/di.iiii-staging
    printf '%s\n' "STAGING_TUNNEL_SHARED_SECRET=$(openssl rand -hex 32)" >> .env
    printf '%s\n' "STAGING_TUNNEL_BOT_USERNAME=diiii111bot" >> .env
    grep -c '^STAGING_TUNNEL_SHARED_SECRET=' .env
    docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.staging.yml up -d server
    docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.staging.yml exec -T server sh -c 'test -n "$TUNNEL_SHARED_SECRET" && echo "the container has it" || echo "THE CONTAINER DOES NOT HAVE IT"'

The last line is the one that matters. `grep -c` proves the file has it; only
the `exec` proves the **container** does, and the gap between those two is
exactly where this would have failed silently.

## 2. Production — after the staging rehearsal reads green

The secret must be the SAME on both halves of the pair, so it is generated once
into a shell variable and written to both files. It is never echoed, never
passed as an argument to an exec'd binary, and the variable is unset afterwards.

    S=$(openssl rand -hex 32)
    printf '%s\n' "TUNNEL_SHARED_SECRET=$S" >> /opt/di.iiii/.env
    printf '%s\n' "TUNNEL_BOT_USERNAME=diiii111bot" >> /opt/di.iiii/.env
    printf '%s\n' "TUNNEL_SHARED_SECRET=$S" >> /opt/di-bo/.env
    unset S
    grep -c '^TUNNEL_SHARED_SECRET=' /opt/di.iiii/.env /opt/di-bo/.env
    cd /opt/di.iiii && docker compose --profile https -f docker-compose.yml -f docker-compose.prod.yml up -d server
    systemctl restart di-bo
    docker compose --profile https -f docker-compose.yml -f docker-compose.prod.yml exec -T server sh -c 'test -n "$TUNNEL_SHARED_SECRET" && echo "server has it" || echo "SERVER DOES NOT"'
    grep -q '^TUNNEL_SHARED_SECRET=' /opt/di-bo/.env && systemctl is-active di-bo

Both halves must report before the tunnel is real. `di-bo` reads `.env` itself
(no `EnvironmentFile` on that unit), so a restart is all it needs.

`printf` is a shell builtin, so the secret never appears in the argv of an
exec'd process — `/proc/*/cmdline` is world-readable and an argument would be
visible to any user on the box for as long as the process lived.

---

## What staging cannot rehearse

**There is no staging Telegram bot.** `di-bo-staging.service` runs `keeper.mjs`
only — a keeper on the staging mesh. It has no `bot.mjs`, no Telegram token, no
username. The production `di-bo` is the only process that answers `/start`, and
it reads the **production** field (`DI_SERVER` unset → `https://di-studio.xyz`).

So even with matching secrets, a staging-minted token handed to the production
bot fails at the field check: `handleTunnelStart` looks the crossing up in the
field it reads, does not find a staging inscription there, and falls through to
the ordinary door. That is correct behaviour, and it means the Telegram leg
cannot be rehearsed on staging at all.

    rehearsable on staging   the mint, the room door, the crosscheck
    NOT rehearsable          /start, the greeting, the binding, /mine, /forget

The rehearsable part is one command, and it needs no secret:

    node scripts/tunnel-live.mjs --tier staging

It crosses the bridge for real, mints with the proof, checks the token names
that crossing and expires in 24h, checks the live route refuses a wrong proof
and a bare id — then unmakes its own crossing and says so loudly if it could
not. The token's id and expiry are plaintext; only the HMAC needs the key,
which is why this can prove the binding without holding the secret.

Two honest ways to close that gap:

1. **A second BotFather bot for staging** — a new token, a new
   `di-bo-staging-bot` unit running `bot.mjs` with `DI_SERVER` pointed at
   staging. A real full rehearsal, and perhaps an hour of work plus a bot
   identity only the owner can create.
2. **The owner is the first traveller on production.** Switch prod on, cross the
   bridge himself, and walk his own link end to end BEFORE the door ships to
   anyone else. The doors stay unmerged until he has done it, so the first
   person through a tunnel that has never carried anyone is the person who can
   fix it.

(2) is the recommendation. It costs one crossing and it puts the unrehearsed
step in front of the one person for whom a failure is not a bad experience.
