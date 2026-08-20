# AILIS Voice Experience Audit

Date: 2026-08-18

## Scope

- Desktop ASR recording, VAD, local Whisper execution, runtime installation state, and transcript submission.
- Desktop and Web TTS provider selection, chunked synthesis, playback interruption, lip sync, and error reporting.
- The deployed Web experience at `https://101.133.239.56/Test/` and the local production build.

## Findings

### Deployed Web experience

- The deployed page responds successfully over HTTPS and supports TTS voice selection.
- The deployed page is still labelled `v1.2.0`.
- Its shipped JavaScript contains browser speech synthesis but no `SpeechRecognition`, `webkitSpeechRecognition`, or microphone capture path.
- Users can choose a voice but cannot preview it before starting a conversation.

### Desktop experience

- Recording, audio-level feedback, VAD modes, WAV conversion, local Whisper transcription, and continuous listening already exist.
- The microphone button previously checked only browser/Electron media APIs. It did not check whether the local ASR runtime and model were installed.
- The current installed runtime reports both local ASR and CosyVoice3 as not ready. The ASR model cache and verified Python runtime are absent.
- One-shot voice input immediately submitted recognized text, leaving no chance to correct recognition mistakes.
- Permission, missing-device, busy-device, and missing-runtime failures were shown through the same generic error path.

### TTS implementation

- Server TTS, CosyVoice3, and Web Speech fallback are already separated behind the speech-provider layer.
- Chunked TTS preserves source order, supports cancellation, and starts avatar lip sync only after real playback begins.
- TTS failure notices stay outside the conversation transcript.
- The core TTS pipeline did not need replacement; the main gaps were discoverability and first-run feedback.

## Implemented changes

- Added review-first browser speech recognition to the Web composer.
- Added listening, processing, final-result, unsupported-browser, permission, device, and network states.
- Added a TTS preview button for the currently selected Web voice.
- Added a desktop control-panel TTS preview that uses the selected ElevenLabs or CosyVoice3 provider without saving or changing preferences.
- Updated the Web version badge to `v1.4.0`.
- Added a desktop ASR readiness check backed by the actual runtime-component state.
- Missing or partial desktop ASR now leads directly to the voice settings instead of recording first and failing later.
- One-shot desktop recognition now inserts an editable draft. Continuous hands-free mode keeps its existing automatic-send behavior.
- Added human-readable desktop microphone and runtime error messages.

## Verification

- `pnpm test:voice-ux`: 49/49 passed.
- `pnpm build`: passed.
- `node --check` passed for all changed JavaScript entry points.
- Web layout checked at 1280x720 and 390x844: no horizontal overflow or composer overlap.

## Deployment status

- The Web voice experience was deployed on 2026-08-20 through the existing versioned-release layout on `101.133.239.56`.
- The active release is `/var/www/ailis/releases/20260820-145307-99378c4-voice-ux`, selected through the atomic `/var/www/ailis/current` symlink.
- The previous release, `/var/www/ailis/releases/20260812-08f2946-lipsync`, remains intact as the immediate rollback target.
- Deployment copied the previous release and overlaid only the `/Test/` dependency closure. Backend services, Nginx configuration, desktop assets, and unrelated Web pages were not changed.
- Server-side and external HTTPS smoke tests confirmed `v1.4.0`, the microphone control, the TTS preview control, and the shipped `SpeechRecognition` implementation.
- A real browser microphone-permission test still requires an interactive browser and user permission; automated verification did not record audio.
