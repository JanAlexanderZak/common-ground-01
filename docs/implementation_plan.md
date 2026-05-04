# common_ground — Product Design

**Project name:** `common_ground`.
**Replaces:** the original Schuldenbremse-website-first approach (previous root-level `implementation_plan.md`, since removed).
**Funding target:** Prototype Fund Class 03, application 01.10.–30.11.2026, project start 01.06.2027 — *as a Software Infrastructure submission*.
**Design date:** 2026-05-04.
**Progress tracker:** [progress.md](progress.md).

---

## 1. Context — why this pivot

The original plan proposed a Django-based political-argument-graph website with the Schuldenbremse as the seed topic. Three findings drove a reshape:

1. **The Prototype Fund discontinued Civic Tech as a funding pillar in 2025.** Current pillars are Data Security and Software Infrastructure. A standalone deliberation platform fits neither — it is the textbook anti-pattern in the Fund's official guidance ("a single-use app … is not really software infrastructure").
2. **The project's locus of innovation is the layered argument representation (L0–L4 + provenance + actor attribution + grounded data) and the "trace-down" UX**, not the website. The website is one renderer of that representation. Argdown (DebateLab/KIT) provides similar primitives but is single-file, untyped, authoring-focused, and lacks first-class institutional attribution and dataset references.
3. **AI agents are about to become deliberation participants.** Within the funded period, AI systems will routinely draft position papers, fact-check claims, and debate proposals. They need a structured, machine-readable representation — actor attribution, versioned data citations, layered argument structure — that prose-based deliberation platforms don't provide. A Markdown convention for typed, evidence-grounded argumentation, where actors can be human institutions *or* AI systems (`@destatis`, `@bundesregierung`, `@claude`), becomes a protocol for human–AI mixed deliberation. This is the forward-looking Software Infrastructure framing.

The pivot: ship the **representation layer + Python library + reference renderer + central actor registry** as the funded infrastructure. The political-deliberation website becomes the *reference deployment*. Adopter use cases beyond political deliberation: academic argumentation, classroom debate, scientific controversy mapping, journalism, and structured AI-agent reasoning.

**Format decision:** valid Markdown with structural conventions; files end in `.md`; parser walks a Markdown AST; no new file extension; no custom DSL. Argdown is supported as an import/export target.

**Tooling decision:** no CLI in the funded period. The deliverable is a Python library (`common_ground`) + an embeddable web component (`common-ground-web`). Build-time JSON generation is a 20-line script. CLI deferred to post-funding if external demand materializes.

**Hosting decision:** GitHub for everything user-facing. Topic content lives in GitHub repos; PRs are the contribution mechanism; Issues threaded under stable statement URLs are the discussion mechanism; GitHub Actions builds and deploys the static renderer. No homegrown contribution platform.

---

## 2. Goal

A FOSS toolchain that lets communities and AI agents author, version, and visualize layered argument graphs grounded in versioned data and attributed to named actors. Concrete outputs:

- A **Markdown-conventions specification** for typed, multi-file argument graphs (layers, citations, actors, data references).
- A **Python parser library** (`common_ground` on PyPI): Markdown AST → typed argument graph → JSON.
- An **embeddable web component** (`common-ground-web` on npm): renders the JSON, including inline charts for data-grounded statements.
- A **central actor registry** (`actors/` directory in the main repo, one file per actor) of human institutions and AI systems referenced across topics.
- **Reference content** for the Schuldenbremse fiscal-arm graph as Markdown + CSV files under `topics/schuldenbremse/`.
- A **reference deployment website** that renders any public topic repo.

Phase A delivers a public Schuldenbremse demo before the Oct/Nov 2026 application; Phase B (funded) hardens the toolchain, populates the actor registry, and seeds three more topics.

---

## 3. Architecture

### Single repo

