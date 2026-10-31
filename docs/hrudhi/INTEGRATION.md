# Hrudhi draft character kit v0.2.1

Family review pending. Aroha Retreat website use only. This does not activate a permanent visitor mascot.

Serve this folder with `python3 -m http.server 8780`, then open http://127.0.0.1:8780/example.html. ES modules require HTTP. Nothing is uploaded and the example does not call AI, weather or analytics services.

Start with `docs/hrudhi/Character-Bible.html` or its PDF companion. `assets/hrudhi/manifest.json` maps every deliverable and hash. Five chapter bundle files under `review-bundles/` bind shared runtime and chapter assets to a single review digest. All are draft. A real backend must verify every member, authenticate approvers, and recheck the current policy transaction before publishing. A browser simulation is not authorisation.

Detailed illustrated references live in `references/` as flattened PNG/WebP. The functional vector interpretation lives in `rigs/`, `motion/`, `poses/`, `turnarounds/`, `expressions/` and `mouths/`. The two styles are deliberately identified. A layered redraw is needed to animate the exact painterly illustrations. No proprietary animation project or 3D asset is supplied.

Native motion integration:

```js
import {renderHrudhi} from './assets/hrudhi/runtime/rig.js';
import {createHrudhiPlayer} from './assets/hrudhi/runtime/player.js';
const options={chapter:'explorer',season:'warm',state:'storytelling'};
container.innerHTML=renderHrudhi({...options,uid:'aroha-guide'});
const player=createHrudhiPlayer(container.querySelector('svg'),options);
// Connect explicit, accessible controls to player.play(), pause(), seek(0..1).
// player.setSpeed(0.5|1|1.5); player.dispose() on route exit.
```

Respect reduced motion, pause on tab hiding, and offer an opt-in tour with a persistent dismiss control. Keep equivalent text navigation and captions. Talking/storytelling contain silent visual mouth shapes, not a voice or lip-sync. Animated WebP and animated SVG play once when opened; the native player waits for Play. Use a still PNG for reduced-motion image contexts.

Five chapters cover 5-7, 8-10, 11-13, 14-16 and 17; they are not thirteen separate annual drawings. Each chapter has warm, monsoon and cool wardrobe artwork. Eight independent action studies make 120 combinations. Growth selects an approved chapter based on configured milestones; no elapsed-time growth and no mid-session age morphing.

SVG artboards: 320x520; static character PNGs: 640x1040; animated WebP previews: 192x312, about 12 fps, quality 88 with alpha retained. Vector timelines interpolate at display rate. Each animation is one pass. JSON timelines store pivots/absolute transform channels. Standalone mouth studies are approximate visual shapes, with no audio alignment.

Fonts included for the HTML bible are Source Sans 3 and Lora, under their OFL notices. Keep third-party licences. The root restricted licence applies to custom code/art, including this example. See the official source repository https://github.com/ArohaRetreat/natura for reproducible generators, tests and release evidence.

The website now includes the entire browsable asset library and readable character guide. Five silent MP4 scene films, five isolated alpha WebM clips, PNG posters and action-caption VTT files are supplied under assets/hrudhi/videos/. These animate the simplified vector interpretation; painterly references remain flattened illustrations.

Identity correction: the exact original reference masters and original facial rig are restored and pinned by identity-lock.json. No new face generation is authorised for seasons, poses or animation. Validate the identity lock before packaging.
