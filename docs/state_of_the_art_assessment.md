# Is the Common-Ground Implementation Plan State-of-the-Art?

**Assessment date:** May 2026
**Subject:** [implementation_plan.md](../implementation_plan.md) — political argument-graph platform, pre–Prototype Fund demo

## Context

This document assesses whether the technical choices in the implementation plan represent state of the art as of May 2026. Each major dimension of the plan was evaluated against authoritative sources (academic conferences, project sites, the MTEB leaderboard, *Science*/arXiv papers) and is reported with a graded verdict and specific upgrades to consider.

**Caveat on freshness:** Some very specific version numbers returned by web search (e.g. exact `pgvector 0.9` or `Django 6.0.4`) should be re-verified against the official release notes before coding — LLM-mediated web search occasionally fabricates point-version numbers. The directional findings below are well-cited and reliable.

---

## Bottom line

**Mostly state-of-the-art, with three concrete upgrades and one strategic correction.**

| Dimension | Verdict |
|---|---|
| Backend / web stack (Django + HTMX + Alpine + React island) | **SOTA** |
| Graph visualisation choice (React Flow / xyflow + dagre) | **SOTA for your scale** |
| Vector store choice (pgvector in Postgres) | **SOTA for solo, simplifies ops** |
| Embedding model choice (sentence-transformers MPNet/LaBSE) | **Dated — upgrade to Jina v3 or BGE-M3** |
| LLM choice for Phase B (Anthropic API) | **GDPR-risky for political-opinion data — consider EU-hosted Mistral/Qwen/Teuken** |
| 5-layer L0–L4 fact→value→policy model | **Novel design, not a recognised standard** |
| Pol.is-style clustering description | **Mostly correct — add silhouette-based k auto-selection** |
| Differentiation claim ("nobody combines argument graphs + opinion clustering") | **Genuine gap; AI4Deliberation EU project hints at it but is not yet public** |
| "No active German argument-graph community" | **Overstated — UKP Darmstadt and DebateLab@KIT are active in argument mining; no consumer tool, true** |
| Argdown integration via subprocess | **Reasonable; Argdown is alive (v2 + Argunauts LLMs Feb 2025)** |

You are not building something dated. The plan is defensible against a Prototype Fund jury that knows the field.

---

## Section-by-section assessment

### 1. Computational argumentation frameworks (your L0–L4 model)

**State of the art.** AIF (Argument Interchange Format) remains the de-facto interchange standard, maintained by ARG-tech (Dundee). ASPIC+, Carneades, Toulmin and Walton's argumentation schemes form the live academic stack — confirmed by COMMA 2024 (Hagen, 10th biennial conference) and the 12th Argument Mining Workshop at ACL 2025. Recent direction is incremental: applying classical frameworks to LLMs and explainability rather than inventing new formalisms.

**Your plan vs. SOTA.** Your 5-layer model (empirical fact → stylized fact → causal claim → value claim → policy) does **not map to any single canonical framework**. Toulmin separates data/claim/warrant but does not tier facts vs values; Walton's schemes treat type as orthogonal to polarity; Habermas' validity claims come closest but have never been operationalised in an argument-mining tool. Your layering is **a defensible design choice, not a recognised standard** — which is fine, but expect questions from academics. Citing Habermas explicitly in the Vorhabenbeschreibung will help.

**Recommendation.** Keep the layering. Add an AIF export pathway in Phase B WP10 alongside Argdown — it costs little and unlocks academic tool interoperability (OVA3, etc.). Cite Walton & Habermas in the application narrative so reviewers see the theoretical grounding, even if the specific 5-tier scheme is yours.

