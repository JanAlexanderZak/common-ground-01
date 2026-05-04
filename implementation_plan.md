# Implementation Plan — Political Common-Ground Argument Graph

**Audience:** solo native Python developer, first real website
**Strategy:** build a credible Schuldenbremse demo before the Prototype Fund application (Oct–Nov 2026), then expand into a full platform during funded development (June–Nov 2027).

---

## 1. Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Backend framework | **Django 5.x** | Batteries-included; ORM, admin, auth, migrations, i18n, deployment story all solved |
| API | **Django REST Framework** | Only for endpoints the React graph view consumes |
| DB | **Postgres 16** | Recursive CTEs for graph traversal; pgvector later for embeddings |
| Auth | **django-allauth** | Email + magic link; social login plug-in for Phase B |
| Background jobs | **Django-Q2** or **Celery + Redis** | Defer until Phase B (LLM/embedding jobs) |
| Templates / interactivity | **Django templates + HTMX + Alpine.js** | Keep Python-first for non-graph pages |
| Styling | **Tailwind CSS** | Works in both Django templates and React |
| Graph UI | **React + Vite + TypeScript + React Flow (xyflow)** | Best editable node-graph library; mounted as an "island" in one Django template |
| Argument source format | Custom Markdown/YAML hybrid (Phase A) → **Argdown CLI subprocess** (Phase B) | Stay in Python initially; integrate the official Argdown parser only when needed |
| Hosting | **Hetzner Cloud CX22** (~€4–6/mo) + Caddy + Gunicorn | Cheapest credible EU host; Railway/Fly.io if you want zero ops |
| Deployment | **Docker Compose** on a single VPS | Avoids stack sprawl; one box runs Postgres, Django, Caddy |
| Monitoring | Sentry free tier + UptimeRobot | Enough for MVP |
| LLM (Phase B only) | **Anthropic API** for quality, **sentence-transformers + pgvector** for embeddings | Stays in EU/keeps GDPR manageable |

**Repo layout:**
```
common-ground/
├── backend/          # Django project
│   ├── core/         # settings, urls
│   ├── graph/        # statements, edges, topics
│   ├── accounts/     # auth (Phase B)
│   └── voting/       # agree/disagree (Phase B)
├── frontend/
│   └── graph-view/   # Vite + React + React Flow
├── content/
│   └── schuldenbremse.md   # the curated topic source
├── docker-compose.yml
└── deploy/           # Caddyfile, systemd unit, etc.
```

---

## 2. Data model (MVP)

```python
# graph/models.py — sketched, not literal

class Topic(models.Model):
    slug = CharField(unique=True)
    title_de = CharField()
    title_en = CharField(blank=True)
    description = TextField()

class Statement(models.Model):
    LAYERS = [
        (0, "L0 Empirical fact"),
        (1, "L1 Stylized fact"),
        (2, "L2 Causal/mechanism claim"),
        (3, "L3 Value claim"),
        (4, "L4 Policy position"),
    ]
    topic = ForeignKey(Topic)
    layer = IntegerField(choices=LAYERS)
    text_de = TextField()
    text_en = TextField(blank=True)
    source_url = URLField(blank=True)        # required for L0/L1
    source_label = CharField(blank=True)     # e.g. "Destatis 2024"
    canonical = BooleanField(default=False)  # editorial-approved
    created_at, created_by = ...

class Edge(models.Model):
    TYPES = [
        ("supports", "supports"),
        ("attacks", "attacks"),
        ("qualifies", "qualifies"),
        ("instantiates", "instantiates"),
        ("uses_as_evidence", "uses-as-evidence"),
        ("value_justifies", "value-justifies"),
    ]
    source = ForeignKey(Statement, related_name="outgoing")
    target = ForeignKey(Statement, related_name="incoming")
    edge_type = CharField(choices=TYPES)
    weight = FloatField(default=1.0)         # for layout & later inference
    created_at, created_by = ...
```

Keep it ruthlessly minimal until it hurts. Do **not** add: comments, votes, AIF export, multi-language fallback logic — Phase B work.

---

## 3. Phase A — Pre-funding solo build (May → Sep 2026)

**Goal:** a deployed read-only demo of the Schuldenbremse graph that visibly demonstrates the layered facts→values→policy model. This is the demo you link in the Vorhabenbeschreibung.

### Milestones (≈18 weeks, evenings/weekends compatible)