Everything lives in one `common_ground/` GitHub repo for Phase A. Splitting into per-domain repos (toolchain / actors / topics) is a Phase B / post-funding decision — only justified once external contributors actually want to own a piece. The format already supports cross-repo references, so the split remains a future option, not a current obligation.

```
common_ground/                   <- single repo (project root)
├── pyproject.toml
├── README.md
├── LICENSE
├── src/
│   └── common_ground/           <- importable Python package
│       ├── __init__.py
│       ├── parser/              <- Markdown AST walker (marko or markdown-it-py)
│       ├── model/               <- typed argument graph + actors + data refs
│       ├── validator/           <- reference resolver, schema checks
│       └── serializer/          <- JSON emitter
├── tests/                       <- pytest test suite
├── format/                      <- Markdown-conventions spec, JSON schema, conformance fixtures
│   ├── spec.md
│   └── schema.json
├── web/                         <- web component (static HTML + JS for Phase A; React Flow + chart lib from CDN)
│   ├── index.html
│   └── main.js
├── actors/                      <- central actor registry, one file per actor
│   ├── destatis.md
│   ├── bundesregierung.md
│   ├── bundestag.md
│   ├── ifo-institut.md
│   ├── cdu-2025.md
│   ├── spd-2025.md
│   ├── claude.md
│   ├── gpt-5.md
│   ├── README.md                <- contribution guide, vetting policy
│   └── schema.md                <- actor-file conventions
├── topics/                      <- all topic content
│   └── schuldenbremse/
│       ├── topic.md
│       ├── statements/{01-facts,02-mechanisms,03-values,04-policies}.md
│       ├── edges/relations.md   <- optional; relations can also be inline
│       ├── data/
│       │   ├── debt-to-gdp.csv
│       │   ├── inflation-hvpi.csv
│       │   ├── gdp-growth.csv
│       │   └── README.md
│       ├── translations/en/...
│       └── sources/citations.md
├── examples/                    <- 3 minimal example topics for tests + tutorials
├── docs/                        <- this implementation plan + tutorial + format website source
├── build.py                     <- 20-line script: parse a topic + actor registry → topic.json
└── .github/workflows/build.yml  <- GitHub Actions: build + deploy on push

common-ground.de                 <- deployed at: static HTML + topic.json files served by Cloudflare Pages
```

Topics reference actors by ID (`@destatis`). The parser resolves actor IDs against `actors/` in the same repo. The same `@destatis` works across all topics in `topics/` — that's the point of centralization.

**Future split (Phase B / post-funding, only if needed):** `actors/` and individual `topics/<name>/` directories can each become their own GitHub repo without changing any conventions. The `topic.md` frontmatter already supports an `actors-registry: <url>` field for that case.

### In scope (funded period)
- Markdown-conventions spec for L0–L4 + multi-file + provenance + actors + data references.
- Python parser library with the `src/` + `tests/` layout.
- Embeddable web component including inline-chart rendering for data-grounded statements.
- Central actor registry in `actors/`, ≥30 actors covering institutions and AI systems by end of Phase B.
- Reference Schuldenbremse content.
- Reference website (read + per-user localStorage stance overlay; no DB).
- Trace-down UX.
- Argdown import/export.
- VS Code extension (Phase B): reference resolution, validation, live preview.

### Out of scope (funded period)
- **CLI tool** — deferred to post-funding.
- Multi-user accounts, server-side voting, DB-backed moderation — replaced by GitHub PR workflow on topic repos and GitHub Issues for statement-level discussion.
- Pol.is-style clustering.
- Habermas-Machine-style consensus drafting (Optional Second Stage at most).
- Native mobile app (graceful browser degradation).

---

## 4. Format design — Markdown with conventions

