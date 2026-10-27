# Comprehension Coach — version history

All releases are recorded on **main**. Each release entry identifies a permanent Git commit so it can be inspected or restored without creating branches. Before changing a released feature, record the previous state here.

## v0.1.0 — 27 October 2026 — baseline checkpoint (before visual fidelity correction)

- **Immutable source snapshot:** [c1d4fe19a1b338e85899797e2b69c581c1147c21](https://github.com/nirav2000/Comprehension/tree/c1d4fe19a1b338e85899797e2b69c581c1147c21).
- Existing Learn to Explain scaffolding, speech recorder/dictation, progress and parent dashboard.
- The green/dark-green interface is **not** the requested reference look; this version is retained for rollback/reference.
- The separately existing original four-stage Comprehension exercises are unaffected.
- Release numbering starts here because the repository previously had commit history but no explicit, user-facing release-version file.

Every later release must:
1. Preserve a verifiable previous commit as above.
2. Update `version.json` and the visible app version label.
3. Explain the changes and any known limits in this log.
4. Test learner flows, existing exercises, and iOS/browser fallbacks before verification claims.

## v0.2.0 — visual fidelity and original-widget restoration

Planned after this baseline checkpoint; not yet released.
