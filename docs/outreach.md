# Outreach drafts — Phase A application prep

**Status:** drafts in EN as working copies; translate to DE before sending to German recipients (DebateLab/KIT, German editorial-board candidates). Send in EN to international AI research groups.
**Owner:** user (review, personalize, send).
**Replace placeholders before sending:** `[Name]`, `[Lab]`, `<your-handle>`, `<demo-url>`, dates.

---

## 1. Editorial board recruitment

**Target:** ≥2 confirmed in writing by **2026-09-30**. Aim for a 4–6-candidate funnel. Mix: ≥1 political-science academic (deliberation, fiscal policy, German federalism) + ≥1 journalist or civic-tech practitioner.

**Subject (EN):** Common Ground — structured argument graph for Schuldenbremse, asking for editorial board / Letter of Support
**Betreff (DE):** Common Ground — strukturierter Argumentationsgraph zur Schuldenbremse, Anfrage Editorial Board / Letter of Support

### Body (EN draft)

Hi [Name],

I'm reaching out because I'm building `common_ground`, an open-source toolchain for typed, layered argument graphs in Markdown, and I'm putting together a small editorial board before submitting to the **Prototype Fund Class 03** (Software Infrastructure pillar; application window October–November 2026; project start June 2027).

The reference deployment maps the fiscal arm of the German **Schuldenbremse** debate as a 30-statement L0–L4 graph: empirical facts (Schuldenquote, BIP-Wachstum, HVPI), causal mechanisms, value commitments, party-attributed policy positions. Every L0/L1 statement is sourced; every claim is attributed to actors with stable IDs (`@bundestag`, `@destatis`, `@cdu`, `@spd`, …). The format is Markdown — no DSL, no new file extension — and renders sensibly on GitHub.

The funded artifact is the **toolchain** (format spec, Python library, web component, central actor registry, VS Code extension, Argdown interoperability), not a deliberation website. The Schuldenbremse demo is the use case that proves the format. Software-infrastructure framing matters because the Prototype Fund discontinued its Civic Tech pillar in 2025.

What I'd ask of you, in priority order:

1. **Editorial review of the Schuldenbremse content** (1–2 hours, asynchronous, anytime in the next ~12 weeks): does the L0–L4 layering hold up; are the L0/L1 numbers verifiable against their sources; are the L4 policy positions accurately attributed to parties as of the current Bundestag period? The repo's `[DRAFT — verify]` markers are the working list.

2. **A short letter of support** (~½ page) addressed to the Prototype Fund jury, describing your reaction to the format and the curation discipline. This is high-leverage for the application's "feasibility + editorial board" point. I can send a one-paragraph template.

3. **Lend your name as an editorial advisor** on the public repo and on common-ground.de when it launches.

This is a read-only commitment — no time obligation beyond the initial review unless you want one.

Demo: <demo-url> · Repo: github.com/<your-handle>/common_ground · License: AGPL-3.0-or-later

If this isn't your kind of thing, a quick "no thanks" is the kindest answer — and a recommendation of a colleague who might fit is hugely appreciated. Application deadline is **30 November 2026**; ideally I'd have your written commitment by **mid-September**.

Beste Grüße,
Jan Alexander Zak

---

## 2. DebateLab / KIT (Christian Voigt et al.)

**Target:** Outreach by **mid-July 2026**. Goal in priority order: (a) acknowledgment that the project is a complementary direction in the FOSS argumentation ecosystem, (b) letter of support, (c) technical input on the bidirectional Argdown converter design.

**Subject (EN):** Markdown profile for argument graphs — Argdown interoperability, possible Letter of Support for Prototype Fund Class 03
**Betreff (DE):** Markdown-Profil für Argumentationsgraphen — Argdown-Interoperabilität, Anfrage Letter of Support für Prototype Fund Class 03

### Body (EN draft)

Hello Christian,

I've followed Argdown for a while and I'm writing because I'm building something that's deliberately compatible with it: `common_ground`, an open-source **Markdown profile** for typed argument graphs that extends the format ecosystem rather than replaces any part of it.

The differences vs. Argdown are deliberate and additive. Argdown is single-file, untyped, authoring-focused. `common_ground` is multi-file (a topic spans a directory of `.md` files), layer-typed (L0 empirical facts → L4 policy positions), with first-class **institutional actor attribution** against a central registry (`actors/<id>.md` per actor) and **CSV-backed data references** rendered as inline charts in the web renderer. AI agents are first-class actors as well, with a planned "AI Agent Producer Profile" sub-spec — a forward-looking framing for human–AI mixed deliberation.

Crucially: a **bidirectional Argdown ↔ Markdown converter** is in the funded scope (WP4, 60 h). The intent is interoperability, not competition: complex premise-conclusion micro-structures off-load to Argdown via the converter; topic-scale argument maps with provenance and data live natively in `common_ground`.

I'm submitting to the **Prototype Fund Class 03** (Software Infrastructure pillar; application window October–November 2026; 950 h funded over six months from June 2027). The reference deployment is a 30-statement Schuldenbremse argument graph, public on GitHub now.