### Principles
1. **Valid Markdown** — every `.md` file parses with any standard Markdown parser; renders sensibly on GitHub.
2. **Diff-friendly** — line-oriented; small edits → small diffs (the GitHub-PR contribution model depends on this).
3. **Layered** — L0–L4 is encoded structurally (heading levels), not as a tag.
4. **Provenance-first** — sources for L0/L1 are required and structured (URL, source-type, retrieval, jurisdiction).
5. **Institutionally attributed** — statements can be endorsed/disputed by *actors* with stable IDs (`@destatis`, `@bundesregierung`, `@cdu-2025`, `@claude`). Actors are defined centrally, in the project's `actors/` directory (single source of truth across all topics).
6. **Evidence-grounded** — numerical L0/L1 claims can reference versioned datasets in `data/*.csv`; the renderer shows inline charts.
7. **Composable** — a topic spans multiple files; references resolve by ID across files and across repos (statements within topic; actors against the central registry).
8. **Convention-not-extension** — the parser doesn't define new Markdown syntax; it imposes meaning on existing constructs.

### Conventions (sketch — frozen in WP1)

- **YAML frontmatter** in `topic.md`: `topic`, `language`, `version`, `contributors`, `license`. Optional `actors-registry` (URL/path) for topics that live outside the main repo and want to reference an external registry; defaults to the in-repo `actors/` directory.
- **H1 (`#`)** = topic title or section title within a file.
- **H2 (`## L<n> — <name>`)** = layer section. L0–L4.
- **H3 (`### <id>: <text>`)** = a statement. The `<id>` (e.g. `f1`, `c1`, `p1`) is the cross-file reference key.
- **Blockquote starting with bold `Quelle:` or `Source:`** = provenance for L0/L1, with structured sub-fields.
- **Blockquote line `**Endorsed by:**` / `**Disputed by:**`** = actor attribution; references actor IDs.
- **Blockquote line `**Data:**`** = link to a CSV in `data/` plus column reference.
- **List items with bold edge label** under a statement = relations: `**evidence:** f2`, `**attacked-by:** c4`, `**supports:** c1, v3`.
- **Actor file** in `actors/<id>.md` defines an actor as `# @<id>: <name>` followed by YAML frontmatter or a definition list of fields.
- **`data/README.md`** documents every CSV in `data/` (columns, source, retrieval date).

### Format primitives

#### Enriched citations
```markdown
> **Quelle:** [Bundestag — GG Art. 109](https://www.bundestag.de/...)
> - retrieved: 2026-04-01
> - source-type: legal-text
> - jurisdiction: DE
```
`source-type` enum: `legal-text` | `gov-statistics` | `peer-reviewed` | `expert-report` | `news` | `opinion`. The renderer signals credibility visually.

#### Central actor registry (`actors/destatis.md`)
```markdown
---
id: destatis
type: government-agency
country: DE
url: https://www.destatis.de
mission: official statistics
since: 1948
---

# Statistisches Bundesamt (Destatis)

Federal agency responsible for official statistics in Germany.
```

`type` enum (extensible): `government-agency` | `government` | `parliament` | `political-party` | `research-institute` | `ngo` | `media` | `expert-individual` | `ai-agent`.

AI agents:
```markdown
---
id: claude
type: ai-agent
vendor: Anthropic
model-family: Claude
url: https://www.anthropic.com
---

# Claude (Anthropic)

Frontier general-purpose AI assistant. Specific model versions: claude-opus-4-7, claude-sonnet-4-6, etc.
```

Statements reference actors:
```markdown
> **Endorsed by:** @destatis, @bundesfinanzministerium
> **Disputed by:** @ifo-institut
```

Topics resolve actor references against `actors/` in the same repo at parse time. Topics that live in their own external repos can override via `actors-registry:` in frontmatter. The same `@destatis` works in any topic — that's centralization.

#### Data traces / time series
```
data/
├── debt-to-gdp.csv
├── inflation-hvpi.csv
├── gdp-growth.csv
└── README.md
```

