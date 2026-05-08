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
  0: "bg-slate-50 border-slate-400 text-slate-900",
  1: "bg-blue-50 border-blue-400 text-blue-900",
  2: "bg-orange-50 border-orange-400 text-orange-900",
  3: "bg-purple-50 border-purple-400 text-purple-900",
  4: "bg-red-50 border-red-400 text-red-900",
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
const COL_GAP = 40;
const ROW_GAP = 24;
const COL_X = {
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
  const selectedClass = isSelected
    ? "ring-2 ring-blue-500 ring-offset-1"
    : "";

  return html`
    <div
      class="rounded border-2 ${layerClass} shadow-sm p-3 ${selectedClass} relative"
      style=${{ width: NODE_W }}
    >
      <${Handle}
        type="target"
        position=${Position.Left}
        style=${{ opacity: 0, background: "transparent", border: "none" }}
      />
      <${Handle}
        type="source"
        position=${Position.Right}
        style=${{ opacity: 0, background: "transparent", border: "none" }}
      />
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
// Layout: layer-as-column pyramid (L0 left → L4 right)
// =====================================================

// Each layer becomes a vertical column. X is fixed by layer; Y is computed
// per column with a barycentric pass to reduce edge crossings: nodes in
// column N are sorted by the average Y of their neighbors in column N-1.
// `edges` here are the renderer-flipped edges (source = visual-left node,
// target = visual-right node), so each node's left-neighbors are the
// sources of incoming edges.
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
      const y = startY + i * stride;
      yCenterById.set(n.id, y + NODE_H / 2);
      positioned.push({
        ...n,
        position: { x: COL_X[layer], y },
      });
    });
  }

  return positioned;
}

// =====================================================
// Side panel: full statement view (read-only)
// =====================================================

function SidePanel({ statement, onClose }) {
  if (!statement) return null;
  const layerName = LAYER_NAMES[statement.layer] || `L${statement.layer}`;

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
      </div>
    </div>
  `;
}

// =====================================================
// Legend
// =====================================================

function Legend() {
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

  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] };

    const initialNodes = graph.statements.map((s) => ({
      id: s.id,
      type: "statement",
      data: {
        ...s,
        _isSelected: s.id === selectedId,
      },
      position: { x: 0, y: 0 },
    }));

    // Flip edge direction so arrows point left → right (premise → conclusion).
    // The data still says "policy supports its premises" — only the visual
    // is reversed.
    const initialEdges = graph.edges.map((e, i) => {
      const baseStyle = RELATION_STYLES[e.relation] || {
        stroke: "#6b7280",
        strokeWidth: 1.5,
      };
      return {
        id: `${e.source}->${e.target}-${i}`,
        source: e.target,
        target: e.source,
        type: "smoothstep",
        label: e.relation,
        style: baseStyle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: baseStyle.stroke,
          width: 16,
          height: 16,
        },
        labelStyle: { fontSize: 10, fill: "#374151" },
        labelBgStyle: { fill: "white", fillOpacity: 0.9 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 2,
      };
    });

    return {
      nodes: applyLayout(initialNodes, initialEdges),
      edges: initialEdges,
    };
  }, [graph, selectedId]);

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
        <${Legend} />
      <//>
    <//>
    <${SidePanel}
      statement=${selectedStatement}
      onClose=${() => setSelectedId(null)}
    />
  `;
}

const root = createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
