# The tunnel — protocol

> Moved from di-bo `docs/` on 2026-10-07 (di-bo master `91268bd`), when di.bo became the team's
> assistant. Where this says `bot.mjs`, the code now lives in `keeper/telegram.mjs` (the Telegram
> half, hosted by no bot today) and `keeper/crossings.mjs`; `keeper.mjs` and `tunnel.mjs` moved whole.
> It is kept as written: the history, not a description of what runs now.

A crossing does not have to end at the ending. The tunnel is the passage from
the field into a private Telegram thread with di.bo, so that the person who just
carried something over can be asked the only question worth asking them: *what
is it, and do you want a room for it?*

Sibling of [the-room.md](the-room.md) and [the-wire.md](the-wire.md). The room is
the shared realm; the wire is for machines; **the tunnel is one person, alone,
continuing.**

Status, 2026-08-23: **LIVE on prod since 2026-08-12, with zero bindings.**

    the mint      merged                                     live
    the bot       di-bo master, deployed                     live, ON
    the room door merged                                     live
    the ending    waits for the rite's recomposed layout     not started

_(This block read "built on all three sides, switched off" until 2026-08-23,
eleven days after it was switched on. `scripts/tunnel-state.mjs` is the
authority over anything written here — ask it, do not trust this paragraph.)_

Nothing is reachable by anyone: every half returns early while
`TUNNEL_SHARED_SECRET` is unset, and the mint answers 404 so an unswitched
tunnel is indistinguishable from one that was never built.

**Ship order, and it is not interchangeable:** the secret goes on BOTH sides
first, then the doors merge and sync. The room door offers itself whenever the
browser holds a proof — it has no availability probe, by design — so a door
that reaches a tier before the secret does is a door that tells a person, at the
end of a ritual, that the thing just offered to them is not open.

The ending and room door wording still has to be seen by the owner. The Telegram
greeting below is approved.

---

## What it is for

Not engagement. **Building.**

br_id_ge IS Notations 2 XR, and the works live inside it. The programme gives us
57 works and 186 people and cannot give us the two things that decide how a work
can be built — what it *was*, and what room it stood in. The tunnel is where a
person tells us, in their own words, about the thing they carry, and where that
turns into a room that is actually made.

    crossing  →  conversation  →  their room gets built

The seven who crossed this afternoon are
the tunnel's first natural travellers. They arrived with no way to continue.

---

## The first rule: one keeper, two bodies

**There is ONE keeper. It has a body in the field and a body in Telegram, and
one memory behind both.**

    "so every one have the private chat teleg with di bo and di bo connected
     with keeper so information is connected"

This is the whole architecture in one line. What di.bo learns in a private thread
and what the keeper witnessed in the field belong to the same mind. A visitor
must never have to tell it twice.

### The boundary is discretion, not partition

    "telegram is private, keeper is group"

The keeper **knows** everything it knows in both bodies. It simply never *speaks*
a private thing in the shared realm. That distinction is the entire safety
property, and it must be implemented as a rule about SPEECH, not as two separate
memories — two memories would be a lie about the concept and would drift apart
within a week, exactly as the field and the mind already have twice.

Concretely:

- Nothing crosses back into the field that the visitor did not place there
  themselves. Not a summary, not a paraphrase, not "someone told me that…".
- The keeper may act on private knowledge in the field only in ways that reveal
  nothing: knowing who someone is, and being warmer for it, is allowed. Naming
  what they said in a DM is not.
- `keeper:say` in the room is broadcast to every member (the hub has no directed
  send — see the-room.md, `to` is a rendering rule). **A private thing published
  with `to` set is still published.** This is the failure mode most likely to
  actually happen, and the one worth a test that publishes and reads back.

---

## The two doors

Both were chosen. Neither replaces the other.

**1. The ending.** A quiet door at the end of the rite, after the core is placed.
Quiet is a requirement, not a mood: someone has just finished a ritual, and a
call-to-action shaped like marketing would undo it.

**2. The room.** պահապան can offer the tunnel in the field chat, in its own
register, when the conversation has earned it. The keeper offering to continue
elsewhere is a keeper being a keeper.

The room door is the peer session's; the ending door belongs to the rite session
and must land inside the recomposed ending, not the old layout. The bot side —
everything below the link — is mine.

---

## The link

    https://t.me/diiii111bot?start=<token>

Telegram caps the `start` payload at **64 characters**, `A-Za-z0-9_-` only. It
arrives as an ordinary `/start <payload>`, which `handleUpdate`'s command regex
already captures into `rest` and hands to `handleCommand(msg, 'start', rest)` —
so the transport needs no new plumbing, only a branch.

