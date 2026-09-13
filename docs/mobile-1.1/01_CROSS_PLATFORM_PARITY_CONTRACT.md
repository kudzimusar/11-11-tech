# Native Mobile 1.1 — iOS / Android Cross-Platform Parity Contract

Status: **MANDATORY ANNEX TO THE NATIVE MOBILE 1.1 MASTER IMPLEMENTATION PLAN**  
Owner: 11-11 Tech LLC  
Programme: Native Mobile 1.1 — Product Parity, Visual Storytelling & Commercial Experience  
Branch: `feat/native-mobile-app-1-1-parity`  
Created: 2026-09-13

---

## 1. Purpose

Native Mobile 1.1 is one 11-11 Tech mobile product delivered on iOS and Android. Neither platform is the primary product and neither may receive a reduced, delayed or visually inferior implementation by default.

The governing rule is:

> **Product parity is mandatory; platform expression may differ where the operating system genuinely requires or rewards it.**

This means iOS and Android must expose the same authoritative 11-11 Tech information, commercial meaning, legal protections, client capabilities, visual storytelling, theme options, accessibility intent and critical journeys. Platform-specific implementation details may differ only to make the experience more correct for that operating system.

A feature may intentionally differ or remain platform-specific only when:

1. the OS capability itself is different;
2. the difference improves native usability without changing product meaning;
3. security, legal or store policy requires the difference; or
4. the owner explicitly approves a documented parity exception.

Undocumented drift is a defect.

---

## 2. What must remain equal across iOS and Android

### 2.1 Product and information parity

Both platforms must consume the same framework-neutral source of truth for:

- capability taxonomy and narratives;
- services and indicative pricing;
- industries and solutions;
- project/proof taxonomy and maturity labels;
- delivery method and strategy;
- Trust and public policy structures;
- pricing bands and commercial models;
- media registry and visual-story metadata;
- intake classification;
- client project/commercial status vocabulary;
- legal-document types and acceptance meaning;
- payment-plan and billing terminology.

No iOS-only or Android-only copy fork may become an independent source of product truth.

### 2.2 Customer journey parity

Both platforms must support the same customer-facing journeys where the feature is in scope:

- Home discovery;
- Explore;
- capability detail;
- solution/industry discovery;
- Work/proof;
- Start a Project;
- Pricing;
- Method / How We Work;
- Trust;
- Policies;
- Lab / Vision;
- appearance preferences;
- Client Login;
- authenticated Client Workspace;
- project overview;
- private documents;
- billing;
- Agreement & Pay;
- legal review and acceptance;
- payment-plan selection;
- scheduled/recurring authorization where applicable;
- Stripe-hosted checkout;
- payment return/confirmation state.

A release cannot claim Native Mobile 1.1 parity if a material customer journey exists on one mobile platform but not the other, unless there is an explicit owner-approved exception.

### 2.3 Commercial and legal parity

Both platforms must preserve the same commercial invariants from the commercial master plan:

- no orphan payment;
- agreement before first payment unless approved external evidence exists;
- immutable accepted document versions;
- explicit automatic/scheduled payment authorization;
- organisation/client isolation;
- explicit company-admin authority;
- Supabase as the commercial product system of record;
- Stripe as payment processor, not the authoritative project ledger;
- integer minor-unit money representation;
- private commercial document storage;
- append-oriented acceptance and financial evidence.

A checkbox, biometric prompt, OS dialogue or navigation action must never have different legal meaning merely because the client uses iOS or Android.

### 2.4 Visual parity

Both platforms must look recognisably like the same 11-11 Tech product.

Required shared visual language:

- cinematic editorial imagery;
- approved hero still/video language;
- capability-specific imagery;
- Tokyo / Harare / global context imagery;
- project/proof imagery;
- technical diagrams and system stories;
- compressed/editorial display typography intent;
- restrained mono technical labels;
- orange signal/action colour;
- thin structural rules;
- strong hierarchy and contrast;
- purposeful motion;
- real maturity/proof labels.

Android must not become a generic Material template. iOS must not become an Apple-template imitation. Both use the 11-11 design system expressed through platform-native primitives.

### 2.5 Theme parity

System / Light / Dark is required on both platforms.

Both must provide:

- System as the default;
- persistent Light override;
- persistent Dark override;
- correct system-bar/status-bar treatment;
- theme-consistent navigation;
- theme-consistent sheets/modals;
- theme-consistent inputs/forms;
- theme-consistent media overlays;
- theme-consistent client/legal/payment surfaces;
- accessible contrast in all three modes.

