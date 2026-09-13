# 11-11 Tech Native Mobile 1.1 — Master Implementation Plan

Status: **CANONICAL IMPLEMENTATION CONTEXT — ACTIVE**  
Owner: 11-11 Tech LLC  
Programme: Native Mobile 1.1 — Product Parity, Visual Storytelling & Commercial Experience  
Branch: `feat/native-mobile-app-1-1-parity`  
Created: 2026-09-13  
Merge policy: **Do not merge to `main` without explicit owner approval after certification and UAT.**

---

## 0. Why this document exists

This file is the primary implementation context for Native Mobile 1.1. Engineers and agents working on this lane must read this document before changing product code.

The mobile implementation must not be driven from chat summaries, isolated screenshots, a phase chart, or the older Native Mobile 1.0 document alone. Those materials may provide evidence, but this document defines the integrated target.

Native Mobile 1.1 exists because simulator UAT proved two things at the same time:

1. the React Native / Expo foundation is genuinely native and technically viable; and
2. the native product has drifted behind the latest 11-11 Tech website/commercial product in content depth, imagery, strategy, legal/commercial capabilities and client/payment workflows.

The goal is therefore not to restart the app. The goal is to preserve the approved native design direction and interaction foundation while bringing it to the same current product truth as the latest 11-11 Tech desktop/PWA and commercial platform.

The governing product principle is:

> **One 11-11 Tech product truth, multiple optimized presentation layers.**
>
> Web and native must share authoritative business content, taxonomy and commercial rules. They may not share platform-specific UI components or blindly copy layouts. Desktop should feel designed for desktop; iPhone/Android should feel designed for touch-native mobile use.

---

## 1. Governing source order

When requirements appear to conflict, use this order of authority:

1. **This file** — Native Mobile 1.1 integrated implementation contract.
2. `docs/commercial-platform/00_MASTER_PLAN_AND_OPERATIONS.md` — commercial, legal, payment, client-workspace and financial invariants.
3. `docs/website-2.0/IMPLEMENTATION.md` — current company taxonomy, content architecture, visual storytelling, progressive disclosure, pricing, trust and strategy rules.
4. `docs/NATIVE_MOBILE_APP.md` — proven Native 1.0 technical architecture, touch, safe-area, accessibility and lead-ingress controls.
5. current implementation on the latest commercial/client-platform branch and current Native 1.0 branch.
6. simulator/physical-device UAT evidence.

Native Mobile 1.0 remains useful architecture history, but any 1.0 statement that says mobile has a separate curated content copy or excludes authenticated client/commercial functionality is superseded by this plan.

---

## 2. Definition of the target product

Native Mobile 1.1 is a real 11-11 Tech iOS/Android application with four responsibilities:

### 2.1 Discover

Explain what 11-11 Tech can change for an organisation through capabilities, solutions, industries, proof, strategy, pricing and visual system stories.

### 2.2 Start

Provide a clean five-stage guided project intake with secure submission, correct routing, legal/procurement questions and transparent fallback states.

### 2.3 Trust

Explain public quality, security, privacy, Responsible AI, accessibility, confidentiality, IP, contracting and delivery principles in native screens. Do not force users back to the website for core public trust information.

### 2.4 Operate a client relationship

Allow authenticated clients to see projects, documents, agreements, invoices, payments, balances, due dates, payment plans and applicable legal acceptance actions from the same authoritative commercial backend as web.

Internal company administration remains desktop-first unless a separately approved mobile admin use case is defined.

---

## 3. Non-negotiable design principles

### 3.1 Preserve the approved 11-11 Tech design language

Native Mobile 1.1 must maintain the design direction already approved in Native 1.0:

- compressed/editorial display typography;
- restrained mono technical labels;
- orange as the main action/signal colour;
- thin structural rules;
- cinematic composition;
- strong contrast;
- edge-aware layouts;
- purposeful motion;
- real maturity/proof labels;
- a technology-company feel rather than a generic app-template feel.

