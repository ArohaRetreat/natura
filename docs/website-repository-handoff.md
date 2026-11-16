# Website repository handoff

On 1 November 2026, Vishruth requested a separate website repository and explicitly chose public visibility. The authoritative destination is [ArohaRetreat/website](https://github.com/ArohaRetreat/website).

Natura main never contained the website implementation. The website feature branch and [PR #17](https://github.com/ArohaRetreat/natura/pull/17) are preserved for historical provenance and closed without merging application code here. The reviewed website source/evidence head `6da2b8c8e1a5d80f8fbe732eb9f24faf15970af9` is imported into the new repository, including all supplied media, host studio/API, rules, tests and historical evidence. Ignored credentials and local owner/runtime files are not transferred.

Natura continues to own the design studio, original Hrudhi identity and farm-atlas deliverables. The website consumes a small pinned export of Natura fonts/logos/nature runtime, not the design studio’s source or build pipeline. [Website import #1](https://github.com/ArohaRetreat/website/issues/1) tracks the validated source move. [Website acceptance #2](https://github.com/ArohaRetreat/website/issues/2) keeps all unfinished visual/device/production/CMS/observability criteria open.

## Shared Hosting safety

Firebase `aroha-retreat` still serves both applications. A Firebase Hosting release replaces the entire site: publishing Natura-only output would remove the public website. Therefore `npm run deploy` in this repository now refuses shared-site deployment. `npm run build` still exports `dist/design` normally. Pass the reviewed export to the separate website repository’s composition command; it pins the Natura release and verifies both applications and all artifact hashes before deployment.

Do not deploy the design-only directory through the raw Firebase CLI. No Hosting, Functions, rules, data, access, billing or domain changes are performed as part of this source split. Existing live website and preview revisions remain unchanged until a separately authorised release.

## Tracking

[Separation milestone](https://github.com/ArohaRetreat/natura/milestone/1) and [migration issue #18](https://github.com/ArohaRetreat/natura/issues/18) record completion of repository separation. [Original website issue #16](https://github.com/ArohaRetreat/natura/issues/16) is superseded by website tracking; closing it does not claim that the website’s outstanding acceptance gates are complete. Other Natura issues, including original-character work, remain independent.
