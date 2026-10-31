# Natura v0.5.0

Template version: **1.9.0**

Official design standards of Aroha Retreat, with a working nature-inspired design application. Canonical deployment: https://aroha-retreat.web.app/design/.

Includes separate English, Kannada and bilingual logo families; transparent icon-only and favicon assets; 48 service icons; two original botanical illustrations; twelve independently drawn motion studies; type, colour and component references; and a browser-local website builder.

## Develop

Node 20+ and Python 3 are sufficient for the application. Run `npm test`, `npm run build`, then `npm run dev`. Open http://127.0.0.1:8770/design/. No dependency installation is needed for normal builds; fflate 0.8.3 is vendored with its MIT licence. Fonts are bundled with OFL licences. The PDF regeneration script needs reportlab, svglib and pymupdf and the included static fonts.

The page builder supports up to 16 sections, 8 service cards and 100 KB JSON imports. User text is escaped and section types are allowlisted. Drafts remain in localStorage for this browser/origin; export JSON before moving to another origin. Website ZIPs contain HTML, CSS, local logo, chosen illustrations, fonts, licences and draft JSON. Confirm service content and contacts before publishing. Booking, payments and enquiry submission require separate implementation.

## Firebase Hosting

Project and default site: `aroha-retreat`. Build output: `dist/design/`. `/design` redirects to `/design/`; only that route has an app rewrite. `npm run deploy` uses an already authenticated official Firebase CLI. Install Firebase CLI from its official npm package if needed, or set `FIREBASE_CLI_PATH` to its CLI JavaScript entry point. No authentication token is included in source.

This site was empty before Natura's first deployment. Hosting publishes the entire `dist` directory: if a root website is added later, preserve its build output and configuration before the next release. Never deploy a design-only manifest over unrelated root content.

The provided Firebase web configuration is retained in `config/firebase.web.json` for future application integration. Analytics is not initialized. No database, backend, accounts or telemetry are configured. This is a public static design workspace; do not add confidential documents to public assets.

## Asset handoff

`public/downloads/Natura-Design-Assets-v0.3.0.zip` is the retained core identity package. Hrudhi and the farm atlas ship as separate current collections. `public/docs/` contains the current field guide, motion field notes, retained identity handbook and corrected service icon PDFs. `Natura-Service-Icons-v0.3.0.zip` is a convenient icon-only subset, using approved v1.1 geometry. Botanical illustrations were generated specifically for this system with OpenAI image generation. PNG originals and web-optimized WebP files are included. Vector logos use SVG masters, with print and raster exports; no native proprietary Illustrator source is claimed.

Natura names the design application. Aroha Retreat names the retreat identity; its approved wording remains unchanged. Source ownership: `skills/service-natura/`. Repository: https://github.com/ArohaRetreat/natura. Template: theharithsa/app-launchpad-template v1.9.0 at f04c042a9e000f606982863518fa7bb9cfbb7d85. The previous Sites deployment is superseded; no new release is sent there.

## Seasonal typography and local weather

The atmosphere atlas includes Cormorant Garamond Italic and Allura for limited heading roles, with locally bundled OFL files. Live weather is not configured: previews are synthetic and explicitly labelled. The fixed location from the owner’s map is Hrudhi Farms (12.5338071, 77.4562976), Asia/Kolkata. Read [seasonal standards](public/docs/Natura-Seasonal-Standards.md) and [location profile](config/retreat-location.json); the editorial calendar is proposed for retreat review.

## Restricted application licence

Official design standards of Aroha Retreat. Custom application code, artwork and brand assets may be used only for authorised Aroha Retreat websites. Public visibility does not permit unrelated website use. See [LICENSE](LICENSE) and [third-party exceptions](THIRD-PARTY-NOTICES.md). Font, library and inherited template rights are retained under their original terms.

## Living motion collection

Natura 0.3.0 adds eight anatomy-specific studies: fern unfurling, dew gathering, flower opening, butterfly landing, shoreline tide, canopy wind, fireflies and mycelium. The original four remain available. The library has family filters and the same play/pause/seek/speed/reset controls. [Motion catalogue](public/docs/Natura-Motion-Catalogue.html) is the current complete reference; the older motion PDF documents the foundational four only.

Weather now uses layered retreat landscapes, retaining the observed night palette in all conditions. The component workbench uses native controls with short state feedback and contextual notes. Experience selection is a design pattern, not a booking backend. Copy its HTML with the exported site CSS.

## Hrudhi draft character kit

[Character lab](https://aroha-retreat.web.app/design/#hrudhi): five proposed age chapters covering 5-17, three wardrobes and eight actions (120 combinations). Detailed PNG/WebP references are separate from the working simplified SVG rig. All remain draft, family review pending. No permanent visitor guide, voice, AI model or admin backend is activated.

[Character bible and integration contract](docs/hrudhi/CONTRACT.md) documents asset formats, motion anatomy, accessibility, milestone governance and the planned API. Download `public/downloads/Hrudhi-Character-Kit-v0.2.0.zip` for all artwork, runtime source, timelines, hashes and seven-page PDF/HTML bible. Core identity asset pack v0.3.0 remains retained; Hrudhi ships as its own versioned kit.

Generate vector/frame sources with `node scripts/generate-hrudhi.mjs`, raster previews with `scripts/render-hrudhi.py` (CairoSVG/Pillow), and documentation with `scripts/render-hrudhi-bible.py` (ReportLab/Pillow). Read the owning service skill before regeneration. Finish with `npm run package:hrudhi`, `npm test`, `npm run build` and `scripts/verify-hrudhi.py`. Tests do not claim browser layout or actual AI/backend acceptance.

## Web-first character and farm libraries

Natura v0.5.0 includes the full Hrudhi collection and readable standards in `#hrudhi`, plus five silent vector films and alpha WebM clips. Character kit v0.2.0 revises the fictional face direction; all art remains draft pending family review. Private input photographs and paths are excluded. The films animate the simpler vector rig, not the painterly concept artwork; no narration/lip-sync is supplied.

`#farm` adds 96 line icons, 16 editable animal studies, eight illustrated references and usage guidance. All 96 icons are available in the main icon library and page builder (144 total). The complete farm atlas ZIP is generated by `npm run build`; use `npm run package:farm` after regenerating assets. Owner supplied 9,800 trees and 94 varieties; no species inventory is connected or invented.
