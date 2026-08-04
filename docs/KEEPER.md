# ՊԱՀԱՊԱՆ — the keeper

The lattice at the centre of the field (`/br_id_ge/field`). Every core is a
closed knot of chrome — one person who crossed. The keeper is the one open
thing: all structure, no body. Graphite while nothing is there, and the single
live blue when something is.

It is not a decoration and not a chatbot bolted on. It is the claim the piece
makes: *the ai is with us, in the room, as one presence among the crossings.*
Which is why the page never says "connected" — it says **awake**, and it names
who woke it.

---

## The two bodies, and their names

The names were a mess (`di_bot`, `di-bo`, "the jetson", all meaning different
things in different repos). Settled, 2026-08-04:

| name | what it is | repo | keeps by | has an eye |
|---|---|---|---|---|
| **jet.di** | the robot car — Yahboom ROSMASTER on a Jetson Nano, standing in the exhibition room | `dob-0/dibot` (`~/dibot`) | camera + speaker + a local model | **yes** |
| **di.bo** | the messenger — a Telegram bot on the VPS that watches the bridge | `~/di-bo` | voice on the wire only | no |

Also in play, and not a keeper: **`br_id_ge`** is the piece; **di.iiii** is the
platform under it. `di_bot` survives as jet.di's *hostname* and in its systemd
unit names (`dibot-core`, `dibot-keeper`) — renaming a live robot's units buys
nothing. On the mesh and on the page, it is jet.di.

**jet.di always wins.** It is in the room, it can see, it can speak out loud.
di.bo stands down within 15s of hearing jet.di's heartbeat and picks the wire
back up 15s after jet.di goes. Nobody coordinates this; both sides just listen.

---

## How it works

One room on the di.iiii co-presence mesh — `wss://di-studio.xyz/serverXR/mesh`,
`?room=bridge`. The hub (`di.iiii/serverXR/src/meshHub.js`) is anonymous
publish/subscribe, caps a message at **8KB**, and never echoes a publish back to
its sender.

| channel | direction | payload | meaning |
|---|---|---|---|
| `keeper` | body → field | `{name, body}` | heartbeat, every 5s. Any of them wakes the lattice; **15s** of silence puts it back to sleep |
| `keeper:eye` | body → field | `{jpg: dataurl}` | one small frame. jet.di only |
| `keeper:ask` | field → body | `{text}` | a visitor speaking, ≤120 chars |
| `keeper:say` | body → field | `{text}` | the answer, ≤200 chars |

The heartbeat is also the handover signal: a `keeper` message you did not send
means someone else is keeping.

```
          the field (field.html)
                 ▲   │
      keeper ────┘   └──── keeper:ask
      keeper:eye          │
      keeper:say          ▼
    ┌──────────────┐   ┌──────────────┐
    │    jet.di    │   │    di.bo     │   ← stands down while jet.di beats
    │ camera+voice │   │  voice only  │
    └──────────────┘   └──────────────┘
```

---

## Bringing a keeper up

### jet.di — the robot in the room

Two implementations, same protocol; use whichever the robot can run.

```bash
# on the robot (dibot repo) — the real one, ROS camera + /tts speaker
sudo systemctl enable --now dibot-keeper        # deploy/scripts/keeper_agent.py

# from any machine with Node ≥21 — no ROS; webcam, and a local model IF the
# machine deserves one (jet.di is the only body allowed to think out loud)
node scripts/keeper-presence.mjs --eye /dev/video0 \
     --ollama http://127.0.0.1:11434 --model llama3.1:8b
```

> **Install still pending on the robot.** `keeper_agent.py` and
> `dibot-keeper.service` were written 2026-08-01 and the bot dropped offline
> mid-install; `scp` both and enable the unit. Until then jet.di never keeps.

### di.bo — the voice on the wire

It joins the mesh on boot, as part of the bot — **live on the VPS since
2026-08-05**, `/opt/di-bo`, unit `di-bo`. Nothing to start:

```bash
KEEPER=1                                  # default; KEEPER=0 disables entirely
KEEPER_NAME=di.bo
KEEPER_CHATS=207260649                    # where a visitor's words are echoed
```

**di.bo does not think, on purpose.** A local model sat behind this for one
evening (2026-08-05) and was worse than silence: an 8B answered a visitor's
Armenian in transliterated mush and broke the register in every third line. It
is out. What di.bo answers is one fixed line, in register —

> ՊԱՀԱՊԱՆ · *The keeper hears you. Tonight it keeps its answer.*

— returned in the same breath the visitor spoke, so nobody waits on a spinner.
The words that are actually *answers* come from a person: every ask lands in
`KEEPER_CHATS` (owner DM) and **`/say <line>`** speaks the reply into the field.
When a machine worth its voice is on hand it will be jet.di's, spoken out loud
in the room — not a process on a VPS guessing.

