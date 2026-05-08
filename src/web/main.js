// Surface uncaught runtime errors visibly in #root so a silent React-mount
// failure doesn't look like a blank page. (Won't catch import-resolution
// failures — those happen before this module body runs; check dev tools.)
window.addEventListener("error", (e) => {
  const root = document.getElementById("root");
  if (root && !root.firstChild) {
    root.innerHTML = `<pre style="padding:1rem;color:#b91c1c;background:#fef2f2;white-space:pre-wrap;font:13px monospace">Error: ${e.message}\n${e.filename}:${e.lineno}:${e.colno}\n${e.error?.stack ?? ""}</pre>`;
  }
});
window.addEventListener("unhandledrejection", (e) => {
  const root = document.getElementById("root");
  if (root && !root.firstChild) {
    root.innerHTML = `<pre style="padding:1rem;color:#b91c1c;background:#fef2f2;white-space:pre-wrap;font:13px monospace">Unhandled: ${e.reason?.message ?? e.reason}\n${e.reason?.stack ?? ""}</pre>`;
  }
});

import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import { html } from "htm/react";

const LAYER_NAMES = {
  0: "L0 · Empirical fact",
  1: "L1 · Stylized fact",
  2: "L2 · Causal mechanism",
  3: "L3 · Value claim",
  4: "L4 · Policy position",
};

const LAYER_CLASSES = {
  0: "bg-stone-50 border-stone-400 text-stone-900",
  1: "bg-slate-50 border-slate-400 text-slate-900",
  2: "bg-cyan-50 border-cyan-400 text-cyan-900",
  3: "bg-purple-50 border-purple-400 text-purple-900",
  4: "bg-indigo-50 border-indigo-400 text-indigo-900",
};

const RELATION_STYLES = {
  supports: { stroke: "#16a34a", strokeWidth: 2 },
  attacks: { stroke: "#dc2626", strokeWidth: 2, strokeDasharray: "6 3" },
  "attacked-by": { stroke: "#dc2626", strokeWidth: 2, strokeDasharray: "6 3" },
  evidence: { stroke: "#0284c7", strokeWidth: 2 },
  qualifies: { stroke: "#7c3aed", strokeWidth: 1.5, strokeDasharray: "2 2" },
};

const NODE_W = 280;
const NODE_H = 110;
const COL_GAP = 220;
const ROW_GAP = 140;
const BAND_X_CLAMP = 60;
const Y_JITTER = 10;
const BAND_CENTER = {
  0: 0,
  1: NODE_W + COL_GAP,
  2: 2 * (NODE_W + COL_GAP),
  3: 3 * (NODE_W + COL_GAP),
  4: 4 * (NODE_W + COL_GAP),
};

// =====================================================
// Custom node renderer
// =====================================================

function StatementNode({ data }) {
  const layerClass = LAYER_CLASSES[data.layer] || "bg-white border-gray-400";
  const layerName = LAYER_NAMES[data.layer] || `L${data.layer}`;
  const isSelected = data._isSelected;
  const isFaded = data._hasSelection && !data._inUpstream;
  const selectedClass = isSelected
    ? "ring-2 ring-blue-500 ring-offset-1"
    : "";
  const fadeClass = isFaded ? "opacity-25" : "";

  return html`
    <div
      class="rounded border-2 ${layerClass} shadow-sm p-3 ${selectedClass} ${fadeClass} relative transition-opacity"
      style=${{ width: NODE_W, minHeight: NODE_H }}
    >
      <${Handle} id="L-t" type="target" position=${Position.Left}
        style=${{ top: "20%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="L-m" type="target" position=${Position.Left}
        style=${{ top: "50%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="L-b" type="target" position=${Position.Left}
        style=${{ top: "80%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="R-t" type="source" position=${Position.Right}
        style=${{ top: "20%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="R-m" type="source" position=${Position.Right}
        style=${{ top: "50%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="R-b" type="source" position=${Position.Right}
        style=${{ top: "80%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="T-s" type="source" position=${Position.Top}
        style=${{ left: "30%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="T-t" type="target" position=${Position.Top}
        style=${{ left: "70%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="B-s" type="source" position=${Position.Bottom}
        style=${{ left: "30%", opacity: 0, background: "transparent", border: "none" }} />
      <${Handle} id="B-t" type="target" position=${Position.Bottom}
        style=${{ left: "70%", opacity: 0, background: "transparent", border: "none" }} />
      <div class="text-[10px] uppercase tracking-wide opacity-70 mb-1">
        ${layerName} · ${data.id}
      </div>
      <div class="text-sm font-medium leading-snug">${data.text}</div>
      ${(data.endorsed_by?.length ?? 0) > 0 &&
      html`
        <div class="text-[11px] text-green-700 mt-2">
          ✓ ${data.endorsed_by.join(", ")}
        </div>
      `}
      ${(data.disputed_by?.length ?? 0) > 0 &&
      html`
        <div class="text-[11px] text-red-700">
          ✗ ${data.disputed_by.join(", ")}
        </div>
      `}
      ${(data.data_refs?.length ?? 0) > 0 &&
      html`
        <div class="text-[11px] text-gray-600 mt-1">
          📊 ${data.data_refs[0].label || data.data_refs[0].path}
        </div>
      `}
    </div>
  `;
}

