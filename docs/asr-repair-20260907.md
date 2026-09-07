# Desktop ASR Repair (2026-09-07)

## Observed Failure

The desktop selected `C:/Python313/python.exe`, whose user-site PyTorch failed
to import `torch._C` with a missing DLL error. Ordinary Python candidates were
accepted on `--version` alone. Packaged candidates could bypass their limited
package-presence check if an old manifest claimed they were ready.

The ASR manager also did not receive the persisted voice runtime directory from
the desktop, even though the voice installer already used that setting.

## Changes

- Pass the existing VoiceRuntimeBootstrap paths into DesktopASRManager.
- Check native imports and a tensor operation asynchronously before selecting
  any interpreter, including packaged runtimes. Preserve failed probe details.
- Use the configured voice venv without inherited user-site/PYTHONPATH packages.
- Share concurrent worker startup, reset selection/warmup on close or directory
  changes, and reject outstanding requests when closing the worker.
- Reset ASR after a successful voice-runtime repair. Do not let an old worker's
  close event reject a replacement worker's requests.
- Raise the standalone ASR pack's Transformers minimum to 4.53.3. Upstream
  source: https://github.com/huggingface/transformers/blob/v4.53.3/src/transformers/generation/logits_process.py
  (`WhisperNoSpeechDetection.set_inputs` removes unsupported `input_ids`).

No ASR decoding heuristics, TTS implementation, microphone capture, chat data,
model API credentials, or global Python packages were changed.

## Local Runtime

The existing installation candidates checked in the current and legacy AILIS
locations did not contain a usable ASR environment. A venv was created using
the already-installed Python 3.12, without downloading another Python base.

- Root: `F:/AILIS/main/models/voice-runtime`.
- Interpreter: `voice-venv/Scripts/python.exe`.
- Model: `asr-cache/models--openai--whisper-small`.
- Root saved through the desktop preferences IPC in the existing
  `desktop-state.json`, not a new settings file.
- PyTorch/torchaudio 2.3.1+cu121; Transformers 4.53.3; NumPy 1.26.4.
- Whisper model revision: `973afd24965f72e36ca33b3055d56a652f456b4d`.
- Weights: 966995080 bytes; SHA-256
  `1d7734884874f1a1513ed9aa760a4f8e97aaa02fd6d93a3a85d27b2ae9ca596b`.

Only JSON/tokenizer files and one safetensors weight file were downloaded.
Hugging Face's weight connection stalled. The same revision was obtained from
hf-mirror and verified against the upstream weight hash. No TLS checks were
disabled. CosyVoice models and ASR alternatives were not downloaded.

The user's persistent `CUDA_VISIBLE_DEVICES=-1` setting was left unchanged.
Removing it only in a diagnostic process confirmed the RTX 3060 can perform a
CUDA tensor operation. The restarted desktop respects the user's setting and
uses CPU for ASR.

## Verification

- 23 Node tests passed across local-asr-manager, asr-latency-presets and
  voice-runtime-bootstrap; main.cjs syntax check passed.
- `pip check`: no broken requirements.
- Real WAV fixtures generated from public synthetic Chinese sentences, not a
  user microphone recording. No private conversation was sent to TTS.
- Offline Whisper warmup: 11.059 seconds; recognition: 3.790 and 3.589 seconds.
- Fixture 1: meeting at 3 PM; recognized correctly, with traditional characters.
- Fixture 2: open control panel/check speech settings; one recognition error
  (`语音` became `以音`). These are execution tests, not a perfect-accuracy claim.
- After desktop restart, the actual chat preload `transcribeAudio` IPC returned
  fixture 1's transcription in 3.726 seconds, using the configured interpreter.
- Desktop log: `D:/Temp/ailis-asr-repaired-20260907.log`.

Repeat the offline runtime test with explicit WAV files:

```powershell
node scripts/verify-desktop-asr.cjs models/voice-runtime D:/Temp/ailis-asr-check-zh.wav D:/Temp/ailis-asr-check-settings.wav
```

## Scope / Follow-up

Microphone hardware capture was not tested; the WAV-to-desktop-IPC chain was.
The venv depends on the existing Python 3.12 base. This is not a new portable
Python distribution. The legacy shared CosyVoice installer still pins its own
Transformers version (4.51.3); rerunning that full shared-environment installer
can downgrade it. Separate ASR/TTS dependency provisioning remains a follow-up;
this repair does not claim to redesign or validate CosyVoice installation.
