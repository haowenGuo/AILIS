# electron/ailis-mcp-session.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。
- 文件类型：`source-code`
- 原始行数：1122
- SHA-256：`7a6cec4d1bba9c393573a30c03397073485deffbff4f6b27825c7508da104bd8`
- 可运行副本：[打开源文件](../../../source/electron/ailis-mcp-session.cjs)
- 依赖：`fs`、`path`、`child_process`、`./ailis-tool-contracts.cjs`、`./ailis-mcp-adapter.cjs`、`./ailis-tool-routing.cjs`
- 主要符号：`fs`、`path`、`DEFAULT_MCP_PROTOCOL_VERSION`、`DEFAULT_MCP_TIMEOUT_MS`、`MAX_MCP_TIMEOUT_MS`、`DEFAULT_STDERR_LINES`、`normalizeString`、`trimmed`、`normalizeArray`、`normalizeObject`、`parseJsonConfig`、`redactEnv`、`result`、`redactHeaders`、`normalizeMcpServerEntries`、`parsed`、`publicServerConfig`、`transport`、`schemaPropertyNames`、`properties`、`makeMcpToolSpec`、`server`、`toolName`、`rawInputSchema`、`inputSchema`、`schemaProperties`、`descriptionAddendum`、`buildMcpToolSearchText`、`sanitizeServerConfig`、`clean`、`next`、`configFingerprint`、`parseSseJson`、`events`、`dataLines`、`line`、`parseHttpJsonRpcResponse`、`raw`、`McpStdioSession`、`cwd`、`command`、`args`、`env`、`child`、`onError`、`onSpawn`、`init`、`index`、`lines`、`message`、`pending`、`error`、`id`、`boundedTimeout`、`timer`、`McpHttpSession`、`url`、`headers`、`bearerTokenEnvVar`、`bearerToken`、`controller`、`response`、`sessionId`、`text`、`AILISMcpManager`、`state`、`servers`、`tmpPath`、`entries`、`name`、`removed`、`session`、`config`、`fingerprint`、`SessionClass`、`names`、`results`、`tools`、`grouped`、`specs`、`needle`、`boundedLimit`、`cache`、`tool`、`resourcesResult`、`templatesResult`、`startedAt`、`errors`、`params`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 2 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 3 | <code>const { spawn } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 4 | <code>const { validateAgainstSchema } = require('./ailis-tool-contracts.cjs');</code> | 导入依赖 `./ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 5 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 6 | <code>    buildAilisMcpToolCallArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 7 | <code>    buildAilisMcpToolDescriptionAddendum,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 8 | <code>    createAilisDirectMcpToolSpec,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 9 | <code>    enhanceAilisMcpToolSchema</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 10 | <code>} = require('./ailis-mcp-adapter.cjs');</code> | 导入依赖 `./ailis-mcp-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 12 | <code>    rankToolSearchResults</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 13 | <code>} = require('./ailis-tool-routing.cjs');</code> | 导入依赖 `./ailis-tool-routing.cjs`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>const DEFAULT_MCP_PROTOCOL_VERSION = '2025-06-18';</code> | 声明局部标识符 `DEFAULT_MCP_PROTOCOL_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 16 | <code>const DEFAULT_MCP_TIMEOUT_MS = 30000;</code> | 声明局部标识符 `DEFAULT_MCP_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 17 | <code>const MAX_MCP_TIMEOUT_MS = Math.max(</code> | 声明局部标识符 `MAX_MCP_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 18 | <code>    DEFAULT_MCP_TIMEOUT_MS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 19 | <code>    Number(process.env.AILIS_MCP_MAX_TIMEOUT_MS &#124;&#124; 15 * 60 * 1000)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 20 | <code>);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>const DEFAULT_STDERR_LINES = 40;</code> | 声明局部标识符 `DEFAULT_STDERR_LINES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 24 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 25 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 26 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 28 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>function normalizeArray(value) {</code> | 定义函数 `normalizeArray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 32 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 33 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>    return Array.isArray(value) ? value : [value];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 36 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>function normalizeObject(value) {</code> | 定义函数 `normalizeObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 39 | <code>    return value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value) ? value : {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>function parseJsonConfig(value) {</code> | 定义函数 `parseJsonConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 43 | <code>    if (!value &#124;&#124; typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 44 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 45 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 47 | <code>        return JSON.parse(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 49 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 50 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function redactEnv(env = {}) {</code> | 定义函数 `redactEnv`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 54 | <code>    const result = {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 55 | <code>    for (const [key, value] of Object.entries(env &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 56 | <code>        if (/token&#124;password&#124;secret&#124;api[_-]?key&#124;authorization&#124;credential&#124;pass/i.test(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 57 | <code>            result[key] = '__REDACTED__';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 58 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 59 | <code>            result[key] = String(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 60 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>function redactHeaders(headers = {}) {</code> | 定义函数 `redactHeaders`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 66 | <code>    const result = {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 67 | <code>    for (const [key, value] of Object.entries(headers &#124;&#124; {})) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 68 | <code>        if (/authorization&#124;token&#124;password&#124;secret&#124;api[_-]?key&#124;credential/i.test(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 69 | <code>            result[key] = '__REDACTED__';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 70 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 71 | <code>            result[key] = String(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 72 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>function normalizeMcpServerEntries(value) {</code> | 定义函数 `normalizeMcpServerEntries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 78 | <code>    const parsed = typeof value === 'string' ? parseJsonConfig(value) : value;</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 79 | <code>    if (!parsed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 80 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 81 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>    if (Array.isArray(parsed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 83 | <code>        return parsed</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 84 | <code>            .map((entry, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 85 | <code>                name: normalizeString(entry?.name &#124;&#124; entry?.id, `mcp-${index + 1}`),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 86 | <code>                config: normalizeObject(entry)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 87 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>            .filter((entry) =&gt; entry.name &amp;&amp; entry.config);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    if (typeof parsed === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 91 | <code>        if (parsed.command &#124;&#124; parsed.transport &#124;&#124; parsed.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 92 | <code>            return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 93 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 94 | <code>                    name: normalizeString(parsed.name &#124;&#124; parsed.id, 'default'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 95 | <code>                    config: normalizeObject(parsed)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 96 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>        return Object.entries(parsed)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 100 | <code>            .map(([name, config]) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 101 | <code>                name: normalizeString(config?.name &#124;&#124; config?.id &#124;&#124; name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 102 | <code>                config: normalizeObject(config)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 103 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>            .filter((entry) =&gt; entry.name &amp;&amp; entry.config);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 105 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>    return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 107 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>function publicServerConfig(name, config = {}, session = null) {</code> | 定义函数 `publicServerConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 110 | <code>    const transport = normalizeString(config.transport &#124;&#124; config.type, config.url ? 'http' : 'stdio');</code> | 声明局部标识符 `transport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 111 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 112 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 113 | <code>        transport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 114 | <code>        command: transport === 'stdio' ? normalizeString(config.command) : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 115 | <code>        args: transport === 'stdio' ? normalizeArray(config.args).map(String) : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 116 | <code>        cwd: transport === 'stdio' ? normalizeString(config.cwd) : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 117 | <code>        url: transport !== 'stdio' ? normalizeString(config.url) : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 118 | <code>        headers: transport !== 'stdio' &amp;&amp; config.headers ? redactHeaders(config.headers) : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 119 | <code>        bearerTokenEnvVar: transport !== 'stdio' ? normalizeString(config.bearerTokenEnvVar &#124;&#124; config.bearer_token_env_var) : undefined,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 120 | <code>        env: config.env ? redactEnv(config.env) : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 121 | <code>        disabled: config.disabled === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 122 | <code>        status: session?.status &#124;&#124; 'configured',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 123 | <code>        startedAt: session?.startedAt &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 124 | <code>        lastUsedAt: session?.lastUsedAt &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 125 | <code>        exitCode: session?.exitCode ?? null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 126 | <code>        error: session?.lastError &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 127 | <code>        stderrTail: session?.stderrTail &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 128 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>function schemaPropertyNames(schema = {}) {</code> | 定义函数 `schemaPropertyNames`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 132 | <code>    const properties = normalizeObject(schema.properties);</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 133 | <code>    return Object.keys(properties).filter(Boolean);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>function makeMcpToolSpec(serverName, tool = {}) {</code> | 定义函数 `makeMcpToolSpec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 137 | <code>    const server = normalizeString(serverName);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 138 | <code>    const toolName = normalizeString(tool?.name &#124;&#124; tool?.id);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 139 | <code>    const rawInputSchema = normalizeObject(tool?.inputSchema &#124;&#124; tool?.input_schema);</code> | 声明局部标识符 `rawInputSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 140 | <code>    const inputSchema = enhanceAilisMcpToolSchema({</code> | 声明局部标识符 `inputSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 141 | <code>        server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 142 | <code>        tool: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 143 | <code>        inputSchema: rawInputSchema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 144 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    const schemaProperties = schemaPropertyNames(inputSchema);</code> | 声明局部标识符 `schemaProperties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 146 | <code>    const descriptionAddendum = buildAilisMcpToolDescriptionAddendum({</code> | 声明局部标识符 `descriptionAddendum`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 147 | <code>        server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 148 | <code>        tool: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 149 | <code>        inputSchema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 150 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    return createAilisDirectMcpToolSpec({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 152 | <code>        server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 153 | <code>        tool: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 154 | <code>        name: `${server}.${toolName}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 155 | <code>        title: normalizeString(tool?.title),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 156 | <code>        description: normalizeString(tool?.description),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 157 | <code>        inputSchema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 158 | <code>        schemaProperties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 159 | <code>        descriptionAddendum,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 160 | <code>        callPattern: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 161 | <code>            args: buildAilisMcpToolCallArgs({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 162 | <code>                tool: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 163 | <code>                schemaProperties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 164 | <code>                inputSchema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 165 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>function buildMcpToolSearchText(spec = {}) {</code> | 定义函数 `buildMcpToolSearchText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 171 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 172 | <code>        spec.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 173 | <code>        spec.legacy_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 174 | <code>        spec.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 175 | <code>        spec.display_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 176 | <code>        spec.namespace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 177 | <code>        spec.callable_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 178 | <code>        spec.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 179 | <code>        spec.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 180 | <code>        spec.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 181 | <code>        spec.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 182 | <code>        Array.isArray(spec.schema_properties)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 183 | <code>            ? spec.schema_properties.join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 184 | <code>            : Array.isArray(spec.schemaProperties)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 185 | <code>                ? spec.schemaProperties.join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 186 | <code>                : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 187 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 189 | <code>        .join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 190 | <code>        .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 191 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>function sanitizeServerConfig(config = {}) {</code> | 定义函数 `sanitizeServerConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 194 | <code>    const clean = normalizeObject(config);</code> | 声明局部标识符 `clean`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 195 | <code>    const next = { ...clean };</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 196 | <code>    delete next.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 197 | <code>    delete next.startedAt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 198 | <code>    delete next.lastUsedAt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 199 | <code>    delete next.exitCode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 200 | <code>    delete next.error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 201 | <code>    delete next.stderrTail;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 202 | <code>    return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 203 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>function configFingerprint(config = {}) {</code> | 定义函数 `configFingerprint`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 206 | <code>    return JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 207 | <code>        transport: config.transport &#124;&#124; config.type &#124;&#124; (config.url ? 'http' : 'stdio'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 208 | <code>        command: config.command &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 209 | <code>        args: normalizeArray(config.args).map(String),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 210 | <code>        cwd: config.cwd &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 211 | <code>        url: config.url &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 212 | <code>        headers: normalizeObject(config.headers),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 213 | <code>        bearerTokenEnvVar: config.bearerTokenEnvVar &#124;&#124; config.bearer_token_env_var &#124;&#124; '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 214 | <code>        env: normalizeObject(config.env)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 215 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>function parseSseJson(text) {</code> | 定义函数 `parseSseJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 219 | <code>    const events = [];</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 220 | <code>    let dataLines = [];</code> | 声明局部标识符 `dataLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 221 | <code>    for (const rawLine of String(text &#124;&#124; '').split(/\r?\n/)) {</code> | 声明局部标识符 `rawLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 222 | <code>        const line = rawLine.trimEnd();</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 223 | <code>        if (!line) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>            if (dataLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 225 | <code>                events.push(dataLines.join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 226 | <code>                dataLines = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 227 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 229 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>        if (line.startsWith('data:')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 231 | <code>            dataLines.push(line.slice(5).trimStart());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 232 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>    if (dataLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 235 | <code>        events.push(dataLines.join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 236 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    for (const eventText of events) {</code> | 声明局部标识符 `eventText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 238 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 239 | <code>            return JSON.parse(eventText);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 240 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 241 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 243 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>function parseHttpJsonRpcResponse(text, contentType = '') {</code> | 定义函数 `parseHttpJsonRpcResponse`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 246 | <code>    const raw = String(text &#124;&#124; '').trim();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 247 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 248 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>    if (/text\/event-stream/i.test(contentType)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 251 | <code>        return parseSseJson(raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 254 | <code>        return JSON.parse(raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 255 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 256 | <code>        return parseSseJson(raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 257 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>class McpStdioSession {</code> | 定义类 `McpStdioSession`，把相关状态与行为收拢为一个运行时对象。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 261 | <code>    constructor({ name, config, workspaceRoot, projectRoot, emitGatewayEvent }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 262 | <code>        this.name = name;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 263 | <code>        this.config = config &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 264 | <code>        this.workspaceRoot = workspaceRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 265 | <code>        this.projectRoot = projectRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 266 | <code>        this.emitGatewayEvent = typeof emitGatewayEvent === 'function' ? emitGatewayEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 267 | <code>        this.proc = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 268 | <code>        this.stdoutBuffer = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 269 | <code>        this.pending = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 270 | <code>        this.requestSeq = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 271 | <code>        this.startPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 272 | <code>        this.initialized = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 273 | <code>        this.status = 'configured';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 274 | <code>        this.startedAt = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 275 | <code>        this.lastUsedAt = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 276 | <code>        this.exitCode = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 277 | <code>        this.lastError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 278 | <code>        this.stderrTail = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 279 | <code>        this.fingerprint = configFingerprint(config);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 280 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>    resolveCwd() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 283 | <code>        const cwd = normalizeString(this.config.cwd);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 284 | <code>        if (!cwd) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 285 | <code>            return this.workspaceRoot &#124;&#124; this.projectRoot &#124;&#124; process.cwd();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 286 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>        return path.isAbsolute(cwd)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 288 | <code>            ? path.resolve(cwd)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 289 | <code>            : path.resolve(this.workspaceRoot &#124;&#124; this.projectRoot &#124;&#124; process.cwd(), cwd);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 290 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>    async ensureStarted() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 293 | <code>        if (this.proc &amp;&amp; !this.proc.killed &amp;&amp; this.initialized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 294 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>        if (this.startPromise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 297 | <code>            return await this.startPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 298 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>        this.startPromise = this.start();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 300 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 301 | <code>            await this.startPromise;</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 302 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 303 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 304 | <code>            this.startPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 305 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>    async start() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 309 | <code>        const transport = normalizeString(this.config.transport &#124;&#124; this.config.type, 'stdio');</code> | 声明局部标识符 `transport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 310 | <code>        if (transport !== 'stdio') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 311 | <code>            throw new Error(`MCP server ${this.name} uses unsupported transport: ${transport}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 312 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>        const command = normalizeString(this.config.command);</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 314 | <code>        if (!command) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 315 | <code>            throw new Error(`MCP server ${this.name} is missing command`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 316 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>        const args = normalizeArray(this.config.args).map(String);</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 319 | <code>        const cwd = this.resolveCwd();</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 320 | <code>        const env = {</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 321 | <code>            ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 322 | <code>            ...Object.fromEntries(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 323 | <code>                Object.entries(normalizeObject(this.config.env)).map(([key, value]) =&gt; [key, String(value)])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 324 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 327 | <code>        this.status = 'starting';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 328 | <code>        this.lastError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 329 | <code>        this.emitGatewayEvent('mcp.server.starting', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 330 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 331 | <code>            command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 332 | <code>            args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 333 | <code>            cwd</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 334 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>        const child = spawn(command, args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 337 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 338 | <code>            env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 339 | <code>            stdio: ['pipe', 'pipe', 'pipe'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 340 | <code>            windowsHide: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 341 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>        this.proc = child;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 343 | <code>        this.startedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 344 | <code>        this.exitCode = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>        child.stdout.setEncoding('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 347 | <code>        child.stderr.setEncoding('utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 348 | <code>        child.stdout.on('data', (chunk) =&gt; this.handleStdout(chunk));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 349 | <code>        child.stderr.on('data', (chunk) =&gt; this.handleStderr(chunk));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 350 | <code>        child.on('error', (error) =&gt; this.handleProcessError(error));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 351 | <code>        child.on('exit', (code, signal) =&gt; this.handleExit(code, signal));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>        await new Promise((resolve, reject) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 354 | <code>            const onError = (error) =&gt; {</code> | 声明局部标识符 `onError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 355 | <code>                child.off('spawn', onSpawn);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 356 | <code>                reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 357 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>            const onSpawn = () =&gt; {</code> | 声明局部标识符 `onSpawn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 359 | <code>                child.off('error', onError);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 360 | <code>                resolve();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 361 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>            child.once('error', onError);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 363 | <code>            child.once('spawn', onSpawn);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 364 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>        const init = await this.sendRequest(</code> | 声明局部标识符 `init`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 367 | <code>            'initialize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 368 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 369 | <code>                protocolVersion: normalizeString(this.config.protocolVersion, DEFAULT_MCP_PROTOCOL_VERSION),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 370 | <code>                capabilities: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 371 | <code>                clientInfo: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 372 | <code>                    name: 'AILIS',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 373 | <code>                    version: '1.0.1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 374 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>            Number(this.config.timeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 377 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>        this.sendNotification('notifications/initialized', {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 379 | <code>        this.initialized = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 380 | <code>        this.status = 'running';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 381 | <code>        this.emitGatewayEvent('mcp.server.started', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 382 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 383 | <code>            protocolVersion: init?.protocolVersion &#124;&#124; DEFAULT_MCP_PROTOCOL_VERSION,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 384 | <code>            serverInfo: init?.serverInfo &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 385 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>        return init;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 387 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 389 | <code>    handleStdout(chunk) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 390 | <code>        this.stdoutBuffer += chunk;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 391 | <code>        let index = this.stdoutBuffer.indexOf('\n');</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 392 | <code>        while (index &gt;= 0) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 393 | <code>            const line = this.stdoutBuffer.slice(0, index).trim();</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 394 | <code>            this.stdoutBuffer = this.stdoutBuffer.slice(index + 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 395 | <code>            if (line) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 396 | <code>                this.handleMessageLine(line);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 397 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>            index = this.stdoutBuffer.indexOf('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 399 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 402 | <code>    handleStderr(chunk) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 403 | <code>        const lines = String(chunk)</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 404 | <code>            .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 405 | <code>            .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 406 | <code>            .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 407 | <code>        this.stderrTail.push(...lines);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 408 | <code>        if (this.stderrTail.length &gt; DEFAULT_STDERR_LINES) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 409 | <code>            this.stderrTail = this.stderrTail.slice(-DEFAULT_STDERR_LINES);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 410 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>        if (lines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 412 | <code>            this.emitGatewayEvent('mcp.server.stderr', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 413 | <code>                server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 414 | <code>                lines: lines.slice(-5)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 415 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>    handleMessageLine(line) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 420 | <code>        let message = null;</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 421 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 422 | <code>            message = JSON.parse(line);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 423 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 424 | <code>            this.emitGatewayEvent('mcp.server.stdout.unparseable', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 425 | <code>                server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 426 | <code>                preview: line.slice(0, 500)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 427 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 429 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>        if (message &amp;&amp; Object.prototype.hasOwnProperty.call(message, 'id')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 432 | <code>            const pending = this.pending.get(String(message.id));</code> | 声明局部标识符 `pending`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 433 | <code>            if (!pending) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 434 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 435 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 436 | <code>            this.pending.delete(String(message.id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 437 | <code>            clearTimeout(pending.timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 438 | <code>            if (message.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 439 | <code>                const error = new Error(message.error.message &#124;&#124; 'MCP request failed');</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 440 | <code>                error.details = message.error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 441 | <code>                pending.reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 442 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 443 | <code>                pending.resolve(message.result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 444 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 446 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 448 | <code>        this.emitGatewayEvent('mcp.server.notification', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 449 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 450 | <code>            method: message?.method &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 451 | <code>            params: message?.params &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 452 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>    handleProcessError(error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 456 | <code>        this.status = 'error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 457 | <code>        this.lastError = error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 458 | <code>        this.rejectPending(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 459 | <code>        this.emitGatewayEvent('mcp.server.error', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 460 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 461 | <code>            error: this.lastError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 462 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 465 | <code>    handleExit(code, signal) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 466 | <code>        this.status = 'exited';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 467 | <code>        this.exitCode = code;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 468 | <code>        this.initialized = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 469 | <code>        this.proc = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 470 | <code>        const error = new Error(`MCP server ${this.name} exited with code ${code ?? 'null'} signal ${signal &#124;&#124; 'none'}`);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 471 | <code>        this.rejectPending(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 472 | <code>        this.emitGatewayEvent('mcp.server.exited', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 473 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 474 | <code>            code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 475 | <code>            signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 476 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>    rejectPending(error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 480 | <code>        for (const [id, pending] of this.pending.entries()) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 481 | <code>            clearTimeout(pending.timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 482 | <code>            pending.reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 483 | <code>            this.pending.delete(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 484 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 487 | <code>    async request(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 488 | <code>        await this.ensureStarted();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 489 | <code>        return await this.sendRequest(method, params, timeoutMs);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 490 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 492 | <code>    sendRequest(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 493 | <code>        if (!this.proc?.stdin?.writable) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 494 | <code>            throw new Error(`MCP server ${this.name} is not writable`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 495 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>        const id = String(++this.requestSeq);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 497 | <code>        const message = {</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 498 | <code>            jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 499 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 500 | <code>            method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 501 | <code>            params</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 502 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>        const boundedTimeout = Math.max(1000, Math.min(Number(timeoutMs) &#124;&#124; DEFAULT_MCP_TIMEOUT_MS, MAX_MCP_TIMEOUT_MS));</code> | 声明局部标识符 `boundedTimeout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 504 | <code>        this.lastUsedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 505 | <code>        return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 506 | <code>            const timer = setTimeout(() =&gt; {</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 507 | <code>                this.pending.delete(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 508 | <code>                reject(new Error(`MCP ${this.name}.${method} timed out after ${boundedTimeout}ms`));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 509 | <code>            }, boundedTimeout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 510 | <code>            this.pending.set(id, { resolve, reject, timer, method });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 511 | <code>            this.proc.stdin.write(`${JSON.stringify(message)}\n`, 'utf8', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 512 | <code>                if (error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 513 | <code>                    clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 514 | <code>                    this.pending.delete(id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 515 | <code>                    reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 516 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 518 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 521 | <code>    sendNotification(method, params = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 522 | <code>        if (!this.proc?.stdin?.writable) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 523 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 524 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 525 | <code>        this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 526 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>    async shutdown() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 529 | <code>        if (!this.proc) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 530 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 531 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 532 | <code>        const child = this.proc;</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 533 | <code>        this.status = 'closing';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 534 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 535 | <code>            child.stdin.end();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 536 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 537 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 538 | <code>            child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 539 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 540 | <code>        this.proc = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 541 | <code>        this.initialized = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 542 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>class McpHttpSession {</code> | 定义类 `McpHttpSession`，把相关状态与行为收拢为一个运行时对象。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 546 | <code>    constructor({ name, config, workspaceRoot, projectRoot, emitGatewayEvent }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 547 | <code>        this.name = name;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 548 | <code>        this.config = config &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 549 | <code>        this.workspaceRoot = workspaceRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 550 | <code>        this.projectRoot = projectRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 551 | <code>        this.emitGatewayEvent = typeof emitGatewayEvent === 'function' ? emitGatewayEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 552 | <code>        this.requestSeq = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 553 | <code>        this.initialized = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 554 | <code>        this.status = 'configured';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 555 | <code>        this.startedAt = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 556 | <code>        this.lastUsedAt = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 557 | <code>        this.exitCode = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 558 | <code>        this.lastError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 559 | <code>        this.stderrTail = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 560 | <code>        this.sessionId = '';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 561 | <code>        this.serverInfo = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 562 | <code>        this.fingerprint = configFingerprint(config);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 563 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>    resolveUrl() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 566 | <code>        const url = normalizeString(this.config.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 567 | <code>        if (!url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 568 | <code>            throw new Error(`MCP HTTP server ${this.name} is missing url`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 569 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>        return url;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 571 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 573 | <code>    buildHeaders() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 574 | <code>        const headers = {</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 575 | <code>            'Accept': 'application/json, text/event-stream',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 576 | <code>            'Content-Type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 577 | <code>            'MCP-Protocol-Version': normalizeString(this.config.protocolVersion, DEFAULT_MCP_PROTOCOL_VERSION),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 578 | <code>            ...Object.fromEntries(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 579 | <code>                Object.entries(normalizeObject(this.config.headers)).map(([key, value]) =&gt; [key, String(value)])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 580 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 581 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>        const bearerTokenEnvVar = normalizeString(this.config.bearerTokenEnvVar &#124;&#124; this.config.bearer_token_env_var);</code> | 声明局部标识符 `bearerTokenEnvVar`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 583 | <code>        const bearerToken = bearerTokenEnvVar ? normalizeString(process.env[bearerTokenEnvVar]) : '';</code> | 声明局部标识符 `bearerToken`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 584 | <code>        if (bearerToken &amp;&amp; !headers.Authorization &amp;&amp; !headers.authorization) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 585 | <code>            headers.Authorization = `Bearer ${bearerToken}`;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 586 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 587 | <code>        if (this.sessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 588 | <code>            headers['Mcp-Session-Id'] = this.sessionId;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 589 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>        return headers;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 591 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>    async ensureStarted() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 594 | <code>        if (this.initialized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 595 | <code>            return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 596 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 597 | <code>        await this.start();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 598 | <code>        return this;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 599 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 601 | <code>    async start() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 602 | <code>        const url = this.resolveUrl();</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 603 | <code>        this.status = 'starting';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 604 | <code>        this.startedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 605 | <code>        this.lastError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 606 | <code>        this.emitGatewayEvent('mcp.server.starting', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 607 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 608 | <code>            transport: normalizeString(this.config.transport &#124;&#124; this.config.type, 'http'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 609 | <code>            url</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 610 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 611 | <code>        const init = await this.sendRequest(</code> | 声明局部标识符 `init`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 612 | <code>            'initialize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 613 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 614 | <code>                protocolVersion: normalizeString(this.config.protocolVersion, DEFAULT_MCP_PROTOCOL_VERSION),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 615 | <code>                capabilities: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 616 | <code>                clientInfo: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 617 | <code>                    name: 'AILIS',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 618 | <code>                    version: '1.0.1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 619 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 621 | <code>            Number(this.config.timeoutMs &#124;&#124; this.config.startupTimeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 622 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>        await this.sendNotification('notifications/initialized', {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 624 | <code>        this.initialized = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 625 | <code>        this.status = 'running';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 626 | <code>        this.serverInfo = init?.serverInfo &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 627 | <code>        this.emitGatewayEvent('mcp.server.started', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 628 | <code>            server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 629 | <code>            transport: 'http',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 630 | <code>            protocolVersion: init?.protocolVersion &#124;&#124; DEFAULT_MCP_PROTOCOL_VERSION,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 631 | <code>            serverInfo: this.serverInfo</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 632 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 633 | <code>        return init;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 634 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 636 | <code>    async request(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 637 | <code>        await this.ensureStarted();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 638 | <code>        return await this.sendRequest(method, params, timeoutMs);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 639 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>    async sendRequest(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 642 | <code>        const id = String(++this.requestSeq);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 643 | <code>        const message = {</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 644 | <code>            jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 645 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 646 | <code>            method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 647 | <code>            params</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 648 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>        return await this.postJsonRpc(message, timeoutMs);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 650 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 652 | <code>    async sendNotification(method, params = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 653 | <code>        await this.postJsonRpc(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 654 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 655 | <code>                jsonrpc: '2.0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 656 | <code>                method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 657 | <code>                params</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 658 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 659 | <code>            Number(this.config.timeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 660 | <code>            { notification: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 661 | <code>        ).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 662 | <code>            this.emitGatewayEvent('mcp.server.notification_error', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 663 | <code>                server: this.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 664 | <code>                method,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 665 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 666 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 667 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 669 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 670 | <code>    async postJsonRpc(message, timeoutMs = DEFAULT_MCP_TIMEOUT_MS, { notification = false } = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 671 | <code>        const boundedTimeout = Math.max(1000, Math.min(Number(timeoutMs) &#124;&#124; DEFAULT_MCP_TIMEOUT_MS, MAX_MCP_TIMEOUT_MS));</code> | 声明局部标识符 `boundedTimeout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 672 | <code>        const controller = new AbortController();</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 673 | <code>        const timer = setTimeout(() =&gt; controller.abort(), boundedTimeout);</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 674 | <code>        this.lastUsedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 675 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 676 | <code>            const response = await fetch(this.resolveUrl(), {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 677 | <code>                method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 678 | <code>                headers: this.buildHeaders(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 679 | <code>                body: JSON.stringify(message),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 680 | <code>                signal: controller.signal</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 681 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 682 | <code>            const sessionId = response.headers.get('mcp-session-id') &#124;&#124; response.headers.get('Mcp-Session-Id');</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 683 | <code>            if (sessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 684 | <code>                this.sessionId = sessionId;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 685 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>            const text = await response.text().catch(() =&gt; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 687 | <code>            if (notification &amp;&amp; (response.status === 202 &#124;&#124; !text.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 688 | <code>                return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 689 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 690 | <code>            if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 691 | <code>                const error = new Error(`MCP HTTP ${this.name}.${message.method} failed with status ${response.status}`);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 692 | <code>                error.details = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 693 | <code>                    status: response.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 694 | <code>                    body: text.slice(0, 2000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 695 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>                throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 697 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 698 | <code>            const parsed = parseHttpJsonRpcResponse(text, response.headers.get('content-type') &#124;&#124; '');</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 699 | <code>            if (!parsed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 700 | <code>                if (notification) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 701 | <code>                    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 702 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 703 | <code>                throw new Error(`MCP HTTP ${this.name}.${message.method} returned empty response`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 704 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>            if (parsed.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 706 | <code>                const error = new Error(parsed.error.message &#124;&#124; 'MCP request failed');</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 707 | <code>                error.details = parsed.error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 708 | <code>                throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 709 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 710 | <code>            return parsed.result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 711 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 712 | <code>            this.status = this.initialized ? 'running' : 'error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 713 | <code>            this.lastError = error?.name === 'AbortError'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 714 | <code>                ? `MCP ${this.name}.${message.method} timed out after ${boundedTimeout}ms`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 715 | <code>                : error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 716 | <code>            throw new Error(this.lastError);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 717 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 718 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 719 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 720 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>    async shutdown() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 723 | <code>        this.status = 'closed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 724 | <code>        this.initialized = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 725 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 728 | <code>class AILISMcpManager {</code> | 定义类 `AILISMcpManager`，把相关状态与行为收拢为一个运行时对象。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 729 | <code>    constructor({ workspaceRoot, projectRoot, emitGatewayEvent, builtinServers, defaultServers, configPath } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 730 | <code>        this.workspaceRoot = workspaceRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 731 | <code>        this.projectRoot = projectRoot;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 732 | <code>        this.emitGatewayEvent = typeof emitGatewayEvent === 'function' ? emitGatewayEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 733 | <code>        this.serverConfigs = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 734 | <code>        this.sessions = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 735 | <code>        this.toolSchemaCache = new Map();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 736 | <code>        this.configPath = normalizeString(configPath &#124;&#124; process.env.AILIS_MCP_CONFIG_PATH);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 737 | <code>        this.configStoreStatus = this.configPath ? 'not_loaded' : 'disabled';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 738 | <code>        this.configStoreError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 739 | <code>        this.registerServers(builtinServers);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 740 | <code>        this.loadConfigFile();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 741 | <code>        this.registerServers(process.env.AILIS_MCP_SERVERS_JSON &#124;&#124; process.env.AILIS_MCP_SERVERS);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 742 | <code>        this.registerServers(defaultServers);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 743 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 745 | <code>    loadConfigFile() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 746 | <code>        if (!this.configPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 747 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 748 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 749 | <code>        this.configStoreStatus = 'missing';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 750 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 751 | <code>            if (!fs.existsSync(this.configPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 752 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>            const raw = fs.readFileSync(this.configPath, 'utf8');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 755 | <code>            const state = JSON.parse(raw &#124;&#124; '{}');</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 756 | <code>            this.registerServers(state.servers &#124;&#124; state.mcpServers &#124;&#124; state, { persist: false });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 757 | <code>            this.configStoreStatus = 'loaded';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 758 | <code>            this.configStoreError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 759 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 760 | <code>            this.configStoreStatus = 'load_error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 761 | <code>            this.configStoreError = error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 762 | <code>            this.emitGatewayEvent('mcp.config.error', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 763 | <code>                action: 'load',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 764 | <code>                path: this.configPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 765 | <code>                error: this.configStoreError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 766 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 768 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 769 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 770 | <code>    saveConfigFile(reason = 'update') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 771 | <code>        if (!this.configPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 772 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 773 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 774 | <code>                status: 'config_store_disabled'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 775 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 776 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 778 | <code>            fs.mkdirSync(path.dirname(this.configPath), { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 779 | <code>            const servers = {};</code> | 声明局部标识符 `servers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 780 | <code>            for (const [name, config] of this.serverConfigs.entries()) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 781 | <code>                servers[name] = sanitizeServerConfig(config);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 782 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 783 | <code>            const state = {</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 784 | <code>                version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 785 | <code>                reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 786 | <code>                updatedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 787 | <code>                updatedAtIso: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 788 | <code>                servers</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 789 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 790 | <code>            const tmpPath = `${this.configPath}.${process.pid}.${Date.now()}.tmp`;</code> | 声明局部标识符 `tmpPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 791 | <code>            fs.writeFileSync(tmpPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 792 | <code>            fs.renameSync(tmpPath, this.configPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 793 | <code>            this.configStoreStatus = 'saved';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 794 | <code>            this.configStoreError = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 795 | <code>            this.emitGatewayEvent('mcp.config.saved', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 796 | <code>                path: this.configPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 797 | <code>                serverCount: this.serverConfigs.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 798 | <code>                reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 799 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 800 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 801 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 802 | <code>                status: 'saved',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 803 | <code>                path: this.configPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 804 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 805 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 806 | <code>            this.configStoreStatus = 'save_error';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 807 | <code>            this.configStoreError = error?.message &#124;&#124; String(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 808 | <code>            this.emitGatewayEvent('mcp.config.error', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 809 | <code>                action: 'save',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 810 | <code>                path: this.configPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 811 | <code>                error: this.configStoreError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 812 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 814 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 815 | <code>                status: 'save_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 816 | <code>                error: this.configStoreError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 817 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 818 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 819 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>    registerServers(raw, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 822 | <code>        const entries = normalizeMcpServerEntries(raw);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 823 | <code>        for (const { name, config } of entries) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 824 | <code>            if (config.disabled === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 825 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 826 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 827 | <code>            this.serverConfigs.set(name, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 828 | <code>                ...config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 829 | <code>                name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 830 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 831 | <code>            this.toolSchemaCache.delete(name);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 832 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 833 | <code>        if (entries.length &amp;&amp; options.persist === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 834 | <code>            this.saveConfigFile('register_servers');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 835 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>        return entries.map((entry) =&gt; entry.name);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 837 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 839 | <code>    removeServer(serverName, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 840 | <code>        const name = normalizeString(serverName);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 841 | <code>        if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 842 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 843 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>        const removed = this.serverConfigs.delete(name);</code> | 声明局部标识符 `removed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 845 | <code>        this.toolSchemaCache.delete(name);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 846 | <code>        const session = this.sessions.get(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 847 | <code>        if (session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 848 | <code>            session.shutdown().catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 849 | <code>            this.sessions.delete(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 850 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 851 | <code>        if (removed &amp;&amp; options.persist === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 852 | <code>            this.saveConfigFile('remove_server');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 853 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 854 | <code>        return removed;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 855 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 857 | <code>    registerRuntimeConfigs(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 858 | <code>        this.registerServers(context.mcpServers &#124;&#124; context.mcp &#124;&#124; context.mcpServerConfigs);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 859 | <code>        this.registerServers(args.servers &#124;&#124; args.mcpServers &#124;&#124; args.mcp &#124;&#124; args.serverConfigs);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 860 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 863 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 864 | <code>            serverCount: this.serverConfigs.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 865 | <code>            activeSessionCount: this.sessions.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 866 | <code>            configPath: this.configPath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 867 | <code>            configStoreStatus: this.configStoreStatus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 868 | <code>            configStoreError: this.configStoreError,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 869 | <code>            servers: [...this.serverConfigs.entries()].map(([name, config]) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 870 | <code>                publicServerConfig(name, config, this.sessions.get(name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 871 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 872 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 873 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 874 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 875 | <code>    listServers() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 876 | <code>        return [...this.serverConfigs.entries()].map(([name, config]) =&gt;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 877 | <code>            publicServerConfig(name, config, this.sessions.get(name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 878 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 879 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 880 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 881 | <code>    resolveServerName(value) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 882 | <code>        const server = normalizeString(value);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 883 | <code>        if (server) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 884 | <code>            return server;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 885 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 886 | <code>        if (this.serverConfigs.size === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 887 | <code>            return [...this.serverConfigs.keys()][0];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 888 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 889 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 890 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>    async getSession(serverName) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 893 | <code>        const name = this.resolveServerName(serverName);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 894 | <code>        if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 895 | <code>            throw new Error('mcp_bridge requires server when multiple MCP servers are configured');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 896 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 897 | <code>        const config = this.serverConfigs.get(name);</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 898 | <code>        if (!config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 899 | <code>            throw new Error(`MCP server is not configured: ${name}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 900 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>        const fingerprint = configFingerprint(config);</code> | 声明局部标识符 `fingerprint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 902 | <code>        let session = this.sessions.get(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 903 | <code>        if (session &amp;&amp; session.fingerprint !== fingerprint) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 904 | <code>            await session.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 905 | <code>            this.sessions.delete(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 906 | <code>            session = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 907 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 908 | <code>        if (!session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 909 | <code>            const transport = normalizeString(config.transport &#124;&#124; config.type, config.url ? 'http' : 'stdio');</code> | 声明局部标识符 `transport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 910 | <code>            const SessionClass = transport === 'stdio' ? McpStdioSession : McpHttpSession;</code> | 声明局部标识符 `SessionClass`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 911 | <code>            session = new SessionClass({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 912 | <code>                name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 913 | <code>                config,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 914 | <code>                workspaceRoot: this.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 915 | <code>                projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 916 | <code>                emitGatewayEvent: this.emitGatewayEvent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 917 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 918 | <code>            this.sessions.set(name, session);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 919 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 920 | <code>        await session.ensureStarted();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 921 | <code>        return session;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 922 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 924 | <code>    async listTools(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 925 | <code>        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 926 | <code>        const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 927 | <code>        for (const name of names) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 928 | <code>            const session = await this.getSession(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 929 | <code>            const result = await session.request('tools/list', {}, timeoutMs);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 930 | <code>            const tools = Array.isArray(result?.tools) ? result.tools : [];</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 931 | <code>            this.cacheToolSchemas(name, tools);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 932 | <code>            results.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 933 | <code>                server: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 934 | <code>                tools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 935 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 936 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 937 | <code>        return results;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 938 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 939 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 940 | <code>    async listToolSpecs(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 941 | <code>        const grouped = await this.listTools(serverName, timeoutMs);</code> | 声明局部标识符 `grouped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 942 | <code>        return grouped.flatMap((entry) =&gt;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 943 | <code>            (Array.isArray(entry.tools) ? entry.tools : [])</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 944 | <code>                .map((tool) =&gt; makeMcpToolSpec(entry.server, tool))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 945 | <code>                .filter((spec) =&gt; spec.server &amp;&amp; spec.tool)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 946 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 947 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 949 | <code>    async searchToolSpecs({ query = '', server = '', limit = 8, timeoutMs = DEFAULT_MCP_TIMEOUT_MS } = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 950 | <code>        const specs = await this.listToolSpecs(server, timeoutMs);</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 951 | <code>        const needle = normalizeString(query).toLowerCase();</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 952 | <code>        const boundedLimit = Math.max(1, Math.min(Number(limit) &#124;&#124; 8, 50));</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 953 | <code>        if (!needle) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 954 | <code>            return rankToolSearchResults(specs, 'specific document pdf media file api tool', boundedLimit);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 955 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 956 | <code>        return rankToolSearchResults(specs, query, boundedLimit);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 957 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 958 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 959 | <code>    cacheToolSchemas(serverName, tools = []) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 960 | <code>        const name = normalizeString(serverName);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 961 | <code>        if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 962 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 963 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 964 | <code>        const cache = new Map();</code> | 声明局部标识符 `cache`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 965 | <code>        for (const tool of Array.isArray(tools) ? tools : []) {</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 966 | <code>            const toolName = normalizeString(tool?.name &#124;&#124; tool?.id);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 967 | <code>            if (toolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 968 | <code>                cache.set(toolName, tool?.inputSchema &#124;&#124; tool?.input_schema &#124;&#124; {});</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 969 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 970 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 971 | <code>        this.toolSchemaCache.set(name, cache);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 972 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 974 | <code>    async getToolInputSchema(serverName, toolName, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 975 | <code>        const server = this.resolveServerName(serverName);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 976 | <code>        const tool = normalizeString(toolName);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 977 | <code>        if (!server &#124;&#124; !tool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 978 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 979 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 980 | <code>        let cache = this.toolSchemaCache.get(server);</code> | 声明局部标识符 `cache`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 981 | <code>        if (!cache &#124;&#124; !cache.has(tool)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 982 | <code>            await this.listTools(server, timeoutMs).catch(() =&gt; []);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 983 | <code>            cache = this.toolSchemaCache.get(server);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 984 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 985 | <code>        return cache?.get(tool) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 986 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 988 | <code>    async listResources(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 989 | <code>        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 990 | <code>        const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 991 | <code>        for (const name of names) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 992 | <code>            const session = await this.getSession(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 993 | <code>            const resourcesResult = await session.request('resources/list', {}, timeoutMs).catch((error) =&gt; ({</code> | 声明局部标识符 `resourcesResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 994 | <code>                resources: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 995 | <code>                error: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 996 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 997 | <code>            const templatesResult = await session.request('resources/templates/list', {}, timeoutMs).catch(() =&gt; ({</code> | 声明局部标识符 `templatesResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 998 | <code>                resourceTemplates: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 999 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1000 | <code>            results.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1001 | <code>                server: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1002 | <code>                resources: Array.isArray(resourcesResult?.resources) ? resourcesResult.resources : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1003 | <code>                resourceTemplates: Array.isArray(templatesResult?.resourceTemplates)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1004 | <code>                    ? templatesResult.resourceTemplates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1005 | <code>                    : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1006 | <code>                error: resourcesResult?.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1007 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1008 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1009 | <code>        return results;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1010 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>    async readResource({ server, uri, timeoutMs }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1013 | <code>        const session = await this.getSession(server);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1014 | <code>        return await session.request('resources/read', { uri }, timeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1015 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1017 | <code>    async listPrompts(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1018 | <code>        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1019 | <code>        const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1020 | <code>        for (const name of names) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1021 | <code>            const session = await this.getSession(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1022 | <code>            const result = await session.request('prompts/list', {}, timeoutMs).catch((error) =&gt; ({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1023 | <code>                prompts: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1024 | <code>                error: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1025 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1026 | <code>            results.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1027 | <code>                server: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1028 | <code>                prompts: Array.isArray(result?.prompts) ? result.prompts : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1029 | <code>                error: result?.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1030 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1031 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1032 | <code>        return results;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1033 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1034 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1035 | <code>    async getPrompt({ server, prompt, args, timeoutMs }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1036 | <code>        const session = await this.getSession(server);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1037 | <code>        return await session.request(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1038 | <code>            'prompts/get',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1039 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1040 | <code>                name: prompt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1041 | <code>                arguments: args &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1042 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1043 | <code>            timeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1044 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1045 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1046 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1047 | <code>    async healthCheck(serverName = '', timeoutMs = 5000) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1048 | <code>        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1049 | <code>        const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1050 | <code>        for (const name of names) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1051 | <code>            const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1052 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1053 | <code>                const session = await this.getSession(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1054 | <code>                const tools = await session.request('tools/list', {}, timeoutMs).catch((error) =&gt; ({</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1055 | <code>                    tools: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1056 | <code>                    error: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1057 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1058 | <code>                results.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1059 | <code>                    server: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1060 | <code>                    ok: !tools?.error,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1061 | <code>                    status: tools?.error ? 'degraded' : 'healthy',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1062 | <code>                    latencyMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1063 | <code>                    transport: normalizeString(session.config.transport &#124;&#124; session.config.type, session.config.url ? 'http' : 'stdio'),</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1064 | <code>                    toolCount: Array.isArray(tools?.tools) ? tools.tools.length : 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1065 | <code>                    error: tools?.error &#124;&#124; ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1066 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1067 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1068 | <code>                results.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1069 | <code>                    server: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1070 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1071 | <code>                    status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1072 | <code>                    latencyMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1073 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1074 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1076 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1077 | <code>        return results;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1078 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1079 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1080 | <code>    async callTool({ server, tool, args, meta, timeoutMs }) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1081 | <code>        const session = await this.getSession(server);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1082 | <code>        const inputSchema = await this.getToolInputSchema(server, tool, timeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS);</code> | 声明局部标识符 `inputSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1083 | <code>        if (inputSchema &amp;&amp; Object.keys(inputSchema).length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1084 | <code>            const errors = validateAgainstSchema(args &#124;&#124; {}, inputSchema);</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1085 | <code>            if (errors.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1086 | <code>                const error = new Error(`MCP tool arguments failed inputSchema validation: ${errors.join('; ')}`);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1087 | <code>                error.details = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1088 | <code>                    status: 'invalid_mcp_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1089 | <code>                    server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1090 | <code>                    tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1091 | <code>                    errors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1092 | <code>                    inputSchema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1093 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1094 | <code>                throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1095 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1096 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1097 | <code>        const params = {</code> | 声明局部标识符 `params`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1098 | <code>            name: tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1099 | <code>            arguments: args &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1100 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1101 | <code>        if (meta !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1102 | <code>            params._meta = meta;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1103 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1104 | <code>        return await session.request('tools/call', params, timeoutMs &#124;&#124; DEFAULT_MCP_TIMEOUT_MS);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1105 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1107 | <code>    async shutdown(serverName = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1108 | <code>        const names = serverName ? [serverName] : [...this.sessions.keys()];</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1109 | <code>        for (const name of names) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1110 | <code>            const session = this.sessions.get(name);</code> | 声明局部标识符 `session`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1111 | <code>            if (session) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1112 | <code>                await session.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1113 | <code>                this.sessions.delete(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1114 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1116 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1117 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1119 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1120 | <code>    AILISMcpManager,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1121 | <code>    normalizeMcpServerEntries</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 1122 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
