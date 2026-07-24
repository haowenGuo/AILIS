# scripts/toolsandbox/ailis-toolsandbox-bridge.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：290
- SHA-256：`aab9e9f95df4d3f69a88c3562f09b18a59a7bc1ec0c3d77acfa67380f4517566`
- 可运行副本：[打开源文件](../../../../source/scripts/toolsandbox/ailis-toolsandbox-bridge.mjs)
- 依赖：`node:fs`、`node:path`、`node:readline`、`node:module`
- 主要符号：`require`、`projectRoot`、`PROTOCOL_PREFIX`、`pendingToolCalls`、`gateway`、`bridgeConfig`、`toolCallCount`、`send`、`normalizeText`、`text`、`loadDesktopLlmSettings`、`reasoningEffort`、`appData`、`candidates`、`preferences`、`state`、`collectUsageCandidates`、`input`、`outputTokens`、`total`、`extractDisplayText`、`callOfficialTool`、`requestId`、`registerTool`、`name`、`parameters`、`runtimeTool`、`result`、`initialize`、`outputDir`、`auditDir`、`workspaceRoot`、`benchmarkToolNames`、`registeredTools`、`status`、`runAgent`、`llmSettings`、`providerNeedsApiKey`、`maxAgentSteps`、`officialDirectToolLimit`、`startedAt`、`response`、`responsePath`、`shutdown`、`rl`、`pending`、`operation`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 3 | <code>import readline from 'node:readline';</code> | 导入依赖 `node:readline`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 4 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 7 | <code>const projectRoot = path.resolve(process.env.AILIS_PROJECT_ROOT &#124;&#124; path.join(import.meta.dirname, '..', '..'));</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 8 | <code>const { AILISGateway } = require(path.join(projectRoot, 'electron', 'ailis-gateway.cjs'));</code> | 导入依赖 `path.join(projectRoot,`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 9 | <code>const { AILISRuntimeTool } = require(path.join(projectRoot, 'electron', 'ailis-tool-runtime.cjs'));</code> | 导入依赖 `path.join(projectRoot,`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>const PROTOCOL_PREFIX = '@@AILIS_TOOL_SANDBOX@@';</code> | 声明局部标识符 `PROTOCOL_PREFIX`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 12 | <code>const pendingToolCalls = new Map();</code> | 声明局部标识符 `pendingToolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 13 | <code>let gateway = null;</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 14 | <code>let bridgeConfig = null;</code> | 声明局部标识符 `bridgeConfig`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>let toolCallCount = 0;</code> | 声明局部标识符 `toolCallCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>function send(payload) {</code> | 定义函数 `send`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 18 | <code>    process.stdout.write(`${PROTOCOL_PREFIX}${JSON.stringify(payload)}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 19 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 22 | <code>    const text = typeof value === 'string' ? value.trim() : '';</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 23 | <code>    return text &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 24 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>function loadDesktopLlmSettings() {</code> | 定义函数 `loadDesktopLlmSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 27 | <code>    if (bridgeConfig?.provider === 'codex-model-bridge') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 28 | <code>        const reasoningEffort = normalizeText(bridgeConfig.codexReasoningEffort, 'low');</code> | 声明局部标识符 `reasoningEffort`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 29 | <code>        process.env.AILIS_CODEX_REASONING_EFFORT = reasoningEffort;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 31 | <code>            provider: 'codex-model-bridge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 32 | <code>            baseUrl: 'codex://chatgpt-oauth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 33 | <code>            model: normalizeText(bridgeConfig.codexModel, 'gpt-5.5'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 34 | <code>            apiKey: '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 35 | <code>            authMode: 'chatgpt_oauth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 36 | <code>            reasoningEffort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>            temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>            timeoutMs: Number(bridgeConfig.llmTimeoutMs &#124;&#124; 180000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 39 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    const appData = process.env.APPDATA &#124;&#124; path.join(process.env.USERPROFILE &#124;&#124; '', 'AppData', 'Roaming');</code> | 声明局部标识符 `appData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 42 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>        path.join(appData, 'ailis', 'desktop-state.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 44 | <code>        path.join(appData, 'AILIS', 'desktop-state.json')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>    let preferences = {};</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 47 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 48 | <code>        if (!fs.existsSync(candidate)) continue;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 49 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 50 | <code>            const state = JSON.parse(fs.readFileSync(candidate, 'utf8'));</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 51 | <code>            preferences = state.preferences &#124;&#124; state.state?.preferences &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 52 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 53 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 54 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 56 | <code>        provider: normalizeText(preferences.llmProvider &#124;&#124; process.env.AILIS_AGENT_LLM_PROVIDER &#124;&#124; process.env.AILIS_LLM_PROVIDER, 'openai-compatible'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>        baseUrl: normalizeText(preferences.llmBaseUrl &#124;&#124; process.env.AILIS_AGENT_LLM_BASE_URL &#124;&#124; process.env.AILIS_LLM_BASE_URL),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 58 | <code>        model: normalizeText(preferences.llmModel &#124;&#124; process.env.AILIS_AGENT_LLM_MODEL &#124;&#124; process.env.AILIS_LLM_MODEL),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>        apiKey: normalizeText(preferences.llmApiKey &#124;&#124; process.env.AILIS_AGENT_LLM_API_KEY &#124;&#124; process.env.AILIS_LLM_API_KEY),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 60 | <code>        temperature: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>        timeoutMs: Number(process.env.AILIS_TOOL_SANDBOX_LLM_TIMEOUT_MS &#124;&#124; 120000)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 62 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>function collectUsageCandidates(value, output = [], seen = new Set(), depth = 0) {</code> | 定义函数 `collectUsageCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 66 | <code>    if (!value &#124;&#124; typeof value !== 'object' &#124;&#124; seen.has(value) &#124;&#124; depth &gt; 10) return output;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 67 | <code>    seen.add(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>    const input = Number(value.input_tokens ?? value.inputTokens ?? value.prompt_tokens ?? value.promptTokens);</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 69 | <code>    const outputTokens = Number(value.output_tokens ?? value.outputTokens ?? value.completion_tokens ?? value.completionTokens);</code> | 声明局部标识符 `outputTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 70 | <code>    const total = Number(value.total_tokens ?? value.totalTokens);</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>    if (Number.isFinite(input) &#124;&#124; Number.isFinite(outputTokens) &#124;&#124; Number.isFinite(total)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 72 | <code>        output.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>            inputTokens: Number.isFinite(input) ? input : 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 74 | <code>            outputTokens: Number.isFinite(outputTokens) ? outputTokens : 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 75 | <code>            totalTokens: Number.isFinite(total) ? total : (Number.isFinite(input) ? input : 0) + (Number.isFinite(outputTokens) ? outputTokens : 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 76 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    for (const child of Array.isArray(value) ? value : Object.values(value)) {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>        collectUsageCandidates(child, output, seen, depth + 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>    return output;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 82 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>function extractDisplayText(response) {</code> | 定义函数 `extractDisplayText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 85 | <code>    return normalizeText(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>        response?.displayText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>        response?.speechText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 88 | <code>        response?.taskRunHandoff?.userVisibleSummary &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 89 | <code>        response?.result?.displayText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 90 | <code>        response?.summary?.displayText &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 91 | <code>        response?.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>        'AILIS completed the requested action.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 93 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>function callOfficialTool(name, args) {</code> | 定义函数 `callOfficialTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 97 | <code>    const requestId = `toolsandbox-tool-${Date.now()}-${toolCallCount += 1}`;</code> | 声明局部标识符 `requestId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>    return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>        pendingToolCalls.set(requestId, { resolve, reject });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>        send({ type: 'tool_call', requestId, name, args: args &#124;&#124; {} });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>function registerTool(spec) {</code> | 定义函数 `registerTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 105 | <code>    const name = normalizeText(spec?.name);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 106 | <code>    if (!name) return;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 107 | <code>    const parameters = spec.parameters &amp;&amp; typeof spec.parameters === 'object'</code> | 声明局部标识符 `parameters`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>        ? spec.parameters</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>        : { type: 'object', properties: {}, required: [] };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>    const runtimeTool = new AILISRuntimeTool({</code> | 声明局部标识符 `runtimeTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>        definition: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>            id: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 113 | <code>            label: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 114 | <code>            description: normalizeText(spec.description, name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>            sectionId: 'toolsandbox-official',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 116 | <code>            route: 'toolsandbox-official',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>            exposure: 'direct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>            strict: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>            status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>            materialized: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 121 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>        handle: async (args) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 123 | <code>            const result = await callOfficialTool(name, args);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 125 | <code>                ok: result.ok !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 126 | <code>                status: result.ok === false ? 'tool_error' : 'completed',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>                text: normalizeText(result.content, result.error &#124;&#124; 'Tool completed.'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 128 | <code>                structuredContent: result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 129 | <code>                details: result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 130 | <code>                isError: result.ok === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 131 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    runtimeTool.spec = () =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 136 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>        description: normalizeText(spec.description, name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 138 | <code>        strict: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 139 | <code>        parameters</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 140 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    gateway.gatewayToolRuntimeRegistry.register(runtimeTool);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 144 | <code>async function initialize(command) {</code> | 定义函数 `initialize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>    bridgeConfig = command;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 146 | <code>    const outputDir = path.resolve(command.outputDir);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 147 | <code>    const auditDir = path.join(outputDir, 'ailis-audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 148 | <code>    const workspaceRoot = path.join(outputDir, 'workspace');</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 149 | <code>    fs.mkdirSync(auditDir, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 150 | <code>    fs.mkdirSync(workspaceRoot, { recursive: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 151 | <code>    gateway = new AILISGateway({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 152 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>        projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>        auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 156 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    const benchmarkToolNames = (command.tools &#124;&#124; []).map((spec) =&gt; normalizeText(spec?.name)).filter(Boolean);</code> | 声明局部标识符 `benchmarkToolNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 158 | <code>    for (const spec of command.tools &#124;&#124; []) registerTool(spec);</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 159 | <code>    // Preserve the official allowlist order before any production-only runtime tools.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>    const registeredTools = gateway.gatewayToolRuntimeRegistry.tools;</code> | 声明局部标识符 `registeredTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 161 | <code>    gateway.gatewayToolRuntimeRegistry.tools = new Map([</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 162 | <code>        ...benchmarkToolNames</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 163 | <code>            .filter((name) =&gt; registeredTools.has(name))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 164 | <code>            .map((name) =&gt; [name, registeredTools.get(name)]),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>        ...[...registeredTools.entries()].filter(([name]) =&gt; !benchmarkToolNames.includes(name))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>    const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 168 | <code>    send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 169 | <code>        type: 'initialized',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>        requestId: command.requestId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>        status: status?.url ? 'ready' : 'started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>        provider: command.provider &#124;&#124; 'desktop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>        model: command.provider === 'codex-model-bridge' ? command.codexModel : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 174 | <code>        toolCount: (command.tools &#124;&#124; []).length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 175 | <code>        firstDirectTools: gateway.gatewayToolRuntimeRegistry</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 176 | <code>            .modelVisibleSpecs()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>            .slice(0, 8)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>            .map((spec) =&gt; spec.name &#124;&#124; spec.function?.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 179 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 182 | <code>async function runAgent(command) {</code> | 定义函数 `runAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>    const llmSettings = loadDesktopLlmSettings();</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 184 | <code>    const providerNeedsApiKey = !['codex-model-bridge', 'vllm', 'ollama'].includes(</code> | 声明局部标识符 `providerNeedsApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>        normalizeText(llmSettings.provider).toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 186 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>    if (!llmSettings.baseUrl &#124;&#124; !llmSettings.model &#124;&#124; (providerNeedsApiKey &amp;&amp; !llmSettings.apiKey)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 188 | <code>        throw new Error('Missing AILIS desktop LLM settings.');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 189 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>    const maxAgentSteps = Math.max(1, Math.min(Number(bridgeConfig.maxAgentSteps &#124;&#124; 7), 20));</code> | 声明局部标识符 `maxAgentSteps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 191 | <code>    const officialDirectToolLimit = Math.max(</code> | 声明局部标识符 `officialDirectToolLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 192 | <code>        1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 193 | <code>        Math.min(Array.isArray(bridgeConfig.tools) ? bridgeConfig.tools.length : 1, 40)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 194 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>    const response = await gateway.runAgent({</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 197 | <code>        sessionId: bridgeConfig.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 198 | <code>        message: command.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 199 | <code>        messageHistory: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 200 | <code>        attachments: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 201 | <code>        agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 202 | <code>        planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>        maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>        maxSteps: maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>        llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>        directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>        nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>            workspace: path.join(path.resolve(bridgeConfig.outputDir), 'workspace'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 210 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>            planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>            maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 213 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>            directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 215 | <code>            nativeDirectTools: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 216 | <code>            directToolLimit: officialDirectToolLimit,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 217 | <code>            agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 218 | <code>            requireTaskExecution: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>            requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 220 | <code>            desktopRealEval: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 221 | <code>            desktopRealEvalTaskId: bridgeConfig.scenarioName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 222 | <code>            desktopRealEvalTaskText: bridgeConfig.originalTask,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 223 | <code>            benchmarkName: 'Apple ToolSandbox',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 224 | <code>            benchmarkScenario: bridgeConfig.scenarioName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 225 | <code>            runtimeEnvironmentOverride: bridgeConfig.runtimeEnvironmentOverride,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>            autoConfirm: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 228 | <code>            approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 229 | <code>            confirmationPolicy: 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 230 | <code>            executeExternal: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 231 | <code>            allowOutsideWorkspace: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 232 | <code>            allowComputerWideAccess: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 233 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    const responsePath = path.join(path.resolve(bridgeConfig.outputDir), `ailis-response-${command.turn}.json`);</code> | 声明局部标识符 `responsePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 236 | <code>    fs.writeFileSync(responsePath, `${JSON.stringify(response, null, 2)}\n`, 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 237 | <code>    send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 238 | <code>        type: 'run_result',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 239 | <code>        requestId: command.requestId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 240 | <code>        ok: response?.ok !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>        status: response?.status &#124;&#124; (response?.ok === false ? 'failed' : 'completed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 242 | <code>        text: extractDisplayText(response),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 243 | <code>        durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 244 | <code>        provider: llmSettings.provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 245 | <code>        model: llmSettings.model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 246 | <code>        toolCallCount,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 247 | <code>        usageCandidates: collectUsageCandidates(response),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 248 | <code>        responsePath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 249 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>async function shutdown(command) {</code> | 定义函数 `shutdown`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>    if (gateway) await gateway.stop().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 254 | <code>    send({ type: 'shutdown_complete', requestId: command.requestId });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>    process.exit(0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 256 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });</code> | 声明局部标识符 `rl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>rl.on('line', (line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 260 | <code>    let command;</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 261 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 262 | <code>        command = JSON.parse(line);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 263 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 264 | <code>        send({ type: 'protocol_error', error: error.message });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 265 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    if (command.type === 'tool_result') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 268 | <code>        const pending = pendingToolCalls.get(command.requestId);</code> | 声明局部标识符 `pending`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 269 | <code>        if (pending) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 270 | <code>            pendingToolCalls.delete(command.requestId);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>            pending.resolve(command.result &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 272 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 274 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>    const operation = command.type === 'initialize'</code> | 声明局部标识符 `operation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 276 | <code>        ? initialize(command)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 277 | <code>        : command.type === 'run'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 278 | <code>            ? runAgent(command)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 279 | <code>            : command.type === 'shutdown'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 280 | <code>                ? shutdown(command)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 281 | <code>                : Promise.reject(new Error(`Unknown bridge command: ${command.type}`));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 282 | <code>    operation.catch((error) =&gt; send({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 283 | <code>        type: 'bridge_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 284 | <code>        requestId: command.requestId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 285 | <code>        error: error?.stack &#124;&#124; error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 286 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>process.on('uncaughtException', (error) =&gt; send({ type: 'bridge_error', error: error?.stack &#124;&#124; String(error) }));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 290 | <code>process.on('unhandledRejection', (error) =&gt; send({ type: 'bridge_error', error: error?.stack &#124;&#124; String(error) }));</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
