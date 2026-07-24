# tests/ailis-system-task-agent-harness.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。
- 文件类型：`source-code`
- 原始行数：437
- SHA-256：`bf9ee330cb60e4deccb5d8a7ee524d3f6f1f17c9108c545604134d1e57e623e1`
- 可运行副本：[打开源文件](../../../source/tests/ailis-system-task-agent-harness.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-task-agent-harness.cjs`、`../electron/ailis-agent-runner.cjs`、`../electron/ailis-tool-contracts.cjs`
- 主要符号：`require`、`completedResult`、`contract`、`rootDir`、`calls`、`harness`、`message`、`packet`、`context`、`first`、`second`、`unresolvedField`、`third`、`receivedInputs`、`executionGate`、`executionCount`、`specs`、`gateway`、`persona`、`taskAgent`、`personaAfterHandoff`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 9 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 10 | <code>    AILISSystemTaskAgentHarness,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 11 | <code>    TASK_RESULT_SCHEMA</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 12 | <code>} = require('../electron/ailis-task-agent-harness.cjs');</code> | 导入依赖 `../electron/ailis-task-agent-harness.cjs`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 13 | <code>const { buildAgentDirectToolSpecs } = require('../electron/ailis-agent-runner.cjs');</code> | 导入依赖 `../electron/ailis-agent-runner.cjs`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 14 | <code>const { getToolContract, validateToolContract } = require('../electron/ailis-tool-contracts.cjs');</code> | 导入依赖 `../electron/ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>function completedResult({ runId, answer, checkpoint, sourceUrl = '' }) {</code> | 定义函数 `completedResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 17 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 18 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 19 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 20 | <code>        runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 21 | <code>        displayText: answer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 22 | <code>        steps: [{ private: 'must not enter Persona context' }],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 23 | <code>        taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 24 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 25 | <code>            finalAnswer: answer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 26 | <code>            partialAnswer: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 27 | <code>            sourceRefs: sourceUrl ? [{ ref_id: 'source-1', title: 'Source', url: sourceUrl }] : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 28 | <code>            collectedData: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 29 | <code>                evidenceRefs: ['evidence-1'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 30 | <code>                outputId: 'output-1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 31 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>            traceRef: runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 33 | <code>            resume: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 34 | <code>                contextManagerCheckpoint: checkpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 35 | <code>                checkpointAvailable: Boolean(checkpoint)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 36 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>test('Persona handoff contract exposes no TaskAgent lifecycle controls', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 42 | <code>    const contract = getToolContract('handoff_task');</code> | 声明局部标识符 `contract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>    assert.deepEqual(contract.schema.properties, {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 45 | <code>    assert.equal(validateToolContract('handoff_task', {}).ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 46 | <code>    assert.equal(validateToolContract('handoff_task', { continuation: 'new' }).ok, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 47 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>test('system TaskAgent handoff preserves the exact request and returns a compact result packet', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 50 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 51 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 52 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 53 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 54 | <code>        maxAgentSteps: 7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 55 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 56 | <code>            calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 57 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 58 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 59 | <code>                answer: 'Verified answer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 60 | <code>                checkpoint: { items: [{ type: 'message', role: 'assistant', content: 'private' }] },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 61 | <code>                sourceUrl: 'https://example.test/source'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 62 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    const message = '请核对原始资料，只回答其中的类名。';</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 66 | <code>    const packet = await harness.handoff({}, {</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 67 | <code>        currentUserMessage: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 68 | <code>        sessionId: 'persona-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 69 | <code>        runId: 'persona-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 70 | <code>        desktopRealEval: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 71 | <code>        benchmarkName: 'Apple ToolSandbox',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 72 | <code>        benchmarkScenario: 'toolsandbox-scenario-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 73 | <code>        runtimeEnvironmentOverride: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 74 | <code>            source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 75 | <code>            current_date: '2026-07-17'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 76 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>        directToolLimit: 35,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 78 | <code>        llmSettings: { model: 'mock-model' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 79 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 82 | <code>    assert.equal(calls[0].agent.task, message);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 83 | <code>    assert.equal(calls[0].agent.originalTask, message);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 84 | <code>    assert.equal(calls[0].context.originalUserGoal, message);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 85 | <code>    assert.equal(calls[0].context.desktopRealEval, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 86 | <code>    assert.equal(calls[0].context.benchmarkName, 'Apple ToolSandbox');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 87 | <code>    assert.equal(calls[0].context.benchmarkScenario, 'toolsandbox-scenario-1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 88 | <code>    assert.deepEqual(calls[0].context.runtimeEnvironmentOverride, {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 89 | <code>        source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 90 | <code>        current_date: '2026-07-17'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 91 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>    assert.equal(calls[0].context.directToolLimit, 35);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 93 | <code>    assert.equal(calls[0].args.inheritanceMode, 'clean');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 94 | <code>    assert.equal(calls[0].args.maxAgentSteps, 7);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 95 | <code>    assert.equal(packet.schema, TASK_RESULT_SCHEMA);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 96 | <code>    assert.equal(packet.final_answer, 'Verified answer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 97 | <code>    assert.deepEqual(packet.evidence_refs, ['evidence-1']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 98 | <code>    assert.deepEqual(packet.output_refs, ['output-1']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 99 | <code>    assert.equal(packet.checkpoint_available, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 100 | <code>    assert.equal(Object.hasOwn(packet, 'steps'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 101 | <code>    assert.equal(Object.hasOwn(packet, 'checkpoint'), false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 102 | <code>    assert.equal(JSON.stringify(packet).includes('private'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 103 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>test('system TaskAgent result packet keeps exact answer separate from user-facing prose', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 106 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-exact-answer-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 107 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 108 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 109 | <code>        executeTaskAgent: async (payload) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 110 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 111 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 112 | <code>            runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 113 | <code>            displayText: '根据证据，最终计数是 42。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 114 | <code>            exactAnswerSubmission: { answer: '42' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 115 | <code>            taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 116 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 117 | <code>                finalAnswer: '根据证据，最终计数是 42。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 118 | <code>                sourceRefs: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 119 | <code>                collectedData: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 120 | <code>                traceRef: payload.agent.childRunId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 121 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>    const packet = await harness.handoff({}, {</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 126 | <code>        currentUserMessage: '只返回最终计数。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 127 | <code>        sessionId: 'persona-exact-answer'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 128 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>    assert.equal(packet.exact_answer, '42');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 131 | <code>    assert.equal(packet.final_answer, '根据证据，最终计数是 42。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 132 | <code>    assert.equal(packet.display_text, '根据证据，最终计数是 42。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 133 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 135 | <code>test('repeated handoff in the same parent run reuses the first TaskAgent result', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 136 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-idempotent-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 137 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 138 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 139 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 140 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 141 | <code>            calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 142 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 143 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 144 | <code>                answer: 'Single result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 145 | <code>                checkpoint: { version: 1 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 146 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    const context = {</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 150 | <code>        currentUserMessage: '同一回合只移交一次。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 151 | <code>        sessionId: 'session-idempotent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 152 | <code>        runId: 'parent-run-idempotent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 153 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>    const first = await harness.handoff({}, context);</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 156 | <code>    const second = await harness.handoff({}, context);</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 159 | <code>    assert.deepEqual(second, first);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 160 | <code>    assert.equal(harness.getStatus().parentRunHandoffCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 161 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>test('a later handoff resumes the persistent TaskAgent checkpoint without replacing the original goal', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 164 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-resume-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 165 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 166 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 167 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 168 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 169 | <code>            calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 170 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 171 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 172 | <code>                answer: calls.length === 1 ? 'First result' : 'Supplemented result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 173 | <code>                checkpoint: { version: calls.length }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 174 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>    await harness.handoff({}, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 179 | <code>        currentUserMessage: '分析这个仓库的长期任务架构。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 180 | <code>        sessionId: 'session-a'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 181 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>    const packet = await harness.handoff({}, {</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 183 | <code>        currentUserMessage: '继续补充失败恢复部分。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 184 | <code>        sessionId: 'session-a'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 185 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>    assert.equal(calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 188 | <code>    assert.equal(calls[1].args.inheritanceMode, 'checkpoint');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 189 | <code>    assert.deepEqual(calls[1].args.contextManagerCheckpoint, { version: 1 });</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 190 | <code>    assert.equal(calls[1].context.originalUserGoal, '分析这个仓库的长期任务架构。');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 191 | <code>    assert.equal(calls[1].agent.task, '继续补充失败恢复部分。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 192 | <code>    assert.equal(packet.original_goal, '分析这个仓库的长期任务架构。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 193 | <code>    assert.equal(packet.current_request, '继续补充失败恢复部分。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 194 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>test('incomplete TaskAgent results preserve unresolved fields across checkpoint resume', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 197 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-incomplete-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 198 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 199 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 200 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 201 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 202 | <code>            calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 203 | <code>            if (calls.length === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 205 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 206 | <code>                    status: 'incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 207 | <code>                    runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 208 | <code>                    displayText: 'The reminder was not created.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 209 | <code>                    taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 210 | <code>                        status: 'incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 211 | <code>                        reason: 'execution_evidence_missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 212 | <code>                        finalAnswer: 'The reminder was not created.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 213 | <code>                        unresolvedFields: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 214 | <code>                            'No successful task-execution tool call was recorded.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 215 | <code>                            'datetime_info_to_timestamp requires year and month.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 216 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>                        collectedData: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 218 | <code>                        traceRef: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 219 | <code>                        resume: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 220 | <code>                            contextManagerCheckpoint: { version: 1, marker: 'invalid-datetime-call' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 221 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 226 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 227 | <code>                answer: 'The reminder was created.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 228 | <code>                checkpoint: { version: 2 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 229 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>    const first = await harness.handoff({}, {</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 234 | <code>        currentUserMessage: 'Remind me tomorrow at 5 PM.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 235 | <code>        sessionId: 'session-incomplete'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 236 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    await harness.handoff({}, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 238 | <code>        currentUserMessage: 'Try again using the missing fields.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 239 | <code>        sessionId: 'session-incomplete'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 240 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 242 | <code>    assert.equal(first.status, 'incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 243 | <code>    assert.deepEqual(first.unresolved_fields, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 244 | <code>        'No successful task-execution tool call was recorded.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 245 | <code>        'datetime_info_to_timestamp requires year and month.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 246 | <code>        'execution_evidence_missing'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 247 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>    assert.deepEqual(calls[1].args.contextManagerCheckpoint, {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 249 | <code>        version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 250 | <code>        marker: 'invalid-datetime-call'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 251 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    assert.deepEqual(calls[1].context.priorUnresolvedFields, first.unresolved_fields);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 253 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>test('incomplete TaskAgent handoffs merge unresolved prerequisites until completion', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 256 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-monotonic-unresolved-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 257 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 258 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 259 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 260 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 261 | <code>            calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 262 | <code>            if (calls.length &lt; 3) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 263 | <code>                const unresolvedField = calls.length === 1</code> | 声明局部标识符 `unresolvedField`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 264 | <code>                    ? 'missing_current_time_observation'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 265 | <code>                    : 'latest_stateful_tool_call_rejected';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 266 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 267 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 268 | <code>                    status: 'incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 269 | <code>                    runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 270 | <code>                    displayText: 'An execution prerequisite is still missing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 271 | <code>                    taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 272 | <code>                        status: 'incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 273 | <code>                        finalAnswer: 'An execution prerequisite is still missing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 274 | <code>                        unresolvedFields: [unresolvedField],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 275 | <code>                        collectedData: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 276 | <code>                        traceRef: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 277 | <code>                        resume: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 278 | <code>                            contextManagerCheckpoint: { version: calls.length }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 279 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 285 | <code>                answer: 'Completed with verified evidence.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 286 | <code>                checkpoint: { version: 3 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 287 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>    await harness.handoff({}, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 292 | <code>        currentUserMessage: 'Find the reminder from yesterday.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 293 | <code>        sessionId: 'session-monotonic-unresolved'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 294 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>    const second = await harness.handoff({}, {</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 296 | <code>        currentUserMessage: 'Use the available tools.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 297 | <code>        sessionId: 'session-monotonic-unresolved'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 298 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    const third = await harness.handoff({}, {</code> | 声明局部标识符 `third`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 300 | <code>        currentUserMessage: 'Use this verified absolute timestamp.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 301 | <code>        sessionId: 'session-monotonic-unresolved'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 302 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>    assert.deepEqual(second.unresolved_fields, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 305 | <code>        'missing_current_time_observation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 306 | <code>        'latest_stateful_tool_call_rejected'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 307 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>    assert.deepEqual(calls[2].context.priorUnresolvedFields, second.unresolved_fields);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 309 | <code>    assert.equal(third.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 310 | <code>    assert.deepEqual(harness.getTask('session-monotonic-unresolved').unresolvedFields, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 311 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>test('the session TaskAgent remains long-lived across later requests', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 314 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-long-lived-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 315 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 316 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 317 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 318 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 319 | <code>            calls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 320 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 321 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 322 | <code>                answer: calls.length === 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 323 | <code>                    ? 'Script was written but still needs execution.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 324 | <code>                    : 'Continued from the existing Excel task.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 325 | <code>                checkpoint: { version: calls.length, marker: 'excel-map-task' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 326 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>    await harness.handoff({}, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 331 | <code>        currentUserMessage: '读取这个 Excel 地图并求第 11 步颜色。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 332 | <code>        sessionId: 'session-long-lived'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 333 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>    const packet = await harness.handoff({}, {</code> | 声明局部标识符 `packet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 335 | <code>        currentUserMessage: '你自己找',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 336 | <code>        sessionId: 'session-long-lived'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 337 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>    assert.equal(calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 340 | <code>    assert.equal(calls[1].args.inheritanceMode, 'checkpoint');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 341 | <code>    assert.deepEqual(calls[1].args.contextManagerCheckpoint, { version: 1, marker: 'excel-map-task' });</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 342 | <code>    assert.equal(calls[1].context.originalUserGoal, '读取这个 Excel 地图并求第 11 步颜色。');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 343 | <code>    assert.equal(calls[1].context.currentTaskRequest, '你自己找');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 344 | <code>    assert.equal(calls[1].agent.originalTask, '读取这个 Excel 地图并求第 11 步颜色。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 345 | <code>    assert.equal(calls[1].agent.task, '你自己找');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 346 | <code>    assert.equal(packet.original_goal, '读取这个 Excel 地图并求第 11 步颜色。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 347 | <code>    assert.equal(packet.current_request, '你自己找');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 348 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>test('concurrent follow-up input joins the running system TaskAgent instead of spawning another one', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 351 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-queue-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 352 | <code>    const receivedInputs = [];</code> | 声明局部标识符 `receivedInputs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 353 | <code>    let releaseExecution;</code> | 声明局部标识符 `releaseExecution`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 354 | <code>    const executionGate = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `executionGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 355 | <code>        releaseExecution = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 356 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>    let executionCount = 0;</code> | 声明局部标识符 `executionCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 358 | <code>    const harness = new AILISSystemTaskAgentHarness({</code> | 声明局部标识符 `harness`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 359 | <code>        rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 360 | <code>        executeTaskAgent: async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 361 | <code>            executionCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 362 | <code>            payload.registerInputHandler(async (message) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 363 | <code>                receivedInputs.push(message);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 364 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>            await executionGate;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 366 | <code>            return completedResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 367 | <code>                runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 368 | <code>                answer: 'Merged result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 369 | <code>                checkpoint: { version: 1 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 370 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>    const first = harness.handoff({}, {</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 375 | <code>        currentUserMessage: '分析这个项目。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 376 | <code>        sessionId: 'session-queue'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 377 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>    await new Promise((resolve) =&gt; setImmediate(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 379 | <code>    const second = harness.handoff({}, {</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 380 | <code>        currentUserMessage: '补充检查测试覆盖率。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 381 | <code>        sessionId: 'session-queue'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 382 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>    await new Promise((resolve) =&gt; setImmediate(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 384 | <code>    releaseExecution();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 385 | <code>    const [firstPacket, secondPacket] = await Promise.all([first, second]);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 387 | <code>    assert.equal(executionCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 388 | <code>    assert.deepEqual(receivedInputs, ['补充检查测试覆盖率。']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 389 | <code>    assert.equal(firstPacket.task_id, secondPacket.task_id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 390 | <code>    assert.equal(secondPacket.current_request, '补充检查测试覆盖率。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 391 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>test('Persona and TaskAgent receive disjoint orchestration tool surfaces', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 394 | <code>    const specs = {</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 395 | <code>        handoff_task: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 396 | <code>            name: 'handoff_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 397 | <code>            description: 'System TaskAgent handoff.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 398 | <code>            parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 399 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 400 | <code>                required: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 401 | <code>                properties: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 402 | <code>                additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 403 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>        spawn_agent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 406 | <code>            name: 'spawn_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 407 | <code>            description: 'Legacy spawn.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 408 | <code>            parameters: { type: 'object', properties: {}, additionalProperties: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 409 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>        read: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 411 | <code>            name: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 412 | <code>            description: 'Read a file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 413 | <code>            parameters: { type: 'object', properties: { path: { type: 'string' } } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 414 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 417 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 418 | <code>            definition: (id) =&gt; specs[id] ? { spec: specs[id] } : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 419 | <code>            modelVisibleSpecs: () =&gt; [specs.handoff_task, specs.spawn_agent, specs.read]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 420 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>    const persona = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `persona`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 424 | <code>        requestContext: { agentRole: 'persona_orchestrator' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 425 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>    const taskAgent = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `taskAgent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 427 | <code>        requestContext: { agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 428 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>    assert.deepEqual(persona.map((spec) =&gt; spec.name), ['handoff_task']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 431 | <code>    const personaAfterHandoff = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `personaAfterHandoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 432 | <code>        stepResults: [{ tool: 'handoff_task', response: { ok: true, status: 'completed' } }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 433 | <code>        requestContext: { agentRole: 'persona_orchestrator' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 434 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>    assert.deepEqual(personaAfterHandoff, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 436 | <code>    assert.deepEqual(taskAgent.map((spec) =&gt; spec.name), ['read']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“System TaskAgent Harness：管理唯一任务代理的生命周期、续跑、检查点与结果包。”这一文件职责。 |
| 437 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
