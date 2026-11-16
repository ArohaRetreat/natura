# Native Hrudhi study 05 — 2026-11-01

Issue #13 remains open. PR #14 publishes the recovery as Natura 0.6.0 with Hrudhi 0.3.0-alpha.1. This is not a completed character kit; issue #13 stays open. Deployment confirmation is recorded separately.

Photoshop authored a separate layered study for Explorer / warm: Neutral, Happy, Curious and Thoughtful. Mouth and brow changes use the original painted features; native sampled skin painting provides local cleanup, and a subject mask removes the original haze. Original eye and nose layers protect those features across states. No new face was generated. The emotional readings are restrained and need review; they are not approved final acting.

Native Character Animator Pro successfully imported the PSD, created a scene and exported a `.puppet` checkpoint. Rig origins, facial swap triggers, eyelids, visemes, limb constraints and action performance are still unfinished. The custom rig controls were not exposed to current desktop automation. Do not infer a completed rig from this import or its default behaviors.

Local checks executed:

- 52 application tests passed.
- Native expression comparison loaded at 390 and 1440 px without horizontal overflow, page errors or failed requests.
- Four native exports differ in edited mouth/brow pixels; selected left-eye, right-eye and nose ROIs are identical across states. Background corners have alpha 0. These tests do not certify all hair-edge transparency or professional facial acting.
- Native puppet ZIP CRC passed; one embedded PSD matches the current native source SHA-256 exactly; no audio entries.
- Immutable original identity verification passed as part of the preview build.

Evidence is local in `release/native-expression-review.json`, `release/native-puppet-checkpoint.json` and the comparison screenshots. These local checks do not imply family approval, physical-device acceptance or native performance validation. Production deployment is a separate release step.

Run `node scripts/build-original-preview.mjs` for the local original-art preview. It preserves the ordinary production build and adds `hrudhi/NATIVE-STUDIES.html` when native exports exist. See `adobe/README.md` for the native workflow and working-file locations.
