# scripts/start-ailis-hosted-runtime.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。
- 文件类型：`source-code`
- 原始行数：188
- SHA-256：`5258aee2722cbeccdcec62e6af77751ff2ce02a8b17e32beb9869d35aa8c90b5`
- 可运行副本：[打开源文件](../../../source/scripts/start-ailis-hosted-runtime.cjs)
- 依赖：`http`、`../electron/ailis-hosted-runtime.cjs`
- 主要符号：`http`、`host`、`port`、`internalToken`、`manager`、`sendJson`、`body`、`acceptsEventStream`、`startEventStream`、`writeEventStream`、`readJson`、`chunks`、`total`、`authorize`、`server`、`url`、`sequence`、`keepAlive`、`result`、`eventType`、`payload`、`evictionTimer`、`shutdown`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const http = require('http');</code> | 导入依赖 `http`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 4 | <code>const { AILISHostedRuntimeManager } = require('../electron/ailis-hosted-runtime.cjs');</code> | 导入依赖 `../electron/ailis-hosted-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const host = process.env.AILIS_HOSTED_RUNTIME_HOST &#124;&#124; '127.0.0.1';</code> | 声明局部标识符 `host`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 7 | <code>const port = Math.max(1, Math.min(Number(process.env.AILIS_HOSTED_RUNTIME_PORT) &#124;&#124; 18777, 65535));</code> | 声明局部标识符 `port`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 8 | <code>const internalToken = String(process.env.AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN &#124;&#124; '').trim();</code> | 声明局部标识符 `internalToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 9 | <code>const manager = new AILISHostedRuntimeManager();</code> | 声明局部标识符 `manager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>function sendJson(res, statusCode, payload) {</code> | 定义函数 `sendJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 12 | <code>    const body = Buffer.from(JSON.stringify(payload));</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 13 | <code>    res.writeHead(statusCode, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 14 | <code>        'content-type': 'application/json; charset=utf-8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 15 | <code>        'content-length': body.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 16 | <code>        'cache-control': 'no-store'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 17 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 18 | <code>    res.end(body);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 19 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>function acceptsEventStream(req) {</code> | 定义函数 `acceptsEventStream`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 22 | <code>    return /(?:^&#124;,)\s*text\/event-stream(?:\s*;&#124;\s*,&#124;$)/i.test(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 23 | <code>        String(req.headers.accept &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 24 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>function startEventStream(res) {</code> | 定义函数 `startEventStream`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 28 | <code>    res.writeHead(200, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 29 | <code>        'content-type': 'text/event-stream; charset=utf-8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 30 | <code>        'cache-control': 'no-cache, no-transform',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 31 | <code>        connection: 'keep-alive',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 32 | <code>        'x-accel-buffering': 'no'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 33 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    res.flushHeaders?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 35 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 37 | <code>function writeEventStream(res, event, payload) {</code> | 定义函数 `writeEventStream`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 38 | <code>    if (res.destroyed &#124;&#124; res.writableEnded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 39 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 42 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 45 | <code>async function readJson(req) {</code> | 定义函数 `readJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 46 | <code>    const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 47 | <code>    let total = 0;</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 48 | <code>    for await (const chunk of req) {</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 49 | <code>        total += chunk.length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 50 | <code>        if (total &gt; 4 * 1024 * 1024) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>            throw Object.assign(new Error('payload_too_large'), { statusCode: 413 });</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 52 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>        chunks.push(chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 54 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>    if (!chunks.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 56 | <code>        return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>    return JSON.parse(Buffer.concat(chunks).toString('utf8'));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 59 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>function authorize(req) {</code> | 定义函数 `authorize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 62 | <code>    if (!internalToken) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 63 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    return String(req.headers['x-ailis-internal-token'] &#124;&#124; '') === internalToken;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 66 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>const server = http.createServer(async (req, res) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 69 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 70 | <code>        const url = new URL(req.url &#124;&#124; '/', `http://${host}`);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 71 | <code>        if (url.pathname === '/health' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 72 | <code>            sendJson(res, 200, manager.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 73 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 74 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>        if (!authorize(req)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 76 | <code>            sendJson(res, 401, { ok: false, status: 'unauthorized' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 77 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>        if (url.pathname === '/tenant/status' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 80 | <code>            sendJson(res, 200, await manager.getTenantStatus(url.searchParams.get('tenantId') &#124;&#124; ''));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 81 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 82 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>        if (url.pathname === '/events/recent' &amp;&amp; req.method === 'GET') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 84 | <code>            sendJson(res, 200, manager.getEvents(url.searchParams.get('tenantId') &#124;&#124; '', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 85 | <code>                cursor: url.searchParams.get('cursor'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 86 | <code>                limit: url.searchParams.get('limit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 87 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 89 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>        if (url.pathname === '/agent/run' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 91 | <code>            const body = await readJson(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 92 | <code>            if (!acceptsEventStream(req)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 93 | <code>                sendJson(res, 200, await manager.runAgent(body.tenantId, body.payload &#124;&#124; {}));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 94 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 95 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>            startEventStream(res);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 98 | <code>            let sequence = 0;</code> | 声明局部标识符 `sequence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 99 | <code>            writeEventStream(res, 'response.started', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 100 | <code>                sequence,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 101 | <code>                runtime: 'ailis-hosted'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 102 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>            const keepAlive = setInterval(() =&gt; {</code> | 声明局部标识符 `keepAlive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 104 | <code>                if (!res.destroyed &amp;&amp; !res.writableEnded) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 105 | <code>                    res.write(': keep-alive\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 106 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>            }, 15000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 108 | <code>            keepAlive.unref?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 109 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 110 | <code>                const result = await manager.runAgent(</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 111 | <code>                    body.tenantId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 112 | <code>                    body.payload &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 113 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 114 | <code>                        onTextDelta: (delta, metadata = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 115 | <code>                            sequence += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 116 | <code>                            writeEventStream(res, 'response.output_text.delta', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 117 | <code>                                sequence,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 118 | <code>                                delta,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 119 | <code>                                metadata</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 120 | <code>                            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>                        onTextStreamEvent: (streamEvent = {}) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 123 | <code>                            const eventType = String(streamEvent.type &#124;&#124; '');</code> | 声明局部标识符 `eventType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 124 | <code>                            if (![</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 125 | <code>                                'response.output_text.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 126 | <code>                                'response.output_text.committed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 127 | <code>                                'response.output_text.discarded'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 128 | <code>                            ].includes(eventType)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 129 | <code>                                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 130 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>                            sequence += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 132 | <code>                            writeEventStream(res, eventType, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 133 | <code>                                sequence,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 134 | <code>                                ...streamEvent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 135 | <code>                            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>                sequence += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 140 | <code>                writeEventStream(res, 'response.completed', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 141 | <code>                    sequence,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 142 | <code>                    result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 143 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>            } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 145 | <code>                clearInterval(keepAlive);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 146 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>            res.end();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 148 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 149 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>        if (url.pathname === '/agent/interrupt' &amp;&amp; req.method === 'POST') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 151 | <code>            const body = await readJson(req);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 152 | <code>            sendJson(res, 200, await manager.interruptAgentRun(body.tenantId, body.payload &#124;&#124; {}));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 153 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 154 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>        sendJson(res, 404, { ok: false, status: 'not_found' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 156 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 157 | <code>        const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 158 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 159 | <code>            status: error.message === 'tenant_id_invalid' ? 'tenant_id_invalid' : 'hosted_runtime_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 160 | <code>            error: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 161 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>        if (res.headersSent) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 163 | <code>            writeEventStream(res, 'response.error', payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 164 | <code>            res.end();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 165 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 166 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>        sendJson(res, error.statusCode &#124;&#124; 500, payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 168 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 171 | <code>const evictionTimer = setInterval(() =&gt; {</code> | 声明局部标识符 `evictionTimer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 172 | <code>    void manager.evictIdleRuntimes();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 173 | <code>}, 60000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 174 | <code>evictionTimer.unref?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>async function shutdown() {</code> | 定义函数 `shutdown`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 177 | <code>    clearInterval(evictionTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 178 | <code>    await manager.close();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 179 | <code>    server.close(() =&gt; process.exit(0));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 180 | <code>    setTimeout(() =&gt; process.exit(1), 5000).unref?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 181 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 183 | <code>process.on('SIGINT', () =&gt; void shutdown());</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 184 | <code>process.on('SIGTERM', () =&gt; void shutdown());</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 185 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 186 | <code>server.listen(port, host, () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 187 | <code>    process.stdout.write(`AILIS hosted runtime listening on http://${host}:${port}\n`);</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 188 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
