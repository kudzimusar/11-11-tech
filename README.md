# 11-11 Tech

[![Deploy 11-11 Tech to GitHub Pages](https://github.com/kudzimusar/11-11-tech/actions/workflows/pages.yml/badge.svg)](https://github.com/kudzimusar/11-11-tech/actions/workflows/pages.yml)

Corporate website for **11-11 Tech**, a Tokyo-based product engineering, app development and technical documentation studio serving Africa, Europe, the Americas and globally distributed teams.

**Mission:** Turn difficult real-world problems into digital products people can trust, use and grow with.

**Positioning:** Tokyo-built. Africa-aware. Global by design.

**Current hosting:** GitHub Pages, deployed from `main` through the repository Pages workflow.

## Stack

- React 19 + TypeScript
- Vite 7
- GitHub Actions + GitHub Pages
- Build-time generated route documents for clean direct URLs
- Progressive Web App manifest + service worker
- Frontend-only inquiry workflow with mail-client handoff
- No application database or server secret in this phase

## Routes

- `/` — Home
- `/work/` — portfolio, filtering and project detail dialogs
- `/services/` — services and technology capability
- `/about/` — company and founder story
- `/vision/` — 11-11 Lab and future direction
- `/method/` — delivery methodology
- `/contact/` — persistent multi-step project inquiry + email handoff
- `/policies/` — public policy drafts

## Local development

```bash
npm install
npm run dev
```

Certification/build:

```bash
npm run check
npm run build
npm run preview
```

`npm run build` type-checks the application, builds the Vite bundle and then runs `scripts/postbuild.mjs`, which creates real `dist/<route>/index.html` documents for GitHub Pages. The `404.html` SPA recovery remains as a fallback for unknown/deep client-side routes.

## GitHub Pages

The repository is a GitHub project site, so Vite uses:

```ts
base: '/11-11-tech/'
```

Production URL:

`https://kudzimusar.github.io/11-11-tech/`

`.github/workflows/pages.yml` runs on every push to `main`. The workflow type-checks, builds, verifies critical output files, configures Pages, uploads `dist/`, and deploys the `github-pages` environment.

## Static-host security boundary

GitHub Pages cannot safely hold server secrets. This repository therefore contains no Supabase service role key, Resend API key, payment secret or privileged integration token.

The inquiry form keeps state locally, shows a final review, and creates a prefilled email draft. A future API/email adapter can replace that boundary without redesigning the page.

## Portfolio truth

Project status copy intentionally distinguishes active builds, pilot readiness, client review, prototypes, experiments and earlier builds. Public repository links are only shown where the underlying repository is intentionally public.

## Future custom domain

When a domain is purchased:

1. configure the domain in Pages or the future hosting provider;
2. change the Vite base to `/` for root-domain hosting;
3. update canonical/OG URLs and sitemap;
4. configure DNS + HTTPS;
5. retain GitHub as the source repository even if deployment moves elsewhere.
