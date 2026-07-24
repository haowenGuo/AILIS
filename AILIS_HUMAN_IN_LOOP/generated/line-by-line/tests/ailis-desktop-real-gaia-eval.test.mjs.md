# tests/ailis-desktop-real-gaia-eval.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：361
- SHA-256：`62f2189d5eb03cd57c79ab726e1bfcf12cbf162775a0691667ffc1121fcde64b`
- 可运行副本：[打开源文件](../../../source/tests/ailis-desktop-real-gaia-eval.test.mjs)
- 依赖：`node:test`、`node:assert/strict`、`../scripts/run-ailis-desktop-real-gaia-eval.mjs`
- 主要符号：`payload`、`names`、`previous`、`response`、`score`、`gold`、`question`、`missingDuplicate`、`complete`、`events`、`summary`、`withoutQuestion`、`withQuestion`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 3 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4 | <code>import {</code> | 导入依赖 `{`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 5 | <code>    buildDesktopRealPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 6 | <code>    configureResearchMcpLlmEnvironment,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 7 | <code>    isIncompleteStatus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    scoreVisibleAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    summarizeEvents</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 10 | <code>} from '../scripts/run-ailis-desktop-real-gaia-eval.mjs';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>test('desktop-real GAIA payload disables persistent memory for independent tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    const payload = buildDesktopRealPayload({</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 14 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 15 | <code>            runId: 'isolated-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 16 | <code>            workspaceRoot: 'F:/workspace',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 17 | <code>            maxAgentSteps: 12,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 18 | <code>            directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 19 | <code>            debugBreakAfterRound: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 20 | <code>            agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 21 | <code>            workspaceMode: 'isolated'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 22 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>        task: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 24 | <code>            task_id: 'task-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 25 | <code>            question: 'Independent benchmark question.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 26 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 28 | <code>            provider: 'codex-model-bridge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 29 | <code>            model: 'gpt-5.5'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 30 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>    assert.equal(payload.memoryPolicy, 'disabled');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    assert.equal(payload.context.memoryPolicy, 'disabled');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 35 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>test('desktop-real eval forwards its active LLM provider to research MCP subprocesses', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    const names = [</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 39 | <code>        'AILIS_TOOL_LLM_PROVIDER',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 40 | <code>        'AILIS_TOOL_LLM_BASE_URL',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 41 | <code>        'AILIS_TOOL_LLM_MODEL',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        'AILIS_TOOL_LLM_API_KEY',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 43 | <code>        'AILIS_TOOL_LLM_REASONING_EFFORT'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>    const previous = Object.fromEntries(names.map((name) =&gt; [name, process.env[name]]));</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 47 | <code>        configureResearchMcpLlmEnvironment({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 48 | <code>            provider: 'codex-model-bridge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 49 | <code>            baseUrl: 'codex://chatgpt-oauth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 50 | <code>            model: 'gpt-5.5',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 51 | <code>            apiKey: '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 52 | <code>            reasoningEffort: 'medium'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>        assert.equal(process.env.AILIS_TOOL_LLM_PROVIDER, 'codex-model-bridge');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 55 | <code>        assert.equal(process.env.AILIS_TOOL_LLM_BASE_URL, 'codex://chatgpt-oauth');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 56 | <code>        assert.equal(process.env.AILIS_TOOL_LLM_MODEL, 'gpt-5.5');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        assert.equal(process.env.AILIS_TOOL_LLM_API_KEY, undefined);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 58 | <code>        assert.equal(process.env.AILIS_TOOL_LLM_REASONING_EFFORT, 'medium');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        for (const name of names) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 61 | <code>            if (previous[name] === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 62 | <code>                delete process.env[name];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 63 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 64 | <code>                process.env[name] = previous[name];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 65 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>test('desktop-real visible scorer accepts contextual best-item answer', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        displayText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 75 | <code>            '模拟运行完成！以下是结果汇总：',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 76 | <code>            '### 1. 弹出概率最高的球',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 77 | <code>            '&#124; 球号 &#124; 弹出概率 &#124;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 78 | <code>            '&#124; **#3** &#124; **63.08%** &#124;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 79 | <code>            '球 #3 的弹出概率最高，达到约 63.08%。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 80 | <code>        ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 81 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>    const score = scoreVisibleAnswer({ response, gold: '3' });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    assert.equal(score.status, 'visible_answer_match');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    assert.equal(score.answer, '3');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 86 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>test('desktop-real visible scorer prefers the TaskAgent exact answer over explanatory prose', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    const score = scoreVisibleAnswer({</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 91 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 92 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 93 | <code>            displayText: 'I found several plausible values, including 41 and 43.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 94 | <code>            taskResult: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 95 | <code>                exact_answer: '42',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 96 | <code>                final_answer: 'The verified count is 42.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 97 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>        gold: '42'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 100 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    assert.equal(score.source, 'task_result_exact_answer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    assert.equal(score.answer, '42');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 105 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>test('desktop-real visible scorer ignores case and ordinary title punctuation differences', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 108 | <code>    const score = scoreVisibleAnswer({</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 110 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            finalAnswer: 'Mapping human-oriented information to software agents for online systems usage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 113 | <code>            displayText: 'Mapping human-oriented information to software agents for online systems usage'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 114 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>        gold: 'Mapping Human Oriented Information to Software Agents for Online Systems Usage'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 116 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    assert.equal(score.status, 'visible_answer_match');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.equal(score.answer, 'Mapping human-oriented information to software agents for online systems usage');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 121 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>test('desktop-real visible scorer still rejects materially different titles', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    const score = scoreVisibleAnswer({</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 126 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 127 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 128 | <code>            finalAnswer: "A New Software Agent 'Learning' Algorithm"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>        gold: 'Mapping Human Oriented Information to Software Agents for Online Systems Usage'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 131 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>    assert.equal(score.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 134 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>test('desktop-real visible scorer treats Saint and St. as the same city name', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    const score = scoreVisibleAnswer({</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 138 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 139 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 140 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 141 | <code>            finalAnswer: 'St. Petersburg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 142 | <code>            displayText: 'St. Petersburg'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>        gold: 'Saint Petersburg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        question: 'Where were the specimens deposited? Just give me the city name.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 146 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 149 | <code>    assert.equal(score.status, 'visible_answer_match');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 150 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>test('desktop-real visible scorer preserves duplicate multiplicity in ordered lists', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 153 | <code>    const gold = '3/4,30/5,30/5,1/3';</code> | 声明局部标识符 `gold`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 154 | <code>    const question = 'Return every fraction in the order in which it appears.';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 155 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 156 | <code>    const missingDuplicate = scoreVisibleAnswer({</code> | 声明局部标识符 `missingDuplicate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 157 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 158 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 159 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 160 | <code>            finalAnswer: '3/4,30/5,1/3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 161 | <code>            displayText: '3/4,30/5,1/3'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        gold,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 164 | <code>        question</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 165 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>    assert.equal(missingDuplicate.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>    const complete = scoreVisibleAnswer({</code> | 声明局部标识符 `complete`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 170 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 171 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            finalAnswer: '3/4,30/5,30/5,1/3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 173 | <code>            displayText: '3/4,30/5,30/5,1/3'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 174 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>        gold,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 176 | <code>        question</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 177 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>    assert.equal(complete.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 179 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>test('desktop-real visible scorer rejects reordered parts for order-sensitive lists', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 182 | <code>    const score = scoreVisibleAnswer({</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 183 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 184 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 185 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 186 | <code>            displayText: 'Observed values: 1/3,30/5,3/4.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 187 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>        gold: '3/4,30/5,1/3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 189 | <code>        question: 'Return every fraction in the order in which it appears.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 190 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 192 | <code>    assert.equal(score.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 193 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>test('desktop-real event summary does not double count token usage mirrors', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    const events = [</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 198 | <code>            type: 'agent.llm_call.completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 199 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 200 | <code>                durationMs: 100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 201 | <code>                usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 202 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 205 | <code>            type: 'agent.token_usage',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 206 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 207 | <code>                usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 208 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 211 | <code>            type: 'agent.llm_call.completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 212 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 213 | <code>                durationMs: 200,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 214 | <code>                usage: { prompt_tokens: 20, completion_tokens: 7, total_tokens: 27 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 215 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 218 | <code>            type: 'agent.token_usage',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 219 | <code>            payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 220 | <code>                usage: { prompt_tokens: 20, completion_tokens: 7, total_tokens: 27 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 221 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>    const summary = summarizeEvents(events);</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 225 | <code>    assert.equal(summary.llmCallCount, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 226 | <code>    assert.equal(summary.usage.promptTokens, 30);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 227 | <code>    assert.equal(summary.usage.completionTokens, 12);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 228 | <code>    assert.equal(summary.usage.totalTokens, 42);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 229 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 231 | <code>test('desktop-real visible scorer ignores task-id shaped contextual noise', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 232 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        displayText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 236 | <code>            'TOOL_OUTPUT_MODEL_PREVIEW:',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 237 | <code>            'task_id: 8e867cd7-cff9-4e6c-867a-ff5ddc2550be',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 238 | <code>            'task: Find out how many studio albums were published by Mercedes Sosa.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 239 | <code>        ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 240 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>    const score = scoreVisibleAnswer({ response, gold: '3' });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 242 | <code>    assert.equal(score.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 243 | <code>    assert.equal(score.candidates.some((candidate) =&gt; candidate.answer.includes('8e867cd7')), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 244 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>test('desktop-real visible scorer accepts scaled thousand-unit equivalent only with question context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 247 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 248 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 249 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 250 | <code>        displayText: '最终结果：**17000**'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 251 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>    const withoutQuestion = scoreVisibleAnswer({ response, gold: '17' });</code> | 声明局部标识符 `withoutQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 255 | <code>    assert.equal(withoutQuestion.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 257 | <code>    const withQuestion = scoreVisibleAnswer({ response, gold: '17', question });</code> | 声明局部标识符 `withQuestion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 258 | <code>    assert.equal(withQuestion.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 259 | <code>    assert.equal(withQuestion.answer, '17000');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 260 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>test('desktop-real visible scorer extracts an English rounded scaled-unit result from a real answer shape', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 263 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 264 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 266 | <code>        finalAnswer: 'Using source values, the calculation is approximately 17053 hours. Rounded to the nearest 1000 hours: 17000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        displayText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 268 | <code>            'Using source values, the calculation is approximately 17053 hours.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 269 | <code>            'Rounded to the nearest 1000 hours: **17000**'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 271 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>    const score = scoreVisibleAnswer({ response, gold: '17', question });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 275 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 276 | <code>    assert.equal(score.source, 'visible_scaled_result');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 277 | <code>    assert.equal(score.answer, '17000');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 278 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>test('desktop-real visible scorer extracts inline final result after rendering', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 281 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 283 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        displayText: '总小时数约为 17054.89 小时，四舍五入后，最终结果：**17000**'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 285 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 287 | <code>    const score = scoreVisibleAnswer({ response, gold: '17', question });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 288 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 289 | <code>    assert.equal(score.answer, '17000');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 290 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>test('desktop-real visible scorer extracts Chinese conclusion answer line', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 294 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 296 | <code>        displayText: '四舍五入到最近千位：**17,000 小时**\n**结论：17000**'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 297 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 299 | <code>    const score = scoreVisibleAnswer({ response, gold: '17', question });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 300 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 301 | <code>    assert.equal(score.answer, '17000');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 302 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>test('desktop-real visible scorer accepts count answer with semantic unit suffix', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 305 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 308 | <code>        displayText: 'Mercedes Sosa released **3 studio albums** between 2000 and 2009. **Answer: 3 studio albums.**'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 309 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>    const question = 'How many studio albums were published by Mercedes Sosa between 2000 and 2009 (included)?';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>    const score = scoreVisibleAnswer({ response, gold: '3', question });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 313 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 314 | <code>    assert.equal(score.status, 'visible_answer_match');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 315 | <code>    assert.equal(score.answer, '3 studio albums');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 316 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>test('desktop-real visible scorer accepts one formatted currency number as a numeric gold answer', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 319 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 320 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 321 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 322 | <code>        finalAnswer: 'The food-only sales total is $89,706.00 USD.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 323 | <code>        displayText: 'The food-only sales total is **$89,706.00 USD**.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 324 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>    const score = scoreVisibleAnswer({</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 327 | <code>        response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 328 | <code>        gold: '89706.00',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 329 | <code>        question: 'What were the total sales from food, not including drinks?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 330 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 332 | <code>    assert.equal(score.status, 'visible_answer_match');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 333 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>test('desktop-real visible scorer prefers explicit total count over table years', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 336 | <code>    const response = {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 337 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 338 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 339 | <code>        displayText: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 340 | <code>            'According to the Wikipedia discography section for Mercedes Sosa, the studio albums published between 2000 and 2009 inclusive are:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 341 | <code>            '&#124; Year &#124; Album &#124; Notes &#124;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 342 | <code>            '&#124; 2005 &#124; Corazón Libre &#124; Label: Edge &#124;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 343 | <code>            '&#124; 2009 &#124; Cantora 1 &#124; Label: RCA &#124;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 344 | <code>            '&#124; 2009 &#124; Cantora 2 &#124; Label: RCA &#124;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 345 | <code>            'Total: 3 studio albums.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 346 | <code>        ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 347 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>    const question = 'How many studio albums were published by Mercedes Sosa between 2000 and 2009 (included)?';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>    const score = scoreVisibleAnswer({ response, gold: '3', question });</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 351 | <code>    assert.equal(score.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 352 | <code>    assert.equal(score.status, 'visible_answer_match');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 353 | <code>    assert.equal(score.answer, '3 studio albums');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 354 | <code>    assert.equal(score.source, 'visible_count_total');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 355 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>test('desktop-real eval classifies still-running Agent work as incomplete, not true failures', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 358 | <code>    assert.equal(isIncompleteStatus('running'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 359 | <code>    assert.equal(isIncompleteStatus('completed'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 360 | <code>    assert.equal(isIncompleteStatus('answer_candidate_mismatch'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-desktop-real-gaia-eval 的契约与回归行为。”这一文件职责。 |
| 361 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
