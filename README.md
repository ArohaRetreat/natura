# Natura v0.1.0

A nature-inspired design application for Aroha Retreat. Canonical deployment: https://aroha-retreat.web.app/design/.

Includes separate English, Kannada and bilingual logo families; transparent icon-only and favicon assets; 48 service icons; two original botanical illustrations; four independently drawn motion studies; type, colour and component references; and a browser-local website builder.

## Develop

Node 20+ and Python 3 are sufficient for the application. Run `npm test`, `npm run build`, then `npm run dev`. Open http://127.0.0.1:8770/design/. No dependency installation is needed for normal builds; fflate 0.8.3 is vendored with its MIT licence. Fonts are bundled with OFL licences. The PDF regeneration script needs reportlab, svglib and pymupdf and the included static fonts.

The page builder supports up to 16 sections, 8 service cards and 100 KB JSON imports. User text is escaped and section types are allowlisted. Drafts remain in localStorage for this browser/origin; export JSON before moving to another origin. Website ZIPs contain HTML, CSS, local logo, chosen illustrations, fonts, licences and draft JSON. Confirm service content and contacts before publishing. Booking, payments and enquiry submission require separate implementation.

## Firebase Hosting

Project and default site: `aroha-retreat`. Build output: `dist/design/`. `/design` redirects to `/design/`; only that route has an app rewrite. `npm run deploy` uses an already authenticated official Firebase CLI. Install Firebase CLI from its official npm package if needed, or set `FIREBASE_CLI_PATH` to its CLI JavaScript entry point. No authentication token is included in source.

This site was empty before Natura's first deployment. Hosting publishes the entire `dist` directory: if a root website is added later, preserve its build output and configuration before the next release. Never deploy a design-only manifest over unrelated root content.

The provided Firebase web configuration is retained in `config/firebase.web.json` for future application integration. Analytics is not initialized. No database, backend, accounts or telemetry are configured. This is a public static design workspace; do not add confidential documents to public assets.

## Asset handoff

`public/downloads/Natura-Design-Assets-v0.1.0.zip` is the complete current asset package. `public/docs/` contains the current field guide, motion field notes, retained identity handbook and corrected service icon PDFs. `Natura-Service-Icons-v0.1.0.zip` is a convenient icon-only subset, using approved v1.1 geometry. Botanical illustrations were generated specifically for this system with OpenAI image generation. PNG originals and web-optimized WebP files are included. Vector logos use SVG masters, with print and raster exports; no native proprietary Illustrator source is claimed.

Natura names the design application. Aroha Retreat names the retreat identity; its approved wording remains unchanged. Source ownership: `skills/design-studio/`. No GitHub push or CI run is claimed. The previous Sites deployment is superseded; no new release is sent there.
