# Aroha Design Studio

Owns the static design-system application, browser-local page builder, reusable site renderer, and asset exports. Source: src/. Public licensed assets: public/. Build: node scripts/build.mjs. Tests: node --test tests/*.test.mjs. Preview: python3 -m http.server 8770 --directory dist.

Data contract: version 1 browser-local page document; allowlisted section types, bounded text, valid icon names, at most 16 sections, unique IDs. Imports are bounded JSON and never execute markup. User text is escaped into exported HTML. No server API, authentication implementation, database or migrations are needed. Sites supplies owner-private access to the hosted application.

Browser storage is personal to this origin and device, persists until reset/clearing site storage, and supports JSON export/import. No connector calls, AI generation, third-party tracking or outbound draft upload. Drafts do not sync across devices. No Dynatrace tenant has been selected; observability is pending and no telemetry is sent.

Source rendering and exports share src/site-renderer.js. Changes to the document contract require tests and schema version review. Preserve all existing brand packs. Fonts are OFL; fflate is MIT. Publish through the Sites skill using the existing .openai/hosting.json identity and audience. No public GitHub repository or template adoption is claimed; that ownership choice remains pending.