const NODE_TYPES = { statement: StatementNode };

// =====================================================
// Layout: soft layer bands (L0 left → L4 right)
// =====================================================

// Pass 1: barycentric Y per band, with deterministic small Y-jitter so
// equally-stacked rows across bands don't all align on the same horizontal.
// Pass 2: connection-pulled X — each card drifts horizontally toward the
// average X of its connected neighbors, clamped to ±BAND_X_CLAMP from the
// band center. `edges` here are the renderer's visual edges (source =
// visual-left, target = visual-right after layer-aware flipping in App).
function hashFloat(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) | 0;
  return ((h % 1000) + 1000) % 1000 / 1000;
}

function applyLayout(nodes, edges) {
  const byLayer = { 0: [], 1: [], 2: [], 3: [], 4: [] };
  for (const n of nodes) {
    const layer = n.data.layer;
    if (byLayer[layer]) byLayer[layer].push(n);
  }

  const yCenterById = new Map();
  const positioned = [];
  const stride = NODE_H + ROW_GAP;

  for (const layer of [0, 1, 2, 3, 4]) {
    const group = byLayer[layer];
    if (group.length === 0) continue;

    if (layer > 0) {
      for (const n of group) {
        const lefts = edges
          .filter((e) => e.target === n.id)
          .map((e) => yCenterById.get(e.source))
          .filter((y) => y !== undefined);
        n._sortKey =
          lefts.length > 0
            ? lefts.reduce((a, b) => a + b, 0) / lefts.length
            : 0;
      }
      group.sort((a, b) => a._sortKey - b._sortKey);
    }

    const totalHeight = group.length * stride - ROW_GAP;
    const startY = -totalHeight / 2;
    group.forEach((n, i) => {
      const yJit = (hashFloat(n.id) * 2 - 1) * Y_JITTER;
      const y = startY + i * stride + yJit;
      yCenterById.set(n.id, y + NODE_H / 2);
      positioned.push({
        ...n,
        position: { x: BAND_CENTER[layer], y },
      });
    });
  }

  // Pass 2: connection-pull X within band.
  const xById = new Map(positioned.map((n) => [n.id, n.position.x]));
  const neighborsById = new Map();
  for (const n of positioned) neighborsById.set(n.id, []);
  for (const e of edges) {
    if (neighborsById.has(e.source) && neighborsById.has(e.target)) {
      neighborsById.get(e.source).push(e.target);
      neighborsById.get(e.target).push(e.source);
    }
  }

  for (const n of positioned) {
    const neighbors = neighborsById.get(n.id);
    if (!neighbors || neighbors.length === 0) continue;
    const avgNeighborX =
      neighbors.reduce((sum, id) => sum + (xById.get(id) ?? 0), 0) /
      neighbors.length;
    const center = BAND_CENTER[n.data.layer];
    const dx = avgNeighborX - center;
    const offset = Math.max(-BAND_X_CLAMP, Math.min(BAND_X_CLAMP, dx * 0.4));
    n.position = { x: center + offset, y: n.position.y };
  }

  return positioned;
}

// =====================================================
// Side panel: full statement view (read-only)
// =====================================================

function groupByRelation(edges) {
  const groups = new Map();
  for (const e of edges) {
    if (!groups.has(e.relation)) groups.set(e.relation, []);
    groups.get(e.relation).push(e);
  }
  return groups;
}

