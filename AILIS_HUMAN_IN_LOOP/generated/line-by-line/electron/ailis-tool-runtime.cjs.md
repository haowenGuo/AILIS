# electron/ailis-tool-runtime.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。
- 文件类型：`source-code`
- 原始行数：618
- SHA-256：`1aecd932a2a30518dd0b9fe65dcf06702b3d57b283e6f0afb1cd25f7730cf729`
- 可运行副本：[打开源文件](../../../source/electron/ailis-tool-runtime.cjs)
- 依赖：`./ailis-tool-contracts.cjs`、`./ailis-tool-specs.cjs`、`./ailis-tool-result.cjs`、`./ailis-mcp-adapter.cjs`、`./ailis-tool-routing.cjs`、`./ailis-artifact-tools-runtime.cjs`、`./ailis-runtime-budget.cjs`
- 主要符号：`TOOL_EXPOSURE`、`CORE_RUNTIME_TOOL_DEFINITIONS`、`CORE_RUNTIME_TOOL_IDS`、`normalizeString`、`trimmed`、`normalizeAction`、`cloneJson`、`parseDirectMcpToolId`、`makeTextResult`、`makeAgentProtocolResult`、`structuredContent`、`isError`、`compactModelPath`、`text`、`normalized`、`slashIndex`、`baseName`、`compactArtifactModelTextView`、`view`、`matrixRowCount`、`hasFormulas`、`hasErrors`、`buildContinuationRange`、`sheetName`、`columns`、`first`、`last`、`compactRowsHeadTail`、`tailCount`、`headCount`、`head`、`tail`、`omittedRows`、`addArtifactOmittedRangeMetadata`、`observation`、`range`、`stringifyArtifactModelResult`、`fallback`、`visibleTextLimit`、`compactText`、`rows`、`compacted`、`normalizeToolOutput`、`createToolSpec`、`shouldIncludeDirectToolInSearch`、`AILISRuntimeTool`、`validation`、`AILISToolRuntimeRegistry`、`tool`、`terms`、`entries`、`scored`、`score`、`directMcp`、`output`、`executeToolSearch`、`query`、`limit`、`includeMcp`、`includeDirect`、`local`、`mcp`、`tools`、`publicTools`、`spec`、`schema`、`properties`、`compactProperties`、`id`、`searchError`、`callable`、`availability`、`recommendedTool`、`routingAdvice`、`discovery`、`result`、`createAILISToolRuntimeRegistry`、`registry`、`definitionById`、`artifactToolsRuntime`、`modelResult`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const { validateToolContract } = require('./ailis-tool-contracts.cjs');</code> | 导入依赖 `./ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 2 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 3 | <code>    AILIS_RUNTIME_TOOL_DEFINITIONS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 4 | <code>    AILIS_RUNTIME_TOOL_IDS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 5 | <code>    AILIS_TOOL_EXPOSURE,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 6 | <code>    createAilisFunctionToolSpec</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 7 | <code>} = require('./ailis-tool-specs.cjs');</code> | 导入依赖 `./ailis-tool-specs.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 8 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 9 | <code>    makeAilisToolError,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 10 | <code>    makeAilisToolResult,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 11 | <code>    normalizeAilisToolOutput</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 12 | <code>} = require('./ailis-tool-result.cjs');</code> | 导入依赖 `./ailis-tool-result.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 14 | <code>    createAilisDirectMcpToolSpec,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 15 | <code>    normalizeAilisMcpCallArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 16 | <code>    parseAilisDirectMcpToolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 17 | <code>} = require('./ailis-mcp-adapter.cjs');</code> | 导入依赖 `./ailis-mcp-adapter.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 18 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 19 | <code>    buildToolRoutingAdvice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 20 | <code>    rankToolSearchResults</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 21 | <code>} = require('./ailis-tool-routing.cjs');</code> | 导入依赖 `./ailis-tool-routing.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 22 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 23 | <code>    createDefaultArtifactToolsRuntime</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 24 | <code>} = require('./ailis-artifact-tools-runtime.cjs');</code> | 导入依赖 `./ailis-artifact-tools-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 25 | <code>const { summarizeForModel } = require('./ailis-runtime-budget.cjs');</code> | 导入依赖 `./ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>const TOOL_EXPOSURE = AILIS_TOOL_EXPOSURE;</code> | 声明局部标识符 `TOOL_EXPOSURE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 28 | <code>const CORE_RUNTIME_TOOL_DEFINITIONS = AILIS_RUNTIME_TOOL_DEFINITIONS;</code> | 声明局部标识符 `CORE_RUNTIME_TOOL_DEFINITIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 29 | <code>const CORE_RUNTIME_TOOL_IDS = AILIS_RUNTIME_TOOL_IDS;</code> | 声明局部标识符 `CORE_RUNTIME_TOOL_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 32 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 33 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 36 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>function normalizeAction(value, fallback = '') {</code> | 定义函数 `normalizeAction`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 40 | <code>    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 44 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 45 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 46 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 47 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>const parseDirectMcpToolId = parseAilisDirectMcpToolId;</code> | 声明局部标识符 `parseDirectMcpToolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function makeTextResult({ status = 'completed', text = '', details = {}, structuredContent = null, isError = false } = {}) {</code> | 定义函数 `makeTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 54 | <code>    return makeAilisToolResult({ status, text, details, structuredContent, isError });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>function makeAgentProtocolResult(value = {}, { silent = false } = {}) {</code> | 定义函数 `makeAgentProtocolResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 58 | <code>    const structuredContent = value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value)</code> | 声明局部标识符 `structuredContent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 59 | <code>        ? value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 60 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 61 | <code>    const isError = structuredContent.isError === true &#124;&#124; structuredContent.ok === false;</code> | 声明局部标识符 `isError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 62 | <code>    return makeTextResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>        status: isError ? normalizeString(structuredContent.status, 'tool_error') : 'completed',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 64 | <code>        text: silent ? '' : JSON.stringify(structuredContent),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 65 | <code>        details: structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 66 | <code>        structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 67 | <code>        isError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 68 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>function compactModelPath(value = '') {</code> | 定义函数 `compactModelPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 72 | <code>    const text = String(value &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 73 | <code>    if (!text &#124;&#124; text.length &lt;= 140) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 74 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    const normalized = text.replace(/\\/g, '/');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 77 | <code>    const slashIndex = normalized.lastIndexOf('/');</code> | 声明局部标识符 `slashIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 78 | <code>    const baseName = slashIndex &gt;= 0 ? normalized.slice(slashIndex + 1) : normalized;</code> | 声明局部标识符 `baseName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 79 | <code>    return baseName.length &lt;= 120 ? `.../${baseName}` : `.../${baseName.slice(0, 48)}...${baseName.slice(-48)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 80 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>function compactArtifactModelTextView(value = {}) {</code> | 定义函数 `compactArtifactModelTextView`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 83 | <code>    const view = cloneJson(value &#124;&#124; {});</code> | 声明局部标识符 `view`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 84 | <code>    if (view.artifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 85 | <code>        view.artifact = {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 86 | <code>            ...view.artifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 87 | <code>            sourcePath: compactModelPath(view.artifact.sourcePath)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 88 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    if (view.observation?.sourcePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 91 | <code>        view.observation.sourcePath = compactModelPath(view.observation.sourcePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 92 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    if (view.plan) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 94 | <code>        view.plan = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 95 | <code>            format: view.plan.format &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 96 | <code>            kind: view.plan.kind &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 97 | <code>            adapterId: view.plan.adapterId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 98 | <code>            adapterStatus: view.plan.adapterStatus &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 99 | <code>            route: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 100 | <code>                currentTool: view.plan.route?.currentTool &#124;&#124; 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 101 | <code>                actions: Array.isArray(view.plan.route?.actions) ? view.plan.route.actions.slice(0, 12) : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 102 | <code>                note: view.plan.route?.note &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 103 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>            diagnostics: Array.isArray(view.plan.diagnostics) ? view.plan.diagnostics.slice(0, 8) : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 105 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>    if (Array.isArray(view.observation?.compactRows)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 108 | <code>        view.observation.compactRows = view.observation.compactRows.map((row) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 109 | <code>            rowNumber: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 110 | <code>            cells: Array.isArray(row.cells) ? row.cells.join(' &#124; ') : row.cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 111 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>        view.observation.cellSeparator = ' &#124; ';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 113 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    if (Array.isArray(view.observation?.matrixRows) &amp;&amp; view.observation.matrixRows.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 115 | <code>        const matrixRowCount = view.observation.matrixRows.length;</code> | 声明局部标识符 `matrixRowCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 116 | <code>        const hasFormulas = view.observation.matrixRows.some((row) =&gt; Array.isArray(row.formulas) &amp;&amp; row.formulas.some(Boolean));</code> | 声明局部标识符 `hasFormulas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 117 | <code>        const hasErrors = view.observation.matrixRows.some((row) =&gt; Array.isArray(row.errors) &amp;&amp; row.errors.some(Boolean));</code> | 声明局部标识符 `hasErrors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 118 | <code>        delete view.observation.matrixRows;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 119 | <code>        view.observation.matrixRowsAvailable = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 120 | <code>            status: 'available_in_structuredContent_details_and_artifact_tools_materialize',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 121 | <code>            rowCount: matrixRowCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 122 | <code>            hasFormulas,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 123 | <code>            hasErrors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 124 | <code>            rowSchema: 'rows[].{rowNumber, values[], fills[], formulas?, errors?}; ref = columns[index] + rowNumber'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 125 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>        view.observation.matrixRowsOmittedForModelText = 'raw matrixRows object omitted from visible text to keep the model workspace readable; compactRows remains the complete visible grid when truncated=false.';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 127 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    return view;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 129 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>function buildContinuationRange(observation = {}, rows = []) {</code> | 定义函数 `buildContinuationRange`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 132 | <code>    const sheetName = normalizeString(observation.sheetName);</code> | 声明局部标识符 `sheetName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 133 | <code>    const columns = Array.isArray(observation.columns) ? observation.columns.filter(Boolean) : [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 134 | <code>    if (!sheetName &#124;&#124; columns.length === 0 &#124;&#124; rows.length &lt; 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 135 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    const first = rows[0]?.rowNumber;</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 138 | <code>    const last = rows[rows.length - 1]?.rowNumber;</code> | 声明局部标识符 `last`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 139 | <code>    if (!first &#124;&#124; !last &#124;&#124; last &lt; first) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 140 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 141 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>    return `${sheetName}!${columns[0]}${first}:${columns[columns.length - 1]}${last}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 143 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 145 | <code>function compactRowsHeadTail(rows = [], visibleLimit = 12) {</code> | 定义函数 `compactRowsHeadTail`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 146 | <code>    if (!Array.isArray(rows) &#124;&#124; rows.length &lt;= visibleLimit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 147 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 148 | <code>            rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 149 | <code>            omittedCount: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 150 | <code>            omittedRows: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 151 | <code>            omittedRange: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 152 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    const tailCount = Math.min(4, Math.max(1, Math.floor(visibleLimit / 3)));</code> | 声明局部标识符 `tailCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 155 | <code>    const headCount = Math.max(1, visibleLimit - tailCount);</code> | 声明局部标识符 `headCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 156 | <code>    const head = rows.slice(0, headCount);</code> | 声明局部标识符 `head`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 157 | <code>    const tail = rows.slice(-tailCount);</code> | 声明局部标识符 `tail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 158 | <code>    const omittedRows = rows.slice(headCount, rows.length - tailCount);</code> | 声明局部标识符 `omittedRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 159 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>        rows: [...head, ...tail],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 161 | <code>        omittedCount: omittedRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 162 | <code>        omittedRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 163 | <code>        omittedRange: omittedRows.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 164 | <code>            ? `${omittedRows[0]?.rowNumber &#124;&#124; ''}:${omittedRows[omittedRows.length - 1]?.rowNumber &#124;&#124; ''}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 165 | <code>            : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 166 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>function addArtifactOmittedRangeMetadata(view = {}, omittedRows = []) {</code> | 定义函数 `addArtifactOmittedRangeMetadata`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 170 | <code>    const observation = view.observation &#124;&#124; {};</code> | 声明局部标识符 `observation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 171 | <code>    const range = buildContinuationRange(observation, omittedRows);</code> | 声明局部标识符 `range`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 172 | <code>    view.observation.omittedRange = range;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 173 | <code>    return view;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>function stringifyArtifactModelResult(result = {}) {</code> | 定义函数 `stringifyArtifactModelResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 177 | <code>    const fallback = {</code> | 声明局部标识符 `fallback`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 178 | <code>        ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 179 | <code>        status: result?.status &#124;&#124; (result?.ok === false ? 'failed' : 'completed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 180 | <code>        action: result?.action &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 181 | <code>        diagnostics: result?.diagnostics &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 182 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    let view = compactArtifactModelTextView(result?.modelView &#124;&#124; result?.observation &#124;&#124; fallback);</code> | 声明局部标识符 `view`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 184 | <code>    const visibleTextLimit = 5600;</code> | 声明局部标识符 `visibleTextLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 185 | <code>    let text = JSON.stringify(view, null, 2);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 186 | <code>    if (text.length &lt;= visibleTextLimit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 187 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 188 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>    if (view.plan &#124;&#124; view.protocol) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 190 | <code>        view = { ...view, protocol: undefined, plan: undefined };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 191 | <code>        if (view.observation?.sourcePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>            delete view.observation.sourcePath;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 193 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>        text = JSON.stringify(view, null, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 195 | <code>        if (text.length &lt;= visibleTextLimit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>            return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>        const compactText = JSON.stringify(view);</code> | 声明局部标识符 `compactText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 199 | <code>        if (compactText.length &lt;= 5900) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 200 | <code>            return compactText;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 201 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>    const rows = view.observation?.compactRows;</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 204 | <code>    if (text.length &gt; visibleTextLimit &amp;&amp; Array.isArray(rows) &amp;&amp; rows.length &gt; 12) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 205 | <code>        const compacted = compactRowsHeadTail(rows, 12);</code> | 声明局部标识符 `compacted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 206 | <code>        view.observation.compactRows = compacted.rows;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 207 | <code>        view.observation.omittedCompactRowCount = compacted.omittedCount;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 208 | <code>        view.observation.omittedCompactRowRange = compacted.omittedRange;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 209 | <code>        view.observation.visibleRowStrategy = 'head_tail';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 210 | <code>        view.observation.compactRowsTruncatedForModelText = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 211 | <code>        view.observation.truncatedForModelText = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 212 | <code>        addArtifactOmittedRangeMetadata(view, compacted.omittedRows);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 213 | <code>        text = JSON.stringify(view, null, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 214 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    if (text.length &gt; visibleTextLimit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 216 | <code>        text = JSON.stringify(view);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 217 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>function normalizeToolOutput(result = {}, { toolId = '' } = {}) {</code> | 定义函数 `normalizeToolOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 222 | <code>    return normalizeAilisToolOutput(result, { toolId });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>function createToolSpec(definition = {}) {</code> | 定义函数 `createToolSpec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 226 | <code>    return createAilisFunctionToolSpec(definition);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 227 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>function shouldIncludeDirectToolInSearch(entry, query, includeDirect) {</code> | 定义函数 `shouldIncludeDirectToolInSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 230 | <code>    return includeDirect === true &#124;&#124; entry.exposure !== TOOL_EXPOSURE.DIRECT;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>class AILISRuntimeTool {</code> | 定义类 `AILISRuntimeTool`，把相关状态与行为收拢为一个运行时对象。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 234 | <code>    constructor({ definition, handle }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 235 | <code>        this.definition = Object.freeze({ ...definition });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 236 | <code>        this.id = this.definition.id;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 237 | <code>        this.exposure = this.definition.exposure &#124;&#124; TOOL_EXPOSURE.DIRECT;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 238 | <code>        this.handle = handle;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 239 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>    spec() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 242 | <code>        return createToolSpec(this.definition);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>    searchInfo() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 246 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 247 | <code>            id: this.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 248 | <code>            exposure: this.exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 249 | <code>            text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 250 | <code>                this.definition.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 251 | <code>                this.definition.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 252 | <code>                this.definition.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 253 | <code>                this.definition.sectionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 254 | <code>            ].filter(Boolean).join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 255 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>    validate(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 259 | <code>        return validateToolContract(this.id, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 260 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>    async dispatch(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 263 | <code>        const validation = this.validate(args);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 264 | <code>        if (!validation.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>            return makeAilisToolError({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>                status: validation.status &#124;&#124; 'invalid_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 267 | <code>                errorCode: validation.status &#124;&#124; 'invalid_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 268 | <code>                message: `tool arguments failed contract validation: ${(validation.errors &#124;&#124; []).join('; ')}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 269 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 270 | <code>                    tool: this.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 271 | <code>                    errors: validation.errors &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 272 | <code>                    contract: validation.contract &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 273 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>        return normalizeToolOutput(await this.handle(validation.args &#124;&#124; args, context), { toolId: this.id });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 277 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>class AILISToolRuntimeRegistry {</code> | 定义类 `AILISToolRuntimeRegistry`，把相关状态与行为收拢为一个运行时对象。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 281 | <code>    constructor({ runtime }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 282 | <code>        this.runtime = runtime;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 283 | <code>        this.tools = new Map();</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 284 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>    register(tool) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 287 | <code>        if (!tool?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 288 | <code>            throw new Error('tool runtime requires id');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 289 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>        if (this.tools.has(tool.id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 291 | <code>            throw new Error(`duplicate tool runtime: ${tool.id}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 292 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>        this.tools.set(tool.id, tool);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 294 | <code>        return tool;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>    has(toolId) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 298 | <code>        return this.tools.has(toolId) &#124;&#124; Boolean(parseDirectMcpToolId(toolId));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 299 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 301 | <code>    toolIds() {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 302 | <code>        return [...this.tools.keys()];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 303 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>    definition(toolId) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 306 | <code>        const tool = this.tools.get(toolId);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 307 | <code>        return tool ? { ...tool.definition, spec: tool.spec() } : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 308 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>    listDefinitions() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 311 | <code>        return [...this.tools.values()].map((tool) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 312 | <code>            ...tool.definition,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 313 | <code>            spec: tool.spec()</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 314 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 317 | <code>    modelVisibleSpecs({ includeDeferred = false } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 318 | <code>        return [...this.tools.values()]</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 319 | <code>            .filter((tool) =&gt; includeDeferred &#124;&#124; tool.exposure === TOOL_EXPOSURE.DIRECT)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 320 | <code>            .map((tool) =&gt; tool.spec());</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 321 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 323 | <code>    search(query = '', limit = 8, { includeHidden = false } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 324 | <code>        const terms = normalizeString(query).toLowerCase().split(/\s+/).filter(Boolean);</code> | 声明局部标识符 `terms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 325 | <code>        const entries = [...this.tools.values()]</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 326 | <code>            .filter((tool) =&gt; includeHidden &#124;&#124; tool.exposure !== TOOL_EXPOSURE.HIDDEN)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 327 | <code>            .map((tool) =&gt; ({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 328 | <code>                ...tool.searchInfo(),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 329 | <code>                spec: tool.spec()</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 330 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>        const scored = entries.map((entry) =&gt; {</code> | 声明局部标识符 `scored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 332 | <code>            const text = normalizeString(entry.text).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 333 | <code>            const score = terms.length</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 334 | <code>                ? terms.reduce((sum, term) =&gt; sum + (text.includes(term) ? 1 : 0), 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 335 | <code>                : 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 336 | <code>            return { entry, score };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 337 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>        return scored</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>            .filter(({ score }) =&gt; score &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 340 | <code>            .sort((left, right) =&gt; right.score - left.score &#124;&#124; left.entry.id.localeCompare(right.entry.id))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 341 | <code>            .slice(0, Math.max(1, Math.min(Number(limit &#124;&#124; 8), 50)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 342 | <code>            .map(({ entry }) =&gt; entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 343 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>    async dispatch(toolId, args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 346 | <code>        const directMcp = parseDirectMcpToolId(toolId);</code> | 声明局部标识符 `directMcp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 347 | <code>        if (directMcp) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 348 | <code>            return await this.dispatchDirectMcpTool(directMcp, args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 349 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>        const tool = this.tools.get(toolId);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 351 | <code>        if (!tool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 352 | <code>            return makeTextResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 353 | <code>                status: 'not_materialized',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 354 | <code>                isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 355 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 356 | <code>                    tool: toolId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 357 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>        return await tool.dispatch(args, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 361 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>    async dispatchDirectMcpTool(directMcp, args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 364 | <code>        const { toolArgs, meta } = normalizeAilisMcpCallArgs(args, { tool: directMcp.tool });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 365 | <code>        const output = await this.runtime.executeMcpBridge(</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 366 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 367 | <code>                action: 'call_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 368 | <code>                server: directMcp.server,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 369 | <code>                tool: directMcp.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 370 | <code>                args: toolArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 371 | <code>                ...(meta !== undefined ? { meta } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 372 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>            context</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 374 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>        return normalizeToolOutput(output, { toolId: directMcp.id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 376 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 379 | <code>async function executeToolSearch(registry, args = {}) {</code> | 定义函数 `executeToolSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 380 | <code>    const query = normalizeString(args.query &#124;&#124; args.q);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 381 | <code>    const limit = Math.max(1, Math.min(Number(args.limit &#124;&#124; 8), 50));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 382 | <code>    const includeMcp = args.includeMcp !== false;</code> | 声明局部标识符 `includeMcp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 383 | <code>    const includeDirect = args.includeDirect === true;</code> | 声明局部标识符 `includeDirect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 384 | <code>    const local = registry.search(query, limit)</code> | 声明局部标识符 `local`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 385 | <code>        .filter((entry) =&gt; shouldIncludeDirectToolInSearch(entry, query, includeDirect))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 386 | <code>        .map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 387 | <code>            id: entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 388 | <code>            type: 'runtime_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 389 | <code>            exposure: entry.exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 390 | <code>            spec: entry.spec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 391 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>    let mcp = [];</code> | 声明局部标识符 `mcp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 393 | <code>    if (includeMcp &amp;&amp; registry.runtime?.mcpManager?.searchToolSpecs) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 394 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 395 | <code>            mcp = (await registry.runtime.mcpManager.searchToolSpecs({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 396 | <code>                query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 397 | <code>                limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 398 | <code>                timeoutMs: args.timeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 399 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>                .map((spec) =&gt; createAilisDirectMcpToolSpec({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 401 | <code>                    id: spec.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 402 | <code>                    server: spec.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 403 | <code>                    tool: spec.tool &#124;&#124; spec.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 404 | <code>                    name: spec.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 405 | <code>                    title: spec.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 406 | <code>                    description: spec.description &#124;&#124; spec.title &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 407 | <code>                    inputSchema: spec.inputSchema &#124;&#124; spec.input_schema &#124;&#124; spec.parameters &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 408 | <code>                    schemaProperties: spec.schemaProperties &#124;&#124; spec.schema_properties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 409 | <code>                    callPattern: spec.callPattern &#124;&#124; spec.call_pattern</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 410 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>                .filter((spec) =&gt; spec.callable !== false &amp;&amp; spec.modelFacing !== false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 412 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 413 | <code>            mcp = [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 414 | <code>                type: 'mcp_tool_search_error',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 415 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 416 | <code>            }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>    const tools = rankToolSearchResults([...local, ...mcp], query, limit);</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 420 | <code>    const publicTools = tools.map((entry) =&gt; {</code> | 声明局部标识符 `publicTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 421 | <code>        const spec = entry.spec &amp;&amp; typeof entry.spec === 'object' ? entry.spec : {};</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 422 | <code>        const schema = entry.input_schema &#124;&#124; entry.inputSchema &#124;&#124; entry.parameters &#124;&#124; spec.parameters &#124;&#124; {};</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 423 | <code>        const properties = schema.properties &amp;&amp; typeof schema.properties === 'object' ? schema.properties : {};</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 424 | <code>        const compactProperties = Object.fromEntries(Object.entries(properties).slice(0, 16).map(([name, property]) =&gt; [</code> | 声明局部标识符 `compactProperties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 425 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 426 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 427 | <code>                ...(property?.type ? { type: property.type } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 428 | <code>                ...(Array.isArray(property?.enum) ? { enum: property.enum.slice(0, 16) } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 429 | <code>                ...(property?.description ? { description: summarizeForModel(property.description, 240) } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 430 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>        ]));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>        const id = normalizeString(entry.id &#124;&#124; entry.name &#124;&#124; spec.name);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 433 | <code>        const searchError = normalizeString(entry.type).endsWith('_search_error');</code> | 声明局部标识符 `searchError`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 434 | <code>        const callable = Boolean(id) &amp;&amp;</code> | 声明局部标识符 `callable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 435 | <code>            !searchError &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 436 | <code>            entry.callable !== false &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 437 | <code>            spec.callable !== false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 438 | <code>        const availability = normalizeString(</code> | 声明局部标识符 `availability`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 439 | <code>            entry.availability &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 440 | <code>            entry.health &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 441 | <code>            entry.status &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 442 | <code>            spec.availability &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 443 | <code>            spec.health &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 444 | <code>            spec.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 445 | <code>            callable ? 'available' : 'unavailable'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 446 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 448 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 449 | <code>            name: normalizeString(entry.name &#124;&#124; spec.name &#124;&#124; id),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 450 | <code>            description: summarizeForModel(entry.description &#124;&#124; spec.description &#124;&#124; entry.summary &#124;&#124; entry.title &#124;&#124; id, 420),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 451 | <code>            input_schema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 452 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 453 | <code>                properties: compactProperties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 454 | <code>                required: (Array.isArray(schema.required) ? schema.required : []).filter((name) =&gt; name in compactProperties),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 455 | <code>                additionalProperties: schema.additionalProperties === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 456 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>            strict: entry.strict === true &#124;&#124; spec.strict === true &#124;&#124; schema.additionalProperties === false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 458 | <code>            callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 459 | <code>            availability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 460 | <code>            spec_ref: `tool_registry:${id}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 461 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>    const recommendedTool = publicTools.find((entry) =&gt; entry.callable) &#124;&#124; null;</code> | 声明局部标识符 `recommendedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 464 | <code>    const routingAdvice = recommendedTool ? buildToolRoutingAdvice(query, tools) : '';</code> | 声明局部标识符 `routingAdvice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 465 | <code>    const discovery = {</code> | 声明局部标识符 `discovery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 466 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 467 | <code>        query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 468 | <code>        routing_advice: routingAdvice,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 469 | <code>        recommended_tool: recommendedTool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 470 | <code>            ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 471 | <code>                  id: recommendedTool.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 472 | <code>                  name: recommendedTool.name,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 473 | <code>                  callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 474 | <code>                  availability: recommendedTool.availability</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 475 | <code>              }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 476 | <code>            : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 477 | <code>        tools: publicTools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 478 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>    const result = makeTextResult({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 480 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 481 | <code>        text: JSON.stringify(discovery, null, 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 482 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 483 | <code>            ...discovery</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 484 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>    Object.defineProperty(result, '__ailisRawToolSearchTools', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 487 | <code>        value: tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 488 | <code>        enumerable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 489 | <code>        configurable: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 490 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 492 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>function createAILISToolRuntimeRegistry(runtime) {</code> | 定义函数 `createAILISToolRuntimeRegistry`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 495 | <code>    const registry = new AILISToolRuntimeRegistry({ runtime });</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 496 | <code>    const definitionById = Object.fromEntries(CORE_RUNTIME_TOOL_DEFINITIONS.map((definition) =&gt; [definition.id, definition]));</code> | 声明局部标识符 `definitionById`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 497 | <code>    const artifactToolsRuntime = runtime.artifactToolsRuntime &#124;&#124; createDefaultArtifactToolsRuntime();</code> | 声明局部标识符 `artifactToolsRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 498 | <code>    runtime.artifactToolsRuntime = artifactToolsRuntime;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 499 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 500 | <code>        definition: definitionById.update_plan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 501 | <code>        handle: async (args, context) =&gt; runtime.updatePlan({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 502 | <code>            runId: context.runId &#124;&#124; args.runId,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 503 | <code>            sessionId: context.sessionId &#124;&#124; context.sessionKey &#124;&#124; args.sessionId &#124;&#124; 'main',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 504 | <code>            plan: args.plan &#124;&#124; args.items &#124;&#124; args.steps &#124;&#124; args.todos &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 505 | <code>            explanation: args.explanation &#124;&#124; args.summary &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 506 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 508 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 509 | <code>        definition: definitionById.tool_search,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 510 | <code>        handle: async (args) =&gt; executeToolSearch(registry, args)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 511 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 513 | <code>        definition: definitionById.artifact_tools,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 514 | <code>        handle: async (args) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 515 | <code>            const result = await artifactToolsRuntime.execute(args);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 516 | <code>            const modelResult = result?.modelView &#124;&#124; result?.observation &#124;&#124; {</code> | 声明局部标识符 `modelResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 517 | <code>                ok: result?.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 518 | <code>                status: result?.status &#124;&#124; (result?.ok === false ? 'failed' : 'completed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 519 | <code>                action: result?.action &#124;&#124; args.action &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 520 | <code>                diagnostics: result?.diagnostics &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 521 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 522 | <code>            return makeTextResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 523 | <code>                status: result.status &#124;&#124; (result.ok === false ? 'failed' : 'completed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 524 | <code>                text: stringifyArtifactModelResult({ ...result, modelView: modelResult }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 525 | <code>                details: result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 526 | <code>                structuredContent: result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 527 | <code>                isError: result.ok === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 528 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 531 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 532 | <code>        definition: definitionById.artifact_query,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 533 | <code>        handle: async (args) =&gt; runtime.queryContextArtifact(args)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 534 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 536 | <code>        definition: definitionById.artifact_compute,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 537 | <code>        handle: async (args) =&gt; runtime.computeContextArtifact(args)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 538 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 539 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 540 | <code>        definition: definitionById.output_read,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 541 | <code>        handle: async (args) =&gt; runtime.readExecOutput(args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 542 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 544 | <code>        definition: definitionById.output_tail,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 545 | <code>        handle: async (args) =&gt; runtime.tailExecOutput(args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 546 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 548 | <code>        definition: definitionById.output_search,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 549 | <code>        handle: async (args) =&gt; runtime.searchExecOutput(args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 550 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 552 | <code>        definition: definitionById.request_permissions,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 553 | <code>        handle: async (args, context) =&gt; runtime.requestPermissions(args, context)</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 554 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 555 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 556 | <code>        definition: definitionById.spawn_agent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 557 | <code>        handle: async (args, context) =&gt; makeAgentProtocolResult(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 558 | <code>            await runtime.agent_control.spawn_agent_with_metadata(args, context)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 559 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 562 | <code>        definition: definitionById.followup_task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 563 | <code>        handle: async (args, context) =&gt; makeAgentProtocolResult(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 564 | <code>            await runtime.agent_control.followup_task(args, context),</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 565 | <code>            { silent: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 566 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 568 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 569 | <code>        definition: definitionById.wait_agent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 570 | <code>        handle: async (args, context) =&gt; makeAgentProtocolResult(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 571 | <code>            await runtime.agent_control.wait_agent(args, context)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 572 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 574 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 575 | <code>        definition: definitionById.list_agents,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 576 | <code>        handle: async (args, context) =&gt; makeAgentProtocolResult(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 577 | <code>            runtime.agent_control.list_agents(args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 578 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 581 | <code>        definition: definitionById.close_agent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 582 | <code>        handle: async (args, context) =&gt; makeAgentProtocolResult(</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 583 | <code>            await runtime.agent_control.close_agent(args, context)</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 584 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 587 | <code>        definition: definitionById.mcp_bridge,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 588 | <code>        handle: async (args, context) =&gt; runtime.executeMcpBridge(args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 589 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 591 | <code>        definition: definitionById.tool_doctor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 592 | <code>        handle: async (args, context) =&gt; runtime.toolDoctor.execute(args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 593 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 595 | <code>        definition: definitionById.capability_manager,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 596 | <code>        handle: async (args, context) =&gt; runtime.capabilityManager.execute(args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 597 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 599 | <code>        definition: definitionById.self_debugger,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 600 | <code>        handle: async (args, context) =&gt; runtime.selfDebugger.execute(args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 601 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>    registry.register(new AILISRuntimeTool({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 603 | <code>        definition: definitionById.self_evolution,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 604 | <code>        handle: async (args, context) =&gt; runtime.executeSelfEvolution(args, context)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 605 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>    return registry;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 607 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 608 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 609 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 610 | <code>    TOOL_EXPOSURE,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 611 | <code>    CORE_RUNTIME_TOOL_DEFINITIONS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 612 | <code>    CORE_RUNTIME_TOOL_IDS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 613 | <code>    AILISRuntimeTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 614 | <code>    AILISToolRuntimeRegistry,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 615 | <code>    createAILISToolRuntimeRegistry,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 616 | <code>    parseDirectMcpToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 617 | <code>    normalizeToolOutput</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具执行运行时：执行已验证调用，并把结果标准化为可审计观察。”这一文件职责。 |
| 618 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
