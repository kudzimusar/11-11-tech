# 11-11 Tech Website 2.0 — Implementation Record

Status: implementation lane for the 2.0 public website and client-acquisition architecture.

## 1. Objective

Website 2.0 repositions 11-11 Tech from a site that can be mistaken for a web-development studio into a technology transformation company with a coherent commercial portfolio.

The public experience must answer, in order:

1. What can 11-11 Tech change for my organization?
2. Which capability or solution applies to my problem?
3. What specifically can be implemented?
4. What organizational outcome should I expect?
5. What relevant technology work demonstrates the pattern?
6. What does a typical engagement cost?
7. How are quality, confidentiality, contracting and service commitments handled?
8. What is the next commercial step?

The website is therefore a sales, discovery, proof and trust system—not a gallery of pages.

## 2. Canonical company taxonomy

The seven primary capability divisions are:

1. **UI/UX & Front-End Engineering** — UX audit, product modernization, front-end engineering, design systems, interaction/motion and operational UX.
2. **Enterprise Systems & CRM** — CRM, DRM, GRM, case management, membership, portals, workflow and relationship systems.
3. **AI & Intelligent Automation** — AI strategy, custom assistants, agents, conversational systems, RAG, automation, document intelligence, voice/multimodal AI, integration and governance. This practice is model-agnostic.
4. **Software, Data & Cloud Engineering** — applications, platforms, APIs, integrations, data, analytics, cloud, DevOps and modernization.
5. **Digital Transformation & Technology Advisory** — audits, process redesign, roadmaps, architecture, fractional leadership, training and adoption.
6. **Technology Talent & IT Recruitment** — IT recruitment, RPO, technical screening, talent intelligence and technical team building.
7. **Trust, Security & Engineering Assurance** — identity, permissions, privacy, verification, evidence, QA, UAT, release certification and architecture review.

The source of truth for this taxonomy is `src/data/portfolio.ts`.

## 3. Universal capability narrative

Every capability uses the same commercial structure while retaining a distinct visual language:

1. **See the problem** — show the broken, fragmented, slow or risky current state.
2. **See the transformation** — show the target operating or experience state.
3. **See the system thinking** — expose the people, workflows, data, interfaces, controls and technology underneath.
4. **See what we implement** — expandable service catalogue with examples and indicative investment.
5. **See the outcomes** — translate technology into organizational change.
6. **See the proof** — attach relevant work from the 22-project portfolio.
7. **See delivery and assurance** — quality, confidentiality, acceptance, security and support expectations.
8. **Start the engagement** — route the prospect into a preclassified intake flow.

This is implemented in `src/pages/CapabilityDetail.tsx` using `Disclosure.tsx` and `CapabilityVisual.tsx`.

## 4. Progressive disclosure rule

2.0 must remain concise at first glance. Detailed information is never removed merely to make the page look minimal; it is placed behind deliberate, accessible disclosure.

Rules:

- Level 1: short proposition and outcome.
- Level 2: service family, example and price range.
- Level 3: deep capability narrative and portfolio proof.
- Level 4: contracting, assurance and project intake.
- Accordions use real buttons with `aria-expanded` and associated panels.
- Mobile layouts must not require horizontal scrolling.
- Motion is supplemental and respects `prefers-reduced-motion`.

## 5. Client discovery architecture

A prospect can enter the portfolio from five directions:

- **Capability** — what 11-11 Tech can do.
- **Solution** — a specific service a client can buy.
- **Industry** — the operating environment in which the system must work.
- **Business outcome / problem** — what the client is trying to change.
- **Portfolio proof** — a project that demonstrates a relevant pattern.

These paths converge on the same canonical taxonomy rather than duplicate content.

The home-page Solution Finder begins with outcomes such as improving UX, introducing AI, replacing manual work, connecting data, hiring technology talent or improving trust/release quality.

## 6. Portfolio proof model

The 22 projects are not presented as a fabricated client roster. They remain explicitly labeled by maturity: experiment, prototype, active build, advanced build, client review, pilot readiness and other real states.

`src/data/projectTaxonomy.ts` maps each project to:

- capabilities,
- solutions,
- industries,
- outcomes,
- transferability.

The Work page and Portfolio Constellation allow capability-driven exploration.

The commercial question is not only “what did we build?” but “what does this demonstrate that can transfer to your organization?”

## 7. Pricing architecture

The public commercial framework is:

- **Discover / Improve** — US$2,000–3,500.
- **Design / Implement** — US$3,500–6,000.
- **Build / Transform** — US$6,000–10,000.
- **Enterprise / Custom** — from US$10,000.

Capability and service pages provide more specific indicative ranges. Pricing is non-binding and changes with complexity, integrations, data, timeline, third-party usage, procurement and compliance requirements.

Technology Talent supports recruitment-specific commercial models such as monthly RPO, project fees and agreed placement/success fees.

Commercial models supported by the site:

- fixed-scope project,
- discovery + implementation,
- monthly product/technology partnership,
- recruitment / RPO,
- enterprise custom.

## 8. Trust and legal architecture

The central Trust Center is the canonical public explanation of contracting and assurance.

### Public

