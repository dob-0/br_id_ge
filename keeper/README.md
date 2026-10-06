# keeper/ — ՊԱՀԱՊԱՆ's body on the wire, and everything that was di.bo's for the field

The lattice at the centre of the field wakes to whoever publishes a `keeper`
heartbeat on the mesh (`docs/KEEPER.md` has the two bodies and the channels).
For the field's whole public life that body was **di.bo**, the Telegram bot, and
the code lived in the bot's repo. On 2026-10-07 di.bo became the di.iiii team's
assistant (di-bo `docs/team-assistant.md`) and stopped being the artwork's
messenger, so every piece of it that belonged to br_id_ge moved here.

**Provenance.** Copied from `dob-0/di-bo` at commit `91268bd` (master, 2026-10-07;
the branch `feat/assistant-1-strip-br_id_ge`, commit `4d6a795`, removed them there). `keeper.mjs`,
`tunnel.mjs`, `check-keeper.mjs`, `contract.mjs`, the `scripts/` and the `docs/`
moved whole, with path fixes, a provenance line, and visitors' names taken out of
the docs (this repo is public; the names are in the field already, they do not
need a second copy). `crossings.mjs` and `telegram.mjs` are lifted out of di.bo's
`bot.mjs` into factories, so they no longer need a bot around them to be tested.
The relay's keeper brief is `relay-brief.md`. Licence: the same as this repo.

## What runs today

Nothing, on any host. **While nothing runs `keeper.mjs`, the field shows the
keeper asleep (graphite)** — that is the honest state, the same one the page has
always shown when no body is in the room. Bringing it back is one command on a
machine that stays up (below), and a unit for it (`keeper-staging.service`, a
template; the VPS that ran it is gone).

Before the move, di.bo also announced each crossing to Telegram, carried a
visitor's words to the owner, and opened a private thread from the rite's ending
(the tunnel). None of that happens now. The code for all of it is here, tested,
and hosted by no bot.

## Run it standalone

Node 22+ (the global `WebSocket`), zero dependencies.

```bash
node keeper/keeper.mjs                                   # keep the prod field, as di.bo
node keeper/keeper.mjs --mesh wss://staging.di-studio.xyz/serverXR/mesh --name di.bo
node keeper/check-keeper.mjs [--to staging]              # is anything keeping? exit 0 / 1 silent / 2 mesh down
node keeper/crossings.mjs [--server <base>]              # who crossed, and which would be announced (read-only)
node keeper/contract.mjs --file field.html               # the field ↔ keeper contract, offline
node keeper/test.mjs                                     # the suite (two live probes on the prod mesh)
KEEPER_TEST_OFFLINE=1 node keeper/test.mjs               # the suite without the network
```

Ctrl-C and the field's keeper falls asleep within 15 s, as if the body had left.

Its env (all optional):

| key | default | what |
|---|---|---|
| `MESH_URL` | `wss://di-studio.xyz/serverXR/mesh` | the hub (`--mesh` wins) |
| `MESH_ROOM_SECRET` | empty | proves the reserved `keeper-*` node id (`--secret` wins); must equal the server's |
| `KEEPER_YIELD_TO` | `jet.di,di.jet` | the bodies it stands down for |
| `KEEPER_MIND`, `RELAY_URL`, `PUBLIC_RELAY_TOKEN`, `KEEPER_MIND_TIMEOUT_MS` | off | the mind (`--mind`): a relay's fenced `/public` path that holds the keeper's brief. **No relay holds it today** — di.bo's refuses the voice — so the keeper keeps its one line |
| `DI_SERVER`, `DI_SITE`, `BR_SPACE` | prod, `br_id_ge` | `crossings.mjs` only |
| `FIELD_FIXTURE` | `~/di-backups/field/br-id-ge-scene-20260809.json` | the junk filter's real fixture in `test.mjs`; skipped (and said) when absent |

Never two bodies with the same name on one mesh: two keepers in one room is the
"two answers to one question" failure in `docs/KEEPER.md`.

## The files

| file | what |
|---|---|
| `keeper.mjs` | handover rules, throttle, the mesh transport, the standalone CLI |
| `tunnel.mjs` | the tunnel token (mint/read), the per-crossing store, the mind's lane ladder |
| `crossings.mjs` | read the field, the junk filter, the announcer (`makeCrossingPoller`) |
| `telegram.mjs` | the Telegram half as factories: the mirror, the mind and its budget, `/say`, the tunnel threads (`/start <token>`, `/mine`, `/forget`) |
| `check-keeper.mjs` | asks the room as a stranger whether anyone is keeping |
| `contract.mjs` | checks the keeper against the field HTML that is actually served |
| `relay-brief.md` | ՊԱՀԱՊԱՆ's voice on a relay, and the rule for choosing it |
| `keeper-staging.service` | systemd template for a keeper on the staging mesh |
| `scripts/` | `clear-field`, and the tunnel rehearsals (`tunnel-state`, `tunnel-live`, `tunnel-crosscheck`, `tunnel-glue`) |
| `docs/` | the tunnel, the room and the wire protocols, the switch-on, the shared token vector |
| `test.mjs` | the suite: 181 checks on 2026-10-07 (179 with `KEEPER_TEST_OFFLINE=1`) |

## Hosting the Telegram half again (if wanted)

A bot that wants the field's voice back imports the factories and hands them its
own `say`/`broadcast`: `makeCrossingPoller` on a timer, `startKeeperForBot` with
`makeKeeperMirror` and `makeKeeperMind`, `makeTunnelThreads` on `/start <token>`,
`sayCommand` on `/say`. di.bo will not be that bot — that is the decision of
2026-10-07. Whoever is, needs: a keeper brief on a fenced relay (`relay-brief.md`),
`TUNNEL_SHARED_SECRET` equal to serverXR's, and a decision about the old tunnel
records on the Mac (`/usr/local/var/di-bo/tunnel/`, kept, no longer read).