The redesign is refinement and completion, not a replacement with a new visual brand.

### 3.2 Do not turn mobile into a text-heavy rewrite

The desktop/PWA visual system is part of the product specification. Native must retain and reinterpret:

- cinematic hero imagery/video;
- human/context imagery;
- capability-specific editorial imagery;
- industry imagery;
- project/proof visuals;
- global/Tokyo/Africa visual identity;
- technical/system diagrams;
- visual story cards;
- full-bleed editorial pauses;
- motion that explains state, structure or system behaviour.

Text depth must be preserved through **progressive disclosure**, not by deleting detail and not by showing walls of uninterrupted copy.

### 3.3 Same information, different composition

A desktop three-column composition may become on mobile:

1. image or motion field;
2. concise proposition;
3. interactive system diagram;
4. disclosure rows;
5. proof rail;
6. focused CTA.

Native parity means equal product truth and commercial meaning, not identical layout.

### 3.4 Mobile composition changes before typography becomes unreadable

The app must never preserve a grid by squeezing labels until words fragment.

At phone widths:

- capability selection uses full-width rows/cards with natural line lengths;
- labels must not wrap into 3–6 character fragments;
- selected state must not reduce available text width;
- minimum practical touch target is 48dp;
- long titles receive sufficient width before font size is reduced;
- layout collapses from columns to rows before readable typography is sacrificed.

The simulator defect where `Enterprise Systems`, `AI & Automation`, `Transformation`, `Software & Cloud` and similar labels broke into narrow vertical fragments is a release-blocking layout class, not a cosmetic issue.

---

## 4. Visual media and motion contract

### 4.1 Canonical media registry

The existing desktop media system is authoritative. It includes, at minimum:

- hero still and hero video;
- systems;
- builders;
- global;
- intelligence;
- cross-cultural collaboration;
- Tokyo business;
- Harare business;
- UI/UX editorial;
- CRM/enterprise editorial;
- AI editorial;
- cloud editorial;
- transformation editorial;
- talent editorial;
- trust editorial;
- automotive;
- nonprofit;
- media;
- education;
- commerce;
- property;
- abstract editorial;
- global bridge.

Native should consume the same approved media registry through a shared framework-neutral definition where feasible. Platform rendering remains native.

### 4.2 Capability image mapping

The following associations remain canonical:

- UI/UX → UI/UX editorial media;
- Enterprise Systems & CRM → CRM editorial media;
- AI & Intelligent Automation → AI editorial media;
- Software, Data & Cloud → cloud editorial media;
- Digital Transformation → transformation editorial media;
- Technology Talent → talent editorial media;
- Trust, Security & Engineering Assurance → trust editorial media.

### 4.3 Home visual rhythm

The native Home screen must preserve the intent of the website sequence without reproducing its DOM layout:

1. cinematic hero / system field;
2. people + place + technology context;
3. capability theatre/discovery;
4. visual service stories;
5. problem/outcome routing;
6. industry visual exploration;
7. global/Tokyo/Africa full-bleed pause;
8. method / pricing / trust commercial snapshot;
9. focused Start CTA.

### 4.4 Motion rules

Motion is supplemental and purposeful. Use native primitives (Reanimated / platform-native transitions / gesture-driven movement), not browser animation libraries.

Approved motion purposes:

- establish hierarchy;
- reveal system relationships;
- explain state/progress;
- provide touch feedback;
- connect list/detail navigation;
- support horizontal media discovery;
- indicate selection;
- communicate successful completion/failure;
- give cinematic media controlled depth.

Avoid decorative motion that competes with reading or causes navigation uncertainty.

`Reduce Motion` must reduce/disable decorative movement while preserving essential state communication. Haptics remain independent from motion preference.

### 4.5 Legal/payment restraint

