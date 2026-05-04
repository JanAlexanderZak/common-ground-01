import { useEffect, useMemo, useState } from "react";
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

const NODE_W = 280;
const NODE_H = 110;

function StatementNode({ data }) {
  const layerClass = LAYER_CLASSES[data.layer] || "bg-white border-gray-400";
  const layerName = LAYER_NAMES[data.layer] || `L${data.layer}`;
  return html`
    <div
      class="rounded border-2 ${layerClass} shadow-sm p-3"
      style=${{ width: NODE_W }}
    >
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
      ${(data.sources?.length ?? 0) > 0 &&
      data.sources[0].url &&
      html`
        <div class="text-[11px] text-gray-500 mt-1">
          <a
            href=${data.sources[0].url}
            target="_blank"
            rel="noreferrer"
            class="underline hover:text-blue-700"
          >
            ${data.sources[0].label || "source"}
          </a>
        </div>
      `}
    </div>
  `;
}

const NODE_TYPES = { statement: StatementNode };

// dagre with rankdir="TB" places edge sources above edge targets. In our model
// an edge `p1 supports c1` means p1 (policy, L4) is supported by c1 (mechanism,
// L2) — source is the higher-layer policy, target is the lower-layer support.
// "TB" therefore lays the graph out top-down with policies above facts. ✓
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

function App() {
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(null);

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
      data: s,
      position: { x: 0, y: 0 },
    }));

    const initialEdges = graph.edges.map((e, i) => ({
      id: `e${i}`,
      source: e.source,
      target: e.target,
      label: e.relation,
      style: RELATION_STYLES[e.relation] || { stroke: "#6b7280", strokeWidth: 1.5 },
      labelStyle: { fontSize: 10, fill: "#374151" },
      labelBgStyle: { fill: "white", fillOpacity: 0.9 },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
    }));

    return { nodes: applyLayout(initialNodes, initialEdges), edges: initialEdges };
  }, [graph]);

  if (error) {
    return html`
      <div class="p-6 text-red-700 bg-red-50 h-full">
        <div class="font-semibold mb-2">Failed to load topic.json</div>
        <div class="text-sm">${error}</div>
        <div class="text-sm mt-4 text-gray-700">
          Run
          <code class="bg-gray-100 px-1">uv run python build.py &lt;topic-path&gt; > web/topic.json</code>
          from the project root, then serve <code class="bg-gray-100 px-1">web/</code>
          via <code class="bg-gray-100 px-1">python -m http.server</code>.
        </div>
      </div>
    `;
  }

  if (!graph) {
    return html`<div class="p-6 text-gray-500">Loading...</div>`;
  }

  const meta = graph.metadata || {};
  return html`
    <${ReactFlow}
      nodes=${nodes}
      edges=${edges}
      nodeTypes=${NODE_TYPES}
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
            ${graph.statements.length} statements · ${graph.edges.length} edges
            ${meta.language && ` · ${meta.language}`}
          </div>
        </div>
      <//>
    <//>
  `;
}

const root = createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