```markdown
### f2: Schuldenstand-zu-BIP-Verhältnis Ende 2023: 62,4%

> **Quelle:** [Destatis 2024](https://www.destatis.de/...)
> - retrieved: 2026-04-01
> - source-type: gov-statistics
> **Endorsed by:** @destatis
> **Data:** [`debt-to-gdp.csv`](../data/debt-to-gdp.csv) — column `debt_to_gdp_pct`, 2010–2024
```
The web component reads the CSV at build time and renders an inline sparkline / chart on the node. Data is committed: diffable, reproducible, no runtime API dependency.

### Examples

`statements/01-facts.md`:
```markdown
# Schuldenbremse — Fakten

## L0 — Empirische Fakten

### f1: Artikel 109 GG begrenzt das strukturelle Defizit auf 0,35% des BIP

> **Quelle:** [Bundestag — GG Art. 109](https://www.bundestag.de/...)
> - retrieved: 2026-04-01
> - source-type: legal-text
> - jurisdiction: DE
> **Endorsed by:** @bundestag

### f2: Deutschlands Schuldenstand-zu-BIP lag Ende 2023 bei 62,4%

> **Quelle:** [Destatis 2024](https://www.destatis.de/...)
> - retrieved: 2026-04-01
> - source-type: gov-statistics
> **Endorsed by:** @destatis
> **Data:** [`debt-to-gdp.csv`](../data/debt-to-gdp.csv) — column `debt_to_gdp_pct`, 2010–2024
```

`statements/04-policies.md`:
```markdown
# Schuldenbremse — Politikvorschläge

## L4 — Politikvorschläge

### p1: Reform der Schuldenbremse, um 1,0% Defizit für Investitionen zu erlauben

> **Endorsed by:** @spd-2025, @grüne-2025
> **Disputed by:** @cdu-2025, @fdp-2025

- **supports:** c1, v3
- **attacked-by:** p2
```

### Implications
- **Parser shape:** walk a Markdown AST. Statements = H3 nodes. Edges = list items in the statement body. Citations / endorsements / data-refs = blockquote lines with conventional bold labels. References (`f1`, `@destatis`, `debt-to-gdp.csv`) resolve in a second pass; actor refs resolve against the registry.
- **Authoring:** any Markdown editor. VS Code's built-in preview already shows usable structure.
- **GitHub:** renders the file as a structured document; PR diffs are line-level; CSV diffs are tabular. Statement-level discussion via Issues linked from each statement's stable URL.
- **AI-agent friendliness:** the format is line-oriented, deterministic, and machine-readable. An agent can produce a `.md` file in this format, attribute itself as an actor, and submit a PR. Reading existing topics gives an agent structured context for grounded reasoning.
- **Cost:** Markdown constrains expressiveness — multi-paragraph statements need a continuation convention; Argdown-style premise-conclusion micro-structures are modeled inside list items rather than syntactically.

---

## 5. Phase A — pre-funding (May → Sep 2026)

Curated content scope: **30–60 nodes, one sub-topic** (fiscal arm of Schuldenbremse), plus a small actor registry (~5 actors) and ≥3 data traces.

### Milestones (~18 weeks)

