---
name: service-aroha-website
description: Maintain Aroha Retreat's photographic website and host content studio.
---

# Aroha website and host studio

Owner: ArohaRetreat. Source: website/. Entries: site.mjs, admin.mjs, render.mjs; cinematic.mjs owns the scroll-driven visual controller. Build: npm run build:website; full shared Hosting build: npm run build. Website version 0.2.0 is independent of Natura 0.6.0. Read [plan](../../docs/website-plan.md), [API](../../docs/api/aroha-v1.md), [observability](../../docs/website-observability.md) and [continuation](continuation.md).

The enquiry-led public website has photographic chapters, Simple View, cottages, experiences, packages, gallery and practical information. WhatsApp receives a guest-reviewed enquiry; there is no payment, inventory check, room hold or booking confirmation. Preserve Natura identity/fonts and Hrudhi. Do not fabricate property geometry or label an unrelated photograph as a particular room.

Version 1 data is validated by functions/domain.mjs; seed is website/content.json. Escape all text. Bound images to local retreat derivatives or this Firebase Storage bucket. Public clients read only aroha_public/site. The build seed supplies first render and fallback; live client metadata updates from Firestore, but pre-rendered social previews follow the build seed.

The studio uses session-scoped Google sign-in and API-enforced membership. Super-admin/admin publishes, editor saves drafts/uploads media, viewer reads. Structured controls cover content, photographs, section order/visibility, theme and motion, excluding executable code. Saves use expected versions; conflicts preserve work for backup. Preview validates sender/origin. Publishing is explicit; restore creates a draft. Uploaded media is immediately public and immutable, disclosed before upload.

Edited masters remain outside this public repository. Only edited WebP derivatives ship. Desktop/mobile hero images are separate settings. The palm cutout is excluded pending accepted edge refinement. See [photography](../../docs/website-photography.md).

Run npm run test:website, npm test, emulator integration, OTLP tests and browser review. AROHA_EMULATORS=1 builds local-only synthetic sign-in controls; production bundles must omit those controls. Emulator and iframe checks do not certify real Google OAuth or physical devices.

Firebase routes: /, /admin/, /api/v1 and preserved /design/. Shared releases must contain both sites; deploy-design.mjs requires the root manifest. Hosting rollback and content-history restore are separate operations. Never automatically roll back memberships or delete immutable media. Public RUM requires an approved script and consent; privileged tokens and enquiry details never enter frontend telemetry.
