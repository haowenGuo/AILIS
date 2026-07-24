# scripts/soak-ailis-mcp.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。
- 文件类型：`source-code`
- 原始行数：327
- SHA-256：`54569095d6f625885c1ed8b2f6731b4b983c7098c79d5960366de5420191754c`
- 可运行副本：[打开源文件](../../../source/scripts/soak-ailis-mcp.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:http`、`node:os`、`node:path`、`node:url`、`node:module`、`../electron/ailis-runtime.cjs`
- 主要符号：`require`、`__filename`、`__dirname`、`makeHttpMcpServer`、`requests`、`server`、`body`、`request`、`send`、`listen`、`closeServer`、`record`、`startedAt`、`details`、`runAILISMcpSoak`、`workspaceRoot`、`auditDir`、`stdioServerPath`、`address`、`runtime`、`checks`、`result`、`tools`、`call`、`invalid`、`stdioResource`、`httpResource`、`prompts`、`prompt`、`slow`、`health`、`failed`、`report`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 4 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 5 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 6 | <code>import { fileURLToPath } from 'node:url';</code> | 导入依赖 `node:url`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 7 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 10 | <code>const { AILISRuntime } = require('../electron/ailis-runtime.cjs');</code> | 导入依赖 `../electron/ailis-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>const __filename = fileURLToPath(import.meta.url);</code> | 声明局部标识符 `__filename`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 13 | <code>const __dirname = path.dirname(__filename);</code> | 声明局部标识符 `__dirname`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>function makeHttpMcpServer() {</code> | 定义函数 `makeHttpMcpServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 16 | <code>    const requests = [];</code> | 声明局部标识符 `requests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 17 | <code>    const server = http.createServer((req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 18 | <code>        let body = '';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 19 | <code>        req.setEncoding('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 20 | <code>        req.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 21 | <code>            body += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 22 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>        req.on('end', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 24 | <code>            let request = {};</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 25 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 26 | <code>                request = JSON.parse(body &#124;&#124; '{}');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 27 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 28 | <code>            requests.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 29 | <code>                method: request.method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 30 | <code>                sessionId: req.headers['mcp-session-id'] &#124;&#124; ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 31 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>            res.setHeader('Content-Type', 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 33 | <code>            res.setHeader('Mcp-Session-Id', 'ailis-http-soak-session');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 34 | <code>            if (!request.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 35 | <code>                res.statusCode = 202;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 36 | <code>                res.end('');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 37 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 38 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>            const send = (payload) =&gt; {</code> | 声明局部标识符 `send`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 40 | <code>                res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, ...payload }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 41 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>            if (request.method === 'initialize') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 43 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 44 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 45 | <code>                        protocolVersion: '2025-06-18',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 46 | <code>                        capabilities: { tools: {}, resources: {}, prompts: {} },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 47 | <code>                        serverInfo: { name: 'ailis-mcp-soak-http', version: '1.0.0' }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 48 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>            if (request.method === 'tools/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 53 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 54 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 55 | <code>                        tools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 56 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 57 | <code>                                name: 'echo_http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 58 | <code>                                description: 'Echo input text over HTTP',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 59 | <code>                                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 60 | <code>                                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 61 | <code>                                    required: ['text'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 62 | <code>                                    properties: { text: { type: 'string', minLength: 1 } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 63 | <code>                                    additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 64 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>                            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 67 | <code>                                name: 'fail_http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 68 | <code>                                description: 'Return a tool-level failure',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 69 | <code>                                inputSchema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 70 | <code>                                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 71 | <code>                                    properties: { reason: { type: 'string' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 72 | <code>                                    additionalProperties: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 73 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 79 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>            if (request.method === 'tools/call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 81 | <code>                if (request.params?.name === 'echo_http') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 82 | <code>                    send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 83 | <code>                        result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 84 | <code>                            content: [{ type: 'text', text: `http:${request.params?.arguments?.text &#124;&#124; ''}` }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 85 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>                if (request.params?.name === 'fail_http') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 90 | <code>                    send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 91 | <code>                        result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 92 | <code>                            isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 93 | <code>                            content: [{ type: 'text', text: `http-failed:${request.params?.arguments?.reason &#124;&#124; 'fixture'}` }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 94 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 97 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>                send({ error: { code: -32602, message: `unknown tool: ${request.params?.name &#124;&#124; ''}` } });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 99 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 100 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>            if (request.method === 'resources/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 102 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 103 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 104 | <code>                        resources: [{ uri: 'soak://http-note', name: 'http note', mimeType: 'text/plain' }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 105 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 108 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>            if (request.method === 'resources/templates/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 110 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 111 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 112 | <code>                        resourceTemplates: [{ uriTemplate: 'soak://http/{name}', name: 'http template', mimeType: 'text/plain' }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 113 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 116 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>            if (request.method === 'resources/read') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 118 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 119 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 120 | <code>                        contents: [{ uri: request.params?.uri &#124;&#124; 'soak://http-note', mimeType: 'text/plain', text: 'http resource body for AILIS MCP soak' }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 121 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 124 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>            if (request.method === 'prompts/list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 126 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 127 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 128 | <code>                        prompts: [{ name: 'diagnose_http', description: 'Diagnose HTTP MCP soak state' }]</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 129 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 132 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>            if (request.method === 'prompts/get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 134 | <code>                send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 135 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 136 | <code>                        messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 137 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 138 | <code>                                role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 139 | <code>                                content: { type: 'text', text: `http prompt:${request.params?.name &#124;&#124; ''}` }</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 140 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>            send({ error: { code: -32601, message: `unknown method: ${request.method &#124;&#124; ''}` } });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 147 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    return { server, requests };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 150 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>async function listen(server) {</code> | 定义函数 `listen`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 153 | <code>    await new Promise((resolve) =&gt; server.listen(0, '127.0.0.1', resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 154 | <code>    return server.address();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 155 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 157 | <code>async function closeServer(server) {</code> | 定义函数 `closeServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 158 | <code>    await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 159 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>async function record(checks, name, fn) {</code> | 定义函数 `record`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 162 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 163 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 164 | <code>        const details = await fn();</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 165 | <code>        checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 166 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 167 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 168 | <code>            durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 169 | <code>            details: details &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 170 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 172 | <code>        checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 173 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 174 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 175 | <code>            durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 176 | <code>            error: error?.message &#124;&#124; String(error),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 177 | <code>            details: error?.details &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 178 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>export async function runAILISMcpSoak() {</code> | 定义函数 `runAILISMcpSoak`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 183 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-soak-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 184 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 185 | <code>    const stdioServerPath = path.join(__dirname, 'fixtures', 'ailis-mcp-soak-server.cjs');</code> | 声明局部标识符 `stdioServerPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 186 | <code>    const { server: httpServer, requests } = makeHttpMcpServer();</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 187 | <code>    const address = await listen(httpServer);</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 188 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 189 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 190 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 191 | <code>        auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 192 | <code>        mcpServers: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 193 | <code>            stdio_soak: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 194 | <code>                transport: 'stdio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 195 | <code>                command: process.execPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 196 | <code>                args: [stdioServerPath],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 197 | <code>                cwd: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 198 | <code>                timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 199 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>            http_soak: {</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 201 | <code>                transport: 'http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 202 | <code>                url: `http://127.0.0.1:${address.port}/mcp`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 203 | <code>                timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 204 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>    const checks = [];</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 209 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 210 | <code>        await record(checks, 'list configured servers', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 211 | <code>            const result = await runtime.executeTool('mcp_bridge', { action: 'list_servers' }, { runId: 'mcp-soak' });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 212 | <code>            assert.equal(result.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 213 | <code>            assert.equal(result.details.servers.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 214 | <code>            return { servers: result.details.servers.map((server) =&gt; server.name) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 215 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>        await record(checks, 'health check stdio and http', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 218 | <code>            const result = await runtime.executeTool('mcp_bridge', { action: 'health_check', timeoutMs: 3000 }, { runId: 'mcp-soak' });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 219 | <code>            assert.equal(result.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 220 | <code>            assert.equal(result.details.health.every((entry) =&gt; entry.ok), true, JSON.stringify(result.details.health));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 221 | <code>            return { health: result.details.health };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 222 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 224 | <code>        await record(checks, 'stdio list and call tool', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 225 | <code>            const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'stdio_soak' }, { runId: 'mcp-soak' });</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 226 | <code>            assert.equal(tools.details.tools[0].tools.some((tool) =&gt; tool.name === 'echo'), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 227 | <code>            const call = await runtime.executeTool(</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 228 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 229 | <code>                { action: 'call_tool', server: 'stdio_soak', tool: 'echo', args: { text: 'hello' } },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 230 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 231 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>            assert.equal(call.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 233 | <code>            assert.match(call.content[0].text, /stdio:hello/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 234 | <code>            return { toolCount: tools.details.tools[0].tools.length };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 235 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>        await record(checks, 'http list and call tool', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 238 | <code>            const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'http_soak' }, { runId: 'mcp-soak' });</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 239 | <code>            assert.equal(tools.details.tools[0].tools.some((tool) =&gt; tool.name === 'echo_http'), true);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 240 | <code>            const call = await runtime.executeTool(</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 241 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 242 | <code>                { action: 'call_tool', server: 'http_soak', tool: 'echo_http', args: { text: 'hello' } },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 243 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 244 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>            assert.equal(call.details.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 246 | <code>            assert.match(call.content[0].text, /http:hello/);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 247 | <code>            assert.ok(requests.some((request) =&gt; request.method === 'tools/list' &amp;&amp; request.sessionId === 'ailis-http-soak-session'));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 248 | <code>            return { httpRequests: requests.length };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>        await record(checks, 'input schema validation rejects invalid args', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 252 | <code>            const invalid = await runtime.executeTool(</code> | 声明局部标识符 `invalid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 253 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 254 | <code>                { action: 'call_tool', server: 'stdio_soak', tool: 'echo', args: {} },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 255 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 256 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>            assert.equal(invalid.isError, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 258 | <code>            assert.equal(invalid.details.details.status, 'invalid_mcp_tool_args');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 259 | <code>            return { status: invalid.details.details.status };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 260 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>        await record(checks, 'resources and prompts work on both transports', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 263 | <code>            const stdioResource = await runtime.executeTool(</code> | 声明局部标识符 `stdioResource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 264 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 265 | <code>                { action: 'read_resource', server: 'stdio_soak', uri: 'soak://stdio-note' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 266 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 267 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>            assert.match(JSON.stringify(stdioResource.details.result), /stdio resource body/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 269 | <code>            const httpResource = await runtime.executeTool(</code> | 声明局部标识符 `httpResource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 270 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 271 | <code>                { action: 'read_resource', server: 'http_soak', uri: 'soak://http-note' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 272 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 273 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>            assert.match(JSON.stringify(httpResource.details.result), /http resource body/);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 275 | <code>            const prompts = await runtime.executeTool('mcp_bridge', { action: 'list_prompts', server: 'stdio_soak' }, { runId: 'mcp-soak' });</code> | 声明局部标识符 `prompts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 276 | <code>            assert.equal(prompts.details.prompts[0].prompts[0].name, 'diagnose');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 277 | <code>            const prompt = await runtime.executeTool(</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 278 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 279 | <code>                { action: 'get_prompt', server: 'http_soak', prompt: 'diagnose_http' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 280 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 281 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>            assert.match(JSON.stringify(prompt.details.result), /http prompt:diagnose_http/);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 283 | <code>            return { resourceTransports: ['stdio', 'http'], promptTransports: ['stdio', 'http'] };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>        await record(checks, 'tool timeout is bounded and session remains healthy', async () =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 287 | <code>            const slow = await runtime.executeTool(</code> | 声明局部标识符 `slow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 288 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 289 | <code>                { action: 'call_tool', server: 'stdio_soak', tool: 'slow_wait', args: { delayMs: 1500 }, timeoutMs: 1000 },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 290 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 291 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>            assert.equal(slow.isError, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 293 | <code>            assert.match(slow.details.error, /timed out/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 294 | <code>            const health = await runtime.executeTool(</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 295 | <code>                'mcp_bridge',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 296 | <code>                { action: 'health_check', server: 'stdio_soak', timeoutMs: 3000 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 297 | <code>                { runId: 'mcp-soak' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 298 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>            assert.equal(health.details.health[0].ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 300 | <code>            return { timeoutStatus: slow.details.status, recovered: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 301 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 303 | <code>        await runtime.shutdown();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 304 | <code>        await closeServer(httpServer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 305 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>    const failed = checks.filter((check) =&gt; !check.ok);</code> | 声明局部标识符 `failed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 308 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 309 | <code>        ok: failed.length === 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 310 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 311 | <code>        checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 312 | <code>        summary: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 313 | <code>            total: checks.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 314 | <code>            passed: checks.length - failed.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 315 | <code>            failed: failed.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 316 | <code>            transports: ['stdio', 'http']</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 317 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>if (process.argv[1] &amp;&amp; path.resolve(process.argv[1]) === __filename) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 322 | <code>    const report = await runAILISMcpSoak();</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 323 | <code>    console.log(JSON.stringify(report, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 324 | <code>    if (!report.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 325 | <code>        process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 326 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
