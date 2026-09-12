# 11-11 Tech

[![Deploy 11-11 Tech to GitHub Pages](https://github.com/kudzimusar/11-11-tech/actions/workflows/pages.yml/badge.svg)](https://github.com/kudzimusar/11-11-tech/actions/workflows/pages.yml)

Corporate website and client-acquisition system for **11-11 Tech**, a Tokyo-based technology company spanning UI/UX and front-end engineering, enterprise systems and CRM, AI implementation and intelligent automation, software/data/cloud engineering, digital transformation, technology talent and engineering assurance.

**Mission:** Turn difficult real-world problems into digital products and technology systems people can trust, use and grow with.

**Positioning:** Tokyo-built. Africa-aware. Global by design.

**Operating line:** Build what matters. Prove what works.

**Current hosting:** GitHub Pages, deployed from `main` through the repository Pages workflow.

## Website 2.0

Website 2.0 treats the public site as a commercial technology system rather than a brochure.

A prospective client can enter through:

- a business problem or desired outcome;
- one of seven capability divisions;
- a specific solution/service;
- an industry context;
- relevant evidence from the 22-project technology portfolio.

Those paths connect to indicative pricing, delivery methodology, trust/contracting information and a classified project-intake flow.

Canonical implementation documentation:

- `docs/website-2.0/IMPLEMENTATION.md`
- `src/data/portfolio.ts` — capability, service, pricing, industry, outcome and accelerator source of truth
- `src/data/projectTaxonomy.ts` — portfolio-to-capability proof map

## Core capabilities

1. UI/UX & Front-End Engineering
2. Enterprise Systems & CRM
3. AI & Intelligent Automation
4. Software, Data & Cloud Engineering
5. Digital Transformation & Technology Advisory
6. Technology Talent & IT Recruitment
7. Trust, Security & Engineering Assurance

## Stack

- React 19 + TypeScript
- Vite 7
- GitHub Actions + GitHub Pages
- build-time generated route documents for clean direct URLs
- Progressive Web App manifest + service worker
- Playwright browser certification
- strict meta Content Security Policy
- frontend-only classified inquiry workflow with mail-client handoff
- no application database or server secret in this static phase

## Primary routes

- `/` — client-facing 2.0 home and solution finder
- `/capabilities/` — seven-practice overview with progressive disclosure
- `/capabilities/ui-ux/`
- `/capabilities/enterprise/`
- `/capabilities/ai/`
- `/capabilities/software-data-cloud/`
- `/capabilities/transformation/`
- `/capabilities/talent/`
- `/capabilities/trust/`
- `/solutions/` — complete service catalogue
- `/industries/` — industry/context entry points
- `/work/` — 22-project proof system and constellation
- `/pricing/` — indicative commercial ranges and engagement models
- `/trust/` — quality, confidentiality, contracting and procurement center
- `/insights/` — authority/research programme
- `/about/` — company, founder, business architecture, ecosystem and strategic-partner story
- `/vision/` — 11-11 Lab and future direction
- `/method/` — Discover → Design → Build → Launch → Operate → Improve
- `/contact/` — classified five-stage client intake and email handoff
- `/policies/` — public policy information
- `/services/` — compatibility alias for Capabilities

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

## Static-host security boundary

GitHub Pages cannot safely hold server secrets. This repository therefore contains no Supabase service-role key, Resend API key, payment secret or privileged integration token.

The 2.0 inquiry system classifies the prospect's outcome, capability, service, industry, budget, timeline and legal/procurement requirements; it then creates a structured project brief locally and opens a prefilled email draft. A future secure server-side lead/CRM adapter can replace that boundary without redesigning the client journey.

## Trust and legal boundary

The Trust Center explains public quality, security, confidentiality and contracting practices. Public website content is not itself a binding SLA, warranty, SOW or legal agreement. NDA, MSA, SOW, SLA, DPA, recruitment terms and other binding templates require appropriate review and project-specific execution.

## Portfolio truth

Project status copy intentionally distinguishes active builds, advanced builds, pilot readiness, client review, prototypes, experiments and earlier work. Portfolio entries demonstrate transferable technology capability; they are not automatically presented as paid client engagements.

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