| Wks | Block | Output |
|---|---|---|
| 1–2 | Format spec v0.1 + parser library | Markdown-conventions doc covering layers + enriched citations + actors + data references; `src/common_ground/` Python library that parses a topic dir → typed graph → JSON; `tests/` with pytest fixtures; 3 minimal example topics in `examples/` |
| 3–5 | Static-HTML web renderer with chart support | One `index.html` loading React + React Flow + a small chart library (uPlot or Recharts) from a CDN; reads `topic.json`; custom L0–L4 nodes; inline sparkline for nodes with `Data:` references; auto-layout (dagre/ELK) |
| 6–9 | Schuldenbremse content + bootstrap actor registry | 30–60 nodes under `topics/schuldenbremse/`, fiscal arm; all L0/L1 sourced; ≥3 data traces (BIP, Schuldenquote, inflation) committed as CSV; `actors/` populated with ~5 actors (Destatis, Bundesregierung, Bundestag, ifo-Institut, plus 1 AI-agent example); political-science contact reviews |
| 10–11 | Trace-down UX + stance overlay | localStorage stance per statement; filter toggles (L0–L2 only / show all); trace-down from L4 → driver L1/L2/L3 |
| 12 | Static deployment | `git push` to Cloudflare Pages or Netlify (recommended over Hetzner for static-only Phase A); HTTPS; OG tags; Plausible Analytics; GitHub Actions builds the JSON from topic markdown on every push |
| 13 | Tester round | 10–20 testers; questions: "Can you locate the *layer* where you disagree?" + "Do the data traces help you trust the L0 claims?"; iterate |
| 14–18 | Application prep | 3 × 2,000-char DE summaries (drafted iteratively over 5 weeks); Vorhabenbeschreibung (12-point); editorial-board commitments confirmed in writing; OSS license chosen and applied; 5% own contribution evidenced; outreach to DebateLab/KIT sent; submit Oct/Nov 2026 |

### Phase A deliverable
A live URL rendering the Schuldenbremse layered argument graph from `topics/schuldenbremse/` in the public `common_ground` GitHub repo, using the `common_ground` Python library on PyPI (built from `src/common_ground/`) and the static `web/` renderer with React Flow + chart library from a CDN. The `actors/` directory in the same repo is populated with ≥5 actors including one AI-agent example. **The funded artifact is partially shipped at application time** — strongest possible signal for jury point 6 (prior work) and feasibility (point 3).

---

## 6. Phase B — funded sprint (June → Nov 2027)

950 hours / 6 months / ~36 h/week. CLI dropped; hours redistributed across format, web component, and the central actor registry.

| WP | Title | Hrs | Output |
|---|---|---|---|
| WP1 | Format spec v1.0 (conventions, JSON schema, conformance suite, agent profile) | 70 | Frozen spec including actor + data-trace conventions; conformance test suite; "AI-agent producer profile" sub-spec |
| WP2 | Python parser library (production grade) | 80 | `common_ground` v1.0 on PyPI; type-hinted; error-recovering; good error messages; cross-repo actor resolution |
| WP4 | Argdown ↔ Markdown converter | 60 | Round-trip with Argdown reference samples |
| WP5 | Web component v1.0 (React Flow + inline chart rendering) | 120 | `common-ground-web` on npm; embeddable; themable; accessible; printable; CSV-driven sparklines |
| WP6 | Stance overlay + trace-down + filters | 70 | Killer-UX module; layer-filter, actor-filter, source-type filter |
| WP7 | LLM-assisted authoring (layer classification, dedup) | 80 | Python library functions + web hooks; an AI agent can use these to produce conformant graphs; cut first if scope slips |
| WP8 | Bilingual DE/EN format support | 70 | Translation layer; cross-language statement linking |
| WP9 | Reference renderer site (Django or static-with-build) | 50 | common-ground.de renders any topic in `topics/`, plus any external topic repo by URL |
| WP10 | 3 additional reference topics under `topics/` | 110 | e.g. migration, energy policy, Bürgergeld; ~80 nodes each; editorial-board curated |
| WP11 | Documentation, tutorial, format website, **VS Code extension** | 100 | argmap.org-equivalent hosted at common-ground.de/docs; VS Code extension (reference resolution, validation, live preview) |
| WP12 | Governance, WCAG AA, GDPR/DSGVO docs, license, DPIA | 60 | DPIA artifact; a11y audit; contributor charter; actor-registry vetting policy |
| WP13 | Demo Day, sustainability, community launch | 50 | Public release; ≥1 external adopter |
| WP14 | Central actor registry — schema, content, contribution flow | 30 | `actors/` directory populated with ≥30 actors (institutions + parties + ≥3 AI agents); vetting policy in `actors/README.md`; PR template; per-actor schema validated by `common_ground` parser |
| | **Total** | **950** | |

