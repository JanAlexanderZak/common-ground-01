# Assessment: Prototype Fund fit + "agentic contract" framing

**Date:** 2026-05-04
**Subject:** Can `common_ground` (per [implementation_plan.md](implementation_plan.md)) be submitted to Prototype Fund Class 03 (01.10.–30.11.2026), and is "agentic pre-requisite contract for agentic models and discussion" a good framing?

> Note: prototypefund.de blocks WebFetch (403). The user pasted the live "How to apply?" page contents — used below to verify the May-2026 summary in [implementation_plan.md §8](implementation_plan.md). Re-confirm directly before drafting the Vorhabenbeschreibung.

### Live-site verification (verified 2026-05-04 from pasted page contents)

| Item | Plan §8 | Live site | Match |
|---|---|---|---|
| Application window | 01.10.–30.11.2026 | 01.10.2026 – 30.11.2026 | ✓ |
| Selection period | — | 01.12.2026 – 01.03.2027 | new |
| Funding period | start 01.06.2027 | 01.06.2027 – 01.12.2027 (6 mo) | ✓ |
| Second-stage period | 10 mo total | 01.12.2027 – 31.03.2028 (+4 mo) | ✓ |
| 6-mo cap (team) | 47.5k solo | 95k team (so 47.5k solo) | ✓ |
| Second-stage cap | 79.17k solo total | 63k team / 4 mo (so ~31.5k solo / 4 mo) | ✓ |
| Pillars | Software Infrastructure + Data Security | same — no Civic Tech, no AI-specific track | ✓ |
| Solo dev / GbR for teams up to 4 | solo path planned | confirmed | ✓ |
| FOSS license | required | "open source license" required | ✓ |
| Resident DE, self-employed/freelancer | Freiberufler open decision | confirmed | ✓ |
| Jury criteria | not in plan | innovation, feasibility, social benefit, **no double funding** | new |

**No surprises.** The plan's funding mechanics survive contact with the live site.

### Two passages from the live site that matter for framing

1. **Software Infrastructure definition:** *"Software infrastructure refers to the tools, e.g. code libraries or standardized implementations of protocols, that are necessary for developers to write programs for users and make them usable. Corresponding software projects are therefore generally not aimed at end users but at programmers."*

   The pivot reads cleanly against this: spec + `common_ground` library on PyPI + `common-ground-web` component on npm = code library + standardized protocol implementation, aimed at programmers. **The Schuldenbremse website is the part that risks tripping this filter** — it is end-user-facing. The application must position the website explicitly as a *reference deployment / demo of the toolchain*, with the spec/library/component as the funded deliverables. The plan already says this in [§7 risks](implementation_plan.md); make sure every line of the Vorhabenbeschreibung honours it.

2. **No double funding criterion:** *"Has the basic idea of the project already been elsewhere, or is a similar product already available with open source code?"*

   This forces an explicit **Argdown response** in the application. Argdown is FOSS, alive (v2 + Argunauts Feb 2025), and overlaps. The differentiation arguments are real and already documented in [implementation_plan.md §1](implementation_plan.md) and [state_of_the_art_assessment.md](state_of_the_art_assessment.md): single-file vs. multi-file/cross-repo; untyped vs. L0–L4; authoring-focused vs. programmable substrate; no first-class actor attribution; no data references; no AI-agent profile. **Promote this from scattered mentions to a named "differentiation" sub-section in the Vorhabenbeschreibung.**

3. **Innovation definition** — the live page links to a specific definition the jury uses ("we use this definition of innovation"). The user didn't paste that page; **fetch it before drafting V07–V08**.

---

## Part 1 — Can it be submitted?

**Short answer: yes, the project is squarely submittable, and the May-2026 pivot to Software Infrastructure was the correct move. The remaining risks are execution risks, not eligibility risks.**

### Hard eligibility (per implementation_plan.md §8)

| Requirement | Status |
|---|---|
| FOSS license from day 1 | Owed — open decision #1 (AGPL recommended). Tractable. |
| Solo dev, ≤6 months, ≤950h, €47.5k cap | Plan sized to fit. |
| 5% own contribution evidenced | ~€2,375 — flagged in §7 risks. Tractable. |
| Quarterly arrears, ~3 months self-finance | ~€14k buffer planned. Tractable. |
| Application window 01.10.–30.11.2026 | Phase A weeks 14–18 already aligned. |
| 12-point Vorhabenbeschreibung + 3 × 2,000-char DE summaries | Drafting scheduled in Phase A weeks 14–18. |
| Freiberufler status | Open decision #7 — start now (multi-week lead time). |

None of these are blockers. They are all owed work that the existing plan already schedules.

### Pillar fit (Software Infrastructure)

This is where the May-2026 pivot did the real work, and it lands.

The Fund's stated anti-pattern is "a single-use app … is not really software infrastructure." The pivot positions the funded artifact as **format spec + Python library (`common_ground`) + web component (`common-ground-web`) + central actor registry**, with the political-deliberation website demoted to *reference deployment*. That's textbook infrastructure framing: a substrate other projects can adopt, not an end-user product.

