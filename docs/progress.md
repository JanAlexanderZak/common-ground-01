# Implementation Progress

**Plan:** [implementation_plan.md](implementation_plan.md)
**Phase:** A — Pre-funding (May → Sep 2026)
**Application target:** Prototype Fund Class 03, 01.10.–30.11.2026
**Started:** 2026-05-04

---

## Current status

**Phase A weeks 1–9: code + content complete (DRAFT, pending review).** 18 tests green; ruff + ty clean. End-to-end pipeline produces a 30-statement, 43-edge Schuldenbremse argument graph from `topics/schuldenbremse/` with zero unresolved cross-file references.

| Component | Status |
|---|---|
| Toolchain (`src/common_ground/`, `build.py`) | ✅ |
| Format spec + JSON schema (`format/`) | ✅ |
| Web renderer (`web/`) | ✅ code; visual verification still on user |
| Schuldenbremse content (`topics/schuldenbremse/`) | ✅ DRAFT; 30 statements across L0–L4, 43 edges, 3 CSV data refs, 20 sourced statements |
| Central actors registry (`actors/`) | ✅ DRAFT; 15 actors (institutions, parties, AI agent example) |

**Still open (user-driven, not blocking code):**

- **OSS license** — LICENSE file decision (AGPL-3.0 recommended).
- **Visual verification** of the renderer in a browser (see Wks 3–5 instructions).
- **Editorial review** of Schuldenbremse content by a political-science contact — every L0/L1 number, source URL, and party position should be cross-checked. The 30 nodes include `[DRAFT — verify]` markers on uncertain sources (mostly the L2 mechanism citations, which point at journal landing pages rather than specific articles).
- **Data verification** against Destatis / Bundesbank — `data/README.md` lists what to check.

**Next: Wks 10–11 — trace-down UX + stance overlay** in the renderer. localStorage stance per statement (agree/disagree/uncertain), filter toggles (L0–L2 only / show all), and the "trace down" interaction: click a contested L4 policy and see which L1/L2/L3 nodes drive your disagreement.

---

## Phase A milestones

### Wks 1–2 — Format spec v0.1 + parser library ✅ Complete
- [x] `pyproject.toml` — src layout, pytest dev dep, hatchling build backend
- [x] `README.md` — quickstart, format example, Python API, format conventions, gotchas, data model
- [ ] `LICENSE` — **still pending OSS-license decision** (AGPL-3.0 recommended)
- [x] `src/common_ground/__init__.py` — public API surface
- [x] `src/common_ground/parser.py` — `parse_string` walks marko AST (H2 layers, H3 statements, list-item edges, Quote metadata blocks); `parse_dir` reads `topic.md` frontmatter + H1 title, then walks `<topic>/statements/*.md` and merges
- [x] `src/common_ground/model.py` — `Statement`, `Edge`, `Source`, `DataRef`, `TopicMetadata`, `TypedGraph`
- [x] `src/common_ground/serialize.py` — `to_json(graph)` via `dataclasses.asdict` + `json.dumps`
- [x] `tests/` — 18 tests across `test_parser.py`, `test_examples.py`, `test_serialize.py`
- [x] [`format/spec.md`](../format/spec.md) — v0.1 specification distilled from working parser
- [x] [`format/schema.json`](../format/schema.json) — JSON Schema (draft 2020-12) for the `to_json` output
- [x] `examples/{minimal,edges,full}/` — three reference topics, conformance-tested
- [x] `build.py` — CLI shim: `uv run python build.py <topic-path>` → JSON to stdout
- [~] `src/common_ground/validator/` — deferred to a later iteration (no current consumer needs it; format/schema.json + tests cover most of the same ground)

### Wks 3–5 — Static-HTML web renderer
- [x] [`web/index.html`](../web/index.html) — import map for React/React Flow/dagre via esm.sh; Tailwind via play CDN
- [x] [`web/main.js`](../web/main.js) — fetches `topic.json`; React Flow with custom `StatementNode` per layer; dagre auto-layout (rankdir TB)
- [x] L0–L4 visual styling (slate/blue/orange/purple/red); relation-specific edge styles (`supports`/`attacks`/`evidence`/`qualifies`)
- [ ] Inline sparkline for `Data:` references — deferred; node currently shows the data_ref label only. Needs CSV fetch + SVG path generation.
- [x] Auto-layout via dagre
- [x] [`web/README.md`](../web/README.md) — local dev instructions, layer legend, known limitations
- [ ] Visual verification in browser — **user-driven** (no browser harness here)