function ManifestSection({ title, groups, side, statementById, onSelectId }) {
  if (groups.size === 0) return null;
  return html`
    <div class="mt-4">
      <div class="text-xs font-semibold uppercase text-gray-500 mb-1">
        ${title}
      </div>
      ${[...groups.entries()].map(
        ([relation, list]) => html`
          <div key=${relation} class="text-sm mb-1">
            <span class="text-gray-500">${relation}:</span>
            ${list.map((e, i) => {
              const otherId = side === "out" ? e.target : e.source;
              const other = statementById.get(otherId);
              const layerClass =
                LAYER_CLASSES[other?.layer] || "bg-gray-100";
              const parts = layerClass.split(" ");
              return html`
                <button
                  key=${otherId + i}
                  type="button"
                  onClick=${() => onSelectId(otherId)}
                  title=${other?.text ?? otherId}
                  class="inline-block ml-1 mb-1 px-2 py-0.5 rounded border ${parts[0]} ${parts[1]} ${parts[2]} text-xs hover:opacity-80"
                >
                  ${otherId}
                </button>
              `;
            })}
          </div>
        `,
      )}
    </div>
  `;
}

function SidePanel({ statement, edges, statementById, onSelectId, onClose }) {
  if (!statement) return null;
  const layerName = LAYER_NAMES[statement.layer] || `L${statement.layer}`;
  const outgoing = edges.filter((e) => e.source === statement.id);
  const incoming = edges.filter((e) => e.target === statement.id);
  const buildsOn = groupByRelation(outgoing);
  const usedBy = groupByRelation(incoming);

  return html`
    <div class="absolute top-0 right-0 bottom-0 w-96 bg-white border-l shadow-lg overflow-y-auto z-10">
      <div class="p-4">
        <button
          onClick=${onClose}
          aria-label="Close"
          class="float-right text-gray-400 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
        <div class="text-xs text-gray-500 uppercase tracking-wide">
          ${layerName} · ${statement.id}
        </div>
        <div class="font-medium text-base mt-1 leading-snug">
          ${statement.text}
        </div>

        ${statement.sources.length > 0 &&
        html`
          <div class="mt-4">
            <div class="text-xs font-semibold uppercase text-gray-500 mb-1">
              Sources
            </div>
            ${statement.sources.map(
              (s, i) => html`
                <div key=${i} class="text-sm">
                  ${s.url
                    ? html`
                        <a
                          href=${s.url}
                          target="_blank"
                          rel="noreferrer"
                          class="text-blue-700 underline"
                        >
                          ${s.label || s.url}
                        </a>
                      `
                    : html`<span>${s.label}</span>`}
                  ${s.source_type &&
                  html`<span class="text-gray-500">
                    · ${s.source_type}</span
                  >`}
                  ${s.retrieved &&
                  html`<span class="text-gray-500"> · ${s.retrieved}</span>`}
                </div>
              `,
            )}
          </div>
        `}
        ${statement.endorsed_by.length > 0 &&
        html`
          <div class="mt-4">
            <div class="text-xs font-semibold uppercase text-gray-500 mb-1">
              Endorsed by
            </div>
            <div>
              ${statement.endorsed_by.map(
                (id) => html`
                  <span
                    key=${id}
                    class="inline-block bg-green-50 text-green-800 px-2 py-0.5 rounded mr-1 mb-1 text-xs"
                  >
                    @${id}
                  </span>
                `,
              )}
            </div>
          </div>
        `}
        ${statement.disputed_by.length > 0 &&
        html`
          <div class="mt-3">
            <div class="text-xs font-semibold uppercase text-gray-500 mb-1">
              Disputed by
            </div>
            <div>
              ${statement.disputed_by.map(
                (id) => html`
                  <span
                    key=${id}
                    class="inline-block bg-red-50 text-red-800 px-2 py-0.5 rounded mr-1 mb-1 text-xs"
                  >
                    @${id}
                  </span>
                `,
              )}
            </div>
          </div>
        `}
        ${statement.data_refs.length > 0 &&
        html`
          <div class="mt-4">
            <div class="text-xs font-semibold uppercase text-gray-500 mb-1">
              Data
            </div>
            ${statement.data_refs.map(
              (d, i) => html`
                <div key=${i} class="text-sm">
                  📊 ${d.label || d.path}
                  ${d.description &&
                  html`
                    <div class="text-xs text-gray-500 ml-5">
                      ${d.description}
                    </div>
                  `}
                </div>
              `,
            )}
          </div>
        `}

        <${ManifestSection}
          title="Builds on"
          groups=${buildsOn}
          side="out"
          statementById=${statementById}
          onSelectId=${onSelectId}
        />
        <${ManifestSection}
          title="Used by"
          groups=${usedBy}
          side="in"
          statementById=${statementById}
          onSelectId=${onSelectId}
        />
      </div>
    </div>
  `;
}