Binding-document review, acceptance, invoices and payment authorization use the same brand system but reduce decorative motion and visual distraction. Financial/legal clarity always outranks spectacle.

---

## 5. Theme contract — System / Light / Dark

Native 1.1 must ship with three appearance preferences:

- **System** — default; follows device colour scheme and updates when the OS preference changes.
- **Light** — persistent user override.
- **Dark** — persistent user override.

The theme choice must persist locally and apply consistently to navigation, status bar, sheets, forms, cards, media overlays, legal surfaces, client workspace, payment screens and error/success states.

### 5.1 Semantic tokens

Remove screen-level assumptions such as hardcoded `ink`, `white`, `textOnDark` or permanent light status bars. Components consume semantic values, including:

- background;
- surface;
- elevated surface;
- text primary;
- text secondary;
- text inverse;
- rule/border;
- accent;
- accent-on-accent;
- input background;
- input border;
- selected background;
- navigation background;
- sheet background;
- success;
- warning;
- danger;
- overlay/scrim.

### 5.2 Theme identity

Dark mode:

- ink/charcoal field;
- white/soft-grey typography;
- orange signals;
- cinematic media with controlled dark overlays.

Light mode:

- warm white / paper background;
- dark ink typography;
- warm-grey surfaces;
- orange signals;
- the same cinematic media with contrast-appropriate overlays.

Light mode must not look like an unstyled inversion. Dark mode must not be treated as the only “premium” mode.

---

## 6. Native information architecture

### 6.1 Primary phone navigation

Keep the proven four-tab model:

1. **Home**
2. **Explore**
3. **Work**
4. **Start**

### 6.2 Explore architecture

Explore becomes the principal discovery hub for:

- Capabilities;
- Solutions;
- Industries;
- Pricing;
- Method / How We Work;
- Trust;
- Lab / Vision;
- relevant Insights where appropriate.

Use visual rails, imagery and progressive detail rather than a long text directory.

### 6.3 More / utility architecture

More contains:

- About 11-11 Tech;
- Policies;
- Client Login;
- Pay Invoice;
- Appearance / Preferences;
- contact/support routes;
- external links only where the target is genuinely external.

About, Trust and Policies should no longer be website-only redirects once native parity screens exist.

### 6.4 Authenticated client workspace

After authentication, provide a client-focused surface with:

- Overview;
- Documents;
- Billing;
- Agreement & Pay;
- Projects selector when multiple projects exist.

This may use its own navigation treatment rather than forcing all account tasks into public tabs.

### 6.5 Tablet

Preserve the Native 1.0 tablet rail principle, but adapt richer 1.1 content to tablet rather than simply scaling phone screens. Tablet layouts may use split views, two-column disclosure/detail and persistent contextual navigation where it improves clarity.

---

## 7. Shared product truth architecture (P1)

### Goal

Eliminate content drift between web and native.

### Required work

Create a framework-neutral shared domain/content layer at repository root (exact path may be `shared/` or an equivalent documented package) containing only portable TypeScript data/types and no DOM or React Native imports.

Move or expose shared definitions for:

- capability IDs and full capability narratives;
- service offers and indicative pricing;
- outcomes;
- system-thinking lists;
- implementation lists;
- assurance statements;
- industries and solution taxonomy;
- project/proof taxonomy and maturity labels;
- delivery lifecycle;
- pricing bands and commercial models;
- Trust/public policy taxonomy where appropriate;
- method/strategy structures;
- media registry and media metadata;
- intake classification options;
- commercial display/status vocabulary where it is safe and framework-neutral.

### Constraint

Do **not** share web UI components with React Native. Do **not** import CSS/DOM modules into mobile. Shared truth and platform UI are separate layers.

### Gate

Web and native compile from the same canonical content/types. CI detects taxonomy/content divergence.

---

## 8. Phone layout and typography remediation (P2)

Audit every native screen against compact, standard and large phones.

### Required classes of fixes