- quality and delivery principles,
- confidentiality approach,
- security/privacy principles,
- responsible AI principles,
- IP approach,
- accessibility principles,
- public policies.

### Available on request to qualified prospects

- mutual NDA template,
- sample MSA,
- sample SOW,
- sample SLA,
- DPA,
- security/procurement pack,
- detailed AI/data-handling appendix.

### Project-specific

- executed NDA/MSA,
- final SOW,
- final SLA/support schedule,
- order form/PO,
- project-specific DPA,
- change orders,
- acceptance/handover records.

The website must not imply that public content itself creates a binding SLA, warranty or contract. Legal templates require appropriate jurisdiction-specific review before production use.

## 9. Client intake

The project intake is a classified five-stage flow:

1. business outcome,
2. capability/service/industry/current systems/problem,
3. budget/timeline/engagement model,
4. contact and legal/procurement requirements,
5. classified project-brief review.

The current static GitHub Pages implementation intentionally keeps the data on-device until the visitor chooses to open an email draft or copy the brief. No API key or private service credential is exposed in the browser.

A future secure intake backend may add database storage, notifications, analytics and CRM routing, but only behind a server-side boundary.

## 10. 11-11 delivery lifecycle

The operating lifecycle is:

**Discover → Design → Build → Launch → Operate → Improve**

This supports both project and recurring revenue. Launch does not automatically terminate the client relationship.

Potential recurring engagements include managed technology, product improvement, UX optimization, AI monitoring/optimization, application maintenance, support and fractional technology leadership.

## 11. 11-11 Accelerators

The site introduces reusable methods rather than pretending every engagement begins from a blank file:

- 11-11 UX Health,
- 11-11 AI Ready,
- 11-11 Relationship Core,
- 11-11 Trust Layer,
- 11-11 Launch Gate,
- 11-11 Talent Map.

These are delivery frameworks/reusable intellectual property, not unsupported software-product claims.

## 12. Corporate and strategic-partner story

The Company page explains a multi-model business architecture:

- project implementation,
- consulting/advisory,
- recurring managed improvement,
- recruitment/talent,
- reusable IP and technology portfolio.

It also exposes the technology ecosystem as tools 11-11 Tech works with. It must not call a company an official partner unless that relationship genuinely exists.

Investor/strategic-partner content must not invent revenue, client numbers, valuations or traction.

## 13. Navigation

Primary desktop architecture:

- Capabilities (mega menu)
- Solutions
- Industries
- Work
- Insights
- Company
- Start a Project

Secondary commercial links are exposed through the footer and relevant pages:

- Pricing
- Trust Center
- Method
- 11-11 Lab
- Policies
- Legal / Procurement

## 14. Footer information architecture

The footer acts as a complete data directory rather than a decorative end state:

- all seven capabilities,
- solution catalogue,
- industries,
- pricing,
- Work / proof,
- method,
- insights,
- company,
- Lab,
- Trust Center,
- public policies,
- legal/procurement route,
- project intake,
- public email,
- service regions,
- GitHub,
- data and contracting information.

## 15. Visual and interaction system

The existing cinematic media language is retained and extended with purposeful interactive systems.

Signature visual grammar:

- UI/UX — user → journey → interface → state → system → outcome.
- Enterprise — customers/members/partners → relationship core → workflow/data/action.
- AI — input → model → knowledge → tools → human → action.
- Software/Data/Cloud — web/mobile → API → logic → data → cloud → observability.
- Transformation — people → process → systems → data → automation → intelligence.
- Talent — role → skills → source → assess → match → onboard.
- Trust — identity → access → evidence → audit → test → verify.

Visuals must explain system behavior rather than decorate the page. Real screenshots, conceptual demonstrations, generated imagery and animated technical diagrams must be labeled truthfully according to what they are.

## 16. SEO and discoverability

2.0 has dedicated static GitHub Pages documents and metadata for core routes and all seven capability pages.

`sitemap.xml` includes the expanded information architecture.

The global title and description position 11-11 Tech around UI/UX, enterprise systems, AI, software/data/cloud, transformation, technology talent and trust.

## 17. Certification gates

A 2.0 release is not complete until:

- TypeScript passes,
- production build passes,
- all declared static routes exist,
- CSP remains hardened,
- browser tests show no runtime errors,
- desktop and mobile routes have no horizontal overflow,
- home media and interaction paths work,
- capability disclosures work,
- portfolio filtering and project dialogs work,
- the classified client intake works and preserves state,
- mobile navigation remains keyboard-safe,
- runtime dependency audit has no high-severity failure.

## 18. Deferred / future server-backed work

The following are deliberately not claimed as implemented by the current static site:

- server-side CRM lead storage,
- Supabase lead database,
- automated Resend notifications,
- calendar booking automation,
- authenticated client portal,
- signed-document workflow,
- live SLA/support ticketing,
- private investor data room,
- production analytics/consent stack.

They can be added after the public 2.0 information architecture is certified, using secure server-side boundaries.

## 19. Truth standard

The public site must never fabricate:

- customers,
- production deployments,
- partnerships,
- certifications,
- commercial traction,
- revenue,
- investor relationships,
- service guarantees,
- legal validity of unreviewed templates.

The 11-11 Tech standard remains: **Build what matters. Prove what works.**
