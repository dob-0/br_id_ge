/*
  serverXR N-way WebSocket Mesh (draft)
  - Room-based pub/sub model
  - Accepts connections with ?room=ROOM&node=NODEID
  - Message schema (JSON):
    { type: 'join'|'leave'|'publish'|'control', channel: 'motion'|'bio'|'env', nodeId, payload }
  - Broadcasts to all other participants in the same room
  - Attaches latency metadata and demonstrates per-node ghost-hand prediction hook

  Usage:
    npm install ws
    node serverXR/wsMesh.js

  Note: This is a draft. Integrate auth, scaling, and clustering for production.
*/

const WebSocket = require('ws');
const url = require('url');

const PORT = process.env.PORT || 8080;
const ROOM_SECRET = process.env.ROOM_SECRET || '';

const wss = new WebSocket.Server({ port: PORT });

// rooms: Map<roomId, Map<nodeId, ws>>
const rooms = new Map();
// latencySamples: Map<roomId, Map<pairKey, number[]>>
const latencySamples = new Map();
// nodeMotionState: Map<nodeId, {x,y,z,vx,vy,vz,t}> — EMA velocity per sender
const nodeMotionState = new Map();

console.log(`ws-mesh starting on ws://0.0.0.0:${PORT}`);

// EMA smoothing factor: 0.65 balances reactivity vs. jitter rejection.
// Raise toward 1.0 for snappier tracking; lower toward 0 for smoother but laggier.
const MOTION_ALPHA = 0.65;

function updateNodeMotion(nodeId, vec, now) {
  const prev = nodeMotionState.get(nodeId);
  if (!prev) {
    nodeMotionState.set(nodeId, { x: vec.x, y: vec.y, z: vec.z || 0, vx: 0, vy: 0, vz: 0, t: now });
    return;
  }
  const dt = Math.max(1, now - prev.t) / 1000; // seconds, clamp to avoid division by zero
  nodeMotionState.set(nodeId, {
    x: vec.x, y: vec.y, z: vec.z || 0,
    vx: MOTION_ALPHA * ((vec.x - prev.x) / dt) + (1 - MOTION_ALPHA) * prev.vx,
    vy: MOTION_ALPHA * ((vec.y - prev.y) / dt) + (1 - MOTION_ALPHA) * prev.vy,
    vz: MOTION_ALPHA * (((vec.z || 0) - prev.z) / dt) + (1 - MOTION_ALPHA) * prev.vz,
    t: now,
  });
}

function predictGhostHand(latencyMs, nodeId) {
  const state = nodeMotionState.get(nodeId);
  if (!state) return null;
  const t = Math.max(0, latencyMs) / 1000;
  return {
    x: state.x + state.vx * t,
    y: state.y + state.vy * t,
    z: state.z + state.vz * t,
    predictedAt: Date.now() + latencyMs,
  };
}

function pairKey(fromId, toId) {
  return `${fromId}::${toId}`;
}

function getRoomLatencyMap(roomId) {
  if (!latencySamples.has(roomId)) {
    latencySamples.set(roomId, new Map());
  }
  return latencySamples.get(roomId);
}

