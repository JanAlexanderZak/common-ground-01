# Web renderer

Static single-page renderer for `topic.json` (the output of `build.py`). Loads React + React Flow + dagre + Tailwind from CDNs — no bundler, no `npm install`.

## Run locally

From the **project root**:

```bash
# 1. Generate a topic.json from one of the example topics or a real topic.
#    Pass the output path as a 2nd argument (don't use shell redirection —
#    PowerShell's `>` re-encodes to UTF-16-LE-with-BOM and breaks JSON.parse).
uv run python build.py src/topics/schuldenbremse src/web/topic.json

# 2. Serve src/web/ over HTTP. (Opening index.html via file:// won't work because
#    the page fetches topic.json, and browsers block fetch() over file://.)
python -m http.server 8000 --directory src/web
```

Then open <http://localhost:8000>.

## Layer-color legend

| Layer | Meaning | Visual |
|---|---|---|
| L0 | Empirical fact | grey |
| L1 | Stylized fact | blue |
| L2 | Causal mechanism | orange |
| L3 | Value claim | purple |
| L4 | Policy position | red |

Edges:

| Relation | Style |
|---|---|
| `supports` | solid green |
| `attacks` / `attacked-by` | dashed red |
| `evidence` | solid blue |
| `qualifies` | dotted purple |
| (other) | grey |

Layout is computed by [dagre](https://github.com/dagrejs/dagre) with `rankdir: TB` — edge sources (typically higher-layer claims) above edge targets (their supports).

## Files

- `index.html` — minimal HTML shell with an import map pointing at [esm.sh](https://esm.sh/) for React, `@xyflow/react`, `@dagrejs/dagre`, and `htm/react`. Tailwind via the play CDN.
- `main.js` — single ES module: fetches `./topic.json`, builds React Flow nodes/edges, runs dagre layout, renders with a custom `StatementNode` per layer.
- `topic.json` — generated build artifact (gitignored). Run `build.py` to produce.

## Interactions

- **Click a node** — opens a side panel with the full statement, sources (with retrieval/source-type metadata), endorsing/disputing actors, data refs, and stance buttons.
- **Stance buttons** in the side panel — agree / disagree / uncertain. Saved per-topic to localStorage (`cg-stances:<topic>`); a small icon appears on the node afterwards.
- **Filter toggles** (top-right) — `All` / `L0–L2 only` (factual sub-graph) / `My disagreements` (only the nodes you've marked disagree).
- **Trace down** (button at the bottom of the side panel) — fades all nodes outside the selected statement's reachable subgraph, so you can see *what an L4 policy actually depends on* at L2/L1/L0. Click another node to switch focus, click empty space to exit.

## Limitations (Phase A)

- **Tailwind play CDN is not for production.** Fine for a demo/tester round; for deployment, swap to a real Tailwind build step.
- **No data-trace sparklines yet.** Statements with `data_refs` show the label and description in the side panel but don't yet fetch and plot the underlying CSV.
- **No URL-state sync.** Selected statement and filter mode aren't reflected in the URL, so you can't share a deep link to a specific view.