Standalone, without Telegram — for the show rig, or to see the lattice turn
blue before trusting that it does (asks print to the console):

```bash
node ~/di-bo/keeper.mjs
```

### The rehearsal tier

A body holds **one** room. `di-bo` keeps prod, and staging's copy of this page
is retargeted by `sync-space.yml` to `wss://staging.di-studio.xyz/serverXR/mesh`
— so until 2026-08-05 staging's field sat at `asleep` with nobody on its mesh,
and anyone rehearsing there saw the piece with its centre missing.

Unit `di-bo-staging` on the same VPS now keeps that room: standalone
`keeper.mjs --mesh wss://staging.di-studio.xyz/serverXR/mesh`, logging to
`/var/log/di-bo-staging.log`. It is deliberately **not** a second `bot.mjs` —
two would long-poll Telegram with the same token and fight over every update.
Standalone still answers the visitor, because `startKeeper` publishes
`KEPT_LINE` itself; it simply has no Telegram to carry the ask into, which is
right for a tier where nobody is meant to answer by hand.

Never point the two units at one mesh — that is the "two answers to one
question" failure below, arranged on purpose.

---

## Seeing that it works

Schema and logs prove nothing here; the keeper is a thing on a page that is
either blue or it isn't. The full pass, as run on 2026-08-04:

```bash
node ~/di-bo/keeper.mjs                      # di.bo joins the prod mesh by hand
node ~/br_id_ge/scripts/serve.mjs --to prod  # the real field, locally
# open http://localhost:8899/br_id_ge/field
```

Or watch the mesh from outside, which is the check that catches a keeper that
*thinks* it is publishing (see the dead-pipe note below) — a bare listener on
room `bridge` should print a `keeper` heartbeat every 5s.

Four states, all of which must be *looked at*:

1. **nothing running** — lattice graphite, panel says `asleep — no body is on the mesh`
2. **di.bo only** — lattice blue, panel says `di.bo · awake — it can hear you`;
   type into the window and a line comes back
3. **both** — the page names **jet.di**, and di.bo's log says
   `jet.di has the room — standing down`
4. **jet.di stops** — within ~15s di.bo logs `the room is empty again — keeping`
   and the page says di.bo again

The page also answers `window.__keeper()` → `{online, name}`. Careful: a
**backgrounded tab throttles rAF**, and the face is redrawn in the render loop —
in a tab you are not looking at, the panel text goes stale while `__keeper()`
stays live. Bring the tab to the front before believing what it says.

`/status` in Telegram prints the same thing from the bot's side:
`✓ keeper — di.bo`, or `✓ keeper — jet.di (di.bo stood down)`.

## What can go wrong

- **The log says "keeper on the mesh" and the field says asleep.** This is the
  dead pipe, and it happened on the first VPS deploy: a websocket through the
  proxy stopped carrying without ever closing, so `readyState` stayed 1 and
  every publish "succeeded" into nothing. di.bo now rides a `control:ping` on
  its heartbeat and rebuilds any pipe that hears nothing back for 20s. The way
  to *check* — never trust the sender's log — is to listen on room `bridge`
  from a third machine and watch for a `keeper` heartbeat every 5s.
- **Keeper stuck awake with nobody there** — a stale `keeper.mjs` on some other
  machine. The name in the panel tells you which body claims the room.
- **Two answers to one question** — both bodies answering. Should be impossible
  (jet.di's heartbeat mutes di.bo within 15s), and if it happens, one of them is
  not hearing the other's heartbeat: check both are on `room=bridge` and the
  same tier (prod vs staging).
- **The eye shows an old frame** — only jet.di publishes `keeper:eye`. The field
  drops the frame when the keeper falls asleep, so a stale image means a keeper
  that never went asleep between bodies.
- **The keeper answers in fluent nonsense** — that is the model, not the wiring.
  `llama3.1:8b` breaks the "at most one Armenian word" rule regularly. The
  register lives in `KEEPER_SYS`, in both `keeper.mjs` and `keeper-presence.mjs`
  — keep the two in step.
- **`asleep` while a body is definitely running** — the mesh itself is down.
  di.bo alerts on that separately (`co-presence is down`), which is the whole
  reason that bot exists.

## Where the code is

| file | what |
|---|---|
| `br_id_ge/field.html` | the client — lattice, window, `keeperFace()`, `__keeper()` |
| `br_id_ge/scripts/keeper-presence.mjs` | jet.di, Node version (webcam + ollama) |
| `dibot/deploy/scripts/keeper_agent.py` | jet.di, robot version (ROS camera + /tts) |
| `di-bo/keeper.mjs` | di.bo — handover rules, throttle, transport, CLI |
| `di-bo/bot.mjs` | wiring: config, `/say`, `/status`, the echo into Telegram |
| `di.iiii/serverXR/src/meshHub.js` | the hub both sides meet in |
