# tests/ailis-hosted-runtime.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。
- 文件类型：`source-code`
- 原始行数：407
- SHA-256：`f039c129b1500457566e6fc80abc6f8ceb0a712174788422ef0af501dd43dd7d`
- 可运行副本：[打开源文件](../../../source/tests/ailis-hosted-runtime.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:events`、`node:http`、`node:module`、`../electron/ailis-hosted-runtime.cjs`
- 主要符号：`require`、`FakeGateway`、`dataRoot`、`gateways`、`manager`、`gateway`、`aliceEvents`、`bobEvents`、`record`、`request`、`deltas`、`streamEvents`、`result`、`modelRequests`、`modelServer`、`chunks`、`address`、`requests`、`response`、`managerOptions`、`personaToolNames`、`key`、`memoryStatePath`、`memoryState`、`requestCountBeforeRestore`、`restoredResult`、`restoredModelCalls`、`toolNames`、`message`、`allToolSurfaces`、`harnessRoot`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 6 | <code>import { EventEmitter } from 'node:events';</code> | 导入依赖 `node:events`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 7 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 8 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 12 | <code>    AILISHostedRuntimeManager,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 13 | <code>    sanitizeAgentRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 14 | <code>    tenantKey</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 15 | <code>} = require('../electron/ailis-hosted-runtime.cjs');</code> | 导入依赖 `../electron/ailis-hosted-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>class FakeGateway extends EventEmitter {</code> | 定义类 `FakeGateway`，把相关状态与行为收拢为一个运行时对象。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 18 | <code>    constructor(options) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 19 | <code>        super();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 20 | <code>        this.options = options;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 21 | <code>        this.requests = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 22 | <code>        this.stopped = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 23 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>    startProfileCurationScheduler() {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>    async runAgent(request) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 28 | <code>        this.requests.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 29 | <code>        this.emit('event', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 30 | <code>            type: 'agent.run.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 31 | <code>            payload: { runId: `run-${this.requests.length}`, sessionId: request.sessionId }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 32 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>        await request.onTextStreamEvent?.({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 34 | <code>            type: 'response.output_text.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 35 | <code>            streamId: `stream-${this.requests.length}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 36 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>        await request.onTextDelta?.('done', { provider: 'fake' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 38 | <code>        await request.onTextStreamEvent?.({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 39 | <code>            type: 'response.output_text.committed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 40 | <code>            streamId: `stream-${this.requests.length}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 41 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 44 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 45 | <code>            runId: `run-${this.requests.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 46 | <code>            displayText: 'done'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 47 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>    async interruptAgentRun(payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 51 | <code>        return { ok: true, status: 'interrupted', ...payload };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 52 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 54 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 55 | <code>        return { running: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 56 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>    async stop() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 59 | <code>        this.stopped = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 60 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>test('hosted runtime isolates memory and workspace roots per signed tenant', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 64 | <code>    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-runtime-'));</code> | 声明局部标识符 `dataRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 65 | <code>    const gateways = [];</code> | 声明局部标识符 `gateways`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 66 | <code>    const manager = new AILISHostedRuntimeManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 67 | <code>        dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 68 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 69 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 70 | <code>            baseUrl: 'https://example.test',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 71 | <code>            apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 72 | <code>            model: 'test-model'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 73 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>        gatewayFactory: (options) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 75 | <code>            const gateway = new FakeGateway(options);</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 76 | <code>            gateways.push(gateway);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 77 | <code>            return gateway;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>    await manager.runAgent('web:alice', { sessionId: 'main', message: 'hello' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 82 | <code>    await manager.runAgent('web:bob', { sessionId: 'main', message: 'hello' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>    assert.equal(gateways.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 85 | <code>    assert.notEqual(gateways[0].options.auditDir, gateways[1].options.auditDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 86 | <code>    assert.notEqual(gateways[0].options.workspaceRoot, gateways[1].options.workspaceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 87 | <code>    assert.match(gateways[0].options.auditDir, new RegExp(tenantKey('web:alice')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 88 | <code>    assert.match(gateways[1].options.auditDir, new RegExp(tenantKey('web:bob')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 89 | <code>    assert.equal(gateways[0].requests[0].llmSettings.apiKey, 'test-key');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>    const aliceEvents = manager.getEvents('web:alice');</code> | 声明局部标识符 `aliceEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 92 | <code>    const bobEvents = manager.getEvents('web:bob');</code> | 声明局部标识符 `bobEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 93 | <code>    assert.equal(aliceEvents.events.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 94 | <code>    assert.equal(bobEvents.events.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 95 | <code>    assert.equal(aliceEvents.events[0].payload.sessionId, 'main');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>    await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 98 | <code>    assert.ok(gateways.every((gateway) =&gt; gateway.stopped));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 99 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>test('hosted runtime replaces browser-supplied paths, credentials, and approvals', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 102 | <code>    const record = {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 103 | <code>        workspaceRoot: '/srv/ailis/tenant/workspace',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 104 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 105 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 106 | <code>            baseUrl: 'https://example.test',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 107 | <code>            apiKey: 'server-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 108 | <code>            model: 'server-model'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 109 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>    const request = sanitizeAgentRequest({</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 112 | <code>        sessionId: 'web-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 113 | <code>        maxAgentSteps: 999,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 114 | <code>        workspace: '/etc',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 115 | <code>        projectRoot: '/',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 116 | <code>        approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 117 | <code>        llmSettings: { apiKey: 'browser-key' },</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 118 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 119 | <code>            workspace: '/etc',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 120 | <code>            projectRoot: '/',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 121 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 122 | <code>            autoConfirm: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 123 | <code>            llmSettings: { apiKey: 'browser-key' }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 124 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>    }, record);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>    assert.equal(request.maxAgentSteps, 12);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 128 | <code>    assert.equal(request.llmSettings.apiKey, 'server-key');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 129 | <code>    assert.equal(request.context.workspace, record.workspaceRoot);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 130 | <code>    assert.equal(request.context.projectRoot, record.workspaceRoot);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 131 | <code>    assert.equal(request.context.approved, undefined);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 132 | <code>    assert.equal(request.context.autoConfirm, undefined);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 133 | <code>    assert.equal(request.workspace, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 134 | <code>    assert.equal(request.projectRoot, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 135 | <code>    assert.equal(request.approved, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 136 | <code>    assert.equal(request.agentRole, 'persona_orchestrator');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 137 | <code>    assert.equal(request.context.agentRole, 'persona_orchestrator');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 138 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>test('hosted runtime forwards provider text deltas outside the serialized request', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 141 | <code>    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-stream-'));</code> | 声明局部标识符 `dataRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 142 | <code>    const manager = new AILISHostedRuntimeManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 143 | <code>        dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 144 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 145 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 146 | <code>            baseUrl: 'https://example.test',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 147 | <code>            apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 148 | <code>            model: 'test-model'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 149 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>        gatewayFactory: (options) =&gt; new FakeGateway(options)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 151 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>    const deltas = [];</code> | 声明局部标识符 `deltas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 153 | <code>    const streamEvents = [];</code> | 声明局部标识符 `streamEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 156 | <code>        const result = await manager.runAgent(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 157 | <code>            'web:stream',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 158 | <code>            { sessionId: 'main', message: 'hello' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 159 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 160 | <code>                onTextDelta: (delta, metadata) =&gt; deltas.push({ delta, metadata }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 161 | <code>                onTextStreamEvent: (event) =&gt; streamEvents.push(event.type)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 162 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 165 | <code>        assert.deepEqual(deltas, [{ delta: 'done', metadata: { provider: 'fake' } }]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 166 | <code>        assert.deepEqual(streamEvents, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 167 | <code>            'response.output_text.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 168 | <code>            'response.output_text.committed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 169 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 171 | <code>        await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 172 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>test('real hosted Persona commits streamed assistant text for a direct final response', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 176 | <code>    const modelRequests = [];</code> | 声明局部标识符 `modelRequests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 177 | <code>    const modelServer = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `modelServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 178 | <code>        const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 179 | <code>        for await (const chunk of req) chunks.push(chunk);</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 180 | <code>        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 181 | <code>        modelRequests.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 182 | <code>        res.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 183 | <code>            'content-type': 'text/event-stream; charset=utf-8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 184 | <code>            'cache-control': 'no-cache'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 185 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>        res.write('data: {"choices":[{"delta":{"role":"assistant","content":"你好"}}]}\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 187 | <code>        res.write('data: {"choices":[{"delta":{"content":"，我在这里。"},"finish_reason":"stop"}]}\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 188 | <code>        res.write('data: {"choices":[],"usage":{"prompt_tokens":20,"completion_tokens":6,"total_tokens":26}}\n\n');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 189 | <code>        res.end('data: [DONE]\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 190 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    await new Promise((resolve) =&gt; modelServer.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 192 | <code>    const address = modelServer.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 193 | <code>    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-real-stream-'));</code> | 声明局部标识符 `dataRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 194 | <code>    const manager = new AILISHostedRuntimeManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 195 | <code>        dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 196 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 197 | <code>            provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 198 | <code>            baseUrl: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 199 | <code>            apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 200 | <code>            model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 201 | <code>            timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 202 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>    const deltas = [];</code> | 声明局部标识符 `deltas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 205 | <code>    const streamEvents = [];</code> | 声明局部标识符 `streamEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 208 | <code>        const result = await manager.runAgent(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 209 | <code>            'web:real-stream',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 210 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 211 | <code>                sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 212 | <code>                message: '你好',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 213 | <code>                messageHistory: [{ role: 'user', content: '你好' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 214 | <code>                maxAgentSteps: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 215 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 217 | <code>                onTextDelta: (delta) =&gt; deltas.push(delta),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 218 | <code>                onTextStreamEvent: (event) =&gt; streamEvents.push(event.type)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 219 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 223 | <code>        assert.equal(result.displayText, '你好，我在这里。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 224 | <code>        assert.deepEqual(deltas, ['你好', '，我在这里。']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 225 | <code>        assert.deepEqual(streamEvents, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 226 | <code>            'response.output_text.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 227 | <code>            'response.output_text.committed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 228 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>        assert.equal(modelRequests[0].stream, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 230 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 231 | <code>        await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 232 | <code>        await new Promise((resolve) =&gt; modelServer.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 233 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>test('hosted runtime executes the real Persona Agent and restores memory after restart', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 237 | <code>    const requests = [];</code> | 声明局部标识符 `requests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 238 | <code>    const modelServer = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `modelServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 239 | <code>        const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 240 | <code>        for await (const chunk of req) chunks.push(chunk);</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 241 | <code>        requests.push(JSON.parse(Buffer.concat(chunks).toString('utf8')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 242 | <code>        const response = Buffer.from(JSON.stringify({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 243 | <code>            id: 'chatcmpl-hosted-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 244 | <code>            object: 'chat.completion',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 245 | <code>            choices: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 246 | <code>                index: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 247 | <code>                message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 248 | <code>                    role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 249 | <code>                    content: '你好，我在这里。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 250 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>                finish_reason: 'stop'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 252 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>            usage: { prompt_tokens: 20, completion_tokens: 8, total_tokens: 28 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 254 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>        res.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 256 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 257 | <code>            'content-length': response.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 258 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>        res.end(response);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 260 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>    await new Promise((resolve) =&gt; modelServer.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 262 | <code>    const address = modelServer.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 263 | <code>    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-real-'));</code> | 声明局部标识符 `dataRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 264 | <code>    const managerOptions = {</code> | 声明局部标识符 `managerOptions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 265 | <code>        dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 266 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 267 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 268 | <code>            baseUrl: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 269 | <code>            apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 270 | <code>            model: 'test-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 271 | <code>            timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 272 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>    let manager = new AILISHostedRuntimeManager(managerOptions);</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 277 | <code>        const result = await manager.runAgent('web:integration', {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 278 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 279 | <code>            message: '请记住，我叫云辛。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 280 | <code>            messageHistory: [{ role: 'user', content: '请记住，我叫云辛。' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 281 | <code>            maxAgentSteps: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 282 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 284 | <code>        assert.match(result.displayText &#124;&#124; result.finalAnswer, /你好/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 285 | <code>        assert.ok(requests.length &gt;= 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 286 | <code>        const personaToolNames = requests.flatMap((request) =&gt;</code> | 声明局部标识符 `personaToolNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 287 | <code>            (request.tools &#124;&#124; []).map((tool) =&gt; tool?.function?.name &#124;&#124; tool?.name &#124;&#124; '')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 288 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>        assert.ok(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 290 | <code>            personaToolNames.includes('handoff_task'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 291 | <code>            JSON.stringify(requests.map((request) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 292 | <code>                keys: Object.keys(request),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 293 | <code>                toolNames: (request.tools &#124;&#124; []).map((tool) =&gt; tool?.function?.name &#124;&#124; tool?.name &#124;&#124; '')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 294 | <code>            })))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>        const key = tenantKey('web:integration');</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 298 | <code>        const memoryStatePath = path.join(</code> | 声明局部标识符 `memoryStatePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 299 | <code>            dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 300 | <code>            'tenants',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 301 | <code>            key,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 302 | <code>            'state',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 303 | <code>            'memory',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 304 | <code>            'memory-state.json'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 305 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>        const memoryState = JSON.parse(await fs.readFile(memoryStatePath, 'utf8'));</code> | 声明局部标识符 `memoryState`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 307 | <code>        assert.ok(memoryState.events.some((event) =&gt; event.userText.includes('云辛')));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>        await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 310 | <code>        manager = new AILISHostedRuntimeManager(managerOptions);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 311 | <code>        const requestCountBeforeRestore = requests.length;</code> | 声明局部标识符 `requestCountBeforeRestore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 312 | <code>        const restoredResult = await manager.runAgent('web:integration', {</code> | 声明局部标识符 `restoredResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 313 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 314 | <code>            message: '我叫什么名字？',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 315 | <code>            messageHistory: [{ role: 'user', content: '我叫什么名字？' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 316 | <code>            maxAgentSteps: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 317 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>        assert.equal(restoredResult.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 319 | <code>        const restoredModelCalls = requests.slice(requestCountBeforeRestore);</code> | 声明局部标识符 `restoredModelCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 320 | <code>        assert.ok(restoredModelCalls.length &gt;= 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 321 | <code>        assert.match(JSON.stringify(restoredModelCalls), /云辛/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 322 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 323 | <code>        await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 324 | <code>        await new Promise((resolve) =&gt; modelServer.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 325 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 328 | <code>test('hosted Persona can hand a web request to the real persistent TaskAgent harness', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 329 | <code>    const requests = [];</code> | 声明局部标识符 `requests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 330 | <code>    const modelServer = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `modelServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 331 | <code>        const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 332 | <code>        for await (const chunk of req) chunks.push(chunk);</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 333 | <code>        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 334 | <code>        requests.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 335 | <code>        const toolNames = (request.tools &#124;&#124; []).map((tool) =&gt;</code> | 声明局部标识符 `toolNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 336 | <code>            tool?.function?.name &#124;&#124; tool?.name &#124;&#124; ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 337 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>        const message = toolNames.includes('handoff_task')</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 339 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 340 | <code>                  role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 341 | <code>                  content: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 342 | <code>                  tool_calls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 343 | <code>                      id: 'call-hosted-handoff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 344 | <code>                      type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 345 | <code>                      function: { name: 'handoff_task', arguments: '{}' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 346 | <code>                  }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>            : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 349 | <code>                  role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 350 | <code>                  content: '网页 TaskAgent 已经完成任务。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 351 | <code>              };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>        const response = Buffer.from(JSON.stringify({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 353 | <code>            id: 'chatcmpl-hosted-handoff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 354 | <code>            object: 'chat.completion',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 355 | <code>            choices: [{ index: 0, message, finish_reason: message.tool_calls ? 'tool_calls' : 'stop' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 356 | <code>            usage: { prompt_tokens: 40, completion_tokens: 12, total_tokens: 52 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 357 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>        res.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 359 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 360 | <code>            'content-length': response.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 361 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>        res.end(response);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 363 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>    await new Promise((resolve) =&gt; modelServer.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 365 | <code>    const address = modelServer.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 366 | <code>    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-handoff-'));</code> | 声明局部标识符 `dataRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 367 | <code>    const manager = new AILISHostedRuntimeManager({</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 368 | <code>        dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 369 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 370 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 371 | <code>            baseUrl: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 372 | <code>            apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 373 | <code>            model: 'test-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 374 | <code>            timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 375 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 378 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 379 | <code>        const result = await manager.runAgent('web:task-agent', {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 380 | <code>            sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 381 | <code>            message: '请执行一个需要工具的任务。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 382 | <code>            messageHistory: [{ role: 'user', content: '请执行一个需要工具的任务。' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 383 | <code>            maxAgentSteps: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 384 | <code>            requireTaskExecution: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 385 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 387 | <code>        assert.match(result.displayText &#124;&#124; result.finalAnswer, /TaskAgent/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 388 | <code>        const allToolSurfaces = requests.map((request) =&gt;</code> | 声明局部标识符 `allToolSurfaces`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 389 | <code>            (request.tools &#124;&#124; []).map((tool) =&gt; tool?.function?.name &#124;&#124; tool?.name &#124;&#124; '')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 390 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>        assert.ok(allToolSurfaces.some((tools) =&gt; tools.includes('handoff_task')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 392 | <code>        assert.ok(allToolSurfaces.some((tools) =&gt; tools.includes('tool_search')));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>        const key = tenantKey('web:task-agent');</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 395 | <code>        const harnessRoot = path.join(</code> | 声明局部标识符 `harnessRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 396 | <code>            dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 397 | <code>            'tenants',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 398 | <code>            key,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 399 | <code>            'state',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 400 | <code>            'task-agent-harness'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 401 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>        assert.ok((await fs.readdir(harnessRoot)).length &gt; 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 403 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 404 | <code>        await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 405 | <code>        await new Promise((resolve) =&gt; modelServer.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 406 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
