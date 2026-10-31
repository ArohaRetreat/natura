# Natura seasonal and weather standards

Version 0.2.0 | Official design standards of Aroha Retreat

## Art direction: the atmosphere atlas

Aroha's identity stays constant while its editorial atmosphere responds to place. A short, handwritten invitation is the human gesture; an italic serif heading evokes fluidity and reflection. White remains the primary surface. Weather has a dedicated illustration area, never a particle layer behind information.

Natura already uses Lora, a serif. Extend that system deliberately rather than replacing the reading foundation with novelty typography.

| Role | Typeface | Rules |
| --- | --- | --- |
| Stable English titles | Lora 500 | Primary navigation destinations and everyday editorial hierarchy |
| Reflective seasonal heading | Cormorant Garamond Italic 500 | One short heading per composition; 40-64 px; line height 1.15-1.25 |
| Handwritten invitation | Allura 400 | One 2-6 word accent line; 36-48 px; line height at least 1.35; natural tracking; never all caps |
| Reading and controls | Source Sans 3 | 16-18 px; readable labels, dates, availability, forms and navigation |
| Kannada titles / reading | Noto Serif Kannada / Noto Sans Kannada | Preserve native shaping and generous line height; do not substitute Latin calligraphy or mechanically distort Kannada glyphs |

Do not combine a calligraphic main heading with an italic serif subtitle. Choose one expressive gesture, keep the main message as real selectable text, and retain a sensible serif/cursive fallback while fonts load. Do not change typefaces repeatedly as weather refreshes. Never use script for practical facts, prices, buttons or long copy. Review Kannada seasonal wording with a fluent speaker before publication; approved logo wordmarks remain untouched.

## Fixed retreat location and local editorial calendar

The supplied Google Maps link identifies Aroha Retreats (Hrudhi Farms), marker latitude 12.5338071, longitude 77.4562976. Use Asia/Kolkata for local dates and sun/day interpretation. Use the place marker, not the map viewport's centre. Do not request visitor geolocation.

The initial regional editorial profile is warm/dry March-May, rain/monsoon June-October, cool/quiet November-February. This is a proposed art-direction calendar for this location, not a claim about meteorological season boundaries. The retreat editor can override it for local conditions, agricultural rhythms or a campaign. Review it with the retreat team; do not import Northern Hemisphere autumn/snow conventions.

Calendar selection and observed weather are independent. A sunny day in the rain season stays in the rain-season editorial composition, with clear-weather illustration. Date determines the proposed editorial theme; fresh weather determines the atmospheric treatment. Unknown location/profile uses evergreen copy.

| Editorial theme | Heading voice | Accent | Treatment |
| --- | --- | --- | --- |
| Warm/dry | Let the light linger. | The long, golden hours | Allura accent, seed-gold detail, slow sun rays |
| Rain/monsoon | Listen to the earth awaken. | After the rain | Flowing italic serif, forest/leaf detail, a small rain study |
| Cool/quiet | Make room for stillness. | Mornings, softly held | Core serif, open white space, optional mist study when observed |
| Evergreen | Return to a slower rhythm. | A little closer to nature | Core serif, static botanical landscape |

These lines are authored editorial options. They must not be presented as forecasts or promises of conditions during a guest's stay.

## Observation contract and production integration

The atlas currently uses synthetic samples labelled DESIGN PREVIEW and not live weather. No weather subscription, provider credentials or server endpoint has been configured. A future retreat website should fetch one fixed-location observation server-side and cache it, rather than requesting a weather API separately for every visitor.

Proposed first-party contract: GET /api/v1/retreat-weather. Public read-only, no visitor identity/geolocation; no writes. Success carries a request ID, fixed location ID, source/attribution and the validated observation below. Bound upstream responses, use a 5-second timeout, validate fields, cache for 10 minutes, deduplicate refreshes and serve at most 30-minute-old data. Apply server rate limiting and upstream retry/backoff; never place a commercial API key in browser code. On unavailable data, return a documented unavailable state (HTTP 503) and show the evergreen atmosphere, not invented conditions. Backend scope remains proposed, not an implemented endpoint.

```json
{
  "schemaVersion": 1,
  "observedAt": "2026-10-31T06:00:00Z",
  "weatherCode": 61,
  "temperatureC": 24,
  "windKmh": 8,
  "precipitationMm": 1.2,
  "isDay": true
}
```

The example is synthetic. UTC timestamp required; at most five minutes in the future; observations older than 30 minutes are stale. Temperature must be finite -80 to 60 C, wind 0-300 km/h, precipitation 0-500 mm, and condition must be an allowlisted WMO code. Reject unknown schemas, missing fields and non-finite numbers. A provider adapter must verify the fixed location before passing observations into the presentation policy. Units and source attribution must be visible wherever actual observations are shown. State observation time explicitly; current conditions are not a forecast.

Before production, choose a weather provider with terms covering commercial retreat use, budget and attribution. Open-Meteo's free API tier is for evaluation/non-commercial use; commercial API access requires its commercial plan or another authorised arrangement. No subscription is created by these standards.

## Weather-to-motion policy

Priority: unavailable/stale -> neutral; thunder codes or wind at least 40 km/h -> still neutral; fog -> mist; liquid precipitation -> rain; breeze at least 15 km/h -> leaf drift; cloud -> still cloud; clear -> sun or moon according to observed day/night. Snow/freezing codes fall back to still neutral; they are not re-labelled as rain.

Animations are explanatory design studies, play once on explicit request, and never loop. Rain moves independent droplets; mist moves three bands; breeze turns separate leaves; sun rotates its rays slowly; night uses a very slow, low-contrast star-opacity change. Never flash lightning, simulate an emergency, shake the page or disguise storms as cheerful rain. This is not a weather warning or operational safety service. Availability and retreat safety decisions require a separate human-reviewed process.

For the future public retreat website, any optional first-visit atmosphere is confined to the hero illustration, lasts no more than six seconds and has an immediately available Stop motion control. No autoplay in the design atlas. Respect prefers-reduced-motion, a persistent visitor motion-off choice, hidden-tab cancellation and low-bandwidth/static fallback. A full static composition must communicate the same message. Keyboard-triggered explicit study playback works; routine navigation remains immediate.

Maintain minimum 4.5:1 normal text contrast and 3:1 large-text contrast against every surface. No typography movement, layout reflow, background video, audio or particle overlays across reading and controls. Refresh data quietly without changing focus or restarting motion. Observability may record freshness, provider latency, fallback counts and status only; never visitor coordinates or API secrets. No telemetry is enabled here.

## Production acceptance

Check local-date boundaries, season override, sunny rain-season days, dark daylight transitions, fresh/stale/missing/invalid observations, freezing/thunder/high wind, provider errors, offline/network timeout, font loading/fallback, long headings, Kannada shaping, touch/keyboard controls, reduced-motion changes during playback and hidden-tab cancellation. Test at narrow phone, tablet and desktop sizes. Keep source/observation time honest; a preview fixture must never appear as live data.

## Sources and licensing

- Location supplied by the retreat owner: https://maps.app.goo.gl/iXH5a4ri8orrh6G59
- Font source and notices: https://github.com/google/fonts/tree/main/ofl/allura and https://github.com/google/fonts/tree/main/ofl/cormorantgaramond
- WMO codes / data integration reference: https://open-meteo.com/en/docs
- Commercial API terms: https://open-meteo.com/en/pricing

Natura custom application code, artwork and Aroha brand assets are authorised only for Aroha Retreat websites under the root restricted-use licence. Fonts, inherited template material and third-party libraries retain their own licences. Public repository visibility does not grant unrelated website reuse.
