# AILIS Realtime Voice Plan v2

Branch: `codex/realtime-voice-airi`

这版方案替代第一版。第一版的问题是太像“从零建一个完整实时语音系统”。现在的目标改成更务实的一句话：

> 在现有 AILIS 代码上，把 TTS 和 ASR 拆开优化，尽可能让 TTS 足够快、ASR 足够快；先不要追求端到端全双工。

## 1. 核心判断

AILIS 现在不是没有语音基础，而是链路太串行：

```text
用户说话 -> 录完整段 -> 本地 ASR -> 发给 LLM -> 拿到完整 payload -> 整段 TTS -> 播放
```

这条链路里有两个最慢点：

- ASR 慢：`MediaRecorder` 录完后才 `transcribeAudioBlob()`，Whisper/SenseVoice 是整段批处理。
- TTS 慢：`SpeechProvider.playSpeech()` 等最终 `displayText` 出来后才整段合成。

所以 v2 不先做“大一统 realtime controller”，而是拆成两个独立工程面：

```text
TTS 快速出声工程
ASR 快速出字工程
```

两条线可以并行推进，也可以单独回滚。第一优先级是 TTS，因为现有 `stream_text` 已经有 assistant 文本进度，改动小、收益直接。

## 2. 当前代码基线

### 2.1 TTS 现状

相关文件：

- `src/chat-tts-system.js`
- `src/speech-provider.js`
- `src/tts-audio-player.js`
- `src/ailis-companion-chat-service.js`
- `src/ailis-chat-service.js`

当前路径：

1. `ChatTTSSystem.sendMessage()` 调 `fetchAssistantTurnWithFallback()`
2. backend `stream_text` 期间只调用 `renderStreamingAssistantReply()`
3. 流式阶段只更新 UI 和 avatar cue
4. 最终 `renderAssistantReply()` 调 `playPreferredSpeech()`
5. `SpeechProvider.playSpeech()` 选择候选 TTS
6. CosyVoice3/Kokoro/native speech 都按完整文本合成
7. `TTSAudioPlayer.playSpeech()` 播放一个完整音频 blob

最大问题：

- 流式文本没有进入 TTS。
- TTS 没有 chunk/session/queue。
- `TTSAudioPlayer` 一次只能播一个 blob，没有“多个短句音频顺序播放”的队列。

### 2.2 ASR 现状

相关文件：

- `src/chat-panel-app.js`
- `src/desktop-speech-recognition.js`
- `electron/local-asr-manager.cjs`
- `electron/desktop_asr_worker.py`
- `electron/preload.cjs`
- `electron/main.cjs`

当前路径：

1. `chat-panel-app.js` 负责 manual / auto-vad / continuous 模式
2. `createDesktopSpeechRecognitionService().createRecorder()` 打开麦克风
3. `AnalyserNode` 每 120ms 判断声音和人声分数
4. 静音超过阈值后 `stopVoiceInput()`
5. `transcribeAudioBlob()` 把完整录音转成 16k WAV
6. `window.ailisDesktop.transcribeAudio()` 发 IPC
7. `desktop_asr_worker.py` 对完整 WAV 跑 Whisper/SenseVoice

最大问题：

- VAD 是实时的，但识别不是实时的。
- continuous 模式只是“反复录短段”，不是 streaming ASR。
- 录音结束点偏保守：`ASR_CONTINUOUS_SILENCE_MS = 1100`，用户停顿后还要等 1.1s。

## 3. 目标拆分

### 3.1 TTS 目标

让 AILIS 在 assistant 回复还没完整生成时就开始说第一段。

优先目标：

- 不换 TTS provider，先复用 `window.ailisDesktop.tts.synthesize()`
- 不要求 provider 真 streaming，先做 chunked TTS
- 每个 chunk 仍是一次普通 TTS 请求
- 多个 chunk 并发合成，但按原文顺序播放
- 播放时继续复用 `TTSAudioPlayer` 的音频口型

理想体验：

```text
LLM 开始输出 -> 收到第一句/半句 -> 立刻合成第一段 -> 播放第一段
后续文本继续合成 -> 排队播放
```

### 3.2 ASR 目标

先把当前 ASR 做到“短段、快停、快识别”，再接真正 streaming ASR。

优先目标：

- 保留当前本地 Whisper/SenseVoice 路径
- 调整 VAD 停顿策略，减少用户说完后的等待
- 支持更短的录音段快速提交
- 保持 continuous 模式稳定，不把环境声当用户消息
- 后续再加 cloud streaming ASR provider

理想体验：

```text
用户开始说话 -> 本地 VAD 立刻确认 speech-start
用户停顿 500-700ms -> 立即截断提交 ASR
ASR 结果回来 -> 自动发送消息
```

## 4. TTS 快速出声方案

### 4.1 最小改造路径

不先引入复杂全局 runtime，只加三个小模块：

```text
src/realtime-voice/tts-text-chunker.js
src/realtime-voice/chunked-tts-session.js
src/realtime-voice/tts-playback-queue.js
```

职责：

- `tts-text-chunker.js`
  从累计文本/增量文本里切出适合 TTS 的短文本。

