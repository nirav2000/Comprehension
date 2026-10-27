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

Changes: quick-practice displays a single outlined green tick for each correct answer and outlined red X for each incorrect answer without list bullets. Both compact and expanded lesson flows use one Record + Dictate button to attempt simultaneous microphone recording and browser speech recognition. If automatic transcription is unsupported, audio can still be recorded; users can edit text or use keyboard dictation. Actual iPad/Safari speech recognition remains device-dependent and has not been physically tested.

## v0.4.0 — 27 October 2026 — answer coaching and evidence relevance

- Pre-change source checkpoint: [9b42826fda13d284ef6cb536219e16cf9d4b5c5f](https://github.com/nirav2000/Comprehension/tree/9b42826fda13d284ef6cb536219e16cf9d4b5c5f); full v0.3.0 state for rollback.
- Implemented separate `answer-ladder.html` pathway: technique selection, relevance prompts, word/idea checking, local attempt/revision history, and model answers. Existing compact exercises remain unchanged.
- AI review UI is explicitly marked *not connected*; no user text is transmitted by this release. Genuine language-model analysis requires a protected backend with access controls, rate limits and explicit consent.
- Existing recording and dictation remain in the established exercises; Answer Ladder accepts editable text or device keyboard dictation.
- Automated syntax verification passed. Physical iPad test and live GitHub Pages deployment verification are pending.

## v0.5.0 — 27 October 2026 — Cloudflare AI, parent sync, ChatGPT routes

- Pre-change immutable source checkpoint: [6be31d7fcdb7bd5852ab122e47e995eb57e79654](https://github.com/nirav2000/Comprehension/tree/6be31d7fcdb7bd5852ab122e47e995eb57e79654).
- Implemented Cloudflare Qwen3 Workers AI service with verified Firebase ID tokens, explicit text consent, source-limited CORS, per-user rate limiting, and one-step coaching response schema. Worker health deployment succeeded.
- Implemented parent-owned Firestore answer history, older-exercise import, local backup, Ask ChatGPT prompt copy, and a GPT Actions OpenAPI contract. A private Actions token must be installed before that integration can authenticate.
- Synthetic model benchmark via the existing deployment API token returned 401 (insufficient REST inference permission); end-to-end marking still requires a signed-in practice request.
- Original short exercises remain visually unchanged and can transfer an answer into Answer Ladder.

## v0.6.0 — 27 October 2026 — secure Sai device pairing

- **Pre-change checkpoint:** [216b086e3d4801c04de8f30472af66d8ff06175a](https://github.com/nirav2000/Comprehension/tree/216b086e3d4801c04de8f30472af66d8ff06175a).
- Added a separate anonymous learner Firebase identity, displayed pairing UID, parent approval/revocation, and automatic append-only sync of answers and AI feedback after approval. The learner identity cannot read other family records or approve itself.
- Extended existing kk-syllabus Firestore rules with tightly scoped approvedDevices and events permissions. Security rules released by the existing deployment workflow (see kk-syllabus Actions history).
- Expanded parent view to 500 recent synced events and added history export.
- Release v0.6.0 uses Qwen3. The Cloudflare Worker deployment and Firestore security-rule workflows completed successfully; actual child-device pairing and signed-in AI marking require testing with real credentials and a physical device.
- **User setup:** Firebase Anonymous provider must be enabled, parent must approve child's UID; for GPT Actions a private long bearer token must be stored as Apps repository secret and in the GPT Actions configuration.
