# src/ailis-hosted-gateway-client.js 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。
- 文件类型：`source-code`
- 原始行数：343
- SHA-256：`47b1a40b89478e60dffe57e493c8afca7106c897576f30d0f57c30ed31306b85`
- 可运行副本：[打开源文件](../../../source/src/ailis-hosted-gateway-client.js)
- 依赖：`./config.js`
- 主要符号：`SESSION_STORAGE_KEY`、`EVENT_POLL_INTERVAL_MS`、`STATUS_CACHE_TTL_MS`、`normalizeBaseUrl`、`parseErrorResponse`、`payload`、`readAgentRunEventStream`、`reader`、`decoder`、`buffer`、`eventName`、`dataLines`、`finalResult`、`streamError`、`dispatchEvent`、`rawData`、`currentEvent`、`delta`、`consumeLine`、`lines`、`AILISHostedGatewayClient`、`response`、`previousSessionId`、`now`、`status`、`value`、`poll`、`delay`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import { CONFIG } from './config.js';</code> | 导入依赖 `./config.js`，使本文件可以复用外部模块能力。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const SESSION_STORAGE_KEY = 'ailis_hosted_web_session.v1';</code> | 声明局部标识符 `SESSION_STORAGE_KEY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 4 | <code>const EVENT_POLL_INTERVAL_MS = 650;</code> | 声明局部标识符 `EVENT_POLL_INTERVAL_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 5 | <code>const STATUS_CACHE_TTL_MS = 5 * 60 * 1000;</code> | 声明局部标识符 `STATUS_CACHE_TTL_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>function normalizeBaseUrl(value = '') {</code> | 定义函数 `normalizeBaseUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 8 | <code>    return String(value &#124;&#124; '').trim().replace(/\/+$/, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 9 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>async function parseErrorResponse(response) {</code> | 定义函数 `parseErrorResponse`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 12 | <code>    const payload = await response.json().catch(() =&gt; null);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 13 | <code>    return payload?.detail &#124;&#124; payload?.error &#124;&#124; `HTTP ${response.status}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 14 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>async function readAgentRunEventStream(response, options = {}) {</code> | 定义函数 `readAgentRunEventStream`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 17 | <code>    if (!response.body) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 18 | <code>        throw new Error('Hosted Runtime 没有返回可读取的回答流。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 19 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>    const reader = response.body.getReader();</code> | 声明局部标识符 `reader`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 21 | <code>    const decoder = new TextDecoder('utf-8');</code> | 声明局部标识符 `decoder`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 22 | <code>    let buffer = '';</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 23 | <code>    let eventName = 'message';</code> | 声明局部标识符 `eventName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 24 | <code>    let dataLines = [];</code> | 声明局部标识符 `dataLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 25 | <code>    let finalResult = null;</code> | 声明局部标识符 `finalResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 26 | <code>    let streamError = null;</code> | 声明局部标识符 `streamError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>    const dispatchEvent = async () =&gt; {</code> | 声明局部标识符 `dispatchEvent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 29 | <code>        if (!dataLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 30 | <code>            eventName = 'message';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 31 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 32 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>        const rawData = dataLines.join('\n');</code> | 声明局部标识符 `rawData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 34 | <code>        const currentEvent = eventName;</code> | 声明局部标识符 `currentEvent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 35 | <code>        eventName = 'message';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 36 | <code>        dataLines = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 37 | <code>        const payload = JSON.parse(rawData);</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 38 | <code>        if (currentEvent === 'response.output_text.delta') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 39 | <code>            const delta = typeof payload.delta === 'string' ? payload.delta : '';</code> | 声明局部标识符 `delta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 40 | <code>            if (delta &amp;&amp; typeof options.onTextDelta === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 41 | <code>                await options.onTextDelta(delta, payload);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 42 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>        if ([</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 46 | <code>            'response.output_text.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 47 | <code>            'response.output_text.committed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 48 | <code>            'response.output_text.discarded'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 49 | <code>        ].includes(currentEvent)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 50 | <code>            if (typeof options.onTextStreamEvent === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>                await options.onTextStreamEvent(currentEvent, payload);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 52 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 54 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>        if (currentEvent === 'response.completed') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 56 | <code>            finalResult = payload.result &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 57 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 58 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>        if (currentEvent === 'response.error') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>            streamError = new Error(payload.error &#124;&#124; 'Hosted Runtime 回答流失败。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 61 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>    const consumeLine = async (line) =&gt; {</code> | 声明局部标识符 `consumeLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 65 | <code>        if (!line) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 66 | <code>            await dispatchEvent();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 67 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 68 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>        if (line.startsWith('event:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 70 | <code>            eventName = line.slice(6).trim() &#124;&#124; 'message';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 71 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 72 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>        if (line.startsWith('data:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 74 | <code>            dataLines.push(line.slice(5).replace(/^ /, ''));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 75 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>    while (true) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 79 | <code>        const { done, value } = await reader.read();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 80 | <code>        if (done) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 81 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 82 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>        buffer += decoder.decode(value, { stream: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 84 | <code>        const lines = buffer.split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 85 | <code>        buffer = lines.pop() &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 86 | <code>        for (const line of lines) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 87 | <code>            await consumeLine(line);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 88 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    buffer += decoder.decode();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 91 | <code>    if (buffer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 92 | <code>        await consumeLine(buffer);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 93 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    await dispatchEvent();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 95 | <code>    if (streamError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 96 | <code>        throw streamError;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 97 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>    if (!finalResult) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 99 | <code>        throw new Error('Hosted Runtime 回答流在返回最终结果前中断。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 100 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>    return finalResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 102 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>export class AILISHostedGatewayClient {</code> | 定义类 `AILISHostedGatewayClient`，把相关状态与行为收拢为一个运行时对象。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 105 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 106 | <code>        this.baseUrl = normalizeBaseUrl(options.baseUrl &#124;&#124; CONFIG.BACKEND_BASE_URL);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 107 | <code>        this.isSupported = Boolean(this.baseUrl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 108 | <code>        this.sessionToken = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 109 | <code>        this.sessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 110 | <code>        this.sessionPromise = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 111 | <code>        this.supportsAnswerStreaming = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 112 | <code>        this.statusCacheTtlMs = Number.isFinite(Number(options.statusCacheTtlMs))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 113 | <code>            ? Math.max(1000, Number(options.statusCacheTtlMs))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 114 | <code>            : STATUS_CACHE_TTL_MS;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 115 | <code>        this.statusCache = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 116 | <code>        this.statusPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 117 | <code>        this.listeners = new Set();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 118 | <code>        this.eventCursor = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 119 | <code>        this.pollTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 120 | <code>        this.polling = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 121 | <code>        this.pollFailureCount = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 122 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 123 | <code>            this.sessionToken = window.localStorage?.getItem(SESSION_STORAGE_KEY) &#124;&#124; '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 124 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 125 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>    async ensureSession({ forceNew = false } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 128 | <code>        if (forceNew) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 129 | <code>            this.sessionToken = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 130 | <code>            this.sessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 131 | <code>            this.invalidateStatusCache();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 132 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 133 | <code>                window.localStorage?.removeItem(SESSION_STORAGE_KEY);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 134 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 135 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>        if (this.sessionToken &amp;&amp; this.sessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 137 | <code>            return { token: this.sessionToken, sessionId: this.sessionId };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>        if (this.sessionPromise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 140 | <code>            return await this.sessionPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 141 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>        this.sessionPromise = (async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 143 | <code>            const response = await fetch(`${this.baseUrl}/api/agent/session`, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 144 | <code>                method: 'GET',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 145 | <code>                cache: 'no-store',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 146 | <code>                headers: this.sessionToken</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 147 | <code>                    ? { 'x-ailis-web-session': this.sessionToken }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 148 | <code>                    : {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 149 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>            if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 151 | <code>                throw new Error(await parseErrorResponse(response));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 152 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>            const payload = await response.json();</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 154 | <code>            const previousSessionId = this.sessionId;</code> | 声明局部标识符 `previousSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 155 | <code>            this.sessionToken = String(payload.token &#124;&#124; '');</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 156 | <code>            this.sessionId = String(payload.sessionId &#124;&#124; '');</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 157 | <code>            if (!this.sessionToken &#124;&#124; !this.sessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 158 | <code>                throw new Error('Hosted Runtime 没有返回有效网页会话。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 159 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 161 | <code>                window.localStorage?.setItem(SESSION_STORAGE_KEY, this.sessionToken);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 162 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 163 | <code>            if (previousSessionId &amp;&amp; previousSessionId !== this.sessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 164 | <code>                this.invalidateStatusCache();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 165 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>            return { token: this.sessionToken, sessionId: this.sessionId };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 167 | <code>        })();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 168 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 169 | <code>            return await this.sessionPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 170 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 171 | <code>            this.sessionPromise = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 172 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 175 | <code>    invalidateStatusCache() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 176 | <code>        this.statusCache = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 177 | <code>        this.statusPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 178 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>    async requestResponse(path, options = {}, retrySession = true) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 181 | <code>        await this.ensureSession();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 182 | <code>        const response = await fetch(`${this.baseUrl}${path}`, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 183 | <code>            ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 184 | <code>            cache: 'no-store',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 185 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 186 | <code>                accept: 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 187 | <code>                'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 188 | <code>                'x-ailis-web-session': this.sessionToken,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 189 | <code>                ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>        if (response.status === 401 &amp;&amp; retrySession) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 193 | <code>            await this.ensureSession({ forceNew: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 194 | <code>            return await this.requestResponse(path, options, false);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 195 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 197 | <code>            throw new Error(await parseErrorResponse(response));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 198 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>        return response;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 200 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>    async request(path, options = {}, retrySession = true) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 203 | <code>        const response = await this.requestResponse(path, options, retrySession);</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 204 | <code>        return await response.json();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>    async getStatus({ force = false } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 208 | <code>        const now = Date.now();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 209 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>            !force &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 211 | <code>            this.statusCache?.sessionId === this.sessionId &amp;&amp;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 212 | <code>            this.statusCache.expiresAt &gt; now</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 213 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 214 | <code>            return this.statusCache.value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 215 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>        if (!force &amp;&amp; this.statusPromise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 217 | <code>            return await this.statusPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 218 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>        this.statusPromise = (async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 220 | <code>            const status = await this.request('/api/agent/status', {</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 221 | <code>                method: 'GET',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 222 | <code>                headers: { 'content-type': 'application/json' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 223 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>            const value = {</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 225 | <code>                ...status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 226 | <code>                running: status.running !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 227 | <code>                runtime: 'ailis-hosted'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 228 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>            this.statusCache = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 230 | <code>                sessionId: this.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 231 | <code>                expiresAt: Date.now() + this.statusCacheTtlMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 232 | <code>                value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 233 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>            return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 235 | <code>        })();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 236 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 237 | <code>            return await this.statusPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 238 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 239 | <code>            this.invalidateStatusCache();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 240 | <code>            throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 241 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 242 | <code>            this.statusPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 243 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>    async runAgent(payload = {}, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 247 | <code>        this.startPolling();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 248 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 249 | <code>            const response = await this.requestResponse('/api/agent/run', {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 250 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 251 | <code>                headers: { accept: 'text/event-stream' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 252 | <code>                body: JSON.stringify(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 253 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>            if (/text\/event-stream/i.test(response.headers.get('content-type') &#124;&#124; '')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 255 | <code>                return await readAgentRunEventStream(response, options);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 256 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>            return await response.json();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 258 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 259 | <code>            this.invalidateStatusCache();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 260 | <code>            throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 261 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>    async interruptAgentRun(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 265 | <code>        return await this.request('/api/agent/interrupt', {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 266 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 267 | <code>            body: JSON.stringify(payload &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 268 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>    onEvent(listener) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 272 | <code>        if (typeof listener !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 273 | <code>            return () =&gt; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 274 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>        this.listeners.add(listener);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 276 | <code>        this.startPolling();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 277 | <code>        return () =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 278 | <code>            this.listeners.delete(listener);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 279 | <code>            if (!this.listeners.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 280 | <code>                this.stopPolling();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 281 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>    startPolling() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 286 | <code>        if (this.pollTimer &#124;&#124; this.polling &#124;&#124; !this.listeners.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 287 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 288 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>        const poll = async () =&gt; {</code> | 声明局部标识符 `poll`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 290 | <code>            if (!this.listeners.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 291 | <code>                this.stopPolling();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 292 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 293 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>            this.polling = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 295 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 296 | <code>                const payload = await this.request(</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 297 | <code>                    `/api/agent/events?cursor=${this.eventCursor}&amp;limit=160`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 298 | <code>                    { method: 'GET', headers: { 'content-type': 'application/json' } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 299 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>                for (const event of Array.isArray(payload.events) ? payload.events : []) {</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 301 | <code>                    for (const listener of [...this.listeners]) {</code> | 声明局部标识符 `listener`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 302 | <code>                        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 303 | <code>                            listener(event);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 304 | <code>                        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 305 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>                this.eventCursor = Math.max(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 308 | <code>                    this.eventCursor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 309 | <code>                    Number(payload.latestSeq) &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 310 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>                this.pollFailureCount = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 312 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 313 | <code>                this.pollFailureCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 314 | <code>            } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 315 | <code>                this.polling = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 316 | <code>                if (this.listeners.size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 317 | <code>                    const delay = Math.min(</code> | 声明局部标识符 `delay`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 318 | <code>                        5000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 319 | <code>                        EVENT_POLL_INTERVAL_MS * Math.max(1, this.pollFailureCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 320 | <code>                    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>                    this.pollTimer = window.setTimeout(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 322 | <code>                        this.pollTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 323 | <code>                        void poll();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 324 | <code>                    }, delay);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 325 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>        void poll();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 329 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 331 | <code>    stopPolling() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 332 | <code>        if (this.pollTimer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 333 | <code>            window.clearTimeout(this.pollTimer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 334 | <code>            this.pollTimer = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 335 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 336 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>export {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 340 | <code>    SESSION_STORAGE_KEY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 341 | <code>    STATUS_CACHE_TTL_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 342 | <code>    readAgentRunEventStream</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Gateway 边界：统一工具发现、调用、审批、事件、审计或 Hosted Runtime 通信。”这一文件职责。 |
| 343 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