- safe-area top protection around Dynamic Island/notches/status bar;
- bottom navigation/home-indicator clearance;
- full-width capability selection rows on phones;
- no premature word fragmentation;
- no clipped display headings;
- no text hidden under navigation bars;
- no fixed card widths that create unusable copy columns;
- correct keyboard avoidance and interactive dismissal;
- correct nested scrolling;
- landscape recomposition;
- Dynamic Type stress testing;
- modal/sheet height and scroll behaviour;
- large touch targets;
- sensible text line lengths;
- image aspect ratio preservation;
- media loading states that do not cause layout collapse.

### Capability selection target

Phone selection should use a structure similar to:

`01  UI/UX & Front-End`  
`    Improve an experience`  
`    selected/check state`

not narrow two-column boxes.

Two columns may return at widths where actual measured text space supports them.

---

## 9. Public product parity (P3–P5)

### 9.1 Capabilities

Each capability detail must support the canonical narrative:

1. See the problem.
2. See the transformation.
3. See the system thinking.
4. See what we implement.
5. See outcomes.
6. See proof.
7. See delivery/assurance.
8. Start the engagement.

Native detail includes:

- proposition;
- problem;
- transformation;
- system thinking;
- implementation;
- outcomes;
- service catalogue;
- indicative price per service;
- proof references;
- assurance;
- starting price / typical range;
- capability-specific media and diagrams.

### 9.2 Pricing

Native Pricing must include:

- public bands;
- service/capability ranges;
- planning/estimation guidance;
- commercial models;
- third-party fee caveats;
- complexity/integration/data/timeline implications;
- procurement/compliance implications;
- explicit non-binding pricing language;
- route to Start.

### 9.3 Method / Strategy

Represent:

**Discover → Design → Build → Launch → Operate → Improve**

with native visual sequencing and disclosures for:

- scope;
- truth/source of authority;
- evidence/testing;
- UAT;
- launch/handover;
- training;
- warranty/support/SLA distinction;
- continuous improvement.

### 9.4 Trust

Native Trust must distinguish three layers:

1. **Public standards** — quality, confidentiality, security/privacy, Responsible AI, IP, accessibility.
2. **Available on request** — NDA, sample MSA/SOW/SLA, DPA, security/procurement pack, AI/data appendix.
3. **Project-specific** — executed agreements, final SOW/SLA, order form/PO, project DPA, change orders, acceptance/handover evidence.

The UI must never imply that public trust copy itself creates a binding contract, warranty or SLA.

### 9.5 Policies

Provide native structured access to:

- Privacy;
- Terms;
- Accessibility;
- Responsible AI;
- Security;
- Data principles.

Use headings/disclosures and readable line lengths. Keep legal notice and contracting boundaries visible.

### 9.6 Lab / Vision

Preserve truth labels for experimental/prototype work. Do not convert R&D signals into fabricated production claims.

---

## 10. Client workspace parity (P6)

Native uses the same Supabase commercial system of record and access model as web.

### 10.1 Authentication

- email magic-link / approved Supabase auth flow;
- secure deep-link return into app;
- no password invention if web uses magic link;
- no local imitation of authenticated state;
- session handling must respect platform secure-storage requirements if persisted.

### 10.2 Overview

Answer immediately:

- what project(s) do I have?
- what is the project value?
- what have I paid?
- what is outstanding?
- what is due next?
- what needs my action?
- where are my documents?

### 10.3 Documents

- private organisation/project scoped records;
- issued versions visible;
- accepted state visible;
- secure view/download;
- superseded versions clearly distinguished where exposed;
- no public storage URLs;
- document version identity must remain authoritative.

### 10.4 Billing

Show:

- invoices;
- payments;
- receipts;
- project value;
- paid amount;
- outstanding balance;
- installments;
- next due;
- payment-plan state;
- recurring service state where applicable.

