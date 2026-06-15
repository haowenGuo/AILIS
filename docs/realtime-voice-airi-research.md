# Realtime Voice System Research, AIRI-Inspired

Branch: `codex/realtime-voice-airi`

This document is the design baseline for building a realtime voice system in AIGril 1.0.4. It is intentionally written before implementation, because the core risk is architectural: replacing one TTS provider will not make the app realtime. The app needs an intent/session layer that can connect voice input, LLM token output, TTS generation, playback, lip sync, persona surface, and cancellation.

## 1. What "Realtime Voice" Means Here

There are four practical levels:

| Level | Name | Behavior | User perception |
| --- | --- | --- | --- |
| L0 | Current segmented voice | Record a speech segment, run batch ASR, wait for full assistant payload, synthesize full speech, then play | Works, but feels turn-based |
| L1 | Low-latency turn-taking | Keep current VAD/ASR, but stream assistant text into chunked TTS and play the first chunk early | Feels much faster after the user stops speaking |
| L2 | Streaming ASR + streaming TTS | Stream mic audio to ASR, receive partial/final transcript deltas, stream LLM tokens to TTS | Feels close to live conversation |
| L3 | Native speech-to-speech/full duplex | One realtime model/session handles audio input, turn detection, tool calls, and audio output | Closest to GPT-4o/Realtime-style voice |

For AIGril, the recommended path is L1 first, then L2. L3 can be an optional provider, not the default architecture, because it can bypass AIGril's existing persona surface, local TTS, tool/runtime control, and privacy choices.

## 2. Current AIGril Voice Architecture

Current AIGril already has useful voice pieces:

- `src/chat-panel-app.js` has manual, `auto-vad`, and `continuous` voice input modes. Continuous mode repeatedly starts recording when the app is idle, uses analyser-based voice activity, then stops after silence and sends the transcript.
- `src/desktop-speech-recognition.js` records microphone audio with `MediaRecorder`, monitors level/voice score with `AnalyserNode`, then converts the final blob to mono 16 kHz WAV.
- `electron/local-asr-manager.cjs` sends the final WAV bytes to `electron/desktop_asr_worker.py`.
- `electron/desktop_asr_worker.py` runs batch ASR through Whisper or SenseVoice. It is not a streaming recognizer today.
- `src/aigril-companion-chat-service.js` can read backend streaming text and invoke `onProgress`, but progress is currently the accumulated full text, not token/delta events.
- `src/aigril-companion-chat-service.js` desktop LLM path calls `window.aigrilDesktop.llm.chat()` as a single final response, so daily desktop LLM chat is not token-streaming yet.
- `src/chat-tts-system.js` creates the assistant message and updates streaming text, but TTS starts after the final payload in `renderAssistantReply()`.
- `src/speech-provider.js` picks a final TTS candidate, then synthesizes the whole `displayText`/`speech_text`.
- `src/tts-audio-player.js` plays one audio blob at a time and drives lip sync from an analyser over the actual audio envelope.
- `src/character/persona-surface.js`, `src/character/character-state-machine.js`, and `electron/aigl-persona-renderer.cjs` already separate visible text from persona surface semantics.

The key gap: AIGril has no AIRI-like `StageTtsSession` abstraction. There is no per-assistant-intent object that receives LLM token deltas, chunks text for TTS, schedules playback, and can be cancelled by user speech.

## 3. What AIRI Actually Does

### 3.1 WebAI demo

The public WebAI realtime voice demo is not strict full duplex. In `apps/vad-asr-chat-tts/src/pages/index.vue`, VAD emits `speech-ready` only after a speech segment ends. The demo converts that segment to WAV, calls `generateTranscription()`, then streams LLM text, splits by `<break/>`, calls `generateSpeech()` per sentence, and queues audio by sentence index.

That is L1-style low-latency turn-taking, not live ASR while the user is still speaking.

### 3.2 AIRI main app

AIRI's stronger idea is on the output side:

- `packages/stage-ui/src/components/scenes/Stage.vue` opens one TTS session per assistant intent before message composition.
- `onTokenLiteral()` forwards every LLM token into `currentSession.appendText(literal)`.
- `packages/stage-ui/src/libs/speech/tts-session.ts` chooses either a segmenter path or a bidirectional WebSocket path based on provider capability, not hard-coded provider routing.
- `packages/stage-ui/src/libs/speech/streaming-pipeline.ts` opens `/api/v1/audio/speech/ws`, sends `start`, `text`, `finish`, receives binary audio chunks and sentence/session events, decodes audio, and schedules playback.
- `apps/server/src/routes/audio-speech-ws/*` is a server-side proxy to unSpeech/upstream streaming TTS, with auth, billing, usage, and request logs.

AIRI's input side has provider-gated streaming:

