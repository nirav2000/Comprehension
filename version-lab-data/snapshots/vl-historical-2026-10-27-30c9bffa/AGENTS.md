# Comprehension Coach development contract

Use the user's shared Apps components, not new bespoke clones, where the existing capability is sufficient.

This application uses the shared Apps Version Lab. Read and obey https://nirav2000.github.io/Apps/version-lab/AI_AGENT_CONTRACT.md. Do not build, expose or manually maintain local Version Lab logic or generated release snapshots.

Before risky refactors, preserve an exact Git commit. The existing VERSION_HISTORY.md and version.json predate Version Lab and remain historical compatibility records, not new release tooling.

Shared Auth v1 must remain in shadow migration mode until verified legacy Firebase UIDs and rights map correctly; never auto-upgrade a child's guest account or transfer parent access. Keep raw recordings local.

Shared Learning Sync v1 stores append-only learning events under the signed-in account; the original protected parent-viewable answer archive remains authoritative until its data migration is verified. Do not silently merge guest records into a signed-in account.

Run shared validation plus Comprehension's domain-specific tests on main before treating a change as verified. Treat child data as private, require explicit consent for AI model requests, and do not put secrets in GitHub Pages code.
