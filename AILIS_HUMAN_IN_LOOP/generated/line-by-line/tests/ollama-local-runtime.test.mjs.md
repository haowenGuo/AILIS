# tests/ollama-local-runtime.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ollama-local-runtime 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：423
- SHA-256：`6118513e21bc985f4596878ed6da51a4218edd6752b93b17fbfe9121b66a99e2`
- 可运行副本：[打开源文件](../../../source/tests/ollama-local-runtime.test.mjs)
- 依赖：`node:assert/strict`、`node:test`、`node:module`、`../electron/ollama-local-runtime.cjs`
- 主要符号：`require`、`command`、`plan`、`originalFetch`、`service`、`env`、`parsed`、`content`、`dir`、`descriptor`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { test } from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 6 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    buildModelfileContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    buildInstallCommand,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    buildInstallPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    buildOllamaRuntimeEnv,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    buildUpgradeCommand,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    compareNumericVersions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    compareVersions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    describeOllamaLocalModelPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    extractOllamaVersionText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    getBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    getOllamaServiceState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    inferLocalModelName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    isOllamaCudaFailureOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    isOllamaUpgradeRequiredOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    normalizeModelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    normalizeOllamaTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    parseOllamaPsOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    parseOllamaVersion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    summarizeFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 26 | <code>} = require('../electron/ollama-local-runtime.cjs');</code> | 导入依赖 `../electron/ollama-local-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>test('builds Windows Ollama installer command through winget', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    const command = buildInstallCommand({ platform: 'win32' });</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    assert.equal(command.command, 'winget');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    assert.deepEqual(command.args.slice(0, 3), ['install', '--id', 'Ollama.Ollama']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    assert.ok(command.args.includes('-e'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    assert.ok(command.args.includes('--accept-source-agreements'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    assert.ok(command.args.includes('--accept-package-agreements'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    assert.ok(command.args.includes('--force'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 36 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>test('builds Windows Ollama upgrade command through winget', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    const command = buildUpgradeCommand({ platform: 'win32' });</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    assert.equal(command.command, 'winget');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    assert.deepEqual(command.args.slice(0, 3), ['upgrade', '--id', 'Ollama.Ollama']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    assert.ok(command.args.includes('--accept-source-agreements'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 43 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>test('builds Ollama install plan for missing runtime and model', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        target: { source: 'online_pull', modelId: 'qwen2.5:7b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 48 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 49 | <code>        model: 'qwen2.5:7b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        cli: { ok: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        service: { ok: false, modelPresent: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 52 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    assert.equal(plan.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'install_ollama'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'start_service'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'pull_model'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.equal(plan.requiresNetwork, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 58 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 60 | <code>test('builds Ollama plan for running service missing selected model', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 62 | <code>        target: { source: 'online_pull', modelId: 'llama3.2' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 63 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        model: 'llama3.2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        cli: { ok: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        service: { ok: true, modelPresent: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>    assert.equal(plan.steps.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    assert.equal(plan.steps[0].id, 'pull_model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 70 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 71 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 72 | <code>test('blocks invalid local model requests instead of falling back to pull', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 73 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        model: 'local-broken-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        cli: { ok: true, version: '0.30.9' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        service: { ok: true, modelPresent: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 78 | <code>        localModel: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 79 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 80 | <code>            path: 'F:\\models\\broken',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 81 | <code>            canImportOllama: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 82 | <code>            blockers: ['没有检测到 .gguf 或 .safetensors 权重文件。']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    assert.deepEqual(plan.steps.map((step) =&gt; step.id), ['local_model_not_importable']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 88 | <code>    assert.equal(plan.requiresNetwork, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    assert.equal(plan.blockingSteps.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 90 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>test('does not pull when installed-model target is missing', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        target: { source: 'installed', modelId: 'local-qwen3-4b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 95 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 96 | <code>        model: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 97 | <code>        cli: { ok: true, version: '0.30.9' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        service: { ok: true, modelPresent: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>    assert.equal(plan.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    assert.deepEqual(plan.steps.map((step) =&gt; step.id), ['installed_model_missing']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    assert.equal(plan.requiresNetwork, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 104 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>test('builds Ollama plan with remote model store warning', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 107 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        model: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        cli: { ok: true, version: '0.30.9' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        service: { ok: true, modelPresent: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        remoteModelSizeBytes: 3 * 1024 ** 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 114 | <code>        remoteModelStore: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 115 | <code>            path: 'F:\\AILIS\\Ollama\\models',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 116 | <code>            source: 'auto_large_disk',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 117 | <code>            autoSelected: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 118 | <code>            freeBytes: 60 * 1024 ** 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 119 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        plan.steps.map((step) =&gt; step.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 123 | <code>        ['restart_ollama_service', 'pull_model', 'ollama_model_store_auto_select']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>    assert.equal(plan.requiresSystemChange, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 126 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>test('builds Ollama plan with GPU driver warning without blocking deployment', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 129 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 132 | <code>        model: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 133 | <code>        cli: { ok: true, version: '0.30.9' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 134 | <code>        service: { ok: true, modelPresent: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 135 | <code>        acceleration: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 136 | <code>            gpu: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                driverVersion: '546.92',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                minimumDriverVersion: '550.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 140 | <code>                driverTooOld: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 141 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>    assert.ok(plan.steps.some((step) =&gt; step.id === 'ollama_gpu_driver_warning'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 146 | <code>    assert.equal(plan.requiresNetwork, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 147 | <code>    assert.equal(plan.blockingSteps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 148 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>test('does not warn about remote model store after model is already present', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 151 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 154 | <code>        model: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 155 | <code>        cli: { ok: true, version: '0.30.9' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 156 | <code>        service: { ok: true, modelPresent: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 157 | <code>        remoteModelSizeBytes: 3 * 1024 ** 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 158 | <code>        remoteModelStore: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 159 | <code>            path: 'F:\\AILIS\\Ollama\\models',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 160 | <code>            source: 'auto_large_disk',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 161 | <code>            autoSelected: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 162 | <code>            freeBytes: 60 * 1024 ** 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 163 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    assert.deepEqual(plan.steps.map((step) =&gt; step.id), []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 166 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>test('reads installed model names from Ollama tags response variants', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    const originalFetch = globalThis.fetch;</code> | 声明局部标识符 `originalFetch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    globalThis.fetch = async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        json: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 173 | <code>            models: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 174 | <code>                { model: 'qwen3.5:4b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                { name: 'llama3.2:1b' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 176 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 180 | <code>        const service = await getOllamaServiceState({</code> | 声明局部标识符 `service`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 181 | <code>            baseUrl: 'http://127.0.0.1:11434',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 182 | <code>            model: 'qwen3.5:4b'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 183 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>        assert.equal(service.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 185 | <code>        assert.equal(service.modelPresent, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 186 | <code>        assert.deepEqual(service.models, ['qwen3.5:4b', 'llama3.2:1b']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 187 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 188 | <code>        globalThis.fetch = originalFetch;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 189 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>test('injects auto-selected Ollama model store into runtime env', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    const env = buildOllamaRuntimeEnv({ PATH: 'test-path' }, null, {</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        modelStore: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 196 | <code>            path: 'F:\\AILIS\\Ollama\\models',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 197 | <code>            source: 'auto_large_disk',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 198 | <code>            autoSelected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 199 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>    assert.equal(env.PATH, 'test-path');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    assert.equal(env.OLLAMA_MODELS, 'F:\\AILIS\\Ollama\\models');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 203 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>test('injects CPU fallback flags into Ollama runtime env', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 206 | <code>    const env = buildOllamaRuntimeEnv({ PATH: 'test-path' }, null, {</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 207 | <code>        forceCpu: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 208 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    assert.equal(env.PATH, 'test-path');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 210 | <code>    assert.equal(env.OLLAMA_LLM_LIBRARY, 'cpu_avx2');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 211 | <code>    assert.equal(env.CUDA_VISIBLE_DEVICES, '-1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 212 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 214 | <code>test('injects Vulkan GPU fallback without inheriting CPU CUDA visibility flags', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 215 | <code>    const env = buildOllamaRuntimeEnv({</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        PATH: 'test-path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 217 | <code>        CUDA_VISIBLE_DEVICES: '-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 218 | <code>        OLLAMA_LLM_LIBRARY: 'cpu_avx2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 219 | <code>    }, null, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 220 | <code>        forceVulkan: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 221 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>    assert.equal(env.PATH, 'test-path');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 223 | <code>    assert.equal(env.OLLAMA_LLM_LIBRARY, 'vulkan');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 224 | <code>    assert.equal('CUDA_VISIBLE_DEVICES' in env, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 225 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>test('builds Ollama plan to upgrade very old runtime before pulling remote models', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 228 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 229 | <code>        target: { source: 'online_pull', modelId: 'qwen3.5:4b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 230 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 231 | <code>        model: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 232 | <code>        cli: { ok: true, version: '0.3.6' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        service: { ok: true, modelPresent: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 234 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>    assert.deepEqual(plan.steps.map((step) =&gt; step.id), ['upgrade_ollama', 'restart_ollama_service', 'pull_model']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 237 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 239 | <code>test('normalizes legacy Ollama deployment modes into explicit target sources', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 240 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 241 | <code>        normalizeOllamaTarget({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 242 | <code>            ollamaDeploymentMode: 'local',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            modelId: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 244 | <code>            localModelPath: 'F:\\models\\Qwen3-4B'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 245 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 247 | <code>            source: 'local_import',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 248 | <code>            modelId: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 249 | <code>            localPath: 'F:\\models\\Qwen3-4B',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 250 | <code>            remoteModelId: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 251 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 254 | <code>        normalizeOllamaTarget({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 255 | <code>            ollamaDeploymentMode: 'online',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 256 | <code>            modelId: 'qwen3.5:4b'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 257 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 259 | <code>            source: 'online_pull',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 260 | <code>            modelId: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 261 | <code>            localPath: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 262 | <code>            remoteModelId: 'qwen3.5:4b'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 263 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>test('builds Ollama plan to recover CLI when service is running but model is missing', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 268 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        target: { source: 'online_pull', modelId: 'qwen2.5:1.5b' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 271 | <code>        model: 'qwen2.5:1.5b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 272 | <code>        cli: { ok: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 273 | <code>        service: { ok: true, modelPresent: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 274 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>    assert.deepEqual(plan.steps.map((step) =&gt; step.id), ['install_ollama', 'pull_model']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 277 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>test('builds Ollama plan for local safetensors import with runtime upgrade', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 280 | <code>    const plan = buildInstallPlan({</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 281 | <code>        target: { source: 'local_import', modelId: 'local-qwen3-4b', localPath: 'F:\\models\\Qwen3-4B' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        model: 'local-qwen3-4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        cli: { ok: true, version: 'ollama version is 0.3.6' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        service: { ok: true, modelPresent: false },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 286 | <code>        localModel: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 287 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 288 | <code>            canImportOllama: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 289 | <code>            sourceType: 'safetensors_dir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 290 | <code>            minimumOllamaVersion: '0.6.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 291 | <code>            warnings: ['qwen3 may need GGUF']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 292 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 296 | <code>        plan.steps.map((step) =&gt; step.id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 297 | <code>        ['upgrade_ollama', 'restart_ollama_service', 'import_local_model', 'local_model_warning']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 298 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    assert.equal(plan.requiresNetwork, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 300 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>test('summarizes common Ollama failures with actionable causes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 303 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 304 | <code>        summarizeFailure(['winget is not recognized'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 305 | <code>        'installer_missing'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 306 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 308 | <code>        summarizeFailure(['pull model manifest: not found'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        'model_not_found'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 310 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 312 | <code>        summarizeFailure(['pulling manifest', 'pulling abc123: 15%'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 313 | <code>        'process_failed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 314 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 316 | <code>        summarizeFailure(['pulling manifest', 'llama-server process has terminated: exit status 0xc0000409: CUDA error: device kernel image is invalid'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 317 | <code>        'ollama_gpu_backend_failed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 318 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 320 | <code>        summarizeFailure(['pull model manifest: 412: The model you are attempting to pull requires a newer version of Ollama.'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 321 | <code>        'ollama_upgrade_required'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 322 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 324 | <code>        summarizeFailure(['connection timed out'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 325 | <code>        'network_or_download'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 326 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 328 | <code>        summarizeFailure(['unknown architecture qwen3 safetensors'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 329 | <code>        'local_model_unsupported'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 330 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>    assert.notEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 332 | <code>        summarizeFailure(['下载 Ollama 模型：qwen3.5:4b', 'Ollama upgrade/install exited with code 2316632107'], 1).code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 333 | <code>        'local_model_unsupported'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 334 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 337 | <code>test('normalizes Ollama defaults', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 338 | <code>    assert.equal(getBaseUrl({ host: '0.0.0.0', port: 11435 }), 'http://127.0.0.1:11435');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 339 | <code>    assert.equal(normalizeModelId(''), 'qwen2.5:1.5b');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 340 | <code>    assert.equal(inferLocalModelName('F:/lab/LLM project/Qwen3-4B'), 'local-qwen3-4b');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 341 | <code>    assert.deepEqual(parseOllamaVersion('ollama version is 0.3.6'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        major: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 343 | <code>        minor: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 344 | <code>        patch: 6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 345 | <code>        raw: '0.3.6'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 346 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    assert.equal(compareVersions('0.6.1', '0.6.0'), 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 348 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>test('extracts Ollama client version from mixed server warning output', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 351 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 352 | <code>        extractOllamaVersionText('ollama version is 0.30.9\nWarning: client version is 0.3.6'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 353 | <code>        '0.3.6'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 354 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 356 | <code>        extractOllamaVersionText('Warning: could not connect to a running Ollama instance'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 357 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 358 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>test('detects Ollama upgrade-required pull failures', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 362 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 363 | <code>        isOllamaUpgradeRequiredOutput('Error: pull model manifest: 412:\\nThe model you are attempting to pull requires a newer version of Ollama.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 364 | <code>        true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 365 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>    assert.equal(isOllamaUpgradeRequiredOutput('Error: pull model manifest: not found'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 367 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>test('parses Ollama ps processor and compares NVIDIA driver versions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 370 | <code>    const parsed = parseOllamaPsOutput([</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 371 | <code>        'NAME          ID              SIZE      PROCESSOR    CONTEXT    UNTIL',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 372 | <code>        'qwen3.5:4b    2a654d98e6fb    3.2 GB    100% CPU     4096       4 minutes from now'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 373 | <code>    ].join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 375 | <code>    assert.equal(parsed.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 376 | <code>    assert.equal(parsed[0].name, 'qwen3.5:4b');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 377 | <code>    assert.equal(parsed[0].processor, '100% CPU');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 378 | <code>    assert.equal(parsed[0].context, '4096');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 379 | <code>    assert.equal(compareNumericVersions('546.92', '550.0') &lt; 0, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 380 | <code>    assert.equal(compareNumericVersions('551.61', '550.0') &gt; 0, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 381 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>test('detects Ollama CUDA inference failures', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 384 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 385 | <code>        isOllamaCudaFailureOutput('llama-server process has terminated: exit status 0xc0000409: CUDA error: device kernel image is invalid'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 386 | <code>        true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 387 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>    assert.equal(isOllamaCudaFailureOutput('pull model manifest: not found'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 389 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 391 | <code>test('builds Modelfile content for local paths with spaces', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 392 | <code>    const content = buildModelfileContent({</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 393 | <code>        localModel: { importPath: 'F:\\lab\\LLM project\\Qwen3-4B' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 394 | <code>        temperature: 0.6,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 395 | <code>        topP: 0.95</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 396 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>    assert.match(content, /^FROM "F:\\\\lab\\\\LLM project\\\\Qwen3-4B"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 398 | <code>    assert.match(content, /PARAMETER temperature 0.6/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 399 | <code>    assert.match(content, /PARAMETER top_p 0.95/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 400 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>test('describes synthetic local safetensors model directory', async (t) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 403 | <code>    const { mkdtemp, writeFile } = await import('node:fs/promises');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 404 | <code>    const { tmpdir } = await import('node:os');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 405 | <code>    const { join } = await import('node:path');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 406 | <code>    const dir = await mkdtemp(join(tmpdir(), 'ailis-ollama-test-'));</code> | 声明局部标识符 `dir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 407 | <code>    await writeFile(join(dir, 'config.json'), JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 408 | <code>        model_type: 'qwen3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 409 | <code>        architectures: ['Qwen3ForCausalLM']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 410 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>    await writeFile(join(dir, 'tokenizer.json'), '{}');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 412 | <code>    await writeFile(join(dir, 'model-00001-of-00001.safetensors'), 'weights');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 413 | <code>    const descriptor = await describeOllamaLocalModelPath(dir, {</code> | 声明局部标识符 `descriptor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 414 | <code>        env: { OLLAMA_MODELS: dir }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 415 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    assert.equal(descriptor.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 417 | <code>    assert.equal(descriptor.sourceType, 'safetensors_dir');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 418 | <code>    assert.equal(descriptor.modelType, 'qwen3');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 419 | <code>    assert.equal(descriptor.suggestedModelName.startsWith('local-'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 420 | <code>    assert.equal(descriptor.warnings.some((warning) =&gt; warning.includes('qwen3')), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 421 | <code>    assert.equal(descriptor.ollamaModelsDir, dir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 422 | <code>    assert.equal(descriptor.ollamaModelsDirSource, 'env_OLLAMA_MODELS');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ollama-local-runtime 的契约与回归行为。”这一文件职责。 |
| 423 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