(Sanity check: 70 + 80 + 60 + 120 + 70 + 80 + 70 + 50 + 110 + 100 + 60 + 50 + 30 = 950 ✓)

### Phase B deliverables
- FOSS Markdown convention + Python parser library (`common_ground`) + web component (`common-ground-web`) + VS Code extension, all published and documented.
- Central actor registry (`actors/`) with ≥30 actors, including ≥3 AI-agent profiles.
- 4 reference topics under `topics/` covering major German policy debates.
- A reference deployment site at common-ground.de.
- ≥1 external adopter (academic, journalist, or civic group) using the format independently.

### Sustainability story (Vorhabenbeschreibung point 10)
- **Ecosystem alliance:** outreach to DebateLab/KIT before application; aim for "Argdown-compatible" recognition or letter of support.
- **AI-agent angle:** position the format as a protocol for human–AI mixed deliberation; reach out to LLM-research groups (DFKI, MPI, etc.) for adoption pilots.
- **Foundation grants:** Mercator (Argumentationsbildung), Bertelsmann, NLnet/NGI0.
- **Adopter institutions:** bpb (politische Bildung curricula), Aula schools, Decidim instances.
- **Legal form:** gGmbH formation considered post-funding if adoption traction materializes.

---

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Markdown-conventions format too constrained for advanced argumentation (premise-conclusion micro-structures) | Acceptable for v1.0; document the limitation; advanced cases use Argdown via WP4 converter |
| Greenfield format weakens "extends existing FOSS infrastructure" framing for funding | Position the format as a *Markdown profile* (extending the Markdown ecosystem) and as a protocol for AI-agent argumentation; lean on Argdown interop; reach out to DebateLab/KIT early |
| Format spec slips past Phase A weeks 1–2 | Hard scope v0.1: H2 = layer, H3 = statement, list-items = edges, frontmatter = metadata, conventional blockquote fields for citations / actors / data; ship and iterate |
| 30–60 hand-curated nodes still too many alongside dev work | Recruit one political-science contact by Jun 2026; pair-curate; cut to 20 nodes if needed |
| Schuldenbremse content too partisan to demo neutrally | Editorial-board sign-off (≥2 named contacts); cite official sources for every L0/L1; use central actors registry to make institutional positions explicit and balanced |
| Adoption risk: no one uses the format | Phase A demo + 4 Phase B reference topics + active outreach to Argdown community + AI-research outreach; even with zero external adoption the toolchain has standalone value |
| GDPR Art. 9 (political opinions) | localStorage-only in Phase A (no server-side processing); DPIA artifact in WP12 |
| 5% own contribution + 3-month cash-flow gap | Evidence ~€2,375 in bank account at application; budget ~€14k personal cash buffer at project start |
| Solo developer + first real deploy | Static deployment is trivial via Cloudflare Pages / Netlify with GitHub Actions; the deployment risk that motivated 2-week buffer in original plan is now ~1 day |
| Prototype Fund jury still reads this as civic tech | Lead all communications with the format + Python library + web component + actor registry as the deliverable; the Schuldenbremse demo is the *use case*, not the product; emphasize the AI-agent infrastructure framing |
| Dropping the CLI is read as "incomplete toolchain" by the jury | Frontload the library + web component as the substrate any CLI would build on; explicitly note CLI is post-funding |
| Centralized actor registry becomes a moderation bottleneck | PR-only contributions; vetting policy in `actors/README.md` (WP12 + WP14); contested actors can be split out to a fork or topic-local override via `actors-registry:` frontmatter |
| Quality of CSVs in `data/` (data integrity) | `data/README.md` requires source-URL + retrieval-date for every CSV; PR review checks; no auto-fetch at runtime |

---

## 8. Funding mechanics — fixed constraints (verified May 2026)

