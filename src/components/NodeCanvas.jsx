/*
 Dynamic Node Canvas (React)
 - Driven by a `nodes` array in state
 - Renders draggable nodes, SVG wires, and emits motion updates via WebSocket
 - Replace or import into your React app. This is a draft to start v.0000 migration.
*/
import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_NODES = [
  // example seed; in v.0000 these are loaded from backend /state
  { id: 'node-1', label: 'Gyumri', type: 'stage', x: 120, y: 140, color: '#ff2a5f' },
  { id: 'node-2', label: 'Munich', type: 'stage', x: 560, y: 180, color: '#00e5ff' },
];

export default function NodeCanvas({ wsUrl = 'ws://localhost:8080', room = 'default', nodeId = 'node-canvas' }) {
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [ghosts, setGhosts] = useState([]);
  const dragging = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // simple WebSocket connection for pub-sub of node events
    try {
      const ws = new WebSocket(wsUrl + `?room=${encodeURIComponent(room)}&node=${encodeURIComponent(nodeId)}`);
      wsRef.current = ws;
      ws.addEventListener('open', () => console.info('ws open'));
      ws.addEventListener('message', (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'nodes:update') {
            setNodes(Array.isArray(msg.nodes) ? msg.nodes : []);
          }
          if (msg.type === 'mesh:event' && msg.channel === 'motion') handleRemoteMotion(msg);
          if (msg.type === 'motion:remote') handleRemoteMotion(msg);
        } catch (e) { console.warn('ws message parse', e); }
      });
      return () => ws.close();
    } catch (e) { console.warn('ws connect failed', e); }
  }, [wsUrl, room, nodeId]);

  function sendMessage(obj) {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
  }

  function handleRemoteMotion(msg) {
    const payload = msg.payload || msg;
    const predicted = msg.meta?.predicted || payload.predicted || null;
    const targetId = msg.nodeId || msg.from || payload.nodeId;
    if (!targetId) return;

    if (Number.isFinite(payload.x) && Number.isFinite(payload.y)) {
      setNodes((prev) => prev.map((n) => (
        n.id === targetId ? { ...n, x: payload.x, y: payload.y } : n
      )));
    }

    if (predicted && Number.isFinite(predicted.x) && Number.isFinite(predicted.y)) {
      setGhosts((prev) => {
        const next = prev.filter((ghost) => ghost.nodeId !== targetId);
        next.push({
          nodeId: targetId,
          x: predicted.x,
          y: predicted.y,
          z: predicted.z || 0,
          predictedAt: predicted.predictedAt || Date.now(),
        });
        return next.slice(-12);
      });
    }
  }

  function onMouseDown(e, node) {
    dragging.current = { id: node.id, offsetX: e.clientX - node.x, offsetY: e.clientY - node.y };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (!dragging.current) return;
    const { id, offsetX, offsetY } = dragging.current;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    setNodes((prev) => prev.map(n => n.id === id ? { ...n, x, y } : n));
    // publish motion update (throttle in production)
    sendMessage({ type: 'motion:publish', nodeId: id, x, y, timestamp: Date.now(), pingTs: Date.now() });
  }

  function onMouseUp() {
    dragging.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function addNode(payload = {}) {
    const id = `node-${Date.now()}`;
    const node = { id, label: payload.label || id, x: 100, y: 100, type: payload.type || 'actor', color: payload.color || '#b4b4bb' };
    setNodes((prev) => { const next = [...prev, node]; sendMessage({ type: 'nodes:add', node }); return next; });
  }

  // draw wires between all pairs (simple full-mesh visualization)
  function renderWires() {
    const pairs = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) pairs.push([nodes[i], nodes[j]]);
    }
    return (
      <svg className="node-wires" width="100%" height="100%">
        {pairs.map(([a, b]) => (
          <line key={`${a.id}-${b.id}`} className="wire-path" x1={a.x + 48} y1={a.y + 22} x2={b.x + 48} y2={b.y + 22}
            stroke="#2b4d6d" strokeWidth={2} strokeOpacity={0.6} />
        ))}
      </svg>
    );
  }

  return (
    <div className="interactive-node-map" ref={containerRef}>
      {renderWires()}
      {nodes.map(node => (
        <div key={node.id}
          className={`drag-node ${node.type === 'stage' ? 'node-highlight' : ''}`}
          onMouseDown={(e) => onMouseDown(e, node)}
          style={{ left: node.x, top: node.y, minWidth: 120 }}>
          <div className="node-content" style={{ color: node.color }}>
            <div style={{ fontWeight: 'bold' }}>{node.label}</div>
            <div className="c-dim">{node.id}</div>
          </div>
        </div>
      ))}

      {ghosts.map((ghost) => (
        <div
          key={`${ghost.nodeId}-${ghost.predictedAt}`}
          className="drag-node"
          style={{
            left: ghost.x,
            top: ghost.y,
            minWidth: 120,
            opacity: 0.45,
            borderStyle: 'dashed',
            pointerEvents: 'none'
          }}
        >
          <div className="node-content" style={{ color: '#ffffff' }}>
            <div style={{ fontWeight: 'bold' }}>ghost {ghost.nodeId}</div>
            <div className="c-dim">predicted</div>
          </div>
        </div>
      ))}

      {/* lightweight UI actions for draft */}
      <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 60 }}>
        <button onClick={() => addNode({ label: 'New Actor' })}>+ Node</button>
      </div>
    </div>
  );
}
