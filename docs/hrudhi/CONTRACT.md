# Hrudhi character kit v0.2.0

**Status: draft, family review pending.** Five illustrated age chapters cover ages 5-17. This is a fictional character design system, with no biographical claims. The Natura lab previews the kit; it does not activate a permanent visitor guide. No adult life stages are included.

## Design boundaries

Keep warm brown skin, brown eyes, dark textured hair, the leaf clip and botanical satchel consistent. Growth changes head-to-body proportion, face length, limb length, hair arrangement and the confidence of gestures. No skin lightening, adult styling, romance, invented personal memories or claims that the character is a real child. Her manner is curious, patient and attentive. Use specific invitations: “Shall we look at the garden?” Her dialogue should describe the retreat and invite exploration; personal memories are not part of this character design.

| Chapter | Age band | Anchor artwork | Character direction |
| --- | --- | --- | --- |
| explorer | 5-7 | 5 | Short bob, rounded face, pinafore; notices small details |
| naturalist | 8-10 | 8 | Half-tied hair, trouser overalls; explores and asks questions |
| storyteller | 11-13 | 11 | Braid, kurta and trousers; shares observations from nature |
| pathfinder | 14-16 | 14 | Longer proportions, braid, kurta; offers considered directions |
| steward | 17 | 17 | Young adult proportions with age-appropriate styling; explains care for the landscape |

There is one anchor model per band, not a different illustration for every integer age. The 17-year chapter is still an adolescent design. Milestones measure retreat development, not the passage of a real person's life. The super admin assigns the meaning and chapter requirements of actual milestones. No fabricated business milestones ship as active policy.

## Art and format inventory

15 transparent painterly concept references: 5 chapters x warm/monsoon/cool. PNG originals and lossless WebP conversions preserve the supplied alpha. Soft edge shading is part of these draft references; approve compositing on both white and dark surfaces before production.

15 editable SVG rigs with 640x1040 PNG exports; 60 stylised front/three-quarter/profile/back view studies in SVG and PNG; 30 facial expression studies and 40 mouth studies in SVG and PNG; 120 motion combinations in SVG and transparent animated WebP, plus 120 midpoint key-pose PNGs and JSON timelines. Raster motion is a 12 fps preview at 192x312. SVG and the native web player interpolate smoothly at the display's rate. Animated WebP plays once; a fresh image load replays it. Animated SVG plays once on open; reduced motion uses its final pose. Do not use exported animated images as an uncontrolled looping visitor mascot.

The working vector rig is a **simplified interpretation**, not a traced or layered copy of the detailed illustration. View studies are stylised references, not measured 3D orthographic sheets. No PSD, AI, Rive, Spine, Lottie, FBX or 3D source is claimed. A production animator must redraw/layer the painterly style to animate that exact artwork. The SVG kit can be integrated now as a separate visual treatment after review.

## Wardrobes and props

Warm: breathable cream and green clothing, light footwear. Monsoon: sage raincoat, ochre boots, botanical umbrella when standing. Cool: cream knit layer/shawl over the same base identity. Seated and gardening studies set the umbrella aside so hands remain available. Rain gear does not imply it is currently raining.

The proposed local calendar is warm March-May, monsoon June-October, cool November-February, with explicit admin override. This is a design profile, not a forecast or a claim about observed weather. Use the retreat's fixed location and existing seasonal policy; never infer the visitor's location. Fresh provider observations may refine atmosphere in the future. Severe weather, stale observations and provider failures use the existing still fallback. Wardrobe changes do not change her chapter or approval status. Pin chapter, wardrobe, kit version and bundle digest for a visitor session; apply new releases on the next session. No age morphing during a visit.

## Motion direction

| State | Duration | Distinct mechanics |
| --- | --- | --- |
| resting | 3.2 s | Quiet breathing, blink, slight head response |
| walking | 2.8 s | Two in-place gait cycles, opposite arms, flexing knees, foot pitch, weight transfer |
| talking | 3.6 s | Silent sample mouth shapes and conversational forearm gesture |
| sitting | 3.6 s | Seated bench pose, relaxed hands, listening head response |
| storytelling | 5.2 s | Seated open book, page turn, describing hand, silent mouth shapes |
| waving | 3.2 s | Raised arm with independent wrist waves |
| pointing | 3.2 s | Directional arm and restrained hand gesture |
| gardening | 4.8 s | Bend, watering-can tilt, water appearance and recovery |

