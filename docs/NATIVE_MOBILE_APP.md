# 11-11 Tech Native Mobile 1.0

## Goal

The native app is a separate mobile product surface for 11-11 Tech, not a responsive wrapper around the Vite website. It shares the company’s content, commercial lead contract and brand language while using mobile-native navigation, motion, safe areas, haptics, form controls and screen composition.

The design direction translates the approved dark/light editorial system into native UI: compressed display typography, disciplined orange accents, thin rules, edge-aware compositions, layered technical imagery, restrained mono labels and purposeful motion. No Authenticom source code, proprietary fonts or image assets are copied into this application.

## Technology

- Expo SDK 57
- React Native 0.86
- React 19.2
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- Expo Haptics
- React Native Safe Area Context
- TypeScript strict mode
- Existing 11-11 Tech Supabase Edge Function and Postgres database for secure lead intake

The web application remains in the repository root. The native application is isolated in `mobile/` so neither build system needs to impersonate the other.

## Native information architecture

Phone navigation uses four bottom tabs:

1. **Home** — value proposition, intent-first routing, selected work and delivery model.
2. **Explore** — capability discovery based on the change the client wants to make.
3. **Work** — selected projects with real maturity labels and category filtering.
4. **Start** — five-stage guided project intake and secure submission.

Tablets automatically replace the bottom tabs with a left navigation rail. The native manifest allows device rotation so tablet/large-phone layouts can recompose in portrait or landscape rather than being artificially locked to portrait.

Additional stack routes provide:

- capability system stories;
- project system stories;
- a full-screen native menu;
- direct transitions from capability/project proof into the guided intake.

## Touch, scrolling and accessibility

The shared native interaction layer is deliberately device-aware:

- primary controls are at least 48dp high where practical;
- `PressableScale` adds hit slop, pressed-state motion, haptics and accessibility state;
- Reduce Motion disables decorative press animation without incorrectly disabling haptic feedback;
- bottom navigation includes the system safe-area inset/home indicator;
- vertical screens support drag/interactive keyboard dismissal and iOS keyboard insets;
- multi-step intake resets to the top on each step instead of retaining a stale scroll position;
- horizontal rails use nested/directional scrolling, momentum control and snapping where appropriate;
- selection sheets expose modal and selected semantics to assistive technologies;
- navigation rows, CTAs, filters, form errors and consent controls expose useful accessibility labels/state;
- long/full-screen menu content remains vertically scrollable for compact phones and large accessibility text.

## Visual system

Native tokens live in `mobile/src/theme/tokens.ts`.

The application uses system-available typography rather than bundling commercial fonts:

- iOS display: Avenir Next Condensed Heavy;
- Android display: system condensed sans;
- body: platform sans;
- technical labels: platform monospace.

The primary mobile palette is built around:

- dark canvas `#050608`;
- raised dark surface `#111315`;
- light canvas `#FFFFFF`;
- warm surface `#F3F3F0`;
- action orange `#FF8E1E`;
- secondary orange `#FF9B39`.

Project scenes are drawn from native layout primitives in `ProjectScene.tsx`. They intentionally create depth from layered planes, data fragments, rules and project-specific accents instead of depending on WebGL or copied website artwork.

## Motion and tactility

`PressableScale.tsx` provides the common touch language:

- subtle press compression;
- spring return;
- light selection/impact haptics;
- independent reduced-motion handling.

Navigation is handled by Expo Router / React Navigation. GSAP is not used in the native app. The web reference’s motion intent is reimplemented using native animation primitives rather than porting browser animation technology.

## Lead submission and database boundary

The native app reuses the same hardened public lead contract as the website. The public clients never receive Supabase service-role credentials, notification-provider credentials or direct table access.

The production data path is:

```text
Web / native client
  -> HTTPS Supabase Edge Function
  -> server validation + HMAC abuse controls
  -> service-role Postgres write
  -> internal notification
```

### Client controls

The native guided intake:

- bounds text fields to the same server/database limits;
- validates required contact, project, URL and consent fields before progression and again before final submission;
- normalizes email before sending;
- uses a per-brief idempotency identifier and rotates it when a second brief begins;
- prevents repeated submit taps while a request is in progress;
- uses a 12-second bounded network request;
- provides a transparent device-email fallback when secure submission cannot complete;
- keeps in-progress PII in component memory only; Mobile 1.0 does not persist enquiry drafts to device storage.

### Edge Function controls

`supabase/functions/lead-intake/index.ts` provides:

- approved browser-origin enforcement while still supporting origin-less native clients;
- POST-only JSON intake with a 40 KB body limit;
- field normalization, capability allow-lists and URL sanitization;
- removal of URL query strings/fragments before website URLs are stored;
- rejection of URLs containing embedded credentials;
- HMAC-derived IP/email abuse-control identities rather than raw rate-limit identifiers;
- atomic Postgres-backed rate limits for event IP, lead IP and lead email;
- idempotency retries bound to the same normalized email;
- notification delivery with a bounded timeout;
- public lead confirmation containing the business reference rather than an internal database UUID.

The function remains intentionally public (`verify_jwt: false`) because anonymous website/native visitors must be able to create an enquiry. It does not treat the native binary as a secret credential. Abuse resistance therefore comes from validation, honeypot handling, idempotency, server-derived identities and rate limiting rather than a hard-coded mobile secret.

