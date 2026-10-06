# The room — protocol

> Moved from di-bo `docs/` on 2026-10-07 (di-bo master `91268bd`), when di.bo became the team's
> assistant. Where this says `bot.mjs`, the code now lives in `keeper/telegram.mjs` (the Telegram
> half, hosted by no bot today) and `keeper/crossings.mjs`; `keeper.mjs` and `tunnel.mjs` moved whole.
> It is kept as written: the history, not a description of what runs now.

The field stops being a record of people who passed through and becomes a place
where they are. You cross, and you are in it. People who crossed talk to each
other. The AI is always in the room, so someone arriving at 3am is not speaking
into silence — it answers, and it says the keeper will be told. The message
reaches the owner's Telegram, and when he answers, it arrives **as the keeper**.

Two voices, and a visitor should always be able to tell them apart: the one that
is always there, and the one that is him.

Room is `bridge`, the room the keeper already keeps.

## Channels

    ->  talk       {id, who, text, at}   someone who crossed, speaking
    ->  talk:here  {id, who, at}         arriving; also the roll-call answer
    ->  talk:gone  {id}                  leaving, when the page can say so
    <-  talk:who   {}                    roll-call
    ->  keeper:ask {text}                someone who has NOT crossed, to the keeper

Channels are **not** prefixed with the room. An earlier version of this document
said they were and argued that `talk` unqualified would be the bridge's talk
forever. That was wrong on the facts: the hub keys every room separately and
only ever broadcasts a publish to members of the same room
(`serverXR/src/meshHub.js`, `state.rooms`), so a second space's `talk` can never
reach this one. `bridge:talk` was a prefix on a namespace that already existed,
and it cost a silent room — the field shipped `talk`, di.bo listened on
`bridge:talk`, and the two never met. See **The two halves** below.

    <-  keeper:say  {text, voice, to?}    what the keeper answers

`voice` is `'ai'` or `'keeper'`. It is the only thing distinguishing the voice
that is always there from the one that is the owner, and the UI **must** show
that difference. A visitor who cannot tell which one answered has been misled by
omission — the whole point of the AI saying "the keeper will be told" is that it
is not the keeper.

Absent `voice` means `'keeper'`, so every older client keeps working.

`to`, when present, is a single node id: **render this line only if it is
yours.** It appears on answers to `keeper:ask` and never on answers to the room.
It is a rendering rule, not privacy — see **The uncrossed** below.

## Identity

`id` is the crosser's own inscription id (`insc-…`); `who` is the `name · word`
on their core. Both are already held client-side after crossing.

**v1 checks that the inscription EXISTS in the field, not that it is yours.**
That stops invented names. It does not stop someone claiming a core they did not
leave. Real proof means serverXR minting a short-lived token against the
crossing's proof hash — worth doing, not worth blocking on. **The UI must not
imply the room is authenticated**, because it isn't yet.

Anyone may watch. Only a crossing may speak: the room is what crossing earns.

## Addressing the keeper

For someone who has crossed, an aside to the keeper rides the same channel as
everything else, marked at the front of the line.

**The accepted forms are pinned here so the field and the mind cannot drift
apart again.** Case-insensitive, at the START of a line only, each optionally
followed by `→` and/or whitespace:

    պահապան    ՊԱՀԱՊԱՆ    keeper    @keeper    di.bo

The alias must END — at an arrow, whitespace, punctuation, or end of line.
Without that, *"keepers of the field"* addresses the keeper and so does
*"di.bomb"*.

The token must be at the START. Mentioning the keeper mid-sentence is talking
*about* it, and a keeper that answers that is eavesdropping.

> This section exists because the two halves already drifted once. The matcher
> wanted `ՊԱՀԱՊԱՆ→` exactly while `field.html` was composing `պահապան ` — lower
> case, a space, no arrow. Armenian `Պ` and `պ` are different codepoints, so the
> match could never fire, and the keeper sat silent through a real crossing on
> staging. The unit tests passed the whole time, because they tested the token
> against itself rather than against anything the UI produces. Any new alias
> goes in this list first, and in both codebases second.

The room should read as one conversation — a question to the keeper is still
something the room heard. Everything else it hears and stays out of. Humans
talking to humans is the point, and it is the only voice that costs nothing.

## The uncrossed

**Decided: the keeper answers everyone.** Retiring `keeper:ask` would have taken
the keeper away from anyone who had not crossed — the old input was open to all
— and that was a side effect, not a choice. So `keeper:ask` stays, and it now
means one specific thing: **a line from someone who has not crossed.**

    someone who crossed    → `talk`, addressed  → the room sees it, and sees the answer
    someone who has not    → `keeper:ask`       → the room sees it too, unnamed

