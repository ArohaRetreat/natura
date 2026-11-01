# Aroha 0.6: a living photographic world

The 0.5 film tour improved factual grounding but did not deliver the owner's requested welcome and revolving movement. Studio Mirage's homepage was checked directly in Chrome: its orb opens into a concave room of project panels, and wheel input revolves those panels. Aroha uses that spatial principle with its own photographs, a native vertical scrollbar and stable reading controls. Reference graphics, video, source and proprietary models are not included. This remains a photographic interpretation, not a seamless 3D reconstruction.

## Choreography

- **Arrival:** Natura's existing `sceneSvg('seed')` and `createScenePlayer` draw the shell opening, roots, shoot and leaves. At 1.9x the sequence lasts about 2.74 seconds. Skip, reduced motion, Simple View and a 3.2-second deadline prevent a blocking entrance. Tab hiding completes it; playback/listeners are disposed and reading access restored. A CSS fallback and noscript rule keep content available if scripts fail.
- **Hero:** a second crop of the real hero photograph sits in an organic aperture. Pointer movement changes its depth slightly; scroll rotates the contours and moves layered palm fronds. Coarse/touch input keeps native scrolling. The title unfolds once the welcome ends; copy and controls remain readable.
- **Nature:** an illustrative seedling shows leaves and exposed roots. Three actual farm photographs revolve around it like petals, alongside the supplied tree/species facts. It is labelled botanical illustration rather than an exact farm specimen. On phones the composition precedes a vertical fact list.
- **Tour:** the existing eleven route stops supply the photographic panels. Native scroll defines their continuous angle, lateral movement and depth. The active silent film moves within its panel; neighbours remain still images. Off-angle panels are hidden and only visible panel images receive sources. The full-background photograph preserves context and image-error fallback. The native destination rail, map and modal details retain the same route and content.
- **Stays:** shaped photographs enter once with a small rise and rotation. These entrances are cancelled on replacement and paused behind dialogs/hidden tabs. Simple View/reduced motion keeps a static composition and the complete readable route.

`botanical-motion.mjs` shares the existing requested animation frame; it does not create an always-running JS loop. Transform and opacity handle movement. CSS fronds breathe only while the hero is visible and pause when the page is hidden or a dialog opens. Decorative surfaces are pointer-transparent; the carousel is hidden from assistive technology because the actual destination image, description and controls already supply its meaning. Native video controls remain in detail dialogs.

## Original botanical artwork

Built-in imagegen mode generated two original transparent images. Production briefs:

1. **Palm foreground:** a restrained editorial photographic cutout of curved coconut palm fronds entering from the upper right, long fine leaves, natural green with warm daylight, realistic leaf edges and translucency, isolated transparent background; no scenery, container, typography or brand marks. Designed to frame an authentic farm photograph while leaving copy clear.
2. **Rooted seedling:** a realistic natural-history botanical rendering of a small broadleaf plant, fresh leaves, warm natural daylight, visible branching roots and a small suspended cross-section of earth, isolated transparent background; no scenery, frame, pot, labels or text. Tall composition, appropriate for a quiet ivory editorial page.

External immutable PNG masters: `Documents/Codex/Aroha-Art-Production/masters/nature-frond-v1.png` (1536 × 1024) and `nature-seedling-v1.png` (1024 × 1536). Public WebP derivatives: `website/assets/retreat/nature-frond-v1.webp` and `nature-seedling-v1.webp`. Source alpha is preserved; originals are not altered. WebP encoding is a delivery conversion. Visual review on the intended green/ivory backgrounds is required; a transparent file alone is not evidence of clean compositing. Neither asset replaces an authentic property photo or the existing logo.

## Settings and acceptance

Optional `tour.nature` is governed by the same role, draft/version and explicit publication flow as the tour. `enabled` controls the composition/section; `welcome` separately controls the entry sequence. Default true. Labels, introduction, facts and both image URLs are editable. See [API contract](api/aroha-v1.md) for limits and first-paint timing. Production API rollout is separate from Hosting preview.

Required review covers: welcome completion/skip/failure, actual wheel travel and reversal, image/text clearance, mobile 320/390 widths, modal and tab pausing, Simple View, no horizontal overflow and no full film-library loading. Test results and deployed revision are recorded in current release evidence. Browser/iframe checks do not certify physical-device frame rate, visual acceptance, owner Google sign-in or full Dynatrace RUM linkage.

## Continuous arrival and photographic hero (0.7)

The previous welcome disposed the sprout as soon as germination completed, then faded the screen. The sprout now holds its completed drawing while its leaf opens an SVG-masked aperture onto the actual page. The plant grows through the foreground during the 2.2-second opening. The photograph settles in depth, then the heading, invitation, navigation and moment switch arrive with staggered opacity/transform entrances. Reading access unlocks after the reveal, with a 6.1-second hard deadline. Skip, hidden-tab interruption, reduced motion, Simple View and a failed player/reveal all release the page. Background document loads bypass the intro. Nothing waits for a remote service or a full media library.

The hero now uses one full-width farm photograph, rather than repeating it inside an inset bubble. A guest can choose Under the palms or After sunset. The latter is the real A-frame cottage evening photograph and loads only when selected. A 1.25-second crossfade keeps the previous image while decoding; rapid reversal, failed loading and disposal cannot apply a stale photograph. Simple View/reduced motion shortens the change to 150 ms. This is an editorial choice of photographs, never a live time/weather report.

Natura's existing expressive typography specimen identifies **Allura** as its calligraphic accent for a short invitation of up to six words. The website copies its existing local WOFF2 and OFL licence. It uses Allura on the final short Latin hero line (maximum 42 characters/six words) and the separate intro welcome phrase; controls, prices, body text and Kannada keep their established families. The brand artwork is unchanged. The optional `heroEveningImage` and `heroEveningAlt` settings live under `tour.nature`; older nature records receive safe build defaults. The same studio draft/publication roles and media URL rules apply.

The leaf aperture is one bounded SVG mask; no continuous drawing loop or library is added. Native Chrome captures verify the intermediate leaf opening and fully revealed hero, including a frame sequence. All animation completion/Skip/error/deadline paths are tested independently of visual acceptance. Viewport checks remain emulation rather than physical-device certification. The transform-based scene controls and full real-farm tour from 0.6 are retained.
