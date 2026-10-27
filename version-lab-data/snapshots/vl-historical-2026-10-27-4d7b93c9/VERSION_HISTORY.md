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

## v0.2.0 — 27 October 2026 — visual fidelity and original-widget restoration

- **Release commit checkpoint:** [3c0d9c91bf4677a481d2f6f72245719da2b399a1](https://github.com/nirav2000/Comprehension/tree/3c0d9c91bf4677a481d2f6f72245719da2b399a1).
- Preserved the original five-question progressive multiple-choice widget as a standalone compact practice view at `quick-practice.html`, with the same simple layout, neutral charcoal colours, white text, and green progress/checked indicators.
- Kept the expanded lesson/voice/parent tools separately at `explain.html`, now restyled with neutral grey surfaces and a near-black page background.
- Wired record-audio, optional Web Speech API dictation, editable text, simple feedback and local answer history into the compact widget.
- Added `version.json` and `v0.2.0` to the visible footer; changes on `main` only.
- Verified existing four Node tests; new compact view passes static syntax check. Real iPad microphone behaviour and live GitHub Pages publication are not yet verified.
- **Known limitation:** audio captured by the compact widget is only retained in the current browser session as an object URL; it does not automatically upload or transcribe. The full Learn to Explain pathway handles local recordings independently. Browser speech recognition varies by platform; iPad keyboard dictation remains a fallback.

## v0.3.0 — 27 October 2026 — planned voice and feedback refinement

**Pre-change checkpoint:** [91f10267ac7b57f3f45a8ba3bf44bd383bd50e2d](https://github.com/nirav2000/Comprehension/tree/91f10267ac7b57f3f45a8ba3bf44bd383bd50e2d). This is the immutable complete v0.2.0 tree immediately before the v0.3.0 work. Any changed file can be restored from this commit.

Changes will be documented here after implementation and testing.