Specifically:
- **Multi-tenant by design.** The format describes *any* layered argument graph; Schuldenbremse is one of N example topics.
- **Composability.** Argdown import/export (WP4), AIF as a recommended add (per [state_of_the_art_assessment.md §1](state_of_the_art_assessment.md)) — explicit interop with the existing FOSS argumentation ecosystem.
- **Library + spec, not platform.** PyPI package, npm component, JSON schema, conformance fixtures.

Lingering smell: the funded period delivers reference content (Schuldenbremse) and a deployed website. A jury that reads carelessly can still re-read this as "civic-tech app dressed up as infrastructure." [implementation_plan.md §7 risks](implementation_plan.md) acknowledges this and recommends leading every communication with the spec/library/component as the deliverable.

### What still meaningfully reduces application risk

In priority order, before submission:

1. **Adopter signal beyond yourself.** The single most credible jury signal. Recommended pre-application moves are already in the plan: DebateLab/KIT outreach (Jul 2026), AI-research outreach (Aug 2026), editorial board commitments (≥2 by Sep 2026). Treat at least one of these as non-optional.
2. **Phase A live demo.** Per Section 5/6 — a working Cloudflare-Pages-deployed Schuldenbremse graph at submission time materially derisks jury point 6 (prior work).
3. **Theoretical grounding paragraph.** Per [state_of_the_art_assessment.md §1](state_of_the_art_assessment.md), L0–L4 isn't a recognised standard. One paragraph citing Habermas + Walton + Toulmin in the Vorhabenbeschreibung handles this.
4. **Differentiation framing.** The strongest single sentence is the gap claim: no existing platform combines structured argument graphs with first-class actor attribution + grounded data + AI-agent participants. (Pol.is clusters; Kialo/Argdown map; nobody ties them together — and none treat AI agents as actors.)
5. **Data sovereignty.** If the application mentions any LLM, name the EU-hostable production fallback (Teuken-7B / Mistral) explicitly.

**Verdict:** submittable. The plan as written is application-ready in skeleton; the open execution items (Phase A milestones, outreach, license, Freiberufler) are tractable in the available 18 weeks.

---

## Part 2 — Is "agentic pre-requisite contract for agentic models and discussion" a good direction?

**Short answer: no, not as the primary framing. Yes, as a sharpened secondary angle — but only if you give the word "contract" actual engineering teeth.**

### What I read into the phrase

"Agentic pre-requisite contract" = a protocol that an AI agent MUST satisfy to participate in human deliberation: identity (`@claude` actor record), grounded provenance (every L0/L1 claim has a verifiable source), layered output (claim is typed L0/L1/L2/L3/L4), conformance-checkable (validator can reject non-conformant agent output).

This is a stronger version of what the existing plan already says: "the format is a protocol for human–AI mixed deliberation."

### The case FOR pushing the framing harder

1. **Closes the infrastructure question definitively.** "Spec + library + validator that any agent SDK must satisfy to produce machine-readable, attributed argumentation" is unambiguously software infrastructure. The "is this a website?" objection cannot be raised against an interop contract.
2. **Real, current gap.** AIF, Argdown, IBIS — all human-authoring formats. None encodes agent identity, agent attestation, or conformance for agent-produced content. As LLM-mediated public discourse spreads in 2026, the absence of a provenance contract for agent-generated arguments is a real public-interest hole.
3. **Funder-aligned.** Software Infrastructure pillar + 2026 zeitgeist around agent governance + EU data-sovereignty narrative all point the same direction. Adjacent funders (NLnet/NGI0, Mercator, AI4Deliberation Horizon EU) have explicit AI/deliberation programs.
4. **Public-interest defense without being civic-tech.** "Without this, agent-generated arguments flood public discourse without provenance" is a strong civic-impact story that frames the artifact as infrastructure preventing harm, not as a debate site.

### What the live site adds to this question

The Software Infrastructure pillar definition is purely about "code libraries or standardized implementations of protocols … aimed at programmers." There is **no AI-specific track, no AI-deliberation track, no agent-infrastructure track**. The funder is not signalling "we want AI agent projects." They are signalling "we want libraries and protocols."

That cuts both ways:
- It means the agent-contract framing has to earn its keep as *protocol* work, not as AI-zeitgeist work. "Standardized protocol for typed argument graphs with first-class agent participation" lands. "Agentic pre-requisite contract for AI deliberation" leans on a buzzword that the jury is not specifically primed for.
- Adjacent funders (NLnet/NGI0, Mercator) are more agent-pilled than PTF. Use them in the sustainability section, not the pitch.

### The case AGAINST making it primary (the honest pushback)

