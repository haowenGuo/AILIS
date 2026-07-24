# tests/desktop-llm-provider.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 desktop-llm-provider 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：789
- SHA-256：`4e18821c114436cc56a93aa387535d0fddc8602e0c8447444166e9ddca01be55`
- 可运行副本：[打开源文件](../../../source/tests/desktop-llm-provider.test.mjs)
- 依赖：`node:assert/strict`、`node:http`、`node:test`、`node:module`、`../electron/desktop-llm-provider.cjs`
- 主要符号：`require`、`readRequestBody`、`body`、`parsedBody`、`address`、`result`、`deltas`、`first`、`snakeCaseResult`、`caps`、`providers`、`ollamaCaps`、`vllmCaps`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import { after, before, describe, it } from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 4 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 7 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    buildAnthropicMessagesUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    buildChatCompletionsUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    buildGeminiGenerateContentUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    buildOllamaChatUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildResponsesUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    callDesktopLlmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    classifyFetchFailure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    checkDesktopLlmProvider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    getDefaultProviderBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    getProviderCapabilities</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 18 | <code>} = require('../electron/desktop-llm-provider.cjs');</code> | 导入依赖 `../electron/desktop-llm-provider.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 19 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 20 | <code>let server;</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 21 | <code>let serverUrl;</code> | 声明局部标识符 `serverUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 22 | <code>let receivedRequest;</code> | 声明局部标识符 `receivedRequest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>function readRequestBody(request) {</code> | 定义函数 `readRequestBody`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 26 | <code>        let body = '';</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 27 | <code>        request.setEncoding('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 28 | <code>        request.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 29 | <code>            body += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 30 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>        request.on('end', () =&gt; resolve(body));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 32 | <code>        request.on('error', reject);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 33 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>describe('desktop LLM provider', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    before(async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 38 | <code>        server = http.createServer(async (request, response) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 39 | <code>            const body = await readRequestBody(request);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 40 | <code>            const parsedBody = body ? JSON.parse(body) : {};</code> | 声明局部标识符 `parsedBody`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 41 | <code>            receivedRequest = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 42 | <code>                method: request.method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 43 | <code>                url: request.url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 44 | <code>                authorization: request.headers.authorization,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 45 | <code>                xApiKey: request.headers['x-api-key'],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 46 | <code>                contentType: request.headers['content-type'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 47 | <code>                body: parsedBody</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 48 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>            if (request.url === '/v1/chat/completions' &amp;&amp; parsedBody.stream === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>                response.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 52 | <code>                    'content-type': 'text/event-stream; charset=utf-8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 53 | <code>                    'cache-control': 'no-cache'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 54 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>                response.write('data: {"choices":[{"delta":{"role":"assistant","content":"你好"}}]}\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 56 | <code>                response.write('data: {"choices":[{"delta":{"content":" 呀"},"finish_reason":"stop"}]}\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 57 | <code>                response.write('data: {"choices":[],"usage":{"prompt_tokens":5,"completion_tokens":2,"total_tokens":7}}\n\n');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 58 | <code>                response.end('data: [DONE]\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 59 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 62 | <code>            response.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                'content-type': 'application/json'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 64 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>            if (request.url === '/v1/responses') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 67 | <code>                if (Array.isArray(parsedBody.tools) &amp;&amp; parsedBody.tools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 68 | <code>                    response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 69 | <code>                        output: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 70 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 71 | <code>                                type: 'function_call',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 72 | <code>                                call_id: 'call-resp-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 73 | <code>                                name: parsedBody.tools[0].name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 74 | <code>                                arguments: JSON.stringify({ ok: true, kind: 'tool' })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 75 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>                        usage: { total_tokens: 8 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 78 | <code>                    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 80 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 82 | <code>                    output_text: parsedBody.text ? '{"ok":true,"kind":"json"}' : 'OK',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 83 | <code>                    usage: { total_tokens: 6 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 84 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>            if (request.url === '/v1/messages') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 89 | <code>                if (Array.isArray(parsedBody.tools) &amp;&amp; parsedBody.tools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 90 | <code>                    response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 91 | <code>                        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 92 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 93 | <code>                                type: 'tool_use',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 94 | <code>                                id: 'toolu_1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 95 | <code>                                name: parsedBody.tools[0].name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 96 | <code>                                input: { ok: true, kind: 'tool' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 97 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>                        usage: { input_tokens: 4, output_tokens: 4 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 100 | <code>                    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 102 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 104 | <code>                    content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 105 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 106 | <code>                            type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 107 | <code>                            text: parsedBody.system?.includes('JSON') ? '{"ok":true,"kind":"json"}' : 'OK'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 108 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>                    usage: { input_tokens: 4, output_tokens: 4 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 111 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 113 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>            if (request.url.startsWith('/v1beta/models/gemini-demo:generateContent')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 116 | <code>                if (Array.isArray(parsedBody.tools) &amp;&amp; parsedBody.tools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 117 | <code>                    response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 118 | <code>                        candidates: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 119 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 120 | <code>                                content: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 121 | <code>                                    parts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 122 | <code>                                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 123 | <code>                                            functionCall: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 124 | <code>                                                name: parsedBody.tools[0].functionDeclarations[0].name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 125 | <code>                                                args: { ok: true, kind: 'tool' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 126 | <code>                                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>                                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>                                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>                        usageMetadata: { totalTokenCount: 8 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 133 | <code>                    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 135 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 137 | <code>                    candidates: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 138 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 139 | <code>                            content: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 140 | <code>                                parts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 141 | <code>                                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 142 | <code>                                        text: parsedBody.generationConfig?.responseMimeType === 'application/json'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 143 | <code>                                            ? '{"ok":true,"kind":"json"}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 144 | <code>                                            : 'OK'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 145 | <code>                                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>                                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>                    usageMetadata: { totalTokenCount: 6 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 151 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 153 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>            if (request.url === '/api/chat') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 157 | <code>                    message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 158 | <code>                        role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 159 | <code>                        content: parsedBody.format === 'json'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 160 | <code>                            ? '{"ok":true,"kind":"json"}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 161 | <code>                            : '本地 Ollama OK'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 162 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>                    prompt_eval_count: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 164 | <code>                    eval_count: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 165 | <code>                    done: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 166 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 168 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>            if (Array.isArray(parsedBody.tools) &amp;&amp; parsedBody.tools.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 171 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 172 | <code>                    choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 173 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 174 | <code>                            message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                                tool_calls: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                                        id: 'call-chat-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                                        function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                                            name: parsedBody.tools[0].function.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                                            arguments: JSON.stringify({ ok: true, kind: 'tool' })</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>                                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>                                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 185 | <code>                                reasoning_content: 'think-before-tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 186 | <code>                                content: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 187 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>                    ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>                    usage: { total_tokens: 9 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 191 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 193 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>            response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 196 | <code>                choices: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 197 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 198 | <code>                        message: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 199 | <code>                            content: parsedBody.response_format</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 200 | <code>                                ? '{"ok":true,"kind":"json"}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 201 | <code>                                : '[action:wave][expression:happy]你好呀'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 202 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>                usage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 206 | <code>                    total_tokens: 12</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 207 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 211 | <code>        await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 212 | <code>            server.listen(0, '127.0.0.1', resolve);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 213 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 215 | <code>        serverUrl = `http://127.0.0.1:${address.port}`;</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 216 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>    after(async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 219 | <code>        await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 220 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>    it('calls an OpenAI-compatible chat completions endpoint', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 223 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 224 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 225 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 226 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 227 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 228 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 229 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 230 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 231 | <code>                { role: 'system', content: 'persona' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 232 | <code>                { role: 'user', content: '你好' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 233 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>            temperature: 0.7</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 238 | <code>        assert.equal(result.content, '[action:wave][expression:happy]你好呀');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 239 | <code>        assert.equal(result.model, 'demo-model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 240 | <code>        assert.equal(receivedRequest.method, 'POST');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 241 | <code>        assert.equal(receivedRequest.url, '/v1/chat/completions');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 242 | <code>        assert.equal(receivedRequest.authorization, 'Bearer test-secret-key');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 243 | <code>        assert.equal(receivedRequest.contentType, 'application/json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 244 | <code>        assert.equal(receivedRequest.body.model, 'demo-model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 245 | <code>        assert.equal(receivedRequest.body.temperature, 0.7);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 246 | <code>        assert.deepEqual(receivedRequest.body.messages, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 247 | <code>            { role: 'system', content: 'persona' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 248 | <code>            { role: 'user', content: '你好' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 249 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>        assert.equal(JSON.stringify(result).includes('test-secret-key'), false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 251 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 253 | <code>    it('streams OpenAI-compatible text deltas without changing the final result', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 254 | <code>        const deltas = [];</code> | 声明局部标识符 `deltas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 255 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 256 | <code>            provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 257 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 258 | <code>            apiKey: 'deepseek-secret',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 259 | <code>            model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 260 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 261 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 262 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 263 | <code>                { role: 'system', content: 'persona' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 264 | <code>                { role: 'user', content: '你好' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 265 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>            onTextDelta: (delta) =&gt; deltas.push(delta)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 269 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 270 | <code>        assert.equal(result.content, '你好 呀');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 271 | <code>        assert.deepEqual(deltas, ['你好', ' 呀']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 272 | <code>        assert.equal(result.usage.total_tokens, 7);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 273 | <code>        assert.equal(receivedRequest.body.stream, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 274 | <code>        assert.deepEqual(receivedRequest.body.stream_options, { include_usage: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 275 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>    it('round-trips DeepSeek reasoning_content for native tool-call history', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 278 | <code>        const first = await callDesktopLlmProvider({</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 279 | <code>            provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 280 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 281 | <code>            apiKey: 'deepseek-secret',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 282 | <code>            model: 'deepseek-v4-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 283 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 284 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 285 | <code>            messages: [{ role: 'user', content: 'inspect file' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 286 | <code>            tools: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 287 | <code>                name: 'inspect_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 288 | <code>                description: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 289 | <code>                parameters: { type: 'object', properties: {} }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 290 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>        assert.equal(first.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 294 | <code>        assert.equal(first.providerMessage.reasoning_content, 'think-before-tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 295 | <code>        assert.equal(first.toolCalls[0].name, 'inspect_file');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>        await callDesktopLlmProvider({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 298 | <code>            provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 299 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 300 | <code>            apiKey: 'deepseek-secret',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 301 | <code>            model: 'deepseek-v4-flash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 302 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 303 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 304 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 305 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 306 | <code>                    role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 307 | <code>                    content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 308 | <code>                    providerMetadata: first.providerMessage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 309 | <code>                    toolCalls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 310 | <code>                        id: 'call-chat-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 311 | <code>                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 312 | <code>                        function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 313 | <code>                            name: 'inspect_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 314 | <code>                            arguments: JSON.stringify({ ok: true })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 315 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 319 | <code>                    role: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 320 | <code>                    toolCallId: 'call-chat-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 321 | <code>                    content: 'Status: completed\nOutput:\n{}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 322 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>                { role: 'user', content: 'continue' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 324 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 327 | <code>        assert.equal(receivedRequest.body.messages[0].reasoning_content, 'think-before-tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 328 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>    it('does not send provider reasoning metadata to unrelated OpenAI-compatible endpoints', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 331 | <code>        await callDesktopLlmProvider({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 332 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 333 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 334 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 335 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 336 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 337 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 338 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 339 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 340 | <code>                    role: 'assistant',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 341 | <code>                    content: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 342 | <code>                    providerMetadata: { reasoning_content: 'do-not-send' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 343 | <code>                    toolCalls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 344 | <code>                        id: 'call-chat-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 345 | <code>                        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 346 | <code>                        function: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 347 | <code>                            name: 'inspect_file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 348 | <code>                            arguments: '{}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 349 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 353 | <code>                    role: 'tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 354 | <code>                    toolCallId: 'call-chat-1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 355 | <code>                    content: 'Status: completed\nOutput:\n{}'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 356 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>                { role: 'user', content: 'continue' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 358 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>        assert.equal(Object.prototype.hasOwnProperty.call(receivedRequest.body.messages[0], 'reasoning_content'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 362 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>    it('accepts a full chat completions URL without duplicating the path', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 365 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 366 | <code>            buildChatCompletionsUrl('https://example.test/v1/chat/completions'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 367 | <code>            'https://example.test/v1/chat/completions'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 368 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>    it('returns a config error before any network call when settings are incomplete', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 372 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 373 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 374 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 375 | <code>            model: 'demo-model'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 376 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 377 | <code>            messages: [{ role: 'user', content: '你好' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 378 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 380 | <code>        assert.equal(result.ok, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 381 | <code>        assert.equal(result.code, 'needs_config');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 382 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>    it('classifies low-level fetch failures as transient network errors', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 385 | <code>        const result = classifyFetchFailure(Object.assign(new Error('fetch failed'), {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 386 | <code>            cause: { code: 'ECONNRESET', message: 'socket hang up' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 387 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>        assert.equal(result.code, 'transient_network_error');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 390 | <code>        assert.equal(result.details.causeCode, 'ECONNRESET');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 391 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>    it('calls a vLLM OpenAI-compatible endpoint without requiring an API key', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 394 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 395 | <code>            provider: 'vllm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 396 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 397 | <code>            model: 'demo-local-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 398 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 399 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 400 | <code>            messages: [{ role: 'user', content: '你好' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 401 | <code>            temperature: 0.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 402 | <code>            parallel_tool_calls: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 403 | <code>            reasoning_effort: 'low',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 404 | <code>            max_completion_tokens: 128,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 405 | <code>            service_tier: 'default'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 406 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 409 | <code>        assert.equal(result.provider, 'vllm');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 410 | <code>        assert.equal(result.content, '[action:wave][expression:happy]你好呀');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 411 | <code>        assert.equal(receivedRequest.url, '/v1/chat/completions');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 412 | <code>        assert.equal(receivedRequest.authorization, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 413 | <code>        assert.equal(receivedRequest.body.model, 'demo-local-model');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 414 | <code>        assert.equal(receivedRequest.body.temperature, 0.2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 415 | <code>        assert.equal('parallel_tool_calls' in receivedRequest.body, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 416 | <code>        assert.equal('reasoning_effort' in receivedRequest.body, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 417 | <code>        assert.equal('max_completion_tokens' in receivedRequest.body, false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 418 | <code>        assert.equal('service_tier' in receivedRequest.body, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 419 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>    it('calls an Ollama /api/chat endpoint without requiring an API key', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 422 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 423 | <code>            buildOllamaChatUrl('http://127.0.0.1:11434'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 424 | <code>            'http://127.0.0.1:11434/api/chat'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 425 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 427 | <code>            buildOllamaChatUrl('http://127.0.0.1:11434/api'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 428 | <code>            'http://127.0.0.1:11434/api/chat'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 429 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 431 | <code>            provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 432 | <code>            baseUrl: serverUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 433 | <code>            model: 'llama3.2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 434 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 435 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 436 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 437 | <code>                { role: 'system', content: 'persona' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 438 | <code>                { role: 'user', content: '你好' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 439 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 440 | <code>            temperature: 0.3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 441 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 444 | <code>        assert.equal(result.provider, 'ollama');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 445 | <code>        assert.equal(result.content, '本地 Ollama OK');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 446 | <code>        assert.equal(receivedRequest.url, '/api/chat');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 447 | <code>        assert.equal(receivedRequest.authorization, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 448 | <code>        assert.equal(receivedRequest.body.model, 'llama3.2');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 449 | <code>        assert.equal(receivedRequest.body.stream, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 450 | <code>        assert.equal(receivedRequest.body.think, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 451 | <code>        assert.deepEqual(receivedRequest.body.messages, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 452 | <code>            { role: 'system', content: 'persona' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 453 | <code>            { role: 'user', content: '你好' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 454 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>        assert.equal(receivedRequest.body.options.temperature, 0.3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 456 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 458 | <code>    it('limits Ollama output when maxTokens or max_tokens is provided', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 459 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 460 | <code>            provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 461 | <code>            baseUrl: serverUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 462 | <code>            model: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 463 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 464 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 465 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 466 | <code>                { role: 'user', content: 'OK' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 467 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>            temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 469 | <code>            maxTokens: 16</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 470 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 473 | <code>        assert.equal(receivedRequest.url, '/api/chat');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 474 | <code>        assert.equal(receivedRequest.body.think, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 475 | <code>        assert.equal(receivedRequest.body.options.num_predict, 16);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>        const snakeCaseResult = await callDesktopLlmProvider({</code> | 声明局部标识符 `snakeCaseResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 478 | <code>            provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 479 | <code>            baseUrl: serverUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 480 | <code>            model: 'qwen3.5:4b',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 481 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 482 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 483 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 484 | <code>                { role: 'user', content: 'OK' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 485 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>            temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 487 | <code>            max_tokens: 24</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 488 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 490 | <code>        assert.equal(snakeCaseResult.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 491 | <code>        assert.equal(receivedRequest.body.options.num_predict, 24);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 492 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>    it('passes image inputs through as OpenAI-compatible content parts', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 495 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 496 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 497 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 498 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 499 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 500 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 501 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 502 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 503 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 504 | <code>                    role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 505 | <code>                    content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 506 | <code>                        { type: 'text', text: '请看这张截图。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 507 | <code>                        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 508 | <code>                            type: 'image_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 509 | <code>                            image_url: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 510 | <code>                                url: 'data:image/png;base64,AAAA'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 511 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 513 | <code>                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 518 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 519 | <code>        assert.deepEqual(receivedRequest.body.messages, [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 520 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 521 | <code>                role: 'user',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 522 | <code>                content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 523 | <code>                    { type: 'text', text: '请看这张截图。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 524 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 525 | <code>                        type: 'image_url',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 526 | <code>                        image_url: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 527 | <code>                            url: 'data:image/png;base64,AAAA'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 528 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 532 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 533 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 535 | <code>    it('passes response_format for OpenAI-compatible JSON mode', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 536 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 537 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 538 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 539 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 540 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 541 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 542 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 543 | <code>            jsonMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 544 | <code>            messages: [{ role: 'user', content: 'Return JSON.' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 545 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 548 | <code>        assert.equal(result.content, '{"ok":true,"kind":"json"}');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 549 | <code>        assert.deepEqual(receivedRequest.body.response_format, { type: 'json_object' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 550 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 552 | <code>    it('passes low-latency reasoning controls for OpenAI-compatible requests when explicitly provided', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 553 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 554 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 555 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 556 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 557 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 558 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 559 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 560 | <code>            messages: [{ role: 'user', content: 'Return OK.' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 561 | <code>            temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 562 | <code>            reasoning_effort: 'minimal',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 563 | <code>            thinking: { type: 'disabled' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 564 | <code>            max_tokens: 2048,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 565 | <code>            parallel_tool_calls: true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 566 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 569 | <code>        assert.equal(receivedRequest.body.temperature, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 570 | <code>        assert.equal(receivedRequest.body.reasoning_effort, 'minimal');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 571 | <code>        assert.deepEqual(receivedRequest.body.thinking, { type: 'disabled' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 572 | <code>        assert.equal(receivedRequest.body.max_tokens, 2048);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 573 | <code>        assert.equal(receivedRequest.body.parallel_tool_calls, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 574 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>    it('passes tool_choice none while preserving tool schemas for finalization', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 577 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 578 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 579 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 580 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 581 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 582 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 583 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 584 | <code>            messages: [{ role: 'user', content: 'Finalize from current evidence.' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 585 | <code>            tools: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 586 | <code>                name: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 587 | <code>                description: 'Fetch a page.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 588 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 589 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 590 | <code>                    properties: { url: { type: 'string' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 591 | <code>                    required: ['url'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 592 | <code>                    additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 593 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>            }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>            toolChoice: 'none'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 596 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 598 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 599 | <code>        assert.equal(receivedRequest.body.tool_choice, 'none');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 600 | <code>        assert.equal(receivedRequest.body.tools[0].function.name, 'web_fetch');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 601 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>    it('extracts OpenAI-compatible native tool calls', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 604 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 605 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 606 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 607 | <code>            apiKey: 'test-secret-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 608 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 609 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 610 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 611 | <code>            tools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 612 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 613 | <code>                    name: 'demo_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 614 | <code>                    description: 'demo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 615 | <code>                    parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 616 | <code>                        type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 617 | <code>                        properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 618 | <code>                            ok: { type: 'boolean' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 619 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 621 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>            toolChoice: { name: 'demo_tool', required: true },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 624 | <code>            messages: [{ role: 'user', content: 'Use tool.' }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 625 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 626 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 627 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 628 | <code>        assert.equal(result.nativeToolCalls, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 629 | <code>        assert.equal(result.toolCalls[0].name, 'demo_tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 630 | <code>        assert.deepEqual(result.toolCalls[0].arguments, { ok: true, kind: 'tool' });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 631 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 633 | <code>    it('supports OpenAI Responses adapter request and function-call extraction', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 634 | <code>        assert.equal(buildResponsesUrl(`${serverUrl}/v1`), `${serverUrl}/v1/responses`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 635 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 636 | <code>            provider: 'openai-responses',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 637 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 638 | <code>            apiKey: 'openai-test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 639 | <code>            model: 'gpt-demo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 640 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 641 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 642 | <code>            tools: [{ name: 'demo_tool', description: 'demo', parameters: { type: 'object' } }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 643 | <code>            toolChoice: { name: 'demo_tool', required: true },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 644 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 645 | <code>                { role: 'system', content: 'system' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 646 | <code>                { role: 'user', content: 'Use tool.' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 647 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 651 | <code>        assert.equal(receivedRequest.url, '/v1/responses');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 652 | <code>        assert.equal(receivedRequest.authorization, 'Bearer openai-test-key');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 653 | <code>        assert.equal(receivedRequest.body.instructions, 'system');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 654 | <code>        assert.equal(result.toolCalls[0].name, 'demo_tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 655 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>    it('supports Anthropic adapter request and tool-use extraction', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 658 | <code>        assert.equal(buildAnthropicMessagesUrl(`${serverUrl}/v1`), `${serverUrl}/v1/messages`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 659 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 660 | <code>            provider: 'anthropic',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 661 | <code>            baseUrl: serverUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 662 | <code>            apiKey: 'anthropic-test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 663 | <code>            model: 'claude-demo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 664 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 665 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 666 | <code>            tools: [{ name: 'demo_tool', description: 'demo', parameters: { type: 'object' } }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 667 | <code>            toolChoice: { name: 'demo_tool', required: true },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 668 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 669 | <code>                { role: 'system', content: 'system' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 670 | <code>                { role: 'user', content: 'Use tool.' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 671 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 672 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 673 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 674 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 675 | <code>        assert.equal(receivedRequest.url, '/v1/messages');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 676 | <code>        assert.equal(receivedRequest.xApiKey, 'anthropic-test-key');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 677 | <code>        assert.equal(receivedRequest.body.system, 'system');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 678 | <code>        assert.equal(result.toolCalls[0].name, 'demo_tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 679 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 681 | <code>    it('supports Gemini adapter request and functionCall extraction', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 682 | <code>        assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 683 | <code>            buildGeminiGenerateContentUrl(`${serverUrl}/v1beta`, 'gemini-demo', 'gemini-test-key'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 684 | <code>            `${serverUrl}/v1beta/models/gemini-demo:generateContent?key=gemini-test-key`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 685 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>        const result = await callDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 687 | <code>            provider: 'gemini',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 688 | <code>            baseUrl: `${serverUrl}/v1beta`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 689 | <code>            apiKey: 'gemini-test-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 690 | <code>            model: 'gemini-demo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 691 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 692 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 693 | <code>            tools: [{ name: 'demo_tool', description: 'demo', parameters: { type: 'object' } }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 694 | <code>            toolChoice: { name: 'demo_tool', required: true },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 695 | <code>            messages: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 696 | <code>                { role: 'system', content: 'system' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 697 | <code>                { role: 'user', content: 'Use tool.' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 698 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 699 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 701 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 702 | <code>        assert.ok(receivedRequest.url.startsWith('/v1beta/models/gemini-demo:generateContent'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 703 | <code>        assert.deepEqual(receivedRequest.body.systemInstruction, { parts: [{ text: 'system' }] });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 704 | <code>        assert.equal(result.toolCalls[0].name, 'demo_tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 705 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 706 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 707 | <code>    it('runs provider health checks without exposing API keys', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 708 | <code>        const result = await checkDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 709 | <code>            provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 710 | <code>            baseUrl: `${serverUrl}/v1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 711 | <code>            apiKey: 'secret-health-key',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 712 | <code>            model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 713 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 714 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 715 | <code>            includeVision: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 716 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 719 | <code>        assert.equal(result.checks.basic.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 720 | <code>        assert.equal(result.checks.json.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 721 | <code>        assert.equal(result.checks.toolCalling.ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 722 | <code>        assert.equal(JSON.stringify(result).includes('secret-health-key'), false);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 723 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 724 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 725 | <code>    it('runs Ollama health checks while skipping unsupported native tool calling', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 726 | <code>        const result = await checkDesktopLlmProvider({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 727 | <code>            provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 728 | <code>            baseUrl: serverUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 729 | <code>            model: 'llama3.2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 730 | <code>            timeoutMs: 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 731 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 732 | <code>            includeVision: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 733 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>        assert.equal(result.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 736 | <code>        assert.equal(result.checks.basic.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 737 | <code>        assert.equal(result.checks.json.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 738 | <code>        assert.equal(result.checks.toolCalling.skipped, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 739 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 740 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 741 | <code>    it('reports model capability heuristics', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 742 | <code>        const caps = getProviderCapabilities({</code> | 声明局部标识符 `caps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 743 | <code>            provider: 'gemini',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 744 | <code>            model: 'gemini-2.0-flash'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 745 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 746 | <code>        assert.equal(caps.nativeToolCalling, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 747 | <code>        assert.equal(caps.vision, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 748 | <code>        assert.equal(caps.lowLatency, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 749 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 750 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 751 | <code>    it('keeps OpenAI-compatible preset providers distinct while using chat completions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 752 | <code>        const providers = [</code> | 声明局部标识符 `providers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 753 | <code>            ['doubao', 'https://ark.cn-beijing.volces.com/api/v3'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 754 | <code>            ['deepseek', 'https://api.deepseek.com'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 755 | <code>            ['qwen', 'https://dashscope.aliyuncs.com/compatible-mode/v1'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 756 | <code>            ['kimi', 'https://api.moonshot.cn/v1'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 757 | <code>            ['zhipu', 'https://open.bigmodel.cn/api/paas/v4'],</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 758 | <code>            ['openrouter', 'https://openrouter.ai/api/v1']</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 759 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 760 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 761 | <code>        for (const [provider, baseUrl] of providers) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 762 | <code>            const caps = getProviderCapabilities({</code> | 声明局部标识符 `caps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 763 | <code>                provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 764 | <code>                model: provider === 'deepseek' ? 'deepseek-v4-flash' : 'qwen-turbo'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 765 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>            assert.equal(caps.provider, provider);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 767 | <code>            assert.equal(caps.transport, 'chat-completions');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 768 | <code>            assert.equal(getDefaultProviderBaseUrl(provider), baseUrl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 769 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 770 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 771 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 772 | <code>    it('reports local provider capabilities as model-dependent without native tool forcing', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 773 | <code>        const ollamaCaps = getProviderCapabilities({</code> | 声明局部标识符 `ollamaCaps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 774 | <code>            provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 775 | <code>            model: 'llama3.2'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 776 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>        const vllmCaps = getProviderCapabilities({</code> | 声明局部标识符 `vllmCaps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 778 | <code>            provider: 'vllm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 779 | <code>            model: 'Qwen/Qwen2.5-7B-Instruct'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 780 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>        assert.equal(ollamaCaps.chat, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 783 | <code>        assert.equal(ollamaCaps.jsonMode, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 784 | <code>        assert.equal(ollamaCaps.nativeToolCalling, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 785 | <code>        assert.equal(vllmCaps.chat, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 786 | <code>        assert.equal(vllmCaps.jsonMode, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 787 | <code>        assert.equal(vllmCaps.nativeToolCalling, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 desktop-llm-provider 的契约与回归行为。”这一文件职责。 |
| 788 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
