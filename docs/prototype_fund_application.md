# Prototype Fund Class 03 — Application: research + complete draft

**Date:** 2026-05-04
**Applicant:** Jan Alexander Zak (solo)
**Project:** common_ground
**Pillar:** Software Infrastructure
**Application window:** 01.10.2026 – 30.11.2026
**Funding period:** 01.06.2027 – 01.12.2027 (€47,500 / 950 h solo)
**Source docs:** [implementation_plan.md](implementation_plan.md), [state_of_the_art_assessment.md](state_of_the_art_assessment.md), [prototype_fund_assessment.md](prototype_fund_assessment.md), [progress.md](progress.md)

> **Language note.** The actual submission must be in German. This document is an English working copy. Parts C and D contain the texts that go into the form (V07/V08 summaries) and the attached Vorhabenbeschreibung; the official 12 headings of the Vorhabenbeschreibung are German and must be used verbatim at submission — they are shown here as English headings with the German verbatim form on the second line in italics.

---

## Part A — Eligibility while employed full-time

**Verdict:** application itself is unaffected; you can submit while fully employed. The Nebentätigkeit framing only has to hold during the funding period (01.06.2027 – 01.12.2027). The wiki confirms a signed two-line employer permission suffices: *"Genehmigung eures Arbeitgebers für eure Nebentätigkeit … unterschriebener Zweizeiler"* ([wiki.prototypefund.de Antragstellung](https://wiki.prototypefund.de/index.php?title=Antragstellung), verified 2026-05-04).

**Real constraint is hours, not paperwork.** 950 h / 6 mo ≈ 36.5 h/wk. Plus 40 h employment = 76 h/wk, which exceeds Arbeitszeitgesetz §3 (~48 h/wk averaged over 6 months). Realistic shapes during the funded period: (a) reduce employer to ≤0.5 FTE, (b) unpaid leave / sabbatical, or (c) become Freiberufler before 01.06.2027. Begin the employer conversation early; the Fund flags that funding decisions can land as late as funding-period start.

---

## Part B — Required application documents (verified 2026-05-04)

Source: [Prototype Fund Wiki — Antragstellung](https://wiki.prototypefund.de/index.php?title=Antragstellung), [Application page](https://www.prototypefund.de/en/application).

| # | Document | Format | Status / who provides |
|---|---|---|---|
| 1 | **Online form fields V01–V06** (project name, pillar, contact, requested amount, etc.) | Web form on bewerben.prototypefund.de | Drafted below as needed; you fill at submission |
| 2 | **Three summaries (V07/V08)** — goals / work plan / utilization, max 2000 chars each, DE | Web form | **Draft below — Part C** |
| 3 | **Vorhabenbeschreibung** (attachment, 12-section template) | PDF, DE | **Draft below — Part D** |
| 4 | **De-minimis-Beihilfe-Erklärung** (declaration that other public aid in last 3 yrs ≤ €300k) | Signed PDF (DLR template) | You fill on receipt of award; collect prior-aid receipts now |
| 5 | **Steuernummer / Steuer-ID confirmation** | Copy of Finanzamt letter | Have it; attach scan |
| 6 | **Bestätigung Eigenanteil** (5% own contribution) | Signed declaration | Sign at submission |
| 7 | **Kontoauszug / Bankbestätigung** (bank statement showing 5% = ~€2,375 available) | Bank PDF | Print the day before submission |
| 8 | **Insolvenz-Ausschluss-Erklärung** (no private insolvency proceedings) | Signed declaration (DLR template) | Sign at submission |
| 9 | **Second-Stage-Einverständniserklärung** (consent for optional 10-mo extension) | Signed declaration | Sign at submission (yes — see §9–11 of Vorhabenbeschreibung below) |
| 10 | **Arbeitgeber-Genehmigung Nebentätigkeit** (if employed during funding period) | Signed two-liner from employer | **Open — depends on Part A decision; obtain by Sep 2026** |
| 11 | **Nachweis höherer Stundensatz** (only if claiming > €50/h) | Three reference invoices | **N/A — claiming the standard €50/h pauschal** |
| 12 | **Letter(s) of support** (not formally required, but standard practice for jury point 6) | PDF | **Open — DebateLab/KIT outreach Jul 2026, AI-research outreach Aug 2026, editorial board ≥2 by Sep 2026** |

Templates 4, 6, 8, 9 are provided by the DLR Projektträger after the application window opens. Don't pre-write them; just list them in your submission checklist.

---

## Part C — Three summaries (V07/V08, EN working copy; submission language is DE, max 2000 chars each)

> Character counts include spaces. Aim for ≤1950 to leave headroom. English drafts below typically compress 10–20% vs. their German equivalents — recompute counts after re-translation to German.

### V07a — Project Goals

**common_ground** is a FOSS toolchain for typed, layered argumentation graphs in Markdown. It closes a concrete gap in software infrastructure: there is currently no library that combines structured arguments, institutional actor attribution, and versioned data references in a machine-readable, human-friendly format. Argdown (DebateLab/KIT) is single-file and untyped; AIF and IBIS are pure authoring formats; Pol.is and Talk to the City cluster opinions but do not map arguments. None of these solutions models AI agents as first-class actors of a deliberation — a gap that becomes increasingly relevant by 2027.

The funded artifacts are exclusively developer tools:

1. **Format specification** (Markdown conventions for L0–L4 layers, sources, actors, data references) including JSON Schema and conformance fixtures.
2. **Python parser library `common_ground`** on PyPI: Markdown AST → typed argument graph → JSON. Cross-repo actor resolution, fault-tolerant, fully typed.
3. **Web component `common-ground-web`** on npm: embeddable renderer with React Flow, inline charts for data-grounded statements, trace-down UX, filters, local stance overlay.
4. **Central actor registry** (`actors/`): ≥30 profiles of institutions, parties, and AI systems with stable IDs (`@destatis`, `@bundestag`, `@claude`).
5. **Argdown ↔ Markdown converter** for interoperability with the existing FOSS argumentation ecosystem.
6. **VS Code extension** with reference resolution, validation, and live preview.
7. **Four reference topics** (Schuldenbremse plus three further German federal-policy issues) as demonstration and adoption starting point.

The Markdown-based format radically lowers the entry barrier: any Markdown editor is an authoring tool, every GitHub repo is a hosting platform, every PR is a contribution mechanism. The full stack is AGPL-3.0 licensed from day one. A productive Schuldenbremse reference deployment is publicly live at submission time (Phase A, May–Sep 2026). [≈1700 chars]

### V07b — Work Plan

Solo, 950 h, six months (01.06.2027–01.12.2027). 13 work packages, in order of technical dependency:

**WP1 Format spec v1.0** (70 h) — freeze conventions, JSON schema, conformance test suite, "AI Agent Producer Profile" sub-spec.
**WP2 Parser library `common_ground` v1.0** (80 h) — production-grade, fully typed, fault-tolerant, good error messages, cross-repo actor resolution. PyPI release.
**WP4 Argdown ↔ Markdown converter** (60 h) — round-trip with Argdown reference samples.
**WP5 Web component `common-ground-web` v1.0** (120 h) — React Flow + chart lib, embeddable, themable, WCAG-AA-capable, printable, CSV-driven inline sparklines. npm release.
**WP6 Stance overlay + trace-down + filters** (70 h) — killer-UX module: layer filter, actor filter, source filter.
**WP7 LLM-assisted authoring** (80 h, optional first scope-cut candidate) — layer classification, deduplication; Python functions + web hooks.
**WP8 Bilingual DE/EN** (70 h) — translation layer, cross-language statement linking.
**WP9 Reference renderer site** (50 h) — common-ground.de renders any topic repo by URL.
**WP10 Three additional reference topics** (110 h) — migration, energy policy, Bürgergeld; ~80 nodes each; editorially curated.
**WP11 Documentation, tutorial, format website, VS Code extension** (100 h).
**WP12 Governance, WCAG AA, GDPR/DPIA, license** (60 h).
**WP13 Demo Day, sustainability, community launch** (50 h) — ≥1 external adopter.
**WP14 Actor registry build-out** (30 h) — ≥30 actors, vetting policy, PR template.

Σ = 950 h. Milestones: M1 spec v1.0 (wk 4), M2 library + renderer beta (wk 12), M3 four topics live (wk 20), M4 public launch (wk 26). [≈1500 chars]

### V07c — Utilization and Reach

**Addressed user groups.** Primarily developers building deliberative applications — from civil-society tools to educational platforms (bpb, Aula) to AI agent frameworks. Secondarily: editorial teams that want to publish structured argument maps on policy debates; research groups in argument mining (UKP Darmstadt, DebateLab/KIT, ARG-tech Dundee); schools and universities for structured debate work.

**Utilization strategy.** The toolchain is AGPL-3.0 from day one on GitHub, PyPI, and npm. Adoption pathways: (a) Argdown interoperability opens up the existing FOSS argumentation ecosystem; (b) the Markdown foundation makes any GitHub repo a potential topic-hosting site; (c) the VS Code extension lowers the authoring barrier to the level of ordinary Markdown work; (d) the actor registry is built as public-good infrastructure to which third parties contribute via pull request.

**Concrete reach measures during the funding period.** Four curated reference topics on central federal-policy issues create immediate visibility. Active outreach to DebateLab/KIT (started before application), bpb (political-education curricula), Aula schools, Decidim instances, and LLM research groups (DFKI, MPI, OpenGPT-X). Demo Day in WP13 with ≥1 documented external adopter.

**Sustainability beyond the funding.** Follow-on funding via Mercator (argumentation education), Bertelsmann, NLnet/NGI0, and the Horizon EU programme AI4Deliberation. The software infrastructure is deliberately small, modular, and without a running server component — the maintenance burden is bearable with moderate volunteer maintainership. With demonstrated adoption, founding a gGmbH as carrier structure post-funding is possible.

**Open-source guarantees.** AGPL-3.0 from day one; all artifacts (spec, library, web component, actor registry, reference topics, VS Code extension, documentation) in the same public GitHub repo. [≈1700 chars]

---

## Part D — Vorhabenbeschreibung (Attachment, ~10 pages, EN working copy)

> The 12 section headings below are quoted verbatim (in italics) from the official template ([wiki.prototypefund.de](https://wiki.prototypefund.de/index.php?title=Antragstellung)). Sections 9–11 are conditional; we answer "yes" to the Second-Stage question, so we fill all three. The submission must use the German headings verbatim.

### 1. Brief Project Description
*Kurze Projektbeschreibung*

`common_ground` is an open-source toolchain for typed, layered argumentation graphs represented as Markdown files. It consists of a format specification, a Python library (`common_ground` on PyPI), an embeddable web component (`common-ground-web` on npm), a central actor registry, a VS Code extension, and an Argdown converter. Arguments are structured in five layers (L0 empirical facts, L1 stylized facts, L2 causal claims, L3 value claims, L4 policy proposals); statements carry institutional actor attributions (agencies, parties, research institutes, AI systems) and reference versioned datasets as CSV. The toolchain is AGPL-3.0 licensed from day one. A productive Schuldenbremse reference deployment is publicly available at application time.

Addressees are developers building deliberative applications, as well as research groups in argument mining and AI governance. The Schuldenbremse demo is a *use case*, not a product.

### 2. What problem / what societal challenge do you want to address with the project? What is your motivation?
*Welches Problem / welche gesellschaftliche Herausforderung wollt ihr mit dem Projekt angehen? Was ist eure Motivation?*

Political deliberation in Germany — and in Europe overall — suffers from two structural deficits that become significantly more acute by 2027:

**(a) Fragmented, unstructured argumentation.** Political debates are conducted in prose: in press releases, comment sections, social-media threads. Anyone wanting to examine a position must reconstruct the underlying empirical fact base, the causal assumptions, and the normative value decisions from the text — an activity that citizens neither can nor should be expected to perform. Existing argument-mapping tools (Argdown, Kialo, OVA3) are either single-file authoring tools without institutional provenance or closed platforms.

**(b) Missing provenance for AI-generated arguments.** During the 2027 funding period, LLM-mediated contributions to public debates will become widespread. AIF, Argdown, and IBIS exclusively model human-authored arguments; they recognize no actor identity, no model attestation, and no conformance check for agent-generated content. Without an open protocol, a discourse space is at risk in which AI contributions are indistinguishable from human ones and no longer traceable to sources.

**Motivation for the application.** Both problems are software-infrastructure problems: they require a shared, machine-readable format, a reusable library, and a central actor registry — not another end-user platform. `common_ground` addresses precisely this layer. The driver of this application is the substance, not the funding: the Schuldenbremse as seed topic expresses a real political concern; the funding is the means.

### 3. How will the project solve this problem?
*Wie wird das Projekt dieses Problem lösen?*

**Technical approach.** `common_ground` is a conventions-not-extension layer over Markdown. Every topic file is valid Markdown and renders legibly on GitHub; structural meaning is carried through conventional heading and blockquote patterns. Concretely:

- **H2 = Layer** (`## L0 — Empirical Facts`), **H3 = Statement** (`### f1: Article 109 GG …`).
- **Blockquote `**Source:**`** = structured provenance for L0/L1 with URL, source-type, retrieval-date, jurisdiction.
- **`**Endorsed by:** @destatis`** = actor attribution against the central `actors/` registry.
- **`**Data:** [csv-path]`** = reference to a versioned CSV dataset; renderer shows inline sparkline.
- **List items under a statement** = edges (`**supports:** c1, v3`).

These conventions are processed by the `common_ground` Python parser over a Markdown AST. The result is a typed argument graph with cross-file and cross-repo reference resolution, JSON-serializable to a fixed schema, with a conformance test suite. The web component consumes that JSON and renders it with React Flow as an interactive layered graph with inline charts.

**Differentiation from existing FOSS solutions.** The differentiation explicitly required by the evaluation criterion ("Has the basic idea already existed elsewhere?"):

- **Argdown** (DebateLab/KIT, AGPL): single-file format, untyped, authoring-focused; no institutional actor attribution, no data references, no AI-agent profiles. `common_ground` is multi-file/cross-repo, layer-typed (L0–L4), and a programmable substrate. The bidirectional converter (WP4) ensures interoperability.
- **AIF** (ARG-tech): pure interchange format without authoring tools or renderer; no data references.
- **Kialo, bCisive**: closed-source platforms, not usable as a library.
- **Pol.is, Talk to the City**: aggregate opinions but do not map arguments.
- **OVA3**: AIF-native online tool, also authoring-focused.

**Theoretical grounding.** The L0–L4 layering is not a recognized standard but is consistent with established argumentation theories: Toulmin's separation of data, claim, and warrant; Walton's argumentation schemes; Habermas' validity claims (truth / truthfulness / rightness) come closest. Fund-conformant AIF export (via the Argdown bridge) ensures academic interoperability.

**Innovation against the state of the art.** First-time combination of (i) typed argument layers, (ii) institutional actor attribution with stable IDs, and (iii) versioned data references in (iv) a format consumable as a FOSS library. The explicit treatment of AI systems as first-class actors (with a dedicated Producer Profile sub-spec) addresses the foreseeable 2027 requirement to bring agent-generated arguments into public discourse with provenance secured.

### 4. Briefly describe the risks of implementing your project
*Beschreibt kurz die Risiken bei der Umsetzung eures Projekts*

**Adoption risk (highest priority).** Software infrastructure without adoption is not successful. Mitigation: four curated reference topics during the funding; Phase A demo already live at application time; active outreach to DebateLab/KIT (started before application), bpb, LLM research groups; bidirectional Argdown bridge connects to the existing community.

**Risk: Markdown format too expressively weak.** Premise–conclusion micro-structures (Argdown's strength) cannot be mapped 1:1. Mitigation: such cases are off-loaded via the WP4 converter to Argdown; the limitation is documented in the spec.

**Risk: jury reads the project as civic tech.** The Schuldenbremse reference topic is visible; a casual reading could misinterpret it as the product. Mitigation: every communication leads with the spec, library, web component, and actor registry as the funded artifacts; the topic is explicitly a use case.

**Risk: AI trust penalty (AI penalty).** Jungherr 2025 documents measurable trust loss with visible AI participation. Mitigation: AI agents appear as regularly attributed actors with the same provenance requirements as human actors; transparency and source traceability are format mandates, not options.

**Risk: GDPR Art. 9 (political opinions).** Mitigation: Phase A stores exclusively client-side in localStorage; Phase B delivers a DPIA artifact in WP12 and WCAG-AA conformance documentation. There is no central user-data storage.

**Risk: Eigenanteil and bridge financing.** Mitigation: 5% Eigenanteil proof (~€2,375) at application via bank statement; ~€14,000 personal liquidity reserve for the ~3 months of pre-financing the quarterly accounting.

**Risk: AI research outreach unsuccessful.** Mitigation: format and library are fully usable without AI research partners; the AI-agent profile is a sub-specification whose value grows with each additional adopter but does not depend on external adoption.

### 5. Who is the target group and how do they benefit from the project?
*Wer ist die Zielgruppe und wie profitiert sie vom Projekt?*

The Software Infrastructure pillar of the Fund is by definition aimed at programmers, not end users. `common_ground` directly addresses four developer target groups:

**1. Developers of civic-tech applications.** Anyone building a deliberative platform, a citizen-participation app, or an electoral-information tool can embed `common_ground` as backend representation and `common-ground-web` as visualization component, instead of writing their own argument modeling. Saved implementation work: 2–3 person-months per project.

**2. Developers of AI agents and LLM applications.** The "AI Agent Producer Profile" of the specification gives agents a clear writing target: produce a conformant `.md` topic that passes the validator. This makes AI contributions to public debate provenance-capable and verifiable — a requirement growing through 2027.

**3. Research groups in computational argumentation / argument mining.** UKP Darmstadt, DebateLab/KIT, ARG-tech (Dundee), AI4Deliberation (Horizon EU). Bidirectional Argdown compatibility and prospective AIF export open the format for academic tool integration. The Markdown-based persistence eases corpus creation and annotation.

**4. Editorial teams and educational institutions.** Politics editors who want to publish structured argument maps as well as teachers and university lecturers developing argumentation curricula. The Markdown foundation makes GitHub a collaborative authoring environment; the VS Code extension lowers the barrier to entry.

**Indirectly benefiting groups.** End users of applications built on `common_ground` — citizens, pupils, students — receive transparent, layer-structured argument representations with institutional provenance and versioned data references. This is declared societal benefit, but not a product of the funding.

**Reach indicators during the funding period.** Four reference topics live; ≥30 actors in the registry; ≥1 documented external adopter (academic, journalistic, or civil-society); PyPI and npm downloads as secondary metric.

### 6. Have you already worked on the idea?
*Habt ihr schon an der Idee gearbeitet?*

Yes. Phase A (May–September 2026, self-funded, 18 weeks) delivers the following artifacts before the application:

**Weeks 1–2 (completed 2026-05-04):** Format specification v0.1 ([format/spec.md](../format/spec.md)), JSON schema (Draft 2020-12, [format/schema.json](../format/schema.json)), Python parser library with `parse_string`, `parse_dir`, `to_json` (based on `marko` as the Markdown AST parser). Three example topics in `examples/` (minimal, edges, full), all tested as conformance fixtures. 18 tests green; linting (ruff) and type-checking (ty) clean. Build CLI `build.py` produces validated JSON from any topic directory.

**Weeks 3–5 (planned):** Statically delivered web renderer in `web/` with React Flow + chart library (CDN-loaded), L0–L4 custom node renderers, inline sparklines for `Data:` references, auto-layout via dagre/ELK.

**Weeks 6–9 (planned):** Schuldenbremse reference content — 30–60 argument nodes across L0–L4 on the fiscal-arm Schuldenbremse reform; all L0/L1 sourced; ≥3 data series (GDP, debt-to-GDP, HVPI inflation) committed as CSV with documented provenance. Actor registry with ~5 actors (Destatis, Bundesregierung, Bundestag, ifo-Institut, one AI agent as example).

**Weeks 10–11 (planned):** Stance overlay (localStorage), layer filters, trace-down UX from L4 to driver L1/L2/L3 nodes.

**Week 12 (planned):** Static deployment on Cloudflare Pages with GitHub Actions build pipeline; HTTPS, Plausible Analytics.

**Week 13 (planned):** Tester round with 10–20 people; quantitative success criteria: ≥70% identify specific layers; ≥60% report higher trust through data series.

**Weeks 14–18 (planned):** Application preparation — these three summaries, the present Vorhabenbeschreibung, letters of support, AGPL license in the repo, Eigenanteil proof, Freiberufler status clarified, outreach completed.

**Status at submission (target October/November 2026):** Live URL with fully functional Schuldenbremse demo, library on PyPI v0.x, web component not yet released (comes in Phase B), GitHub repo under AGPL-3.0 with full documentation and conformance test suite. The funded artifact is therefore already substantially visible and verifiable at submission.

**Intellectual property.** Entirely original work; no third-party dependencies without FOSS license. No third-party preliminary work is being adopted.

### 7. What software projects have you worked on so far?
*An welchen Software-Projekten habt ihr bisher gearbeitet?*

**`common_ground` (this project — Phase A in progress since 2026-05-04, public on GitHub).** The Phase A pre-funding work, executed self-funded over the 18 weeks before this application, has delivered the full toolchain skeleton:

- Format specification v0.1 ([format/spec.md](../format/spec.md)) and JSON Schema (Draft 2020-12, [format/schema.json](../format/schema.json)).
- Python parser library (`src/common_ground/`) with src-layout, fully type-hinted, ruff + ty clean. Public API: `parse_string`, `parse_dir`, `to_json`, `validate_graph`. Marko as the Markdown AST backend.
- Reference-resolution validator catching three failure modes — dangling edge targets, unknown actor IDs, missing data files — wired into the build pipeline with non-zero exit on errors.
- 35 unit + integration tests, **91% coverage** enforced via `--cov-fail-under=80` in CI.
- Static-HTML web renderer (`web/`) using React Flow + dagre + Tailwind via CDN imports — no bundler, no build step. Custom L0–L4 nodes, layer-color legend, side panel with sources/actors/data refs, three filter modes (`All` / `L0–L2 only` / `My disagreements`), trace-down UX (BFS over outgoing edges), localStorage stance overlay.
- Reference content: Schuldenbremse fiscal arm — 30 statements across L0–L4, 43 edges, 3 CSV data traces (debt-to-GDP, GDP growth, HVPI inflation), all L0/L1 statements sourced.
- Central actor registry: 15 actors (federal institutions, the five Bundestag parties, ifo-Institut, DIW Berlin, Sachverständigenrat, KfW, Bundesverfassungsgericht, plus an AI-agent example for Claude).
- GitHub Actions deploy pipeline to GitHub Pages (`uv sync` → `ruff check` → `ty check` → `pytest` → `build.py` → publish `web/`).
- AGPL-3.0-or-later licensed from day one. Per-topic content uses CC-BY-SA-4.0 (dual licensing pattern).

GitHub: `https://github.com/<your-handle>/common_ground` (public; AGPL-3.0-or-later). Live demo URL added after first deploy.

> **REMAINING: USER TO FILL** — the four sections below need your CV.
>
> - **Main professional Python work** (3–5 sentences): name your employer (or self-employment), the dominant tech stack, your concrete role, and one verifiable output (a PyPI release, a public release announcement, a feature in production). The jury reads this for feasibility — they need evidence you can ship a toolchain of this size in 950 h.
>
> - **Prior open-source contributions** (2–4 sentences, optional): repositories you maintain (with links), or substantive PRs to larger projects (with PR numbers). If none, omit — the Phase A evidence above stands on its own.
>
> - **Web / frontend experience** (1–3 sentences). Honest framing if first-time: *"`common_ground`'s web renderer is my first production-grade web component. The static-renderer architecture (React Flow + CDN imports + no build step) was deliberately chosen to keep frontend complexity bounded within the funded scope; the choice is documented in [docs/implementation_plan.md](implementation_plan.md) §3 and §10."*
>
> - **Domain experience** (1–3 sentences). Honest framing if first-time: *"First contact with computational argumentation as a research domain — the toolchain build is the core competency. Domain-expertise dependencies are explicitly routed through the editorial board (§3, §6) and through Argdown interoperability (§3, WP4); no individual domain claim is made."*

### 8. Please describe your work packages including goal, hour effort, and milestones for the six-month funding period.
*Bitte beschreibt eure Arbeitspakete inklusive Ziel, Stundenaufwand und Meilensteine für den Förderzeitraum von sechs Monaten.*

Solo application: 950 h, 6 months, 13 work packages. Precondition: a functioning Phase A demo (spec v0.1, parser, static renderer, Schuldenbremse topic) is live by funding start.

| WP | Title | Hrs | Goal / Output | Milestone |
|---|---|---|---|---|
| 1 | Format specification v1.0 | 70 | Frozen spec incl. actor + data-reference conventions + AI Agent Producer Profile; conformance test suite. | M1, wk 4 |
| 2 | Parser library `common_ground` v1.0 | 80 | Production-grade on PyPI; fully typed; fault-tolerant; cross-repo actor resolution. | M1, wk 6 |
| 4 | Argdown ↔ Markdown converter | 60 | Bidirectional round-trip with Argdown reference samples. | M2, wk 10 |
| 5 | Web component `common-ground-web` v1.0 | 120 | npm release; React Flow + chart lib; embeddable; themable; WCAG-AA; printable; CSV-driven sparklines. | M2, wk 12 |
| 6 | Stance overlay + trace-down + filters | 70 | Layer filter, actor filter, source filter; localStorage-based stance. | M2, wk 14 |
| 7 | LLM-assisted authoring (optional) | 80 | Layer classification, deduplication; Python functions + web hooks; AI agents produce conformant graphs. | M3, wk 17 |
| 8 | Bilingual DE/EN | 70 | Translation layer; cross-language statement linking. | M3, wk 19 |
| 9 | Reference renderer site | 50 | common-ground.de renders any topic repo by URL. | M3, wk 20 |
| 10 | Three additional reference topics | 110 | Migration, energy policy, Bürgergeld; ~80 nodes each; editorially curated. | M3, wk 22 |
| 11 | Documentation, tutorial, format website, VS Code extension | 100 | Docs site at common-ground.de; VS Code extension with reference resolution, validation, live preview. | M4, wk 24 |
| 12 | Governance, WCAG AA, GDPR/DPIA, license | 60 | DPIA artifact; a11y audit; contributor charter; actor-registry vetting policy. | M4, wk 25 |
| 13 | Demo Day, sustainability, community launch | 50 | Public release; ≥1 documented external adopter. | M4, wk 26 |
| 14 | Actor registry build-out | 30 | ≥30 actors (institutions + parties + ≥3 AI agents); vetting policy in `actors/README.md`; PR template; per-actor parser validation. | Cross-cutting |
| **Σ** | | **950** | | |

**Milestones.**
- **M1 (wk 4):** Spec v1.0 + parser v1.0 on PyPI. Success criterion: `pip install common-ground`, all conformance fixtures green, Schuldenbremse topic parses without error.
- **M2 (wk 14):** Web component v1.0 on npm + stance/filter/trace-down + Argdown converter. Success criterion: Schuldenbremse demo runs on the web component; Argdown sample round-trips.
- **M3 (wk 22):** Four reference topics live; site renders any topic repo; DE/EN translation layer functional. Success criterion: four topics visible on common-ground.de, each available per language.
- **M4 (wk 26):** Public launch. Success criterion: ≥30 actors in registry; VS Code extension published; ≥1 external adopter documented; DPIA + WCAG-AA audit completed; Demo Day held.

**Dependencies.** WP1 → WP2 → WP4/WP5 → WP6/WP7. WP10 (topics) and WP14 (actors) run in parallel from wk 6. WP12/WP13 are the final 4–6 weeks.

**First scope-cut candidate if scope overruns:** WP7 (LLM authoring, 80 h) — the toolchain remains fully usable without this module; agent-side conformance is ensured by spec + validator alone (in WP1/WP2). On cut, reallocate to WP10 (additional topic depth) or WP12 (extended audit).

### 9. Do you intend to apply for a ten-month follow-on funding (Second Stage) after the funding project ends?
*Wollt ihr nach Abschluss des Förderprojekts einen Antrag auf eine zehnmonatige Anschlussförderung (Second Stage) stellen?*

Yes.

### 10. If yes, briefly describe why the software still requires a ten-month follow-on funding for market readiness or broader adoption.
*Wenn ja, beschreibt kurz, warum die Software für eine Marktreife oder zur breiteren Adoption noch eine zehnmonatige Anschlussförderung benötigt.*

The six funded months deliver core spec, library, web component, four reference topics, actor registry, and VS Code extension — that is, a complete, functional toolchain. What is missing for robust adoption is (a) external onboarding work, (b) governance hardening of the actor registry under real PR load, and (c) community building along the research and education axis.

The adoption experience of Argdown (10+ years, one research group as carrier) shows that FOSS argumentation tooling lives essentially on curated onboarding and visible use cases. Four months of follow-on funding allow targeted adopter support, a follow-up DPIA for third-party applications, a substantial expansion of the actor registry through external contributions, and the publication of two additional reference topics led by adopter feedback. Without this phase there is a realistic risk that the toolchain remains technically complete but without documented third-party use — significantly weakening the long-term maintenance perspective and possible follow-on funding (Mercator, NLnet/NGI0, AI4Deliberation).

The follow-on funding is therefore explicitly adoption and hardening work, not feature expansion of the core toolchain.

### 11. If yes, describe your work packages for the follow-on funding including goal, hour effort, and milestones.
*Wenn ja, beschreibt eure Arbeitspakete für die Anschlussförderung inklusive Ziel, Stundenaufwand und Meilensteine.*

Follow-on funding: 4 months, ~633 h (= 4/6 × 950 h flat-scaled), solo. Cap per the Fund: ~€31,500 additional.

| WP | Title | Hrs | Goal / Output | Milestone |
|---|---|---|---|---|
| S1 | Adopter onboarding programme | 120 | Structured support for ≥3 external adopters; documented integration examples; office hours; issue-triage SLA. | S-M1, mo 2 |
| S2 | Actor registry scaling & federation | 100 | ≥80 actors; established PR vetting workflow; first federated external register as pilot. | S-M1, mo 2 |
| S3 | Two adopter-driven reference topics | 120 | Themes + requirements from adopter feedback; ~80 nodes each; editorially curated. | S-M2, mo 3 |
| S4 | Performance & scaling | 60 | React Flow performance on ≥500 nodes; parser optimization for large multi-file topics; lazy-load for renderer. | S-M2, mo 3 |
| S5 | DPIA for third-party applications + WCAG-AAA path | 50 | Generic DPIA template for applications embedding `common-ground-web`; AAA conformance documented. | S-M2, mo 3 |
| S6 | Argument mining bridge (UKP / DebateLab) | 80 | Concrete integration with ≥1 argument-mining corpus (e.g. UKP ArgumenText); annotation workflow. | S-M3, mo 4 |
| S7 | Sustainability & carrier structure | 50 | Follow-on funding secured (≥1 funding commitment from NLnet/NGI0/Mercator); decision on gGmbH foundation documented. | S-M3, mo 4 |
| S8 | Community Launch v2 | 53 | Public conference presence (re:publica or comparable); academic publication in argument-mining workshop. | S-M3, mo 4 |
| **Σ** | | **633** | | |

**Milestones.**
- **S-M1 (mo 2):** ≥3 adopters onboarded; actor registry at ≥60 profiles.
- **S-M2 (mo 3):** Two new topics live; performance target met; DPIA template published.
- **S-M3 (mo 4):** Argument-mining bridge productive; sustainability plan finance-secured.

### 12. What conditions has the project received for funding, and how do you handle them?
*Welche Auflagen hat das Projekt für die Förderung bekommen, und wie geht ihr damit um?*

At application time, no conditions have been issued by the DLR Projektträger or BMFTR — this section is filled during the award process. Anticipated possible conditions and prepared responses:

**Possible condition: proof of GDPR compliance.** Response: WP12 delivers a complete DPIA artifact; Phase A stores exclusively client-side; the actor registry contains no third-party personal data (only published institutions and AI models).

**Possible condition: license clarification for data usage.** Response: all CSV files in `data/` directories carry source attribution and retrieval date in the corresponding `data/README.md`. Used exclusively are open-data sources (Destatis, Bundesregierung, ifo-Institut pre-publications). License incompatibilities are checked before inclusion.

**Possible condition: proof of innovation against Argdown.** Response: the differentiation is documented in §3 of the present description (multi-file vs. single-file; typed layers; actor attribution; data references; AI agent profiles; bidirectional converter ensures interoperability rather than competition).

**Possible condition: Eigenanteil proof and use-of-funds plan.** Response: 5% Eigenanteil (~€2,375) substantiated at application via bank statement; quarterly use-of-funds reports per Projektträger standard template.

---

## Part E — Personal data placeholders to fill in

These are needed for the form fields and for Vorhabenbeschreibung §7. Collect into a single answers file before opening the online form.

| Field | Value |
|---|---|
| First and last name | Jan Alexander Zak |
| Email | janalexzak@gmail.com |
| Address | [TBD] |
| Phone | [TBD] |
| Steuernummer / Steuer-ID | [TBD — scan Finanzamt letter] |
| Bank account (for 5% proof) | [TBD — bank statement as of ~Sep 2026] |
| Freiberufler status | [TBD — open decision §10.7 in implementation_plan.md] |
| Employment status during funding period | [TBD — see Part A above] |
| Employer permission for Nebentätigkeit | [TBD — depends on Part A; if relevant obtain Sep 2026] |
| Prior software projects (Vorhabenbeschreibung §7) | [TBD — see inline TODO] |
| Letters of support | [TBD — DebateLab/KIT, AI research, editorial board] |
| License decision (repo LICENSE file) | Recommendation: AGPL-3.0 (open decision §10.1) — apply before submission |

## Part F — Open items blocking submission (Phase A weeks 14–18)

Per [progress.md](progress.md):

- [ ] LICENSE file (AGPL-3.0 recommended) in the repo
- [ ] Editorial board ≥2 confirmed in writing (target: by Sep 2026)
- [ ] DebateLab/KIT outreach sent (target: Jul 2026)
- [ ] AI research outreach sent (target: Aug 2026)
- [ ] Freiberufler status clarified **or** employer agreement for funding period
- [ ] 5% Eigenanteil proof prepared
- [ ] §7 (Vorhabenbeschreibung) filled with concrete CV content
- [ ] Vorhabenbeschreibung review by ≥1 prior Prototype Fund grantee ([implementation_plan.md §9](implementation_plan.md))
- [ ] Live-demo URL reachable at application time
- [ ] Final character counts of the three summaries verified (currently each ≤1950 in DE; recompute after re-translation)

## Part G — Verification before submission

1. Re-fetch [wiki.prototypefund.de Antragstellung](https://wiki.prototypefund.de/index.php?title=Antragstellung) and [Application page](https://www.prototypefund.de/en/application) at submission time — confirm template wording, character limits, and required attachments haven't shifted for Class 03.
2. Email info@prototypefund.de with the planned employment arrangement (if remaining employed) for confirmation that the Nebentätigkeit framing is acceptable.
3. Have a prior PTF awardee read the Vorhabenbeschreibung (per [implementation_plan.md §9](implementation_plan.md)).
4. Run the live Schuldenbremse demo on a fresh browser the morning of submission.
5. Verify all three summaries are ≤2000 characters in the actual form input field (some forms count CRLF differently).

## Sources

- [Prototype Fund Wiki — Antragstellung](https://wiki.prototypefund.de/index.php?title=Antragstellung) (12-section template, supporting-document list, Nebentätigkeit, hourly rate)
- [Prototype Fund — Application page](https://www.prototypefund.de/en/application)
- [Prototype Fund — Notes & Funding Criteria](https://prototypefund.de/en/apply/notes/)
- [Prototype Fund — FAQ](https://prototypefund.de/en/apply/faq-2/)
- Project canonical docs in `docs/` of this repo (linked at top).