Sources: [COMMA 2024 proceedings](https://ebooks.iospress.nl/volume/computational-models-of-argument-proceedings-of-comma-2024), [ARG-tech AIF](https://www.arg.tech/index.php/research/contributing-to-the-argument-interchange-format/), [Walton et al., *Argumentation Schemes* (Cambridge)](https://www.cambridge.org/core/books/argumentation-schemes/9AE7E4E6ABDE690565442B2BD516A8B6).

### 2. Argument visualization tools — competitive landscape

**Alive and active in 2026:** Kialo Edu (1M+ users, BETT 2025 award), Argdown (v2, plus the *Argunauts* open LLMs trained on Argdown released Feb 2025 by DebateLab@KIT), OVA3 (ARG-tech, AIF-native, released 2024–2025), bCisive (commercial). **Dormant:** DebateGraph (last meaningful activity ~2016, your plan is right). **Research prototypes:** ArgLLM-App (arXiv 2025), PAKT perspectivized argument knowledge graph (arXiv 2024).

**Verdict.** Your competitive framing in §6 is mostly accurate. The one claim to soften: "no active German-language argument-graph community" — academic groups at TU Darmstadt UKP and KIT DebateLab are very active in *argument mining* in German (corpora, models, the Argunauts initiative). What's missing is a *consumer-facing public-deliberation tool* in German. That's the gap you actually fill — phrase it that way.

Sources: [Argdown v2](https://argdown.org/), [Argunauts on Hugging Face](https://huggingface.co/blog/ggbetz/argunauts-intro), [OVA3](https://ova.arg-tech.org/), [UKP ArgumenText](https://www.informatik.tu-darmstadt.de/ukp/research_ukp/ukp_research_projects/ukp_project_argumentext/index.en.jsp), [Argument Mining Workshop 2025 (ACL Vienna)](https://argmining-org.github.io/2025/).

### 3. Deliberation tech (Pol.is, Talk to the City, Habermas Machine)

**Pol.is method check.** Your description says "PCA + k-means". The actual method per Small et al. 2021 ([Polis: Scaling Deliberation by Mapping High-Dimensional Opinion Spaces](https://gwern.net/doc/sociology/2021-small.pdf)) is PCA reduction → k-means with **silhouette-coefficient auto-selection over k=2..5**. Add the silhouette step in WP7; without it you'll either over- or under-cluster.

**Habermas Machine.** Confirmed: Tessler et al., "AI can help humans find common ground in democratic deliberation," *Science*, 18 Oct 2024 ([doi:10.1126/science.adq2852](https://www.science.org/doi/10.1126/science.adq2852)). Open-source code at [google-deepmind/habermas_machine](https://github.com/google-deepmind/habermas_machine). 5,700-participant UK study; AI mediation outperformed humans on consensus, clarity, minority representation. **Watch out:** Jungherr (2025) documented an "AI penalty" — visible AI mediation reduces participant trust. T3C-style transparent grounding (every output linked to source quotes) mitigates this.

**Talk to the City.** Operational; deployed in vTaiwan AI-governance deliberations (Dec 2024, fed into Taiwan's draft AI Basic Act) and the OpenAI-funded Recursive Public initiative.

**Genuine gap.** I found **no existing platform that combines structured argument graphs with Pol.is-style opinion clustering**. Pol.is and T3C aggregate opinions; Kialo and Argdown map arguments; nobody ties them together. AI4Deliberation (Horizon EU project, 2025–2027, ARG-tech) has hinted at this in its public materials but no tool is published yet. **This is your real differentiation — frame the Vorhabenbeschreibung around it.**

Sources: [Tessler et al. 2024 Science](https://www.science.org/doi/10.1126/science.adq2852), [Polis 2021 methods paper](https://gwern.net/doc/sociology/2021-small.pdf), [Talk to the City](https://talktothe.city/), [vTaiwan + T3C case study (People Powered)](https://www.peoplepowered.org/news-content/digital-participation-case-study-taiwan), [Jungherr "AI Penalty" 2025](https://andreasjungherr.net/2025/03/12/new-working-paper-artificial-intelligence-in-deliberation-the-ai-penalty-and-the-emergence-of-a-new-deliberative-divide/), [Stanford Deliberative Democracy Lab](https://deliberation.stanford.edu/).

### 4. Argument mining / LLM-NLP choices (Phase B, WP5–WP6, WP9)

**Embedding model — upgrade.** Your sentence-transformers MPNet/LaBSE choice was SOTA in 2022; in 2026 it is dated. Top of the [MTEB multilingual leaderboard](https://huggingface.co/spaces/mteb/leaderboard) is now **Jina Embeddings v3** (570M params, Apache 2.0, 8K context) and **BGE-M3** (Alibaba, dense + sparse + multi-vector). Both are open-weight, EU-hostable, and meaningfully better on DE/EN paraphrase tasks. **Action:** swap in Jina v3 or BGE-M3 in WP5; same pgvector pipeline, no architectural change.

**Layer classifier — your approach is fine.** Zero-shot LLM classification with human-in-the-loop is appropriate for L0–L4 because you have no labelled corpus. Hybrid cost optimisation (small encoder for triage, LLM for edge cases) is worth it later. Recent argument-mining SOTA is dominated by fine-tuned Llama 3.1 / Gemma 2 (87.52 F1 on argument segmentation per ArgMining 2025), but you don't have the data to fine-tune in Phase B.

**LLM provider — GDPR risk.** Anthropic API for political-opinion data triggers GDPR Article 9 (special-category data). For a one-shot, no-training, human-in-the-loop classifier the legal exposure is lower, but for the Prototype Fund jury — which weighs data sovereignty heavily — Anthropic is a weak signal. **EU-hostable alternatives that work in 2026:** Mistral Large 3 (Apache 2.0, France), Qwen 3.x (Apache 2.0, runnable on EU infra), Llama 3.x/4 (community licence, watch DACH terms), **Teuken-7B from Fraunhofer** (German-native, OpenGPT-X consortium — directly relevant to your funder narrative). **Action:** keep Anthropic for prototyping, but commit in the application to a self-hosted EU model for production. Mention Teuken explicitly.

**Cross-lingual DE↔EN.** Annotation projection (T-Projection, 2024) beats zero-shot cross-lingual transfer. For a small project, fine-tuning on translated data is overkill — multilingual embeddings + per-language LLM prompts will be enough.

Sources: [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard), [Jina Embeddings v3](https://jina.ai/models/jina-embeddings-v3/), [BGE-M3 paper](https://arxiv.org/html/2402.03216v3), [Large Language Models in Argument Mining survey (arXiv 2506.16383)](https://arxiv.org/html/2506.16383v4), [Teuken / OpenGPT-X (Fraunhofer)](https://opengpt-x.de/), [GDPR Art. 9 + LLMs analysis](https://gdprlocal.com/large-language-models-llm-gdpr/).

### 5. Web tech stack (Django + HTMX + Alpine + React island)

**Django + HTMX + Alpine + Tailwind + React-island-for-the-graph.** This is **explicitly back in fashion in 2026** — the canonical "HTML-first" stack that came out of the JavaScript-fatigue backlash. Not dated. Not a quirky choice. Production-validated.

**React Flow (xyflow).** Still the best DX for editable layered graphs at your scale (~150 nodes for the Schuldenbremse demo, up to ~2000 before you need to worry). Alternatives: Cytoscape.js for graph algorithms, Sigma.js (WebGL) for >10k nodes, G6 (AntV) — none beat xyflow for your use case.

**Auto-layout.** dagre is essentially unmaintained (last meaningful release 2018) but still works for ~150 nodes. **d3-dag** is the actively-maintained alternative. Use dagre for the demo; migrate later if needed.

**pgvector.** Right call for a solo Python dev. At the eventual 50k–500k vectors with HNSW indexing, pgvector outperforms most alternatives on throughput per dollar and avoids running a second database. Reconsider only if you cross ~10M vectors.

**DRF vs django-ninja.** For a single-consumer React island, **django-ninja** (async-first, Pydantic, less boilerplate) is the lighter modern choice. DRF is fine and battle-tested; either is defensible.

**Hetzner CX22 vs Railway/Fly.io.** Hetzner is cheapest if you're comfortable with Caddy + Gunicorn + Compose. If you're not, the "extra" few euros for Railway/Fly buy you back 2–3 weeks of deployment learning. The plan itself flags this in §7 question 1 — answer it honestly before week 1.

**Argdown.** Alive (v2, KIT-supported, Argunauts foundation models). CLI integration via Node.js subprocess is the realistic path; `pyargdown` exists but isn't mature.

Sources: [Django release notes](https://docs.djangoproject.com/en/stable/releases/), [xyflow / React Flow](https://reactflow.dev/), [pgvector](https://github.com/pgvector/pgvector), [Argdown GitHub](https://github.com/christianvoigt/argdown).

---

## Specific edits to the plan I would recommend

These are non-structural — the plan's overall shape is sound. Make these changes in [implementation_plan.md](../implementation_plan.md):

1. **§1 stack table — embedding row.** Replace `sentence-transformers` with `Jina Embeddings v3 (open-weight) or BGE-M3` and note the MTEB ranking.
2. **§1 stack table — LLM row.** Add: "EU-hosted Mistral/Qwen/Teuken-7B for production; Anthropic for prototyping only — Art. 9 GDPR exposure for political-opinion data."
3. **§1 API row.** Note django-ninja as a lighter alternative to DRF for single-consumer islands.
4. **§4 WP7 (Pol.is clustering).** Add silhouette-coefficient auto-selection over k=2..5 (Small et al. 2021 method).
5. **§4 WP10 (Argdown import/export).** Add AIF export alongside Argdown — small effort, real interoperability win.
6. **§6 differentiation paragraph.** Re-frame: instead of "no active German argument-graph community," say "no German-language consumer-facing public-deliberation tool combines structured argumentation with cross-cluster consensus." This is defensibly true and stronger.
7. **§6 add the genuine gap claim.** "No existing platform — Pol.is, Talk to the City, Habermas Machine, Kialo, Argdown — combines structured argument graphs with opinion clustering. AI4Deliberation (Horizon EU, ARG-tech, 2025–2027) is the only project hinting at this combination, and no tool is yet published." This is your strongest single sentence for the jury.
8. **§5 risks — add an "AI penalty" row.** Cite Jungherr 2025: visible AI mediation reduces trust; mitigate by T3C-style transparent grounding (every AI output linked to source statements).
9. **§5 risks — strengthen the GDPR row.** Mention Teuken-7B (Fraunhofer/OpenGPT-X) and Mistral as production fallbacks.
10. **§3 Phase A weeks 8–11 — graph performance check.** Prototype with ~300 nodes early (not just the planned 80–150) so you find React Flow's actual ceiling before week 14.

---

## What this verdict means for the Prototype Fund application

Your stack and architectural choices are not where the application will fail. The risk areas are:

- **Theoretical grounding of the L0–L4 model.** Reviewers may ask why these five tiers and not Toulmin's six elements or Walton's schemes. Have a one-paragraph answer ready, citing Habermas + Walton.
- **Differentiation framing.** Lean hard on the structured-arguments + opinion-clustering combination. That's the genuine gap.
- **Data sovereignty.** Be explicit that production LLM inference will be EU-hosted (Mistral / Teuken). This matters to the Prototype Fund jury.
- **Demo realism.** A live Schuldenbremse graph with the "trace down" UX (your §3 weeks 12–13) is more persuasive than any technical claim. Prioritise that.

---

## Re-validation before submission

To validate the upgrades recommended here before committing to them:

- Re-check the current MTEB leaderboard at https://huggingface.co/spaces/mteb/leaderboard for Jina v3 / BGE-M3 ranking.
- Re-check current pgvector / Django / React Flow versions at the official release pages cited above (some specific point-version claims in this report come from web-search summaries and may have drifted).
- Look for any 2026 publication from AI4Deliberation (https://www.arg.tech/) to confirm the "no public combined tool" gap is still accurate before submission.