1. **You already pivoted once. A second pivot looks like trend-chasing.** Going from "Schuldenbremse deliberation site" → "Markdown infrastructure for argument graphs" → "agentic contract for AI deliberation" inside six months reads as buzzword-following. PTF juries have seen this shape before. Their mental model becomes "this person reframes their project to fit whatever sounds fundable."
2. **"Contract" is overloaded and currently overpromises.** In software, "contract" implies enforceable: TLA+, type contracts, smart contracts, conformance-blocked APIs. Today the plan ships a Markdown spec + parser + JSON schema. Calling that an agent contract is true in the protocol-design sense and overstated in the engineering sense. A jury that reads carefully will ask: where's the validator? what happens when `@gpt-5` submits a non-conformant graph? does the parser reject it?
3. **It distances the project from your stated motivation.** Memory: "Driven by the underlying problem (political deliberation as a real concern), not the funding. Funding is means; the problem is the goal." Reframing the artifact as agent infrastructure makes the political-deliberation use case secondary in the narrative — which is fine for a jury, but bad if it shapes what you actually build during 6 funded months.
4. **Civic-tech-in-disguise smell test.** The original pivot was driven by Civic Tech being cut from the Fund. If the final framing is "infrastructure for AI agents in political debate," a hostile reading is "civic tech with an AI coat of paint." The defense against that reading is the spec + library + interop story — exactly what's already in the plan.
5. **AI-agent salience cuts both ways.** [state_of_the_art_assessment.md §3](state_of_the_art_assessment.md) cites Jungherr 2025: visible AI participation reduces participant trust ("AI penalty"). Foregrounding "AI agents as discussion participants" risks the jury reading the project as part of the problem rather than the solution.

### What I'd actually do

**Keep the existing framing as primary. Sharpen the agent angle as a clearly-scoped secondary deliverable.** Concretely:

- Primary framing stays: "FOSS toolchain (spec + Python library + web component + actor registry) for typed, layered, evidence-grounded argument graphs."
- AI agents stay where they are now: one class of actor (alongside government agencies, parties, research institutes), with first-class IDs and attribution, because machine-readable provenance was always the point.
- Add **one concrete deliverable that earns the word "contract"**: a conformance validator + an explicit "Agent Producer Profile" sub-spec in [implementation_plan.md WP1](implementation_plan.md) (already mentioned in §6 as "AI-agent producer profile" — promote it from a sub-bullet to a named deliverable). This says: "any agent claiming to participate via this protocol must produce output that passes the validator." That is a contract with teeth.
- In the Vorhabenbeschreibung, name the public-interest framing once, prominently: "as LLM-mediated public discourse spreads, this format is the substrate for verifiable, attributed agent participation in human deliberation." Don't rebuild the whole pitch around it.

This way the framing question is answered by what you build, not by adjective inflation.

### If you decide to lean further into "agent contract" anyway

Two non-negotiable upgrades, otherwise the framing is unsupported:

1. **Validator as a Phase A deliverable.** A `common_ground.validate(topic_dir)` function that returns conformance errors. Today this is in `src/common_ground/validator/` as deferred. To call this an agent contract you must ship the validator in Phase A.
2. **One reference agent integration.** A small example showing an LLM (Claude / Mistral / Teuken) producing a conformant `.md` topic, validated, and rendered. ~2 weeks; could replace some Phase B WP7 hours. Without it, "agent contract" is theoretical.

Without those two, "agentic pre-requisite contract" is marketing. With them, it's defensible.

---

## Recommendation

1. **Submit.** Eligibility and pillar fit are not the problem. Execution and adopter signal are.
2. **Don't promote "agentic contract" to primary framing.** Keep argument-graph infrastructure primary; keep AI-agent participation as a strong, specific secondary thread.
3. **If you want the agent angle to carry more weight, add the validator + one reference agent integration** — both small, both make the existing framing more defensible without a rebrand.
4. **Live-site verification done** for funding mechanics, pillars, timeline, and criteria — all match the May-2026 summary. Two follow-ups remain: (a) fetch the Fund's specific definition of "innovation" before drafting V07–V08; (b) re-check just before submission in case anything shifts in 2026 H2.
5. **Add an explicit Argdown-differentiation sub-section** to the Vorhabenbeschreibung to satisfy the "no double funding" criterion head-on. The arguments are already in the docs; just lift them to a named section.

---

## Critical files referenced

- [implementation_plan.md](implementation_plan.md) — full design; §1 pivot rationale, §6 WPs, §7 risks, §8 funding mechanics, §13 sources.
- [state_of_the_art_assessment.md](state_of_the_art_assessment.md) — competitive landscape, theoretical grounding, AI penalty evidence.
- [progress.md](progress.md) — current Phase A status (weeks 1–2 in progress).

## Verification

This is an assessment, not an implementation task. To verify the conclusions:

1. Open the live Prototype Fund site (https://www.prototypefund.de/en/funding, https://prototypefund.de/en/apply/notes/) and confirm: pillars (Software Infrastructure + Data Security still open), application window (01.10.–30.11.2026), funding cap (€47.5k / 950h solo), 5% own contribution, OSS-from-day-1.
2. Cross-check the May-2026 Section 8 summary in [implementation_plan.md](implementation_plan.md) against current Fund text. Note any drift.
3. If the agent angle is being promoted: confirm the validator is added to Phase A scope and one reference agent integration is scheduled, otherwise the "contract" framing is unsupported.
