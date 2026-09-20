# Automatic ASR wake gate

Only the existing `continuous` recognition mode opts in. The control panel calls
it 自动 ASR（唤醒词触发）. Manual, fast-vad and auto-vad do not load the KWS model.
The saved user preference is not changed by installation.

The microphone sends 16 kHz mono PCM in 256 ms frames to a single-thread CPU
sherpa-onnx keyword spotter in a worker. Before a hit only a rolling three-second
RAM buffer is retained. After a hit the existing endpoint timer finishes the
utterance and the existing ASR transcribe/send path receives a WAV. No background
audio is uploaded or transcribed before wake. Playback pauses automatic listening.

Default keywords: 艾莉丝、小艾同学、你好助手、帮我. “帮我” is explicitly requested by
the user and can also occur in background conversations; it has greater false-wake
risk than a dedicated name. It remains gated by the automatic-ASR preference.
The original phrase is retained in ASR audio, not stripped from the command.
These are explicit configured keywords,
not arbitrary semantic requests. The control panel offers preset checkboxes for
小助手、电脑助手、小艾小艾、莉丝莉丝、老婆、宝贝、亲爱的 as optional words.
Save settings to apply the selected list; an empty list is rejected. Selections
persist in desktop preferences. Arbitrary custom phonetic words and voiceprint
recognition are not included. This is not a security or identity boundary.

Preparation: `node scripts/prepare-wake-model.mjs`. If a download was placed in
build-cache/wake-download at the named archive path, use `--cached`.
Only one int8 encoder/joiner and fp32 decoder variant is bundled, plus tokens and
keywords. The generated source.json records download origin and local SHA256s;
these hashes are provenance, not independent publisher signatures.

Build includes build-cache/ailis-wake-model as extraResources and native sherpa
dependencies as unpacked modules. Prepare this directory before packaging.

Tests: `node --test tests/wake-word.test.mjs tests/asr-latency-presets.test.mjs`.
`node scripts/smoke-wake-model.cjs file.wav 你好助手` checks the real native model.
Synthetic speech tests do not establish live-room false wake rate or power use.
The recording owner remains the existing chat renderer; this patch does not
introduce an independent background microphone service.

## Windows development verification (2026-09-18)

- 18 unit/regression tests passed (wake gate, WAV format, microphone failure,
  ASR mode presets, browser recognition and existing spoken reply).
- Desktop Vite build and production source-closure audit passed.
- Real int8 model detected all four defaults and seven optional phrases (each
  optional phrase explicitly selected) in synthetic Chinese speech. 你好艾莉丝
  and 嘿艾莉丝 both matched 艾莉丝 without duplicate entries. 老婆 produced no
  hit when not selected. Offline inference RTF was about 0.03 on this machine,
  not a system CPU utilization or energy measurement.
- Isolated Electron fake-microphone test used the real AudioWorklet, preload IPC
  and native KWS worker. Manual-mode start was rejected; automatic-mode wake
  produced a 16 kHz WAV. Double-stop cleanup was verified by stop then cancel.
- Live microphone accents/noise, sustained power use, whole ASR-to-Agent execution,
  installed packages and Linux/macOS remain to be tested. User preference and
  running main checkout were not changed.
