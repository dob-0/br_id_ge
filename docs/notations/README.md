# Notations #2 — the record, and what to build from it

Everything we hold about Notations #2 (hosq, Yerevan, lab Jul 20–31, festival
Aug 1–2 2026, theme *Rituals*), assembled 2026-08-04, plus the recommendation
that follows from it.

| file | what |
|---|---|
| [`PROGRAMME.md`](PROGRAMME.md) | all 76 programme entries with full credits, times, venues |
| [`ARTISTS.md`](ARTISTS.md) | who made what, plus the name-variant table |
| [`ROOMS.md`](ROOMS.md) | the spatial index — what stood in which room |
| [`programme.json`](programme.json) | the machine-readable twin; **this is the build input** |
| [`PLATFORM.md`](PLATFORM.md) | what di.iiii can already carry, and where it is fragile |

The chat reading lives in the private ops repo (`br_id_ge-ops/notations/`) — it is
other people's conversation and does not belong in a public repo.

**Source of the credits:** the official esora programme, which hosq asked every
participant to check on 1 Aug. It is the closest thing to an authoritative record.
There is no published list of the 65 open-call participants; the "111 artists from
27 countries" figure is hosq's own and includes curators, staff, the youth camp
and the remote 100 Winds players.

## The numbers

- **76 programme entries** — 57 distinct works, 8 free opening-week events,
  5 Hayfilm room programmes, the festival pass entry.
- **186 named people** in the credits, of which ~110 are Notations project artists;
  the rest are club-night act names and first-name-only credits (Kat, Roma, Syuz,
  Tsolak, Ann, Hooman…).
- **25 curators**: 20 project curators + 5 hosq team, named on the open call.
- **~28 addressable rooms** across three venues, and the Philharmonia's are named
  in Armenian, transliterated on the programme: KARATAV · VERNAKHAGH · ZOOYGKET ·
  KHOSROVAYN · BENKORJ · TSNKNER · EKORJ · KET.
- **Dense co-authorship**: Uliana Pyadushkina appears in 7 works, Ember Li · Kino
  Pinto · Lubomir Andrei · Matteo Cenerini in 5 each, then Yulia Nemova, Artem
  Semenov, Levon Yerkanyan, Maksim Sergeev, Nasrin Shojaei, Rhys and Mariam
  Gevorgyan in 4. The lab's real output is not 57 separate objects, it is a graph.

## The recommendation

**br_id_ge does not need an exhibition bolted onto it. The field already is one.**

The field holds crossings. A crossing is a person who came, was asked who they are
and what they carry, and left a core that is never erased. Notations was 110 people
who came, were asked exactly that by a lab themed *Rituals*, and left 57 works.
Those are the same gesture at two scales. Seeding the festival into the field is
not a feature — it is the field being told what it was already about.

So: **one space, one door, three layers already built.**

### Layer 1 — the rite, unchanged
`/br_id_ge/rite` stays exactly what it is. It is the way in, not the exhibition.
Do not put a gallery in front of it.

### Layer 2 — the field carries the festival
`/br_id_ge/field` today opens blank and reveals crossings under ink stains. Seed it
with **57 works as cores that were already there** — each with its own permanent
seeded shape, exactly like a crossing, because that is what they are. A visitor's
ink stain reveals whatever it touches: sometimes a stranger's crossing from last
week, sometimes *Reverse Tower Ritual*. The "all together ↔ each alone" toggle
already gathers them into one body. The invisible wire already sews revealed cores
through the keeper.

This is where "all works get visibility" is actually satisfied, and it costs no new
surface: every work is present, permanently, in the same body as every visitor.

### Layer 3 — the rooms as navigation
The building is the index. Portal entities (`mode: portal | embed`, targeting
space + project) let a room hold its works without each work needing its own visit.
Give each work a vanity slug — `/br_id_ge/echo`, `/br_id_ge/matagh` — so an artist
has one link to their own thing, which is the thing artists actually ask for.

### The keeper knows the festival
The keeper LLM already greets by name and closes Act V. Feed it `programme.json`
and it can ask a real question: *you were in ԶՈՒՅԳԿԵՏ on the second day — what did
you leave there?* That is the difference between an archive and a rite. It is also
cheap: the data is already structured and the keeper loop is already built.

### On the consolidation rule
The 2026-07-31 decision was **one public face**: the door is the only published
entry. This proposal keeps it. Works become portal targets and vanity slugs inside
the existing space — not a fourth published sibling, and not a new `notations`
space. If a work later needs a full room of its own (a wcc-style per-artist
project), it is still reached through the door.

## Build order

1. **Extend the manifest.** `scripts/sync-space.mjs` already pushes HTML into
   projects from `di-space*.json`. Generalise it to read `programme.json` and emit
   entities — this is the missing batch-authoring path named in `PLATFORM.md`.
   Nothing about the platform needs to change.
2. **Seed the field** with the 57 works. Shapes seeded by work id, permanent, same
   rule as crossings. Verify against the asset-path trap in `PLATFORM.md` — this
   platform has silently swallowed assets before.
3. **Slugs + rooms.** One vanity link per work; rooms as portal clusters.
4. **Keeper context.** `programme.json` into the keeper prompt.
5. **Media, when we have it.** Everything above works with zero images. The visual
   record is the one thing we do not hold.

## The one thing that is time-sensitive

The 278 photos and videos from the hosq group are **not** recoverable from our
data — di-bo logged media *type* but never `file_id`. They exist only inside
Telegram, and the group is dispersing. A Telegram Desktop export of the full
history and media, done by a member, is the only route, and it gets harder every
week. Details in the private ops note.

Worth asking hosq directly for two things: the *aritsts mapping & archive* data
(Uliana Pyadushkina + Christian Ginosyan — it was a participant map), and the hosq
zine that Yulia asked for in the room and never got.

## Corrections owed to hosq

Found while assembling this, all still live on the public programme:

- **Artak's *Matagh*** (Aug 1, 17:00, downstairs at the Philharmonia) is absent
  from the programme entirely.
- ***Short Songs*** merges two people into one name — "Uliana Pyadushkina Levon
  Yerkonyan" is a missing comma.
- Recurring misspellings: *Pestmaljyan* / *Pesshtmaljyan*, *Messrop*,
  *Arem Semenov*, *Maksim Segeev*, *Jeanna Karmina*, *Nadja Xyxu*,
  *Tanya Chizikova*. Full table in [`ARTISTS.md`](ARTISTS.md).
- Title typos: *aritsts mapping*, *Perofrmance*, *Performnce*.