- **Solo / 6 months funding cap:** €47,500 (= 950 h × €50/h pauschal).
- **Solo / 10 months Second Stage cap:** €79,170 (+€31,670 over the 6-month base).
- **5% own contribution required**, evidenced by bank statement at application.
- **Payment in arrears, quarterly** — self-finance ~3 months upfront.
- **Application window:** 01.10.–30.11.2026.
- **Project start:** 01.06.2027.
- **OSS license required from day one** — pick AGPL (strongest public-interest signal) or MIT/Apache (max reuse) before the application.
- **Vorhabenbeschreibung structure:** 12-point template (overview / problem / technical+differentiation / risks / target audience / prior work / past experience / WPs+hours / Second Stage intent / sustainability / Second Stage WPs / jury conditions).
- **Three DE summaries** (V07–V08), max. 2,000 chars each: goals / work plan / utilization+reach.
- **Required attachments:** signed Vorhabenbeschreibung, de-minimis declaration, tax number, bank statement (5%), insolvency-exclusion declaration, Second-Stage decision form, employer-permission letter if applicable.

---

## 9. Verification — how Phase A succeeds

End-to-end test path at week 13:

1. `cd common_ground && pytest` → all tests pass; coverage ≥80% on `src/common_ground/`.
2. `python build.py topics/schuldenbremse/ > public/schuldenbremse.json` → produces valid JSON conforming to the spec; all `@actor` references resolve against `actors/`; all `Data:` references resolve to existing CSVs under `topics/schuldenbremse/data/`.
3. Visit `https://common-ground.de/schuldenbremse/` → graph renders; all 30–60 nodes visible; auto-layout legible; data-grounded L0 nodes show inline sparklines.
4. Click a contested L4 node → "trace down" → driver L2/L3 nodes highlighted; side panel shows full text, source, endorsing actors.
5. Mark stance on 5 statements → reload → stance persists (localStorage round-trip).
6. ≥10 testers complete the "locate the layer where you disagree" task; ≥70% identify a specific layer; ≥60% report data traces increase trust in L0 claims.
7. `pip install common-ground` works from a clean machine; `python build.py topics/schuldenbremse/` succeeds against a fresh `git clone` of the project.
8. The `common_ground` repo on GitHub renders `topics/schuldenbremse/` as a coherent structured document in the GitHub web UI; clicking a statement-level Issues link opens the statement's discussion thread.
9. Vorhabenbeschreibung draft passes review by ≥1 prior PTF awardee before submission.

