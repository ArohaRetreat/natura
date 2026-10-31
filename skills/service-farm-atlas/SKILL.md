---
name: service-farm-atlas
description: Maintain Natura's farm/nature icon atlas, animal studies and web workbench.
---

# Farm and nature atlas

Owner ArohaRetreat. Runtime `src/farm-atlas/`; public route `#farm`. Read [contract](../../docs/farm-atlas/CONTRACT.md) and [continuation](continuation.md). Catalogue and exports live under `public/assets/farm-atlas/`.

`icons.js` owns 96 distinct icon records, five groups, fixed owner-supplied farm context (9,800 trees, 94 varieties) and validated SVG rendering/search. `animals.js` owns 16 colour animal rigs and named-part one-pass timelines. `studio.js` owns the searchable gallery, workbench, playback/disposal and on-page guidelines. Eight painterly animal references are a separate treatment from the vector rigs. These are draft design assets, not an inventory claim. Do not invent 94 species names or assert every illustrated animal is resident.

Core icons retain 48 records. Farm icons merge into `public/data/icons.json` with `farm-atlas-` ID prefixes, yielding 144 page-builder-compatible icons. Preserve existing `farm-experience` and other core IDs: never remove records with a broad `farm-` prefix. Regular/strong strokes match core 1.75/2.25 on the 24-unit grid. Validate IDs, size, colour and weight; escape labels. Export canvases remain transparent.

Generate with `node scripts/generate-farm-atlas.mjs`; render PNG/WebP with `scripts/render-farm-atlas.py` (CairoSVG/Pillow); finish `npm run package:farm`. The build generates the complete ZIP from checked-in individual assets and current manifest. Hidden frame directories must never enter builds, manifests or ZIPs. The public static app has no animal-care, tree-inventory or identification backend.

Checks: `npm test`, `scripts/verify-farm-media.py` with Pillow/ffprobe/ffmpeg, `npm run build`, `sh scripts/check.sh`. Validate actual hashes, XML, alpha, animal motion metadata and media streams. Animal actions use head/tail/ear/jaw/leg/wing parts rather than a whole-image bounce. Native playback waits for Play, runs once, respects OS reduced motion and stops/disposes on hidden tab/route exit. Browser layout and native media/WAAPI playback need browser verification; DOM testing with mocks is narrower evidence.

All custom art and source are restricted to authorised Aroha Retreat websites. No telemetry destination is configured. Deploy with Natura to the existing Firebase /design/ site only; preserve future root content. Roll back with a tested prior full artifact. Maintain version, hash manifest, guide, changelog and continuation together. Public source must never include private reference photographs or credentials.