Use **Outstanding balance** / **Project balance**, not credit terminology.

---

## 11. Legal acceptance and payment choreography (P7)

The native flow must preserve the commercial platform invariants. No shortcut is allowed because the app is mobile.

### 11.1 Required sequence

**Project summary → Choose approved payment option → Required documents → Open/review documents → Explicit document acknowledgements → Separate scheduled/recurring charge authorization where required → Final amount/schedule review → Secure Stripe payment → Server-confirmed return → Updated workspace**

### 11.2 Legal evidence

Acceptance is server-authoritative and attached to the actual issued document/version and authenticated client identity. A local checkbox is UI state only until accepted through the controlled backend boundary.

Accepted versions are immutable historical evidence. New wording creates a new version; it does not rewrite prior acceptance.

### 11.3 Auto-charge consent

A stored payment method is never equivalent to permission for arbitrary future charges. Scheduled or recurring authorization must be separate, explicit and recorded.

### 11.4 Stripe boundary

Native does not collect/store raw card data and does not contain Stripe secret keys.

Preferred boundary:

- native prepares/validates project + selected plan + accepted legal state through controlled backend;
- backend creates approved Stripe Checkout session;
- app opens Stripe-hosted secure checkout using platform-safe browser/auth-session tooling;
- Stripe webhook updates Supabase;
- native deep link returns the user to an intermediate confirmation state;
- native refreshes the server-authoritative workspace before claiming payment success.

Never trust a client-side return URL alone as proof of payment.

### 11.5 Existing client Pay Invoice journey

Minimum flow:

1. invoice/project reference + billing email or authenticated entry;
2. authentication;
3. resolve only records visible to that user;
4. show invoice/project, amount, due date and balance;
5. show outstanding legal gate if applicable;
6. continue through Stripe;
7. webhook reconciliation;
8. updated invoice/payment/receipt in workspace.

### 11.6 Legal activation gate

Repository templates and legal modules are operational scaffolding until qualified legal review approves the production wording applicable to the engagement/jurisdiction. The app must distinguish system readiness from legal approval readiness.

---

## 12. Commercial/security invariants

Native must preserve all commercial platform invariants, including:

1. no orphan payment;
2. agreement before first payment unless authorised external execution is recorded;
3. accepted historical document versions are immutable;
4. explicit auto-charge consent;
5. client tenant isolation;
6. explicit admin authority;
7. Supabase owns product commercial state; Stripe is payment processor/reconciliation source, not the product ledger;
8. money uses integer minor units + ISO currency;
9. commercial documents remain private;
10. audit/acceptance/financial evidence is append-oriented where practical.

No service-role key, Stripe secret, webhook secret, email-provider secret or equivalent privileged credential may exist in the native bundle.

---

## 13. Start / lead journey parity

Keep the proven five-stage native intake and its security controls, while aligning its choices and content to the shared canonical taxonomy.

Stages remain:

1. business outcome;
2. capability/service/industry/current systems/problem;
3. budget/timeline/engagement model;
4. contact + legal/procurement requirements;
5. classified brief review + submit.

Improve step 2 layout so capability choices remain readable on compact devices.

Preserve:

- bounded fields;
- email validation;
- consent validation;
- idempotent submission;
- double-submit prevention;
- safe URL validation;
- transparent fallback;
- no privileged client secret;
- public business reference rather than internal DB identifier.

---

## 14. Imagery implementation requirements

### 14.1 Network media

The approved remote media should remain the canonical content where licensing/availability permits. Native needs:

- loading placeholders/skeletons;
- cached image rendering where supported;
- failure fallback that preserves layout;
- explicit aspect-ratio containers;
- alt/accessibility descriptions where the media conveys meaning;
- `accessible={false}` or equivalent when imagery is purely decorative;
- safe performance on cellular networks.

### 14.2 Video

Hero/video implementation must:

