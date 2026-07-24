# electron/ailis-hosted-runtime.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。
- 文件类型：`source-code`
- 原始行数：338
- SHA-256：`76bd50938fecb61faf056a3ddf9d6b3883bb27e4877b072a6daa399385d9db57`
- 可运行副本：[打开源文件](../../../source/electron/ailis-hosted-runtime.cjs)
- 依赖：`fs`、`path`、`crypto`、`./ailis-gateway.cjs`、`./desktop-llm-provider.cjs`
- 主要符号：`fs`、`path`、`DEFAULT_MAX_ACTIVE_TENANTS`、`DEFAULT_IDLE_TTL_MS`、`DEFAULT_EVENT_LOG_LIMIT`、`normalizeString`、`text`、`boundedInteger`、`numeric`、`tenantKey`、`normalized`、`resolveHostedLlmSettings`、`sanitizeAgentRequest`、`input`、`sanitizedInput`、`context`、`maxAgentSteps`、`messageHistory`、`sessionId`、`agentRole`、`AILISHostedRuntimeManager`、`key`、`tenantRoot`、`stateRoot`、`workspaceRoot`、`record`、`gateway`、`onEvent`、`nextSeq`、`events`、`boundedLimit`、`normalizedCursor`、`request`、`candidates`、`overCapacity`、`expired`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 5 | <code>const { createHash } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 6 | <code>const { AILISGateway } = require('./ailis-gateway.cjs');</code> | 导入依赖 `./ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 7 | <code>const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');</code> | 导入依赖 `./desktop-llm-provider.cjs`，使本文件可以复用外部模块能力。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const DEFAULT_MAX_ACTIVE_TENANTS = 6;</code> | 声明局部标识符 `DEFAULT_MAX_ACTIVE_TENANTS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 10 | <code>const DEFAULT_IDLE_TTL_MS = 30 * 60 * 1000;</code> | 声明局部标识符 `DEFAULT_IDLE_TTL_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 11 | <code>const DEFAULT_EVENT_LOG_LIMIT = 1000;</code> | 声明局部标识符 `DEFAULT_EVENT_LOG_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 14 | <code>    const text = typeof value === 'string' ? value.trim() : '';</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 15 | <code>    return text &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 16 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>function boundedInteger(value, fallback, minimum, maximum) {</code> | 定义函数 `boundedInteger`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 19 | <code>    const numeric = Number(value);</code> | 声明局部标识符 `numeric`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 20 | <code>    if (!Number.isFinite(numeric)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 21 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>    return Math.max(minimum, Math.min(Math.trunc(numeric), maximum));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 24 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>function tenantKey(tenantId = '') {</code> | 定义函数 `tenantKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 27 | <code>    const normalized = normalizeString(tenantId);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 28 | <code>    if (!normalized &#124;&#124; normalized.length &gt; 512) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 29 | <code>        throw new Error('tenant_id_invalid');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 30 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>    return createHash('sha256').update(normalized).digest('hex');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 32 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>function resolveHostedLlmSettings(env = process.env) {</code> | 定义函数 `resolveHostedLlmSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 35 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 36 | <code>        provider: normalizeString(env.AILIS_AGENT_LLM_PROVIDER, 'openai-compatible'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 37 | <code>        baseUrl: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 38 | <code>            env.AILIS_LLM_BASE_URL &#124;&#124; env.AILIS_AGENT_LLM_BASE_URL &#124;&#124; env.LLM_API_BASE,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 39 | <code>            'https://api.deepseek.com'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 40 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>        apiKey: normalizeString(env.AILIS_LLM_API_KEY &#124;&#124; env.AILIS_AGENT_LLM_API_KEY &#124;&#124; env.LLM_API_KEY),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 42 | <code>        model: normalizeString(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 43 | <code>            env.AILIS_LLM_MODEL &#124;&#124; env.AILIS_AGENT_LLM_MODEL &#124;&#124; env.LLM_MODEL_NAME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 44 | <code>            'deepseek-chat'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 45 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>        timeoutMs: boundedInteger(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 47 | <code>            env.AILIS_AGENT_LLM_TIMEOUT_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 48 | <code>            300000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 49 | <code>            10000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 50 | <code>            900000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 51 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function sanitizeAgentRequest(payload = {}, record) {</code> | 定义函数 `sanitizeAgentRequest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 56 | <code>    const input = payload &amp;&amp; typeof payload === 'object' ? payload : {};</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 57 | <code>    const sanitizedInput = { ...input };</code> | 声明局部标识符 `sanitizedInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 58 | <code>    const context = input.context &amp;&amp; typeof input.context === 'object'</code> | 声明局部标识符 `context`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 59 | <code>        ? { ...input.context }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 60 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 61 | <code>    for (const key of [</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 62 | <code>        'workspace',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 63 | <code>        'workspaceDir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 64 | <code>        'workspaceRoot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 65 | <code>        'projectRoot',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 66 | <code>        'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 67 | <code>        'llmSettings',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 68 | <code>        'approved',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 69 | <code>        'autoConfirm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 70 | <code>        'fullControl'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 71 | <code>    ]) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 72 | <code>        delete sanitizedInput[key];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 73 | <code>        delete context[key];</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 74 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>    const maxAgentSteps = boundedInteger(</code> | 声明局部标识符 `maxAgentSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 77 | <code>        input.maxAgentSteps ?? context.maxAgentSteps,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 78 | <code>        4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 79 | <code>        1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 80 | <code>        12</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 81 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>    const messageHistory = Array.isArray(input.messageHistory)</code> | 声明局部标识符 `messageHistory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 83 | <code>        ? input.messageHistory.slice(-240)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 84 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 85 | <code>    const sessionId = normalizeString(input.sessionId &#124;&#124; input.sessionKey, 'main').slice(0, 160);</code> | 声明局部标识符 `sessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 86 | <code>    const agentRole = normalizeString(</code> | 声明局部标识符 `agentRole`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 87 | <code>        input.agentRole &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 88 | <code>        input.agent_role &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 89 | <code>        context.agentRole &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 90 | <code>        context.agent_role,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 91 | <code>        'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 92 | <code>    ).slice(0, 80);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 93 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 94 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 95 | <code>        ...sanitizedInput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 96 | <code>        runId: normalizeString(input.runId).slice(0, 160),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 97 | <code>        sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 98 | <code>        sessionKey: sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 99 | <code>        messageHistory,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 100 | <code>        attachments: Array.isArray(input.attachments) ? input.attachments.slice(0, 12) : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 101 | <code>        agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 102 | <code>        planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 103 | <code>        directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 104 | <code>        maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 105 | <code>        agentRole,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 106 | <code>        llmSettings: { ...record.llmSettings },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 107 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 108 | <code>            ...context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 109 | <code>            hostedRuntime: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 110 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 111 | <code>            planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 112 | <code>            directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 113 | <code>            maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 114 | <code>            agentRole,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 115 | <code>            workspace: record.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 116 | <code>            workspaceDir: record.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 117 | <code>            workspaceRoot: record.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 118 | <code>            projectRoot: record.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 119 | <code>            llmSettings: { ...record.llmSettings }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 120 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>class AILISHostedRuntimeManager {</code> | 定义类 `AILISHostedRuntimeManager`，把相关状态与行为收拢为一个运行时对象。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 125 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 126 | <code>        this.dataRoot = path.resolve(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 127 | <code>            options.dataRoot &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 128 | <code>            process.env.AILIS_HOSTED_DATA_ROOT &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 129 | <code>            path.join(process.cwd(), '.ailis-state', 'hosted')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 130 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>        this.maxActiveTenants = boundedInteger(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 132 | <code>            options.maxActiveTenants ?? process.env.AILIS_HOSTED_MAX_ACTIVE_TENANTS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 133 | <code>            DEFAULT_MAX_ACTIVE_TENANTS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 134 | <code>            1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 135 | <code>            64</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 136 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>        this.idleTtlMs = boundedInteger(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 138 | <code>            options.idleTtlMs ?? process.env.AILIS_HOSTED_IDLE_TTL_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 139 | <code>            DEFAULT_IDLE_TTL_MS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 140 | <code>            60000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 141 | <code>            24 * 60 * 60 * 1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 142 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>        this.eventLogLimit = boundedInteger(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 144 | <code>            options.eventLogLimit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 145 | <code>            DEFAULT_EVENT_LOG_LIMIT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 146 | <code>            100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 147 | <code>            10000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 148 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>        this.llmSettings = options.llmSettings &#124;&#124; resolveHostedLlmSettings(options.env &#124;&#124; process.env);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 150 | <code>        this.gatewayFactory = typeof options.gatewayFactory === 'function'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 151 | <code>            ? options.gatewayFactory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 152 | <code>            : (gatewayOptions) =&gt; new AILISGateway(gatewayOptions);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 153 | <code>        this.runtimes = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 154 | <code>        this.eventLogs = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 155 | <code>        this.eventSeq = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 156 | <code>        fs.mkdirSync(this.dataRoot, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 157 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 159 | <code>    createRuntimeRecord(tenantId) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 160 | <code>        const key = tenantKey(tenantId);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 161 | <code>        const tenantRoot = path.join(this.dataRoot, 'tenants', key);</code> | 声明局部标识符 `tenantRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 162 | <code>        const stateRoot = path.join(tenantRoot, 'state');</code> | 声明局部标识符 `stateRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 163 | <code>        const workspaceRoot = path.join(tenantRoot, 'workspace');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 164 | <code>        fs.mkdirSync(stateRoot, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 165 | <code>        fs.mkdirSync(workspaceRoot, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>        const record = {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 168 | <code>            key,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 169 | <code>            tenantId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 170 | <code>            tenantRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 171 | <code>            stateRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 172 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 173 | <code>            llmSettings: { ...this.llmSettings },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 174 | <code>            createdAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 175 | <code>            lastUsedAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 176 | <code>            activeRuns: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 177 | <code>            gateway: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 178 | <code>            unsubscribe: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 179 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>        const gateway = this.gatewayFactory({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 181 | <code>            host: '127.0.0.1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 182 | <code>            port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 183 | <code>            projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 184 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 185 | <code>            auditDir: stateRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 186 | <code>            emberHarnessEnabled: process.env.AILIS_HOSTED_EMBER_ENABLED === 'true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 187 | <code>            profileCurationEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 188 | <code>            profileCurationLlm: (payload) =&gt; callDesktopLlmProvider(record.llmSettings, payload &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 189 | <code>            getDefaultContext: () =&gt; ({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 190 | <code>                hostedRuntime: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 191 | <code>                workspace: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 192 | <code>                workspaceDir: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 193 | <code>                workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 194 | <code>                projectRoot: workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 195 | <code>                llmSettings: { ...record.llmSettings }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 196 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>        record.gateway = gateway;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 199 | <code>        const onEvent = (event) =&gt; this.recordEvent(key, event);</code> | 声明局部标识符 `onEvent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 200 | <code>        gateway.on?.('event', onEvent);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 201 | <code>        record.unsubscribe = () =&gt; gateway.off?.('event', onEvent);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 202 | <code>        gateway.startProfileCurationScheduler?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 203 | <code>        return record;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 204 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 206 | <code>    async getRuntime(tenantId) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 207 | <code>        const key = tenantKey(tenantId);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 208 | <code>        let record = this.runtimes.get(key);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 209 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>            await this.evictIdleRuntimes({ reserveSlots: 1 });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 211 | <code>            record = this.createRuntimeRecord(tenantId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 212 | <code>            this.runtimes.set(key, record);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 213 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        record.lastUsedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 215 | <code>        return record;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>    recordEvent(key, event = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 219 | <code>        const nextSeq = (this.eventSeq.get(key) &#124;&#124; 0) + 1;</code> | 声明局部标识符 `nextSeq`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 220 | <code>        this.eventSeq.set(key, nextSeq);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 221 | <code>        const events = this.eventLogs.get(key) &#124;&#124; [];</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 222 | <code>        events.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 223 | <code>            ...event,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 224 | <code>            seq: nextSeq,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 225 | <code>            hostedSeq: nextSeq</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 226 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>        this.eventLogs.set(key, events.slice(-this.eventLogLimit));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 228 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>    getEvents(tenantId, { cursor = 0, limit = 100 } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 231 | <code>        const key = tenantKey(tenantId);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 232 | <code>        const boundedLimit = boundedInteger(limit, 100, 1, 500);</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 233 | <code>        const normalizedCursor = Math.max(0, Number(cursor) &#124;&#124; 0);</code> | 声明局部标识符 `normalizedCursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 234 | <code>        const events = (this.eventLogs.get(key) &#124;&#124; [])</code> | 声明局部标识符 `events`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 235 | <code>            .filter((event) =&gt; Number(event.hostedSeq &#124;&#124; event.seq) &gt; normalizedCursor)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 236 | <code>            .slice(0, boundedLimit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 237 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 238 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 239 | <code>            cursor: normalizedCursor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 240 | <code>            latestSeq: this.eventSeq.get(key) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 241 | <code>            events</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 242 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>    async runAgent(tenantId, payload = {}, options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 246 | <code>        const record = await this.getRuntime(tenantId);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 247 | <code>        record.activeRuns += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 248 | <code>        record.lastUsedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 249 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 250 | <code>            const request = sanitizeAgentRequest(payload, record);</code> | 声明局部标识符 `request`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 251 | <code>            if (typeof options.onTextDelta === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 252 | <code>                request.onTextDelta = options.onTextDelta;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 253 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>            if (typeof options.onTextStreamEvent === 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 255 | <code>                request.onTextStreamEvent = options.onTextStreamEvent;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 256 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>            return await record.gateway.runAgent(request);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 258 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 259 | <code>            record.activeRuns = Math.max(0, record.activeRuns - 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 260 | <code>            record.lastUsedAt = Date.now();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 261 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>    async interruptAgentRun(tenantId, payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 265 | <code>        const record = await this.getRuntime(tenantId);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 266 | <code>        return await record.gateway.interruptAgentRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 267 | <code>            runId: normalizeString(payload.runId).slice(0, 160),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 268 | <code>            sessionId: normalizeString(payload.sessionId &#124;&#124; payload.sessionKey, 'main').slice(0, 160),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 269 | <code>            reason: normalizeString(payload.reason, 'hosted_user_interrupt').slice(0, 240)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 270 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>    async getTenantStatus(tenantId) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 274 | <code>        const record = await this.getRuntime(tenantId);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 275 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 276 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 277 | <code>            running: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 278 | <code>            runtime: 'ailis-hosted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 279 | <code>            workspaceRoot: record.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 280 | <code>            memoryRoot: path.join(record.stateRoot, 'memory'),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 281 | <code>            taskAgentHarnessRoot: path.join(record.stateRoot, 'task-agent-harness'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 282 | <code>            gateway: record.gateway.getStatus?.({ includeAgentRunner: false }) &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 283 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>    async closeRecord(record) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 287 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 288 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 289 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>        record.unsubscribe?.();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 291 | <code>        await record.gateway?.stop?.().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 292 | <code>        this.runtimes.delete(record.key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 293 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>    async evictIdleRuntimes({ reserveSlots = 0, now = Date.now() } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 296 | <code>        const candidates = [...this.runtimes.values()]</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 297 | <code>            .filter((record) =&gt; record.activeRuns === 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 298 | <code>            .sort((left, right) =&gt; left.lastUsedAt - right.lastUsedAt);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 299 | <code>        for (const record of candidates) {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 300 | <code>            const overCapacity = this.runtimes.size + reserveSlots &gt; this.maxActiveTenants;</code> | 声明局部标识符 `overCapacity`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 301 | <code>            const expired = now - record.lastUsedAt &gt;= this.idleTtlMs;</code> | 声明局部标识符 `expired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 302 | <code>            if (!overCapacity &amp;&amp; !expired) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 303 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 304 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>            await this.closeRecord(record);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 306 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 309 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 310 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 311 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 312 | <code>            runtime: 'ailis-hosted',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 313 | <code>            dataRoot: this.dataRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 314 | <code>            activeTenantCount: this.runtimes.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 315 | <code>            maxActiveTenants: this.maxActiveTenants,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 316 | <code>            tenantsWithEvents: this.eventLogs.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 317 | <code>            llm: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 318 | <code>                provider: this.llmSettings.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 319 | <code>                baseUrl: this.llmSettings.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 320 | <code>                model: this.llmSettings.model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 321 | <code>                configured: Boolean(this.llmSettings.apiKey)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 322 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>    async close() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 327 | <code>        for (const record of [...this.runtimes.values()]) {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 328 | <code>            await this.closeRecord(record);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 329 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 334 | <code>    AILISHostedRuntimeManager,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 335 | <code>    resolveHostedLlmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 336 | <code>    sanitizeAgentRequest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 337 | <code>    tenantKey</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Hosted Runtime：把桌面 Agent 能力以服务器协议提供给网页版。”这一文件职责。 |
| 338 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
