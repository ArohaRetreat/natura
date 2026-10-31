# Aroha Design Studio

A working design-system application for Aroha Retreat. Includes an identity explorer, searchable icon kit, type and colour references, controlled motion demonstrations, component previews, corrected PDF downloads, and a browser-local website builder.

Run `npm run build`, `npm test`, then `npm run dev`. Open http://127.0.0.1:8770. No dependency installation is needed for normal builds: fflate 0.8.3 is vendored with its MIT licence. Fonts are bundled with OFL licences.

The page builder saves the last valid version-1 document in localStorage on the current browser/origin. JSON import/export is the portable backup path. A static website ZIP contains editable HTML/CSS, the selected logo, four local font families and licences. It provides a draft contact email link; no booking backend, payment system or enquiry submission service is claimed. Service content must be checked before publishing a retreat website.

Draft JSON is capped at 100 KB, 16 sections and 8 service cards. Unknown fields are projected out, content is escaped, IDs are unique and section/icon types are allowlisted. The preview iframe allows same-origin fonts but no scripts. No customer account, database, data upload or tracking integration is configured.

Hosted access is owner-private through Sites. No public GitHub repository, app-launchpad-template adoption or CI workflow is claimed; owner/repository/visibility selection is pending. Source ownership and continuation: skills/design-studio/.

PDF correction: v1.1 centres every icon and caption within the same gallery cell, regularises contact-sheet column widths, and uses consistent baselines. Original v1 downloads remain preserved in the parent brand folder.
