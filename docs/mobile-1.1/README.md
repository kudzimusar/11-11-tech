# Native Mobile 1.1 — Product Parity & Commercial Experience

This lane starts from the latest commercial/client-platform branch and integrates the proven Native Mobile 1.0 application with the current 11-11 Tech product, visual, legal, client and payment model.

## Canonical implementation context

**Read these first, together, in this order:**

1. [`00_MASTER_IMPLEMENTATION_PLAN.md`](./00_MASTER_IMPLEMENTATION_PLAN.md) — the primary authoritative product, design, commercial and security contract for P1–P11.
2. [`01_CROSS_PLATFORM_PARITY_CONTRACT.md`](./01_CROSS_PLATFORM_PARITY_CONTRACT.md) — mandatory iOS/Android parity annex; neither mobile platform may become a reduced or divergent product.
3. [`01_PARITY_CLOSURE_IMPLEMENTATION_PLAN.md`](./01_PARITY_CLOSURE_IMPLEMENTATION_PLAN.md) — mandatory execution-level closure plan defining what is complete, what remains, the exact P1–P10 implementation order, repository-vs-external boundaries, CI gates, candidate freeze and UAT entry criteria.

The master plan defines **what the product must be**. The cross-platform parity contract defines **what must remain equivalent between iOS and Android**. The parity closure plan defines **exactly how the remaining work is to be completed and when the candidate is ready for owner UAT**.

Together they supersede any Native Mobile 1.0 product-boundary assumptions that conflict with the 1.1 target, while preserving the proven native architecture, security and interaction foundation.

Supporting governing references:

1. `docs/commercial-platform/00_MASTER_PLAN_AND_OPERATIONS.md` — commercial, legal, client, payment and financial invariants.
2. `docs/commercial-platform/03_PAYMENT_CLOSURE_AND_CROSS_SURFACE_PARITY.md` — payment closure and web/native commercial parity rules.
3. `docs/website-2.0/IMPLEMENTATION.md` — product taxonomy, progressive disclosure, imagery, motion, pricing, trust and visual storytelling.
4. `docs/NATIVE_MOBILE_APP.md` — Native 1.0 technical architecture, accessibility, touch, safe-area and lead-ingress controls.

Implementation must not be driven from a chat summary or phase chart alone. If implementation reality changes architecture or invariants, update the canonical repository context deliberately before treating the change as accepted.

## Platform rule

Native Mobile 1.1 is one product across iOS and Android. Neither platform is primary. Product, information, legal, commercial, visual, theme and accessibility parity are mandatory; platform-specific differences are allowed only where they improve native correctness or are required by the operating system, security or store policy. Undocumented platform drift is a defect.

## Execution rule

PR #11 / `feat/native-mobile-app-1-1-parity` is the integrated closure lane. Repository-side parity work must not be marked blocked by Supabase or Stripe account access. The shared product/domain layer, native public parity, System/Light/Dark theming, media/accessibility closure and parity CI must be completed first. Correct 11-11 Tech Supabase deployment, correct Stripe test-mode certification, legal production approval and real-money activation are later controlled gates.