- Web Speech API provider: browser-only, `continuous = true`, `interimResults = true`; AIRI explicitly excludes Electron because Web Speech API depends on browser support/API keys.
- Aliyun NLS provider: streams PCM chunks over a WebSocket/HTTP bridge and emits transcript deltas.

The main lesson is not "copy a provider"; it is "make realtime a capability-driven session protocol."

## 4. External Architecture Signals

Official docs line up with the same split:

- OpenAI recommends realtime sessions for live low-latency audio and request-based audio APIs for bounded file/speech requests: https://developers.openai.com/api/docs/guides/realtime
- OpenAI recommends WebRTC for browser realtime voice connections, with a backend involved for session setup or ephemeral credentials: https://developers.openai.com/api/docs/guides/realtime-webrtc
- Alibaba Cloud Model Studio's realtime speech recognition streams audio over WebSocket and returns low-latency transcribed text: https://www.alibabacloud.com/help/en/model-studio/real-time-speech-recognition-user-guide
- BytePlus/Seed Speech documents bidirectional streaming TTS over WebSocket: https://docs.byteplus.com/en/docs/byteplusvoice/streaming_tts
- Azure Voice Live is a unified speech-to-speech API that avoids manually orchestrating STT, LLM, and TTS, but it is a provider-level architecture choice: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/voice-live

These sources suggest AIGril should keep two architecture paths:

- Composable pipeline: ASR provider -> AIGril LLM/tool/runtime -> TTS provider.
- Native realtime provider: one provider owns speech-to-speech and emits text/audio/events back into AIGril.

## 5. Proposed AIGril Architecture

### 5.1 Capability schema

Do not hard-route by provider name. Add a voice capability registry similar to AIRI:

```js
{
  transcription: {
    mode: 'batch' | 'stream',
    streamInput: true,
    interimResults: true,
    finalResults: true,
    sampleRate: 16000,
    transport: 'media-recorder' | 'pcm-websocket' | 'browser-speech-api'
  },
  speech: {
    transport: 'rest' | 'chunked-rest' | 'bidirectional-ws' | 'native-realtime',
    acceptsTokenStream: false,
    acceptsSentenceStream: true,
    returnsAudioStream: false,
    supportsCancel: true
  }
}
```

The UI and controller should ask "what can this provider do?" instead of "is this provider X?"

### 5.2 Runtime modules

Recommended new modules:

- `src/realtime-voice/realtime-voice-controller.js`
  Owns one active voice intent. State machine: `idle -> listening -> transcribing -> thinking -> speaking -> idle`, plus `interrupted` and `error`. Handles barge-in: when user speech starts during assistant playback, cancel active TTS and abort the assistant turn if configured.

- `src/realtime-voice/voice-input-session.js`
  Normalizes ASR providers into events: `speech-start`, `partial-transcript`, `final-transcript`, `speech-end`, `noise`, `error`, `closed`.

- `src/realtime-voice/segmented-local-asr-provider.js`
  Wraps current `createDesktopSpeechRecognitionService()` so the existing MediaRecorder + Whisper/SenseVoice path becomes one provider. This gives L1 without throwing away current code.

- `src/realtime-voice/assistant-stream-adapter.js`
  Converts chat services into `onDelta`, `onSurface`, `onFinal`, `onError`. Backend streaming can emit deltas now with a small change to `readTextStream()`. Desktop LLM needs a later IPC streaming path.

- `src/realtime-voice/tts-segmenter.js`
  Chunks assistant token deltas by punctuation, newline, max characters, max latency, and explicit flush. Do not depend on prompting the LLM to output `<break/>`.

- `src/realtime-voice/speech-output-session.js`
  AIRI-like session object: `appendText(text)`, `appendSurface(surface)`, `finishInput()`, `cancel(reason)`, `end()`. It chooses chunked REST TTS, bidirectional WebSocket TTS, native browser speech synthesis, or text-only fallback through provider capabilities.

- `src/realtime-voice/playback-queue.js`
  Schedules decoded audio chunks in order by intent/sequence, supports cancel by intent, and feeds actual audio envelope into the existing lip sync path.

### 5.3 Data flow

```text
Mic input
  -> VoiceInputSession
  -> final transcript
  -> ChatTTSSystem / assistant stream
  -> AssistantStreamAdapter
  -> visible text + persona surface deltas
  -> SpeechOutputSession
  -> TTS segmenter/provider
  -> PlaybackQueue
  -> TTSAudioPlayer / VRM lip sync / dialogue bubble
```

The persona surface must remain a separate internal channel. Never put `persona_surface` or `persona_output` into the visible/speech text stream. This matters even more in realtime, because partial JSON would otherwise leak mid-stream.

## 6. Implementation Plan

### Phase 1: L1 realtime output, minimal risk

Goal: keep current ASR, make assistant speech start before the full answer is complete.

Tasks:

1. Add `tts-segmenter.js` with deterministic chunking rules.
2. Add `speech-output-session.js` with a segmenter-based adapter around current TTS candidates.
3. Change backend streaming path so `readTextStream()` can emit both accumulated text and raw delta.
4. In `ChatTTSSystem.sendMessage()`, open a speech session before fetching the assistant turn, append text deltas as they arrive, and call `finishInput()` at stream end.
5. Keep final `renderAssistantReply()` as the authoritative text update, but do not re-synthesize the full final answer if the session already played it.
6. Add cancellation: `interruptCurrentTurn()` must cancel active speech session and playback queue before aborting the agent.

This phase should make daily backend-streaming chat feel much faster. It will not fix desktop LLM final-response mode until the desktop LLM provider supports streaming.

### Phase 2: Normalize current ASR

Goal: make current VAD/MediaRecorder ASR fit the new provider model.

Tasks:

1. Move current `chat-panel-app.js` ASR control flow into `SegmentedLocalAsrProvider`.
2. Emit normalized events from the provider instead of directly writing `inputEl.value` and calling `sendCurrentMessage()`.
3. Add barge-in policy: if user speech starts while AIGril is speaking, stop TTS immediately; optionally abort assistant turn after speech remains active for N frames.
4. Add echo protection: pause continuous ASR during TTS playback by default, then optionally support echo-cancelled full duplex later.

### Phase 3: Add true streaming ASR provider

Goal: real partial/final transcript deltas.

Provider candidates:

1. Cloud WebSocket ASR: Alibaba/Qwen realtime ASR or Aliyun NLS-style provider. Best fit for Chinese and AIRI-like architecture.
2. Browser Web Speech API: useful for web, but AIRI found it is not reliable in Electron.
3. Local streaming ASR: possible later with a streaming-capable engine, but current `desktop_asr_worker.py` is batch WAV-based.

Do not replace the existing local ASR. Keep it as the privacy/offline fallback.

### Phase 4: Optional native speech-to-speech provider

Goal: allow OpenAI Realtime/Azure Voice Live-style sessions as a provider.

This should be a separate provider transport: `native-realtime`. It should emit text transcript, audio output, tool-call events, and persona cues back into AIGril. It must not bypass AIGril's safety rules, tool runtime, or avatar state machine silently.

## 7. Latency Targets

Initial practical targets:

- L1 first speech chunk after first assistant text: under 1200 ms for local TTS once warmed.
- L1 first audio after user stops speaking: ASR time + LLM first token + first TTS chunk. This may still be 2-5 seconds on local Whisper/CosyVoice, but it should be much better than waiting for the full answer.
- L2 partial transcript: under 300-500 ms after spoken words.
- L2 final transcript after endpoint: under 500-900 ms.
- Barge-in stop playback: under 150 ms after confirmed user speech start.

These should be measured with timestamps in development logs, not guessed.

## 8. Risks

- Persona JSON leakage: realtime partial output makes this worse. The stream adapter must strip/hold internal JSON and only release visible text.
- TTS chunk quality: too-small chunks sound choppy; too-large chunks increase latency. Start with punctuation + 20-60 Chinese chars + 700 ms max-latency flush.
- TTS concurrency ordering: concurrent synthesis can return out of order. Playback must schedule by sequence.
- Echo loop: continuous ASR may transcribe AIGril's own voice. Start with ASR paused during TTS, then add echo cancellation/full duplex later.
- Cancellation: every session needs an intent id and cancel signal. Otherwise old TTS chunks will play after a new user interruption.
- Provider costs/auth: streaming ASR/TTS must keep API keys in Electron main/backend, not renderer.
- Desktop LLM non-streaming: daily chat on `window.aigrilDesktop.llm.chat()` needs a streaming IPC API before it can fully benefit.

## 9. Test Plan

Unit tests:

- TTS segmenter chunks Chinese/English punctuation, max length, flush markers, and partial JSON safely.
- Speech output session preserves order when TTS promises resolve out of order.
- Cancel by intent drops queued and in-flight chunks.
- Persona surface extraction never leaks `persona_output`/`persona_surface` into visible text.

Integration/smoke tests:

- Fake ASR provider emits final transcript -> fake assistant stream emits deltas -> fake TTS provider emits audio buffers -> playback queue receives ordered chunks.
- Interrupt while speaking cancels playback and calls assistant abort.
- Batch local ASR still works in manual/auto-vad/continuous modes.
- Text-only fallback still updates UI and avatar state.

Manual verification:

- Warm local TTS, speak one short sentence, measure first audible response.
- Speak while AIGril is speaking, confirm playback stops quickly and no stale sentence resumes.
- Verify mouth movement follows actual audio envelope for chunked playback.

## 10. Immediate Next Engineering Step

The first code change should be Phase 1: add `SpeechOutputSession` and `TtsSegmenter`, then wire backend `stream_text` deltas into it. This gives the most visible latency win with the least provider risk and keeps the existing local ASR/TTS stack intact.