The wave begins and ends in its raised-arm pose; sitting starts seated. These are action studies, not complete entrance/exit choreography. Walking is in place; the host app controls screen position and navigation. The umbrella is a static held prop during the walk. Mouth shapes rest/A/E/O/U/M/F/L are approximate visual groups, not phonetic alignment. The sample sequence is silent. Record and license a narrator separately, then supply validated timestamps in a future audio adapter. No generated or cloned child's voice is included. Expressions: gentle, smile, curious, thoughtful, listening, delighted. Some restrained expressions share a base face, with small mouth/brow changes.

Layer order: bench/plant, legs, rear arm/umbrella, neck, torso/clothing, satchel, foreground arms/props, head/hair. Each SVG names body/head/upper and lower arms/hands/thighs/shins/feet/page/can/water/blink. `data-origin` gives local pivot coordinates in a 320x520 artboard. The matching JSON timeline describes absolute x/y/rotation/scale/opacity keyframes and mouth shapes. Uniformly scale the entire artboard; do not move pivots independently. SVG is the editable master; exported PNGs are previews. Preserve namespaces when placing multiple instances.

## Growth policy and AI contract

`src/hrudhi/policy.js` is a pure shared rule module. It accepts versioned policy, server-authoritative completed milestone IDs, reviewed chapter bundles, installed chapter digests, current chapter and a structured AI recommendation. It rejects unreviewed/withdrawn assets, stale kit versions, digest mismatches, out-of-range chapters, unmet requirements and revision conflicts. Publication defaults to one chapter forward. `allowSkip` requires an explicit admin policy choice. AI can retain the current chapter; it cannot invent artwork or rewrite approvals. A missing recommendation returns awaiting-recommendation, never a simulated AI result.

Policy schema v1: positive revision, publication mode `automatic-approved-only` or `review-before-publish`, explicit boolean allowSkip, exactly five unique known chapter rules; each rule has up to 20 unique safe milestone slugs. Completed IDs are bounded to 100. Review sets are bounded to five and must bind kit version and 64-character SHA-256 to the installed bundle. Recommendation schema v1 contains matching policyRevision, eligible chapterId and rationale up to 500 characters. The host API validates types, rejects unknown fields and disallows free-text instructions masquerading as policy. This rule module performs no authorization or cryptographic signature verification.

AI receives only eligible chapter IDs, milestone categories/verified completion facts and bounded summaries. Treat milestone text as untrusted data. AI returns one structured choice. Run the shared rule module again server-side in the publication transaction. Do not send family records, photographs or visitor data to the model. Record model/provider version and a short decision rationale, not hidden reasoning. If AI fails, returns an invalid result, or eligibility changes, keep the approved current chapter, or hide the guide if its approval was withdrawn. An administrative rollback is a separate audited operation, never an AI regression.

All bundled artwork is draft. A real review record must include reviewer identity, consent/authority record, reviewedAt, kitVersion and chapter-bundle digest. Approve the entire age/season/action chapter bundle, not a filename alone. Bundle hashes include shared rig/player source. Any member change invalidates that approval. Verify member bytes against bundle hashes on upload and before activation; hashes detect changes but do not prove identity or authorization.

## Planned backend: /api/v1/hrudhi

**Contract only. No endpoints, authentication, model or database are implemented by this static release.**

| Method / route | Permission | Required behavior |
| --- | --- | --- |
| GET /manifest | public, read only | Return only active reviewed version/chapter/wardrobe URLs and digests; ETag; exclude family review records |
| GET /milestones?limit=20&cursor=... | hrudhi:read | Stable cursor on createdAt/id; max 100 results; bounded metadata |
| PUT /policy | hrudhi:admin | Super-admin claim verified server-side; complete schema v1; If-Match revision; audit before/after |
| POST /milestones | hrudhi:admin | Unique safe ID, category, bounded title, requirements; Idempotency-Key; no arbitrary asset URLs |
| POST /milestones/{id}/complete | hrudhi:admin | Verified completion, expectedRevision; idempotent; audit; trigger recommendation job |
| POST /reviews | hrudhi:review | Named authorised family reviewer or delegated approver; bundle digest, authority, decision and timestamp |
| POST /recommendations | hrudhi:admin or trusted worker | Server generates input from eligible set; idempotency key; model output passes shared rules |
| POST /publications | hrudhi:publish or trusted worker | Recheck policy/completions/reviews/installed hashes and expectedRevision atomically; publish only approved candidate |
| POST /rollback | hrudhi:admin | Explicit reason and reviewed target release, optimistic revision, no asset deletion; next-session effect |

