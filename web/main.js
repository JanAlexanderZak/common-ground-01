import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
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

const STANCE_ICONS = {
  agree: { symbol: "✓", color: "bg-green-600" },
  disagree: { symbol: "✗", color: "bg-red-600" },
  uncertain: { symbol: "?", color: "bg-yellow-500" },
};

const NODE_W = 280;
const NODE_H = 110;

// =====================================================
// Custom node renderer
// =====================================================

function StatementNode({ data }) {
  const layerClass = LAYER_CLASSES[data.layer] || "bg-white border-gray-400";
  const layerName = LAYER_NAMES[data.layer] || `L${data.layer}`;
  const stance = data._stance;
  const isFaded = data._isFaded;
  const isSelected = data._isSelected;

  const fadeClass = isFaded ? "opacity-25" : "";
  const selectedClass = isSelected
    ? "ring-2 ring-blue-500 ring-offset-1"
    : "";

  return html`
    <div
      class="rounded border-2 ${layerClass} shadow-sm p-3 transition-opacity ${fadeClass} ${selectedClass} relative"
      style=${{ width: NODE_W }}
    >
      ${stance &&
      html`
        <div
          class="absolute -top-2 -right-2 w-6 h-6 rounded-full ${STANCE_ICONS[stance].color} text-white text-xs flex items-center justify-center font-bold shadow"
        >
          ${STANCE_ICONS[stance].symbol}
        </div>
      `}
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
// Layout + reachability
// =====================================================

// dagre with rankdir="TB": edge sources are placed above edge targets, so
// a `p1 supports c1` edge stacks p1 (L4) above c1 (L2).
function applyLayout(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", ranksep: 90, nodesep: 40 });
  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_W, height: NODE_H });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }
  dagre.layout(g);
  return nodes.map((node) => {
    const dn = g.node(node.id);
    return {
      ...node,
      position: { x: dn.x - dn.width / 2, y: dn.y - dn.height / 2 },
    };
  });
}

// Statements reachable from `startId` by following outgoing edges (BFS).
// Used by trace-down: from a focused L4 statement, walk down through
// supports/evidence/qualifies to all the L2/L1/L0 nodes it depends on.
function reachableFrom(startId, edges) {
  const reached = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const current = queue.shift();
    for (const e of edges) {
      if (e.source === current && !reached.has(e.target)) {
        reached.add(e.target);
        queue.push(e.target);
      }
    }
  }
  return reached;
}

// =====================================================
// Stance state, persisted to localStorage per topic
// =====================================================

function useStances(topicId) {
  const storageKey = `cg-stances:${topicId || "default"}`;
  const [stances, setStances] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const setStance = useCallback(
    (statementId, stance) => {
      setStances((prev) => {
        const next = { ...prev };
        if (stance === null) delete next[statementId];
        else next[statementId] = stance;
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Private mode / quota: silently degrade to in-memory.
        }
        return next;
      });
    },
    [storageKey],
  );

  return [stances, setStance];
}

// =====================================================
// Side panel: full statement view + stance + trace-down
// =====================================================

function SidePanel({
  statement,
  stance,
  onSetStance,
  onToggleTrace,
  traceMode,
  onClose,
}) {
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

        <div class="mt-6 pt-4 border-t">
          <div class="text-xs font-semibold uppercase text-gray-500 mb-2">
            Your stance
          </div>
          <div class="flex gap-2 flex-wrap">
            ${["agree", "disagree", "uncertain"].map(
              (s) => html`
                <button
                  key=${s}
                  onClick=${() => onSetStance(stance === s ? null : s)}
                  class=${`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    stance === s
                      ? `${STANCE_ICONS[s].color} text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ${STANCE_ICONS[s].symbol} ${s}
                </button>
              `,
            )}
          </div>
        </div>

        <div class="mt-4">
          <button
            onClick=${onToggleTrace}
            class=${`w-full py-2 rounded text-sm font-medium transition-colors ${
              traceMode
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            ${traceMode
              ? "Tracing — click to stop"
              : "🔍 Trace down — show what this depends on"}
          </button>
        </div>

        <div class="mt-4 text-xs text-gray-500">
          Tip: click another node to switch focus. Click empty space to clear.
        </div>
      </div>
    </div>
  `;
}

// =====================================================
// Filter buttons + legend
// =====================================================

function FilterButtons({ filterMode, onFilterChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "factual", label: "L0–L2 only" },
    { id: "disagreements", label: "My disagreements" },
  ];
  return html`
    <div class="bg-white p-2 rounded shadow border border-gray-200 flex gap-1">
      ${filters.map(
        (f) => html`
          <button
            key=${f.id}
            onClick=${() => onFilterChange(f.id)}
            class=${`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterMode === f.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ${f.label}
          </button>
        `,
      )}
    </div>
  `;
}

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
  const [traceMode, setTraceMode] = useState(false);
  const [filterMode, setFilterMode] = useState("all");

  useEffect(() => {
    fetch("./topic.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching topic.json`);
        return r.json();
      })
      .then(setGraph)
      .catch((e) => setError(e.message));
  }, []);

  const topicId = graph?.metadata?.topic ?? null;
  const [stances, setStance] = useStances(topicId);

  // Filter visible statements based on filterMode + stances.
  const visibleStatementIds = useMemo(() => {
    if (!graph) return new Set();
    let filtered;
    switch (filterMode) {
      case "factual":
        filtered = graph.statements.filter((s) => s.layer <= 2);
        break;
      case "disagreements":
        filtered = graph.statements.filter(
          (s) => stances[s.id] === "disagree",
        );
        break;
      default:
        filtered = graph.statements;
    }
    return new Set(filtered.map((s) => s.id));
  }, [graph, filterMode, stances]);

  // When trace-down is active, compute the reachable subgraph from the
  // currently-selected statement.
  const reachableSet = useMemo(() => {
    if (!graph || !traceMode || !selectedId) return null;
    return reachableFrom(selectedId, graph.edges);
  }, [graph, traceMode, selectedId]);

  // Compose React Flow nodes/edges with all visual state baked in.
  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [], edges: [] };

    const visibleStatements = graph.statements.filter((s) =>
      visibleStatementIds.has(s.id),
    );
    const visibleEdges = graph.edges.filter(
      (e) =>
        visibleStatementIds.has(e.source) && visibleStatementIds.has(e.target),
    );

    const initialNodes = visibleStatements.map((s) => ({
      id: s.id,
      type: "statement",
      data: {
        ...s,
        _stance: stances[s.id],
        _isSelected: s.id === selectedId,
        _isFaded: reachableSet ? !reachableSet.has(s.id) : false,
      },
      position: { x: 0, y: 0 },
    }));

    const initialEdges = visibleEdges.map((e, i) => {
      const isFaded = reachableSet
        ? !(reachableSet.has(e.source) && reachableSet.has(e.target))
        : false;
      const baseStyle = RELATION_STYLES[e.relation] || {
        stroke: "#6b7280",
        strokeWidth: 1.5,
      };
      return {
        id: `e${i}`,
        source: e.source,
        target: e.target,
        label: e.relation,
        style: { ...baseStyle, opacity: isFaded ? 0.2 : 1 },
        labelStyle: { fontSize: 10, fill: "#374151", opacity: isFaded ? 0.3 : 1 },
        labelBgStyle: { fill: "white", fillOpacity: isFaded ? 0.3 : 0.9 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 2,
      };
    });

    return {
      nodes: applyLayout(initialNodes, initialEdges),
      edges: initialEdges,
    };
  }, [graph, visibleStatementIds, stances, selectedId, reachableSet]);

  const selectedStatement = useMemo(() => {
    if (!graph || !selectedId) return null;
    return graph.statements.find((s) => s.id === selectedId) ?? null;
  }, [graph, selectedId]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedId(null);
    setTraceMode(false);
  }, []);

  if (error) {
    return html`
      <div class="p-6 text-red-700 bg-red-50 h-full">
        <div class="font-semibold mb-2">Failed to load topic.json</div>
        <div class="text-sm">${error}</div>
        <div class="text-sm mt-4 text-gray-700">
          Run
          <code class="bg-gray-100 px-1"
            >uv run python build.py &lt;topic-path&gt; > web/topic.json</code
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
  const visibleCount = visibleStatementIds.size;
  const stanceCount = Object.keys(stances).length;

  return html`
    <${ReactFlow}
      nodes=${nodes}
      edges=${edges}
      nodeTypes=${NODE_TYPES}
      onNodeClick=${onNodeClick}
      onPaneClick=${onPaneClick}
      fitView
      proOptions=${{ hideAttribution: true }}
      minZoom=${0.2}
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
            ${visibleCount === totalStatements
              ? html`${totalStatements} statements · ${totalEdges} edges`
              : html`${visibleCount} of ${totalStatements} statements visible`}
            ${meta.language ? html` · ${meta.language}` : null}
          </div>
          ${stanceCount > 0 &&
          html`
            <div class="text-xs text-gray-500 mt-0.5">
              ${stanceCount} of ${totalStatements} stances marked
            </div>
          `}
        </div>
      <//>
      <${Panel} position="top-right">
        <${FilterButtons}
          filterMode=${filterMode}
          onFilterChange=${setFilterMode}
        />
      <//>
      <${Panel} position="bottom-left">
        <${Legend} />
      <//>
    <//>
    <${SidePanel}
      statement=${selectedStatement}
      stance=${selectedId ? stances[selectedId] : undefined}
      onSetStance=${(s) => selectedId && setStance(selectedId, s)}
      onToggleTrace=${() => setTraceMode((m) => !m)}
      traceMode=${traceMode}
      onClose=${() => {
        setSelectedId(null);
        setTraceMode(false);
      }}
    />
  `;
}

const root = createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