If 1–4 fail at week 11, re-scope to fewer nodes (target 20). If 6 fails (testers can't locate layers), the L0–L4 model itself needs redesign — flag immediately.

---

## 10. Open decisions still owed (in priority order)

1. **OSS license.** AGPL vs. MIT/Apache. AGPL recommended for public-interest signaling; switch only if an integration target demands it.
2. **Markdown parser choice for `common_ground`.** marko vs. markdown-it-py vs. mistune — decide in Phase A week 1; all three are viable.
3. **Chart library for `common-ground-web`.** uPlot (smallest), Recharts (most features), Chart.js (most familiar) — decide in Phase A week 3.
4. **Hosting for the reference deployment.** Cloudflare Pages (recommended; free, GitHub-integrated, zero-ops) vs. Netlify (similar) vs. Hetzner (control, but unnecessary for static).
5. **Editorial board.** ≥2 named contacts (political-science academic + journalist or civic-tech practitioner) committed in writing before Sep 2026.
6. **DebateLab/KIT outreach.** Email by Jul 2026; goal: at minimum public acknowledgment, ideally a letter of support.
7. **Freiberufler status.** Confirm or initiate registration immediately — multi-week lead time.
8. **AI-research outreach.** Email DFKI + MPI groups by Aug 2026 to gauge interest in the AI-agent angle for the Vorhabenbeschreibung.
9. **Phase B WP7 (LLM-assisted authoring) commitment.** Decide by Mar 2027 whether to keep in scope; if cutting, reallocate 80h.

---

## 11. Critical files (to be created — Phase A)

All paths below are relative to the project root at [..](..) .

**Phase A weeks 1–2 (toolchain skeleton):**
- `pyproject.toml`, `README.md`, `LICENSE`
- `src/common_ground/__init__.py`
- `src/common_ground/parser/` — Markdown AST walker
- `src/common_ground/model/` — typed graph + actors + data refs
- `src/common_ground/validator/` — reference resolver + schema checks
- `src/common_ground/serializer/` — JSON emitter
- `tests/` — pytest fixtures + unit tests
- `format/spec.md` — conventions specification
- `format/schema.json` — JSON schema for parsed output
- `examples/` — 3 minimal example topics
- `build.py` — 20-line script: parse a topic + `actors/` → `topic.json`

**Phase A weeks 3–5 (web component, same repo):**
- `web/index.html` — single static HTML loading React Flow + chart library from a CDN; reads `topic.json`; custom L0–L4 node renderers; inline charts for `Data:` references
- `web/main.js` (or `.tsx`) — node renderers, edge styles, layout, trace-down + stance overlay logic

**Phase A weeks 6–9 (content under the same repo):**
- `actors/destatis.md`, `actors/bundesregierung.md`, `actors/bundestag.md`, `actors/ifo-institut.md`, `actors/claude.md`
- `actors/README.md`, `actors/schema.md`
- `topics/schuldenbremse/topic.md`
- `topics/schuldenbremse/statements/{01-facts,02-mechanisms,03-values,04-policies}.md`
- `topics/schuldenbremse/data/{debt-to-gdp,inflation-hvpi,gdp-growth}.csv`, `topics/schuldenbremse/data/README.md`
- `topics/schuldenbremse/sources/citations.md`

**Phase A week 12 (deployment):**
- `.github/workflows/build.yml` — GitHub Actions config: on push, run `build.py`, deploy `web/` + generated `topic.json` to Cloudflare Pages

---

## 12. Sanity checks performed

- Phase B WP hours sum to 950 ✓ (70+80+60+120+70+80+70+50+110+100+60+50+30)
- Phase A weeks sum to 18 ✓ (1–2, 3–5, 6–9, 10–11, 12, 13, 14–18)
- Single repo: every directory reference (`src/`, `tests/`, `format/`, `web/`, `actors/`, `topics/`, `examples/`, `docs/`, `build.py`, `.github/`) lives under one `common_ground/` GitHub repo ✓
- Python package consistently named `common_ground` (importable) at `src/common_ground/`; PyPI distribution name `common-ground` ✓
- Every actor mention treats actors as centralized in `actors/` (not per-topic) ✓
- Every reference to file extension is `.md` (no leftover `.argm`) ✓
- CLI is consistently treated as out-of-scope and post-funding ✓
- Funding amounts and timeline match verified Prototype Fund rules (Section 8) ✓
- Cross-repo references (`actors-registry:` frontmatter) preserved as a future Phase B option without being a current obligation ✓

---

## 13. Sources

- [Prototype Fund — Application page](https://www.prototypefund.de/en/application)
- [Prototype Fund — Notes & Funding Criteria](https://prototypefund.de/en/apply/notes/)
- [Prototype Fund — Why we focus on data security and software infrastructure](https://prototypefund.de/en/why-we-focus-on-data-security-and-software-infrastructure/)
- [Prototype Fund — Software Infrastructure focus](https://www.prototypefund.de/en/software-infrastructure)
- [Prototype Fund — Datensicherheit focus](https://www.prototypefund.de/datensicherheit)
- [Prototype Fund Wiki — Antragstellung](https://wiki.prototypefund.de/index.php?title=Antragstellung)
- [Argdown — Overview](https://argdown.org)
- [Argdown — Syntax reference](https://argdown.org/syntax/)
- [GitHub — christianvoigt/argdown](https://github.com/christianvoigt/argdown)
- [pyargdown on PyPI](https://pypi.org/project/pyargdown/)