Dark mode cannot receive richer imagery or visual polish than Light mode. Light mode cannot be an afterthought or simple colour inversion.

### 2.6 Accessibility parity

Both platforms must meet the same accessibility intent while using their native accessibility systems.

Required coverage:

- VoiceOver on iOS;
- TalkBack on Android;
- logical screen-reader order;
- useful labels, hints and state;
- selected/disabled/expanded semantics;
- readable error and success announcements;
- large text / Dynamic Type / Android font-scale stress testing;
- minimum practical 44–48dp touch targets;
- reduced-motion handling;
- sufficient contrast in Light and Dark;
- keyboard/input accessibility;
- legal/payment screens that remain understandable with assistive technology.

---

## 3. Platform-native differences that are allowed and expected

Parity does not mean forcing both operating systems to behave identically.

### 3.1 Navigation and back behavior

- iOS should respect native back gestures and navigation expectations.
- Android must respect the system Back action/predictive-back behavior where supported.
- Both must resolve to the same product state and must not lose unsaved/critical workflow state unexpectedly.

### 3.2 Safe areas and system chrome

- iOS must correctly handle Dynamic Island/notches, status bar and home indicator.
- Android must correctly handle status/navigation bars, gesture insets, cutouts and edge-to-edge layouts across different manufacturers and aspect ratios.

Neither platform may solve its inset problem by adding arbitrary fixed padding that breaks the other.

### 3.3 Typography

Use platform-appropriate system fonts where required, but preserve hierarchy, weight intent, line length, information density and brand character.

Text must be measured on both platforms because font metrics differ. A layout that fits on iOS is not assumed to fit on Android.

### 3.4 Haptics

Use the best platform-native haptic/vibration implementation available. Exact physical feedback may differ, but semantic intent must match: selection, confirmation, warning/error where appropriate.

Haptics remain independent of Reduce Motion.

### 3.5 Sheets, dialogs and pickers

The exact component presentation may differ where native platform conventions improve usability. The information, actions, legal meaning and completion state must remain equivalent.

### 3.6 File/document handling

Viewing, downloading and sharing project documents may use OS-native document viewers/share sheets. Access control and document identity remain server-authoritative and identical.

---

## 4. Media and motion parity

### 4.1 Shared media source

Both iOS and Android use the same approved media registry and truthful media labels. Asset selection may be optimized by platform/density/network conditions without changing the story being told.

### 4.2 Performance adaptation

The same visual experience does not require identical implementation cost.

Allowed adaptations include:

- different image resolutions for device density;
- poster-first loading;
- prefetch/caching differences;
- video bitrate/source selection;
- frame-rate reduction on constrained devices;
- disabling decorative parallax where performance is inadequate;
- still-image fallback for Reduce Motion or failed video playback.

The fallback must still look designed and complete.

### 4.3 Motion meaning

Where exact animation primitives differ, preserve the same semantic purpose:

- hierarchy;
- selection;
- system relationship;
- progress;
- success/failure;
- navigation continuity;
- touch feedback.

A motion-heavy iOS experience paired with a static/text-only Android experience is not acceptable parity.

---

## 5. Authentication, deep links and payment return

Both platforms must support equivalent secure entry/return paths for:

- commercial magic-link authentication;
- client/project links;
- invoice/payment entry links;
- Stripe checkout return;
- capability/project links where supported.

Implementation may use platform-specific universal-link/app-link configuration, but the user must reach the same authoritative application state.

Deep-link validation must be tested on both platforms for:

- app installed;
- app backgrounded;
- cold start;
- expired/invalid token;
- cancelled payment;
- successful Stripe redirect before webhook confirmation;
- webhook confirmation after redirect;
- no-network return;
- browser fallback where appropriate.

The client must never see a false success merely because a platform returned from Stripe before Supabase has reconciled the webhook.

---

## 6. Layout parity and device diversity

### 6.1 iOS matrix

Certification must include, at minimum:

- compact iPhone class;
- standard current iPhone class;
- large/Max iPhone class;
- iPad/tablet class;
- portrait and landscape where the product supports rotation.

### 6.2 Android matrix

Certification must include, at minimum:

- compact Android phone;
- standard Android phone;
- tall/narrow modern Android phone;
- large Android phone;
- Android tablet;
- portrait and landscape where supported;
- gesture navigation and system Back behavior;
- at least one configuration that stresses font scaling and non-iOS font metrics.