**Weeks 1–2: Skeleton**
- Django project, Postgres, Docker Compose locally
- One `Topic` with title "Schuldenbremse", admin registered
- Vite + React Flow scaffold rendering a hardcoded 5-node graph in a Django template
- Deploy "hello world" to Hetzner with Caddy + HTTPS

**Weeks 3–4: Data model + admin**
- `Statement` and `Edge` with layer/edge-type choices
- Django admin polished enough to author by hand
- Management command: `loaddata schuldenbremse.json` for seeding

**Weeks 5–7: Author the seed graph**
- Write the Schuldenbremse content in a flat Markdown file you parse yourself
- Format example:
  ```
  ## L0 Facts
  - [f1] Article 109 Grundgesetz limits structural deficit to 0.35% GDP. (source: Bundestag)
  - [f2] Germany's debt-to-GDP was 62.4% end-2023. (source: Destatis)

  ## L2 Causal claims
  - [c1] Higher public debt raises long-term interest rates.
    - evidence: f2
    - attacks: c4

  ## L4 Policy positions
  - [p1] Germany should reform Schuldenbremse to allow X% deficits for investment.
    - supports: c1, v3
  ```
- Write a Python parser. Aim for **80–150 nodes**, hand-curated with sources for L0/L1
- This is research-heavy work — budget real time

**Weeks 8–11: The graph UI (your differentiator)**
- React Flow with custom node components per layer
- Visual language:
 - L0/L1 = grey/blue, anchored at bottom; L2 = orange middle; L3 = purple; L4 = red top
 - Edge types styled differently (solid green = supports, dashed red = attacks, dotted = qualifies)
- Auto-layout with **dagre** or **ELK.js**, layered top-to-bottom by layer
- Click a node → side panel with full text, source link, neighbours
- Filter toggles: "show only L0–L2" (factual sub-graph) vs "show all"
- Mobile: gracefully degrade to a simpler tree-list view (graph editing on mobile is a known UX trap)

**Weeks 12–13: "Where do I disagree?" personal overlay**
- No accounts yet — store user's per-statement stance (agree/disagree/uncertain) in `localStorage`
- Highlight in the graph
- Killer feature: "trace down" — given a contested L4 policy, show which underlying L2/L3 nodes drive your disagreement. This is the UX innovation no one else does cleanly.

**Weeks 14–15: Public deploy + tester round**
- Domain, HTTPS, basic SEO/OG tags
- Plausible Analytics (privacy-friendly, GDPR-ok)
- Send to 10–20 testers across the political spectrum
- Specific question: "Can you locate the *layer* where you disagree?"
- Iterate

**Weeks 16–18: Application prep**
- Get/confirm Steuernummer as Freiberufler if not already
- Write Vorhabenbeschreibung (12-point template) — see §6 below for what to emphasize
- Three 2000-char German summaries
- Submit Oct–Nov 2026

### What you ship at the end of Phase A

A live URL where a visitor can see the Schuldenbremse argument graph laid out in 5 colored layers, mark their own beliefs, and trace where their L4 disagreement comes from at L1/L2/L3. **This is the application's strongest asset.**

---

## 4. Phase B — Funded sprint (June → Nov 2027)

950 hours / 6 months / ~36h per week. Below is a work-package breakdown that maps directly into the Vorhabenbeschreibung's point 8.

| WP | Title | Hours | Milestone |
|---|---|---|---|
| WP1 | Auth + user accounts (django-allauth, magic link, optional verified tier) | 60 | Users can sign up and have a profile |
| WP2 | Contribution flow: propose statement, propose edge, edit history | 100 | Anyone with an account can propose; moderator approves |
| WP3 | Moderation tools (queue, public moderator log, Wikipedia-style reverts) | 60 | Single-moderator workflow viable |
| WP4 | Voting (agree/disagree/uncertain) per statement | 70 | Vote stored, shown back to user, aggregated |
| WP5 | LLM dedup at submission (pgvector + multilingual embedding model) | 90 | New statement → top-5 nearest existing → user confirms or merges |
| WP6 | LLM layer classification suggestion | 50 | Model proposes L0–L4 for new statement, human verifies |
| WP7 | Pol.is-style clustering: PCA + k-means on votes, nightly recompute | 100 | 2-D opinion landscape per topic, 2–4 clusters |
| WP8 | "Common ground" view: cross-cluster consensus statements | 60 | Weekly digest of statements >70% agreement across clusters |
| WP9 | Bilingual DE/EN: translation + cross-language dedup | 80 | Same statement in DE and EN deduplicated automatically |
| WP10 | Argdown import + export | 50 | Topic round-trips to .argdown file |
| WP11 | 3 more curated topics seeded (with editorial board) | 100 | e.g. migration, energy policy, Bürgergeld |
| WP12 | Governance charter, accessibility audit (WCAG AA), GDPR/DSGVO docs | 40 | Required by Prototype Fund for utilization plan |
| WP13 | Documentation, public launch, community building | 90 | Demo Day deliverable |
|  | **Total** | **950** |  |