Human reaches human only through `talk`. That much the room still earns: the
uncrossed are heard and answered in the open, but they are not in it.

The answer to a `keeper:ask` carries **`to`** — the asker's node id, taken from
the hub's own `from`.

**`to` was never privacy, and as of the kept room it is not even a rendering
rule.** The hub broadcasts to every member and has no directed send, so every
client always received these bytes and any of them could read them. An aside to
the keeper was *unseen*, not *secret*. The field used to render a `to` line only
when it was its own; with a kept history that rule stops meaning anything, so it
is dead rather than left in place looking load-bearing.

**Closed on 2026-08-10: the ask is a public line.** If the answer renders for
everyone then the question must too — an answer whose question nobody saw is
worse than either end, and a room that filled with the keeper replying to no one
would have been ugly to back out of. The owner's own words decided which end:
*"like group chat with ai where everyone can chat each other"* is one
conversation, and hiding half of it is not that.

So `keeper:ask` renders in the room — unnamed, in its own register, the voice of
someone not yet in it — live and in replay, and it is persisted alongside `talk`
and `keeper:say`.

**Which retires this document's own promise.** The table above used to end *only
the keeper sees it*, and this section used to say an aside was seen by the keeper
and by nobody else. That is no longer true and it does not survive as a footnote:
the uncrossed input now says so **before anyone types** — *"asking պահապան is
open to anyone, and asks are part of the room"* — and it changed in the same
commit that made it true, exactly as the impermanence line did.

`contract.mjs` holds the shape: a field that keeps history must open a branch on
`keeper:ask` in **both** the live and the replay path, and must not still promise
the ask is unseen. Deleting either branch fails it.

What has not changed is what `to` never was. The hub broadcasts to every member
and has no directed send, so every client always received these bytes. The aside
was *unseen*, not *secret*. Making anything here truly private needs a directed
send in the hub — worth doing, still not worth blocking on, and now less urgent
because nothing claims otherwise.

## Caps

| | |
|---|---|
| a person | 200 chars · 5 messages / 30s per node |
| the AI | 40 answers/hour · 200/day, and one answer at a time (2.5s apart) |
| a visitor's words to the AI | 120 chars (`MAX_ASK_CHARS`, unchanged) |
| any answer | 200 chars (`MAX_SAY_CHARS`, unchanged) |

Every message also passes `junkReason()` — the filter that already knows a
keyboard mash from a person, and which exists because the field once held eleven
copies of `66666665446@@)((( · ))))`.

The caps on people are about noise. The cap on the AI is about money: the
owner's account pays for that voice and only that voice.

**The per-voice cap now exists.** An earlier version of this table claimed "6 per
visitor per crossing" when nothing counted per visitor at all, and the note that
replaced it recorded the gap honestly: one patient person could spend the hour on
their own. A room where everyone may speak made that a certainty rather than a
risk, so `SPEAKER_SHARE` caps any single voice at a quarter of the hour.

And the lanes give way in an order, `LANE_CEILING` — each is the fraction of the
hour past which *that* lane stops spending, measured against the whole hour:

| | | |
|---|---|---|
| `tunnel` | 50% | a private Telegram thread can wait; the field cannot |
| `ask` | 70% | the uncrossed, whose question keeps until the room is quiet |
| `room` | 85% | crossing earns the room, so it gives way late |
| the rite | — | on no rung: someone is mid-crossing, and this is what the rest yields to |

A ladder, not a partition. In a quiet hour one lane may still have most of it;
as the hour fills, the least urgent voices fall silent first. The point is that
nobody standing in front of a camera ever meets silence because a room was
chatty — a reserve is a number that holds when nobody is watching, where a
preference is only a comment.

## When the Mac cannot be reached

The keeper says what it says today — `KEPT_LINE`, *"The keeper hears you.
Tonight it keeps its answer."* — with `voice: 'keeper'`, because a fallback that
announced itself as the AI would be claiming a mind that just failed to answer.

**Nine seconds, then silence in register.** Someone is standing in front of a
camera. A visitor mid-rite must never see an error, a stack trace, or a hang;
the local model died for that lesson and it is not being relearned.

## What is kept

**Changed on 2026-08-10, by the owner: the room is a conversation, not a
presence.** *"lets keep the chat of the room, lets give the crossers to speak
eachother"* — one persistent thread, the same history on every device, so
someone who reads on a phone tonight sees what was said this afternoon. Everyone
reads; speaking is still what crossing earns.

