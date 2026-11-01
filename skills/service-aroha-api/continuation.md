# Aroha API continuation

Issue #16; Node 22 Firebase Functions v2 arohaApi, asia-south2. Prepared transactional drafts/publication/revisions, owner bootstrap from ignored runtime env, verified-email invitations and role-controlled membership. Every mutation re-checks membership within its transaction. Direct Firestore writes/draft reads and unauthorized Storage writes are denied. Bucket aroha-retreat.firebasestorage.app was provisioned in ASIA-SOUTH2 after the user enabled Blaze; production rules and function are now deployed.

The local emulator integration passed save/conflict/publish/restore, wrong/uninvited identity denial, editor publishing/access denial, immutable public image upload MIME checks, role escalation/owner protection, revocation and invitation cancellation. Browser studio checks used synthetic emulator Google identities, not actual OAuth. A synthetic OTLP collector verified separate trace/log/metric protobuf exports, bounded labels and exclusion of private enquiry text. Libraries are pinned with audited lockfiles; repeat affected checks after further changes.

Production owner addresses are configured only in ignored functions/.env.aroha-retreat. Never ship emulator .env.local. DYNATRACE_PLATFORM_TOKEN is in Secret Manager and export is enabled. Final deployed function revision arohaapi-00002-cel has tenant-searchable correlated logs/spans and request metrics for a real denial probe. RUM tag, browser linkage and authenticated production owner acceptance remain pending. Durable audits have no automated BizEvent/replay exporter; SDLC export also remains pending. Keep actual PR/CI/provider revision evidence in issue #16/release-evidence.

Deployed code 3088054b04f52dc59d1271c6dcff8281a06eda90; all three CI jobs passed. Read release-evidence/aroha-0.1.0/release.md and issue #16 for precise evidence and open criteria.

Illustration review adds optional hero worldImage/eveningImage/foregroundImage keys to schema 1, validated under the existing image URL allowlist. Legacy records remain valid; unsafe-host regression coverage passes. This source change is not yet deployed to the production API.