### The token is NOT the inscription id

This is the design's first real trap and it must be written down before anyone
writes the easy version.

`insc-a012122a-cbfa-4155-84e1-69d0a532c251` is 41 chars and fits in the payload.
It is also **public**: the field's scene is served unauthenticated —

    GET https://di-studio.xyz/serverXR/api/spaces/br-id-ge/scene   → 200, no auth

— and it returns every inscription id in the field. Anyone who can read the
field can read all of them. A token that *is* the id lets a stranger walk in
claiming any crossing they like, including one that has already been bound to a
real person's Telegram account.

So the token is **independent of the id**, and it is minted against something the
crosser already secretly holds.

### The proof already exists — the tunnel does not need a new secret

`inscriptionRoutes.js` already implements exactly the thing the-room.md listed as
future work. Creating an inscription returns a **one-time raw `proof`** (24
random bytes, base64url); only `sha256(proof)` is stored on the public object as
`proofHash`. DELETE and the mark route both verify with a timing-safe compare.

And the rite leaves it behind:

    localStorage['br_id_ge_last_crossing'] = { id, proof }

`field.html` already reads that key — but `claimSeat()` uses only `held.id` and
**never touches the proof.** The seat is claim-based for exactly this reason. So
the proof is sitting unused in the browser of every person who crossed on that
device, and the tunnel is its first real use beyond unmaking.

This means **both doors can mint**: the ending has the proof because it just
made it, and the field page has it because the rite left it there.

### The mint

A sibling of the existing mark route, which is already "prove authorship, then do
a thing":

    POST /serverXR/api/spaces/:spaceId/inscriptions/:objectId/tunnel
    body  { proof }
    200   { ok: true, token, url, expiresAt }
    403   the proof does not match this crossing
    404   no such crossing        429  rate-limited

It returns the finished `url` so that neither page has to know the bot's
username, and so the link can be changed in one place.

**The raw proof must never go in the link.** It is the unmake credential — a
tunnel link carrying the proof would be a link that deletes the crossing.

### The token

    base64url( 0x01 || insc16 || exp_u32be || hmac16 )      37 bytes → 50 chars

- `insc16` — the inscription uuid's 16 raw bytes
- `exp_u32be` — expiry, unix minutes
- `hmac16` — HMAC-SHA256 over the preceding 21 bytes, truncated to 16, keyed by
  a new `TUNNEL_SHARED_SECRET` held by serverXR and di.bo

50 characters fits Telegram's 64-char cap with room to spare, and base64url is
**exactly** Telegram's permitted alphabet (`A-Za-z0-9_-`). Note that a dotted
form like `v1.<id>.<sig>` would NOT work: Telegram's `start` payload does not
permit `.`, and that is the kind of thing that is discovered at the worst moment.

No server-side token table: the signature carries the binding and the expiry.
Single-use is enforced by **di.bo**, which is the only party that needs to know
whether a token has been spent.

di.bo already holds an HMAC contract with di.iiii (`APPROVAL_SHARED_SECRET`,
`signPayload`/`verifySignature`), so this follows existing practice rather than
inventing a scheme. It gets its **own** secret so the blast radius of either one
stays its own.

### What possession of the link actually proves

**Nothing about who someone is.** Same honesty as the room's seat: v1 checks that
a crossing exists, not that it is yours. A link can be screenshotted, forwarded,
or shoulder-read.

The rule that makes this safe anyway:

> **The token performs the first binding. It never authorises disclosure.**

    first use of a valid token   →  binds this crossing to this Telegram user id
    every use after that         →  the thread is authenticated by Telegram itself

After binding, identity is a Telegram account, which is a far stronger claim than
any token we can mint today. Before binding, the greeting may only ever say back
what is **already public in the field** — their `name · word`, which anyone can
read from the scene anyway. Nothing di.bo learned privately is released on the
strength of a token.

    single-use    first use wins; a second use is a stranger, not an error
    short-lived   expires in 24h — the ending is a moment, not a standing invite
    rebinding     only the keeper can move a crossing to a different account

Because the mint verifies the proof, a token is stronger than the room's seat:
the seat proves a crossing exists, the token proves the holder made it. What it
still cannot prove is that the person now typing in Telegram is the person who
minted it — links travel. Hence binding-not-disclosure above.

### The room door has one limit worth knowing before it is built

The mint needs the proof, and the proof lives in the localStorage of **the
browser that crossed**. Someone who opens the field later on a different device,
or after clearing storage, has a seat (via `?me=`) but no proof — so the room
door cannot mint for them.

