// The tunnel — the bot side. See docs/the-tunnel.md; that document is the
// source and this file is tested against it.
//
// One keeper, two bodies, one memory. What arrives here and what the keeper
// witnessed in the field belong to the same mind; the boundary the owner drew
// — "telegram is private, keeper is group" — is a rule about SPEECH, not two
// separate stores. Nothing in here may be spoken into the field.

import crypto from 'node:crypto'
import { readFile, writeFile, readdir, rename, unlink, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export const TOKEN_VERSION = 1
export const TOKEN_BYTES = 37          // 1 version + 16 insc + 4 exp + 16 hmac
export const TOKEN_CHARS = 50          // base64url of 37 bytes; Telegram caps at 64
export const TOKEN_TTL_MIN = 24 * 60

// Why the alphabet matters: Telegram's ?start= payload permits A-Za-z0-9_- and
// nothing else. base64url is exactly that set. A dotted `v1.<id>.<sig>` would
// be rejected by Telegram, and that is the kind of thing that gets discovered
// at the worst possible moment.
const B64URL_ONLY = /^[A-Za-z0-9_-]+$/

const uuidToBytes = (id) => {
  const hex = String(id || '').replace(/^insc-/, '').replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/i.test(hex)) return null
  return Buffer.from(hex, 'hex')
}
const bytesToInsc = (buf) => {
  const h = buf.toString('hex')
  return `insc-${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

const mac = (secret, head) =>
  crypto.createHmac('sha256', secret).update(head).digest().subarray(0, 16)

// Exported so a test can mint what serverXR will mint. The mint itself lives in
// di.iiii (it is the only side that can check the crossing's proof) — this is
// the same computation, so the two can be tested against each other rather than
// each against itself. Both halves of this protocol have drifted twice already.
export function mintToken(inscId, secret, { now = Date.now(), ttlMin = TOKEN_TTL_MIN } = {}) {
  const raw = uuidToBytes(inscId)
  if (!raw) throw new Error('not an inscription id')
  if (!secret) throw new Error('no TUNNEL_SHARED_SECRET')
  const head = Buffer.alloc(21)
  head[0] = TOKEN_VERSION
  raw.copy(head, 1)
  head.writeUInt32BE(Math.floor(now / 60000) + ttlMin, 17)
  return Buffer.concat([head, mac(secret, head)]).toString('base64url')
}

// Never throws, never says WHY beyond a coarse reason: a caller that tells a
// stranger which part of their token was wrong is an oracle. The reason is for
// the log, not for the person.
export function readToken(token, secret, { now = Date.now() } = {}) {
  const t = String(token || '')
  if (!t || !B64URL_ONLY.test(t) || t.length !== TOKEN_CHARS) return { ok: false, reason: 'malformed' }
  if (!secret) return { ok: false, reason: 'no secret configured' }
  let buf
  try { buf = Buffer.from(t, 'base64url') } catch { return { ok: false, reason: 'malformed' } }
  if (buf.length !== TOKEN_BYTES) return { ok: false, reason: 'malformed' }
  // ONE TOKEN, ONE STRING. 37 bytes is 296 bits and 50 base64url chars carry
  // 300, so the final character has two slack bits that decode to nothing —
  // several different strings parse to the same token. Harmless for the
  // signature, which covers the bytes either way, but it means "have I seen
  // this token before?" cannot be asked of the string. Re-encoding and
  // demanding an exact match leaves exactly one spelling.
  if (buf.toString('base64url') !== t) return { ok: false, reason: 'malformed' }
  if (buf[0] !== TOKEN_VERSION) return { ok: false, reason: 'version' }
  const head = buf.subarray(0, 21)
  const sig = buf.subarray(21)
  const expected = mac(secret, head)
  if (sig.length !== expected.length || !crypto.timingSafeEqual(sig, expected)) {
    return { ok: false, reason: 'signature' }
  }
  if (head.readUInt32BE(17) <= Math.floor(now / 60000)) return { ok: false, reason: 'expired' }
  return { ok: true, insc: bytesToInsc(head.subarray(1, 17)) }
}

// ── the memory ────────────────────────────────────────────────────────────
// One file per crossing, so a single person's record can be shown to them,
// handed over, or deleted without rewriting everyone else's. Deliberately NOT
// state.json: that is di.bo's operational state, written whole on every change,
// and other people's words do not belong in it.

export class TunnelStore {
  constructor(dir) { this.dir = dir }

  #path(insc) {
    // The insc id becomes a filename, so it is rebuilt from its own bytes
    // rather than trusted. A token that decodes is by construction 16 bytes of
    // hex, but this file is also called with ids from the field.
    const raw = uuidToBytes(insc)
    if (!raw) return null
    return join(this.dir, `${bytesToInsc(raw)}.json`)
  }

  async read(insc) {
    const p = this.#path(insc)
    if (!p) return null
    try { return JSON.parse(await readFile(p, 'utf8')) } catch { return null }
  }

  async write(record) {
    const p = this.#path(record.insc)
    if (!p) throw new Error('not an inscription id')
    await mkdir(this.dir, { recursive: true })
    // tmp+rename for the same reason state.json does it: a process killed
    // mid-write leaves half a JSON object, and half a JSON object reads as
    // "this person has no record".
    const tmp = `${p}.tmp-${process.pid}`
    await writeFile(tmp, JSON.stringify(record, null, 1), { mode: 0o600 })
    await rename(tmp, p)
    return record
  }

  async forget(insc) {
    const p = this.#path(insc)
    if (!p) return false
    try { await unlink(p); return true } catch { return false }
  }

  // Which crossing this Telegram account is bound to. A linear scan is right at
  // this size and stays honest — an index is a second source of truth that can
  // disagree with the files.
  async byTelegram(tgId) {
    let names = []
    try { names = await readdir(this.dir) } catch { return null }
    for (const n of names) {
      if (!n.endsWith('.json')) continue
      try {
        const r = JSON.parse(await readFile(join(this.dir, n), 'utf8'))
        if (String(r.tg_id) === String(tgId)) return r
      } catch { /* a half-written or hand-edited file is not a reason to fail */ }
    }
    return null
  }
}

// First use wins. A second use of the same token is a stranger, not an error —
// the person holding it may have forwarded the link, and the one who arrives
// second must still be answered rather than met with a failure screen.
export async function bind(store, { insc, who, tgId, now = Date.now() }) {
  const existing = await store.read(insc)
  if (existing?.tg_id && String(existing.tg_id) !== String(tgId)) {
    return { ok: false, reason: 'already bound', record: existing }
  }
  const record = existing || { insc, who, notes: [], created_at: now }
  record.who = who || record.who
  record.tg_id = String(tgId)
  record.bound_at = record.bound_at || now
  record.last_at = now
  await store.write(record)
  return { ok: true, record, first: !existing?.tg_id }
}

// ── the mind budget ───────────────────────────────────────────────────────
// The field wins, by the owner's decision. Implemented as a RESERVE rather than
// a preference: the tunnel may only spend up to its share, so a busy evening in
// Telegram can never empty the budget out from under someone standing in front
// of a camera mid-crossing. A preference would be a comment; a reserve is a
// number that holds when nobody is watching.
export const TUNNEL_MIND_SHARE = 0.5

// The room is kept now and everyone who crossed may speak in it, which points
// the same reserve at a second failure: a busy room spends the hour on chatter
// and the keeper is silent for the one person standing in front of a camera.
//
// A LADDER, not a partition. Each lane names the fraction of the hour past
// which IT stops spending — measured against the whole hour, not its own use —
// so as the hour fills the least urgent voices fall silent first and the rite
// always holds the last slice. `field` is absent on purpose: the rite is never
// lane-blocked, only by the global cap. Read it as a queue for who gives way.
//
//   chat    35%   a Telegram group. Nobody there is at the work; they are in a
//                 chat app, and the answer keeps. Lowest rung on purpose — it is
//                 also the only lane that can be spent by people who never came
//                 to di.iiii at all.
//   tunnel  50%   a private thread can wait; the field cannot
//   ask     70%   the uncrossed, whose question keeps until the room is quiet
//   room    85%   crossing earns the room, so it gives way late
//   field  100%   someone is mid-crossing — this is what the rest yields to
//
// `chat` shares the hour with the rest rather than having a budget of its own,
// which is the whole point: the relay answers ONE request at a time, so a group
// question does not merely spend a number — it holds the only line to the mind
// for up to a minute while someone stands at the bridge. A separate counter
// would have let a room be busy and the ladder never notice.
export const LANE_CEILING = { chat: 0.35, tunnel: TUNNEL_MIND_SHARE, ask: 0.7, room: 0.85 }

// And within any lane: no single voice takes more than a quarter of the hour,
// or "everyone may speak" quietly becomes "whoever speaks first gets the mind".
export const SPEAKER_SHARE = 0.25

export function laneAllowed(lane, spentThisHour, perHour, { spentBySpeaker = 0 } = {}) {
  const ceiling = LANE_CEILING[lane]
  if (ceiling !== undefined && spentThisHour >= Math.floor(perHour * ceiling)) return false
  // Math.max(1, …) so a small per-hour budget cannot floor to zero and mute
  // everyone outright — a cap that stops the first question is not a cap.
  if (spentBySpeaker >= Math.max(1, Math.floor(perHour * SPEAKER_SHARE))) return false
  return true
}
