# tests/ailis-optimization-shadow.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：322
- SHA-256：`5279cd69ee84181fdfd90b5ba63c2cb7bf19da3e33319a32bcb82062577d8dc1`
- 可运行副本：[打开源文件](../../../source/tests/ailis-optimization-shadow.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:http`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`../electron/ailis-optimization-shadow.cjs`
- 主要符号：`require`、`createFinalResponseServer`、`calls`、`server`、`raw`、`address`、`runGatewayAgent`、`response`、`oneFlag`、`master`、`repeatedQuery`、`stepResults`、`input`、`beforeSteps`、`beforeInput`、`telemetry`、`workspaceRoot`、`llmServer`、`gateway`、`llmSettings`、`status`、`disabled`、`disabledTranscript`、`enabled`、`enabledTranscript`、`shadowItems`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 6 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 7 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 10 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildOptimizationShadowTelemetry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    resolveOptimizationShadowFlags</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 14 | <code>} = require('../electron/ailis-optimization-shadow.cjs');</code> | 导入依赖 `../electron/ailis-optimization-shadow.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>async function createFinalResponseServer() {</code> | 定义函数 `createFinalResponseServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    const server = http.createServer((request, response) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 19 | <code>        let raw = '';</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 20 | <code>        request.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 21 | <code>            raw += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 22 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>        request.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 24 | <code>            calls.push(raw ? JSON.parse(raw) : {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 25 | <code>            response.writeHead(200, { 'content-type': 'application/json' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 26 | <code>            response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 27 | <code>                choices: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 28 | <code>                    message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 29 | <code>                        role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 30 | <code>                        content: 'shadow integration ok'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 31 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>                usage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 34 | <code>                    prompt_tokens: 10,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 35 | <code>                    completion_tokens: 3,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 36 | <code>                    total_tokens: 13</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 37 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>        calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 45 | <code>        url: `http://127.0.0.1:${address.port}/v1`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 46 | <code>        close: () =&gt; new Promise((resolve) =&gt; server.close(resolve))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 47 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>async function runGatewayAgent(baseUrl, payload) {</code> | 定义函数 `runGatewayAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    const response = await fetch(`${baseUrl}/agent/run`, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 52 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 53 | <code>        headers: { 'content-type': 'application/json' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 54 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>        response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 58 | <code>        body: await response.json()</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>test('optimization shadow flags are independent and default off', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 63 | <code>    assert.deepEqual(resolveOptimizationShadowFlags({}, {}, {}), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 64 | <code>        enabled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 65 | <code>        master: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 66 | <code>        contextDelta: false,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 67 | <code>        artifactDedup: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 68 | <code>        toolArgLint: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 69 | <code>        evidenceMatrix: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 70 | <code>        noProgress: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 71 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>    const oneFlag = resolveOptimizationShadowFlags(</code> | 声明局部标识符 `oneFlag`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 76 | <code>        { AILIS_TOOL_ARG_LINT_SHADOW: '1' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 77 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    assert.equal(oneFlag.enabled, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 79 | <code>    assert.equal(oneFlag.toolArgLint, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 80 | <code>    assert.equal(oneFlag.contextDelta, false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>    const master = resolveOptimizationShadowFlags(</code> | 声明局部标识符 `master`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 83 | <code>        {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 84 | <code>        {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 85 | <code>        { AILIS_OPTIMIZATION_SHADOW: 'true' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 86 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    assert.equal(master.enabled, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 88 | <code>    assert.equal(master.master, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 89 | <code>    assert.equal(master.contextDelta, true);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    assert.equal(master.artifactDedup, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 91 | <code>    assert.equal(master.toolArgLint, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.equal(master.evidenceMatrix, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    assert.equal(master.noProgress, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 94 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>test('optimization shadow telemetry observes without mutating model input or tool args', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 97 | <code>    const repeatedQuery = [</code> | 声明局部标识符 `repeatedQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 98 | <code>        'unknown language article country flag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 99 | <code>        'unknown language article country flag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 100 | <code>        'unknown language article country flag',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        'BASE DDC 633'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 102 | <code>    ].join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 103 | <code>    const stepResults = [{</code> | 声明局部标识符 `stepResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 104 | <code>        tool: 'mcp__ailis_research__continue_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 105 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            query: repeatedQuery.repeat(5),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 107 | <code>            timeoutMs: 3000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 108 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 110 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 112 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 113 | <code>                    url: 'https://example.test/results',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 114 | <code>                    recordFieldProjections: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 115 | <code>                        title: 'Candidate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 116 | <code>                        fields: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 117 | <code>                            { label: 'Document Type', value: 'Article' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 118 | <code>                            { label: 'Country', value: 'gt' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 119 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        tool: 'mcp__ailis_research__continue_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 126 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 127 | <code>            query: repeatedQuery</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 128 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 130 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 131 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 132 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 133 | <code>                    url: 'https://example.test/results',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 134 | <code>                    recordFieldProjections: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 135 | <code>                        title: 'Candidate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 136 | <code>                        fields: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                            { label: 'Document Type', value: 'Article' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                            { label: 'Country', value: 'gt' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    const input = [{</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 146 | <code>        type: 'message',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 147 | <code>        role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 148 | <code>        content: [{ type: 'input_text', text: 'question' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 149 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 150 | <code>        type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 151 | <code>        call_id: 'call-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        output: 'same output'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 153 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 154 | <code>        type: 'function_call_output',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 155 | <code>        call_id: 'call-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 156 | <code>        output: 'same output'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 157 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>    const beforeSteps = structuredClone(stepResults);</code> | 声明局部标识符 `beforeSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 159 | <code>    const beforeInput = structuredClone(input);</code> | 声明局部标识符 `beforeInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 160 | <code>    const telemetry = buildOptimizationShadowTelemetry({</code> | 声明局部标识符 `telemetry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 161 | <code>        flags: resolveOptimizationShadowFlags(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 162 | <code>            {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 163 | <code>            {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 164 | <code>            { AILIS_OPTIMIZATION_SHADOW: '1' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 165 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>        iteration: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        message: 'From what country was the unknown language article?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        promptBudget: { total_chars: 5000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 169 | <code>        modelInputRequest: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 170 | <code>            instructions: 'system instructions',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 171 | <code>            input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 172 | <code>            tools: [{ name: 'web_run' }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 173 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>        stepResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 175 | <code>        taskState: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 176 | <code>            research: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                attempts: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                    operation: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                    queries: ['same query'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                    targets: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                    status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                    operation: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 184 | <code>                    queries: ['same query'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 185 | <code>                    targets: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 186 | <code>                    status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 187 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>                strategyAlerts: [{ code: 'historical_archive_not_tried_after_repeated_search' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 189 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>    assert.equal(telemetry.mode, 'shadow_only');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 194 | <code>    assert.deepEqual(telemetry.invariants, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 195 | <code>        modelInputMutation: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 196 | <code>        toolArgMutation: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        toolChoiceMutation: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        answerGateMutation: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 199 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    assert.ok(telemetry.contextDelta.exactInputDuplicates.duplicateItems &gt;= 1);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 201 | <code>    assert.ok(telemetry.artifactDedup.repeatedSourceIdentities.duplicateItems &gt;= 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 202 | <code>    assert.ok(telemetry.toolArgLint.findings.some((finding) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 203 | <code>        finding.code === 'query_too_long'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 204 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>    assert.ok(telemetry.toolArgLint.findings.some((finding) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 206 | <code>        finding.code === 'network_timeout_below_shadow_floor'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 207 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 209 | <code>        telemetry.evidenceMatrix.missingRequestedFields,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 210 | <code>        ['language']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 211 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>    assert.equal(telemetry.noProgress.repeatedAttemptSignatures.duplicateItems, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 213 | <code>    assert.deepEqual(stepResults, beforeSteps);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 214 | <code>    assert.deepEqual(input, beforeInput);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 215 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>test('optimization shadow telemetry does no work when disabled', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 218 | <code>    assert.equal(buildOptimizationShadowTelemetry({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 219 | <code>        flags: resolveOptimizationShadowFlags({}, {}, {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 220 | <code>        modelInputRequest: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 221 | <code>            get input() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 222 | <code>                throw new Error('disabled shadow must not inspect model input');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 223 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>    }), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 226 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>test('optimization shadow stays transcript-only in the real Gateway model path', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 229 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-shadow-integration-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 230 | <code>    const llmServer = await createFinalResponseServer();</code> | 声明局部标识符 `llmServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 231 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 232 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 236 | <code>        profileCurationEnabled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 237 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 239 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 240 | <code>        baseUrl: llmServer.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 241 | <code>        apiKey: 'test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 242 | <code>        model: 'mock-shadow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 243 | <code>        temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 244 | <code>        timeoutMs: 10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 245 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 248 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 249 | <code>        const disabled = await runGatewayAgent(status.url, {</code> | 声明局部标识符 `disabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 250 | <code>            sessionId: 'shadow-disabled',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 251 | <code>            message: 'Reply with the test result.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 252 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 253 | <code>            directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 254 | <code>            memoryPolicy: 'disabled',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 255 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 256 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 257 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 258 | <code>                agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 259 | <code>                contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 260 | <code>                directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 261 | <code>                nativeDirectTools: false</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 262 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>        assert.equal(disabled.response.status, 200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        assert.equal(disabled.body.ok, true, JSON.stringify(disabled.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 266 | <code>        const disabledTranscript = await gateway.runtime.readTranscript(</code> | 声明局部标识符 `disabledTranscript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 267 | <code>            disabled.body.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 268 | <code>            200</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 269 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 271 | <code>            disabledTranscript.items.some((item) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 272 | <code>                item.type === 'agent.optimization_shadow'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 273 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>            false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 275 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>        const enabled = await runGatewayAgent(status.url, {</code> | 声明局部标识符 `enabled`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 278 | <code>            sessionId: 'shadow-enabled',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 279 | <code>            message: 'Reply with the test result.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 281 | <code>            directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 282 | <code>            memoryPolicy: 'disabled',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 283 | <code>            optimizationShadow: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 284 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 285 | <code>            context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 286 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 287 | <code>                agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 288 | <code>                contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 289 | <code>                directToolExecutor: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 290 | <code>                nativeDirectTools: false</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 291 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>        assert.equal(enabled.response.status, 200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 294 | <code>        assert.equal(enabled.body.ok, true, JSON.stringify(enabled.body));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        const enabledTranscript = await gateway.runtime.readTranscript(</code> | 声明局部标识符 `enabledTranscript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 296 | <code>            enabled.body.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 297 | <code>            200</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 298 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>        const shadowItems = enabledTranscript.items.filter((item) =&gt;</code> | 声明局部标识符 `shadowItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 300 | <code>            item.type === 'agent.optimization_shadow'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 301 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>        assert.equal(shadowItems.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 303 | <code>        assert.equal(shadowItems[0].status, 'observed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 304 | <code>        assert.equal(shadowItems[0].payload.mode, 'shadow_only');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 305 | <code>        assert.deepEqual(shadowItems[0].payload.invariants, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 306 | <code>            modelInputMutation: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 307 | <code>            toolArgMutation: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 308 | <code>            toolChoiceMutation: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 309 | <code>            answerGateMutation: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 310 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>        assert.equal(llmServer.calls.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 313 | <code>        assert.doesNotMatch(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 314 | <code>            JSON.stringify(llmServer.calls),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 315 | <code>            /optimization_shadow&#124;optimizationShadow&#124;shadow_only/</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 316 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 318 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 319 | <code>        await llmServer.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 320 | <code>        await fs.rm(workspaceRoot, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 ailis-optimization-shadow 的契约与回归行为。”这一文件职责。 |
| 321 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
