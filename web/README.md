# Web renderer

Static single-page renderer for `topic.json` (the output of `build.py`). Loads React + React Flow + dagre + Tailwind from CDNs — no bundler, no `npm install`.

## Run locally

From the **project root**:

```bash
# 1. Generate a topic.json from one of the example topics.
uv run python build.py examples/full > web/topic.json

# 2. Serve web/ over HTTP. (Opening index.html via file:// won't work because
#    the page fetches topic.json, and browsers block fetch() over file://.)
python -m http.server 8000 --directory web
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

## Limitations (Phase A)

- **Tailwind play CDN is not for production.** Fine for a demo/tester round; for deployment, swap to a real Tailwind build step.
- **No data-trace sparklines yet.** Statements with `data_refs` show the label but don't fetch and render the underlying CSV. Coming in a follow-up.
- **No statement-detail panel.** Clicking a node doesn't open a side panel yet — the in-node summary is what you get.
- **No "trace down" UX yet.** That's Wks 10–11 work.