That is not a bug to engineer around. The room door simply offers the tunnel
when the proof is in hand, and otherwise says nothing. Falling back to an
unauthenticated link would hand out exactly the claim-anyone's-crossing hole the
whole design just closed.

---

## Arrival

di.bo greets **as the keeper's other body** — same register, no new personality,
no "Hi! 👋". It knows what they carried, because that is public and because
pretending not to would be strange.

Draft wording, **for the owner to see before anything is built**:

> you crossed. you carried **skin**.
>
> I keep the field, and I am also here — this side is only you and me.
>
> the bridge is an exhibition being built. if the thing you carried is a work,
> or wants to be a room, tell me about it and I will make one.
>
> or say nothing. the core stands either way.

Three things that wording is doing on purpose, all of them load-bearing:

1. **It names their word back.** Continuity across the two bodies, proven in the
   first line rather than claimed.
2. **It says the private side is private**, plainly, before they type anything.
3. **It gives permission to leave.** A tunnel that only opens one way is a
   funnel. The crossing is already complete; nothing here is owed.

The door wording at the ending and in the room is the peer's and the rite
session's to draft, but it must obey the same three.

---

## The memory

Per crossing, keyed by the `insc-` id. One mind, readable by both bodies —
the one behind `keeper:say` and the one behind the Telegram thread.

### Where it lives

**Not `state.json`.** That file is di.bo's operational state — seen crossings,
deploys, approvals — written whole on every change, and it is the wrong place for
other people's words in every respect: it grows unboundedly, it mixes categories,
and it is loaded on every boot.

    /opt/di-bo/tunnel/<insc-id>.json      mode 600, one file per crossing
      { insc, who, tg_id, bound_at, notes[], built?, last_at }

One file per crossing so a single person's record can be handed over or deleted
without rewriting everyone else's.

**Open, and genuinely the owner's call: whether this directory joins the nightly
backup.** Backups run to the VPS and pull offsite to the Mac. That would put
artists' private messages on a second machine. It must be a decision, not a
side effect of a wildcard in a backup script.

### How long

    the thread's words     90 days, then dropped
    the built record       kept: their name · word, their room, that they built
    the binding            kept while the crossing stands

The record of *having built something* is the point of the whole thing and
survives. The conversation that produced it does not need to.

### What the visitor can ask for

Both must exist before the first real thread, not after:

    /mine     prints exactly what di.bo holds about them, in full
    /forget   deletes it, and says plainly what it cannot delete —
              the core they placed in the field is theirs and public,
              and only the keeper can lift it

A memory a person cannot see is a file about them they were never shown.

### The mind is stateless; di.bo is the memory

`keeperMind()` POSTs `{prompt, who}` to the Mac relay and gets one string back.
There is no thread, no history, no session on that side. So **the connectedness
lives here**: di.bo composes what the mind is told, from the per-crossing file.

That is the honest shape and it should be stated rather than discovered — anyone
reading "one connected memory" will otherwise assume the relay remembers, and
build on a foundation that does not exist.

---

## What di.bo may do for a builder

The ask is *help them build*, so the tunnel has to end in something made. In
rough order of how soon each is real:

1. **Take the two missing fields** — what the work *was* (installation /
   performance / concert) and what room it stood in. These are exactly what the
   programme cannot give and what the message to hosq asked for.
2. **Take materials.** Files already work: the intake carries documents, photos
   and voice notes to the owner. This is the tunnel's transport, already built
   and deployed — see below.
3. **Offer a room**, and hand the making of it to the owner. A space created by
   a bot on a stranger's say-so is not a thing to automate on day one.
4. **Invite them in**, eventually, through the collaborator lane so they can see
   their own room in the browser. That crosses into di.iiii's invitee flow and is
   a separate design with its own consent questions. Named here so it is not
   quietly assumed.

Steps 3 and 4 change other people's work and other people's data. **They stop at
the owner.** di.bo proposes; it does not provision.

---

## The failure shape

Written first, because today it went wrong twice in exactly this way.

> **A token di.bo cannot resolve degrades to the ordinary stranger intake.
> Never to silence.**

    unknown token      → greet as a stranger, forward to the owner, log it
    expired token      → same
    already-bound      → same, and tell the owner which crossing was claimed
    malformed payload  → same; `/start` must never throw on junk

Someone standing at the far end of a tunnel that does not answer is the worst
outcome available, and it is worse than never having built it — they were
invited.

Today's two lessons, both earned:

- `ANNOUNCE_CHATS` was empty, `broadcast([])` resolved to `[]`, `landed([])`
  answered true, and **seven real crossings were marked seen and lost.** An empty
  recipient list counted as delivery.
- The intake is deployed, unit-tested, and **has still never carried a real
  stranger's message.** The crossing path had precisely that status this morning
  and it was broken.

So, for the tunnel specifically: **no path may treat "nobody to tell" as "told".**
Every branch above ends at a human or at a log line, and the log line is not
enough on its own.

---

## Caps

Reuse what exists rather than inventing a second set of numbers:

    PUBLIC_INTAKE_PER_HOUR    30/hour per sender
    INTAKE_ACK_GAP_MS         one acknowledgement per 10 minutes
    KEEPER_MIND_PER_HOUR/DAY  40 / 200, shared with the field's keeper

That last one matters: the tunnel and the field **draw on the same mind budget**.
A busy evening in the tunnel can silence the keeper in the room, where someone is
standing in front of a camera. Either the budgets separate, or the field wins —
and the field should win. Decide before, not during.

Token mint rate is the rite's to cap, but a mint endpoint that anyone may call
with any public inscription id is a hole; the mint must be bound to the session
that just crossed.

---

## What has to be tested

The two rules from the-wire.md apply unchanged, and both were earned here:

**1. The doc is the source; the code is tested against it.** Two checks exist
and both must stay green:

    node contract.mjs --tier prod                    di.bo vs the field's real HTML
    node scripts/tunnel-crosscheck.mjs --dii <path>  the mint vs di.bo's verifier

`docs/tunnel-vector.json` is the third: a fixed token string both suites
reproduce, so a changed byte layout fails in CI on whichever side changed. The
crosscheck catches what a fixed string cannot — it loads the REAL serverXR route
handler and the REAL di.bo verifier into one process and puts a token through
both. A check that reaches across a repo boundary cannot live in either side's
CI, so it is run by hand and named here.

**2. Watch every guard fail before trusting it.** Five times in two days a green
suite measured nothing: a matcher compared to itself, tests after `process.exit()`,
an assertion reading comment lines, a `fetch()` that drops the header under test,
and a boot line that printed success for an empty recipient list.

Before the tunnel carries one person:

- a token used twice binds once — asserted by actually using it twice
- an unresolvable token reaches the owner, proven by a test that watches the
  owner-notify fire, not by reading the branch
- a private note **cannot** appear in a `keeper:say`, asserted by publishing to a
  real room and reading back what the room received
- `/mine` prints the file's true contents, and `/forget` leaves nothing behind
- `/start` with junk, with an empty payload, and with 64 chars of noise does not
  throw
- the greeting names the right `name · word` for the right crossing when two
  tokens are minted in the same minute

---

## Decided, 2026-08-10

Four calls from the owner, all closed:

- **The greeting** above is approved as written. The ending and room doors are
  drafted to its register and come back to him before they ship.
- **`/opt/di-bo/tunnel/` is NOT backed up.** _(Corrected 2026-08-23. This line
  read "is backed up, offsite to the Mac with everything else" for thirteen
  days.)_ The decision to include it was taken on 2026-08-20 and the patch to
  `di.iiii deploy/vps-backup.sh` was written and tested — **and never applied.**
  See `docs/what-is-not-backed-up.md`. `tunnel/` holds the only copy of every
  binding between a crossing and a person's Telegram thread; losing the box
  loses all of them. A doc that says a backup exists is worse than one that says
  nothing, because it stops the next person looking.
- **The field wins the mind budget.** Someone mid-crossing always gets the
  keeper; tunnel threads wait. Implemented as a reserve, not a preference.
- **The seven are let be.** Their cores stand. The tunnel starts with the NEXT
  crossing. No outreach, no hosq line, nobody contacts any of them.

## Open, for the owner

- Whether a person may hold **two crossings**. The protocol above assumes one
  binding per crossing, so a second crossing opens a second record for the same
  Telegram account. Probably right, worth confirming.
- `TUNNEL_SHARED_SECRET` has to exist on serverXR and di.bo before the mint is
  real, and it must be written over stdin, never as a command argument.

## Who owns what

- this protocol, the token store, the memory, `/start`, `/mine`, `/forget`,
  the greeting — `di-bo`
- the ending door and the mint at the moment of crossing — the rite session
  (it must land in the recomposed ending, not the old layout)
- the keeper's offer of the tunnel in the room — the peer session
- the collaborator/invitee lane, if step 4 is ever taken — a PR to `di.iiii`