- show a still/poster immediately;
- avoid blocking first meaningful render;
- autoplay muted/loop only where platform policy/performance allows;
- pause when screen/app is inactive;
- obey Reduce Motion by preferring the poster/still;
- not consume unnecessary resources behind other routes.

### 14.3 Technical diagrams

Where the website uses conceptual diagrams, native should reimplement the visual logic with native primitives/animation. Do not screenshot web UI solely to avoid implementing a responsive diagram.

### 14.4 Truth labeling

Real screenshots, generated editorial imagery, conceptual system diagrams, prototypes and project evidence must remain honestly labelled according to what they represent.

---

## 15. Accessibility and manoeuvrability (P9)

The app must be easy to navigate one-handed and with assistive technology.

Required checks:

- 44–48dp minimum targets for primary touch controls;
- correct VoiceOver/TalkBack role, label, hint, state and selected semantics;
- sensible focus order;
- modal accessibility isolation;
- screen title/route announcements where useful;
- Dynamic Type / large-font stress testing;
- text must reflow without critical clipping;
- sufficient contrast in both themes;
- Reduce Motion;
- keyboard dismissal and avoidance;
- visible errors associated with fields;
- no colour-only status communication;
- landscape usability;
- tablet navigation clarity;
- clear back/cancel semantics;
- no gesture-only critical action without an accessible equivalent.

Financial/legal controls require especially explicit labels and state descriptions.

---

## 16. Error, loading, offline and recovery design

Every networked customer journey requires explicit states:

- loading;
- empty;
- retryable network error;
- authorization expired;
- record unavailable;
- server validation error;
- external checkout cancelled;
- payment processing/pending confirmation;
- payment failed;
- successful server-confirmed state.

Never display success optimistically for legal acceptance or payment when the server has not confirmed it.

The public content/proof experience should degrade gracefully when an image/video cannot load. A failed visual asset must not make navigation unusable.

---

## 17. Deep-link and app-link contract

Native 1.1 must define and test stable links for at least:

- authentication callback;
- project/client workspace;
- invoice/payment entry;
- payment return;
- capability deep links;
- project/proof deep links.

Link handling must reject malformed/untrusted payloads and resolve authoritative record visibility server-side after authentication.

App identifiers/store ownership must be confirmed before production association-file/domain work is treated as final.

---

## 18. CI and parity gates (P10)

CI must fail on meaningful web/native drift.

Minimum automated gates:

### 18.1 Shared-domain parity

- capability IDs identical across surfaces because they come from shared source;
- service offers/pricing compile from shared source;
- project maturity labels shared;
- industries/solutions/outcomes shared;
- delivery lifecycle shared;
- media mappings shared;
- intake capability allow-list consistent with server/database allow-list.

### 18.2 Native quality

- strict TypeScript;
- Expo Doctor;
- iOS bundle export;
- Android bundle export;
- web export smoke only as development compatibility, not product equivalence;
- dependency/security audit policy;
- static checks for forbidden privileged secrets;
- theme semantic-token invariants;
- no hardcoded global dark background in root navigation;
- required native routes exist;
- commercial API configuration remains public-only.

### 18.3 Journey tests

Automate as much as practical for:

- theme selection/persistence;
- capability selection at compact width;
- Start progression/validation;
- client login state handling;
- document review/acceptance readiness;
- payment-plan readiness;
- checkout boundary creation;
- deep-link payment return handling;
- server refresh before success state.

### 18.4 Backend regression

Existing commercial backend/RLS/payment/document invariant checks continue to run when native client changes touch shared contracts.

---

## 19. Device UAT matrix (P11)

Certification must include, at minimum:

### iOS

- compact iPhone class (for example 17e-class dimensions);
- standard iPhone;
- large/Pro Max class;
- iPad mini;
- large iPad/tablet;
- portrait + landscape where supported.

### Android

- compact phone;
- standard phone;
- large phone;
- tablet;
- gesture navigation;
- common keyboard variations where practical.

