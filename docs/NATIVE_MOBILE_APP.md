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
- Existing 11-11 Tech Supabase Edge Function for secure lead intake

The web application remains in the repository root. The native application is isolated in `mobile/` so neither build system needs to impersonate the other.

## Native information architecture

Phone navigation uses four bottom tabs:

1. **Home** — value proposition, intent-first routing, selected work and delivery model.
2. **Explore** — capability discovery based on the change the client wants to make.
3. **Work** — selected projects with real maturity labels and category filtering.
4. **Start** — five-stage guided project intake and secure submission.

Tablets automatically replace the bottom tabs with a left navigation rail.

Additional stack routes provide:

- capability system stories;
- project system stories;
- a full-screen native menu;
- direct transitions from capability/project proof into the guided intake.

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
- reduced-motion awareness.

Navigation is handled by Expo Router / React Navigation. GSAP is not used in the native app. The web reference’s motion intent is reimplemented using native animation primitives rather than porting browser animation technology.

## Lead submission

The native app intentionally reuses the existing 11-11 Tech public lead API contract. The server remains responsible for validation, rate limiting, idempotency, storage, internal brief generation and notification delivery.

The mobile app reads only one public runtime value:

`EXPO_PUBLIC_LEAD_API_URL`

Set it to the same public Supabase Edge Function URL used by `VITE_LEAD_API_URL` in the production web deployment. Do **not** place `SUPABASE_SERVICE_ROLE_KEY`, Resend credentials or any other privileged secret in the app.

For local development, create `mobile/.env.local`:

```bash
EXPO_PUBLIC_LEAD_API_URL=<the public lead-intake Edge Function URL>
```

If the endpoint is not configured, the final intake screen deliberately switches to the device email fallback rather than pretending a secure submission succeeded.

## Run locally

Expo SDK 57 requires Node 22.13 or newer.

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
```

The first release keeps a curated mobile content layer instead of importing browser-specific files from `src/`. A later monorepo extraction can move framework-neutral content/types into a shared package once both surfaces stabilize. UI components should remain separate because web and native interaction models are intentionally different.

## CI and acceptance gates

`.github/workflows/mobile.yml` runs for native changes and verifies:

1. dependency installation on Node 22.13;
2. strict TypeScript compilation;
3. Expo Doctor compatibility checks;
4. an Expo web export as a bundling smoke test.

Before App Store / Play Store release, device UAT should additionally cover:

- compact iPhone/Android screens;
- current large phones;
- iPad/tablet rail mode;
- keyboard and text-entry behavior;
- VoiceOver/TalkBack labels and focus order;
- reduced-motion mode;
- offline/failing lead service behavior;
- secure lead submission against the production Edge Function using a controlled test lead;
- mail fallback;
- safe-area behavior around cutouts and gesture indicators.

## Product boundary

Native Mobile 1.0 is a client-acquisition and proof application. It does not yet implement authenticated client accounts, saved cloud briefs, consultation scheduling or push notifications. Those are suitable later phases once the public mobile journeys and lead conversion path have been certified.
