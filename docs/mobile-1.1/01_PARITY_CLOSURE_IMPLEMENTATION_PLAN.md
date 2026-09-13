# 11-11 Tech Native Mobile 1.1 — Parity Closure Implementation Plan

Status: **READY FOR IMPLEMENTATION — OWNER APPROVAL REQUIRED BEFORE CODE CHANGES BEGIN**  
Owner: 11-11 Tech LLC  
Programme: Native Mobile 1.1 — Product Parity, Visual Storytelling & Commercial Experience  
Authoritative branch: `feat/native-mobile-app-1-1-parity`  
Authoritative PR: **#11 — `feat: close commercial payments and align native client parity`**  
Date: 2026-09-13  

---

## 0. Purpose and authority

This document is the execution-level closure plan for the remaining Native Mobile 1.1 parity work.

It is a mandatory companion to `docs/mobile-1.1/00_MASTER_IMPLEMENTATION_PLAN.md`.

The master plan defines the product, design, commercial and security contract. This document removes implementation ambiguity by defining:

- what is already complete;
- what remains incomplete;
- why each remaining item exists;
- which items are repository engineering work versus external deployment/activation work;
- the exact implementation order;
- the authoritative source-of-truth architecture;
- required CI gates;
- the UAT entry criteria;
- branch/PR handling;
- the exact conditions under which the work may be declared complete.

If this document and the master plan appear to conflict, the master plan remains authoritative for product intent and invariants. This document is authoritative for execution order and closure criteria.

No implementation agent may treat a chat summary, screenshot or older Native Mobile 1.0 assumption as a substitute for these two documents.

---

## 1. Current state — what is already complete

The following work is considered implemented in the integrated branch and must be preserved while parity closure proceeds:

### 1.1 Native foundation

- Expo SDK 57 / React Native 0.86 compatible application foundation.
- Xcode 27 / iOS 27 simulator viability confirmed by owner UAT.
- Four-tab native navigation foundation: Home, Explore, Work, Start.
- Native safe-area and touch-first architecture from Native Mobile 1.0.
- Five-stage native lead/start journey and hardened lead ingress.

### 1.2 Commercial/payment closure

- exact authenticated invoice settlement path;
- project/payment-plan commercial routing;
- agreement-before-payment enforcement;
- immutable/version-aware legal acceptance boundary;
- explicit scheduled/recurring payment authorization;
- extra-payment outstanding-balance protection;
- manual/offline payment outstanding-balance protection;
- branded manual-payment receipt creation;
- authorized Stripe PaymentMethod binding for scheduled installments;
- tenant-scoped client workspace data access;
- authenticated short-lived private document links;
- Stripe-hosted Checkout boundary;
- webhook-authoritative payment reconciliation;
- no client-side payment-success claim based only on redirect;
- lead/prospect organisation deduplication hardening;
- web and native access to the same Supabase commercial system of record.

### 1.3 Commercial platform principle

The following remains non-negotiable throughout closure:

> **Supabase is the product commercial system of record. Stripe is the payment processor and reconciliation source.**

Native and web may present state differently but may not implement different commercial rules.

---

## 2. Why the remaining items are incomplete

The remaining items are not primarily blocked by Supabase.

They exist because the latest Native Mobile 1.1 master plan broadened the definition of parity from “native shell + lead journey + commercial client access” to:

> **One 11-11 Tech product truth, multiple optimized presentation layers.**

The desktop/PWA currently contains a richer and more current product model than the original native implementation. Examples include full service catalogues, pricing, capability transformation narratives, system-thinking lists, assurance statements, industries, solutions, media/storytelling metadata, trust material, method content and policy content.

The older native implementation still contains separate reduced copies of some of this information.

Therefore the remaining work is a real product-architecture closure task, not a cosmetic checklist and not an external-account blocker.

The required response is to remove duplicated truth and complete the missing native presentation layers before final owner UAT.

---