// =====================================================
// Legend
// =====================================================

function RelationLine({ relation }) {
  const s = RELATION_STYLES[relation] || { stroke: "#6b7280", strokeWidth: 1.5 };
  return html`
    <svg width="32" height="6" viewBox="0 0 32 6">
      <line
        x1="0"
        y1="3"
        x2="28"
        y2="3"
        stroke=${s.stroke}
        stroke-width=${s.strokeWidth}
        stroke-dasharray=${s.strokeDasharray || ""}
      />
      <polygon points="32,3 27,1 27,5" fill=${s.stroke} />
    </svg>
  `;
}

function Legend({ hasMutual }) {
  return html`
    <div class="bg-white p-3 rounded shadow border border-gray-200 text-xs space-y-1.5">
      <div class="font-semibold mb-1.5">Layers</div>
      ${[0, 1, 2, 3, 4].map((n) => {
        const parts = LAYER_CLASSES[n].split(" ");
        return html`
          <div key=${n} class="flex items-center gap-2">
            <div class="w-4 h-3 rounded border ${parts[0]} ${parts[1]}"></div>
            <span>${LAYER_NAMES[n]}</span>
          </div>
        `;
      })}
      <div class="border-t my-2"></div>
      <div class="font-semibold mb-1.5">Connections</div>
      ${["supports", "evidence", "qualifies", "attacks"].map(
        (rel) => html`
          <div key=${rel} class="flex items-center gap-2">
            <${RelationLine} relation=${rel} />
            <span>${rel}</span>
          </div>
        `,
      )}
      ${hasMutual &&
      html`
        <div class="flex items-center gap-2">
          <span class="inline-block w-8 text-center">↔</span>
          <span class="text-gray-600">mutual (both directions)</span>
        </div>
      `}
    </div>
  `;
}

// =====================================================
// App
// =====================================================