Three things I'd like to ask:

1. **A 30-minute call** (or async write-up if you prefer) to walk you through the format and the convergence/divergence points with Argdown. I'd like to understand where you'd push back on the design and where the converter spec needs to be tighter.

2. **A short letter of support** for the Prototype Fund jury — even a few sentences acknowledging the project as a complementary FOSS-argumentation direction. This is high-leverage for the application's "ecosystem alliance" framing (jury point 6, prior work).

3. **Technical input on the converter design** as I build it.

The format spec, Python library, JSON schema, and Schuldenbremse content are all already public — see github.com/<your-handle>/common_ground (AGPL-3.0-or-later). 35 tests green, 91% coverage. I can send the spec PDF in advance.

Application deadline is **30 November 2026**; ideally a reply by **mid-July**. Even a "thanks but no" is helpful — it lets me reset the framing in §3 of the Vorhabenbeschreibung.

Mit besten Grüßen,
Jan Alexander Zak

---

## 3. AI research outreach (DFKI, MPI, OpenGPT-X, others)

**Target:** Outreach by **mid-August 2026**. Goal: validation of the AI-agent angle in the Vorhabenbeschreibung. A letter is bonus; informed feedback is the primary value. Send in EN — international audience.

**Suggested recipients (rough; verify before sending):**
- DFKI Berlin / Multilinguality and Language Technology — agent-mediated dialogue and argument mining.
- MPI for Intelligent Systems / Tübingen — alignment, structured-output generation.
- MPI for Research on Collective Goods / Bonn — deliberation theory.
- OpenGPT-X consortium — German open-source LLM, public-discourse use cases.
- UKP Lab, TU Darmstadt — argument mining (parallel to DebateLab; possibly approach independently).
- ARG-tech, University of Dundee — AIF, computational argumentation.

**Subject:** Open protocol for human–AI mixed deliberation — Markdown profile, Prototype Fund Class 03

### Body (EN draft)

Hi [Name / Lab],

I'm reaching out because I'm developing `common_ground`, an open-source Markdown profile for typed argument graphs that's **designed as a protocol for human–AI mixed deliberation**. AI agents appear as first-class actors with stable IDs (`@claude`, `@gpt-5`, …) alongside human institutions. A planned "AI Agent Producer Profile" sub-spec defines the conformance rules — provenance, source attribution, layer typing — that an agent's output must meet.

The motivation: by the funded period (mid-2027), LLM-mediated contributions to public discourse — position papers, fact-checks, policy summaries — will be widespread. Existing argument formats (AIF, Argdown, IBIS) all model **human-authored** arguments and have no concept of actor identity, model attestation, or conformance for agent-generated content. `common_ground` adds these as first-class primitives, with a central actor registry (`actors/<id>.md`) and the same provenance requirements applied to AI agents as to human institutions.

The project is being submitted to the **Prototype Fund Class 03** (Software Infrastructure pillar; application window October–November 2026; 950 h funded over six months from mid-2027). The Schuldenbremse reference deployment maps a German federal-policy debate as a 30-statement graph; the funded artifacts are the spec, Python library, web component, actor registry, and VS Code extension.

I'd love to learn three things:

1. **Is your group working on anything adjacent** — agent-mediated argumentation, structured argument generation, alignment via structured outputs, deliberation simulators, multi-agent debate evaluation? If so, would `common_ground` be useful as a substrate?

2. **Would you be open to a brief evaluation** of the format as an output target for an LLM (can a model produce conformant `.md`?), or as input context for grounded reasoning (does layered structure help retrieval and citation)?

3. **(Optional) A short letter of support** would carry weight on the AI-agent framing in the Vorhabenbeschreibung. Even a few sentences from a recognized AI-research group is useful for the jury.

Spec, library, JSON schema, demo: github.com/<your-handle>/common_ground (AGPL-3.0-or-later). 35 tests green; the toolchain is functional today, and the Schuldenbremse content is public.

Application deadline is **30 November 2026**. A reply by **mid-August** would let me reflect your group's reaction in the Vorhabenbeschreibung.

Best,
Jan Alexander Zak

---

## Sending checklist (per email)

- [ ] Replace `[Name]`, `[Lab]`, `<your-handle>`, `<demo-url>`, dates.
- [ ] DE recipients: translate body to German. Keep technical terms (`L0–L4`, `Markdown profile`, `Prototype Fund Class 03`) in their canonical form.
- [ ] Attach: 1-page PDF summary of the format (can be a styled export of `format/spec.md` table of contents + L0–L4 example) — optional but lifts response rates.
- [ ] BCC: yourself.
- [ ] Wait 10 working days before a polite follow-up.

## Tracking

Open a simple table somewhere (this file, a spreadsheet, or `docs/outreach-log.md`) to track:

| Date sent | Recipient | Status | Reply | Action |
|---|---|---|---|---|

Status values: sent / replied / declined / committed / followed-up.
