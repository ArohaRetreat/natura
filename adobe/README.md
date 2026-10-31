# Native Adobe working sources

The latest native review is study 05, for Little Explorer / warm only. It contains four static expression studies and a Character Animator puppet import/export checkpoint. It is not a completed animation kit.

## Native Photoshop workflow

Run these scripts through Photoshop File → Scripts → Browse, in order:

1. `Build-Hrudhi-Source.jsx` opens the immutable original PNG and saves a separate layered source PSD. It retains original face/hair pixels and separates body parts. It refuses to overwrite the source PSD.
2. `Build-Hrudhi-Review-Study.jsx` creates study 04 with native Select Subject masking, local sampled-skin painting and separate copies of original mouth/eyebrow features. It saves four state PNGs, four face crops and the layered PSD. Source geometry and neutral reference remain unchanged. The local feature cleanup is a study, requiring art review.
3. `Protect-Hrudhi-Identity.jsx` creates study 05, adding original eye and nose protection layers above the expression groups. It saves fresh PNGs and a fresh PSD, refusing to overwrite study 05.

Scripts operate on copies; never save changes into the original reference PNGs. Existing output filenames are checkpoints, not proof of quality. Earlier failed experiments are retained locally under ignored `review/hrudhi-performance/native-experiments/`, outside the delivered package.

## Verified native checkpoint

Photoshop saved `output/Hrudhi-explorer-warm-expression-study-v5.psd`. Neutral, Happy, Curious and Thoughtful have separate native layer groups and original feature layers. Browser pixel inspection found distinct edited faces while both eye ROIs and the nose ROI remain identical to the neutral export. Background corner alpha is zero. The subject mask removes the source haze; hair edges and limb seams still require art review.

Character Animator Pro imported this PSD and displayed it in a scene. File → Copy Media Files into Project Folder gathered the artwork. The exported `output/Hrudhi-Original-Feature-Study-v5.puppet` passes ZIP CRC validation, contains one PSD whose SHA-256 matches study 05 exactly, and has no audio entries. This proves an editable import/export checkpoint, **not working facial triggers, lip-sync or walking**. Custom rig/timeline controls were not accessible through the current desktop automation; those performances remain unfinished.

The native project is at `/Users/theharithsa/Documents/Adobe/Character Animator/Hrudhi Original Identity - Native Study/`. A current PSD/puppet/PNG review copy is under `/Volumes/SUPERMAN/Machy Contents/GitHub/ArohaRetreat/Hrudhi-Native-Working/Latest/`. These native outputs are ignored from the public repository. The local preview builder adds a web comparison and download links when the native outputs are available; it never substitutes a generated face when they are missing.

Original identity lock and masters remain authoritative. All studies are draft pending family review. Aroha Retreat websites only. No new native performance video or complete emotion/viseme kit is claimed.
