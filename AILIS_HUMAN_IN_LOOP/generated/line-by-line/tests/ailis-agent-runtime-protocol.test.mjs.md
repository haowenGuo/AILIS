# tests/ailis-agent-runtime-protocol.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：303
- SHA-256：`a27124169d15c0b8eb863bc1760619a5a2b60e552a25b6c193c22b3bce568b8d`
- 可运行副本：[打开源文件](../../../source/tests/ailis-agent-runtime-protocol.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`../electron/ailis-response-model.cjs`、`../electron/ailis-agent-object-model.cjs`、`../electron/ailis-agent-runtime-protocol.cjs`、`../electron/ailis-turn-context.cjs`、`../electron/ailis-tool-executor.cjs`
- 主要符号：`require`、`functionCall`、`toolSearchCall`、`customCall`、`localShellCall`、`serverToolSearchOutput`、`serverToolSearchCall`、`invalidFunctionCall`、`result`、`metadata`、`event`、`turnContext`、`context`、`events`、`calls`、`gateway`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    ResponseItem</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 9 | <code>} = require('../electron/ailis-response-model.cjs');</code> | 导入依赖 `../electron/ailis-response-model.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    toolOutputToRuntimeEvent</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 12 | <code>} = require('../electron/ailis-agent-object-model.cjs');</code> | 导入依赖 `../electron/ailis-agent-object-model.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    RUNTIME_LAYER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    inferRuntimeLayer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    modelVisibleResponseItemTypes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    normalizeRuntimeEvent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    responseItemProtocolRole,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    runtimeEventMetadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    validateSupportedResponseItem</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 21 | <code>} = require('../electron/ailis-agent-runtime-protocol.cjs');</code> | 导入依赖 `../electron/ailis-agent-runtime-protocol.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 22 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    buildAilisTurnContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    buildToolContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 25 | <code>} = require('../electron/ailis-turn-context.cjs');</code> | 导入依赖 `../electron/ailis-turn-context.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 26 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    executeToolStep</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 28 | <code>} = require('../electron/ailis-tool-executor.cjs');</code> | 导入依赖 `../electron/ailis-tool-executor.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>test('AILIS runtime protocol validates the Codex-like ResponseItem subset', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    const functionCall = ResponseItem.functionCall({</code> | 声明局部标识符 `functionCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 32 | <code>        name: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 33 | <code>        arguments: { action: 'inspect' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 34 | <code>        call_id: 'call_1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>    const toolSearchCall = ResponseItem.toolSearchCall({</code> | 声明局部标识符 `toolSearchCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 37 | <code>        call_id: 'search_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        arguments: { query: 'xlsx reader' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    const customCall = ResponseItem.customToolCall({</code> | 声明局部标识符 `customCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 41 | <code>        call_id: 'custom_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 42 | <code>        name: 'shell_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 43 | <code>        input: 'apply patch'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>    const localShellCall = ResponseItem.localShellCall({</code> | 声明局部标识符 `localShellCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 46 | <code>        call_id: 'shell_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 47 | <code>        action: { command: 'echo ok' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 48 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>    const serverToolSearchOutput = {</code> | 声明局部标识符 `serverToolSearchOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        type: 'tool_search_output',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        call_id: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        execution: 'server',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        tools: [{ name: 'artifact_tools' }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    const serverToolSearchCall = ResponseItem.toolSearchCall({</code> | 声明局部标识符 `serverToolSearchCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 57 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        execution: 'server',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 59 | <code>        arguments: { query: 'artifact_tools' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>    for (const item of [functionCall, toolSearchCall, customCall, localShellCall, serverToolSearchCall, serverToolSearchOutput]) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 63 | <code>        assert.equal(validateSupportedResponseItem(item).ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>    assert.equal(responseItemProtocolRole(functionCall), 'tool_call');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 67 | <code>    assert.equal(responseItemProtocolRole(serverToolSearchOutput), 'tool_output');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 68 | <code>    assert.ok(modelVisibleResponseItemTypes().includes('function_call_output'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 69 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>test('AILIS runtime protocol rejects malformed executable ResponseItems', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 72 | <code>    const invalidFunctionCall = {</code> | 声明局部标识符 `invalidFunctionCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        type: 'function_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        name: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        arguments: { action: 'inspect' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 76 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    const result = validateSupportedResponseItem(invalidFunctionCall);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>    assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 80 | <code>    assert.match(result.errors.join('\n'), /call_id is required/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 81 | <code>    assert.match(result.errors.join('\n'), /arguments must be a JSON string/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 82 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>test('AILIS runtime protocol classifies events into runtime layers', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 85 | <code>    assert.equal(inferRuntimeLayer('agent.context_snapshot'), RUNTIME_LAYER.MODEL_INPUT);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    assert.equal(inferRuntimeLayer('tool_result'), RUNTIME_LAYER.TOOL_EXECUTOR);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 87 | <code>    assert.equal(inferRuntimeLayer('approval.requested'), RUNTIME_LAYER.APPROVAL_INTERRUPT);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 88 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 89 | <code>    const metadata = runtimeEventMetadata({</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 90 | <code>        type: 'agent.context_snapshot',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        payload: { runId: 'run_1', iteration: 2, status: 'captured' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>    assert.equal(metadata.schema, 'ailis.runtime_event.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 95 | <code>    assert.equal(metadata.protocol, 'ailis.agent_runtime_protocol.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    assert.equal(metadata.layer, RUNTIME_LAYER.MODEL_INPUT);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    assert.equal(metadata.category, 'context');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 98 | <code>    assert.equal(metadata.runId, 'run_1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 99 | <code>    assert.equal(metadata.iteration, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 100 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>test('tool output runtime events carry protocol metadata without losing old fields', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const event = toolOutputToRuntimeEvent({</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        callId: 'call_tool_1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        sourceId: 'step_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 106 | <code>        title: 'Read workbook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        toolName: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        args: { action: 'query' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 111 | <code>        outputPreview: 'range missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 112 | <code>        errorSummary: 'No sheet named Sheet1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 113 | <code>        durationMs: 42</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 114 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    assert.equal(event.schema, 'ailis.runtime_event.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 117 | <code>    assert.equal(event.protocol, 'ailis.agent_runtime_protocol.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 118 | <code>    assert.equal(event.layer, RUNTIME_LAYER.TOOL_EXECUTOR);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 119 | <code>    assert.equal(event.category, 'tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    assert.equal(event.severity, 'error');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 121 | <code>    assert.equal(event.type, 'tool_result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 122 | <code>    assert.equal(event.callId, 'call_tool_1');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 123 | <code>    assert.equal(event.preview, 'range missing');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 124 | <code>    assert.equal(event.errorSummary, 'No sheet named Sheet1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 125 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>test('normalizeRuntimeEvent keeps existing event payload while adding protocol metadata', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 128 | <code>    const event = normalizeRuntimeEvent({</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 129 | <code>        type: 'agent.step.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 130 | <code>        payload: { marker: 'done' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 131 | <code>        status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>    assert.equal(event.schema, 'ailis.runtime_event.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    assert.equal(event.protocol, 'ailis.agent_runtime_protocol.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 136 | <code>    assert.equal(event.payload.marker, 'done');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    assert.equal(event.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 138 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>test('TurnContext builds the per-turn runtime envelope without leaking provider secrets', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 141 | <code>    const turnContext = buildAilisTurnContext({</code> | 声明局部标识符 `turnContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 142 | <code>        runId: 'run_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        sessionId: 'session_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 144 | <code>        message: 'read the workbook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        request: { maxAgentSteps: 3 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        requestContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 147 | <code>            workspace: 'F:/workspace',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 149 | <code>            permissionProfile: 'workspace-write'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 150 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>        workspaceRoot: 'F:/fallback',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        runtimeEnvironment: { family: 'windows', default_shell: 'powershell' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        modelSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 154 | <code>            provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 155 | <code>            model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 156 | <code>            baseUrl: 'https://api.deepseek.com',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 157 | <code>            apiKey: 'secret-key'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 158 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>        tools: [{ name: 'artifact_tools' }, { type: 'function', name: 'exec' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 160 | <code>        memoryContext: 'known user preference',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 161 | <code>        fileAttachments: [{ path: 'F:/workspace/task.xlsx', name: 'task.xlsx' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        iteration: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 163 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>    assert.equal(turnContext.schema, 'ailis.turn_context.v1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 166 | <code>    assert.equal(turnContext.workspace, 'F:/workspace');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 167 | <code>    assert.equal(turnContext.permissions.approved, true);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 168 | <code>    assert.equal(turnContext.runtimeEnvironment.family, 'windows');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 169 | <code>    assert.deepEqual(turnContext.tools.map((tool) =&gt; tool.name), ['artifact_tools', 'exec']);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 170 | <code>    assert.equal(turnContext.memory.hasContext, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 171 | <code>    assert.equal(turnContext.model.provider, 'deepseek');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 172 | <code>    assert.equal(Object.hasOwn(turnContext.model, 'apiKey'), false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 173 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>test('ToolContext keeps approval and sandbox policy in one reusable object', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 176 | <code>    const context = buildToolContext({</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 177 | <code>        workspace: 'F:/repo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 178 | <code>        sessionKey: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 179 | <code>        runId: 'persona_run_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 180 | <code>        sessionId: 'persona_session_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 181 | <code>        agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 182 | <code>        contextMode: 'persona',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 183 | <code>        agent_path: '/root',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 184 | <code>        approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 185 | <code>        allowOutsideWorkspace: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 186 | <code>        permissionProfile: 'full-access',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 187 | <code>        answerOnly: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 188 | <code>        exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 189 | <code>        directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 190 | <code>        nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 191 | <code>        directToolLimit: 35,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 192 | <code>        requireTaskExecution: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 193 | <code>        requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 194 | <code>        desktopRealEval: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        desktopRealEvalTaskId: 'toolsandbox-scenario-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 196 | <code>        desktopRealEvalTaskText: 'Run the official scenario.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        benchmarkName: 'Apple ToolSandbox',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        benchmarkScenario: 'toolsandbox-scenario-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 199 | <code>        runtimeEnvironmentOverride: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 200 | <code>            source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 201 | <code>            current_date: '2026-07-17'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 202 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>        executionProfile: { kind: 'exact_answer_eval' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        evaluationTaskId: 'gaia-task-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        evaluationName: 'gaia_desktop_real',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 206 | <code>        memoryPolicy: 'disabled',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 207 | <code>        timeoutMs: 1234</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 208 | <code>    }, 'F:/fallback', 'session_1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>    assert.equal(context.workspace, 'F:/repo');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 211 | <code>    assert.equal(context.sessionKey, 'main');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 212 | <code>    assert.equal(context.runId, 'persona_run_1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    assert.equal(context.sessionId, 'persona_session_1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 214 | <code>    assert.equal(context.agentRole, 'persona_orchestrator');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 215 | <code>    assert.equal(context.contextMode, 'persona');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 216 | <code>    assert.equal(context.agent_path, '/root');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 217 | <code>    assert.equal(context.approved, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 218 | <code>    assert.equal(context.allowOutsideWorkspace, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 219 | <code>    assert.equal(context.permissionProfile, 'full-access');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 220 | <code>    assert.equal(context.answerOnly, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 221 | <code>    assert.equal(context.exactAnswerMode, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 222 | <code>    assert.equal(context.directToolExecutor, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 223 | <code>    assert.equal(context.nativeDirectTools, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 224 | <code>    assert.equal(context.directToolLimit, 35);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 225 | <code>    assert.equal(context.requireTaskExecution, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 226 | <code>    assert.equal(context.requireExecutionEvidence, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 227 | <code>    assert.equal(context.desktopRealEval, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 228 | <code>    assert.equal(context.desktopRealEvalTaskId, 'toolsandbox-scenario-1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 229 | <code>    assert.equal(context.desktopRealEvalTaskText, 'Run the official scenario.');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 230 | <code>    assert.equal(context.benchmarkName, 'Apple ToolSandbox');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 231 | <code>    assert.equal(context.benchmarkScenario, 'toolsandbox-scenario-1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 232 | <code>    assert.deepEqual(context.runtimeEnvironmentOverride, {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        source: 'toolsandbox_benchmark_clock',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        current_date: '2026-07-17'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 235 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>    assert.deepEqual(context.executionProfile, { kind: 'exact_answer_eval' });</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 237 | <code>    assert.equal(context.evaluationTaskId, 'gaia-task-1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 238 | <code>    assert.equal(context.evaluationName, 'gaia_desktop_real');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 239 | <code>    assert.equal(context.memoryPolicy, 'disabled');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 240 | <code>    assert.equal(context.timeoutMs, 1234);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 241 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>test('ToolExecutor executes one step and lets AgentRunner decorate the result', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 244 | <code>    const events = [];</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 245 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 246 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 247 | <code>        emitGatewayEvent(type, payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 248 | <code>            events.push({ type, payload });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 249 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>        async callTool(request) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            calls.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 253 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 254 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 255 | <code>                result: { content: [{ type: 'text', text: 'ok' }] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 256 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>    const result = await executeToolStep({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 261 | <code>        gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 262 | <code>        runId: 'run_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 263 | <code>        sessionId: 'session_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 264 | <code>        step: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 265 | <code>            id: 'step_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 266 | <code>            title: 'Read file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 267 | <code>            tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 268 | <code>            args: { path: 'task.txt' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>        toolContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 271 | <code>            workspace: 'F:/repo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 272 | <code>            sessionKey: 'session_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 273 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 274 | <code>            timeoutMs: 90000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 275 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>        request: { timeoutMs: 5000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 277 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        planner: 'llm-agentic-executor',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 279 | <code>        decorateStepResult(stepResult) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 281 | <code>                ...stepResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 282 | <code>                evidenceArtifacts: [{ id: 'ev_1' }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 283 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>        finishedPayload(stepResult) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 286 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>                evidenceRefs: stepResult.evidenceArtifacts.map((artifact) =&gt; artifact.id)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 288 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>    assert.equal(result.response.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    assert.deepEqual(result.evidenceArtifacts, [{ id: 'ev_1' }]);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 294 | <code>    assert.equal(calls.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 295 | <code>    assert.equal(calls[0].tool, 'read');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 296 | <code>    assert.equal(calls[0].timeoutMs, 5000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 297 | <code>    assert.equal(calls[0].context.timeoutMs, 90000);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 298 | <code>    assert.equal(calls[0].context.runId, 'run_1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 299 | <code>    assert.equal(calls[0].context.sessionId, 'session_1');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 300 | <code>    assert.equal(calls[0].context.iteration, 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 301 | <code>    assert.deepEqual(events.map((event) =&gt; event.type), ['agent.step.started', 'agent.step.finished']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 302 | <code>    assert.deepEqual(events[1].payload.evidenceRefs, ['ev_1']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-runtime-protocol 的契约与回归行为。”这一文件职责。 |
| 303 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
