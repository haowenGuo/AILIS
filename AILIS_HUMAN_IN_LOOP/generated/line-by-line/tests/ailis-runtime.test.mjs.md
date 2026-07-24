# tests/ailis-runtime.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-runtime 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：1080
- SHA-256：`5264f6d69a9f36dba186be16125ff402bf824e3bdacb65be46006120b747531f`
- 可运行副本：[打开源文件](../../../source/tests/ailis-runtime.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-runtime.cjs`、`../electron/ailis-gateway.cjs`、`../electron/ailis-agent-control.cjs`、`../electron/ailis-prompt-model.cjs`、`../electron/ailis-response-model.cjs`、`readline`
- 主要符号：`require`、`jsonFetch`、`response`、`body`、`callTool`、`childPath`、`status`、`notification`、`communication`、`item`、`queue`、`context`、`waiting`、`workspaceRoot`、`auditDir`、`runtime`、`runId`、`guarded`、`guardedWorkbenchRead`、`sourceLines`、`guardedSourceViewport`、`guardedLines`、`completed`、`transcript`、`sessionId`、`replacementHistory`、`compactedItem`、`written`、`compaction`、`turnContext`、`gateway`、`baseUrl`、`tools`、`plan`、`blocked`、`blockedByFileSystemField`、`permissionRequest`、`granted`、`grantedWrite`、`patch`、`intercepted`、`serverPath`、`readline`、`rl`、`send`、`call`、`directCall`、`searched`、`aliasCall`、`topLevelArgCall`、`resource`、`http`、`requests`、`server`、`request`、`address`、`invalidCall`、`health`、`prompts`、`prompt`、`mcpConfigPath`、`registered`、`listed`、`childContexts`、`spawned`、`waited`、`mailbox`、`contexts`、`checkpoint`、`stableId`、`tasks`、`duplicate`、`rendered`、`gate`、`sessionA`、`sessionB`、`agent`、`proposal`、`analyzed`、`classification`、`apply`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 9 | <code>const { AILISRuntime } = require('../electron/ailis-runtime.cjs');</code> | 导入依赖 `../electron/ailis-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    AgentPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    AgentStatus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    InputQueue,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    InterAgentCommunication,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    SubagentNotification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 17 | <code>} = require('../electron/ailis-agent-control.cjs');</code> | 导入依赖 `../electron/ailis-agent-control.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 18 | <code>const { CompactedItem } = require('../electron/ailis-prompt-model.cjs');</code> | 导入依赖 `../electron/ailis-prompt-model.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 19 | <code>const { ResponseItem } = require('../electron/ailis-response-model.cjs');</code> | 导入依赖 `../electron/ailis-response-model.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 23 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 24 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 25 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 26 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 31 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 33 | <code>async function callTool(baseUrl, payload) {</code> | 定义函数 `callTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    return await jsonFetch(`${baseUrl}/tools/call`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 35 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 36 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>test('AILIS agent protocol mirrors Codex mailbox and status object shapes', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    const childPath = new AgentPath('/root/mavuika_guide');</code> | 声明局部标识符 `childPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    const status = AgentStatus.Completed('verified answer');</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    const notification = new SubagentNotification(childPath, status).render();</code> | 声明局部标识符 `notification`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    assert.equal(childPath.parent().toString(), '/root');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 45 | <code>    assert.match(notification, /^&lt;subagent_notification&gt;/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    assert.match(notification, /"agent_path":"\/root\/mavuika_guide"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    assert.match(notification, /"completed":"verified answer"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>    const communication = new InterAgentCommunication({</code> | 声明局部标识符 `communication`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 50 | <code>        author: childPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 51 | <code>        recipient: childPath.parent(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        content: notification</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>    const item = communication.to_response_input_item();</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.equal(item.role, 'assistant');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 56 | <code>    assert.equal(item.phase, 'commentary');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 57 | <code>    assert.match(item.content[0].text, /"author":"\/root\/mavuika_guide"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>    const queue = new InputQueue();</code> | 声明局部标识符 `queue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 60 | <code>    const context = { runId: 'parent-run', sessionId: 'parent-session' };</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 61 | <code>    const waiting = queue.subscribe_mailbox(context, 1000);</code> | 声明局部标识符 `waiting`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 62 | <code>    queue.enqueue_mailbox_communication(context, communication);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.equal(await waiting, true);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 64 | <code>    assert.equal(queue.get_pending_input(context).length, 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 65 | <code>    assert.equal(queue.get_pending_input(context).length, 0);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 66 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>test('AILIS runtime guards tool results and repairs incomplete transcripts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 69 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-direct-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 70 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 72 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 73 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 75 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    const runId = 'runtime-direct-run';</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    const guarded = runtime.guardToolResult(</code> | 声明局部标识符 `guarded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 79 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 80 | <code>            content: [{ type: 'text', text: `${'x'.repeat(13000)}secret` }],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 81 | <code>            details: { status: 'completed', apiKey: 'test-secret' }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 82 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>        { toolId: 'read', callId: 'guard-call', maxTextChars: 128 }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 84 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>    assert.equal(guarded.content[0].truncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    assert.equal(guarded.details.apiKey, '__REDACTED__');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 87 | <code>    assert.equal(guarded.details.guard.tool, 'read');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 88 | <code>    assert.equal(guarded.details.modelVisibleContent.status, 'model_visible_truncated');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 89 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 90 | <code>    const guardedWorkbenchRead = runtime.guardToolResult(</code> | 声明局部标识符 `guardedWorkbenchRead`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 91 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 92 | <code>            content: [{ type: 'text', text: `${'{"row":1}\n'.repeat(2000)}`, originalTextChars: 18000 }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 93 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 94 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 95 | <code>                action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 96 | <code>                path: path.join(workspaceRoot, '.ailis-state', 'workbench', 'run-map', 'inputs', 'matrixRows.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 97 | <code>                bytesRead: 18000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 98 | <code>                size: 18000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 99 | <code>                truncated: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 100 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>        { toolId: 'read', callId: 'guard-workbench-read', maxTextChars: 512 }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>    assert.equal(guardedWorkbenchRead.content[0].modelVisibleTruncated, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 105 | <code>    assert.match(guardedWorkbenchRead.content[0].text, /MODEL_VISIBLE_CONTENT_TRUNCATED/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 106 | <code>    assert.match(guardedWorkbenchRead.content[0].text, /truncationScope=model_visible_tool_result_text/);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 107 | <code>    assert.equal(guardedWorkbenchRead.details.modelVisibleContent.fullFileReadTruncated, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 108 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 109 | <code>        guardedWorkbenchRead.details.modelVisibleContent.semantics.contentTruncatedMeansModelVisibleProjectionTruncation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 111 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>    const sourceLines = Array.from({ length: 60 }, (_, index) =&gt; ({</code> | 声明局部标识符 `sourceLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 114 | <code>        lineno: 330 + index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 115 | <code>        text: index === 22</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 116 | <code>            ? 'Cuba (1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 117 | <code>            : index === 47</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 118 | <code>                ? 'Panama (1)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 119 | <code>                : `country row ${index + 1}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 120 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    const guardedSourceViewport = runtime.guardToolResult(</code> | 声明局部标识符 `guardedSourceViewport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 122 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 123 | <code>            content: [{ type: 'text', text: 'Find results for participating nations' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 124 | <code>            details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 125 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 126 | <code>                sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 127 | <code>                    type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 128 | <code>                    lineStart: 330,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 129 | <code>                    lineEnd: 389,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 130 | <code>                    lines: sourceLines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 131 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>            structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 134 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 135 | <code>                sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 136 | <code>                    type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                    lineStart: 330,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                    lineEnd: 389,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                    lines: sourceLines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 140 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>        { toolId: 'mcp__ailis_research__web_find', callId: 'guard-source-viewport' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 144 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    const guardedLines = guardedSourceViewport.structuredContent.sourceWindow.lines;</code> | 声明局部标识符 `guardedLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 146 | <code>    assert.equal(guardedLines.length, 60);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 147 | <code>    assert.equal(guardedLines[22].text, 'Cuba (1)');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 148 | <code>    assert.equal(guardedLines[47].text, 'Panama (1)');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 149 | <code>    assert.equal(guardedLines.some((line) =&gt; 'omitted_items' in line), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>    await runtime.startRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 153 | <code>        sessionId: 'runtime-direct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 154 | <code>        message: 'repair missing tool result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 155 | <code>        planner: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 156 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    await runtime.appendItem(runId, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 158 | <code>        type: 'tool.call',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 159 | <code>        sessionId: 'runtime-direct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 160 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 161 | <code>            callId: 'missing-result-call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 162 | <code>            tool: 'read',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 163 | <code>            args: { path: 'note.txt' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 164 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>    const completed = await runtime.completeRun(runId, {</code> | 声明局部标识符 `completed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        mode: 'task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 170 | <code>        planner: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 171 | <code>        intent: 'runtime_repair_test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 172 | <code>        displayText: 'done',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        durationMs: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 174 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>    assert.equal(completed.repair.repaired, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>    const transcript = await runtime.readTranscript(runId);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 178 | <code>    assert.equal(transcript.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 179 | <code>    assert.ok(transcript.items.some((item) =&gt; item.type === 'tool.result' &amp;&amp; item.status === 'repaired_missing_result'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 180 | <code>    assert.ok(transcript.items.some((item) =&gt; item.type === 'transcript.repair'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 181 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>test('AILIS runtime persists ContextCompaction rollout items and reference context', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 184 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-compaction-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 185 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 186 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 187 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 188 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 189 | <code>        auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 190 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    const runId = 'runtime-compaction-run';</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 192 | <code>    const sessionId = 'runtime-compaction';</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 193 | <code>    const replacementHistory = [</code> | 声明局部标识符 `replacementHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 194 | <code>        ResponseItem.message({ role: 'user', text: 'current task summary' }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        ResponseItem.message({ role: 'assistant', text: 'Known fact: START=A1.' })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 196 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>    const compactedItem = CompactedItem.create({</code> | 声明局部标识符 `compactedItem`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        message: 'Compacted task state.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 199 | <code>        replacement_history: replacementHistory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>    await runtime.startRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 203 | <code>        runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 204 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 205 | <code>        message: 'compact this run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 206 | <code>        planner: 'test'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 207 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>    const written = await runtime.appendContextCompaction(runId, {</code> | 声明局部标识符 `written`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 210 | <code>        compactedItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        referenceContextItem: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 212 | <code>            cwd: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 213 | <code>            model: 'test-model'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 214 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>        contextManagerCheckpoint: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 216 | <code>            history_version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 217 | <code>            items: replacementHistory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 218 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>        reason: 'test_compaction'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 220 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>    assert.equal(written.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>    const transcript = await runtime.readTranscript(runId);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 225 | <code>    const compaction = transcript.items.find((item) =&gt; item.type === 'agent.context_compaction');</code> | 声明局部标识符 `compaction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 226 | <code>    const turnContext = transcript.items.find((item) =&gt; item.type === 'agent.turn_context');</code> | 声明局部标识符 `turnContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    assert.equal(compaction.status, 'installed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 229 | <code>    assert.equal(compaction.payload.rollout_item.type, 'compacted');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 230 | <code>    assert.deepEqual(compaction.payload.compacted_item.replacement_history, replacementHistory);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 231 | <code>    assert.equal(compaction.payload.context_manager_checkpoint.history_version, 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 232 | <code>    assert.equal(turnContext.status, 'captured');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 233 | <code>    assert.equal(turnContext.payload.rollout_item.type, 'turn_context');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 234 | <code>    assert.equal(turnContext.payload.reference_context_item.model, 'test-model');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 235 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>test('AILIS Gateway exposes runtime tools, update_plan, policy checks, and transcripts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 238 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-gateway-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 239 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 240 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 241 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 242 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 243 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 244 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 247 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 248 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>        const tools = await jsonFetch(`${baseUrl}/tools`);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 251 | <code>        assert.equal(tools.body.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 252 | <code>        assert.ok(tools.body.runtimeTools.some((tool) =&gt; tool.id === 'update_plan'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 253 | <code>        assert.ok(tools.body.coreTools.some((tool) =&gt; tool.id === 'update_plan' &amp;&amp; tool.route === 'ailis-runtime'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>        const plan = await callTool(baseUrl, {</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 256 | <code>            tool: 'update_plan',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 257 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 258 | <code>                explanation: 'runtime acceptance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 259 | <code>                plan: [{ step: 'wire the runtime', status: 'in_progress' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 260 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 262 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 263 | <code>                runId: 'runtime-gateway-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 264 | <code>                sessionKey: 'runtime-gateway',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 265 | <code>                approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 266 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>        assert.equal(plan.body.ok, true, plan.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        assert.equal(plan.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        assert.equal(plan.body.result.details.completion_scope, 'progress_recorded_only');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 271 | <code>        assert.equal(plan.body.result.details.semantic_role, 'progress_ui_only');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 272 | <code>        assert.equal(plan.body.result.details.produces_evidence, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 273 | <code>        assert.equal(plan.body.result.details.task_advanced, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 274 | <code>        assert.match(plan.body.result.content[0].text, /did not inspect files/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 275 | <code>        assert.equal(plan.body.result.details.plan[0].step, 'wire the runtime');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>        const blocked = await callTool(baseUrl, {</code> | 声明局部标识符 `blocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 278 | <code>            tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 279 | <code>            args: { path: 'blocked.txt', content: 'should not write' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 281 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 282 | <code>                permissionProfile: 'read-only'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 283 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>        assert.equal(blocked.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 286 | <code>        assert.equal(blocked.body.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 287 | <code>        await assert.rejects(() =&gt; fs.readFile(path.join(workspaceRoot, 'blocked.txt'), 'utf8'), /ENOENT/);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>        const blockedByFileSystemField = await callTool(baseUrl, {</code> | 声明局部标识符 `blockedByFileSystemField`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 290 | <code>            tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 291 | <code>            args: { path: 'blocked-by-field.txt', content: 'should not write' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 292 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 293 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 294 | <code>                permissionProfile: {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 295 | <code>                    fileSystem: 'read-only',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 296 | <code>                    shell: 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 297 | <code>                    approvalPolicy: 'never'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 298 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>        assert.equal(blockedByFileSystemField.body.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 302 | <code>        assert.equal(blockedByFileSystemField.body.status, 'blocked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 303 | <code>        await assert.rejects(() =&gt; fs.readFile(path.join(workspaceRoot, 'blocked-by-field.txt'), 'utf8'), /ENOENT/);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>        const permissionRequest = await callTool(baseUrl, {</code> | 声明局部标识符 `permissionRequest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 306 | <code>            tool: 'request_permissions',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 307 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 308 | <code>                reason: 'Need to write one acceptance file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 309 | <code>                permissions: {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 310 | <code>                    file_system: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 311 | <code>                        write: ['granted.txt']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 312 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 316 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 317 | <code>                sessionKey: 'runtime-gateway',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 318 | <code>                permissionProfile: 'read-only'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 319 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>        assert.equal(permissionRequest.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 322 | <code>        assert.equal(permissionRequest.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 323 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 324 | <code>        const granted = await callTool(baseUrl, {</code> | 声明局部标识符 `granted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 325 | <code>            tool: 'request_permissions',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 326 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 327 | <code>                reason: 'Need to write one acceptance file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 328 | <code>                permissions: {</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 329 | <code>                    file_system: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 330 | <code>                        write: ['granted.txt']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 331 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 335 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 336 | <code>                sessionKey: 'runtime-gateway',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 337 | <code>                permissionProfile: 'read-only',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 338 | <code>                approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 339 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>        assert.equal(granted.body.ok, true, granted.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 342 | <code>        assert.equal(granted.body.result.details.grant.status, 'granted');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 343 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 344 | <code>        const grantedWrite = await callTool(baseUrl, {</code> | 声明局部标识符 `grantedWrite`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 345 | <code>            tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 346 | <code>            args: { path: 'granted.txt', content: 'permission grant worked' },</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 347 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 348 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 349 | <code>                sessionKey: 'runtime-gateway',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 350 | <code>                permissionProfile: 'read-only'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 351 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>        assert.equal(grantedWrite.body.ok, true, grantedWrite.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 354 | <code>        assert.equal(await fs.readFile(path.join(workspaceRoot, 'granted.txt'), 'utf8'), 'permission grant worked');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>        const patch = await callTool(baseUrl, {</code> | 声明局部标识符 `patch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 357 | <code>            tool: 'apply_patch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 358 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 359 | <code>                input: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 360 | <code>                    '*** Begin Patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 361 | <code>                    '*** Add File: patched.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 362 | <code>                    '+hello patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 363 | <code>                    '*** End Patch'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 364 | <code>                ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 365 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 367 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 368 | <code>                sessionKey: 'runtime-gateway'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 369 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>        assert.equal(patch.body.ok, true, patch.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 372 | <code>        assert.equal(await fs.readFile(path.join(workspaceRoot, 'patched.txt'), 'utf8'), 'hello patch\n');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 373 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 374 | <code>        const intercepted = await callTool(baseUrl, {</code> | 声明局部标识符 `intercepted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 375 | <code>            tool: 'computer',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 376 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 377 | <code>                action: 'exec_command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 378 | <code>                cmd: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 379 | <code>                    'apply_patch &lt;&lt;PATCH',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 380 | <code>                    '*** Begin Patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 381 | <code>                    '*** Add File: intercepted.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 382 | <code>                    '+hello intercept',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 383 | <code>                    '*** End Patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 384 | <code>                    'PATCH'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 385 | <code>                ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 386 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 388 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 389 | <code>                sessionKey: 'runtime-gateway'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 390 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>        assert.equal(intercepted.body.ok, true, intercepted.body.error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 393 | <code>        assert.equal(intercepted.body.result.details.action, 'apply_patch');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 394 | <code>        assert.equal(await fs.readFile(path.join(workspaceRoot, 'intercepted.txt'), 'utf8'), 'hello intercept\n');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>        const transcript = await jsonFetch(`${baseUrl}/transcript?runId=runtime-gateway-run`);</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 397 | <code>        assert.equal(transcript.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 398 | <code>        assert.ok(transcript.body.items.some((item) =&gt; item.type === 'tool.call'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 399 | <code>        assert.ok(transcript.body.items.some((item) =&gt; item.type === 'tool.event' &amp;&amp; item.status === 'begin'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 400 | <code>        assert.ok(transcript.body.items.some((item) =&gt; item.type === 'tool.event' &amp;&amp; ['success', 'failure'].includes(item.status)));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 401 | <code>        assert.ok(transcript.body.items.some((item) =&gt; item.type === 'plan.updated'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 402 | <code>        assert.ok(transcript.body.items.some((item) =&gt; item.type === 'tool.result'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 403 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 404 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 405 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>test('AILIS runtime can call a real stdio MCP server and read resources', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 409 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 410 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 411 | <code>    const serverPath = path.join(workspaceRoot, 'fixture-mcp-server.cjs');</code> | 声明局部标识符 `serverPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 412 | <code>    await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 413 | <code>        serverPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 414 | <code>        `</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 415 | <code>const readline = require('readline');</code> | 导入依赖 `readline`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 416 | <code>const rl = readline.createInterface({ input: process.stdin });</code> | 声明局部标识符 `rl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 417 | <code>function send(message) {</code> | 定义函数 `send`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 418 | <code>  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...message }) + '\\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 419 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>rl.on('line', (line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 421 | <code>  let request;</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 422 | <code>  try { request = JSON.parse(line); } catch { return; }</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 423 | <code>  if (!request.id) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 424 | <code>  if (request.method === 'initialize') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 425 | <code>    send({ id: request.id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'fixture', version: '1.0.0' } } });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 426 | <code>    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 427 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>  if (request.method === 'tools/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 429 | <code>    send({ id: request.id, result: { tools: [{ name: 'echo', description: 'Echo input text', inputSchema: { type: 'object', required: ['text'], additionalProperties: false, properties: { text: { type: 'string' } } } }] } });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 430 | <code>    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 431 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>  if (request.method === 'tools/call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 433 | <code>    send({ id: request.id, result: { content: [{ type: 'text', text: 'echo:' + (request.params?.arguments?.text &#124;&#124; '') }] } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 434 | <code>    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 435 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 436 | <code>  if (request.method === 'resources/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 437 | <code>    send({ id: request.id, result: { resources: [{ uri: 'fixture://note', name: 'note', mimeType: 'text/plain' }] } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 438 | <code>    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 439 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 440 | <code>  if (request.method === 'resources/templates/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 441 | <code>    send({ id: request.id, result: { resourceTemplates: [] } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 442 | <code>    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 443 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>  if (request.method === 'resources/read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 445 | <code>    send({ id: request.id, result: { contents: [{ uri: request.params.uri, mimeType: 'text/plain', text: 'fixture resource body' }] } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 446 | <code>    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 447 | <code>  }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>  send({ id: request.id, error: { code: -32601, message: 'unknown method' } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 449 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>        `.trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 451 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 452 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 454 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 455 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 456 | <code>        auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 457 | <code>        mcpServers: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 458 | <code>            fixture: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 459 | <code>                command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 460 | <code>                args: [serverPath],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 461 | <code>                cwd: workspaceRoot</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 462 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 466 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 467 | <code>        const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'fixture' }, { runId: 'mcp-run' });</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 468 | <code>        assert.equal(tools.details.status, 'completed');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 469 | <code>        assert.equal(tools.details.tools[0].tools[0].name, 'echo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 470 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 471 | <code>        const call = await runtime.executeTool(</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 472 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 473 | <code>            { action: 'call_tool', server: 'fixture', tool: 'echo', args: { text: 'hello' } },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 474 | <code>            { runId: 'mcp-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 475 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 476 | <code>        assert.equal(call.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 477 | <code>        assert.match(call.content[0].text, /echo:hello/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 478 | <code>        assert.equal(runtime.canExecuteTool('mcp__fixture__echo'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 479 | <code>        assert.equal(runtime.canExecuteTool('mcp:fixture:echo'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 480 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 481 | <code>        const directCall = await runtime.executeTool(</code> | 声明局部标识符 `directCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 482 | <code>            'mcp__fixture__echo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 483 | <code>            { text: 'direct' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 484 | <code>            { runId: 'mcp-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 485 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>        assert.equal(directCall.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 487 | <code>        assert.equal(directCall.details.server, 'fixture');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 488 | <code>        assert.equal(directCall.details.tool, 'echo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 489 | <code>        assert.match(directCall.content[0].text, /echo:direct/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 491 | <code>        const searched = await runtime.executeTool(</code> | 声明局部标识符 `searched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 492 | <code>            'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 493 | <code>            { query: 'echo fixture', limit: 8 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 494 | <code>            { runId: 'mcp-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 495 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>        assert.equal(searched.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 497 | <code>        assert.ok(searched.details.tools.some((tool) =&gt; tool.id === 'mcp__fixture__echo'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 499 | <code>        const aliasCall = await runtime.executeTool(</code> | 声明局部标识符 `aliasCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 500 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 501 | <code>            { action: 'call_tool', server: 'fixture', tool_name: 'echo', tool_args: { text: 'alias' } },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 502 | <code>            { runId: 'mcp-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 503 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>        assert.equal(aliasCall.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 505 | <code>        assert.match(aliasCall.content[0].text, /echo:alias/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 506 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 507 | <code>        const topLevelArgCall = await runtime.executeTool(</code> | 声明局部标识符 `topLevelArgCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 508 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 509 | <code>            { action: 'call_tool', server: 'fixture', tool: 'echo', text: 'top-level' },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 510 | <code>            { runId: 'mcp-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 511 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>        assert.equal(topLevelArgCall.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 513 | <code>        assert.match(topLevelArgCall.content[0].text, /echo:top-level/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 515 | <code>        const resource = await runtime.executeTool(</code> | 声明局部标识符 `resource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 516 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 517 | <code>            { action: 'read_resource', server: 'fixture', uri: 'fixture://note' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 518 | <code>            { runId: 'mcp-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 519 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>        assert.equal(resource.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 521 | <code>        assert.equal(resource.details.result.contents[0].text, 'fixture resource body');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 522 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 523 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 524 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 525 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 527 | <code>test('AILIS runtime can call a basic HTTP MCP server', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 528 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-http-mcp-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 529 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 530 | <code>    const http = await import('node:http');</code> | 声明局部标识符 `http`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 531 | <code>    const requests = [];</code> | 声明局部标识符 `requests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 532 | <code>    const server = http.createServer((req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 533 | <code>        let body = '';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 534 | <code>        req.setEncoding('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 535 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 536 | <code>            body += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 537 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 539 | <code>            const request = JSON.parse(body &#124;&#124; '{}');</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 540 | <code>            requests.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 541 | <code>                method: request.method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 542 | <code>                sessionId: req.headers['mcp-session-id'] &#124;&#124; ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 543 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>            res.setHeader('Content-Type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 545 | <code>            res.setHeader('Mcp-Session-Id', 'session-http-fixture');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 546 | <code>            if (!request.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 547 | <code>                res.statusCode = 202;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 548 | <code>                res.end('');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 549 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 550 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>            if (request.method === 'initialize') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 552 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 553 | <code>                    jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 554 | <code>                    id: request.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 555 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 556 | <code>                        protocolVersion: '2025-06-18',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 557 | <code>                        capabilities: { tools: {}, resources: {} },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 558 | <code>                        serverInfo: { name: 'http-fixture', version: '1.0.0' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 559 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 562 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>            if (request.method === 'tools/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 564 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 565 | <code>                    jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 566 | <code>                    id: request.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 567 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 568 | <code>                        tools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 569 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 570 | <code>                                name: 'echo_http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 571 | <code>                                description: 'Echo over HTTP',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 572 | <code>                                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 573 | <code>                                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 574 | <code>                                    required: ['text'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 575 | <code>                                    properties: { text: { type: 'string' } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 576 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 578 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 581 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 582 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 583 | <code>            if (request.method === 'tools/call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 584 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 585 | <code>                    jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 586 | <code>                    id: request.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 587 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 588 | <code>                        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 589 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 590 | <code>                                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 591 | <code>                                text: `http:${request.params?.arguments?.text &#124;&#124; ''}`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 592 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 597 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>            if (request.method === 'prompts/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 599 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 600 | <code>                    jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 601 | <code>                    id: request.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 602 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 603 | <code>                        prompts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 604 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 605 | <code>                                name: 'explain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 606 | <code>                                description: 'Explain the fixture state'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 607 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 608 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 611 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 612 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>            if (request.method === 'prompts/get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 614 | <code>                res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 615 | <code>                    jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 616 | <code>                    id: request.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 617 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 618 | <code>                        messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 619 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 620 | <code>                                role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 621 | <code>                                content: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 622 | <code>                                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 623 | <code>                                    text: `prompt:${request.params?.name &#124;&#124; ''}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 624 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 625 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 626 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 627 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 630 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 631 | <code>            res.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 632 | <code>                jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 633 | <code>                id: request.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 634 | <code>                error: { code: -32601, message: 'unknown method' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 635 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 638 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 639 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 640 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 641 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 642 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 643 | <code>        auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 644 | <code>        mcpServers: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 645 | <code>            fixture_http: {</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 646 | <code>                transport: 'http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 647 | <code>                url: `http://127.0.0.1:${address.port}/mcp`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 648 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 652 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 653 | <code>        const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'fixture_http' }, { runId: 'mcp-http-run' });</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 654 | <code>        assert.equal(tools.details.status, 'completed');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 655 | <code>        assert.equal(tools.details.tools[0].tools[0].name, 'echo_http');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>        const call = await runtime.executeTool(</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 658 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 659 | <code>            { action: 'call_tool', server: 'fixture_http', tool: 'echo_http', args: { text: 'hello' } },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 660 | <code>            { runId: 'mcp-http-run' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 661 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>        assert.equal(call.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 663 | <code>        assert.match(call.content[0].text, /http:hello/);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 665 | <code>        const invalidCall = await runtime.executeTool(</code> | 声明局部标识符 `invalidCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 666 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 667 | <code>            { action: 'call_tool', server: 'fixture_http', tool: 'echo_http', args: {} },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 668 | <code>            { runId: 'mcp-http-run' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 669 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>        assert.equal(invalidCall.isError, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 671 | <code>        assert.equal(invalidCall.details.status, 'error');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 672 | <code>        assert.equal(invalidCall.details.details.status, 'invalid_mcp_tool_args');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>        const health = await runtime.executeTool(</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 675 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 676 | <code>            { action: 'health_check', server: 'fixture_http', timeoutMs: 2000 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 677 | <code>            { runId: 'mcp-http-run' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 678 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>        assert.equal(health.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 680 | <code>        assert.equal(health.details.health[0].ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 682 | <code>        const prompts = await runtime.executeTool(</code> | 声明局部标识符 `prompts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 683 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 684 | <code>            { action: 'list_prompts', server: 'fixture_http' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 685 | <code>            { runId: 'mcp-http-run' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 686 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>        assert.equal(prompts.details.prompts[0].prompts[0].name, 'explain');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 688 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 689 | <code>        const prompt = await runtime.executeTool(</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 690 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 691 | <code>            { action: 'get_prompt', server: 'fixture_http', prompt: 'explain' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 692 | <code>            { runId: 'mcp-http-run' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 693 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 694 | <code>        assert.match(JSON.stringify(prompt.details.result), /prompt:explain/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>        assert.ok(requests.some((request) =&gt; request.method === 'notifications/initialized'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 697 | <code>        assert.ok(requests.some((request) =&gt; request.method === 'tools/list' &amp;&amp; request.sessionId === 'session-http-fixture'));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 698 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 699 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 700 | <code>        await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 701 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 702 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>test('AILIS runtime persists MCP server registry to local config', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 705 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-config-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 706 | <code>    const mcpConfigPath = path.join(workspaceRoot, '.state', 'mcp-servers.json');</code> | 声明局部标识符 `mcpConfigPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 707 | <code>    let runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 708 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 709 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 710 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 711 | <code>        mcpConfigPath</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 712 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 713 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 714 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 715 | <code>        const registered = await runtime.executeTool(</code> | 声明局部标识符 `registered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 716 | <code>            'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 717 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 718 | <code>                action: 'register_server',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 719 | <code>                server: 'persisted_http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 720 | <code>                config: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 721 | <code>                    persisted_http: {</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 722 | <code>                        transport: 'http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 723 | <code>                        url: 'http://127.0.0.1:9/mcp'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 724 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>            { runId: 'mcp-config-run' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 728 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>        assert.equal(registered.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 730 | <code>        assert.match(await fs.readFile(mcpConfigPath, 'utf8'), /persisted_http/);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 731 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 732 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 733 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>    runtime = new AILISRuntime({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 736 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 737 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 738 | <code>        auditDir: path.join(workspaceRoot, '.audit2'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 739 | <code>        mcpConfigPath</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 740 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 742 | <code>        const listed = await runtime.executeTool('mcp_bridge', { action: 'list_servers' }, { runId: 'mcp-config-run-2' });</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 743 | <code>        assert.equal(listed.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 744 | <code>        assert.ok(listed.details.servers.some((server) =&gt; server.name === 'persisted_http'));</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 745 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 746 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 747 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 749 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 750 | <code>test('AILIS Codex-style Agent tree delivers completion through the session mailbox', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 751 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-tree-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 752 | <code>    const childContexts = [];</code> | 声明局部标识符 `childContexts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 753 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 754 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 755 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 756 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 757 | <code>        agentExecutor: async ({ agent, context }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 758 | <code>            childContexts.push(context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 759 | <code>            await new Promise((resolve) =&gt; setTimeout(resolve, 20));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 760 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 761 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 762 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 763 | <code>                displayText: `answer:${agent.task}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 764 | <code>                taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 765 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 766 | <code>                    resume: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 767 | <code>                        contextManagerCheckpoint: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 768 | <code>                            history_version: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 769 | <code>                            items: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 770 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 771 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 772 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 773 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 774 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 775 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 776 | <code>    const context = {</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 777 | <code>        runId: 'parent-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 778 | <code>        sessionId: 'session-a',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 779 | <code>        agent_path: '/root',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 780 | <code>        attachments: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 781 | <code>            type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 782 | <code>            name: 'input.xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 783 | <code>            path: path.join(workspaceRoot, '.ailis-runtime', 'attachments', 'input.xlsx')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 784 | <code>        }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 785 | <code>        parentUserGoal: 'calculate the complete workbook total',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 786 | <code>        forked_context_checkpoint: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 787 | <code>            history_version: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 788 | <code>            items: [{ type: 'message', role: 'user', content: [{ type: 'input_text', text: 'original request' }] }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 789 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 790 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 791 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 792 | <code>    const spawned = await runtime.executeTool('spawn_agent', {</code> | 声明局部标识符 `spawned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 793 | <code>        task_name: 'guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 794 | <code>        message: 'Research the guide.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 795 | <code>        fork_turns: 'all'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 796 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 797 | <code>    assert.equal(spawned.structuredContent.task_name, '/root/guide');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>    const waited = await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 声明局部标识符 `waited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 800 | <code>    assert.equal(waited.structuredContent.timed_out, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 801 | <code>    const mailbox = runtime.drain_mailbox_input_items({ sessionId: 'session-a', runId: 'a-different-run' });</code> | 声明局部标识符 `mailbox`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 802 | <code>    assert.equal(mailbox.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 803 | <code>    assert.match(JSON.stringify(mailbox), /answer:Research the guide/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 804 | <code>    assert.equal(childContexts.length, 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 805 | <code>    assert.equal(childContexts[0].taskAgentInheritanceMode, 'checkpoint');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 806 | <code>    assert.deepEqual(childContexts[0].initialContextManagerCheckpoint, context.forked_context_checkpoint);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 807 | <code>    assert.deepEqual(childContexts[0].attachments, context.attachments);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 808 | <code>    assert.equal(childContexts[0].parentUserGoal, context.parentUserGoal);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 809 | <code>    await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 810 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 811 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 812 | <code>test('AILIS Agent tree queues followup input into a running thread', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 813 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-input-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 814 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 815 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 816 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 817 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 818 | <code>        agentExecutor: async ({ registerInputHandler }) =&gt; await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 819 | <code>            registerInputHandler((message) =&gt; resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 820 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 821 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 822 | <code>                displayText: `received:${message}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 823 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 824 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 825 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 826 | <code>    const context = { runId: 'parent-input', sessionId: 'session-input', agent_path: '/root' };</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 827 | <code>    await runtime.executeTool('spawn_agent', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 828 | <code>        task_name: 'worker',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 829 | <code>        message: 'initial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 830 | <code>        fork_turns: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 831 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 832 | <code>    await runtime.executeTool('followup_task', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 833 | <code>        target: 'worker',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 834 | <code>        message: 'corrected input'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 835 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 836 | <code>    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 837 | <code>    assert.match(JSON.stringify(runtime.drain_mailbox_input_items(context)), /received:corrected input/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 838 | <code>    await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 839 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 841 | <code>test('AILIS Agent tree resumes a completed thread from its checkpoint', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 842 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-resume-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 843 | <code>    const contexts = [];</code> | 声明局部标识符 `contexts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 844 | <code>    const checkpoint = {</code> | 声明局部标识符 `checkpoint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 845 | <code>        history_version: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 846 | <code>        items: [{ type: 'message', role: 'user', content: [{ type: 'input_text', text: 'checkpoint' }] }]</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 847 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 848 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 849 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 850 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 851 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 852 | <code>        agentExecutor: async ({ agent, context }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 853 | <code>            contexts.push(context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 854 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 855 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 856 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 857 | <code>                displayText: agent.task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 858 | <code>                taskRunHandoff: { status: 'completed', resume: { contextManagerCheckpoint: checkpoint } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 859 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 860 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>    const context = { runId: 'parent-resume', sessionId: 'session-resume', agent_path: '/root' };</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 863 | <code>    await runtime.executeTool('spawn_agent', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 864 | <code>        task_name: 'worker',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 865 | <code>        message: 'first',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 866 | <code>        fork_turns: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 867 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 868 | <code>    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 869 | <code>    runtime.drain_mailbox_input_items(context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 870 | <code>    const stableId = runtime.agent_control.state.list(context)[0].id;</code> | 声明局部标识符 `stableId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 871 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 872 | <code>    await runtime.executeTool('followup_task', { target: 'worker', message: 'second' }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 873 | <code>    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 874 | <code>    assert.equal(contexts.length, 2);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 875 | <code>    assert.equal(runtime.agent_control.state.list(context)[0].id, stableId);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 876 | <code>    assert.equal(contexts[1].taskAgentInheritanceMode, 'checkpoint');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 877 | <code>    assert.deepEqual(contexts[1].initialContextManagerCheckpoint, checkpoint);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 878 | <code>    await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 879 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 881 | <code>test('Persona parent run converts duplicate spawn into followup on the persistent TaskAgent', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 882 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-agent-owner-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 883 | <code>    const tasks = [];</code> | 声明局部标识符 `tasks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 884 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 885 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 886 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 887 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 888 | <code>        agentExecutor: async ({ agent }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 889 | <code>            tasks.push(agent.task);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 890 | <code>            return { ok: true, status: 'completed', displayText: `answer:${agent.task}` };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 891 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 892 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 893 | <code>    const context = {</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 894 | <code>        runId: 'persona-parent-run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 895 | <code>        sessionId: 'persona-owner-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 896 | <code>        agent_path: '/root',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 897 | <code>        agentRole: 'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 898 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 899 | <code>    await runtime.executeTool('spawn_agent', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 900 | <code>        task_name: 'guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 901 | <code>        message: 'research the guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 902 | <code>        fork_turns: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 903 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 904 | <code>    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 905 | <code>    runtime.drain_mailbox_input_items(context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 906 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 907 | <code>    const duplicate = await runtime.executeTool('spawn_agent', {</code> | 声明局部标识符 `duplicate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 908 | <code>        task_name: 'guide_supplement',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 909 | <code>        message: 'search for missing guide details',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 910 | <code>        fork_turns: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 911 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 912 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 913 | <code>    assert.equal(duplicate.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 914 | <code>    assert.equal(duplicate.structuredContent.status, 'followup_queued');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 915 | <code>    assert.equal(duplicate.structuredContent.task_name, '/root/guide');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 916 | <code>    assert.equal(duplicate.structuredContent.continued, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 917 | <code>    assert.equal(duplicate.structuredContent.result_available, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 918 | <code>    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 919 | <code>    assert.equal(runtime.agent_control.state.list(context).length, 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 920 | <code>    assert.deepEqual(tasks, ['research the guide', 'search for missing guide details']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 921 | <code>    await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 922 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 924 | <code>test('Subagent notification carries a source-only Persona evidence boundary', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 925 | <code>    const rendered = new SubagentNotification(</code> | 声明局部标识符 `rendered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 926 | <code>        '/root/research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 927 | <code>        AgentStatus.Completed('supported answer'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 928 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 929 | <code>            final_answer: 'supported answer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 930 | <code>            source_refs: [{ url: 'https://example.test/source' }],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 931 | <code>            evidence_boundary: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 932 | <code>                mode: 'source_only',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 933 | <code>                may_add_facts: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 934 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 935 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 936 | <code>    ).render();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 937 | <code>    assert.match(rendered, /"final_answer":"supported answer"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 938 | <code>    assert.match(rendered, /"mode":"source_only"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 939 | <code>    assert.match(rendered, /"may_add_facts":false/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 940 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>test('AILIS Agent trees are session scoped and enforce one live direct child', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 943 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-isolation-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 944 | <code>    let release;</code> | 声明局部标识符 `release`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 945 | <code>    const gate = new Promise((resolve) =&gt; {</code> | 声明局部标识符 `gate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 946 | <code>        release = resolve;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 947 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 948 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 949 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 950 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 951 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 952 | <code>        agentExecutor: async ({ agent }) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 953 | <code>            await gate;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 954 | <code>            return { ok: true, status: 'completed', displayText: agent.task };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 955 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 956 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 957 | <code>    const sessionA = { runId: 'run-a', sessionId: 'session-a', agent_path: '/root' };</code> | 声明局部标识符 `sessionA`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 958 | <code>    const sessionB = { runId: 'run-b', sessionId: 'session-b', agent_path: '/root' };</code> | 声明局部标识符 `sessionB`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 959 | <code>    await runtime.executeTool('spawn_agent', { task_name: 'one', message: 'one', fork_turns: 'none' }, sessionA);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 960 | <code>    const duplicate = await runtime.executeTool('spawn_agent', { task_name: 'two', message: 'two', fork_turns: 'none' }, sessionA);</code> | 声明局部标识符 `duplicate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 961 | <code>    assert.equal(duplicate.isError, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 962 | <code>    assert.equal(duplicate.structuredContent.status, 'agent_thread_limit_reached');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 963 | <code>    await runtime.executeTool('spawn_agent', { task_name: 'one', message: 'other session', fork_turns: 'none' }, sessionB);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 964 | <code>    assert.deepEqual(runtime.agent_control.list_agents({}, sessionA).agents.map((entry) =&gt; entry.agent_name), ['/root/one']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 965 | <code>    assert.deepEqual(runtime.agent_control.list_agents({}, sessionB).agents.map((entry) =&gt; entry.agent_name), ['/root/one']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 966 | <code>    release();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 967 | <code>    await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 968 | <code>        runtime.agent_control.await_live_children(sessionA, 1000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 969 | <code>        runtime.agent_control.await_live_children(sessionB, 1000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 970 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 971 | <code>    await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 972 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>test('AILIS Agent failures remain Errored and preserve a parent handoff', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 975 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-error-runtime-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 976 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 977 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 978 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 979 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 980 | <code>        agentExecutor: async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 981 | <code>            throw new Error('fixture provider failure');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 982 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 983 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 984 | <code>    const context = { runId: 'parent-error', sessionId: 'session-error', agent_path: '/root' };</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 985 | <code>    await runtime.executeTool('spawn_agent', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 986 | <code>        task_name: 'worker',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 987 | <code>        message: 'solve task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 988 | <code>        fork_turns: 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 989 | <code>    }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 990 | <code>    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 991 | <code>    const listed = runtime.agent_control.list_agents({}, context).agents;</code> | 声明局部标识符 `listed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 992 | <code>    assert.equal(listed.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 993 | <code>    assert.deepEqual(listed[0].agent_status, { errored: 'fixture provider failure' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 994 | <code>    assert.match(JSON.stringify(runtime.drain_mailbox_input_items(context)), /fixture provider failure/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 995 | <code>    const agent = runtime.agent_control.state.list(context)[0];</code> | 声明局部标识符 `agent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 996 | <code>    assert.equal(agent.result.taskRunHandoff.status, 'failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 997 | <code>    await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 998 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 999 | <code>test('AILIS runtime exposes self_evolution as a conversation-driven agent tool', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1000 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-self-evolution-tool-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1001 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1002 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1003 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1004 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1005 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>    const proposal = {</code> | 声明局部标识符 `proposal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1007 | <code>        id: 'proposal-preference-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1008 | <code>        type: 'preference_consolidation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1009 | <code>        title: '沉淀新的用户偏好',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1010 | <code>        status: 'proposed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1011 | <code>        risk: 'low',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1012 | <code>        riskLabel: '低风险',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1013 | <code>        summary: '用户希望 AILIS 通过对话学习偏好，而不是进入控制面板。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1014 | <code>        evidence: [{ type: 'memory_event', preview: '不要放控制面板' }],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1015 | <code>        target: { kind: 'memory_block', key: 'user' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1016 | <code>        recommendedAction: 'approve_and_apply'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1017 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1018 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1019 | <code>    runtime.setSelfEvolutionRuntime({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1020 | <code>        getStatus: () =&gt; ({ enabled: true, loaded: true, proposalCount: 1 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1021 | <code>        ensureLoaded: async () =&gt; ({}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1022 | <code>        analyze: async (args = {}) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1023 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1024 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1025 | <code>            summary: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1026 | <code>                headline: `发现 1 个可处理的自我进化提案：${args.taskText}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1027 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1028 | <code>            proposals: [proposal]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1029 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1030 | <code>        listProposals: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1031 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1032 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1033 | <code>            proposals: [proposal]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1034 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>        getProposal: async (id) =&gt; id === proposal.id ? proposal : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1036 | <code>        markProposal: async (args = {}) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1037 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1038 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1039 | <code>            proposal: { ...proposal, status: args.status }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1040 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1041 | <code>        applyProposal: async () =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1042 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1043 | <code>            status: 'needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1044 | <code>            proposal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1045 | <code>            approvalText: 'Apply self-evolution proposal?'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1046 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1049 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1050 | <code>        assert.equal(runtime.canExecuteTool('self_evolution'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1051 | <code>        assert.ok(runtime.getStatus().capabilities.includes('self_evolution_loop'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1052 | <code>        assert.ok(runtime.getRuntimeToolDefinitions().some((tool) =&gt; tool.id === 'self_evolution'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1053 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1054 | <code>        const analyzed = await runtime.executeTool('self_evolution', {</code> | 声明局部标识符 `analyzed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1055 | <code>            action: 'analyze',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1056 | <code>            taskText: '优化 AILIS 自己'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1057 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1058 | <code>        assert.equal(analyzed.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1059 | <code>        assert.match(analyzed.content[0].text, /发现 1 个可处理的自我进化提案/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1060 | <code>        assert.match(analyzed.content[0].text, /沉淀新的用户偏好/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1061 | <code>        assert.match(analyzed.content[0].text, /不是进入控制面板/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1062 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1063 | <code>        const classification = runtime.classifyToolCall({</code> | 声明局部标识符 `classification`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1064 | <code>            toolId: 'self_evolution',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1065 | <code>            args: { action: 'apply_proposal' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1066 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1067 | <code>        assert.equal(classification.class, 'self_evolution');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1068 | <code>        assert.equal(classification.mutates, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1069 | <code>        assert.equal(classification.requiresApprovalCapable, true);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1070 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1071 | <code>        const apply = await runtime.executeTool('self_evolution', {</code> | 声明局部标识符 `apply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1072 | <code>            action: 'apply_proposal',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1073 | <code>            id: proposal.id</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1074 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>        assert.equal(apply.details.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1076 | <code>        assert.match(apply.content[0].text, /需要用户确认/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1077 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1078 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-runtime 的契约与回归行为。”这一文件职责。 |
| 1079 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1080 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