### Optional Second Stage (Nov 2027 → Mar 2028, +€31,667)

Pitch in month 4 of WP1–13. Use the 4 extra months for:
- Habermas-Machine-style consensus drafting on demand
- Talk-to-the-City-style cluster chatbots
- One real partnership (school via Aula, municipality via Decidim instance, or bpb)
- Sustainability plan: foundation grants (Mercator, Bertelsmann), donations, gGmbH formation

---

## 5. Risks and mitigations (Vorhabenbeschreibung point 4)

| Risk | Mitigation |
|---|---|
| Schuldenbremse content too partisan to demo neutrally | Editorial board approach (Wahl-O-Mat model); cite official sources for all L0/L1 claims; show your seed graph to political-science contacts before launch |
| React Flow can't handle large graphs smoothly | Cap visible nodes; lazy-load by layer; fall back to Cytoscape.js if >2000 nodes per topic becomes real |
| LLM dedup hallucinates / wrong layer classification | Always human-in-the-loop; show confidence; never auto-merge or auto-classify |
| Single-moderator burnout (you) | Phase B WP3 includes peer-review; cap topics at 1 until a contributor base exists |
| Prototype Fund thematic shift (data security focus) | Frame the project explicitly as **public-interest software infrastructure for democratic deliberation**, not "social platform" |
| GDPR on political opinions (Art. 9 special-category data) | Pseudonymous default; opt-in for cluster analysis; data minimization; consult bpb/Mercator legal contacts |
| You stay employed elsewhere during funding | Get written Nebentätigkeit permission *before* applying |

---

## 6. Application positioning (what wins on this jury)

The Vorhabenbeschreibung's point 3 — "What similar approaches exist and what will your project do differently or better?" — is where most apps fail. Use the research already done:

- **Kialo / Argüman** — flat pro/con; no fact/value/policy distinction
- **Argdown** — text format only, no community
- **DebateGraph** — typed graphs but dormant since ~2016
- **Pol.is** — cross-cluster consensus but no argument structure
- **LiquidFeedback / Adhocracy / Decidim** — participation, not argumentation
- **No active German-language argument-graph community exists**

Your differentiation in one sentence:
> *Eine öffentliche, mehrsprachige Plattform, die politische Argumente in einer Schichtenstruktur von empirischen Fakten über Wertaussagen bis zu Politikvorschlägen organisiert, sodass Nutzer:innen erkennen können, **auf welcher Ebene** sie tatsächlich uneins sind — und wo sie übereinstimmen.*

---

## 7. Open questions / assumptions I made

These would change the plan if wrong — flag if any are off:

1. **Deployment experience.** I assumed you can ship a Dockerised Django app to a VPS with reasonable comfort. If this is genuinely your first deploy ever, add 2–3 weeks to Phase A and consider Railway/Fly.io for the first 6 months.
2. **Time per week before Oct 2026.** I assumed ~10–15h/week (evenings/weekends). Full-time would compress Phase A to 8–10 weeks. Strict weekend-only adds ~6 weeks.
3. **Currently a Freiberufler in DE.** If not, factor in Finanzamt registration (~2–4 weeks) before applying.
4. **LLM budget for Phase A.** I made Phase A LLM-free. The research demo you build before the application doesn't need any AI; it needs the layered model and the "trace down" UX to land.
5. **Solo throughout.** A single co-applicant doubles the funding cap (€95k) but adds GbR formation overhead and SCHUFA checks over €90k.

---

## 8. Next concrete actions

1. Decide whether to do Hetzner-from-day-one or Railway-first (deploy comfort)
2. Spin up the Django + React Flow skeleton this week — it's the single biggest unknown
3. Start drafting Schuldenbremse seed content in parallel (research-heavy, can happen offline)
4. Block the Oct–Nov 2026 application window in your calendar; set a reminder for Sep 2026 to verify the official call thematic focus
5. If not yet a Freiberufler in DE, start that registration **now**