### Database controls

The production Supabase schema enforces the same invariants below the Edge Function:

- `leads`, `conversion_events` and `ingress_rate_limits` have RLS enabled and **forced**;
- public `anon` and `authenticated` roles have explicit deny policies and no table grants;
- service-role-only trigger/RPC execution is enforced;
- lead request ID, business reference, IP HMAC and consent are mandatory;
- lead email normalization, capability allow-list, content lengths and URL bounds are database constraints;
- conversion event type/capability/payload bounds are database constraints;
- conversion events require the server-derived IP HMAC;
- `ingress_rate_limits` stores only keyed hashes, never raw IPs/emails;
- the atomic limiter defensively purges stale rows while handling traffic;
- `pg_cron` runs an hourly retention job deleting limiter identifiers older than 48 hours.

Supabase security-advisor checks should be run after DDL changes. The hardening pass completed with no security-advisor findings; early performance warnings about unused indexes are expected while the lead database has little or no traffic.

## First-party mobile telemetry

The native client records the same allow-listed conversion classes as the website where useful:

- page views;
- guided-intake step views;
- secure-submit attempts/success/failure;
- email fallback.

Telemetry uses a process-session identifier and native route context. It does not use a mobile advertising identifier or a privileged Supabase credential. The privacy policy explicitly covers website/native first-party measurement and the 48-hour pseudonymous limiter retention boundary.

## Runtime configuration

The mobile app reads one public runtime value:

`EXPO_PUBLIC_LEAD_API_URL`

Preview and production EAS profiles are explicitly wired to:

`https://aopwqtlxxqdlfftpcvwv.supabase.co/functions/v1/lead-intake`

This URL is public configuration, not a secret. Do **not** place `SUPABASE_SERVICE_ROLE_KEY`, Resend credentials or any other privileged secret in the app.

For local development, create `mobile/.env.local` if you need to override/configure the public endpoint:

```bash
EXPO_PUBLIC_LEAD_API_URL=https://aopwqtlxxqdlfftpcvwv.supabase.co/functions/v1/lead-intake
```

If the endpoint is not configured, the final intake screen deliberately switches to the device email fallback rather than pretending a secure submission succeeded.

## Run locally

Node 22.13 or newer is required. The mobile package also declares npm 10.9.2 as the expected package manager, and Expo Doctor is pinned in dev dependencies so CI is not silently changed by a new `latest` release.

From the repository root:

```bash
cd mobile
npm install
npm run start
```

Then launch the required platform:

```bash
npm run ios
npm run android
```

The root repository also exposes convenience commands:

```bash
npm run mobile:start
npm run mobile:ios
npm run mobile:android
npm run mobile:typecheck
npm run mobile:doctor
```

## Build and distribute

`mobile/eas.json` contains development, preview and production build profiles. Before the first remote store build, link the app to the intended Expo/EAS project and verify the final Apple/Google identifiers.

Typical build commands from `mobile/` are:

```bash
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```

The current native identifiers are:

- iOS: `com.eleveneleven.tech`
- Android: `com.eleveneleven.tech`

Treat these as the intended production identifiers only after confirming ownership and store availability.

## Repository structure

```text
mobile/
  app/                  Expo Router screens and navigation
  assets/               App icon / native packaging assets
  src/components/       Native design-system and interaction primitives
  src/data/             Curated mobile capability, project and intake content
  src/lib/              Public lead transport and intake client
  src/theme/            Native visual tokens
  app.json              Expo app configuration
  eas.json              EAS build profiles
  package.json          Native dependencies and commands
supabase/
  functions/lead-intake Shared hardened public ingress
  migrations/           Lead schema, RLS, validation, rate limits and retention
```

The first release keeps a curated mobile content layer instead of importing browser-specific files from `src/`. A later monorepo extraction can move framework-neutral content/types into a shared package once both surfaces stabilize. UI components should remain separate because web and native interaction models are intentionally different.

## CI and acceptance gates

`.github/workflows/mobile.yml` runs when the native client **or its shared lead backend/data boundary** changes. It verifies:

1. static native/security hardening invariants;
2. dependency installation on Node 22.13;
3. strict TypeScript compilation;
4. pinned Expo Doctor compatibility checks;
5. an Expo/Metro export as a bundling smoke test;
6. production runtime dependency audit at high severity.

The root `Certify 11-11 Tech` workflow separately re-verifies the existing website, commercial-hardening invariants, production build, browser journeys and runtime dependency audit.

Before App Store / Play Store release, physical-device/simulator UAT should additionally cover:

- compact iPhone/Android screens;
- current large phones;
- iPad/tablet rail mode;
- portrait and landscape rotation;
- keyboard and text-entry behavior;
- VoiceOver/TalkBack labels and focus order;
- reduced-motion mode with haptics still functioning independently;
- horizontal project/filter rails and vertical nested scrolling;
- offline/failing lead service behavior;
- secure lead submission against the production Edge Function using a controlled test lead;
- email fallback;
- safe-area behavior around cutouts and gesture indicators.

## Product boundary

Native Mobile 1.0 is a client-acquisition and proof application. It does not yet implement authenticated client accounts, saved cloud briefs, consultation scheduling or push notifications. Those are later product phases, not hidden dependencies of the public lead journey.