## 3. Authoritative branch and PR policy

### 3.1 PR #11 is the integrated closure lane

`feat/native-mobile-app-1-1-parity` / PR #11 is the authoritative lane for the remaining parity work because it contains:

- the latest desktop/web product state;
- the commercial/client/payment platform work originating from PR #10;
- the Native Mobile 1.0 foundation;
- Native Mobile 1.1 commercial integration;
- the current parity master plan.

### 3.2 PR #10 is a foundation, not a competing implementation lane

PR #10 must not continue to evolve independently in ways that cause divergence from PR #11.

The remaining closure work belongs in PR #11.

Before merge, the owner will decide whether PR #10 is closed as superseded by #11 or handled through another explicit Git history strategy. No automatic merge of either PR is authorized by this plan.

### 3.3 `main` remains untouched

Do not merge to `main` until:

1. repository implementation gates are green;
2. a final candidate SHA is frozen;
3. desktop + iPhone owner UAT passes;
4. the owner explicitly approves merge.

---

## 4. Closure scope — repository engineering work that must now be completed

The following workstreams are **not external blockers** and must be resolved in the repository before final UAT.

---

## P1 — Shared authoritative product/domain layer

### Goal

Eliminate independent web/native copies of product truth.

### Required architecture

Create a framework-neutral repository-root package/directory, preferred target:

```text
shared/
  capabilities.ts
  pricing.ts
  industries.ts
  solutions.ts
  projects.ts
  method.ts
  trust.ts
  policies.ts
  media.ts
  intake.ts
  commercial-display.ts
  index.ts
```

The exact module split may change during implementation if documented, but the architectural rule may not change:

**business/product truth lives once; platform UI lives separately.**

### Data that must become shared

At minimum:

- capability IDs;
- full capability narratives;
- transformation statements;
- system-thinking lists;
- implementation lists;
- outcomes;
- service offers;
- indicative service pricing;
- starting prices and typical ranges;
- assurance statements;
- industries;
- solutions;
- business outcomes;
- proof/project taxonomy;
- project maturity/truth labels;
- delivery lifecycle;
- pricing bands;
- commercial-model descriptions suitable for public display;
- method/strategy structures;
- trust/public-policy taxonomy;
- approved media registry metadata;
- intake classification options;
- shared safe display/status vocabulary for commercial state.

### Platform boundaries

Allowed:

```text
web React -> shared data/types
React Native -> shared data/types
```

Forbidden:

```text
React Native -> web components/CSS/DOM
web -> React Native components
shared -> DOM APIs
shared -> React Native APIs
```

### Migration rule

The current richest/current source is used to construct the canonical shared truth. Reduced mobile copies must not become the canonical source merely because they already exist.

### Completion gate

P1 is complete only when:

- web compiles from the shared source;
- mobile compiles from the shared source;
- old duplicate authoritative data files are deleted, reduced to documented adapters, or proven non-authoritative;
- CI detects reintroduction of divergent taxonomy/content definitions.

---

## P2 — Native responsive layout closure

### Goal

Make supported phone/tablet layouts genuinely usable before adding more content density.

### Required checks

- compact phone;
- standard phone;
- large/Pro Max phone;
- iPad mini/tablet class;
- portrait;
- supported landscape states;
- Dynamic Island/notch;
- home indicator;
- keyboard-open states;
- large Dynamic Type/accessibility text.

### Release-blocking defects

The following must not remain:

- capability names broken into narrow vertical fragments;
- clipped display headings;
- controls hidden under tab/navigation bars;
- text hidden under the keyboard;
- desktop grids squeezed onto phones;
- fixed card widths that create unusable text columns;
- touch targets below practical minimums for primary controls;
- sheet/modal content that cannot scroll to its actions.

### Completion gate

No known critical clipping, overlap or word-fragmentation defect on the supported device matrix.

---

## P3 — Native information architecture and visual storytelling

### Goal

