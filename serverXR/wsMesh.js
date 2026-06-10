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
const wss = new WebSocket.Server({ port: PORT });

// rooms: Map<roomId, Map<nodeId, ws>>
const rooms = new Map();
// latencySamples: Map<roomId, Map<pairKey, number[]>>
const latencySamples = new Map();

console.log(`ws-mesh starting on ws://0.0.0.0:${PORT}`);

function predictGhostHand(latencyMs, currentVec) {
  // simple linear prediction: advance position proportionally to latency
  // Replace with TensorFlow.js model for v.0000 AI Stitch predictions
  const t = Math.max(0, latencyMs) / 1000; // seconds
  return {
    x: currentVec.x + (currentVec.vx || 0) * t,
    y: currentVec.y + (currentVec.vy || 0) * t,
    z: (currentVec.z || 0) + (currentVec.vz || 0) * t,
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
      const members = Array.from(room.entries());
      for (const [targetId, targetWs] of members) {
        if (targetId === nodeId) continue;
        const perTargetLatency = estimateLatency(roomId, nodeId, targetId, clientPing);
        recordLatencySample(roomId, nodeId, targetId, perTargetLatency);
        const extra = { perTargetLatency };

        // If channel is motion, include a predicted vector for the target using its latency
        if (msg.channel === 'motion' && msg.payload && typeof msg.payload === 'object') {
          extra.predicted = predictGhostHand(perTargetLatency, msg.payload);
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