### 6.3 Common layout blockers

The following are release blockers on either platform:

- words fragmented into narrow vertical columns;
- content beneath cutouts/system bars;
- controls hidden behind gesture/navigation areas;
- inaccessible bottom actions when keyboard is open;
- horizontal overflow in ordinary vertical content;
- fixed widths that only work on one OS/font metric;
- modal content that cannot scroll;
- images with collapsed or incorrect aspect ratios;
- legal/payment CTAs hidden by system UI;
- text truncation that changes commercial/legal meaning.

---

## 7. Performance and reliability parity

Both platforms must have acceptable behavior for:

- cold launch;
- warm launch/resume;
- navigation responsiveness;
- image loading;
- video/media fallback;
- long scrolling screens;
- keyboard/form interaction;
- low/unstable network;
- authenticated session restore;
- document loading;
- checkout handoff/return.

Do not certify a feature from JavaScript bundle success alone. Platform runtime behavior matters.

A platform-specific performance workaround must be documented if it changes visual or interaction behavior.

---

## 8. Error and recovery parity

Both platforms need clear, branded, recoverable states for:

- offline;
- timeout;
- backend unavailable;
- expired authentication;
- missing project/document;
- asset failure;
- failed document download;
- cancelled checkout;
- payment processing/pending webhook;
- payment failed;
- empty client workspace;
- invalid deep link.

Error copy and next actions should be semantically equivalent across platforms.

---

## 9. CI/build parity gates

Native CI must treat iOS and Android as equal release targets.

Required gates include:

- strict TypeScript;
- shared-content parity checks;
- Native 1.1 invariant checks;
- Expo Doctor/toolchain compatibility;
- iOS bundle/export/build smoke gate;
- Android bundle/export/build smoke gate;
- runtime dependency/security audit;
- theme invariants;
- route/deep-link invariants;
- commercial/legal/payment invariant checks where statically testable.

A green iOS export does not compensate for a failing Android export, and vice versa.

---

## 10. UAT parity gates

The same Golden Journeys must be executed on iOS and Android:

1. launch in System theme;
2. switch Light → Dark → System and relaunch;
3. Home discovery with imagery/motion;
4. Explore capability discovery;
5. capability detail and pricing/proof;
6. Work filters/project detail;
7. Start a Project through all five stages;
8. menu/utility navigation;
9. Trust/Policies/Method/Lab;
10. client magic-link sign-in;
11. client workspace overview;
12. document open/download;
13. Agreement & Pay legal review;
14. payment-plan selection;
15. authorization where required;
16. Stripe checkout handoff;
17. payment return pending/confirmed/cancelled states;
18. background/resume;
19. offline/retry;
20. accessibility and large-text pass.

Every defect must record platform, OS/device class, route, theme and reproduction steps. A fix is not considered closed until the opposite platform is regression-checked where the affected code is shared.

---

## 11. Release policy

Native Mobile 1.1 is intended as a paired iOS/Android product release.

The default release rule is:

> **Do not declare Native Mobile 1.1 complete while one platform remains materially behind the other.**

A staggered store submission may be operationally necessary because Apple and Android stores review/distribute differently, but the repository release candidate should be feature-complete and certified for both before one platform is intentionally submitted ahead of the other, unless the owner explicitly approves an exception.

Store-specific metadata, screenshots, privacy disclosures, signing, identifiers and review requirements must be completed independently for each store while representing the same product truth.

Other Android stores may be supported from the Android release artifact/configuration where appropriate, subject to their own signing, policy and compatibility requirements.

---

## 12. Definition of cross-platform parity done

Cross-platform parity is complete only when:

- iOS and Android consume the same shared product truth;
- all in-scope customer journeys exist on both;
- imagery and visual storytelling are comparably rich on both;
- System/Light/Dark work on both;
- accessibility is certified with VoiceOver and TalkBack;
- layout works across compact/standard/large phones and tablets;
- platform-native navigation/back behavior is correct;
- auth/deep-link/payment returns work on both;
- commercial/legal meaning is identical;
- no platform has materially reduced motion/visual quality without a documented performance reason;
- iOS and Android CI/build gates are green;
- Golden Journey UAT passes on both;
- any approved parity exception is documented explicitly;
- owner approval is obtained before merge/release.

This contract is mandatory for P1–P11 implementation and certification.
