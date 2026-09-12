# GitHub operations — 11-11 Tech

## Canonical locations

- Repository: `https://github.com/kudzimusar/11-11-tech`
- Public Pages site: `https://kudzimusar.github.io/11-11-tech/`
- Actions: `https://github.com/kudzimusar/11-11-tech/actions`
- Pages settings: `https://github.com/kudzimusar/11-11-tech/settings/pages`

## Repository description

> Turn difficult real-world problems into digital products people can trust, use and grow with. Build what matters. Prove what works.

## Suggested topics

`11-11-tech`, `react`, `typescript`, `vite`, `github-pages`, `product-engineering`, `app-development`, `africa-tech`, `tokyo`, `software-studio`, `product-design`, `technical-documentation`

## Deployment contract

`main` is the deployable website branch.

`.github/workflows/pages.yml` performs:

1. checkout;
2. Node setup;
3. dependency installation;
4. TypeScript certification;
5. Vite production build;
6. route-document generation;
7. output assertions;
8. Pages configuration/enablement;
9. artifact upload;
10. deployment to the `github-pages` environment.

Do not add a second Pages workflow.

## Recommended repository settings after first green deploy

1. Keep **Pages → Source** on **GitHub Actions**.
2. Put `https://kudzimusar.github.io/11-11-tech/` in the repository Website field.
3. Add the suggested repository topics.
4. Enable branch protection/rules for `main` once the first deploy is green.
5. Require the Pages build/status check before merging substantial changes.
6. Prefer squash merges for focused website PRs.
7. Never commit API keys, service-role credentials, payment secrets or private client data.

## Static-host boundary

GitHub Pages has no trusted server runtime. The current inquiry flow therefore creates a reviewed email draft instead of embedding a secret-bearing form API in browser code.

Future integrations that need secrets should use a trusted server/serverless boundary (for example a serverless email endpoint) rather than being called directly from the browser.

## Domain migration later

When a domain is purchased:

1. configure it in GitHub Pages or the chosen host;
2. change `vite.config.ts` base from `/11-11-tech/` to `/` for root deployment;
3. update `src/lib/site.ts`, sitemap and Open Graph/canonical URLs;
4. configure DNS and HTTPS;
5. keep GitHub as the source repository.
