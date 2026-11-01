# Natura 0.6.1 — profile-picture downloads

Issue #20 adds the standalone retreat symbol to Logos as three 2048px profile-picture PNG downloads: full-colour on white, full-colour on transparent, and the existing white symbol on forest green #163E2D. Original outlined geometry is retained, with centered circular-crop padding. Full-colour/white symbol SVGs and the micro favicon SVG are directly downloadable. Hrudhi remains 0.3.0-alpha.1.

This is a static UI/asset change. No API, authentication, data, telemetry, root-website content or runtime setting changes are authorised by this release. Validate responsive layout, PNG dimensions/background pixels and download bytes. The normal Natura-only Hosting deployment remains disabled.

The currently served root website is an older artifact than the separate website repository. Publishing that repository's newer application would exceed this logo update. The supported Hosting version-clone API can preserve the entire current production version and its configuration, add only /design files, and verify every non-design file hash before publication. If this preservation route is used, record the immutable source/new version IDs, compare the complete root file map and config, stage the cloned version for browser review, and refuse publication if live advances meanwhile. The website repository continues to own full-site composition and deployment.

Rollback uses the recorded prior immutable Hosting version. Do not change Functions, rules, content, access permissions or Auth domains for this update.