Bring the mobile product to the same information depth and visual identity as the desktop/PWA while keeping native composition.

### Primary navigation remains

- Home
- Explore
- Work
- Start

### Explore must expose first-class native routes for

- Capabilities
- Solutions
- Industries
- Pricing
- Method / How We Work
- Trust
- Lab / Vision
- relevant Insights where intentionally supported

### More / utility must expose

- About 11-11 Tech
- Policies
- Client Login
- Pay Invoice
- Appearance / Preferences
- contact/support routes

### Rule

Core public company/trust/product information must not remain a website redirect simply because it is already implemented on web.

External browser routing is reserved for genuinely external resources or explicitly documented exceptions.

### Visual storytelling target

Native must reinterpret, not clone, the desktop rhythm:

1. cinematic/system hero;
2. people/place/technology context;
3. capability discovery;
4. service stories;
5. problem/outcome routing;
6. industry exploration;
7. global/Tokyo/Africa visual pause;
8. method/pricing/trust snapshot;
9. focused Start CTA.

---

## P4 — Capability, services and pricing parity

### Goal

A user choosing the same capability on desktop and native receives the same commercial/product truth.

### Every native capability detail must expose

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
- starting price;
- typical range;
- capability-specific media/visual explanation;
- Start CTA carrying the correct capability context.

### Native Pricing must expose

- public pricing bands;
- capability/service ranges;
- planning/estimation guidance;
- commercial models;
- third-party fee caveats;
- complexity/integration/data/timeline implications;
- procurement/compliance implications;
- explicit non-binding pricing statement;
- route to Start.

### Rule

Parity means equal truth, not identical screen layout.

Desktop can use columns/tables. Native can use cards, disclosures, horizontal rails and stepped detail.

---

## P5 — Method, Trust, Policies, About and Lab/Vision parity

### Method

Represent:

**Discover → Design → Build → Launch → Operate → Improve**

and cover:

- scope;
- authority/source of truth;
- evidence/testing;
- UAT;
- launch/handover;
- training;
- warranty/support/SLA distinction;
- continuous improvement.

### Trust

Preserve three distinct levels:

1. public standards;
2. available-on-request materials;
3. project-specific binding documents.

Do not imply that public trust copy creates an executed contract, warranty or SLA.

### Policies

Native structured access must exist for:

- Privacy;
- Terms;
- Accessibility;
- Responsible AI;
- Security;
- Data principles.

### About

The native About surface must communicate the same current company identity and positioning as desktop, without forcing a browser jump for core company information.

### Lab / Vision

Prototype, experiment and R&D material must retain truth labels and must not be presented as deployed client production capability unless it truly is.

---

## P6 — Client workspace parity closure

The basic native commercial workspace exists. P6 now verifies completeness and presentation parity rather than inventing a second backend.

Native must support the same authoritative client state as web for:

- organization membership;
- project selection;
- project status;
- contract/project value;
- paid amount;
- outstanding balance;
- next due amount/date;
- invoices;
- payments;
- receipts;
- payment plans/installments;
- required documents;
- accepted documents;
- legal/payment action required;
- secure private document access.

Terminology must remain aligned. Use **Outstanding balance** / **Project balance**, not invented credit terminology.

No local fake client state is permitted.

---

## P7 — Agreement/payment experience certification

No new divergent payment model may be introduced in native.

The required sequence remains:

**Project summary → approved payment option → required documents → open/review documents → explicit acknowledgements → scheduled/recurring authorization if applicable → final amount/schedule review → Stripe-hosted payment → return/pending confirmation → server refresh → webhook-confirmed updated workspace**

Required certification cases:

- exact invoice payment;
- paid invoice blocked;
- invoice belonging to another tenant blocked;
- required agreement missing;
- agreement complete;
- finite installment first payment;
- extra payment below minimum;
- extra payment above remaining balance;
- extra payment within remaining balance;
- scheduled-charge authorization missing;
- authorization present;
- checkout cancel;
- payment redirect returns before webhook;
- pending state displayed correctly;
- webhook-confirmed payment;
- receipt appears;
- manual/offline payment appears with branded receipt;
- recurring plan boundary where applicable.