### Wks 6–9 — Schuldenbremse content + actor registry
- [x] [`actors/`](../actors/) populated with **15 actors** (institutions: Bundestag, Bundesregierung, Destatis, Bundesbank, ifo-Institut, DIW Berlin, Sachverständigenrat, KfW, Bundesverfassungsgericht; parties: CDU, SPD, Grüne, FDP, Linke; AI: Claude). Exceeded the original ~5 to support fuller political attribution.
- [x] [`actors/README.md`](../actors/README.md) — registry overview + contribution policy
- [~] `actors/schema.md` — covered by [`format/spec.md`](../format/spec.md) §7.2; no separate doc needed
- [x] [`topics/schuldenbremse/topic.md`](../topics/schuldenbremse/topic.md) — frontmatter (de, AGPL-pending), DRAFT-marked
- [x] **30 statement nodes** across L0–L4 (5 legal, 7 empirical, 8 mechanisms, 4 values, 6 policies); 43 edges; zero unresolved cross-file references
- [x] All L0/L1 statements sourced — 20 of 30 statements have sources (all 12 L0/L1 plus 8 of the L2 mechanisms)
- [x] **3 data traces** (`debt-to-gdp.csv`, `bip-wachstum.csv`, `inflation-hvpi.csv`) committed; values are draft, source-verified by spot check, **must be re-verified** before public release
- [x] [`topics/schuldenbremse/data/README.md`](../topics/schuldenbremse/data/README.md) — DRAFT markers + verification sources for each CSV
- [~] `topics/schuldenbremse/sources/citations.md` — citations are inline in statement metadata blocks; no separate file needed (the format spec example showed this as one possible layout but not required)
- [ ] **Political-science contact reviews** — user task (see [docs/implementation_plan.md §10](implementation_plan.md) decision #5: ≥2 named editorial-board contacts by Sep 2026)

### Wks 10–11 — Trace-down UX + stance overlay
- [ ] localStorage stance per statement
- [ ] Filter toggles (L0–L2 only / show all)
- [ ] Trace-down from L4 → driver L1/L2/L3

### Wk 12 — Static deployment
- [ ] `.github/workflows/build.yml` — GitHub Actions
- [ ] Deploy to Cloudflare Pages or Netlify
- [ ] HTTPS, OG tags
- [ ] Plausible Analytics

### Wk 13 — Tester round
- [ ] 10–20 testers across political spectrum
- [ ] Layer-location task: ≥70% can identify a layer
- [ ] Data-trust task: ≥60% report data traces help

### Wks 14–18 — Application prep
- [ ] 3 × 2,000-char DE summaries (V07–V08)
- [ ] Vorhabenbeschreibung (12-point)
- [ ] Editorial board confirmed in writing (≥2 contacts)
- [ ] OSS license applied to repo
- [ ] 5% own contribution evidenced
- [ ] DebateLab/KIT outreach sent (target: Jul 2026)
- [ ] AI-research outreach sent (target: Aug 2026)
- [ ] Freiberufler status confirmed
- [ ] Submit application Oct/Nov 2026

---

## Open decisions

(from plan §10; tick as resolved)

- [ ] OSS license (AGPL recommended) — week 1
- [x] Markdown parser library — **marko** (locked in 2026-05-04)
- [x] Chart library — **none** (locked in 2026-05-04). Phase A v1 renders no inline charts; sparklines for data refs are a follow-up. When added, custom inline SVG (no library) is the default; introduce a real chart library only if/when richer interactions are needed.
- [ ] Hosting target (Cloudflare Pages recommended) — week 12
- [ ] Editorial board contacts (≥2 by Sep 2026)
- [ ] DebateLab/KIT outreach (by Jul 2026)
- [ ] Freiberufler status (start now)
- [ ] AI-research outreach (by Aug 2026)
- [ ] Phase B WP7 LLM-assisted authoring commitment (decide Mar 2027)

---

## Implementation log

Most recent first.

| Date | Block | Notes |
|---|---|---|
| 2026-05-04 | **Wks 6–9 Schuldenbremse content** | Dispatched 6 parallel general-purpose subagents per the user's request: 5 statement-file authors (one per layer-file) + 1 actor-registry author. Each agent received the full master ID list, actor list, format-spec pointer, and a per-file assignment with statement intents. Result: **30 statements, 43 edges, 0 unresolved cross-file references** in `topics/schuldenbremse/`, plus 15 actors in `actors/`. Verifying agents found and corrected drafted figures (Schuldenquote 2023 is 63.7% by Maastricht definition, not the 62.4% I had as placeholder; KfW Kommunalpanel reports 186 bn EUR investment backlog, not 166). Three CSV data traces (`debt-to-gdp.csv`, `bip-wachstum.csv`, `inflation-hvpi.csv`) committed with DRAFT markers. Also fixed a Windows-specific bug in `build.py`: `sys.stdout.reconfigure(encoding="utf-8")` is now needed so German content + em-dashes survive shell redirection on Windows (default cp1252 corrupts UTF-8 multibyte sequences). All work is DRAFT — content needs editorial review by a political-science contact before public release. 18 tests green; ruff + ty clean. |
| 2026-05-04 | **Wks 3–5 web renderer** | Static SPA in [`web/`](../web/): `index.html` with an importmap pointing at esm.sh for React 18, `@xyflow/react` 12, `@dagrejs/dagre` 1, and `htm/react` (JSX-equivalent for a no-build setup); Tailwind via the play CDN. `main.js` fetches `./topic.json`, builds React Flow nodes/edges, runs dagre with `rankdir: "TB"` for top-down layout (policies above their supporting facts), and renders a custom `StatementNode` per layer with distinct colors (slate/blue/orange/purple/red). Edge styles per relation: solid green for `supports`, dashed red for `attacks`/`attacked-by`, solid blue for `evidence`, dotted purple for `qualifies`. End-to-end pipeline verified: `build.py examples/full > web/topic.json` produces a 1.3 KB JSON the renderer is wired to consume. **Visual verification is on the user** (no browser harness in this loop). Sparklines and the click-for-details panel deferred to follow-up iterations. |
| 2026-05-04 | **Wks 1–2 wrap-up** | Wrote [`format/spec.md`](../format/spec.md) v0.1 distilling the working parser's behavior — directory layout, conventions for headings/edges/metadata blocks, citation/actor/data sub-formats, the lazy-continuation gotcha, and known limitations. Wrote [`format/schema.json`](../format/schema.json) — JSON Schema (draft 2020-12) describing the `to_json` output for downstream consumers. The `validator/` and `serializer/` subpackages originally scoped for Wks 1–2 are deferred: there's no current consumer for richer validation, and `serialize.py` covers the serialization need. 18 tests green; ruff + ty clean. **Phase A weeks 1–2 complete.** |
| 2026-05-04 | build.py + serializer | Added `src/common_ground/serialize.py` with `to_json(graph, *, indent=2)` — uses `dataclasses.asdict` + `json.dumps(ensure_ascii=False)` so unicode (em-dashes, German umlauts) survives round-trip. `build.py` at project root is the 15-line CLI shim: takes a topic path, prints JSON to stdout. `uv run python build.py examples/full > full.json` works end-to-end. 18 tests green. The toolchain is now complete from `.md` files → JSON for any consumer (notably the web renderer that's coming next). |
| 2026-05-04 | topic.md frontmatter | Added `TopicMetadata(topic, title, language, version, contributors, license, actors_registry)` model + `metadata` field on `TypedGraph` (default-factory empty, never None). PyYAML added as runtime dep. `parse_dir` now reads `<topic>/topic.md` if present: splits YAML frontmatter (between `---` delimiters) from body, then extracts the body's first H1 as `title`. Each example topic gained a `topic.md`. The `full` example's deep test now also asserts on metadata fields. 16 tests green. |
| 2026-05-04 | Examples + README | Added `examples/{minimal,edges,full}/` topic dirs as both tutorial material and conformance fixtures. Parameterized `tests/test_examples.py` parses each + asserts on `(statements, edges)` counts; `test_full_example_exercises_every_primitive` deep-checks the full topic for sources, actor refs, data refs. 13 tests green. README expanded with format example, Python API, format conventions, and a documented gotcha: a sub-list inside a blockquote must be separated from the next field paragraph by a blank `>` line — otherwise CommonMark applies lazy continuation and the next line gets glommed into the last list item. The full-example fixture hit this on first parse; documented and worked around (not a parser bug, an authoring convention). |
| 2026-05-04 | parse_dir multi-file | Added `parse_dir(topic_path: str | Path) -> TypedGraph`: walks `<topic>/statements/*.md` in alphabetical order, parses each via `parse_string`, merges statements + edges into one graph. Files are independent — H2/H3/Quote state machine resets at each file boundary, which is the right semantic (each file should be self-contained). Missing `statements/` directory returns empty graph (graceful, no error). Sort order via filename means convention `01-facts.md`, `02-mechanisms.md` etc. provides authoring control. Three new tests: happy multi-file merge; missing-dir tolerance; cross-file edges. 9 tests green. |
| 2026-05-04 | Data references | Added `DataRef(path, label, description)` model + `data_refs` field on `Statement`. Dispatcher extended for `**Data:**` label: extracts the first `Link`'s `dest` as the path and its inline text as the label (works for `[`debt-to-gdp.csv`](path)` with code-span content because `_inline_text` recursively flattens). Text after the link becomes `description`. Added per-file ruff ignore for RUF001/2/3 in `tests/*` so en/em-dashes in markdown fixtures don't get flagged. 6 tests green; ruff + ty clean. All Phase A format primitives now parse end-to-end. |
| 2026-05-04 | Actors + tooling | Added `endorsed_by` / `disputed_by` fields to `Statement`. Extended metadata-block dispatcher to recognize `**Endorsed by:**` / `**Disputed by:**` and extract `@actor-id` references via regex `@([\w-]+)` (Unicode-aware — handles `@grüne-2025`). Required a refinement: a single CommonMark paragraph in a blockquote can contain *multiple* `**Key:**` fields separated only by line breaks; added `_split_paragraph_fields` to split inlines at each `StrongEmphasis`. The trailing sub-list belongs to the last field. Verified ruff + ty pass on all source files (added to dev workflow per README). 5 tests green. |
| 2026-05-04 | Citations working | Added `Source(url, label, retrieved, source_type, jurisdiction)` model + `sources: list[Source]` field on `Statement`. Parser now walks `Quote` nodes that follow an H3 statement as "metadata blocks": each `**Key:**` paragraph is dispatched to a field handler; trailing list items provide structured sub-fields. Sub-field keys are normalized via kebab-case → snake_case (`source-type` → `source_type`). 4 tests green. |
| 2026-05-04 | Edges working | Added `Edge(source, target, relation)` to the model. Parser now walks `MarkoList` nodes that follow an H3 statement and parses each list item: bold-prefix is the relation label (e.g. `**supports:**`), comma-separated rest is the target IDs. Relations are preserved verbatim from markdown (`supports`, `attacked-by`, `evidence`) — canonicalization is a downstream concern, not a parsing one. 3 tests green: minimal L0; multi-layer; edges. |
| 2026-05-04 | First test green | Locked in **marko** as the Markdown parser. Implemented `parse_string` with a minimal AST walker: H2 → current layer (regex `L(\d+)`), H3 → `Statement(id, layer, text)` (regex `^([\w-]+):\s+(.+)$`). `_inline_text` recursively extracts plain text from inline children. `test_parse_minimal_l0_statement` passes. |
| 2026-05-04 | Wks 1–2 kickoff | `pyproject.toml` updated with src layout + hatchling backend + pytest dev group. Created `src/common_ground/{__init__,model,parser}.py` skeleton: `Statement` and `TypedGraph` minimal dataclasses; `parse_string` stub raises `NotImplementedError`. First test `test_parse_minimal_l0_statement` written and confirmed failing for the right reason (NotImplementedError, not ImportError). README updated to point at `docs/`. |
| 2026-05-04 | Plan finalized + saved to `docs/` | Vision 1 design approved; pivot from civic-tech website to software-infrastructure framing; centralized actors registry; Markdown-based format; CLI dropped from funded scope; static web renderer for Phase A. Old `implementation_plan.md` at project root removed; `docs/implementation_plan.md` is canonical. |

---

## Deviations from plan

Record here when actual work diverges from the plan, and why.

- **`src/common_ground/validator/` deferred from Wks 1–2.** The plan listed a separate validator subpackage for reference resolution and schema checks. In practice, the parser does its own light reference resolution inline, and [`format/schema.json`](../format/schema.json) covers structural validation for downstream consumers. A dedicated validator module makes sense once we add (a) actor resolution against `actors/*.md`, (b) edge-target validation, or (c) data-path existence checks — all of which are post-Wks-1–2 work. No work is currently blocked by this deferral.
- **`src/common_ground/serializer/` reduced to a single `serialize.py` module.** The plan's directory-shape implied a multi-file subpackage; the actual surface is one function (`to_json`) with no obvious decomposition. Promoted to a directory if/when a second serialization target (Argdown export, GraphML, etc.) lands.