### Cross-cutting scenarios

- System / Light / Dark;
- text size default + large accessibility size;
- Reduce Motion;
- VoiceOver/TalkBack;
- slow image/video network;
- offline/retry;
- keyboard-heavy Start flow;
- background/foreground app lifecycle;
- authentication deep link;
- expired session;
- legal document review;
- payment-plan selection;
- checkout cancel;
- checkout return pending webhook;
- confirmed payment;
- failed payment;
- document download/view;
- multiple projects;
- no-project empty account;
- tablet rail/split composition;
- Dynamic Island/notch/home-indicator safe areas.

UAT findings are logged and classified. Release blockers are resolved before merge.

---

## 20. Implementation phases P1–P11

The programme is executed in this order unless a dependency requires a documented adjustment.

### P1 — Shared authoritative product/domain layer

- integrate Native 1.0 code into the 1.1 branch while retaining latest commercial branch changes;
- extract/define framework-neutral shared content/types;
- wire web to shared data without visual regression;
- wire native to shared data;
- add parity invariants.

**Gate:** one product truth; both clients compile.

### P2 — Mobile layout, safe-area and typography remediation

- repair capability selection;
- audit all screens for early wrapping/fixed-width problems;
- repair safe areas and navigation overlap;
- establish responsive measurement helpers;
- compact/standard/large phone tests.

**Gate:** no known critical clipping or word-fragmentation defects.

### P3 — Native IA and visual storytelling restoration

- rebuild Home/Explore structure around canonical desktop visual rhythm;
- shared media registry;
- image-first cards/rails;
- hero poster/video strategy;
- industry/capability imagery;
- global visual pauses;
- native motion patterns.

**Gate:** native no longer feels text-heavy or visually detached from PWA.

### P4 — Capability + Pricing parity

- full capability narrative;
- service catalogue;
- pricing/ranges;
- proof;
- assurance;
- visual system diagrams;
- native pricing surface.

**Gate:** customer receives equivalent capability/commercial depth on mobile.

### P5 — Method / Strategy / Trust / Policies / Lab parity

- native Method;
- native Trust;
- native Policies;
- native Lab/Vision;
- contracting/procurement entry points;
- truth labels.

**Gate:** core public company/trust information no longer depends on leaving the app.

### P6 — Native client authentication/workspace

- auth/deep-link session;
- Overview;
- Projects;
- Documents;
- Billing;
- account/session controls.

**Gate:** authenticated tenant-scoped client data works against shared backend.

### P7 — Agreement + payment experience

- payment-plan selection;
- required document review;
- acceptance evidence;
- explicit scheduled/recurring authorization;
- Stripe-hosted checkout boundary;
- return/deep link;
- server-authoritative refresh;
- payment states/receipt access.

**Gate:** no legal/payment invariant bypass from mobile.

### P8 — Complete System / Light / Dark theme system

Theme architecture may begin earlier as enabling infrastructure, but P8 is the closure gate:

- semantic tokens throughout;
- persisted preference;
- System default;
- status/navigation/sheets/forms/media overlays;
- all public/client/legal/payment surfaces certified in both modes.

**Gate:** no dark-only screen and no illegible theme state.

### P9 — Accessibility, ergonomics and motion hardening

- VoiceOver/TalkBack;
- Dynamic Type;
- Reduce Motion;
- haptics independence;
- touch targets;
- keyboard;
- focus semantics;
- navigation clarity.

**Gate:** accessibility checklist passes on representative iOS/Android devices.

### P10 — Automated certification and regression protection

- parity tests;
- native CI exports;
- journey/invariant tests;
- commercial regression checks;
- secret/config checks;
- documentation updates.

**Gate:** all required CI green at frozen candidate SHA.

### P11 — Full UAT, native binary and release readiness