Payment success remains server-authoritative.

---

## P8 — System / Light / Dark semantic theme system

### Goal

Replace dark-first hardcoded screen assumptions with a complete semantic appearance system.

### Preferences

- **System** — default; follows OS and updates when OS changes.
- **Light** — persisted override.
- **Dark** — persisted override.

### Required semantic tokens

At minimum:

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

### Migration rule

Screen code should consume semantic theme values rather than assuming permanent `ink`, `white`, `textOnDark`, or a permanently light/dark status bar.

### Persistence

Appearance preference must persist locally and apply before/at initial render without avoidable theme flashing.

### Surfaces that must be certified in all modes

- public Home/Explore/Work/Start;
- capability/service/pricing screens;
- More/About/Policies/Trust/Method;
- forms;
- navigation;
- sheets/modals;
- client workspace;
- legal document review;
- billing/payment states;
- error/success/empty/loading states.

---

## P9 — Accessibility, ergonomics, motion and media hardening

### Accessibility

Required:

- VoiceOver/TalkBack roles/labels/state;
- sensible focus order;
- large text reflow;
- sufficient contrast in Light and Dark;
- minimum practical primary touch target 44–48dp;
- modal accessibility isolation;
- visible field errors;
- no colour-only status meaning;
- clear back/cancel semantics;
- no critical gesture-only action.

### Motion

- use motion to explain hierarchy/state/navigation;
- Reduce Motion disables/reduces decorative motion;
- essential status/state change remains understandable without animation;
- haptics are not coupled to motion preference.

### Media

Create/use one shared media registry for identity and metadata while retaining platform-specific renderers.

Native media must support:

- explicit aspect-ratio containers;
- loading placeholders;
- failure fallback without layout collapse;
- caching where supported;
- meaningful accessibility description where required;
- decorative media excluded from accessibility where appropriate;
- cellular/network restraint;
- hero video poster/still immediately available;
- pause video when inactive;
- Reduce Motion fallback to still/poster.

---

## P10 — Final cross-surface parity CI

### Goal

Make future desktop/native product drift a build failure rather than a UAT discovery.

### Required automated gates

#### Shared truth

- capability IDs derive from shared source;
- service offers derive from shared source;
- pricing/ranges derive from shared source;
- industries derive from shared source;
- solutions derive from shared source;
- project maturity labels derive from shared source;
- delivery lifecycle derives from shared source;
- media mappings derive from shared source;
- intake capability allow-list stays compatible with backend validation.

#### Web

- TypeScript;
- commercial/client invariant checks;
- production build;
- static route/hardening checks;
- browser journey tests;
- runtime dependency audit policy.

#### Native

- strict TypeScript;
- Expo Doctor;
- iOS bundle/export gate;
- Android bundle/export gate;
- forbidden-secret scan;
- required route checks;
- semantic theme invariant check;
- no root/global permanent-dark assumption;
- shared-content import/parity checks.

#### Commercial regression

The existing commercial payment/document/security invariant suite must continue to run whenever shared/native changes touch commercial contracts.

### Completion gate

All required checks green on one frozen candidate SHA.

---

## 5. Implementation order — mandatory sequence

The remaining work must execute in this dependency order:

1. **P1 shared domain/content layer** — establish one source of truth before building more screens.
2. **P2 responsive/layout foundation** — prevent richer content from being built on broken compact layouts.
3. **P3 native IA + visual storytelling** — establish route/screen structure.
4. **P4 capabilities/services/pricing** — consume shared truth.
5. **P5 Method/Trust/Policies/About/Lab** — complete public parity.
6. **P6 client workspace parity review** — reconcile labels/states with shared commercial vocabulary.
7. **P7 payment/legal certification** — prove no native bypass/regression.
8. **P8 theme closure** — theme infrastructure may begin earlier, but all screens must pass here after they exist.
9. **P9 accessibility/media/motion hardening** — certify completed screen set.
10. **P10 CI closure** — encode the final architecture and invariants.
11. **Candidate freeze** — no feature expansion after this point.
12. **Owner desktop + iPhone UAT**.
13. **UAT defect-only remediation**, if required.
14. **Final freeze and owner merge decision**.