function recordLatencySample(roomId, fromId, toId, sampleMs) {
  if (!Number.isFinite(sampleMs) || sampleMs < 0) return;
  const roomStats = getRoomLatencyMap(roomId);
  const key = pairKey(fromId, toId);
  const samples = roomStats.get(key) || [];
  samples.push(sampleMs);
  roomStats.set(key, samples.slice(-8));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

wss.on('connection', function connection(ws, req) {
  const qs = url.parse(req.url, true).query;

  if (ROOM_SECRET && qs.secret !== ROOM_SECRET) {
    ws.close(4401, 'Unauthorized');
    return;
  }

  const roomId = qs.room || 'default';
  const nodeId = qs.node || `node-${Math.random().toString(36).slice(2,8)}`;

  if (!rooms.has(roomId)) rooms.set(roomId, new Map());
  const room = rooms.get(roomId);
  room.set(nodeId, ws);
  ws._meta = { roomId, nodeId, lastSeen: Date.now() };

  console.info(`connect: ${nodeId} -> room ${roomId} (members=${room.size})`);

  // notify others of join
  broadcast(roomId, { type: 'peer:join', nodeId, members: Array.from(room.keys()) }, nodeId);

  ws.on('message', function incoming(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) { return; }
    ws._meta.lastSeen = Date.now();

    // expected message: { type: 'publish', channel: 'motion'|'bio'|'env', payload: {...} }
    if (msg.type === 'publish' && msg.channel) {
      // attach server timestamp
      const data = { ...msg, from: nodeId, ts: Date.now() };

      // simple latency measurement if client sent a pingTs
      const clientPing = msg.pingTs ? (Date.now() - msg.pingTs) : 0;

      // forward to other nodes with per-target metadata
      // Update EMA motion state before fan-out so each target gets the same prediction base
      if (msg.channel === 'motion' && msg.payload && typeof msg.payload === 'object') {
        updateNodeMotion(nodeId, msg.payload, Date.now());
      }

      const members = Array.from(room.entries());
      for (const [targetId, targetWs] of members) {
        if (targetId === nodeId) continue;
        const perTargetLatency = estimateLatency(roomId, nodeId, targetId, clientPing);
        recordLatencySample(roomId, nodeId, targetId, perTargetLatency);
        const extra = { perTargetLatency };

        if (msg.channel === 'motion') {
          const predicted = predictGhostHand(perTargetLatency, nodeId);
          if (predicted) extra.predicted = predicted;
        }

        safeSend(targetWs, { type: `mesh:event`, channel: msg.channel, from: nodeId, payload: msg.payload, meta: extra, ts: data.ts });
      }
    }

    if (msg.type === 'nodes:add') {
      // broadcast updated nodes list to room (naive: no persistence here)
      broadcast(roomId, { type: 'nodes:update', nodes: msg.node ? [msg.node] : [] });
    }

    if (msg.type === 'control' && msg.cmd === 'ping') {
      const sentAt = Number(msg.sentAt) || Date.now();
      const roundTrip = Date.now() - sentAt;
      recordLatencySample(roomId, nodeId, nodeId, roundTrip);
      safeSend(ws, { type: 'control:pong', sentAt, receivedAt: Date.now(), roundTrip });
    }

    if (msg.type === 'control' && msg.cmd === 'list') {
      safeSend(ws, { type: 'room:list', members: Array.from(room.keys()) });
    }
  });

  ws.on('close', function () {
    const room = rooms.get(roomId);
    if (room) {
      room.delete(nodeId);
      broadcast(roomId, { type: 'peer:leave', nodeId, members: Array.from(room.keys()) }, nodeId);
      if (room.size === 0) {
        rooms.delete(roomId);
        latencySamples.delete(roomId);
      }
    }
    nodeMotionState.delete(nodeId);
    console.info(`disconnect: ${nodeId} from ${roomId}`);
  });
});

function safeSend(ws, obj) {
  try { ws.send(JSON.stringify(obj)); } catch (e) { /* ignore */ }
}

function broadcast(roomId, obj, exceptNodeId) {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const [id, ws] of room.entries()) {
    if (id === exceptNodeId) continue;
    safeSend(ws, obj);
  }
}

function estimateLatency(roomId, fromId, toId, fallbackMs = 0) {
  const roomStats = latencySamples.get(roomId);
  const key = pairKey(fromId, toId);
  const samples = roomStats?.get(key) || [];
  const mean = Math.round(average(samples));
  if (mean > 0) return mean;
  if (Number.isFinite(fallbackMs) && fallbackMs > 0) return fallbackMs;
  return 120 + Math.floor(Math.random() * 40);
}

// graceful shutdown
process.on('SIGINT', () => { console.log('shutting down'); wss.close(() => process.exit(0)); });
