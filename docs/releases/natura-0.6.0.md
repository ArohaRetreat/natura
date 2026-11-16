# Natura 0.6.0 — Hrudhi alpha

User authorised production publication on 2026-11-01, with Hrudhi explicitly kept alpha. The application is Natura 0.6.0; the character distribution is 0.3.0-alpha.1. Issue #13 stays open for full character-performance recovery.

Scope: original-art studio, 120 prototype cutout combinations, four native expression still studies, transparent figure exports, PSD and native puppet checkpoint. The current distribution excludes the mismatched simplified character and rejected mouth experiments. Original masters remain immutable; no family approval is inferred. Walking/talking in the web studio remain cutout prototypes; the MP4s still animate scenery only. Native triggers, blinks, visemes and full action performance remain unfinished.

No database, authentication, settings, permission, telemetry destination or API migration is introduced. Existing Firebase Hosting target `aroha-retreat` and `/design/` route remain. Root returned 404 before release; no root application is added. Source native assets are covered by the Aroha-only licence. Native outputs are versioned for reproducible builds; experimental Adobe outputs remain ignored.

Build: `npm run build` stages shared assets with `build-base.mjs`, builds the original-art distribution with `build-original-preview.mjs`, then publishes it into `dist/design`. Deployment refuses a non-release build, a mismatched Git revision or missing alpha status. Native study source files are required by the production build.

Predeployment validation: 52 app tests, 21 foundation tests, original identity validation and browser checks. Final current-head CI, merge and live verification are recorded separately; these are not inferred from a local build.

Rollback: the prior live 0.5.2 artifact was cloned before deployment to Hosting channel `rollback-0-5-2`. To restore it using the authenticated official CLI: `firebase hosting:clone aroha-retreat:rollback-0-5-2 aroha-retreat:live --project aroha-retreat`. Verify the resulting `/design/release.json` revision and studio after a rollback. The rollback channel has finite retention; the prior source revision is `9f46759d18642592fc0b22ff3ce685d1123e11d9`.
