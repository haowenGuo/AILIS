# tests/ailis-llm-planner.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-llm-planner 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：3400
- SHA-256：`abb5034186dc31b815bf33d6566184171dd99534634d6b460f4a9448b38d1cf9`
- 可运行副本：[打开源文件](../../../source/tests/ailis-llm-planner.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:http`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`../electron/ailis-platform-adapter.cjs`、`../electron/ailis-agent-runner.cjs`、`../electron/ailis-turn-items.cjs`、`../electron/ailis-context-manager.cjs`、`../electron/desktop-llm-provider.cjs`
- 主要符号：`require`、`jsonFetch`、`response`、`body`、`runAgent`、`delay`、`decisionObjectToChatMessage`、`request`、`query`、`parseModelContextPayload`、`messages`、`parsed`、`waitFor`、`startedAt`、`turnItems`、`ollamaProfile`、`cloudProfile`、`exactAnswerProfile`、`artifactQuestionProfile`、`explicitFullProfile`、`workspaceRoot`、`originalGoal`、`items`、`index`、`manager`、`llmServer`、`gateway`、`status`、`result`、`transcript`、`compacted`、`checkpointText`、`createMockChatCompletionsServer`、`calls`、`agentDecisionCount`、`server`、`raw`、`payload`、`system`、`decisions`、`message`、`address`、`createScriptedChatCompletionsServer`、`decisionCount`、`decision`、`createDelayedChatCompletionsServer`、`closedByClient`、`cases`、`userPayload`、`runtimeEnvironment`、`toolNames`、`handoffTool`、`contextPayload`、`memoryMessage`、`rawTurns`、`taskCalls`、`agentCalls`、`gatewayToolCalls`、`originalCallTool`、`finalizationMessages`、`childRuns`、`duplicate`、`runPromise`、`becameActive`、`reachedLlm`、`interrupt`、`run`、`itemTypes`、`analysis`、`createDirectToolCallChatCompletionsServer`、`turn`、`createVisibleProtocolRepairServer`、`content`、`createProviderErrorChatCompletionsServer`、`createToolSearchDirectExposureServer`、`createNativeResponsesDecisionServer`、`secondTools`、`externalSpec`、`exposed`、`llmUserPayload`、`firstTurnToolNames`、`written`、`nativeDecisionCalls`、`llmSettings`、`baseUrl`、`first`、`classifyConfirm`、`directWithoutApproval`、`confirmed`、`text`、`firstPromptPayload`、`firstPromptTools`、`auditDir`、`approvalId`、`storePath`、`stored`、`storedApprovals`、`restarted`、`cleared`、`captured`、`hasImageInput`、`exposedToolNames`、`finalMessages`、`snapshots`、`emailCalls`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 7 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const { AILISPlatformAdapter } = require('../electron/ailis-platform-adapter.cjs');</code> | 导入依赖 `../electron/ailis-platform-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 12 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    resolveAgentDecisionTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    resolveAgentPromptProfile</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 15 | <code>} = require('../electron/ailis-agent-runner.cjs');</code> | 导入依赖 `../electron/ailis-agent-runner.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 16 | <code>const { buildObservationLedgerPromptObject } = require('../electron/ailis-turn-items.cjs');</code> | 导入依赖 `../electron/ailis-turn-items.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 17 | <code>const { ContextManager } = require('../electron/ailis-context-manager.cjs');</code> | 导入依赖 `../electron/ailis-context-manager.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 18 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    normalizeTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 20 | <code>} = require('../electron/desktop-llm-provider.cjs');</code> | 导入依赖 `../electron/desktop-llm-provider.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>test('desktop LLM provider preserves configured agent decision timeouts up to ten minutes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    assert.equal(normalizeTimeoutMs(360000), 360000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    assert.equal(normalizeTimeoutMs(15 * 60 * 1000), 10 * 60 * 1000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 25 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 29 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 30 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 31 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 32 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 33 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>async function runAgent(baseUrl, payload) {</code> | 定义函数 `runAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    return await jsonFetch(`${baseUrl}/agent/run`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 41 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>function delay(ms) {</code> | 定义函数 `delay`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    return new Promise((resolve) =&gt; setTimeout(resolve, ms));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>function decisionObjectToChatMessage(decision, callId = 'mock-tool-call') {</code> | 定义函数 `decisionObjectToChatMessage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    if (!decision &#124;&#124; typeof decision !== 'object' &#124;&#124; Array.isArray(decision)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 52 | <code>        return { content: typeof decision === 'string' ? decision : JSON.stringify(decision) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>    if (decision.action === 'tool' &amp;&amp; decision.tool_call?.tool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 55 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 56 | <code>            content: decision.public_reasoning &#124;&#124; decision.summary &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 57 | <code>            tool_calls: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 58 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 59 | <code>                    id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 60 | <code>                    type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 61 | <code>                    function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 62 | <code>                        name: decision.tool_call.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                        arguments: JSON.stringify(decision.tool_call.args &#124;&#124; {})</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 64 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>    if (decision.action === 'load_context') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 70 | <code>        const request = decision.capability_request &#124;&#124; {};</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 71 | <code>        const query = [</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 72 | <code>            ...(Array.isArray(request.skills) ? request.skills : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 73 | <code>            ...(Array.isArray(request.tools) ? request.tools : []),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 74 | <code>            ...(Array.isArray(request.mcp) ? request.mcp : []),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 75 | <code>            request.reason &#124;&#124; decision.summary &#124;&#124; decision.intent &#124;&#124; 'capability context'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        ].filter(Boolean).join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 77 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>            content: decision.public_reasoning &#124;&#124; decision.summary &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 79 | <code>            tool_calls: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 80 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 81 | <code>                    id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 82 | <code>                    type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 83 | <code>                    function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 84 | <code>                        name: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 85 | <code>                        arguments: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 86 | <code>                            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 87 | <code>                            limit: 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 88 | <code>                        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    if (decision.action === 'blocked') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 95 | <code>        return { content: decision.blocked_reason &#124;&#124; decision.final_answer &#124;&#124; decision.summary &#124;&#124; '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 96 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    if (decision.action === 'final') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 98 | <code>        return { content: decision.final_answer &#124;&#124; decision.answer &#124;&#124; decision.response &#124;&#124; decision.summary &#124;&#124; '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>    return { content: JSON.stringify(decision) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 101 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>function parseModelContextPayload(call) {</code> | 定义函数 `parseModelContextPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 104 | <code>    const messages = call?.payload?.messages &#124;&#124; [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 105 | <code>    for (const message of messages.filter((entry) =&gt; entry.role === 'user')) {</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 107 | <code>            const parsed = JSON.parse(message.content);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 108 | <code>            if (parsed?.type === 'context') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 109 | <code>                return parsed;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 110 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 112 | <code>            // Ignore non-JSON user goal messages.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>    return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 116 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>async function waitFor(predicate, { timeoutMs = 2000, intervalMs = 25 } = {}) {</code> | 定义函数 `waitFor`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    while (Date.now() - startedAt &lt; timeoutMs) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 121 | <code>        if (await predicate()) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 122 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 123 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>        await delay(intervalMs);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 125 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>test('Agent turn items mark successful web fetches with structured API evidence gaps', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 130 | <code>    const turnItems = buildObservationLedgerPromptObject({</code> | 声明局部标识符 `turnItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        stepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 132 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 133 | <code>                id: 'clinical-web-fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 134 | <code>                title: 'Fetch ClinicalTrials page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 135 | <code>                tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 136 | <code>                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                    url: 'https://clinicaltrials.gov/study/NCT03411733',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 138 | <code>                    extract_content: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 141 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 142 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 143 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 144 | <code>                        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 145 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 146 | <code>                                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 147 | <code>                                text: 'ClinicalTrials.gov Study NCT03411733 Prevalence of H.Pylori in Patients With Acne Vulgaris'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 148 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>    assert.equal(turnItems.latest_observation.evidence_gap, 'structured_api_preferred');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 156 | <code>    assert.match(turnItems.latest_observation.preview, /ClinicalTrials\.gov&#124;structured ClinicalTrials/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 157 | <code>    assert.match(JSON.stringify(turnItems.items), /structured_api_preferred&#124;ClinicalTrials\.gov/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 158 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>test('Agent prompt profile uses compact budgets for Ollama without changing cloud providers', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 161 | <code>    const ollamaProfile = resolveAgentPromptProfile({ provider: 'ollama' });</code> | 声明局部标识符 `ollamaProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 162 | <code>    assert.equal(ollamaProfile.id, 'local_compact');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 163 | <code>    assert.equal(ollamaProfile.compact, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 164 | <code>    assert.ok(ollamaProfile.memoryChars &lt; 5000);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 165 | <code>    assert.ok(ollamaProfile.externalToolExposureLimit &lt; 16);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>    const cloudProfile = resolveAgentPromptProfile({ provider: 'openai-compatible' });</code> | 声明局部标识符 `cloudProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 168 | <code>    assert.equal(cloudProfile.id, 'full');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    assert.equal(cloudProfile.compact, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    assert.ok(cloudProfile.memoryChars &gt;= 20000);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>    const exactAnswerProfile = resolveAgentPromptProfile(</code> | 声明局部标识符 `exactAnswerProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        { provider: 'openai-compatible' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 174 | <code>        { exactAnswerMode: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 175 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    assert.equal(exactAnswerProfile.id, 'local_compact');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 177 | <code>    assert.equal(exactAnswerProfile.compact, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 178 | <code>    assert.equal(exactAnswerProfile.reason, 'exact_answer_task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    const artifactQuestionProfile = resolveAgentPromptProfile(</code> | 声明局部标识符 `artifactQuestionProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        { provider: 'openai-compatible' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 182 | <code>        { taskCompactPrompt: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 183 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    assert.equal(artifactQuestionProfile.id, 'local_compact');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    assert.equal(artifactQuestionProfile.compact, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    assert.equal(artifactQuestionProfile.reason, 'artifact_answer_task');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>    const explicitFullProfile = resolveAgentPromptProfile(</code> | 声明局部标识符 `explicitFullProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 189 | <code>        { provider: 'openai-compatible' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 190 | <code>        { taskCompactPrompt: true, exactAnswerMode: true, agentPromptProfile: 'full' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 191 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>    assert.equal(explicitFullProfile.id, 'full');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 193 | <code>    assert.equal(explicitFullProfile.compact, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 194 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>test('TaskAgent main loop semantically compacts over-budget history and preserves durable task state', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 197 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-main-loop-semantic-compact-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 198 | <code>    const originalGoal = 'Verify the release date and answer with the official source.';</code> | 声明局部标识符 `originalGoal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    const items = [</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 200 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 201 | <code>            type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 202 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 203 | <code>            content: [{ type: 'input_text', text: JSON.stringify({ type: 'context', attached_files: [{ path: 'release.pdf' }] }) }]</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 206 | <code>            type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 207 | <code>            role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 208 | <code>            content: [{ type: 'input_text', text: originalGoal }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>    for (let index = 0; index &lt; 16; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 212 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 213 | <code>            type: 'function_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 214 | <code>            call_id: `main-loop-call-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 215 | <code>            name: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 216 | <code>            arguments: JSON.stringify({ url: `https://example.test/releases/${index}` })</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 217 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>        items.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 219 | <code>            type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 220 | <code>            call_id: `main-loop-call-${index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 221 | <code>            output: `Status: completed\noutputId=checkpoint-output-${index}\n${'release evidence '.repeat(420)}`</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 222 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>    const manager = new ContextManager({ items, toolOutputChars: 50000 });</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 225 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 226 | <code>        action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 227 | <code>        final_answer: 'The preserved evidence supports the release-date answer.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 228 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 230 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 231 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 232 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 234 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 237 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 239 | <code>            sessionId: 'main-loop-semantic-compact-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 240 | <code>            message: originalGoal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 241 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 242 | <code>            initialContextManagerCheckpoint: manager.toCheckpoint(),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 243 | <code>            initialPlan: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 244 | <code>                intent: 'release_verification',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 245 | <code>                steps: [{ step: 'Verify the official publication date', status: 'in_progress' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 246 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>            initialStepResults: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 248 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 249 | <code>                    id: 'official-release-evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 250 | <code>                    tool: 'web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 251 | <code>                    title: 'Official release page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 252 | <code>                    evidenceArtifacts: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 253 | <code>                        id: 'official-release-artifact',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 254 | <code>                        type: 'WebEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 255 | <code>                        summary: 'Official release date evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 256 | <code>                    }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>                    response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 258 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 259 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 260 | <code>                        result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 261 | <code>                            content: [{ type: 'text', text: 'Official release date evidence.' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 262 | <code>                            details: { outputId: 'official-release-output' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 263 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 267 | <code>                    id: 'missing-publication-field',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 268 | <code>                    tool: 'web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 269 | <code>                    title: 'Publication metadata gap',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 270 | <code>                    response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 271 | <code>                        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 272 | <code>                        status: 'incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 273 | <code>                        error: 'official publication date remains unresolved',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 274 | <code>                        result: { details: { missing_fields: ['official publication date'] } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 275 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 279 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 280 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 281 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 282 | <code>                model: 'mock-semantic-compact',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 283 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 284 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 286 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 287 | <code>                agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 288 | <code>                contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 289 | <code>                taskAgentInheritanceMode: 'checkpoint',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 290 | <code>                contextWindowTokens: 9000,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 291 | <code>                reservedOutputTokens: 1000,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 292 | <code>                taskConstraints: ['Use the official source.']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 293 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 297 | <code>        const transcript = await gateway.runtime.readTranscript(result.body.runId, 200);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 298 | <code>        const compacted = transcript.items.find((item) =&gt; item.type === 'agent.context_compaction');</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 299 | <code>        assert.ok(compacted, JSON.stringify(transcript.items.map((item) =&gt; item.type)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 300 | <code>        assert.equal(compacted.payload.historyVersion, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 301 | <code>        const checkpointText = JSON.stringify(compacted.payload.checkpoint);</code> | 声明局部标识符 `checkpointText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 302 | <code>        assert.match(checkpointText, /Verify the release date and answer with the official source/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 303 | <code>        assert.match(checkpointText, /Use the official source/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 304 | <code>        assert.match(checkpointText, /Verify the official publication date/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 305 | <code>        assert.match(checkpointText, /official publication date remains unresolved/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        assert.match(checkpointText, /Official release date evidence/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 307 | <code>        assert.match(checkpointText, /checkpoint-output-15/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 308 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 309 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 310 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 311 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 312 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>async function createMockChatCompletionsServer() {</code> | 定义函数 `createMockChatCompletionsServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 316 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 317 | <code>    let agentDecisionCount = 0;</code> | 声明局部标识符 `agentDecisionCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 318 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 319 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 320 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 321 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 322 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 324 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 325 | <code>            const messages = payload.messages &#124;&#124; [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 326 | <code>            const system = messages.find((message) =&gt; message.role === 'system')?.content &#124;&#124; '';</code> | 声明局部标识符 `system`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 327 | <code>            calls.push({ url: req.url, system, payload });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 329 | <code>            agentDecisionCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 330 | <code>            const decisions = [</code> | 声明局部标识符 `decisions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 331 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 332 | <code>                      mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 333 | <code>                      intent: 'create_workspace_note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 334 | <code>                      summary: '创建目录并写入说明文件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 335 | <code>                      action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 336 | <code>                      plan_update: ['先创建目标目录'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 337 | <code>                      tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 338 | <code>                          tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 339 | <code>                          title: '创建目标目录',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 340 | <code>                          args: { command: 'New-Item -ItemType Directory -Path planner-output -Force' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 341 | <code>                      }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 344 | <code>                    mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 345 | <code>                    intent: 'create_workspace_note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 346 | <code>                    summary: '创建目录并写入说明文件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 347 | <code>                    action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 348 | <code>                    plan_update: ['目录已创建，写入说明文件'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 349 | <code>                    tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 350 | <code>                        tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 351 | <code>                        title: '写入说明文件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 352 | <code>                        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 353 | <code>                            path: 'planner-output/README.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 354 | <code>                            content: 'Agentic Executor OK\n'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 355 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 359 | <code>                    mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 360 | <code>                    intent: 'create_workspace_note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 361 | <code>                    summary: '创建目录并写入说明文件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 362 | <code>                    action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 363 | <code>                    final_answer: '**Agentic Executor 已完成**\n\n- 目录和 README.txt 已创建'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 364 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>            const message = decisionObjectToChatMessage(</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 367 | <code>                decisions[Math.min(agentDecisionCount, decisions.length) - 1],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 368 | <code>                `mock-agent-tool-${agentDecisionCount}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 369 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>            res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 372 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 373 | <code>                choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 374 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 375 | <code>                        message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 376 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>                usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 379 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 381 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 383 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 384 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 385 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 386 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 387 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 388 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 389 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 392 | <code>async function createScriptedChatCompletionsServer(decisionFactory) {</code> | 定义函数 `createScriptedChatCompletionsServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 393 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 394 | <code>    let decisionCount = 0;</code> | 声明局部标识符 `decisionCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 395 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 396 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 397 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 398 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 399 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 401 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 402 | <code>            const messages = payload.messages &#124;&#124; [];</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 403 | <code>            const system = messages.find((message) =&gt; message.role === 'system')?.content &#124;&#124; '';</code> | 声明局部标识符 `system`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 404 | <code>            decisionCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 405 | <code>            calls.push({ url: req.url, system, payload, decisionCount });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 406 | <code>            const decision = decisionFactory({ decisionCount, payload, messages, system });</code> | 声明局部标识符 `decision`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 407 | <code>            const message = decisionObjectToChatMessage(decision, `scripted-tool-${decisionCount}`);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 408 | <code>            res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 409 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 410 | <code>                choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 411 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 412 | <code>                        message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 413 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>                usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 416 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 420 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 421 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 422 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 423 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 424 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 425 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 426 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 429 | <code>async function createDelayedChatCompletionsServer(delayMs = 5000) {</code> | 定义函数 `createDelayedChatCompletionsServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 430 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 431 | <code>    let closedByClient = 0;</code> | 声明局部标识符 `closedByClient`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 432 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 433 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 434 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 435 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 436 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 437 | <code>        req.on('close', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 438 | <code>            if (!res.writableEnded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 439 | <code>                closedByClient += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 440 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 441 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 443 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 444 | <code>            calls.push({ url: req.url, payload });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 445 | <code>            setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 446 | <code>                if (res.destroyed &#124;&#124; res.writableEnded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 447 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 448 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>                res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 450 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 451 | <code>                    choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 452 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 453 | <code>                            message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 454 | <code>                                content: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 455 | <code>                                    mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 456 | <code>                                    intent: 'slow_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 457 | <code>                                    summary: 'This response should be interrupted.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 458 | <code>                                    action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 459 | <code>                                    final_answer: 'late answer'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 460 | <code>                                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>                    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 465 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>            }, delayMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 467 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 470 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 471 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 472 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 473 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 474 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 475 | <code>        get closedByClient() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 476 | <code>            return closedByClient;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 477 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 479 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>test('Agent prompts inject runtime_environment from the active platform adapter', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 483 | <code>    const cases = [</code> | 声明局部标识符 `cases`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 484 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 485 | <code>            platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 486 | <code>            env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 487 | <code>            expectedFamily: 'windows',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 488 | <code>            expectedPathStyle: 'windows',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 489 | <code>            expectedShellDialect: 'powershell'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 490 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 492 | <code>            platform: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 493 | <code>            env: { SHELL: '/bin/bash' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 494 | <code>            expectedFamily: 'linux',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 495 | <code>            expectedPathStyle: 'posix',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 496 | <code>            expectedShellDialect: 'posix-shell'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 497 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 500 | <code>    for (const item of cases) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 501 | <code>        const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), `ailis-runtime-env-${item.expectedFamily}-`));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 502 | <code>        const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 503 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 504 | <code>            intent: 'runtime_environment_probe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 505 | <code>            summary: 'probe runtime environment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 506 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 507 | <code>            final_answer: 'runtime environment observed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 508 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 509 | <code>        const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 510 | <code>            port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 511 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 512 | <code>            projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 513 | <code>            auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 514 | <code>            platformAdapter: new AILISPlatformAdapter({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 515 | <code>                platform: item.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 516 | <code>                hostPlatform: item.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 517 | <code>                env: item.env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 518 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 522 | <code>            const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 523 | <code>            const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 524 | <code>                sessionId: `runtime-env-${item.expectedFamily}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 525 | <code>                message: '只确认当前运行环境，不要执行命令',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 526 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 527 | <code>                directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 528 | <code>                llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 529 | <code>                    provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 530 | <code>                    baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 531 | <code>                    apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 532 | <code>                    model: `mock-${item.expectedFamily}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 533 | <code>                    temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 534 | <code>                    timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 535 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 536 | <code>                context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 537 | <code>                    workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 538 | <code>                    directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 539 | <code>                    nativeDirectTools: false</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 540 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 542 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 543 | <code>            assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 544 | <code>            const userPayload = parseModelContextPayload(llmServer.calls[0]);</code> | 声明局部标识符 `userPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 545 | <code>            assert.equal(userPayload.runtime_environment.family, item.expectedFamily);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 546 | <code>            assert.equal(userPayload.runtime_environment.path_style, item.expectedPathStyle);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 547 | <code>            assert.equal(userPayload.runtime_environment.shell_dialect, item.expectedShellDialect);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 548 | <code>            assert.match(userPayload.runtime_environment.current_date, /^\d{4}-\d{2}-\d{2}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 549 | <code>            assert.match(userPayload.runtime_environment.current_time, /^\d{2}:\d{2}:\d{2}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 550 | <code>            assert.ok(userPayload.runtime_environment.timezone);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 551 | <code>            assert.match(userPayload.runtime_environment.utc_offset, /^[+-]\d{2}:\d{2}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 552 | <code>            assert.match(userPayload.runtime_environment.command_guidance, /Do not assume&#124;not Linux by default&#124;POSIX/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 553 | <code>            assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /runtime_environment/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 554 | <code>            assert.match(llmServer.calls[0].system, /Runtime environment/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 555 | <code>            assert.doesNotMatch(llmServer.calls[0].system, /当前桌面端优先 Windows&#124;Windows 桌面端命令必须/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 556 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 557 | <code>            await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 558 | <code>            await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 559 | <code>            await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 560 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 562 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 564 | <code>test('Desktop real eval can pin only the runtime clock while preserving platform metadata', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 565 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-clock-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 566 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 567 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 568 | <code>        intent: 'runtime_clock_probe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 569 | <code>        summary: 'probe runtime clock',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 570 | <code>        action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 571 | <code>        final_answer: 'runtime clock observed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 572 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 574 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 575 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 576 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 577 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 578 | <code>        platformAdapter: new AILISPlatformAdapter({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 579 | <code>            platform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 580 | <code>            hostPlatform: 'win32',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 581 | <code>            env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 582 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 583 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 584 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 585 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 586 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 587 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 588 | <code>            sessionId: 'runtime-clock-override',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 589 | <code>            message: 'Confirm the benchmark clock.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 590 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 591 | <code>            directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 592 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 593 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 594 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 595 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 596 | <code>                model: 'mock-runtime-clock',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 597 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 598 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 599 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 601 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 602 | <code>                directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 603 | <code>                nativeDirectTools: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 604 | <code>                desktopRealEval: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 605 | <code>                runtimeEnvironmentOverride: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 606 | <code>                    source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 607 | <code>                    current_date: '2026-07-17',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 608 | <code>                    current_time: '06:06:27',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 609 | <code>                    current_datetime: '2026-07-17T06:06:27+08:00',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 610 | <code>                    utc_offset: '+08:00'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 611 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 614 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 615 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 616 | <code>        const runtimeEnvironment = parseModelContextPayload(</code> | 声明局部标识符 `runtimeEnvironment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 617 | <code>            llmServer.calls[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 618 | <code>        ).runtime_environment;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 619 | <code>        assert.equal(runtimeEnvironment.source, 'toolsandbox_benchmark_clock');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 620 | <code>        assert.equal(runtimeEnvironment.current_date, '2026-07-17');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 621 | <code>        assert.equal(runtimeEnvironment.current_time, '06:06:27');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 622 | <code>        assert.equal(runtimeEnvironment.current_datetime, '2026-07-17T06:06:27+08:00');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 623 | <code>        assert.equal(runtimeEnvironment.utc_offset, '+08:00');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 624 | <code>        assert.equal(runtimeEnvironment.family, 'windows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 625 | <code>        assert.equal(runtimeEnvironment.path_style, 'windows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 626 | <code>        assert.equal(runtimeEnvironment.shell_dialect, 'powershell');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 627 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 628 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 629 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 630 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 631 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 633 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 634 | <code>test('Persona prompt stays in AILIS persona and exposes only system TaskAgent handoff', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 635 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-orchestrator-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 636 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 637 | <code>        action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 638 | <code>        final_answer: '你好呀～我在这里。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 639 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 640 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 641 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 642 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 643 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 644 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 645 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 647 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 648 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 649 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 650 | <code>            sessionId: 'persona-orchestrator-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 651 | <code>            message: '你好呀',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 652 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 653 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 654 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 655 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 656 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 657 | <code>                model: 'mock-persona-orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 658 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 659 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 660 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 661 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 662 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 663 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 664 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 665 | <code>                agentRole: 'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 666 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 667 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 669 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 670 | <code>        assert.equal(result.body.intent, 'direct_conversation_final');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 671 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 672 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /AILIS TaskAgent&#124;coding agent running in AILIS/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 673 | <code>        assert.match(llmServer.calls[0].system, /可爱的虚拟助手，名字固定为AILIS/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 674 | <code>        assert.match(llmServer.calls[0].system, /关系表达协议/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 675 | <code>        assert.match(llmServer.calls[0].system, /authoritative host clock/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 676 | <code>        assert.match(llmServer.calls[0].system, /call handoff_task exactly once/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 677 | <code>        assert.match(llmServer.calls[0].system, /Harness transfers the immutable current user request/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 678 | <code>        assert.match(llmServer.calls[0].system, /TaskResult packet is the factual boundary/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 679 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /continuation=/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 680 | <code>        const toolNames = (llmServer.calls[0].payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name);</code> | 声明局部标识符 `toolNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 681 | <code>        assert.deepEqual(toolNames, ['handoff_task']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 682 | <code>        const handoffTool = llmServer.calls[0].payload.tools[0]?.function &#124;&#124; llmServer.calls[0].payload.tools[0];</code> | 声明局部标识符 `handoffTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 683 | <code>        assert.deepEqual(handoffTool?.parameters?.properties, {});</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 684 | <code>        const contextPayload = parseModelContextPayload(llmServer.calls[0]);</code> | 声明局部标识符 `contextPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 685 | <code>        const memoryMessage = llmServer.calls[0].payload.messages.find((message) =&gt;</code> | 声明局部标识符 `memoryMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 686 | <code>            (message.role === 'developer' &#124;&#124; message.role === 'system') &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 687 | <code>            /&lt;memory_context&gt;/.test(String(message.content &#124;&#124; ''))</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 688 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 689 | <code>        assert.match(memoryMessage?.content &#124;&#124; '', /&lt;memory_context&gt;/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 690 | <code>        assert.match(memoryMessage?.content &#124;&#124; '', /## Persona/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 691 | <code>        assert.equal(contextPayload.memory_context, undefined);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 692 | <code>        assert.equal(contextPayload.capability_catalog, undefined);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 693 | <code>        assert.equal(contextPayload.external_tool_exposure, undefined);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 694 | <code>        const rawTurns = gateway.rawMemoryLedger.replay({</code> | 声明局部标识符 `rawTurns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 695 | <code>            type: 'chat.llm_turn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 696 | <code>            sessionId: 'persona-orchestrator-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 697 | <code>            includePayload: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 698 | <code>            limit: 20</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 699 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>        assert.ok(rawTurns.entries.some((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 701 | <code>            entry.payload?.requestPayload?.memoryUserMessage === '你好呀'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 702 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 703 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 704 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 705 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 706 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 707 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 709 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 710 | <code>test('Persona hands one exact request to the system TaskAgent and renders its compact result', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 711 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-system-task-handoff-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 712 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 713 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 714 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 715 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 716 | <code>                summary: '开始处理。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 717 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 718 | <code>                    tool: 'handoff_task',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 719 | <code>                    args: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 720 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 723 | <code>        throw new Error('Persona should not receive the TaskAgent result as a second model turn');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 724 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 726 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 727 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 728 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 729 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 730 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 731 | <code>    const taskCalls = [];</code> | 声明局部标识符 `taskCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 732 | <code>    gateway.taskAgentHarness.executeTaskAgent = async (payload) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 733 | <code>        taskCalls.push(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 734 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 735 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 736 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 737 | <code>            runId: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 738 | <code>            displayText: 'BaseLabelPropagation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 739 | <code>            steps: [{ private: 'not model visible' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 740 | <code>            taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 741 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 742 | <code>                finalAnswer: 'BaseLabelPropagation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 743 | <code>                partialAnswer: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 744 | <code>                sourceRefs: [{ ref_id: 'source-1', title: 'Changelog', url: 'https://example.test/changelog' }],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 745 | <code>                collectedData: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 746 | <code>                traceRef: payload.agent.childRunId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 747 | <code>                resume: { contextManagerCheckpoint: { private: true }, checkpointAvailable: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 748 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 749 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 750 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 751 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 752 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 753 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 754 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 755 | <code>            sessionId: 'system-task-handoff-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 756 | <code>            message: '核对官方资料并只给出类名。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 757 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 758 | <code>            maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 759 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 760 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 761 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 762 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 763 | <code>                model: 'mock-system-task-handoff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 764 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 765 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 766 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 768 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 769 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 770 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 771 | <code>                nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 772 | <code>                directToolLimit: 35,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 773 | <code>                maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 774 | <code>                agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 775 | <code>                requireTaskExecution: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 776 | <code>                requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 777 | <code>                desktopRealEval: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 778 | <code>                benchmarkName: 'Apple ToolSandbox',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 779 | <code>                benchmarkScenario: 'toolsandbox-scenario-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 780 | <code>                runtimeEnvironmentOverride: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 781 | <code>                    source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 782 | <code>                    current_date: '2026-07-17',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 783 | <code>                    current_time: '06:06:27',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 784 | <code>                    current_datetime: '2026-07-17T06:06:27+08:00',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 785 | <code>                    utc_offset: '+08:00'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 786 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 788 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 791 | <code>        assert.equal(result.body.displayText, 'BaseLabelPropagation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 792 | <code>        assert.equal(result.body.finalAnswer, 'BaseLabelPropagation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 793 | <code>        assert.equal(result.body.intent, 'persona_task_handoff_result');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 794 | <code>        assert.equal(result.body.taskResult?.schema, 'ailis.task_result.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 795 | <code>        assert.equal(taskCalls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 796 | <code>        assert.equal(taskCalls[0].agent.task, '核对官方资料并只给出类名。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 797 | <code>        assert.equal(taskCalls[0].context.originalUserGoal, '核对官方资料并只给出类名。');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 798 | <code>        assert.equal(taskCalls[0].context.desktopRealEval, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 799 | <code>        assert.equal(taskCalls[0].context.benchmarkName, 'Apple ToolSandbox');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 800 | <code>        assert.equal(taskCalls[0].context.benchmarkScenario, 'toolsandbox-scenario-1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 801 | <code>        assert.equal(taskCalls[0].context.directToolLimit, 35);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 802 | <code>        assert.equal(taskCalls[0].context.requireExecutionEvidence, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 803 | <code>        assert.deepEqual(taskCalls[0].context.runtimeEnvironmentOverride, {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 804 | <code>            source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 805 | <code>            current_date: '2026-07-17',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 806 | <code>            current_time: '06:06:27',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 807 | <code>            current_datetime: '2026-07-17T06:06:27+08:00',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 808 | <code>            utc_offset: '+08:00'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 809 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 811 | <code>        assert.notEqual(llmServer.calls[0].payload.tool_choice, 'auto');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 812 | <code>        assert.match(JSON.stringify(llmServer.calls[0].payload.tool_choice), /handoff_task/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 813 | <code>        assert.match(llmServer.calls[0].system, /explicit task-execution contract/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 814 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 815 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 816 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 817 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 818 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 819 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>test.skip('legacy Persona mailbox transport is replaced by system handoff', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 822 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-handoff-once-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 823 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 824 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 825 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 826 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 827 | <code>                summary: '交给干净的 TaskAgent 执行。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 828 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 829 | <code>                    tool: 'spawn_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 830 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 831 | <code>                        task_name: 'sandrone_guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 832 | <code>                        message: '核验截至当前日期《原神》“木偶”桑多涅是否已经实装；使用新鲜网页证据，若已实装则完成角色攻略。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 833 | <code>                        fork_turns: 'all'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 834 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 835 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 839 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 840 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 841 | <code>                summary: '等待 TaskAgent 完成。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 842 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 843 | <code>                    tool: 'wait_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 844 | <code>                    args: { timeout_ms: 1000 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 845 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 846 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 847 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 848 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 849 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 850 | <code>            final_answer: 'AILIS final answer: 42'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 851 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 852 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 854 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 855 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 856 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 857 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 858 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 859 | <code>    const agentCalls = [];</code> | 声明局部标识符 `agentCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 860 | <code>    const gatewayToolCalls = [];</code> | 声明局部标识符 `gatewayToolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 861 | <code>    const originalCallTool = gateway.callTool.bind(gateway);</code> | 声明局部标识符 `originalCallTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 862 | <code>    gateway.callTool = async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 863 | <code>        if (['spawn_agent', 'wait_agent'].includes(request?.tool)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 864 | <code>            gatewayToolCalls.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 865 | <code>                tool: request.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 866 | <code>                timeoutMs: request.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 867 | <code>                contextTimeoutMs: request.context?.timeoutMs,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 868 | <code>                waitTimeoutMs: request.args?.timeout_ms</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 869 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 870 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 871 | <code>        return originalCallTool(request);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 872 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 873 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 874 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 875 | <code>        gateway.runtime.agent_control.execute_agent = async ({ agent, args, context }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 876 | <code>            agentCalls.push({ agent, args, context });</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 877 | <code>            await new Promise((resolve) =&gt; setTimeout(resolve, 50));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 878 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 879 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 880 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 881 | <code>                displayText: 'TaskAgent 已核验当前资料并完成木偶攻略。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 882 | <code>                finalAnswer: '已核验并完成攻略'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 883 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 884 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 885 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 886 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 887 | <code>            sessionId: 'persona-handoff-once-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 888 | <code>            message: '已经实装了',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 889 | <code>            messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 890 | <code>                { role: 'user', content: '做一套木偶的攻略' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 891 | <code>                { role: 'assistant', content: '你说的是哪个作品里的木偶呀？' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 892 | <code>                { role: 'user', content: '原神的' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 893 | <code>                { role: 'assistant', content: '我记忆里她还没有实装。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 894 | <code>                { role: 'user', content: '已经实装了' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 895 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 896 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 897 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 898 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 899 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 900 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 901 | <code>                model: 'mock-persona-handoff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 902 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 903 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 904 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 906 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 907 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 908 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 909 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 910 | <code>                agentRole: 'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 911 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 912 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 913 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 914 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 915 | <code>        assert.equal(result.body.planner, 'llm-agentic-executor');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 916 | <code>        assert.equal(result.body.displayText, '已核验并完成攻略');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 917 | <code>        assert.equal(result.body.finalAnswer, '已核验并完成攻略');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 918 | <code>        assert.equal(llmServer.calls.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 919 | <code>        assert.equal(agentCalls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 920 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 921 | <code>            agentCalls[0].args.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 922 | <code>            '核验截至当前日期《原神》“木偶”桑多涅是否已经实装；使用新鲜网页证据，若已实装则完成角色攻略。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 923 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 924 | <code>        assert.equal(agentCalls[0].context.maxAgentSteps, 4);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 925 | <code>        assert.equal(agentCalls[0].context.cleanContext, false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 926 | <code>        assert.equal(agentCalls[0].context.taskAgentInheritanceMode, 'checkpoint');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 927 | <code>        assert.ok(agentCalls[0].context.initialContextManagerCheckpoint);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 928 | <code>        assert.equal(agentCalls[0].context.contextMode, 'task_agent');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 929 | <code>        assert.deepEqual(gatewayToolCalls.map((call) =&gt; call.tool), ['spawn_agent', 'wait_agent']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 930 | <code>        assert.equal(gatewayToolCalls[1].waitTimeoutMs, 1000);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 931 | <code>        assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /原神的/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 932 | <code>        assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /已经实装了/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 933 | <code>        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /root\/sandrone_guide/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 934 | <code>        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /subagent_notification/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 935 | <code>        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /TaskAgent 已核验当前资料并完成木偶攻略/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 936 | <code>        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /may_add_facts/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 937 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 938 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 939 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 940 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 941 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 942 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 944 | <code>test.skip('legacy Persona round-budget mailbox finalization is replaced by system handoff', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 945 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-budget-finalization-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 946 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 947 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 948 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 949 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 950 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 951 | <code>                    tool: 'spawn_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 952 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 953 | <code>                        task_name: 'gaia_exact_answer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 954 | <code>                        message: 'Research the question and return the supported exact answer.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 955 | <code>                        fork_turns: 'all'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 956 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 957 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 958 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 959 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 961 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 962 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 963 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 964 | <code>                    tool: 'wait_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 965 | <code>                    args: { timeout_ms: 1 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 966 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 969 | <code>        if (decisionCount === 3) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 970 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 971 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 972 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 973 | <code>                    tool: 'list_agents',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 974 | <code>                    args: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 975 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 977 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 978 | <code>        if (decisionCount === 4) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 979 | <code>            return '{"tool_calls":[{"name":"task_results","arguments":{}}]}';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 980 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 981 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 982 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 983 | <code>            final_answer: 'The exact answer is 17.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 984 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 985 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 987 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 988 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 989 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 990 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 991 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 993 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 994 | <code>        gateway.runtime.agent_control.execute_agent = async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 995 | <code>            await delay(50);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 996 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 997 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 998 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 999 | <code>                displayText: 'Verified calculation and sources. Final answer: 17.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1000 | <code>                finalAnswer: '17'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1001 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1002 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1003 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1004 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1005 | <code>            sessionId: 'persona-budget-finalization-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1006 | <code>            message: 'Calculate the requested value and give the exact answer.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1007 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1008 | <code>            maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1009 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1010 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1011 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1012 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1013 | <code>                model: 'mock-persona-budget-finalization',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1014 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1015 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1016 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1017 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1018 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1019 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1020 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1021 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1022 | <code>                agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1023 | <code>                agentWaitTimeoutMs: 1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1024 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1025 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1026 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1027 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1028 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1029 | <code>        assert.equal(result.body.displayText, '17');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1030 | <code>        assert.equal(result.body.finalAnswer, '17');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1031 | <code>        assert.equal(llmServer.calls.length, 5);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1032 | <code>        assert.deepEqual(llmServer.calls[3].payload.tools &#124;&#124; [], []);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1033 | <code>        assert.deepEqual(llmServer.calls[4].payload.tools &#124;&#124; [], []);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1034 | <code>        assert.match(llmServer.calls[3].system, /user-facing AILIS final response layer/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1035 | <code>        const finalizationMessages = JSON.stringify(llmServer.calls[3].payload.messages);</code> | 声明局部标识符 `finalizationMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1036 | <code>        assert.match(finalizationMessages, /finalAnswer/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1037 | <code>        assert.match(finalizationMessages, /17/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1038 | <code>        assert.match(finalizationMessages, /may_add_facts/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1039 | <code>        assert.match(finalizationMessages, /ORIGINAL_USER_REQUEST/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1040 | <code>        assert.doesNotMatch(result.body.displayText, /tool_calls&#124;subagent_notification&#124;TaskAgent/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1041 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1042 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1043 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1044 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1045 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1046 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1048 | <code>test.skip('legacy Persona live-child settlement is replaced by blocking system handoff', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1049 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-early-final-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1050 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1051 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1052 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1053 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1054 | <code>                summary: '交给 TaskAgent 核验攻略。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1055 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1056 | <code>                    tool: 'spawn_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1057 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1058 | <code>                        task_name: 'roxy_guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1059 | <code>                        message: '核验并整理《明日方舟：终末地》洛茜攻略。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1060 | <code>                        fork_turns: 'all'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1061 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1062 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1063 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1064 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1065 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1066 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1067 | <code>                action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1068 | <code>                final_answer: '不应提前返回的旧攻略。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1069 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1070 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1071 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1072 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1073 | <code>            final_answer: '基于本轮 TaskAgent 结果整理的洛茜攻略。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1074 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1076 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1077 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1078 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1079 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1080 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1081 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1082 | <code>    const agentCalls = [];</code> | 声明局部标识符 `agentCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1083 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1084 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1085 | <code>        gateway.runtime.agent_control.execute_agent = async ({ agent, args, context }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1086 | <code>            agentCalls.push({ agent, args, context });</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1087 | <code>            await new Promise((resolve) =&gt; setTimeout(resolve, 100));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1088 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1089 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1090 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1091 | <code>                displayText: '本轮 TaskAgent 已完成洛茜攻略。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1092 | <code>                finalAnswer: '洛茜攻略的新鲜证据与结论'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1093 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1094 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1095 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1096 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1097 | <code>            sessionId: 'persona-early-final-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1098 | <code>            message: '做一套洛茜的攻略，终末地的洛茜',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1099 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1100 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1101 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1102 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1103 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1104 | <code>                model: 'mock-persona-early-final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1105 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1106 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1107 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1108 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1109 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1110 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1111 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1112 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1113 | <code>                agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1114 | <code>                agentWaitTimeoutMs: 1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1115 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1116 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1118 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1119 | <code>        assert.equal(result.body.displayText, '洛茜攻略的新鲜证据与结论');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1120 | <code>        assert.equal(result.body.finalAnswer, '洛茜攻略的新鲜证据与结论');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1121 | <code>        assert.equal(llmServer.calls.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1122 | <code>        assert.equal(agentCalls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1123 | <code>        assert.doesNotMatch(result.body.displayText, /旧攻略/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1124 | <code>        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /subagent_notification/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1125 | <code>        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /本轮 TaskAgent 已完成洛茜攻略/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1126 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1127 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1128 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1129 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1131 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1133 | <code>test.skip('legacy renamed spawn deduplication is replaced by Harness continuation state', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1134 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-single-owner-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1135 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1136 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1137 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1138 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1139 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1140 | <code>                    tool: 'spawn_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1141 | <code>                    args: { task_name: 'guide', message: 'research guide', fork_turns: 'none' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1142 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1143 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1144 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1145 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1146 | <code>            return { action: 'tool', tool_call: { tool: 'wait_agent', args: { timeout_ms: 1000 } } };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1147 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1148 | <code>        if (decisionCount === 3) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1149 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1150 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1151 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1152 | <code>                    tool: 'spawn_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1153 | <code>                    args: { task_name: 'guide_supplement', message: 'search missing details', fork_turns: 'none' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1154 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1156 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1157 | <code>        return { action: 'final', final_answer: 'integrated original TaskAgent result' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1158 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1159 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1160 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1161 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1162 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1163 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1164 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1165 | <code>    let childRuns = 0;</code> | 声明局部标识符 `childRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1166 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1167 | <code>        gateway.runtime.agent_control.execute_agent = async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1168 | <code>            childRuns += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1169 | <code>            return { ok: true, status: 'completed', displayText: 'guide result' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1170 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1171 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1172 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1173 | <code>            sessionId: 'persona-single-owner-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1174 | <code>            message: 'make a guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1175 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1176 | <code>            maxAgentSteps: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1177 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1178 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1179 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1180 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1181 | <code>                model: 'mock-persona-single-owner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1182 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1183 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1184 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1185 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1186 | <code>                agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1187 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1188 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1189 | <code>                agentRole: 'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1191 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1193 | <code>        assert.equal(result.body.displayText, 'guide result');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1194 | <code>        assert.equal(childRuns, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1195 | <code>        assert.equal(gateway.runtime.agent_control.state.list({ sessionId: 'persona-single-owner-test' }).length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1196 | <code>        const duplicate = result.body.steps.find((step) =&gt; step.args?.task_name === 'guide_supplement');</code> | 声明局部标识符 `duplicate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1197 | <code>        assert.equal(duplicate.response.status, 'followup_queued');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1198 | <code>        assert.equal(duplicate.response.result.structuredContent.status, 'followup_queued');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1199 | <code>        assert.equal(duplicate.response.result.structuredContent.task_name, '/root/guide');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1200 | <code>        assert.equal(duplicate.response.result.structuredContent.continued, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1201 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1202 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1203 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1204 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1208 | <code>test('AILIS Agent run can be interrupted while preserving transcript data', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1209 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-interrupt-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1210 | <code>    const llmServer = await createDelayedChatCompletionsServer(5000);</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1211 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1212 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1213 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1214 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1215 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1216 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1218 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1219 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1220 | <code>        const runPromise = runAgent(status.url, {</code> | 声明局部标识符 `runPromise`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1221 | <code>            sessionId: 'interrupt-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1222 | <code>            message: '请执行一个会等待模型的慢任务',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1223 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1224 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1225 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1226 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1227 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1228 | <code>                model: 'mock-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1229 | <code>                timeoutMs: 30000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1230 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1231 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1232 | <code>                sessionId: 'interrupt-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1233 | <code>                agentLoop: 'llm'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1234 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1235 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1237 | <code>        const becameActive = await waitFor(() =&gt;</code> | 声明局部标识符 `becameActive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1238 | <code>            gateway.ensureAgentRunner().activeRuns.size === 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1239 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1240 | <code>        assert.equal(becameActive, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1241 | <code>        const reachedLlm = await waitFor(() =&gt; llmServer.calls.length === 1, { timeoutMs: 2000 });</code> | 声明局部标识符 `reachedLlm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1242 | <code>        assert.equal(reachedLlm, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1244 | <code>        const interrupt = await jsonFetch(`${status.url}/agent/interrupt`, {</code> | 声明局部标识符 `interrupt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1245 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1246 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1247 | <code>                sessionId: 'interrupt-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1248 | <code>                reason: 'test_interrupt'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1249 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1250 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1251 | <code>        assert.equal(interrupt.body.ok, true, interrupt.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1253 | <code>        const run = await runPromise;</code> | 声明局部标识符 `run`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1254 | <code>        assert.equal(run.body.status, 'interrupted');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1255 | <code>        assert.match(run.body.displayText, /已经中断/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1256 | <code>        assert.equal(gateway.ensureAgentRunner().activeRuns.size, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1258 | <code>        const transcript = await gateway.runtime.readTranscript(run.body.runId, 100);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1259 | <code>        const itemTypes = transcript.items.map((item) =&gt; item.type);</code> | 声明局部标识符 `itemTypes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1260 | <code>        assert.ok(itemTypes.includes('agent.interrupt_requested'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1261 | <code>        assert.ok(itemTypes.includes('agent.interrupted'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1262 | <code>        assert.ok(itemTypes.includes('turn.completed'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1264 | <code>        const analysis = await gateway.analyzeAgentRun(run.body.runId);</code> | 声明局部标识符 `analysis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1265 | <code>        assert.equal(analysis.summary.status, 'interrupted');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1266 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1267 | <code>        await gateway.stop().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1268 | <code>        await llmServer.close().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1269 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1270 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1271 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1272 | <code>async function createDirectToolCallChatCompletionsServer() {</code> | 定义函数 `createDirectToolCallChatCompletionsServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1273 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1274 | <code>    let turn = 0;</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1275 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1276 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1277 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1278 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1279 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1280 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1281 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1282 | <code>            turn += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1283 | <code>            calls.push({ url: req.url, payload, turn });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1284 | <code>            res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1285 | <code>            if (turn === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1286 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1287 | <code>                    choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1288 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1289 | <code>                            message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1290 | <code>                                content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1291 | <code>                                tool_calls: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1292 | <code>                                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1293 | <code>                                        id: 'direct-write-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1294 | <code>                                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1295 | <code>                                        function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1296 | <code>                                            name: 'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1297 | <code>                                            arguments: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1298 | <code>                                                path: 'direct-native-output.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1299 | <code>                                                content: 'direct native tool executor ok\n'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1300 | <code>                                            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1301 | <code>                                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1302 | <code>                                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1303 | <code>                                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1304 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1305 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1306 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1307 | <code>                    usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1308 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1309 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1310 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1311 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1312 | <code>                choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1313 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1314 | <code>                        message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1315 | <code>                            content: '**Direct native executor 完成**\n\n- 已写入 direct-native-output.txt\n- 工具结果已经回灌给下一轮'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1316 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1317 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1318 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1319 | <code>                usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1320 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1321 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1322 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1324 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1325 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1326 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1327 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1328 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1329 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1330 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1331 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1333 | <code>async function createVisibleProtocolRepairServer() {</code> | 定义函数 `createVisibleProtocolRepairServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1334 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1335 | <code>    let turn = 0;</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1336 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1337 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1338 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1339 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1340 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1341 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1342 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1343 | <code>            turn += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1344 | <code>            calls.push({ url: req.url, payload, turn });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1345 | <code>            res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1346 | <code>            const content = turn === 1</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1347 | <code>                ? '&lt;｜｜DSML｜｜tool_calls&gt;\n&lt;｜｜DSML｜｜invoke name="mcp__ailis_research__web_research"&gt;\n&lt;/｜｜DSML｜｜invoke&gt;\n&lt;/｜｜DSML｜｜tool_calls&gt;'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1348 | <code>                : '已经根据现有证据整理出可直接展示的最终结果。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1349 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1350 | <code>                choices: [{ message: { content } }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1351 | <code>                usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1352 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1353 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1354 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1355 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1356 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1357 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1358 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1359 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1360 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1361 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1362 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1364 | <code>async function createProviderErrorChatCompletionsServer({ status = 402, message = 'Insufficient Balance' } = {}) {</code> | 定义函数 `createProviderErrorChatCompletionsServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1365 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1366 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1367 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1368 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1369 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1370 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1371 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1372 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1373 | <code>            calls.push({ url: req.url, payload });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1374 | <code>            res.writeHead(status, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1375 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1376 | <code>                error: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1377 | <code>                    message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1378 | <code>                    type: 'billing_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1379 | <code>                    code: 'insufficient_balance'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1380 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1381 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1382 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1383 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1384 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1385 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1386 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1387 | <code>        url: `http://127.0.0.1:${address.port}`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1388 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1389 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1390 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1391 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1393 | <code>async function createToolSearchDirectExposureServer() {</code> | 定义函数 `createToolSearchDirectExposureServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1394 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1395 | <code>    let turn = 0;</code> | 声明局部标识符 `turn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1396 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1397 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1398 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1399 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1400 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1401 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1402 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1403 | <code>            turn += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1404 | <code>            calls.push({ url: req.url, payload, turn });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1405 | <code>            res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1406 | <code>            if (turn === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1407 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1408 | <code>                    choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1409 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1410 | <code>                            message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1411 | <code>                                content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1412 | <code>                                tool_calls: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1413 | <code>                                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1414 | <code>                                        id: 'search-tools-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1415 | <code>                                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1416 | <code>                                        function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1417 | <code>                                            name: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1418 | <code>                                            arguments: JSON.stringify({ query: 'GitHub repository metadata external OpenAPI tool' })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1419 | <code>                                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1420 | <code>                                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1421 | <code>                                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1422 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1423 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1424 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1425 | <code>                    usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1426 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1427 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1428 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1429 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1430 | <code>                choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1431 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1432 | <code>                        message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1433 | <code>                            content: 'dynamic direct tool exposure ok'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1434 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1435 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1436 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1437 | <code>                usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1438 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1439 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1440 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1442 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1443 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1444 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1445 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1446 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1447 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1448 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1449 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1451 | <code>async function createNativeResponsesDecisionServer(decisionFactory) {</code> | 定义函数 `createNativeResponsesDecisionServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1452 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1453 | <code>    let decisionCount = 0;</code> | 声明局部标识符 `decisionCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1454 | <code>    const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1455 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1456 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1457 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1458 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1459 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1460 | <code>            const payload = raw ? JSON.parse(raw) : {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1461 | <code>            calls.push({ url: req.url, payload });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1462 | <code>            res.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1463 | <code>            if (Array.isArray(payload.tools) &amp;&amp; payload.tools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1464 | <code>                decisionCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1465 | <code>                const decision = decisionFactory({ decisionCount, payload });</code> | 声明局部标识符 `decision`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1466 | <code>                if (decision?.action === 'tool' &amp;&amp; decision.tool_call?.tool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1467 | <code>                    res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1468 | <code>                        output: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1469 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1470 | <code>                                type: 'function_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1471 | <code>                                call_id: `native-call-${decisionCount}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1472 | <code>                                name: decision.tool_call.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1473 | <code>                                arguments: JSON.stringify(decision.tool_call.args &#124;&#124; {})</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1474 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1475 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1476 | <code>                        usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1477 | <code>                    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1478 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1479 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1480 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1481 | <code>                    output_text: decision?.final_answer &#124;&#124; decision?.blocked_reason &#124;&#124; decision?.summary &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1482 | <code>                    usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1483 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1484 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1485 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1486 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1487 | <code>                output_text: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1488 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1489 | <code>                    final_answer: 'Native review OK',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1490 | <code>                    issues: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1491 | <code>                }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1492 | <code>                usage: { input_tokens: 8, output_tokens: 8, total_tokens: 16 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1493 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1494 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1495 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1496 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1497 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1498 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1499 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1500 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1501 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1502 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1503 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1504 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1506 | <code>test('Agentic Executor keeps the configured 120s decision floor across recovery and vision context', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1507 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1508 | <code>        resolveAgentDecisionTimeoutMs({ timeoutMs: 25000 }, { events: [], stepResults: [] }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1509 | <code>        120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1510 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1511 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1512 | <code>        resolveAgentDecisionTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1513 | <code>            { timeoutMs: 25000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1514 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1515 | <code>                events: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1516 | <code>                stepResults: [{ response: { ok: false, status: 'error' } }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1517 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1518 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1519 | <code>        120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1520 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1521 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1522 | <code>        resolveAgentDecisionTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1523 | <code>            { timeoutMs: 25000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1524 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1525 | <code>                events: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1526 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1527 | <code>                        type: 'capability_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1528 | <code>                        loaded: { skills: ['vision'], tools: [] },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1529 | <code>                        request: { skills: ['vision'], tools: [] }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1530 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1531 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1532 | <code>                stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1533 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1534 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1535 | <code>        120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1536 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1537 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1538 | <code>        resolveAgentDecisionTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1539 | <code>            { timeoutMs: 25000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1540 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1541 | <code>                events: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1542 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1543 | <code>                        type: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1544 | <code>                        tool: 'vision.capture_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1545 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1546 | <code>                        ok: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1547 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1548 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1549 | <code>                stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1550 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1551 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1552 | <code>        120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1553 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1554 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1555 | <code>        resolveAgentDecisionTimeoutMs(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1556 | <code>            { timeoutMs: 30000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1557 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1558 | <code>                events: [{ type: 'tool_result', tool: 'vision.capture_context', status: 'completed' }],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1559 | <code>                stepResults: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1560 | <code>                requestContext: { visionAgentDecisionTimeoutMs: 65000 }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1561 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1562 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1563 | <code>        120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1564 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1567 | <code>test('Agentic Executor can execute real native direct tool calls before JSON planner fallback', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1568 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-direct-tools-agent-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1569 | <code>    const llmServer = await createDirectToolCallChatCompletionsServer();</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1570 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1571 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1572 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1573 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1574 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1575 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1576 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1577 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1578 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1579 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1580 | <code>            sessionId: 'direct-native-tool-agent-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1581 | <code>            message: '写入 direct-native-output.txt 并复核',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1582 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1583 | <code>            maxAgentSteps: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1584 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1585 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1586 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1587 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1588 | <code>                model: 'mock-direct-tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1589 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1590 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1591 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1592 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1593 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1594 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1595 | <code>                computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1596 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1597 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1598 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1599 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1600 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1601 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1603 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1604 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1605 | <code>        assert.equal(result.body.planner, 'llm-agentic-executor');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1606 | <code>        assert.match(result.body.displayText, /Direct native executor 完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1607 | <code>        assert.equal(await fs.readFile(path.join(workspaceRoot, 'direct-native-output.txt'), 'utf8'), 'direct native tool executor ok\n');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1608 | <code>        assert.equal(llmServer.calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1609 | <code>        assert.ok(llmServer.calls[0].payload.tools.some((tool) =&gt; tool.function?.name === 'write'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1610 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1611 | <code>            llmServer.calls[0].payload.tools.some((tool) =&gt; tool.function?.name === 'ailis_agent_decision'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1612 | <code>            false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1613 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1614 | <code>        assert.equal(llmServer.calls[0].payload.tool_choice, 'auto');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1615 | <code>        assert.equal(llmServer.calls[1].payload.tool_choice, 'none');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1616 | <code>        assert.deepEqual(llmServer.calls[1].payload.tools &#124;&#124; [], []);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1617 | <code>        assert.match(llmServer.calls[0].payload.messages[0].content, /Responses-Compatible Tool Runtime/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1618 | <code>        assert.equal(result.body.steps[0].tool, 'write');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1619 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1620 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1621 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1622 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1623 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1624 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1626 | <code>test('Agentic Executor repairs visible DSML protocol before it reaches the final response', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1627 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-protocol-repair-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1628 | <code>    const llmServer = await createVisibleProtocolRepairServer();</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1629 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1630 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1631 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1632 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1633 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1634 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1636 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1637 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1638 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1639 | <code>            sessionId: 'visible-protocol-repair-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1640 | <code>            message: '整理现有证据并直接回答',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1641 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1642 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1643 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1644 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1645 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1646 | <code>                model: 'mock-protocol-repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1647 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1648 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1649 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1650 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1651 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1652 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1653 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1654 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1655 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1656 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1657 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1658 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1659 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1660 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1661 | <code>        assert.match(result.body.displayText, /可直接展示的最终结果/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1662 | <code>        assert.doesNotMatch(result.body.displayText, /DSML&#124;tool_calls&#124;invoke/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1663 | <code>        assert.equal(llmServer.calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1664 | <code>        assert.match(llmServer.calls[1].payload.messages[0].content, /Protocol repair/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1665 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1666 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1667 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1668 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1669 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1670 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1672 | <code>test('Agentic Executor fails fast on terminal LLM provider billing errors', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1673 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-provider-error-agent-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1674 | <code>    const llmServer = await createProviderErrorChatCompletionsServer({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1675 | <code>        message: 'The request failed because your account has an overdue balance.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1676 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1677 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1678 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1679 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1680 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1681 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1682 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1683 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1684 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1685 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1686 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1687 | <code>            sessionId: 'provider-error-fail-fast-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1688 | <code>            message: '读取一个文档并回答问题',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1689 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1690 | <code>            maxAgentSteps: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1691 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1692 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1693 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1694 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1695 | <code>                model: 'mock-provider-error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1696 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1697 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1698 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1699 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1700 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1701 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1702 | <code>                nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1703 | <code>                computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1704 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1705 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1706 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1707 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1708 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1709 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1710 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1711 | <code>        assert.equal(result.body.ok, false, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1712 | <code>        assert.equal(result.body.status, 'provider_error');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1713 | <code>        assert.equal(result.body.intent, 'llm_provider_unavailable');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1714 | <code>        assert.match(result.body.displayText, /overdue balance/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1715 | <code>        assert.equal(result.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1716 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1717 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1718 | <code>            result.body.events.some((event) =&gt; event.type === 'agent.invalid_decision_observation'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1719 | <code>            false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1720 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1721 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1722 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1723 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1724 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1725 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1726 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1728 | <code>test('Agentic Executor fails fast when the LLM decision request times out upstream', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1729 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-provider-timeout-agent-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1730 | <code>    const llmServer = await createProviderErrorChatCompletionsServer({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1731 | <code>        status: 504,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1732 | <code>        message: 'upstream model request timed out'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1733 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1734 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1735 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1736 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1737 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1738 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1739 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1741 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1742 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1743 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1744 | <code>            sessionId: 'provider-timeout-fail-fast-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1745 | <code>            message: '你好',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1746 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1747 | <code>            maxAgentSteps: 5,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1748 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1749 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1750 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1751 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1752 | <code>                model: 'mock-provider-timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1753 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1754 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1755 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1756 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1757 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1758 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1759 | <code>                nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1760 | <code>                computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1761 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1762 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1763 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1764 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1765 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1766 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1767 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1768 | <code>        assert.equal(result.body.ok, false, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1769 | <code>        assert.equal(result.body.status, 'provider_error');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1770 | <code>        assert.equal(result.body.intent, 'llm_provider_unavailable');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1771 | <code>        assert.match(result.body.displayText, /timed out/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1772 | <code>        assert.equal(result.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1773 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1774 | <code>        assert.equal(result.body.events.some((event) =&gt; event.type === 'agent.invalid_decision_observation'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1775 | <code>        assert.notEqual(result.body.status, 'max_steps_reached');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1776 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1777 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1778 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1779 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1780 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1781 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1782 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1783 | <code>test('Agentic Executor turns tool_search results into valid dynamic native tool specs', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1784 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-direct-tool-search-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1785 | <code>    const llmServer = await createToolSearchDirectExposureServer();</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1786 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1787 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1788 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1789 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1790 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1791 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1793 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1794 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1795 | <code>        await gateway.runtime.capabilityManager.bulkExposeExternalTools({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1796 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1797 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1798 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1799 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1800 | <code>                    operationId: 'githubGetRepo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1801 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1802 | <code>                    path: '/repos/{owner}/{repo}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1803 | <code>                    summary: 'Get GitHub repository metadata.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1804 | <code>                    parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1805 | <code>                        { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1806 | <code>                        { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1807 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1808 | <code>                    whenToUse: ['Use for official GitHub repository metadata.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1809 | <code>                    examples: [{ owner: 'openai', repo: 'codex' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1810 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1811 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1812 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1813 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1814 | <code>            sessionId: 'direct-tool-search-agent-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1815 | <code>            message: '搜索 web_search 工具并结束',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1816 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1817 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1818 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1819 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1820 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1821 | <code>                model: 'mock-direct-tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1822 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1823 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1824 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1825 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1826 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1827 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1828 | <code>                computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1829 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1830 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1831 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1832 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1833 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1834 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1835 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1836 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1837 | <code>        assert.equal(llmServer.calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1838 | <code>        const secondTools = llmServer.calls[1].payload.tools.map((tool) =&gt; tool.function &#124;&#124; tool);</code> | 声明局部标识符 `secondTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1839 | <code>        const externalSpec = secondTools.find((tool) =&gt; /^external__/.test(tool.name));</code> | 声明局部标识符 `externalSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1840 | <code>        assert.ok(externalSpec, 'callable external tools should become native callable tools after tool_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1841 | <code>        assert.equal(externalSpec.parameters.type, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1842 | <code>        assert.equal(Array.isArray(externalSpec.parameters.required), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1843 | <code>        assert.equal(typeof externalSpec.parameters.properties, 'object');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1844 | <code>        assert.equal(secondTools.some((tool) =&gt; tool.name === 'mcp_bridge'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1845 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1846 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1847 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1848 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1849 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1850 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1851 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1852 | <code>test('Agentic Executor keeps registered external tool details out of the first decision payload', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1853 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-external-tools-agent-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1854 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1855 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1856 | <code>        intent: 'inspect_external_tool_exposure',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1857 | <code>        summary: '已看到外部工具面',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1858 | <code>        action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1859 | <code>        final_answer: 'external tools visible'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1860 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1861 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1862 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1863 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1864 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1865 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1866 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1868 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1869 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1870 | <code>        const exposed = await gateway.runtime.capabilityManager.bulkExposeExternalTools({</code> | 声明局部标识符 `exposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1871 | <code>            includeInstalledMcp: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1872 | <code>            includeMcpRegistry: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1873 | <code>            openapiOperations: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1874 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1875 | <code>                    operationId: 'githubGetRepo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1876 | <code>                    method: 'get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1877 | <code>                    path: '/repos/{owner}/{repo}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1878 | <code>                    summary: 'Get GitHub repository metadata.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1879 | <code>                    parameters: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1880 | <code>                        { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1881 | <code>                        { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1882 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1883 | <code>                    whenToUse: ['Use for official GitHub repository metadata.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1884 | <code>                    whenNotToUse: ['Do not use for local git status.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1885 | <code>                    preconditions: ['GitHub API is reachable.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1886 | <code>                    examples: [{ owner: 'openai', repo: 'codex' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1887 | <code>                    badExamples: [{ owner: 'openai' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1888 | <code>                    alternatives: ['Use code.git_status for local repositories.'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1889 | <code>                    errors: { not_found: { recoverable: false } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1890 | <code>                    permissions: ['github.read']</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1891 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1892 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1893 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1894 | <code>        assert.equal(exposed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1895 | <code>        assert.equal(exposed.added, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1896 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1897 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1898 | <code>            sessionId: 'external-tool-exposure-agent-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1899 | <code>            message: '查看 GitHub 仓库 metadata 能力是否可用',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1900 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1901 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1902 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1903 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1904 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1905 | <code>                model: 'mock-planner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1906 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1907 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1908 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1909 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1910 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1911 | <code>                computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1912 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1913 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1914 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1915 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1916 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1917 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1918 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1919 | <code>        assert.equal(result.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1920 | <code>        const llmUserPayload = parseModelContextPayload(llmServer.calls[0]);</code> | 声明局部标识符 `llmUserPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1921 | <code>        assert.equal(llmUserPayload.external_tool_exposure, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1922 | <code>        assert.doesNotMatch(JSON.stringify(llmServer.calls[0].payload.messages), /githubGetRepo&#124;GitHub repository metadata/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1923 | <code>        const firstTurnToolNames = (llmServer.calls[0].payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name);</code> | 声明局部标识符 `firstTurnToolNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1924 | <code>        assert.ok(firstTurnToolNames.includes('tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1925 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1926 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1927 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1928 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1929 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1930 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1932 | <code>test('Agentic Executor consumes native provider tool-call decisions and keeps runtime tool execution local', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1933 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-native-agent-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1934 | <code>    const llmServer = await createNativeResponsesDecisionServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1935 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1936 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1937 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1938 | <code>                intent: 'native_decision_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1939 | <code>                summary: '使用原生 tool-call 决策写入文件',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1940 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1941 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1942 | <code>                    tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1943 | <code>                    title: '写入 native-output.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1944 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1945 | <code>                        path: 'native-output.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1946 | <code>                        content: 'native tool-call decision ok\n'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1947 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1948 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1949 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1950 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1951 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1952 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1953 | <code>            intent: 'native_decision_write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1954 | <code>            summary: '文件已经写入',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1955 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1956 | <code>            final_answer: '**Native decision 完成**'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1957 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1958 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1959 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1960 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1961 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1962 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1963 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1964 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1966 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1967 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1968 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1969 | <code>            sessionId: 'native-tool-call-agent-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1970 | <code>            message: '写入 native-output.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1971 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1972 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1973 | <code>                provider: 'openai-responses',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1974 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1975 | <code>                apiKey: 'test-openai-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1976 | <code>                model: 'gpt-native-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1977 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1978 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1979 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1980 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1981 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1982 | <code>                computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1983 | <code>                permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1984 | <code>                approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1985 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1986 | <code>                autoConfirm: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1987 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1988 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1989 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1990 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1991 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1992 | <code>        assert.match(result.body.displayText, /Native decision 完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1993 | <code>        const written = await fs.readFile(path.join(workspaceRoot, 'native-output.txt'), 'utf8');</code> | 声明局部标识符 `written`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1994 | <code>        assert.match(written, /native tool-call decision ok/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1995 | <code>        const nativeDecisionCalls = llmServer.calls.filter((call) =&gt;</code> | 声明局部标识符 `nativeDecisionCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1996 | <code>            call.payload.tools?.some((tool) =&gt; tool.name === 'write')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1997 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1998 | <code>        assert.equal(nativeDecisionCalls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 1999 | <code>        assert.equal(nativeDecisionCalls[0].payload.tool_choice, 'auto');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2000 | <code>        assert.equal(nativeDecisionCalls[0].payload.tools.some((tool) =&gt; tool.name === 'ailis_agent_decision'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2001 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2002 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2003 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2004 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2005 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2006 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2007 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2008 | <code>test('Agentic Executor Loop asks confirmation, resumes, observes, and keeps calling tools until final', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2009 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-llm-planner-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2010 | <code>    const llmServer = await createMockChatCompletionsServer();</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2011 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2012 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2013 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2014 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2015 | <code>        model: 'mock-planner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2016 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2017 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2018 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2019 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2020 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2021 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2022 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2023 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2024 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2026 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2027 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2028 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2029 | <code>        const first = await runAgent(baseUrl, {</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2030 | <code>            sessionId: 'llm-planner-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2031 | <code>            message: '帮我创建一个 planner-output 目录，并写入 README.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2032 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2033 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2034 | <code>            context: { workspace: workspaceRoot, agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2035 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2036 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2037 | <code>        assert.equal(first.body.ok, false, JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2038 | <code>            status: first.body.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2039 | <code>            steps: first.body.steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2040 | <code>            calls: llmServer.calls.map((call) =&gt; (call.payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2041 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2042 | <code>        assert.equal(first.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2043 | <code>        assert.equal(first.body.planner, 'llm-agentic-executor');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2044 | <code>        assert.equal(first.body.confirmationRequired, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2045 | <code>        assert.equal(first.body.approvalType, 'agent_tool_call');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2046 | <code>        assert.ok(first.body.approvalId);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2047 | <code>        assert.doesNotMatch(first.body.displayText, /Agentic Executor Loop&#124;确认编号/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2048 | <code>        assert.equal(first.body.plan.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2049 | <code>        assert.equal(first.body.plan[0].tool, 'exec');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2050 | <code>        assert.match(first.body.plan[0].args.command, /New-Item.*planner-output/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2051 | <code>        await assert.rejects(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2052 | <code>            () =&gt; fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2053 | <code>            /ENOENT/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2054 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2055 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2056 | <code>        const classifyConfirm = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyConfirm`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2057 | <code>            sessionId: 'llm-planner-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2058 | <code>            message: '确认执行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2059 | <code>            classifyOnly: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2060 | <code>            context: { workspace: workspaceRoot, agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2061 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2062 | <code>        assert.equal(classifyConfirm.body.intent, 'agent_action_confirmation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2063 | <code>        assert.equal(classifyConfirm.body.mode, 'task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2064 | <code>        assert.equal(classifyConfirm.body.approvalId, first.body.approvalId);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2065 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2066 | <code>        const directWithoutApproval = await runAgent(baseUrl, {</code> | 声明局部标识符 `directWithoutApproval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2067 | <code>            sessionId: 'llm-planner-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2068 | <code>            message: 'api direct confirm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2069 | <code>            confirmApprovalId: first.body.approvalId,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2070 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2071 | <code>            context: { workspace: workspaceRoot, agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2072 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2073 | <code>        assert.equal(directWithoutApproval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2074 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2075 | <code>        const confirmed = await runAgent(baseUrl, {</code> | 声明局部标识符 `confirmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2076 | <code>            sessionId: 'llm-planner-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2077 | <code>            message: '确认执行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2078 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2079 | <code>            context: { workspace: workspaceRoot, agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2080 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2081 | <code>        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2082 | <code>        assert.equal(confirmed.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2083 | <code>        assert.equal(confirmed.body.planner, 'llm-agentic-executor');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2084 | <code>        assert.equal(confirmed.body.steps.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2085 | <code>        assert.ok(confirmed.body.events.length &gt;= 6);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2086 | <code>        assert.match(confirmed.body.displayText, /\*\*(Agentic Executor&#124;任务执行流程) 已完成\*\*/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2087 | <code>        assert.match(confirmed.body.displayText, /README\.txt 已创建/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2088 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2089 | <code>        const text = await fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2090 | <code>        assert.match(text, /Agentic Executor OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2091 | <code>        assert.equal(llmServer.calls.filter((call) =&gt; /Responses-Compatible Tool Runtime/.test(call.system)).length, 3);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2092 | <code>        assert.match(llmServer.calls[0].system, /You are a coding agent running in AILIS/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2093 | <code>        assert.match(llmServer.calls[0].system, /same outer AILIS conversation/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2094 | <code>        assert.match(llmServer.calls[0].system, /OpenAI Responses object model/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2095 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /名字固定为AILIS/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2096 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /性格设定/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2097 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /不具备任何人工智能/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2098 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2099 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /final_answer 字段是给用户看的 Markdown 字符串/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2100 | <code>        const firstPromptPayload = parseModelContextPayload(llmServer.calls[0]);</code> | 声明局部标识符 `firstPromptPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2101 | <code>        assert.equal(firstPromptPayload.capability_catalog, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2102 | <code>        const firstPromptTools = (llmServer.calls[0].payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name);</code> | 声明局部标识符 `firstPromptTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2103 | <code>        assert.ok(firstPromptTools.includes('tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2104 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2105 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2106 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2107 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2108 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2110 | <code>test('Agentic Executor restores pending approval from durable store after Gateway restart', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2111 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-pending-restore-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2112 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2113 | <code>    const llmServer = await createMockChatCompletionsServer();</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2114 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2115 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2116 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2117 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2118 | <code>        model: 'mock-planner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2119 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2120 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2121 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2122 | <code>    let gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2123 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2124 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2125 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2126 | <code>        auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2127 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2129 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2130 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2131 | <code>        const first = await runAgent(status.url, {</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2132 | <code>            sessionId: 'pending-restore-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2133 | <code>            message: '帮我创建一个 planner-output 目录，并写入 README.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2134 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2135 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2136 | <code>            context: { workspace: workspaceRoot, agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2137 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2138 | <code>        assert.equal(first.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2139 | <code>        const approvalId = first.body.approvalId;</code> | 声明局部标识符 `approvalId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2140 | <code>        const storePath = path.join(auditDir, 'pending-agent-state.json');</code> | 声明局部标识符 `storePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2141 | <code>        const stored = JSON.parse(await fs.readFile(storePath, 'utf8'));</code> | 声明局部标识符 `stored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2142 | <code>        const storedApprovals = Array.isArray(stored.pendingAgentApprovals)</code> | 声明局部标识符 `storedApprovals`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2143 | <code>            ? stored.pendingAgentApprovals</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2144 | <code>            : Object.values(stored.pendingAgentApprovals &#124;&#124; {});</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2145 | <code>        assert.equal(storedApprovals[0].approvalId, approvalId);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2146 | <code>        assert.equal(storedApprovals[0].contextManagerCheckpoint?.schema, undefined);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2147 | <code>        assert.ok(storedApprovals[0].contextManagerCheckpoint.items.length &gt;= 2);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2148 | <code>        assert.equal(JSON.stringify(stored).includes('test-key'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2150 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2152 | <code>        gateway = new AILISGateway({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2153 | <code>            port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2154 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2155 | <code>            projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2156 | <code>            auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2157 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2158 | <code>        const restarted = await gateway.start();</code> | 声明局部标识符 `restarted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2160 | <code>        const confirmed = await runAgent(restarted.url, {</code> | 声明局部标识符 `confirmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2161 | <code>            sessionId: 'pending-restore-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2162 | <code>            message: '确认执行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2163 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2164 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2165 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2166 | <code>        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2167 | <code>        assert.equal(confirmed.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2168 | <code>        assert.match(confirmed.body.displayText, /(Agentic Executor&#124;任务执行流程) 已完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2170 | <code>        const text = await fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2171 | <code>        assert.match(text, /Agentic Executor OK/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2172 | <code>        const cleared = JSON.parse(await fs.readFile(storePath, 'utf8'));</code> | 声明局部标识符 `cleared`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2173 | <code>        assert.equal(cleared.pendingAgentApprovals.length, 0);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2174 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2175 | <code>        await gateway.stop().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2176 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2177 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2178 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2180 | <code>test('Agentic Executor can request approved read-only vision context', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2181 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-vision-agent-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2182 | <code>    const captured = [];</code> | 声明局部标识符 `captured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2183 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount, messages }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2184 | <code>        const hasImageInput = messages.some((message) =&gt;</code> | 声明局部标识符 `hasImageInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2185 | <code>            Array.isArray(message.content) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2186 | <code>            message.content.some((part) =&gt; part?.type === 'image_url')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2187 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2188 | <code>        if (hasImageInput) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2189 | <code>            return '我看到截图里有一个桌面端聊天窗口，界面没有明显崩溃。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2190 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2191 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2192 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2193 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2194 | <code>                intent: 'vision_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2195 | <code>                summary: '发现只读视觉工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2196 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2197 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2198 | <code>                    tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2199 | <code>                    title: '查找只读视觉工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2200 | <code>                    args: { query: 'vision.capture_context screen capture' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2201 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2202 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2203 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2204 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2205 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2206 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2207 | <code>                intent: 'vision_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2208 | <code>                summary: '请求只读视觉上下文',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2209 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2210 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2211 | <code>                    tool: 'vision_capture_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2212 | <code>                    title: '看一眼当前屏幕',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2213 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2214 | <code>                        action: 'capture_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2215 | <code>                        target: 'screen',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2216 | <code>                        reason: '用户要求判断桌面端视觉截图功能是否正常',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2217 | <code>                        question: '当前聊天窗口、桌宠窗口和控制台是否正常运行？'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2218 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2219 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2220 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2221 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2222 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2223 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2224 | <code>            intent: 'vision_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2225 | <code>            summary: '已经获得视觉 observation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2226 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2227 | <code>            final_answer: '我看到了当前界面：聊天窗口存在，未发现明显崩溃；如果要更精确，需要你框选异常区域。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2228 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2229 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2230 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2231 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2232 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2233 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2234 | <code>        model: 'mock-vision-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2235 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2236 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2237 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2238 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2239 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2240 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2241 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2242 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2243 | <code>        visionServices: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2244 | <code>            permissionPolicy: 'manual',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2245 | <code>            getLlmSettings: () =&gt; llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2246 | <code>            capture: async ({ target, reason }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2247 | <code>                captured.push({ target, reason });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2248 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2249 | <code>                    type: 'vision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2250 | <code>                    id: 'snapshot-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2251 | <code>                    source: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2252 | <code>                    label: '屏幕截图',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2253 | <code>                    imagePath: path.join(workspaceRoot, 'snapshot.png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2254 | <code>                    thumbnailPath: path.join(workspaceRoot, 'snapshot.thumb.png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2255 | <code>                    dataUrl: 'data:image/png;base64,AAAA',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2256 | <code>                    thumbnailDataUrl: 'data:image/png;base64,BBBB',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2257 | <code>                    mimeType: 'image/png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2258 | <code>                    width: 1280,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2259 | <code>                    height: 720,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2260 | <code>                    createdAt: new Date(0).toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2261 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2262 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2263 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2264 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2266 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2267 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2268 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2269 | <code>        const first = await runAgent(baseUrl, {</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2270 | <code>            sessionId: 'vision-agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2271 | <code>            message: '帮我观察当前屏幕，判断聊天窗口和桌宠是否正常。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2272 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2273 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2274 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2275 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2277 | <code>        assert.equal(first.body.ok, false, JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2278 | <code>            status: first.body.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2279 | <code>            steps: first.body.steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2280 | <code>            calls: llmServer.calls.map((call) =&gt; (call.payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2281 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2282 | <code>        assert.equal(first.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2283 | <code>        assert.equal(first.body.approvalType, 'vision_capture_context');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2284 | <code>        assert.equal(first.body.plan[0].tool, 'vision.capture_context');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2285 | <code>        assert.match(first.body.displayText, /先得到你的确认/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2286 | <code>        assert.match(first.body.displayText, /看一眼当前画面&#124;看一眼屏幕/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2287 | <code>        assert.doesNotMatch(first.body.displayText, /确认编号&#124;Agentic Executor/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2288 | <code>        assert.equal(captured.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2289 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2290 | <code>        const confirmed = await runAgent(baseUrl, {</code> | 声明局部标识符 `confirmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2291 | <code>            sessionId: 'vision-agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2292 | <code>            message: '确认执行',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2293 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2294 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2295 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2297 | <code>        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2298 | <code>        assert.equal(confirmed.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2299 | <code>        assert.equal(captured.length, 1, JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2300 | <code>            status: confirmed.body.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2301 | <code>            steps: confirmed.body.steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2302 | <code>            calls: llmServer.calls.map((call) =&gt; (call.payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2303 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2304 | <code>        assert.equal(captured[0].target, 'screen');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2305 | <code>        assert.match(confirmed.body.displayText, /聊天窗口存在/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2306 | <code>        assert.ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2307 | <code>            llmServer.calls.some((call) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2308 | <code>                call.payload.messages?.some((message) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2309 | <code>                    Array.isArray(message.content) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2310 | <code>                    message.content.some((part) =&gt; part?.type === 'image_url')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2311 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2312 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2313 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2314 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2315 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2316 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2317 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2318 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2320 | <code>test('Agentic Executor skips vision confirmation when full computer control is enabled', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2321 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-vision-full-control-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2322 | <code>    const captured = [];</code> | 声明局部标识符 `captured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2323 | <code>    let agentDecisionCount = 0;</code> | 声明局部标识符 `agentDecisionCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2324 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ messages }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2325 | <code>        const hasImageInput = messages.some((message) =&gt;</code> | 声明局部标识符 `hasImageInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2326 | <code>            Array.isArray(message.content) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2327 | <code>            message.content.some((part) =&gt; part?.type === 'image_url')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2328 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2329 | <code>        if (hasImageInput) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2330 | <code>            return '我看到桌面上有 AILIS 聊天窗口和桌宠，截图链路正常。';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2331 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2332 | <code>        agentDecisionCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2333 | <code>        if (agentDecisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2334 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2335 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2336 | <code>                intent: 'vision_full_control_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2337 | <code>                summary: '发现只读视觉工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2338 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2339 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2340 | <code>                    tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2341 | <code>                    title: '查找只读视觉工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2342 | <code>                    args: { query: 'vision.capture_context screen capture' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2343 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2344 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2345 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2346 | <code>        if (agentDecisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2347 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2348 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2349 | <code>                intent: 'vision_full_control_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2350 | <code>                summary: '完全控制下直接获取视觉上下文',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2351 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2352 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2353 | <code>                    tool: 'vision_capture_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2354 | <code>                    title: '看一眼当前屏幕',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2355 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2356 | <code>                        action: 'capture_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2357 | <code>                        target: 'screen',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2358 | <code>                        reason: '用户已开启完全控制能力，排查视觉功能状态',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2359 | <code>                        question: '当前视觉功能是否正常？'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2360 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2361 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2362 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2364 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2365 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2366 | <code>            intent: 'vision_full_control_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2367 | <code>            summary: '视觉检查完成',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2368 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2369 | <code>            final_answer: '我看到了当前屏幕，AILIS 聊天窗口和桌宠都在，视觉截图链路正常。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2370 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2371 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2372 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2373 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2374 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2375 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2376 | <code>        model: 'mock-vision-full-control-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2377 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2378 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2379 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2380 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2381 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2382 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2383 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2384 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2385 | <code>        defaultContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2386 | <code>            computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2387 | <code>            permissionProfile: 'danger-full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2388 | <code>            approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2389 | <code>            confirmationPolicy: 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2390 | <code>            visionPermissionPolicy: 'manual',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2391 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2392 | <code>            autoConfirm: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2393 | <code>            allowComputerWideAccess: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2394 | <code>            allowSystemMutation: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2395 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2396 | <code>        visionServices: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2397 | <code>            permissionPolicy: 'manual',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 2398 | <code>            getLlmSettings: () =&gt; llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2399 | <code>            capture: async ({ target, reason }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2400 | <code>                captured.push({ target, reason });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2401 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2402 | <code>                    type: 'vision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2403 | <code>                    id: 'snapshot-full-control-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2404 | <code>                    source: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2405 | <code>                    label: '屏幕截图',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2406 | <code>                    imagePath: path.join(workspaceRoot, 'snapshot.png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2407 | <code>                    thumbnailPath: path.join(workspaceRoot, 'snapshot.thumb.png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2408 | <code>                    dataUrl: 'data:image/png;base64,AAAA',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2409 | <code>                    thumbnailDataUrl: 'data:image/png;base64,BBBB',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2410 | <code>                    mimeType: 'image/png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2411 | <code>                    width: 1280,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2412 | <code>                    height: 720,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2413 | <code>                    createdAt: new Date(0).toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2414 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2415 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2416 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2417 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2419 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2420 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2421 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2422 | <code>            sessionId: 'vision-full-control-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2423 | <code>            message: 'AILIS，直接看一下当前屏幕，判断视觉截图功能是否正常。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2424 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2425 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2426 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2427 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2429 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2430 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2431 | <code>        assert.equal(result.body.confirmationRequired, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2432 | <code>        assert.equal(captured.length, 1, JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2433 | <code>            status: result.body.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2434 | <code>            steps: result.body.steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2435 | <code>            calls: llmServer.calls.map((call) =&gt; (call.payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2436 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2437 | <code>        assert.equal(captured[0].target, 'screen');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2438 | <code>        assert.match(result.body.displayText, /视觉截图链路正常/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2439 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2440 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2441 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2442 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2443 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2444 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2445 | <code>test('Agentic Executor max-step fallback does not expose raw tool logs to the user', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2446 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-max-step-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2447 | <code>    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'secret-ish line\n'.repeat(80), 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2448 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2449 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2450 | <code>        intent: 'discover_until_limit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2451 | <code>        summary: '查找本地文件读取能力',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2452 | <code>        action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2453 | <code>        tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2454 | <code>            tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2455 | <code>            title: '查找文件读取工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2456 | <code>            args: { query: 'read local text file' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2457 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2458 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2459 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2460 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2461 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2462 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2463 | <code>        model: 'mock-max-step-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2464 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2465 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2466 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2467 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2468 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2469 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2470 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2471 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2472 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2474 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2475 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2476 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2477 | <code>            sessionId: 'max-step-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2478 | <code>            message: '检查 note.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2479 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2480 | <code>            maxAgentSteps: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2481 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2482 | <code>            context: { workspace: workspaceRoot, agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2483 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2484 | <code>        assert.equal(result.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2485 | <code>        assert.equal(result.body.status, 'max_steps_reached');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2486 | <code>        assert.match(result.body.displayText, /先停住&#124;还没有形成足够稳的结论/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2487 | <code>        assert.doesNotMatch(result.body.displayText, /```&#124;secret-ish line&#124;Agentic Executor&#124;我已经做过这些步骤&#124;读取 note\.txt：完成/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2488 | <code>        assert.equal(result.body.surface.source, 'agent_max_steps_handoff');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2489 | <code>        assert.equal(result.body.surface.bubbleText, '我整理好执行现场了。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2490 | <code>        assert.equal(result.body.steps.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2491 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2492 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2493 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2494 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2495 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2496 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2497 | <code>test('TaskAgent clamps caller-requested execution to eight work rounds plus one finalization round', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2498 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-agent-seven-rounds-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2499 | <code>    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'evidence\n', 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2500 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2501 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2502 | <code>        intent: 'bounded_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2503 | <code>        summary: '继续读取证据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2504 | <code>        action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2505 | <code>        tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2506 | <code>            tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2507 | <code>            title: '读取证据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2508 | <code>            args: { command: 'powershell -NoProfile -Command "Get-Content -LiteralPath note.txt"' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2509 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2510 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2511 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2512 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2513 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2514 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2515 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2516 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2518 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2519 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2520 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2521 | <code>            sessionId: 'task-agent-three-rounds-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2522 | <code>            message: '读取 note.txt 并整理结果',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2523 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2524 | <code>            agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2525 | <code>            maxAgentSteps: 30,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2526 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2527 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2528 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2529 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2530 | <code>                model: 'mock-seven-round-task-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2531 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2532 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2533 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2534 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2535 | <code>                agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2536 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2537 | <code>                confirmationPolicy: 'auto'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2538 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2539 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2540 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2541 | <code>        assert.equal(result.body.status, 'max_steps_reached');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2542 | <code>        assert.equal(result.body.steps.length, 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2543 | <code>        assert.equal(llmServer.calls.length, 9);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2544 | <code>        assert.match(llmServer.calls[0].system, /at most 8 work-tool rounds/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2545 | <code>        assert.match(llmServer.calls[0].system, /9-round total budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2546 | <code>        assert.match(llmServer.calls[0].system, /tool_search acquires a capability/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2547 | <code>        assert.match(llmServer.calls[0].system, /web_run archive operation/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2548 | <code>        assert.equal(llmServer.calls[8].payload.tool_choice, 'none');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2549 | <code>        assert.deepEqual(llmServer.calls[8].payload.tools &#124;&#124; [], []);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2550 | <code>        const finalizationMessages = JSON.stringify(llmServer.calls[8].payload.messages);</code> | 声明局部标识符 `finalizationMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2551 | <code>        assert.match(finalizationMessages, /TaskAgent finalization package/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2552 | <code>        assert.match(finalizationMessages, /读取 note\.txt 并整理结果/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2553 | <code>        assert.match(finalizationMessages, /evidence/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2554 | <code>        assert.doesNotMatch(llmServer.calls[8].system, /Native direct tools exposed/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2555 | <code>        assert.doesNotMatch(llmServer.calls[8].system, /Emit function calls/);</code> | 定义函数 `calls`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2556 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2557 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2558 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2559 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2560 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2562 | <code>test('Agentic Executor feeds invalid decisions back as observations instead of stopping early', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2563 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-invalid-decision-observation-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2564 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2565 | <code>        if (decisionCount &lt;= 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2566 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2567 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2568 | <code>                intent: 'clinical_trials_lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2569 | <code>                summary: '需要先查询结构化临床试验数据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2570 | <code>                plan_update: ['搜索 ClinicalTrials API', '读取 enrollment 字段']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2571 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2572 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2573 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2574 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2575 | <code>            intent: 'clinical_trials_lookup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2576 | <code>            summary: '非法决策已修复',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2577 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2578 | <code>            final_answer: '90'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2579 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2580 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2581 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2582 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2583 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2584 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2585 | <code>        model: 'mock-invalid-decision-observation-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2586 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2587 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2588 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2589 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2590 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2591 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2592 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2593 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2594 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2596 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2597 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2598 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2599 | <code>            sessionId: 'invalid-decision-observation-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2600 | <code>            message: '查询 NCT03411733 的 actual enrollment count。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2601 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2602 | <code>            maxAgentSteps: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2603 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2604 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2605 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2606 | <code>                agentRole: 'task_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2607 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2608 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2609 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2610 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2611 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2612 | <code>        assert.match(result.body.displayText, /90/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2613 | <code>        assert.equal(llmServer.calls.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2614 | <code>        assert.ok(result.body.events.some((event) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2615 | <code>            event.type === 'runtime_note' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2616 | <code>            event.status === 'invalid_decision_observation' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2617 | <code>            event.protocol_error === 'model_input_custom_json_decision'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2618 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2619 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2620 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2621 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2622 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2623 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2625 | <code>test('Agentic Executor safety-finalizes after two identical invalid native tool calls', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2626 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-invalid-native-tool-fuse-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2627 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2628 | <code>        if (decisionCount &lt;= 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2629 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2630 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2631 | <code>                summary: '尝试写入文件。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2632 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2633 | <code>                    tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2634 | <code>                    args: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2635 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2636 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2637 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2638 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2639 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2640 | <code>            final_answer: '无法在缺少必填参数时安全执行写入。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2641 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2642 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2643 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2644 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2645 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2646 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2647 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2648 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2650 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2651 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2652 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2653 | <code>            sessionId: 'invalid-native-tool-fuse-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2654 | <code>            message: '创建一个文本文件。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2655 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2656 | <code>            maxAgentSteps: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2657 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2658 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2659 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2660 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2661 | <code>                model: 'mock-invalid-native-tool-fuse',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2662 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2663 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2664 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2665 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2666 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2667 | <code>                directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2668 | <code>                nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2669 | <code>                agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2670 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2671 | <code>                confirmationPolicy: 'auto'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2672 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2673 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2675 | <code>        assert.equal(result.body.ok, true, JSON.stringify(result.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2676 | <code>        assert.equal(llmServer.calls.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2677 | <code>        assert.equal(llmServer.calls[2].payload.tool_choice, 'none');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2678 | <code>        assert.deepEqual(llmServer.calls[2].payload.tools &#124;&#124; [], []);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2679 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2680 | <code>            result.body.events.filter((event) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2681 | <code>                event.type === 'runtime_note' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2682 | <code>                event.status === 'invalid_decision_observation'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2683 | <code>            ).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2684 | <code>            2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2685 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2686 | <code>        assert.ok(result.body.events.some((event) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2687 | <code>            event.type === 'runtime_note' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2688 | <code>            event.status === 'safety_finalization' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2689 | <code>            event.reason === 'repeated_invalid_native_tool_call'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2690 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2691 | <code>        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /required&#124;path&#124;content/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2692 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2693 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2694 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2695 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2696 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2697 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2699 | <code>test('Agentic Executor keeps deprecated task layers out of the model prompt', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2700 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-model-input-turn-prompt-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2701 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2702 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2703 | <code>        intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2704 | <code>        summary: '给论文做概要分析',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2705 | <code>        action: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2706 | <code>        blocked_reason: '我现在还没有读取到论文原文，所以不能把概要说成已经完成。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2707 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2708 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2709 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2710 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2711 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2712 | <code>        model: 'mock-evidence-gate-agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2713 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2714 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2715 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2716 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2717 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2718 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2719 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2720 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2721 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2723 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2724 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2725 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2726 | <code>            sessionId: 'model-input-turn-prompt-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2727 | <code>            message: '读一下这篇论文《Generative Agents: Interactive Simulacra of Human Behavior》，给我一个概要分析。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2728 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2729 | <code>            maxAgentSteps: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2730 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2731 | <code>            memoryContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2732 | <code>                memory_context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2733 | <code>                    current_dialogue: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2734 | <code>                        type: 'research_reading'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2735 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2736 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2737 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2738 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2739 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2740 | <code>                memoryContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2741 | <code>                    memory_context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2742 | <code>                        current_dialogue: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2743 | <code>                            type: 'research_reading'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2744 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2745 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2746 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2747 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2748 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2750 | <code>        assert.equal(result.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2751 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2752 | <code>        assert.equal(result.body.taskSpec, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2753 | <code>        assert.equal(result.body.evidenceLedger, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2754 | <code>        assert.equal(result.body.taskGraph, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2755 | <code>        assert.match(result.body.displayText, /没有读取到论文原文&#124;不能把概要说成已经完成/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2756 | <code>        assert.equal(result.body.surface.renderer, 'ailis-persona-renderer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2757 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2758 | <code>        const llmUserPayload = parseModelContextPayload(llmServer.calls[0]);</code> | 声明局部标识符 `llmUserPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2759 | <code>        assert.equal(llmUserPayload.task_brief, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2760 | <code>        assert.equal(llmUserPayload.task_spec, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2761 | <code>        assert.equal(llmUserPayload.evidence_ledger, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2762 | <code>        assert.equal(llmUserPayload.task_graph, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2763 | <code>        assert.equal(llmUserPayload.recent_turn_items, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2764 | <code>        assert.equal(llmUserPayload.runtime_diagnostics, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2765 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /task_brief&#124;TaskSpec&#124;Evidence Ledger&#124;Task Graph/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2766 | <code>        assert.match(llmServer.calls[0].system, /ResponseItem objects/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2767 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /runtime_diagnostics/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2768 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2769 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2770 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2771 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2772 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2774 | <code>test('Agentic Executor keeps generic official-doc tasks on the AILIS model-input path', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2775 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-generic-doc-prompt-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2776 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2777 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2778 | <code>        intent: 'browser_documentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2779 | <code>        summary: '需要先查官方文档',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2780 | <code>        action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2781 | <code>        final_answer: '我会先查官方文档，再写 browser-wait-example.md。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2782 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2783 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2784 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2785 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2786 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2787 | <code>        model: 'mock-generic-doc-prompt-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2788 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2789 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2790 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2791 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2792 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2793 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2794 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2795 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2796 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2797 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2798 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2799 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2800 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2801 | <code>            sessionId: 'generic-doc-prompt-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2802 | <code>            message: 'AILIS，帮我查一下 Playwright 里如何等待元素出现，然后给我写一个最小可运行的 JS 示例，保存成 browser-wait-example.md。要求说明 timeout 怎么设置',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2803 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2804 | <code>            maxAgentSteps: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2805 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2806 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2807 | <code>                workspace: workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2808 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2809 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2811 | <code>        assert.equal(result.body.taskSpec, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2812 | <code>        assert.equal(result.body.evidenceLedger, undefined);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2813 | <code>        assert.equal(result.body.taskGraph, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2814 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2815 | <code>        const llmUserPayload = parseModelContextPayload(llmServer.calls[0]);</code> | 声明局部标识符 `llmUserPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2816 | <code>        assert.equal(llmUserPayload.task_brief, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2817 | <code>        assert.equal(llmUserPayload.recent_turn_items, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2818 | <code>        assert.match(llmServer.calls[0].system, /Responses-Compatible Tool Runtime/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2819 | <code>        assert.equal(llmUserPayload.capability_catalog, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2820 | <code>        const exposedToolNames = (llmServer.calls[0].payload.tools &#124;&#124; []).map((tool) =&gt; tool.function?.name &#124;&#124; tool.name);</code> | 声明局部标识符 `exposedToolNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2821 | <code>        assert.ok(exposedToolNames.includes('tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2822 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2823 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2824 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2825 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2826 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2827 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2828 | <code>test('Agentic Executor feeds tool results back through Responses model input items', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2829 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-evidence-recovery-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2830 | <code>    await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2831 | <code>        path.join(workspaceRoot, 'paper.md'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2832 | <code>        'Generative Agents paper notes: memory stream, reflection, planning, and retrieval are the main pieces.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2833 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2834 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2835 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2836 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2837 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2838 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2839 | <code>                intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2840 | <code>                summary: '查找本地文件读取能力',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2841 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2842 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2843 | <code>                    tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2844 | <code>                    title: '查找文件读取工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2845 | <code>                    args: { query: 'read local markdown file' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2846 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2847 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2848 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2849 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2850 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2851 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2852 | <code>                intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2853 | <code>                summary: '补齐论文资料证据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2854 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2855 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2856 | <code>                    tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2857 | <code>                    title: '读取论文资料',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2858 | <code>                    args: { path: 'paper.md' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2859 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2860 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2861 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2862 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2863 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2864 | <code>            intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2865 | <code>            summary: '基于读取证据总结',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2866 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2867 | <code>            final_answer: '我这次是基于读到的 paper.md 来说：它主要围绕 memory stream、reflection、planning 和 retrieval 组织智能体行为。'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2868 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2869 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2870 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2871 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2872 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2873 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2874 | <code>        model: 'mock-evidence-recovery-agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2875 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2876 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2877 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2878 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2879 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2880 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2881 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2882 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2883 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2885 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2886 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2887 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2888 | <code>            sessionId: 'evidence-recovery-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2889 | <code>            message: '读一下 paper.md，给我一个概要分析。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2890 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2891 | <code>            maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2892 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2893 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2894 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2895 | <code>                agentRole: 'task_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2896 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2897 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2898 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2899 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2900 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2901 | <code>        assert.ok(result.body.steps.length &gt;= 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2902 | <code>        assert.match(result.body.displayText, /memory stream&#124;reflection&#124;planning&#124;retrieval/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2903 | <code>        assert.ok(llmServer.calls.length &gt;= 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2904 | <code>        const finalMessages = JSON.stringify(llmServer.calls.at(-1).payload.messages);</code> | 声明局部标识符 `finalMessages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2905 | <code>        assert.match(finalMessages, /tool_calls/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2906 | <code>        assert.match(finalMessages, /tool_call_id/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2907 | <code>        assert.match(finalMessages, /memory stream&#124;reflection&#124;planning&#124;retrieval/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2908 | <code>        assert.doesNotMatch(finalMessages, /runtime_diagnostics/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2909 | <code>        const transcript = await gateway.runtime.readTranscript(result.body.runId, 100);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2910 | <code>        const snapshots = transcript.items.filter((item) =&gt; item.type === 'agent.context_snapshot');</code> | 声明局部标识符 `snapshots`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2911 | <code>        assert.equal(snapshots.length, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2912 | <code>        assert.equal(snapshots[0].payload.model_input_request.stats.context_history_items, 3);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2913 | <code>        assert.equal(snapshots[1].payload.model_input_request.stats.context_history_items, 5);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2914 | <code>        assert.equal(snapshots[2].payload.model_input_request.stats.context_history_items, 7);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2915 | <code>        assert.equal(snapshots[0].payload.context_manager_checkpoint?.items.length, 3);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2916 | <code>        assert.equal(snapshots[1].payload.context_manager_checkpoint?.items.length, 5);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2917 | <code>        assert.equal(snapshots[2].payload.context_manager_checkpoint?.items.length, 7);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2918 | <code>        assert.equal(snapshots[0].payload.context_manager_checkpoint.items[0].role, 'developer');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2919 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2920 | <code>            snapshots[2].payload.context_manager_checkpoint.items.map((item) =&gt; item.type).slice(-2),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2921 | <code>            ['function_call', 'function_call_output']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2922 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2923 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2924 | <code>            snapshots[2].payload.model_input_request.input.map((item) =&gt; item.type).slice(-2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2925 | <code>            ['function_call', 'function_call_output']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2926 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2927 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2928 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2929 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2930 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2931 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2932 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2933 | <code>test('Agentic Executor allows zero-observation final answers without evidence warnings', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2934 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-final-deferral-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2935 | <code>    await fs.writeFile(path.join(workspaceRoot, 'paper.md'), 'Observed paper evidence from a local file.', 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2936 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2937 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2938 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2939 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2940 | <code>                intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2941 | <code>                summary: '直接总结论文',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2942 | <code>                action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2943 | <code>                final_answer: '我已经读完并总结好了。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2944 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2945 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2946 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2947 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2948 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2949 | <code>                intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2950 | <code>                summary: '先读取证据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2951 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2952 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2953 | <code>                    tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2954 | <code>                    title: '读取论文证据',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2955 | <code>                    args: { action: 'read', path: 'paper.md' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2956 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2957 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2958 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2959 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2960 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2961 | <code>            intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2962 | <code>            summary: '基于证据总结',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2963 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2964 | <code>            final_answer: '基于读取到的 paper.md 证据，可以继续写概要。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2965 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2966 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2967 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2968 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2969 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2970 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 2971 | <code>        model: 'mock-final-deferral-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2972 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2973 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2974 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2975 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2976 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2977 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2978 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2979 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2980 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2981 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2982 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 2983 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2984 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2985 | <code>            sessionId: 'final-deferral-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2986 | <code>            message: '读一下 paper.md，给我一个概要分析。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2987 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2988 | <code>            maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2989 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2990 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2991 | <code>                workspace: workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2992 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2993 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2994 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2995 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2996 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2997 | <code>        assert.equal(llmServer.calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2998 | <code>        assert.equal(result.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 2999 | <code>        assert.equal(result.body.events.some((event) =&gt; event.status === 'final_without_observation_warning'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3000 | <code>        assert.match(result.body.displayText, /我已经读完并总结好了/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3001 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3002 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3003 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3004 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3005 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3006 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3007 | <code>test('Agentic Executor marks evidence-required zero-tool finals incomplete', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3008 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-required-execution-evidence-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3009 | <code>    const llmServer = await createScriptedChatCompletionsServer(() =&gt; ({</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3010 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3011 | <code>        intent: 'create_reminder',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3012 | <code>        summary: '提醒已经创建',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3013 | <code>        action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3014 | <code>        final_answer: 'The reminder was created.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3015 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3016 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3017 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3018 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3019 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3020 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3021 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3022 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3023 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3024 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3025 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3026 | <code>            sessionId: 'required-execution-evidence-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3027 | <code>            message: 'Remind me tomorrow at 5 PM.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3028 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3029 | <code>            maxAgentSteps: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3030 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3031 | <code>                provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3032 | <code>                baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3033 | <code>                apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3034 | <code>                model: 'mock-required-execution-evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3035 | <code>                temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3036 | <code>                timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3037 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3038 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3039 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3040 | <code>                agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3041 | <code>                requireExecutionEvidence: true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3042 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3043 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3044 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3045 | <code>        assert.equal(result.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3046 | <code>        assert.equal(result.body.status, 'incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3047 | <code>        assert.equal(result.body.executionRequired, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3048 | <code>        assert.equal(result.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3049 | <code>        assert.equal(result.body.taskRunHandoff.status, 'incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3050 | <code>        assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3051 | <code>            result.body.taskRunHandoff.unresolvedFields,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3052 | <code>            ['No successful task-execution tool call was recorded.']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3053 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3054 | <code>        assert.match(llmServer.calls[0].system, /explicit execution-evidence contract/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3055 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3056 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3057 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3058 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3059 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3060 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3061 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3062 | <code>test('Agentic Executor treats missing command failures as observations for the next decision', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3063 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-failure-observation-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3064 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3065 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3066 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3067 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3068 | <code>                intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3069 | <code>                summary: '尝试用外部解析器读取页面',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3070 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3071 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3072 | <code>                    tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3073 | <code>                    title: '尝试外部 HTML 解析器',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3074 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3075 | <code>                        cmd: '__ailis_missing_parser_tool__ --version',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3076 | <code>                        reason: '模拟一个缺失的解析依赖'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3077 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3078 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3079 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3080 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3081 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3082 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3083 | <code>            intent: 'research_reading',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3084 | <code>            summary: '外部解析器不可用，换稳定路径',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3085 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3086 | <code>            final_answer: '这个外部解析器不可用。下一步应该换成内置 web/pdf 读取工具，而不是卡在这一步。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3087 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3088 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3089 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3090 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3091 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3092 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3093 | <code>        model: 'mock-tool-failure-observation-agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3094 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3095 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3096 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3097 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3098 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3099 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3100 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3101 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3102 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3104 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3105 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3106 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3107 | <code>            sessionId: 'tool-failure-observation-test',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3108 | <code>            message: '读一下 https://arxiv.org/abs/1706.03762，先拿页面证据。',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 3109 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3110 | <code>            maxAgentSteps: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3111 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3112 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3113 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3114 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3115 | <code>                confirmationPolicy: 'auto'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3116 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3117 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3119 | <code>        assert.equal(llmServer.calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3120 | <code>        assert.match(result.body.displayText, /外部解析器不可用&#124;换成内置/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3121 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3122 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3123 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3124 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3125 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3127 | <code>test('Agentic Executor loads email skill on model request and normalizes new-mail actions', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3128 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-agent-skill-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3129 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3130 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3131 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3132 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3133 | <code>                intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3134 | <code>                summary: '需要邮箱能力',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3135 | <code>                action: 'load_context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3136 | <code>                capability_request: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3137 | <code>                    skills: ['email'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3138 | <code>                    tools: ['email'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3139 | <code>                    mcp: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3140 | <code>                    reason: '需要检查新邮件'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3141 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3142 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3143 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3144 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3145 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3146 | <code>            intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3147 | <code>            summary: '检查新邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3148 | <code>            action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3149 | <code>            tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3150 | <code>                tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3151 | <code>                title: '检查新邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3152 | <code>                args: { action: 'check_new' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3153 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3154 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3155 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3156 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3157 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3158 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3159 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3160 | <code>        model: 'mock-email-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3161 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3162 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3163 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3164 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3165 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3166 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3167 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3168 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3169 | <code>        emailProfiles: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3170 | <code>            qq: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3171 | <code>                account: 'saved@qq.com',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3172 | <code>                secret: 'secret-for-test'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3173 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3174 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3175 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3177 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3178 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3179 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3180 | <code>            sessionId: 'email-agent-skill-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3181 | <code>            message: '你好，帮我检查一下邮件有没有新的',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3182 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3183 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3184 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3185 | <code>            context: { workspace: workspaceRoot }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3186 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3188 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3189 | <code>        assert.equal(result.body.status, 'planned');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3190 | <code>        assert.equal(result.body.plan[0].tool, 'tool_search');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3191 | <code>        assert.match(result.body.plan[0].args.query, /email&#124;邮件/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3192 | <code>        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3193 | <code>        assert.doesNotMatch(JSON.stringify(llmServer.calls[0].payload.messages), /capability_catalog/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3194 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3195 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3196 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3197 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3198 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3199 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3200 | <code>test('Agentic Executor email loop observes mailbox results before final answer', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3201 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-agent-loop-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3202 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3203 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3204 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3205 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3206 | <code>                intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3207 | <code>                summary: '发现邮箱工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3208 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3209 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3210 | <code>                    tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3211 | <code>                    title: '查找邮箱工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3212 | <code>                    args: { query: 'email unread inbox' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3213 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3214 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3215 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3216 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3217 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3218 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3219 | <code>                intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3220 | <code>                summary: '检查未读邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3221 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3222 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3223 | <code>                    tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3224 | <code>                    title: '检查未读邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3225 | <code>                    args: { action: 'list', filter: 'unread', limit: 10 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3226 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3227 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3228 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3229 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3230 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3231 | <code>            intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3232 | <code>            summary: '已检查未读邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3233 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3234 | <code>            final_answer: '我检查过了，目前没有未读新邮件。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3235 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3236 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3237 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3238 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3239 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3240 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3241 | <code>        model: 'mock-email-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3242 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3243 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3244 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3245 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3246 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3247 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3248 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3249 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3250 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3251 | <code>    const emailCalls = [];</code> | 声明局部标识符 `emailCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3253 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3254 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3255 | <code>        const originalCallTool = gateway.callTool.bind(gateway);</code> | 声明局部标识符 `originalCallTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3256 | <code>        gateway.callTool = async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3257 | <code>            if (request.tool === 'email') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3258 | <code>                emailCalls.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3259 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3260 | <code>                    ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3261 | <code>                    callId: 'mock-email-call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3262 | <code>                    tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3263 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3264 | <code>                    durationMs: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3265 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3266 | <code>                        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3267 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3268 | <code>                                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3269 | <code>                                text: '邮件列表：0 封未读新邮件。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3270 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3271 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3272 | <code>                        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3273 | <code>                            messages: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3274 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3275 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3276 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3277 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3278 | <code>            return await originalCallTool(request);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3279 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3281 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3282 | <code>            sessionId: 'email-agent-loop-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3283 | <code>            message: '检查一下我的邮箱有没有新的',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3284 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3285 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3286 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3287 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3288 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3289 | <code>                confirmationPolicy: 'auto'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3290 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3291 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3293 | <code>        assert.equal(result.body.ok, true, result.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3294 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3295 | <code>        assert.equal(emailCalls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3296 | <code>        assert.equal(emailCalls[0].args.action, 'list');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3297 | <code>        assert.equal(emailCalls[0].args.filter, 'unread');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3298 | <code>        assert.match(result.body.displayText, /没有未读新邮件/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3299 | <code>        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /tool_search&#124;email/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3300 | <code>        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /0 封未读新邮件/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3301 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3302 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3303 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3305 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3307 | <code>test('Agentic Executor renders email tool failures through persona surface instead of raw tool text', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3308 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-agent-failure-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3309 | <code>    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) =&gt; {</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3310 | <code>        if (decisionCount === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3311 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3312 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3313 | <code>                intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3314 | <code>                summary: '发现邮箱工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3315 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3316 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3317 | <code>                    tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3318 | <code>                    title: '查找邮箱工具',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3319 | <code>                    args: { query: 'email unread inbox' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3320 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3321 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3322 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3323 | <code>        if (decisionCount === 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3324 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3325 | <code>                mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3326 | <code>                intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3327 | <code>                summary: '检查未读邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3328 | <code>                action: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3329 | <code>                tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3330 | <code>                    tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3331 | <code>                    title: '检查未读邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3332 | <code>                    args: { action: 'list', filter: 'unread', limit: 10 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3333 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3334 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3335 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3336 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3337 | <code>            mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3338 | <code>            intent: 'email_management',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3339 | <code>            summary: '邮箱没有配置',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3340 | <code>            action: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3341 | <code>            final_answer: '邮箱账号还没配置好，所以这次没法读取新邮件。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3342 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3343 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3344 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3345 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3346 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3347 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3348 | <code>        model: 'mock-email-failure-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3349 | <code>        temperature: 0.1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3350 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3351 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3352 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3353 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3354 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3355 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3356 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3357 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3358 | <code>    const emailCalls = [];</code> | 声明局部标识符 `emailCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3360 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3361 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3362 | <code>        const originalCallTool = gateway.callTool.bind(gateway);</code> | 声明局部标识符 `originalCallTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3363 | <code>        gateway.callTool = async (request) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3364 | <code>            if (request.tool === 'email') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3365 | <code>                emailCalls.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3366 | <code>                return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3367 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3368 | <code>                    callId: 'mock-email-needs-config',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3369 | <code>                    tool: 'email',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3370 | <code>                    status: 'needs_config',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3371 | <code>                    durationMs: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3372 | <code>                    error: 'email 工具需要 account/email 参数，或设置 AILIS_EMAIL_&lt;PROVIDER&gt;_ACCOUNT。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3373 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3374 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3375 | <code>            return await originalCallTool(request);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3376 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3378 | <code>        const result = await runAgent(status.url, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3379 | <code>            sessionId: 'email-agent-failure-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3380 | <code>            message: '帮我看看有没有 GitHub 的新邮件',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3381 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3382 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3383 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3384 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3385 | <code>                approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3386 | <code>                confirmationPolicy: 'auto'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3387 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3388 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3390 | <code>        assert.equal(result.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3391 | <code>        assert.equal(result.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3392 | <code>        assert.equal(emailCalls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3393 | <code>        assert.match(result.body.displayText, /邮箱账号还没配置/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3394 | <code>        assert.doesNotMatch(result.body.displayText, /AILIS_EMAIL&#124;&lt;PROVIDER&gt;&#124;tool_call&#124;raw observation/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3395 | <code>        assert.doesNotMatch(result.body.speechText, /AILIS_EMAIL&#124;&lt;PROVIDER&gt;&#124;tool_call&#124;raw observation/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3396 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3397 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3398 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-llm-planner 的契约与回归行为。”这一文件职责。 |
| 3399 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3400 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
