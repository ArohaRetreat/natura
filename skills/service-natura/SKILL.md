---
name: service-natura
description: Maintain the official Aroha Retreat Natura design application.
---

# Natura design workspace

Owns the Natura static design application for Aroha Retreat. Source: src/. Licensed public assets: public/. Build: npm run build. Tests: npm test. Preview: npm run dev at http://127.0.0.1:8770/design/.

Data contract: version 1 browser-local page document, allowlisted sections, bounded text, known icon names, unique IDs, at most 16 sections. Story artwork is icon, landscape or growth. User text is escaped. Rendering/export share site-renderer.js. Review schema compatibility and tests when changing imports.

Drafts remain personal to the browser/origin and do not sync. JSON import/export is the portable backup. No customer API, accounts, database or tracking. No telemetry tenant selected.

Firebase project/site: aroha-retreat. Deploy dist with npm run deploy using official CLI authentication. The app is at /design/; never overwrite future unrelated root content. Do not publish back to Sites. Fonts are OFL; fflate is MIT. Keep the current complete asset pack, transparent icons and approved logo wording. Superseded exports may be removed only after replacements are verified.

Nature scenes must animate distinct physical parts, never substitute whole-icon transforms for germination or ripples. No autoplay/loops; allow explicit keyboard playback; reduced motion shows final composition. Dispose owned animations on route exit and reset on hidden tab. Update continuation and changelog with substantive changes.

Season/weather policy: src/seasonal.js; atlas UI: src/season-studio.js. Fixed retreat profile: config/retreat-location.json. Synthetic previews only; live provider remains unconfigured. Keep seasonal calendar independent of fresh observations; reject invalid/stale observations; storms/freezing/high wind use a still fallback. Allura and Cormorant Garamond are limited editorial roles; core and Kannada reading fonts remain stable. Public custom source/assets are restricted to authorised Aroha websites; retain third-party licences. GitHub: ArohaRetreat/natura; issue #1.