Implementation may overlap enabling infrastructure where efficient, but no phase may be declared complete without its gate.

---

## 6. What is explicitly NOT blocked by Supabase or Stripe

The following must be completed before waiting on external account access:

- shared product/domain layer;
- native capability/service/pricing parity;
- native Solutions;
- native Industries;
- native Method;
- native Trust;
- native Policies;
- native About;
- native Lab/Vision;
- System/Light/Dark theme;
- shared media registry;
- responsive layout closure;
- accessibility/motion/media hardening;
- cross-surface parity CI;
- static/invariant commercial certification.

No agent may mark these items blocked merely because the correct Supabase or Stripe account is not yet connected.

---

## 7. External activation gates — deliberately later

These items are external/environment gates and must not be confused with repository implementation incompleteness.

### 7.1 Correct 11-11 Tech Supabase deployment

Required after repository parity is green:

- connect/access the correct 11-11 Tech Supabase project;
- confirm project identity before mutation;
- apply migrations in controlled order;
- deploy required Edge Functions;
- configure private storage;
- configure auth redirects/deep links;
- configure environment secrets;
- bootstrap/verify company admin authority;
- run tenant/isolation and client-auth smoke tests.

Never deploy the 11-11 commercial platform into an unrelated Supabase project merely because it is the only connected project.

### 7.2 Correct 11-11 Tech Stripe TEST environment

Required after Supabase activation:

- connect/verify the correct 11-11 Tech Stripe account;
- use test mode first;
- configure webhook endpoint/secret;
- configure server-side Stripe secret;
- perform exact-invoice, plan, installment, extra-payment and recurring/scheduled authorization test cases;
- confirm webhook reconciliation and receipt generation;
- confirm native return/deep-link pending and confirmed states.

Never perform this certification against an unrelated business Stripe account.

### 7.3 Legal production approval

Repository templates are operational scaffolding until final production wording is approved for the intended engagement/jurisdiction.

Legal review does not block UI/data architecture work, but it does block production reliance on final contract wording.

### 7.4 Real-money activation

Live payment enablement is a deliberate business/release decision, not an automatic result of code completion.

The order is:

**repository certified → Supabase deployed → Stripe test mode certified → legal wording approved → owner UAT approved → explicit live activation decision.**

---

## 8. UAT entry criteria

The owner should not be asked to perform the final desktop + iPhone acceptance run until all repository-side gates below are true.

### Required before owner UAT

- P1–P10 marked complete with evidence;
- web and native build from shared authoritative product truth;
- no known release-blocking compact-layout defects;
- native public parity routes complete;
- capability/services/pricing parity complete;
- System/Light/Dark complete;
- accessibility/media/motion closure complete at engineering level;
- commercial invariant suite green;
- web CI green;
- native CI green;
- no high-severity relevant runtime security finding unresolved;
- candidate SHA frozen;
- no feature work continuing behind the candidate.

### Owner UAT scope

At minimum:

#### Desktop/PWA

- Home/public navigation;
- Capabilities;
- Solutions;
- Industries;
- Pricing;
- Work/proof;
- Method;
- Trust/Policies/About;
- Start project;
- Pay Invoice;
- Client Login/workspace;
- documents/billing/agreement/payment readiness.

#### iPhone

