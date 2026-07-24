# tests/voice-runtime-bootstrap.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：357
- SHA-256：`49d337fd3f07026e9bbfd6d9a1b9576f79e110b3d525f18a6cc8ed5ad3da8b74`
- 可运行副本：[打开源文件](../../../source/tests/voice-runtime-bootstrap.test.mjs)
- 依赖：`node:assert/strict`、`node:fs`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/voice-runtime-bootstrap.cjs`
- 主要符号：`require`、`createBootstrap`、`createSnapshot`、`paths`、`writeFile`、`createCosyVoiceSource`、`createCosyVoice3Model`、`files`、`createAsrSnapshot`、`repoDir`、`snapshotDir`、`bootstrap`、`plan`、`ids`、`snapshot`、`pythonStep`、`localPaths`、`projectPaths`、`summary`、`runtimeRoot`、`requiredSteps`、`optionalSteps`、`mirrors`、`savedEnv`、`indexes`、`args`、`voiceArgs`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import { afterEach, beforeEach, test } from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { VoiceRuntimeBootstrap, getVenvPythonPath } = require('../electron/voice-runtime-bootstrap.cjs');</code> | 导入依赖 `../electron/voice-runtime-bootstrap.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>let tempRoot;</code> | 声明局部标识符 `tempRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>beforeEach(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-voice-runtime-'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 15 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>afterEach(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    fs.rmSync(tempRoot, { recursive: true, force: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 19 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>function createBootstrap(platform = 'win32') {</code> | 定义函数 `createBootstrap`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    return new VoiceRuntimeBootstrap({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 23 | <code>        projectRoot: path.join(tempRoot, 'project'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        userDataPath: path.join(tempRoot, 'user-data'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 25 | <code>        appDataPath: path.join(tempRoot, 'app-data'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>function createSnapshot(bootstrap, overrides = {}) {</code> | 定义函数 `createSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    const paths = bootstrap.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>        paths,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 34 | <code>        selectedPython: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        cosyVoice3: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 36 | <code>            sourceExists: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 37 | <code>            modelExists: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 38 | <code>            acceleration: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 39 | <code>                cudaAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 40 | <code>                onnxRuntimeProviders: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 41 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>        asr: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 44 | <code>            modelCached: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 45 | <code>            modelId: 'openai/whisper-small'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>        ...overrides</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 48 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>function writeFile(filePath, content = '') {</code> | 定义函数 `writeFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 52 | <code>    fs.mkdirSync(path.dirname(filePath), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    fs.writeFileSync(filePath, content);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 54 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>function createCosyVoiceSource(paths) {</code> | 定义函数 `createCosyVoiceSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    writeFile(path.join(paths.cosyVoiceRoot, 'cosyvoice', 'cli', 'cosyvoice.py'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 58 | <code>    writeFile(path.join(paths.cosyVoiceRoot, 'third_party', 'Matcha-TTS', 'matcha', '__init__.py'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    writeFile(path.join(paths.cosyVoiceRoot, 'asset', 'zero_shot_prompt.wav'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 60 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>function createCosyVoice3Model(paths) {</code> | 定义函数 `createCosyVoice3Model`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    const files = [</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        'cosyvoice3.yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        'llm.pt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        'flow.pt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        'hift.pt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        'campplus.onnx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        'speech_tokenizer_v3.batch.onnx',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 70 | <code>        'CosyVoice-BlankEN/model.safetensors',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        'CosyVoice-BlankEN/tokenizer_config.json'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 72 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>    for (const file of files) {</code> | 声明局部标识符 `file`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        writeFile(path.join(paths.cosyVoice3ModelDir, ...file.split('/')), 'ok');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>function createAsrSnapshot(paths, modelId = 'openai/whisper-small') {</code> | 定义函数 `createAsrSnapshot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    const repoDir = `models--${modelId.replace(/[\\/]/g, '--')}`;</code> | 声明局部标识符 `repoDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 80 | <code>    const snapshotDir = path.join(paths.asrCacheDir, repoDir, 'snapshots', 'test-snapshot');</code> | 声明局部标识符 `snapshotDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 81 | <code>    const files = [</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        'config.json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        'preprocessor_config.json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        'tokenizer.json',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 85 | <code>        'model.safetensors'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    for (const file of files) {</code> | 声明局部标识符 `file`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        writeFile(path.join(snapshotDir, file), 'ok');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    return snapshotDir;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 91 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>test('voice runtime plan installs private Python when no Python is available', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 94 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    const plan = bootstrap.buildInstallPlan(createSnapshot(bootstrap));</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    const ids = plan.steps.map((step) =&gt; step.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 97 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 98 | <code>    assert.ok(ids.includes('install_portable_python'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    assert.ok(ids.includes('install_voice_python_packages'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 100 | <code>    assert.ok(ids.includes('install_cosyvoice_source'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 101 | <code>    assert.ok(ids.includes('install_cosyvoice3_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    assert.ok(ids.includes('install_asr_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    assert.equal(plan.requiresNetwork, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    assert.equal(plan.steps.every((step) =&gt; step.mutatesSystem === false), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 105 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>test('voice runtime creates private venv from selected system Python without Python download', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 108 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 109 | <code>    const snapshot = createSnapshot(bootstrap, {</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        selectedPython: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            source: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            command: 'python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 113 | <code>            args: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 114 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 115 | <code>                has_pip: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 116 | <code>                has_venv: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 117 | <code>                has_torch: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 118 | <code>                has_torchaudio: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 119 | <code>                has_transformers: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 120 | <code>                has_huggingface_hub: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 121 | <code>                version_info: [3, 12, 7],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 122 | <code>                onnxruntime_providers: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 123 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>        cosyVoice3: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 126 | <code>            sourceExists: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 127 | <code>            modelExists: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 128 | <code>            acceleration: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 129 | <code>                cudaAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 130 | <code>                onnxRuntimeProviders: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 131 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>        asr: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 134 | <code>            modelCached: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 135 | <code>            modelId: 'openai/whisper-small'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 136 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>    const plan = bootstrap.buildInstallPlan(snapshot);</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 139 | <code>    const ids = plan.steps.map((step) =&gt; step.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 140 | <code>    const pythonStep = plan.steps.find((step) =&gt; step.id === 'install_portable_python');</code> | 声明局部标识符 `pythonStep`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>    assert.deepEqual(ids, ['install_portable_python', 'install_voice_python_packages']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 143 | <code>    assert.equal(pythonStep.title, '创建 AILIS 私有 Python venv');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 144 | <code>    assert.equal(pythonStep.requiresNetwork, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 145 | <code>    assert.equal(pythonStep.command.tool, 'python');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 146 | <code>    assert.deepEqual(pythonStep.command.args.slice(-4), ['-m', 'venv', '--clear', snapshot.paths.voiceVenv]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 147 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>test('voice runtime plans ONNX GPU optimization when CUDA exists without CUDAExecutionProvider', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 150 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 151 | <code>    const snapshot = createSnapshot(bootstrap, {</code> | 声明局部标识符 `snapshot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        selectedPython: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 153 | <code>            source: 'voice-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            command: getVenvPythonPath(bootstrap.getPaths().voiceVenv, 'win32'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            args: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 156 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 157 | <code>                has_pip: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 158 | <code>                has_torch: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 159 | <code>                has_torchaudio: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 160 | <code>                has_transformers: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 161 | <code>                has_huggingface_hub: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 162 | <code>                torch_cuda_available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 163 | <code>                onnxruntime_providers: ['CPUExecutionProvider']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 164 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>        cosyVoice3: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 167 | <code>            sourceExists: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 168 | <code>            modelExists: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 169 | <code>            acceleration: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 170 | <code>                cudaAvailable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 171 | <code>                onnxRuntimeProviders: ['CPUExecutionProvider']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>        asr: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 175 | <code>            modelCached: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 176 | <code>            modelId: 'openai/whisper-small'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 177 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    fs.mkdirSync(path.dirname(snapshot.paths.voiceVenvPython), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 180 | <code>    fs.writeFileSync(snapshot.paths.voiceVenvPython, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>    const ids = bootstrap.buildInstallPlan(snapshot).steps.map((step) =&gt; step.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>    assert.deepEqual(ids, ['verify_cosyvoice3_runtime', 'install_onnxruntime_gpu', 'verify_asr_runtime']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    assert.equal(bootstrap.buildInstallPlan(snapshot).steps.find((step) =&gt; step.id === 'verify_asr_runtime').optional, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 186 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>test('voice runtime paths prefer project cache when present and local runtime otherwise', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 189 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 190 | <code>    const localPaths = bootstrap.getPaths();</code> | 声明局部标识符 `localPaths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 191 | <code>    assert.equal(localPaths.cosyVoiceRoot, localPaths.localCosyVoiceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>    fs.mkdirSync(localPaths.projectCosyVoiceRoot, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    const projectPaths = bootstrap.getPaths();</code> | 声明局部标识符 `projectPaths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>    assert.equal(projectPaths.cosyVoiceRoot, projectPaths.projectCosyVoiceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 197 | <code>    assert.match(projectPaths.voiceVenvPython, /local-runtimes/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 198 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 200 | <code>test('voice runtime cached summary is explicit before diagnosis', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 201 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    assert.deepEqual(bootstrap.getCachedSummary(), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        status: 'not_diagnosed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 206 | <code>        message: '本地语音运行时尚未诊断。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 207 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>test('voice runtime fast summary avoids full Python probing before diagnosis', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 211 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 212 | <code>    const summary = bootstrap.getFastSummary();</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>    assert.equal(summary.fast, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 215 | <code>    assert.equal(summary.status, 'needs_setup');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 216 | <code>    assert.ok(summary.installPlan.steps.some((step) =&gt; step.id === 'install_portable_python'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 217 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 219 | <code>test('voice runtime fast summary detects packaged ASR runtime independently from TTS runtime', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 220 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 221 | <code>    const runtimeRoot = path.join(tempRoot, 'project', 'build-cache', 'ailis-asr-runtime');</code> | 声明局部标识符 `runtimeRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 222 | <code>    fs.mkdirSync(runtimeRoot, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 223 | <code>    const paths = bootstrap.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 224 | <code>    fs.mkdirSync(path.dirname(paths.packagedAsrVenvPython), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 225 | <code>    fs.writeFileSync(paths.packagedAsrVenvPython, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 226 | <code>    createAsrSnapshot({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 227 | <code>        ...paths,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 228 | <code>        asrCacheDir: path.join(paths.packagedAsrCacheDir, 'hub')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 229 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>    fs.writeFileSync(path.join(paths.packagedAsrRuntimeRoot, 'manifest.json'), JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 231 | <code>        asrVenv: 'asr-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 232 | <code>        asrPython: path.relative(paths.packagedAsrRuntimeRoot, paths.packagedAsrVenvPython).replace(/\\/g, '/'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        asrCache: 'asr-cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        asrDependenciesReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        dependencies: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 236 | <code>            numpy: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 237 | <code>            torch: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 238 | <code>            transformers: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 239 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>    }), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>    const summary = bootstrap.getFastSummary();</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>    assert.equal(summary.asr.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 245 | <code>    assert.equal(summary.asr.modelCached, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 246 | <code>    assert.equal(summary.preferredAsrPython, paths.packagedAsrVenvPython);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 247 | <code>    assert.equal(summary.preferredPython, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 248 | <code>    assert.equal(summary.cosyVoice3.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 249 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>test('voice runtime v2 does not treat partial CosyVoice3 model directory as installed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 252 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 253 | <code>    const paths = bootstrap.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 254 | <code>    createCosyVoiceSource(paths);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 255 | <code>    writeFile(path.join(paths.cosyVoice3ModelDir, 'cosyvoice3.yaml'), 'ok');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 256 | <code>    writeFile(path.join(paths.cosyVoice3ModelDir, '.cache', 'huggingface', 'download', 'llm.pt.incomplete'), 'partial');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 257 | <code>    writeFile(paths.voiceVenvPython, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>    const summary = bootstrap.getFastSummary();</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 260 | <code>    const ids = summary.installPlan.steps.map((step) =&gt; step.id);</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>    assert.equal(summary.cosyVoice3.modelDirExists, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 263 | <code>    assert.equal(summary.cosyVoice3.modelExists, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 264 | <code>    assert.ok(ids.includes('install_cosyvoice3_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 265 | <code>    assert.ok(!ids.includes('verify_cosyvoice3_runtime'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 266 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>test('voice runtime v2 treats ASR as optional when TTS is verified', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 269 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 270 | <code>    const paths = bootstrap.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 271 | <code>    createCosyVoiceSource(paths);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 272 | <code>    createCosyVoice3Model(paths);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 273 | <code>    writeFile(paths.voiceVenvPython, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 274 | <code>    fs.mkdirSync(path.dirname(paths.manifestPath), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 275 | <code>    fs.writeFileSync(paths.manifestPath, JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 276 | <code>        schema: 'ailis.voiceRuntimeManifest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 277 | <code>        installerVersion: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        runtimeRoot: paths.localRuntimeRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 279 | <code>        components: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            cosyvoice3_smoke: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 281 | <code>                status: 'verified',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 282 | <code>                modelDir: paths.cosyVoice3ModelDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 283 | <code>                sourceDir: paths.cosyVoiceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 284 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>    }), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>    const summary = bootstrap.getFastSummary();</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 289 | <code>    const requiredSteps = summary.installPlan.steps.filter((step) =&gt; !step.optional);</code> | 声明局部标识符 `requiredSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 290 | <code>    const optionalSteps = summary.installPlan.steps.filter((step) =&gt; step.optional);</code> | 声明局部标识符 `optionalSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>    assert.equal(summary.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    assert.equal(summary.capabilities.tts.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 294 | <code>    assert.equal(summary.capabilities.asr.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 295 | <code>    assert.deepEqual(requiredSteps.map((step) =&gt; step.id), []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 296 | <code>    assert.ok(optionalSteps.some((step) =&gt; step.id === 'install_asr_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 297 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>test('voice runtime tries Python standalone mirrors before uv default GitHub source', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 300 | <code>    const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 301 | <code>    const mirrors = bootstrap.getUvPythonInstallMirrorCandidates();</code> | 声明局部标识符 `mirrors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 303 | <code>    assert.match(mirrors[0], /python-standalone\.org/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 304 | <code>    assert.equal(mirrors.at(-1), '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 305 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>test('voice runtime installs pip packages through mirrors with cache and retries', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 308 | <code>    const savedEnv = {</code> | 声明局部标识符 `savedEnv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        AILIS_PIP_INDEX_URLS: process.env.AILIS_PIP_INDEX_URLS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 310 | <code>        AILIS_PIP_INDEX_URL: process.env.AILIS_PIP_INDEX_URL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 311 | <code>        PIP_INDEX_URL: process.env.PIP_INDEX_URL</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 312 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 314 | <code>        delete process.env.AILIS_PIP_INDEX_URLS;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 315 | <code>        delete process.env.AILIS_PIP_INDEX_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 316 | <code>        delete process.env.PIP_INDEX_URL;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>        const bootstrap = createBootstrap();</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 319 | <code>        const paths = bootstrap.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 320 | <code>        const indexes = bootstrap.getPipIndexUrlCandidates();</code> | 声明局部标识符 `indexes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 321 | <code>        const args = bootstrap.buildPipInstallArgs({</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 322 | <code>            paths,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 323 | <code>            indexUrl: indexes[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 324 | <code>            packages: ['torch&gt;=2.6,&lt;3.0'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 325 | <code>            resumeRetries: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 326 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>        assert.match(indexes[0], /pypi\.tuna\.tsinghua\.edu\.cn/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 329 | <code>        assert.equal(indexes.at(-1), '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 330 | <code>        assert.ok(args.includes('--prefer-binary'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 331 | <code>        assert.ok(args.includes('--disable-pip-version-check'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 332 | <code>        assert.ok(args.includes('--timeout'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 333 | <code>        assert.ok(args.includes('120'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 334 | <code>        assert.ok(args.includes('--retries'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 335 | <code>        assert.ok(args.includes('10'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 336 | <code>        assert.ok(args.includes('--resume-retries'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 337 | <code>        assert.equal(args[args.indexOf('--cache-dir') + 1], paths.pipCacheDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 338 | <code>        assert.equal(args[args.indexOf('--index-url') + 1], indexes[0]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>        const voiceArgs = bootstrap.buildPipInstallArgs({</code> | 声明局部标识符 `voiceArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 341 | <code>            paths,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 342 | <code>            indexUrl: indexes[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 343 | <code>            extraIndexUrls: ['https://download.pytorch.org/whl/cu121'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 344 | <code>            packages: ['torch==2.3.1']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 345 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 347 | <code>        assert.equal(voiceArgs[voiceArgs.indexOf('--extra-index-url') + 1], 'https://download.pytorch.org/whl/cu121');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 348 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 349 | <code>        for (const [key, value] of Object.entries(savedEnv)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 350 | <code>            if (value === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 351 | <code>                delete process.env[key];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 352 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 353 | <code>                process.env[key] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 voice-runtime-bootstrap 的契约与回归行为。”这一文件职责。 |
| 354 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