Use Firebase Auth verified claims if that backend is adopted; never trust a browser role flag. Family reviewers cannot change policy. Background workers have only recommendation/publication capabilities. Apply CSRF protection for cookie sessions, bounded rate limits and server-side validation. Errors: 400 invalid input, 401 unauthenticated, 403 insufficient permission, 404 unknown milestone, 409 revision/idempotency conflict, 422 ineligible or unreviewed candidate, 429 rate limited, 503 model unavailable. Return `{error:{code,message,requestId}}` without personal records or stack traces. List responses use `{items,nextCursor}`. This proposal requires a versioned OpenAPI document, backend implementation and permission/integration tests before production.

Audit events: policy.updated, milestone.created, milestone.completed, review.recorded, recommendation.created/rejected, publication.applied, rollback.applied, approval.withdrawn. Retain actor/service ID, source time, request ID, idempotency key hash, old/new revision, chapter and bundle digest; no raw family text or model prompts. Metrics: decision latency, blocked reason counts, publication failures, asset-load failures. No telemetry is enabled in Natura; configure a destination and retention before implementation.

## Integration and accessibility

Import `renderHrudhi` and `createHrudhiPlayer` from the ESM source. Insert the renderer into a trusted container, then create the player on that SVG. It supports play, pause, seek(0..1), setSpeed(0.5/1/1.5), progress and dispose. The player never autoplays, loops or fetches data. Respect operating-system reduced motion; provide still artwork and the same text information. Cancel on route exit, pause on tab hiding. Play stays disabled for reduced motion. Do not place the character over navigation, booking controls or reading content. Offer a persistent dismiss button and make any tour opt-in. Captions/transcripts and text navigation must work without the mascot, motion, audio or AI. Announce messages, not every animation frame. The character must never be the only way to complete a task.

The Natura demo uses explicit Play controls and a sample policy evaluator. Its “simulate approval” checkbox is not an approval record. Permanent activation requires actual family review, art/rig consistency review and the future backend gates. No exact painterly animation fidelity, full tour flow, real weather feed or voice system is claimed in v0.2.0.

## Review and release checklist

Review five age anchors together; compare eyes, complexion, hair, leaf clip, proportions and manner. Review all three costumes and eight actions per chapter; check hands, knees, props, occlusion, transparent edges and white/dark composites. Review profile/back studies as stylised drafts. Obtain named approval for the bundle digest. Integrate a single approved chapter behind a dismissible opt-in guide. Verify desktop/mobile keyboard access, screen-reader text, reduced motion, hidden tabs, no blocked controls and no continuous motion. Recheck policy transactions, asset hashes, stale recommendations and permission failures. Withdraw approval and test the hide/fallback path. Keep a reviewed previous release for rollback.

Custom assets and code are licensed only for authorised Aroha Retreat websites under the root Aroha Retreat Restricted Use License. Public repository availability does not permit reuse for other public websites. Preserve MIT/OFL third-party notices. Concept references were generated with OpenAI image generation; vector rigs and motion timelines were authored as source. Family approval is pending. No private history or photographs are distributed.

## Web library and video studies

All 15 wardrobes, 120 action combinations, 60 view studies, 30 expressions and 40 mouth shapes are browsable directly in Natura. Chapter and wardrobe filters and bounded pages make the full collection available without loading every large file at once. This full guide is also readable within the character lab. Downloads remain an optional handoff format.

The revised facial direction uses more naturally proportioned almond eyes, medium dark brows, softly oval cheeks and a quiet smile. It is a fictional design proposal, not a portrait record or an age prediction. The illustrated references and vector rig remain distinct interpretations, all draft pending family review.

Five silent 1280x720, 24 fps vector films show welcome, gardening, storytelling, orchard walking and canopy guidance. MP4 files have a white illustrated scene. The separate isolated-character WebM files retain alpha. Captions describe actions; there is no spoken voice, narration or audio lip-sync. These are rendered from the editable joint rig, not AI animation of the painterly illustrations. Native video controls wait for an explicit play action, allow pause and seeking, and the lab pauses videos on route exit or tab hiding. A poster is shown until playback.