function App() {
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("./topic.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching topic.json`);
        return r.json();
      })
      .then(setGraph)
      .catch((e) => setError(e.message));
  }, []);

  const statementById = useMemo(() => {
    if (!graph) return new Map();
    return new Map(graph.statements.map((s) => [s.id, s]));
  }, [graph]);

  const edgePairs = graph?.derived?.edge_pairs ?? [];

  const upstreamSet = useMemo(() => {
    if (!graph || !selectedId) return null;
    const ids = graph.derived?.upstream_by_id?.[selectedId] ?? [];
    return new Set([selectedId, ...ids]);
  }, [graph, selectedId]);

  const hasMutual = useMemo(
    () => edgePairs.some((e) => e.mutual),
    [edgePairs],
  );

  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] };

    const initialNodes = graph.statements.map((s) => {
      const inUpstream = upstreamSet ? upstreamSet.has(s.id) : true;
      return {
        id: s.id,
        type: "statement",
        data: {
          ...s,
          _isSelected: s.id === selectedId,
          _inUpstream: inUpstream,
          _hasSelection: !!upstreamSet,
        },
        position: { x: 0, y: 0 },
      };
    });

    const visualEdges = edgePairs.map((e, i) => {
      const sLayer = statementById.get(e.source)?.layer ?? 0;
      const tLayer = statementById.get(e.target)?.layer ?? 0;
      // Visual flow: lower layer on the left. Flip only when data goes
      // high → low (the common case: policy supports its premises).
      const flip = sLayer > tLayer;
      const visualSource = flip ? e.target : e.source;
      const visualTarget = flip ? e.source : e.target;
      const baseStyle = RELATION_STYLES[e.relation] || {
        stroke: "#6b7280",
        strokeWidth: 1.5,
      };
      const inUpstream = upstreamSet
        ? upstreamSet.has(e.source) && upstreamSet.has(e.target)
        : true;
      const opacity = upstreamSet ? (inUpstream ? 1 : 0.15) : 1;
      const marker = {
        type: MarkerType.ArrowClosed,
        color: baseStyle.stroke,
        width: 18,
        height: 18,
      };
      const label = e.mutual ? `${e.relation} ↔` : e.relation;
      return {
        id: `${e.source}->${e.target}-${i}`,
        source: visualSource,
        target: visualTarget,
        _sameBand: sLayer === tLayer,
        type: "smoothstep",
        pathOptions: { offset: 24, borderRadius: 12 },
        label,
        style: { ...baseStyle, opacity },
        markerEnd: marker,
        markerStart: e.mutual ? marker : undefined,
        labelStyle: { fontSize: 10, fill: "#374151", opacity },
        labelBgStyle: { fill: "white", fillOpacity: 0.9 * opacity },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 2,
      };
    });

    const positionedNodes = applyLayout(initialNodes, visualEdges);
    const posById = new Map(
      positionedNodes.map((n) => [n.id, n.position]),
    );

    // Pass 2: assign handles per edge based on resulting layout. Distributes
    // arrowheads across top/mid/bottom of card edges so multiple edges into
    // a busy card don't stack on one point.
    const edgesWithHandles = visualEdges.map((e) => {
      const sPos = posById.get(e.source);
      const tPos = posById.get(e.target);
      if (!sPos || !tPos) return e;
      const sCy = sPos.y + NODE_H / 2;
      const tCy = tPos.y + NODE_H / 2;
      const dy = tCy - sCy;
      let sourceHandle, targetHandle;
      if (e._sameBand) {
        // Same column: route vertically through top/bottom handles.
        if (dy >= 0) {
          sourceHandle = "B-s";
          targetHandle = "T-t";
        } else {
          sourceHandle = "T-s";
          targetHandle = "B-t";
        }
      } else {
        // Cross-band: route through left/right with vertical bias.
        const Y_THRESHOLD = NODE_H * 0.6;
        if (dy > Y_THRESHOLD) {
          sourceHandle = "R-b";
          targetHandle = "L-t";
        } else if (dy < -Y_THRESHOLD) {
          sourceHandle = "R-t";
          targetHandle = "L-b";
        } else {
          sourceHandle = "R-m";
          targetHandle = "L-m";
        }
      }
      const { _sameBand, ...rest } = e;
      return { ...rest, sourceHandle, targetHandle };
    });

    return { nodes: positionedNodes, edges: edgesWithHandles };
  }, [graph, selectedId, upstreamSet, edgePairs, statementById]);

  const selectedStatement = useMemo(() => {
    if (!graph || !selectedId) return null;
    return graph.statements.find((s) => s.id === selectedId) ?? null;
  }, [graph, selectedId]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  if (error) {
    return html`
      <div class="p-6 text-red-700 bg-red-50 h-full">
        <div class="font-semibold mb-2">Failed to load topic.json</div>
        <div class="text-sm">${error}</div>
        <div class="text-sm mt-4 text-gray-700">
          Run
          <code class="bg-gray-100 px-1"
            >uv run python build.py &lt;topic-path&gt; web/topic.json</code
          >
          from the project root, then serve
          <code class="bg-gray-100 px-1">web/</code> via
          <code class="bg-gray-100 px-1">python -m http.server</code>.
        </div>
      </div>
    `;
  }

  if (!graph) {
    return html`<div class="p-6 text-gray-500">Loading...</div>`;
  }

  const meta = graph.metadata || {};
  const totalStatements = graph.statements.length;
  const totalEdges = graph.edges.length;

  return html`
    <${ReactFlow}
      nodes=${nodes}
      edges=${edges}
      nodeTypes=${NODE_TYPES}
      onNodeClick=${onNodeClick}
      onPaneClick=${onPaneClick}
      fitView
      fitViewOptions=${{ padding: 0.1 }}
      proOptions=${{ hideAttribution: true }}
      minZoom=${0.15}
      maxZoom=${2}
    >
      <${Background} />
      <${Controls} />
      <${MiniMap} pannable zoomable />
      <${Panel} position="top-left">
        <div class="bg-white p-3 rounded shadow border border-gray-200 max-w-xs">
          <div class="font-semibold text-base">
            ${meta.title || meta.topic || "Topic"}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            ${totalStatements} statements · ${totalEdges} edges${meta.language
              ? html` · ${meta.language}`
              : null}
          </div>
        </div>
      <//>
      <${Panel} position="bottom-left">
        <${Legend} hasMutual=${hasMutual} />
      <//>
    <//>
    <${SidePanel}
      statement=${selectedStatement}
      edges=${graph.edges}
      statementById=${statementById}
      onSelectId=${setSelectedId}
      onClose=${() => setSelectedId(null)}
    />
  `;
}

const root = createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