- simulator matrix;
- physical-device UAT where available;
- standalone development/release build (not Expo Go only);
- EAS production build readiness;
- Apple/Google identifier/credential checks;
- controlled live/test commercial journey according to environment activation status;
- final gap register.

**Gate:** owner UAT approval required before merge/release.

---

## 21. Integration strategy for the current branch topology

At programme start, the latest commercial/client-platform branch and Native 1.0 branch diverged from a common earlier base. Native 1.1 intentionally starts from the latest commercial/client-platform state so that new payment/client/legal work is not discarded.

The Native 1.0 mobile implementation must be integrated into this branch carefully rather than replacing root files wholesale.

Rules:

- preserve latest commercial migrations/functions/web client platform;
- import/merge the `mobile/` application from Native 1.0;
- reconcile root `package.json`, workflows, docs and shared files deliberately;
- do not erase commercial CI or Native 1.0 CI controls;
- retain hardened lead ingress and migration-history correctness;
- document any conflict resolution that changes behaviour;
- keep `main` untouched until explicit merge approval.

---

## 22. What remains web-first by design

Parity does not mean reproducing every internal browser surface.

Remain web/desktop-first unless separately approved:

- company admin console;
- bulk commercial operations;
- template management;
- operational reconciliation tooling;
- complex internal reporting.

Customer-facing project/client functionality belongs in native. Internal administration requires an explicit mobile business case.

---

## 23. Release blockers

The following block Native Mobile 1.1 merge/release:

- stale duplicated product content;
- core public information missing from native without a deliberate approved exception;
- unreadable/clipped typography at supported phone sizes;
- unsafe safe-area overlap;
- incomplete Light or Dark mode;
- inaccessible critical controls;
- tenant isolation regression;
- privileged secret in bundle;
- legal acceptance bypass;
- payment authorization bypass;
- client-side-only payment success claim;
- direct card handling outside approved Stripe boundary;
- unversioned legal acceptance;
- unresolved high-severity security finding relevant to runtime;
- failing iOS or Android production bundle;
- missing payment/auth deep-link validation;
- uncontrolled web/native taxonomy drift;
- owner UAT rejection.

---

## 24. Definition of done

Native Mobile 1.1 is done only when:

1. web/native use one authoritative product/domain truth;
2. approved PWA imagery and visual storytelling are present in native form;
3. native remains recognisably 11-11 Tech in System, Light and Dark;
4. no known early-wrap/fragmented-text class remains on supported phone sizes;
5. safe areas, keyboards, rotation and tablets are intentionally handled;
6. capability, pricing, strategy, Method, Trust, Policies and proof have customer-facing parity;
7. Start uses current taxonomy and secure lead boundary;
8. client authentication/workspace works through the shared commercial backend;
9. documents, billing, balances and payment plans are server-authoritative;
10. legal acceptance is explicit, versioned and auditable;
11. scheduled/recurring payment authorization is separate and explicit;
12. Stripe remains the secure payment processor; Supabase remains the product commercial record;
13. payment confirmation is webhook/server-authoritative;
14. accessibility/motion preferences are respected;
15. CI prevents future parity drift;
16. iOS + Android builds pass;
17. simulator/device UAT completes with no unresolved release blocker;
18. final candidate SHA is frozen and documented;
19. `main` is not changed until the owner explicitly approves merge.

---

## 25. Implementation behaviour for agents

Any agent continuing this programme must:

1. read this file first;
2. read the governing commercial and website implementation documents relevant to the task;
3. inspect current code before changing it;
4. preserve truth labels and commercial/security invariants;
5. avoid fabricating a completed payment/legal/backend state;
6. keep product UI genuinely native;
7. treat imagery/motion as product requirements, not optional polish;
8. test both themes and compact phone widths for UI changes;
9. update documentation when architecture/invariants change;
10. leave `main` untouched without explicit owner instruction.

If implementation reality conflicts with this plan, record the conflict and update this document deliberately rather than silently drifting from it.