- same product truth through native composition;
- tab and utility navigation;
- compact layout/readability;
- native Capabilities/Solutions/Industries/Pricing;
- Method/Trust/Policies/About/Lab;
- Start journey + keyboard;
- appearance preference;
- client login/workspace;
- documents;
- billing;
- exact invoice;
- agreement/payment readiness;
- background/foreground/relaunch;
- deep-link handling where environment permits.

#### Cross-surface comparison

For the same capability/project/client record verify:

- labels match;
- pricing truth matches;
- project maturity/truth labels match;
- balances match;
- invoice state matches;
- accepted documents match;
- required client action matches;
- no platform invents additional business state.

---

## 9. Candidate freeze and defect policy

When P1–P10 are green:

1. record the candidate commit SHA;
2. stop feature expansion;
3. run automated certification against that SHA;
4. owner performs desktop + iPhone UAT;
5. log UAT findings by severity;
6. fix only verified defects or release blockers;
7. rerun affected and full certification gates;
8. freeze a new final SHA if changes were required;
9. obtain explicit owner merge approval.

No opportunistic feature additions are allowed during the UAT closure window.

---

## 10. Definition of repository implementation complete

Repository implementation is complete only when all statements below are true:

1. there is one authoritative framework-neutral product/domain truth;
2. web consumes it;
3. native consumes it;
4. no material duplicate product catalogue remains independently authoritative;
5. native Capabilities have full service/pricing/proof/assurance parity;
6. native Solutions exists;
7. native Industries exists;
8. native Pricing exists;
9. native Method exists;
10. native Trust exists;
11. native Policies exists;
12. native About exists;
13. native Lab/Vision exists;
14. shared media identity/metadata is in place;
15. native Home/Explore/Work/Start reflect the current product truth;
16. native client workspace reflects the same commercial system of record as web;
17. payment/legal state cannot bypass server invariants;
18. System/Light/Dark is complete and persistent;
19. supported compact/standard/large device layouts are usable;
20. accessibility/motion/media requirements are implemented;
21. web certification is green;
22. native certification is green;
23. parity CI is green;
24. one candidate SHA is frozen for owner UAT.

This definition deliberately excludes external production activation. A repository may be implementation-complete while still waiting for correct Supabase/Stripe environment activation and legal/live approval.

---

## 11. Definition of production-ready

Production-ready is a later state than repository implementation complete.

Production-ready requires:

- repository implementation complete;
- owner desktop + iPhone UAT approved;
- correct 11-11 Tech Supabase deployed and certified;
- correct 11-11 Tech Stripe test environment certified;
- auth/deep-link/document-storage production configuration verified;
- legal wording approved for intended use;
- final security/dependency review accepted;
- explicit owner approval for production/live activation.

Real-money acceptance must remain disabled until these conditions are satisfied.

---

## 12. Agent execution rules

Any agent implementing this plan must:

- read `00_MASTER_IMPLEMENTATION_PLAN.md` first;
- read this closure plan second;
- preserve current commercial/payment hardening;
- avoid rewriting working backend rules in native;
- use PR #11 as the integrated lane;
- keep `main` untouched;
- implement shared truth before duplicating more content;
- preserve native composition rather than embedding/recreating desktop DOM UI;
- maintain truthful proof/maturity labels;
- run relevant certification after each workstream;
- record architecture deviations in the plan before treating them as accepted;
- never claim external deployment/live-payment readiness without evidence;
- stop at candidate freeze for owner UAT rather than merging automatically.

---

## 13. Implementation readiness decision

**Decision: READY FOR IMPLEMENTATION.**

There is no known product-scope ambiguity that requires owner clarification before P1–P10 begin.

The remaining repository work is sufficiently defined to execute without using Supabase/Stripe account access as an excuse to delay parity engineering.

The only deliberate later gates are:

- correct 11-11 Tech Supabase deployment/certification;
- correct 11-11 Tech Stripe test-mode certification;
- final legal production approval;
- owner UAT/merge/live-activation approval.

Implementation must begin with **P1 — Shared authoritative product/domain layer** and proceed through the mandatory sequence in this document.