- `chunked-tts-session.js`
  管一个 assistant 回复的 TTS 生命周期：appendText、flush、finish、cancel。

- `tts-playback-queue.js`
  管多个 chunk 音频的顺序播放，底层继续调用 `TTSAudioPlayer.playSpeech()`。

### 4.2 直接接入点

第一处：`src/ailis-companion-chat-service.js`

当前 `readTextStream(response, onChunk)` 只给累计文本：

```js
fullText += chunkText;
onChunk?.(fullText);
```

改成兼容式回调：

```js
onChunk?.({
  deltaText: chunkText,
  fullText,
});
```

为了不破坏旧调用，可以先让 `onProgress` 同时支持 string 和 object。

第二处：`src/chat-tts-system.js`

在 `sendMessage()` 里创建 AI 消息后、fetch 开始前打开 TTS session：

```js
const ttsSession = this.speechProvider?.createChunkedSession?.({
  audioPlayer: this.audioPlayer,
  vrmSystem: this.vrmSystem,
  onAvatarPlaybackStart: ...
});
```

然后在 progress 回调里：

```js
this.renderStreamingAssistantReply(partialPayload, aiMessageDiv);
ttsSession?.appendText(progress.deltaText || deltaFromFullText);
```

最终：

```js
ttsSession?.finish();
await ttsSession?.waitUntilDone();
```

如果 session 已经播放过，就不要在 `renderAssistantReply()` 里再整段 TTS。

### 4.3 Chunk 规则

先用确定性规则，不靠提示词让模型输出 `<break/>`。

中文优先规则：

- 硬切：`。！？\n`
- 软切：`，、；：`
- 首段要快：8-18 个汉字就可以触发一次 soft flush
- 后续段落：18-45 个汉字
- 最大等待：收到文本后 600ms 内没有硬标点，也 flush 一个可说片段
- 不切代码块、表格、URL、JSON 控制块

英文规则：

- 硬切：`.?!\n`
- 软切：`,;:`
- 首段 6-12 words
- 后续 10-24 words

### 4.4 TTS 并发与顺序

合成可以并发，播放必须顺序。

```text
chunk 0 -> synth slow -> result late
chunk 1 -> synth fast -> result early
playback queue waits for chunk 0
```

建议默认：

- `maxConcurrentTts = 2`
- `maxBufferedChunks = 4`
- 如果用户打断：cancel 当前 session，丢弃未播放 chunk，停止当前 audio

### 4.5 复用现有 TTS

不要先重写 CosyVoice3/Kokoro worker。第一版直接复用：

```js
window.ailisDesktop.tts.synthesize({
  provider: 'cosyvoice3',
  preset: 'anime_shy_soft',
  text: chunkText,
  speed: 0.92
});
```

以及：

```js
window.ailisDesktop.tts.synthesize({
  provider: 'kokoro',
  voice: 'zf_003',
  text: chunkText,
  speed: 0.98,
  timeoutMs: 120000
});
```

`SpeechProvider` 只需要新增能力：

```js
createChunkedSession(options) {}
```

旧的 `playSpeech()` 保留，作为 fallback。

### 4.6 TTS 指标

需要打点，不靠感觉：

- `assistant_first_delta_ms`
- `first_tts_chunk_ready_ms`
- `first_audio_play_ms`
- `tts_chunk_synthesize_ms`
- `tts_queue_wait_ms`
- `tts_cancel_to_silence_ms`

第一阶段目标：

- 首段文本出来后 800-1500ms 内出声
- 打断后 150ms 内停止当前音频
- 不重复整段朗读

## 5. ASR 快速出字方案

### 5.1 先优化现有 VAD + 批处理 ASR

这一步不引入新 provider，只调现有链路。

改造点在 `src/chat-panel-app.js` 和 `src/config.js`：

当前停顿阈值：

```js
ASR_CONTINUOUS_SILENCE_MS: 1100
ASR_CONTINUOUS_MIN_SPEECH_MS: 380
ASR_CONTINUOUS_VOICE_FRAMES: 3
```

建议新增一个 fast preset：

```js
ASR_FAST_SILENCE_MS: 650
ASR_FAST_MIN_SPEECH_MS: 280
ASR_FAST_VOICE_FRAMES: 2
ASR_FAST_MAX_RECORD_MS: 8000
```

不要直接替换默认值，先做 preference/实验开关：

```text
recognitionLatencyMode: balanced | fast
```

fast 模式：

- 更快收尾
- 更容易误触发
- 适合实时对话

balanced 模式：

- 保留当前参数
- 适合任务执行、嘈杂环境

### 5.2 分段策略

当前 continuous 模式每次完整录一段。可以改成“更短段”：

```text
speech-start
  -> collect until silence 650ms
  -> submit segment
  -> immediately restart listening
```

注意两点：

- TTS 播放时先暂停 listening，避免转写 AILIS 自己的声音。
- 以后支持 barge-in 时，只在检测到足够强的人声时停止 TTS。

### 5.3 ASR worker 加速

当前 `desktop_asr_worker.py` 的强项是复用已加载模型。可先做：