This replaces the old rule, which said messages lived only while the room lived.
That was the right default while nobody had spoken; it stopped being right the
moment two people wanted to find each other in it.

`talk`, `keeper:say` and `keeper:ask` are **kept** — the whole conversation,
including the uncrossed's half of it, because half a conversation is what this
decision existed to avoid. Hub-side, SQLite, capped at 5000 lines per
room, last 200 replayed on join. `talk:here` / `talk:gone` / `talk:who` stay
ephemeral: presence is about now by definition, and a replayed arrival is a
ghost.

### The wire

    <-  {type:'control', cmd:'history'}          the client asks, on connect
    ->  {type:'mesh:history', lines:[…], done}   the hub answers, oldest-first

Each line is `{id, channel, from, payload, ts}`. `id` is minted by the hub and is
**the same id in the replay and in the live `mesh:event`** — which is what makes
deduping possible at all. Chunks stay under 6KB against the mesh's 8KB frame cap,
so nothing on the mesh has to grow a buffer to hold a room's past.

### Replay is its own frame, on purpose

History arrives as `mesh:history` and **never** as `mesh:event` with a flag. A
boolean would fail *open*: any hub path that forgot to set it would hand a client
the entire history as live traffic, and di.bo's mind would answer all of it at
once, to everyone. A distinct type fails *closed* — an unknown type is dropped by
a listener that whitelists the one live type it knows.

That is the same shape as the empty-recipient bug that lost seven crossings:
absence read as permission. `keeper.mjs` therefore keeps `if (m.type !==
'mesh:event') return` and must not be rewritten as a blacklist.

di.bo never sends the `history` control frame. It has no use for a room's past —
it answers what is said in front of it — and asking for one is the only way it
could be made to shout at history.

### History begins at switch-on

**Nothing is backfilled.** Persistence is off until `MESH_HISTORY_CHANNELS` is
set on a tier, and the switch-on order is not interchangeable:

1. the room's own wording changes first — the line that promised impermanence
   dies *before* anything is written down
2. then the env var

Every line spoken in this room until now was spoken under a subtitle saying it
would not be kept. Persisting those retroactively would change what those people
agreed to after the fact, and some of them are still waiting for an answer.

### The Telegram seam is unchanged

An ask still reaches the owner's Telegram, because that is how the keeper hears
at all. di.bo dedupes what it forwards on the hub's line id — not against replay,
which it never receives, but against a reconnect redelivering a room's tail,
which would otherwise reach the owner as the same sentence twice.

## The two halves

This protocol has two implementations — `field.html` and `keeper.mjs` — and they
have now drifted apart twice, silently, with every test passing:

| | the field composed | di.bo expected |
|---|---|---|
| the address | `պահապան ` | `ՊԱՀԱՊԱՆ→` |
| the channel | `talk` | `bridge:talk` |

Both times a visitor stood in front of a keeper that could not hear them, and
both times the unit tests were green — because they asserted di.bo agrees with
di.bo. A test that can pass while the other side is absent cannot catch this.

So: **`contract.mjs` reads the field HTML that is actually served and checks
di.bo against it.** It extracts the channels the page publishes and the aliases
it declares, and fails if di.bo does not know them.

    node contract.mjs --tier staging
    node contract.mjs --file ../br_id_ge/field.html

Run it before deploying a change to *either* side. The field keeps its own
`ADDR` list and its own `addressed()`; that duplication is allowed to stand,
but the invariant is that **di.bo accepts everything the field marks as
addressed**. di.bo may be more forgiving — someone typing by hand gets the
capitals and the arrow wrong — never less.

## Who owns what

- protocol, the AI's voice, the fences, the Telegram seam — `di-bo`
- the room's interface in `field.html` — `br_id_ge`
- mesh hub changes, if any turn out to be needed — a PR to `di.iiii`

## What is not enforceable here

The mesh is open: anything can publish to it. The per-person caps live in
`field.html` and are therefore a **request, not a limit** — di.bo can decline to
carry what it hears, and does, but it cannot stop a publish. Real limits on
people need the hub (`serverXR/src/meshHub.js`).

There is also no reject signal. A throttled line simply does not appear.

**Asked and left undecided.** Whether a visitor should SEE that they were held
went to the owner and came back "idk" — no mandate either way, so it stays the
simple thing: silence. `talk:held` is deliberately NOT built. Recorded here as
undecided-defaulted-to-silent so the next person knows it was considered rather
than missed, and can reopen it.

Verified, not assumed: the hub does not echo a publish back to its sender, so a
client rendering its own lines locally will not double them.

Staging first. Nobody has seen this speak.
