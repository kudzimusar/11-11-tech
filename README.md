# 11-11 Tech

[![Deploy 11-11 Tech to GitHub Pages](https://github.com/kudzimusar/11-11-tech/actions/workflows/pages.yml/badge.svg)](https://github.com/kudzimusar/11-11-tech/actions/workflows/pages.yml)

Corporate website and client-acquisition system for **11-11 Tech**, a Tokyo-based **IT services and technology implementation company** providing UI/UX and front-end development, AI and automation, CRM and business systems, software/data/cloud engineering, digital transformation, IT recruitment and engineering assurance.

**Mission:** Turn difficult real-world problems into digital products and technology systems people can trust, use and grow with.

**Positioning:** Tokyo-built. Africa-aware. Global by design.

**Operating line:** Build what matters. Prove what works.

**Current hosting:** GitHub Pages, deployed from `main` through the repository Pages workflow.

## Website 2.0

Website 2.0 is deliberately **service-first and industry-first**. A first-time buyer should understand what the company sells before being asked to inspect product or project names.

The public hierarchy is:

1. what 11-11 Tech is;
2. plain-language IT services;
3. business problems and outcomes;
4. industries served;
5. delivery approach;
6. indicative pricing;
7. reasons to choose 11-11 Tech;
8. selected supporting proof;
9. quality, contracting and trust;
10. a classified project enquiry.

A prospective client can enter through:

- a recognizable IT service;
- a business problem or desired outcome;
- an industry context;
- a buyer role;
- a specific solution.

Project evidence sits deeper in the journey. Stronger technology work is labelled by its real maturity; prototypes, experiments and blueprints are separated into the **11-11 Lab** boundary rather than presented as completed client deployments.

Canonical implementation documentation:

- `docs/website-2.0/IMPLEMENTATION.md`
- `src/data/portfolio.ts` — capability, service, pricing, industry, outcome and accelerator source of truth
- `src/data/projectTaxonomy.ts` — portfolio-to-capability proof map

## IT service portfolio

1. UI/UX Design & Front-End Engineering
2. CRM & Enterprise Systems
3. AI & Intelligent Automation
4. Software, Data & Cloud Engineering
5. Digital Transformation & Technology Advisory
6. Technology Talent & IT Recruitment
7. Trust, Security & Engineering Assurance

The home page also separates **Software & App Development** from **Data, Cloud & Integrations** in its client-facing service grid so non-technical buyers can recognize those needs immediately.

## Stack

- React 19 + TypeScript
- Vite 7
- GitHub Actions + GitHub Pages
- build-time generated route documents for clean direct URLs
- Progressive Web App manifest + service worker
- Playwright desktop/mobile browser certification
- strict meta Content Security Policy
- frontend-only classified inquiry workflow with mail-client handoff
- no application database or server secret in this static phase

## Primary routes

- `/` — company definition, visible IT services, industries, pricing and solution finder
- `/capabilities/` — complete IT service portfolio with progressive disclosure
- `/capabilities/ui-ux/`
- `/capabilities/enterprise/`
- `/capabilities/ai/`
- `/capabilities/software-data-cloud/`
- `/capabilities/transformation/`
- `/capabilities/talent/`
- `/capabilities/trust/`
- `/solutions/` — complete specific-solution catalogue
- `/industries/` — industry-first service discovery
- `/work/` — industry-led selected evidence plus explicit Lab boundary
- `/pricing/` — indicative commercial ranges and engagement models
- `/trust/` — quality, confidentiality, contracting and procurement center
- `/insights/` — authority/research programme
- `/about/` — company definition, business architecture, founder, ecosystem and strategic-partner story
- `/vision/` — 11-11 Lab and future direction
- `/method/` — Discover → Design → Build → Launch → Operate → Improve
- `/contact/` — classified five-stage client intake and email handoff
- `/policies/` — public policy information
- `/services/` — compatibility alias for IT Services / Capabilities

## Local development

```bash
npm install
npm run dev
```

Certification/build:

```bash
npm run check
npm run build
npm run test:e2e
```

`npm run build` type-checks the application, builds the Vite bundle and then runs `scripts/postbuild.mjs`, which creates real `dist/<route>/index.html` documents for GitHub Pages. The `404.html` SPA recovery remains as a fallback for unknown/deep client-side routes.

## GitHub Pages

The repository is a GitHub project site, so Vite uses:

```ts
base: '/11-11-tech/'
```

Production URL:

`https://kudzimusar.github.io/11-11-tech/`

`.github/workflows/pages.yml` runs on pushes to `main`. CI separately type-checks, builds, verifies static route output and hardened assets, runs desktop/mobile Playwright journeys, and audits runtime dependencies.

## Release gate

Before promotion to `main`, the service-first Website 2.0 release must pass:

- TypeScript type check;
- production build;
- static-route and CSP/security assertions;
- desktop and mobile Playwright journeys;
- runtime dependency audit.

The certified service-first release candidate passed all of these gates before merge.

## Static-host security boundary

GitHub Pages cannot safely hold server secrets. This repository therefore contains no Supabase service-role key, Resend API key, payment secret or privileged integration token.

The 2.0 inquiry system classifies the prospect's outcome, capability, service, industry, budget, timeline and legal/procurement requirements; it then creates a structured project brief locally and opens a prefilled email draft. A future secure server-side lead/CRM adapter can replace that boundary without redesigning the client journey.

## Trust and legal boundary

The Trust Center explains public quality, security, confidentiality and contracting practices. Public website content is not itself a binding SLA, warranty, SOW or legal agreement. NDA, MSA, SOW, SLA, DPA, recruitment terms and other binding templates require appropriate review and project-specific execution.

## Portfolio truth

Project status copy intentionally distinguishes active builds, advanced builds, pilot readiness, client review, prototypes, experiments, blueprints and earlier work. Project names are supporting evidence, not the homepage identity of the company. Prototype and experimental work is deliberately separated behind a Lab boundary.

## Future server-backed extensions

The 2.0 information architecture intentionally leaves room for:

- secure lead storage / CRM routing;
- server-side email notifications;
- booking/calendar workflows;
- consent-aware analytics;
- authenticated client portal;
- document/signature workflows;
- support/SLA ticketing;
- private strategic-partner or investor data room.

These should be implemented behind secure server-side boundaries rather than by exposing credentials in the static frontend.

## Future custom domain

When a domain is purchased:

1. configure the domain in Pages or the future hosting provider;
2. change the Vite base to `/` for root-domain hosting;
3. update canonical/OG URLs and sitemap;
4. configure DNS + HTTPS;
5. retain GitHub as the source repository even if deployment moves elsewhere.