- 确保 app 启动后 warmup 已完成
- 首次打开语音模式时主动 warmup
- 记录 ASR 耗时：decode WAV、model inference、postprocess
- 对短音频走更短 chunk 参数或 SenseVoice 优先

不要在第一阶段做本地 streaming Whisper，成本高，收益不稳定。

### 5.4 真正实时 ASR provider

这条线独立做，不影响 TTS 快速出声。

新增 provider 抽象：

```js
createRealtimeAsrSession({
  sampleRate: 16000,
  onPartialText,
  onFinalText,
  onSpeechStart,
  onSpeechEnd,
  onError
});
```

候选 provider：

- Aliyun NLS / Qwen realtime ASR：更适合中文，WebSocket PCM 流。
- OpenAI realtime transcription：适合和 OpenAI provider 绑定。
- Web Speech API：不作为 Electron 主方案，只能作为 web fallback。

接入原则：

- API key 留在 Electron main 或本地 backend，不放 renderer。
- renderer 只推 PCM chunk 或 MediaStream 状态。
- provider 回传 partial/final transcript 事件。

### 5.5 ASR 指标

必须打点：

- `speech_start_detect_ms`
- `speech_end_detect_ms`
- `segment_duration_ms`
- `asr_submit_ms`
- `asr_result_ms`
- `asr_total_after_silence_ms`
- `false_trigger_count`
- `empty_transcript_count`

第一阶段目标：

- 用户停顿后 650-900ms 内提交 ASR
- 本地短句 ASR 尽量 1-3s 内返回
- continuous 模式误触发可控

## 6. TTS 和 ASR 的边界

不要一开始把 TTS 和 ASR 绑成一个大状态机。先定义简单边界。

TTS 对外：

```js
session.appendText(deltaText);
session.finish();
session.cancel(reason);
session.waitUntilDone();
```

ASR 对外：

```js
asr.on('speech-start', ...)
asr.on('partial-text', ...)
asr.on('final-text', ...)
asr.on('speech-end', ...)
asr.start()
asr.stop()
```

Chat 只负责粘合：

```text
ASR final text -> sendCurrentMessage()
assistant delta text -> TTS appendText()
user interrupt -> TTS cancel + optional agent abort
```

这个边界比第一版更重要：TTS 快和 ASR 快可以分别验证。

## 7. 分阶段落地

### Phase A: TTS 快速出声

最优先。

改动文件：

- `src/ailis-companion-chat-service.js`
- `src/chat-tts-system.js`
- `src/speech-provider.js`
- `src/tts-audio-player.js`
- 新增 `src/realtime-voice/tts-text-chunker.js`
- 新增 `src/realtime-voice/chunked-tts-session.js`
- 新增 `src/realtime-voice/tts-playback-queue.js`

验收：

- backend `stream_text` 回复时，第一句未等全文完成就开始播放。
- 最终文本仍完整显示。
- 不重复朗读。
- interrupt 可以停止当前 chunk 和后续 chunk。

### Phase B: ASR fast preset

改动文件：

- `src/config.js`
- `src/chat-panel-app.js`
- `src/desktop-speech-recognition.js`

验收：

- fast 模式下停顿收尾更快。
- continuous 模式能更快提交短句。
- 环境声过滤没有明显倒退。

### Phase C: TTS provider warmup and metrics

改动文件：

- `electron/main.cjs`
- `electron/desktop-cosyvoice3-tts.cjs`
- `electron/desktop-kokoro-tts.cjs`
- `src/speech-provider.js`

验收：

- 首次 TTS 慢的问题有明确状态提示。
- warmup 后短句合成耗时可观测。

### Phase D: streaming ASR provider

改动文件：

- 新增 `electron/realtime-asr-provider.cjs`
- 新增 `src/realtime-voice/realtime-asr-session.js`
- 修改 `electron/preload.cjs`
- 修改 `electron/main.cjs`
- 修改 `src/chat-panel-app.js`

验收：

- 能收到 partial transcript。
- final transcript 自动进入消息框或自动发送。
- TTS 播放时默认暂停 ASR，避免回声自触发。

## 8. 不做什么

第一阶段不做：

- 不做 OpenAI Realtime 全双工总线。
- 不重写本地 ASR worker。
- 不要求 CosyVoice3/Kokoro 真 streaming。
- 不让 LLM 输出 `<break/>` 控制 TTS。
- 不把 persona JSON 混进 speech text。
- 不把 GitHub Pages/tool/GAIA 相关工作混进这个分支的 realtime 实现提交。

## 9. 最小可执行任务

下一步最小任务建议：

1. 新增 `tts-text-chunker` 单元测试。
2. 新增 `chunked-tts-session`，用 fake TTS 测并发合成、顺序播放、cancel。
3. 修改 `readTextStream()` 支持 delta callback。
4. 在 `ChatTTSSystem` 中只对 backend `stream_text` 打开 chunked TTS。
5. 本地跑一个假 TTS smoke，不先接真实 CosyVoice3。

这样第一轮实现可以只解决一个问题：**assistant 文本一出来，TTS 就开始排队合成并尽快出声。**

ASR fast preset 放第二个 PR/提交做，避免一次改两条链路导致问题不好定位。
