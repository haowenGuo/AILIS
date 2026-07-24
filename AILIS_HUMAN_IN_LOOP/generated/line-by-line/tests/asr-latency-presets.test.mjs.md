# tests/asr-latency-presets.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 asr-latency-presets 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：44
- SHA-256：`0d88b859e351d40a479e9659776557195e9f5638336b59ea8d52dea18cfdec55`
- 可运行副本：[打开源文件](../../../source/tests/asr-latency-presets.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`../src/realtime-voice/asr-latency-presets.js`
- 主要符号：`BASE_CONFIG`、`fast`、`balanced`、`manual`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 5 | <code>    getAsrLatencyPreset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 6 | <code>    isFastAsrMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    isVadRecognitionMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    normalizeAsrRecognitionMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 9 | <code>} from '../src/realtime-voice/asr-latency-presets.js';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>const BASE_CONFIG = Object.freeze({</code> | 声明局部标识符 `BASE_CONFIG`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    ASR_MAX_RECORD_MS: 12000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    ASR_MIN_INPUT_LEVEL: 0.01,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    ASR_CONTINUOUS_SPEECH_LEVEL: 0.02,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    ASR_CONTINUOUS_SILENCE_MS: 1100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    ASR_CONTINUOUS_IDLE_MS: 6500,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    ASR_CONTINUOUS_RESTART_MS: 450,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    ASR_CONTINUOUS_MIN_SPEECH_MS: 380,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    ASR_CONTINUOUS_VOICE_SCORE: 0.52,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    ASR_CONTINUOUS_VOICE_FRAMES: 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 21 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>test('ASR recognition mode normalization preserves existing modes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    assert.equal(normalizeAsrRecognitionMode('fast-vad'), 'fast-vad');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    assert.equal(normalizeAsrRecognitionMode('auto-vad'), 'auto-vad');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 26 | <code>    assert.equal(normalizeAsrRecognitionMode('continuous'), 'continuous');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    assert.equal(normalizeAsrRecognitionMode('manual'), 'manual');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    assert.equal(normalizeAsrRecognitionMode('unknown'), 'auto-vad');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 29 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>test('fast-vad lowers VAD latency without changing manual semantics', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    const fast = getAsrLatencyPreset('fast-vad', BASE_CONFIG);</code> | 声明局部标识符 `fast`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    const balanced = getAsrLatencyPreset('auto-vad', BASE_CONFIG);</code> | 声明局部标识符 `balanced`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    const manual = getAsrLatencyPreset('manual', BASE_CONFIG);</code> | 声明局部标识符 `manual`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>    assert.equal(fast.asrPreset, 'fast');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    assert.equal(balanced.asrPreset, 'balanced');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    assert.equal(manual.autoVad, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    assert.equal(isFastAsrMode('fast-vad'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    assert.equal(isVadRecognitionMode('manual'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    assert.ok(fast.silenceMs &lt; balanced.silenceMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    assert.ok(fast.levelPollingMs &lt; balanced.levelPollingMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    assert.ok(fast.recorderTimesliceMs &lt; balanced.recorderTimesliceMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 asr-latency-presets 的契约与回归行为。”这一文件职责。 |
| 44 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
