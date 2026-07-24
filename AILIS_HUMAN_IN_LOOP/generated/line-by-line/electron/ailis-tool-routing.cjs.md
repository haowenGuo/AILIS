# electron/ailis-tool-routing.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工具路由层：按能力、策略和运行时状态选择可执行工具通道。
- 文件类型：`source-code`
- 原始行数：532
- SHA-256：`e72448272062b6e3e14a5ef186d079b735238aee2a9d2cc0281d8ec32ffab859`
- 可运行副本：[打开源文件](../../../source/electron/ailis-tool-routing.cjs)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`normalizeString`、`trimmed`、`normalizeForSearch`、`schemaPropertyNames`、`properties`、`collectToolSearchText`、`spec`、`fn`、`inputSchema`、`schemaProperties`、`canonicalToolName`、`candidates`、`value`、`mcpMatch`、`legacyMcpMatch`、`ROUTING_PROFILES`、`queryExplicitlyRequestsWebSearch`、`queryExplicitlyMentionsYoutube`、`queryContainsYoutubeUrl`、`matchingRoutingProfiles`、`normalized`、`toolMatchesRoutingProfile`、`toolName`、`tokenizeSearchQuery`、`baseTextScore`、`terms`、`toolSpecificityScore`、`queryExplicitlyRequestsTool`、`needle`、`normalizedTool`、`RELATED_TOOL_FAMILIES`、`requestedToolFamily`、`scoreToolForQuery`、`text`、`explicitWebSearch`、`profiles`、`score`、`explicitlyRequested`、`relatedFamily`、`outputStoreContext`、`rankToolSearchResults`、`boundedLimit`、`buildToolRoutingAdvice`、`firstTool`、`profile`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 2 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 5 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 6 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 7 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>function normalizeForSearch(value) {</code> | 定义函数 `normalizeForSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 10 | <code>    return normalizeString(value).toLowerCase();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 11 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>function schemaPropertyNames(schema = {}) {</code> | 定义函数 `schemaPropertyNames`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 14 | <code>    const properties = schema &amp;&amp; typeof schema === 'object' ? schema.properties &#124;&#124; {} : {};</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 15 | <code>    return Object.keys(properties).filter(Boolean);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 16 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>function collectToolSearchText(entry = {}) {</code> | 定义函数 `collectToolSearchText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 19 | <code>    const spec = entry.spec &#124;&#124; {};</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 20 | <code>    const fn = spec.function &#124;&#124; {};</code> | 声明局部标识符 `fn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 21 | <code>    const inputSchema = entry.input_schema &#124;&#124; entry.inputSchema &#124;&#124; spec.input_schema &#124;&#124; spec.inputSchema &#124;&#124; fn.parameters &#124;&#124; spec.parameters &#124;&#124; {};</code> | 声明局部标识符 `inputSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 22 | <code>    const schemaProperties = [</code> | 声明局部标识符 `schemaProperties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 23 | <code>        ...(Array.isArray(entry.schema_properties) ? entry.schema_properties : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 24 | <code>        ...(Array.isArray(entry.schemaProperties) ? entry.schemaProperties : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 25 | <code>        ...schemaPropertyNames(inputSchema)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 26 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>        entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 29 | <code>        entry.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 30 | <code>        entry.exposure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 31 | <code>        entry.server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 32 | <code>        entry.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 33 | <code>        entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 34 | <code>        entry.display_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 35 | <code>        entry.callable_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 36 | <code>        entry.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 37 | <code>        entry.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 38 | <code>        entry.label,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 39 | <code>        spec.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 40 | <code>        spec.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 41 | <code>        spec.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 42 | <code>        fn.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 43 | <code>        fn.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 44 | <code>        entry.call_pattern?.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 45 | <code>        entry.callPattern?.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 46 | <code>        ...schemaProperties</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 47 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 49 | <code>        .join(' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 50 | <code>        .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 51 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function canonicalToolName(entry = {}) {</code> | 定义函数 `canonicalToolName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 54 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 55 | <code>        entry.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 56 | <code>        entry.callable_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 57 | <code>        entry.callableName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 58 | <code>        entry.spec?.function?.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 59 | <code>        entry.spec?.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 60 | <code>        entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 61 | <code>        entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 62 | <code>        entry.call_pattern?.tool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 63 | <code>        entry.callPattern?.tool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 64 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 66 | <code>        const value = normalizeForSearch(candidate);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 67 | <code>        if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 68 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 69 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>        const mcpMatch = value.match(/^mcp__.+?__(.+)$/);</code> | 声明局部标识符 `mcpMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 71 | <code>        if (mcpMatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 72 | <code>            return mcpMatch[1];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 73 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>        const legacyMcpMatch = value.match(/^mcp:[^:]+:(.+)$/);</code> | 声明局部标识符 `legacyMcpMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 75 | <code>        if (legacyMcpMatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 76 | <code>            return legacyMcpMatch[1];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 77 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 79 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 81 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 82 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 83 | <code>const ROUTING_PROFILES = Object.freeze([</code> | 声明局部标识符 `ROUTING_PROFILES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 84 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 85 | <code>        id: 'artifact_file_runtime',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 86 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 87 | <code>            /\b(artifact_tools&#124;artifact runtime&#124;artifact tool&#124;artifact adapter&#124;file artifact&#124;local artifact)\b/i,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 88 | <code>            /\b(attachment&#124;attached file&#124;local file&#124;file path&#124;uploaded file&#124;binary file)\b.*\b(pdf&#124;docx&#124;docm&#124;pptx&#124;ppt&#124;xlsx&#124;xlsm&#124;xls&#124;csv&#124;tsv&#124;png&#124;jpg&#124;jpeg&#124;webp&#124;image&#124;spreadsheet&#124;workbook&#124;document&#124;presentation)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 89 | <code>            /\b(pdf&#124;docx&#124;docm&#124;pptx&#124;ppt&#124;xlsx&#124;xlsm&#124;xls&#124;csv&#124;tsv&#124;png&#124;jpg&#124;jpeg&#124;webp)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 90 | <code>            /(附件&#124;本地文件&#124;文件路径&#124;产物&#124;工件).*(pdf&#124;docx&#124;pptx&#124;xlsx&#124;xlsm&#124;csv&#124;tsv&#124;图片&#124;图像&#124;表格&#124;文档&#124;演示文稿)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 91 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>        tools: ['read_document', 'read_presentation', 'read_spreadsheet', 'pdf_extract_text', 'pdf_find_and_extract', 'describe_image', 'transcribe_audio'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 93 | <code>        primaryTools: ['read_document', 'read_presentation', 'read_spreadsheet', 'pdf_extract_text', 'pdf_find_and_extract', 'describe_image'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 94 | <code>        bonus: 115,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 95 | <code>        primaryBonus: 70,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 96 | <code>        webPenalty: 90,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 97 | <code>        advice: 'Use the Codex-style coding path first for local files: read small text, exec scripts/parsers for structured files, and use strict direct MCP readers only when tool_search exposes them. Do not assume an extended artifact runtime exists on the default surface.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 98 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 100 | <code>        id: 'word_document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 101 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 102 | <code>            /\b(docx&#124;docm)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 103 | <code>            /\bword\b.*\b(document&#124;file&#124;attachment)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 104 | <code>            /\b(document&#124;attachment&#124;attached file)\b.*\b(paragraph&#124;table&#124;row&#124;docx&#124;docm)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 105 | <code>            /附件.*(word&#124;docx&#124;docm&#124;文档&#124;表格)/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 106 | <code>            /(word&#124;docx&#124;docm&#124;文档).*附件/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 107 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>        tools: ['read_document'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 109 | <code>        primaryTools: ['read_document'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 110 | <code>        bonus: 90,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 111 | <code>        primaryBonus: 48,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 112 | <code>        webPenalty: 80,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 113 | <code>        advice: 'Use read for small text files and exec for custom extraction. If tool_search exposes read_document with a strict schema, use it for Word/DOCX paragraphs and tables.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 114 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 116 | <code>        id: 'presentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 117 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 118 | <code>            /\b(ppt&#124;pptx&#124;powerpoint&#124;presentation&#124;slide deck&#124;slides?)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 119 | <code>            /(幻灯片&#124;演示文稿&#124;pptx&#124;ppt&#124;powerpoint)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 120 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>        tools: ['read_presentation'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 122 | <code>        primaryTools: ['read_presentation'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 123 | <code>        bonus: 90,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 124 | <code>        primaryBonus: 48,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 125 | <code>        webPenalty: 80,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 126 | <code>        advice: 'Use read/exec when a script can inspect the deck. If tool_search exposes read_presentation with a strict schema, use it for PowerPoint/PPTX slide content.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 127 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 129 | <code>        id: 'spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 130 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 131 | <code>            /\b(xlsx&#124;xlsm&#124;xls&#124;csv&#124;tsv&#124;spreadsheet&#124;workbook&#124;worksheet&#124;sheet&#124;columns?&#124;rows?&#124;numeric sum&#124;total)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 132 | <code>            /\b(cell colors?&#124;fill colors?&#124;merged cells?&#124;formula cells?&#124;grid map&#124;spreadsheet map)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 133 | <code>            /(电子表格&#124;工作簿&#124;表格&#124;列&#124;行&#124;求和&#124;总和&#124;单元格&#124;填充色&#124;颜色&#124;公式&#124;合并单元格)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 134 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>        tools: ['read_spreadsheet'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 136 | <code>        primaryTools: ['read_spreadsheet'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 137 | <code>        bonus: 90,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 138 | <code>        primaryBonus: 56,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 139 | <code>        webPenalty: 80,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 140 | <code>        advice: 'Use exec with spreadsheet libraries for colors, formulas, merges, renders, and grid/map tasks. Use read_spreadsheet only when a strict MCP schema is exposed and value-level extraction is sufficient.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 141 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 143 | <code>        id: 'context_artifact',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 144 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 145 | <code>            /\b(artifactid&#124;artifact_id&#124;artifact_query&#124;context artifact&#124;artifact payload&#124;payload file&#124;fulljsonpath&#124;managed artifact&#124;query artifact)\b/i,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 146 | <code>            /\b(read artifact&#124;artifact range&#124;artifact grid&#124;artifact search&#124;spreadsheet range&#124;grid query)\b/i,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 147 | <code>            /(上下文产物&#124;产物查询&#124;证据产物&#124;大文件载荷&#124;查询证据)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 148 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>        tools: ['output_read', 'output_tail', 'output_search'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 150 | <code>        primaryTools: ['output_search', 'output_read'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 151 | <code>        bonus: 95,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 152 | <code>        primaryBonus: 58,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 153 | <code>        webPenalty: 90,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 154 | <code>        advice: 'Use output_read/output_tail/output_search for stored execution outputs. For local artifact payloads, prefer read/exec and only use specialized tools that are actually exposed in the current tool set.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 155 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 157 | <code>        id: 'pdf_artifact',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 158 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 159 | <code>            /\b(local&#124;attached&#124;attachment&#124;file&#124;path&#124;downloaded)\b.*\b(pdf)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 160 | <code>            /\b(pdf)\b.*\b(local&#124;attached&#124;attachment&#124;file&#124;path&#124;downloaded&#124;extract&#124;render&#124;page&#124;search)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 161 | <code>            /(本地&#124;附件&#124;文件&#124;路径).*(pdf&#124;PDF&#124;论文&#124;报告)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 162 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>        tools: ['pdf_extract_text', 'pdf_find_and_extract'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 164 | <code>        primaryTools: ['pdf_extract_text', 'pdf_find_and_extract'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 165 | <code>        bonus: 92,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 166 | <code>        primaryBonus: 50,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 167 | <code>        webPenalty: 75,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 168 | <code>        advice: 'For local PDFs, use exec with PDF tooling when available. If strict MCP tools are exposed, use pdf_extract_text for known PDF paths/URLs and pdf_find_and_extract when discovery is still needed.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 169 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 171 | <code>        id: 'paper_report_pdf_discovery',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 172 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 173 | <code>            /\b(paper&#124;report&#124;article&#124;journal&#124;doi&#124;arxiv&#124;publication&#124;pdf&#124;exact title&#124;document title)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 174 | <code>            /(论文&#124;报告&#124;期刊&#124;标题&#124;出版&#124;pdf)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 175 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>        tools: ['paper_metadata_lookup', 'pdf_find_and_extract', 'pdf_extract_text'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 177 | <code>        primaryTools: ['paper_metadata_lookup', 'pdf_find_and_extract'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 178 | <code>        bonus: 82,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 179 | <code>        primaryBonus: 24,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 180 | <code>        webPenalty: 65,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 181 | <code>        advice: 'Use paper_metadata_lookup for paper/DOI metadata and fuzzy bibliographic clues such as author, year, topic, or journal/source. It can accept either structured fields or a raw scholarly query, then use pdf_find_and_extract or pdf_extract_text when you need the paper body.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 182 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 184 | <code>        id: 'known_url_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 185 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 186 | <code>            /\bhttps?:\/\/(?!\S+\.pdf\b)\S+/i,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 187 | <code>            /\b(known url&#124;known html&#124;article page&#124;web page&#124;fetch page&#124;extract links?)\b/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 188 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>        tools: ['web_fetch', 'web_extract_links'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 190 | <code>        primaryTools: ['web_fetch'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 191 | <code>        bonus: 62,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 192 | <code>        primaryBonus: 12,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 193 | <code>        webPenalty: 35,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 194 | <code>        advice: 'Use web_fetch or web_extract_links for a known page URL before broad web_search. For archive/listing/search/table-of-contents pages, pass query or contains with the task clues so links are ranked by relevance instead of page order.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 195 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 196 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 197 | <code>        id: 'audio',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 198 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 199 | <code>            /\b(mp3&#124;wav&#124;m4a&#124;flac&#124;audio&#124;recording&#124;transcribe&#124;speech)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 200 | <code>            /(音频&#124;录音&#124;转写&#124;语音)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 201 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>        tools: ['transcribe_audio'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 203 | <code>        bonus: 88,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 204 | <code>        webPenalty: 80,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 205 | <code>        advice: 'Use transcribe_audio for local audio evidence before web_search.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 206 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 208 | <code>        id: 'video_visual_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 209 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 210 | <code>            /\b(video&#124;youtube&#124;youtu\.be&#124;youtube\.com)\b.*\b(frame&#124;visual&#124;visible&#124;on[- ]?screen&#124;simultaneous&#124;at once&#124;species&#124;count)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 211 | <code>            /\b(frame&#124;visual&#124;visible&#124;on[- ]?screen&#124;simultaneous&#124;at once)\b.*\b(video&#124;youtube&#124;youtu\.be&#124;youtube\.com)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 212 | <code>            /(视频&#124;YouTube&#124;youtube).*(画面&#124;帧&#124;视觉&#124;同时&#124;同一时刻&#124;出现&#124;物种&#124;数量)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 213 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        tools: ['video_extract_frames', 'youtube_transcript'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 215 | <code>        primaryTools: ['video_extract_frames'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 216 | <code>        bonus: 96,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 217 | <code>        primaryBonus: 48,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 218 | <code>        webPenalty: 72,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 219 | <code>        advice: 'Use video_extract_frames for facts that must be seen in video frames, especially same-frame or simultaneous counts. Use youtube_transcript for spoken facts. Do not infer co-occurrence by combining metadata, transcript, or separate thumbnails.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 220 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 222 | <code>        id: 'image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 223 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 224 | <code>            /\b(png&#124;jpg&#124;jpeg&#124;webp&#124;image&#124;photo&#124;picture&#124;screenshot&#124;vision&#124;visual)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 225 | <code>            /(图片&#124;图像&#124;截图&#124;照片&#124;视觉)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 226 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>        tools: ['describe_image'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 228 | <code>        primaryTools: ['describe_image'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 229 | <code>        bonus: 86,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 230 | <code>        primaryBonus: 36,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 231 | <code>        webPenalty: 75,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 232 | <code>        advice: 'Use normal file inspection for metadata and describe_image only when a strict vision tool is exposed and the user needs semantic visual understanding.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 233 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 235 | <code>        id: 'python_code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 236 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 237 | <code>            /\b(py&#124;python&#124;script&#124;code output&#124;run file&#124;execute file)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 238 | <code>            /(代码&#124;脚本&#124;运行.*文件&#124;python)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 239 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>        tools: ['run_python_file'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 241 | <code>        bonus: 78,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 242 | <code>        webPenalty: 55,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 243 | <code>        advice: 'Use run_python_file for local Python/code-output questions before web_search.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 244 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 246 | <code>        id: 'github_repo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 247 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 248 | <code>            /\b(github&#124;repository&#124;repo&#124;readme&#124;source tree&#124;blob)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 249 | <code>            /(代码仓库&#124;仓库&#124;github)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 250 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>        tools: ['github_repo_read'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 252 | <code>        bonus: 72,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 253 | <code>        webPenalty: 38,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 254 | <code>        advice: 'Use github_repo_read for known GitHub repositories after repository discovery.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 255 | <code>    }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    Object.freeze({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 257 | <code>        id: 'public_web_discovery',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 258 | <code>        patterns: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 259 | <code>            /\b(kaggle&#124;competition&#124;contest&#124;leaderboard&#124;benchmark&#124;challenge&#124;latest&#124;current&#124;recent&#124;today&#124;news&#124;strategy&#124;guide&#124;walkthrough&#124;attack&#124;defense&#124;adversarial)\b/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 260 | <code>            /(最新&#124;当前&#124;今天&#124;最近&#124;新闻&#124;攻略&#124;比赛&#124;竞赛&#124;挑战&#124;排行榜&#124;攻防&#124;对抗&#124;安全&#124;检索&#124;搜索&#124;查找)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 261 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>        tools: ['web_research', 'web_search', 'web_fetch'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 263 | <code>        primaryTools: ['web_research', 'web_search'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 264 | <code>        bonus: 86,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 265 | <code>        primaryBonus: 28,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 266 | <code>        webPenalty: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 267 | <code>        advice: 'Use web_research for public/current web evidence tasks such as latest competitions, leaderboards, news, strategy, and guide requests because it plans queries, searches, fetches, ranks evidence pages, and stops for clarification when ambiguous. Use bare web_search only for discovery-only result lists.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 268 | <code>    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>function queryExplicitlyRequestsWebSearch(query = '') {</code> | 定义函数 `queryExplicitlyRequestsWebSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 272 | <code>    return /\b(web_search&#124;web search&#124;search the web&#124;internet search&#124;public web&#124;bing&#124;google&#124;duckduckgo)\b/i.test(query) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 273 | <code>        /(联网搜索&#124;网页搜索&#124;网络搜索&#124;公开网页&#124;搜索一下&#124;检索一下&#124;查一下)/i.test(query);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 274 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>function queryExplicitlyMentionsYoutube(query = '') {</code> | 定义函数 `queryExplicitlyMentionsYoutube`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 277 | <code>    return /\b(youtube&#124;youtu\.be&#124;youtube\.com&#124;yt-dlp)\b/i.test(query) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 278 | <code>        /(YouTube&#124;youtube&#124;油管)/i.test(query);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 279 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>function queryContainsYoutubeUrl(query = '') {</code> | 定义函数 `queryContainsYoutubeUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 282 | <code>    return /\bhttps?:\/\/(?:www\.)?(?:youtube\.com&#124;youtu\.be)\S+/i.test(query);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 283 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>function matchingRoutingProfiles(query = '') {</code> | 定义函数 `matchingRoutingProfiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 286 | <code>    const normalized = normalizeString(query);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 287 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 288 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 289 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>    return ROUTING_PROFILES.filter((profile) =&gt; profile.patterns.some((pattern) =&gt; pattern.test(normalized)));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 291 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>function toolMatchesRoutingProfile(entry = {}, query = '') {</code> | 定义函数 `toolMatchesRoutingProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 294 | <code>    const toolName = canonicalToolName(entry);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 295 | <code>    if (!toolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 296 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 297 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>    return matchingRoutingProfiles(query).some((profile) =&gt; (</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 299 | <code>        (profile.tools &#124;&#124; []).includes(toolName) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 300 | <code>        (profile.primaryTools &#124;&#124; []).includes(toolName)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 301 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>function tokenizeSearchQuery(query = '') {</code> | 定义函数 `tokenizeSearchQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 305 | <code>    return normalizeForSearch(query)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 306 | <code>        .split(/[^a-z0-9_./:-]+/i)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 307 | <code>        .map((term) =&gt; term.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 308 | <code>        .filter((term) =&gt; term.length &gt;= 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 309 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>function baseTextScore(query = '', text = '') {</code> | 定义函数 `baseTextScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 312 | <code>    const terms = tokenizeSearchQuery(query);</code> | 声明局部标识符 `terms`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 313 | <code>    if (!terms.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 314 | <code>        return 1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 315 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    return terms.reduce((sum, term) =&gt; sum + (text.includes(term) ? 1 : 0), 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 317 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>function toolSpecificityScore(toolName = '') {</code> | 定义函数 `toolSpecificityScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 320 | <code>    if (!toolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 321 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    if (toolName === 'web_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 324 | <code>        return -20;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 325 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>    if (toolName === 'web_research') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 327 | <code>        return 10;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 328 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>    if (toolName === 'web_fetch' &#124;&#124; toolName === 'web_extract_links') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 330 | <code>        return 4;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 331 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>    if (/^output_(read&#124;tail&#124;search)$/.test(toolName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 333 | <code>        return 14;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 334 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>    if (toolName === 'artifact_tools') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 336 | <code>        return 24;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 337 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>    if (toolName === 'artifact_query') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 339 | <code>        return 14;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 340 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>    if (/^youtube_/.test(toolName) &#124;&#124; toolName === 'video_extract_frames') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 342 | <code>        return 1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 343 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>    if (/^(read_&#124;pdf_&#124;transcribe_&#124;describe_&#124;github_&#124;run_python)/.test(toolName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 345 | <code>        return 12;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 346 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    return 1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 348 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 350 | <code>function queryExplicitlyRequestsTool(query = '', toolName = '') {</code> | 定义函数 `queryExplicitlyRequestsTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 351 | <code>    const needle = normalizeForSearch(query);</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 352 | <code>    const normalizedTool = normalizeForSearch(toolName);</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 353 | <code>    if (!needle &#124;&#124; !normalizedTool) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 354 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 355 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>    return needle.includes(normalizedTool) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 357 | <code>        needle.includes(`mcp__ailis_research__${normalizedTool}`) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 358 | <code>        needle.includes(normalizedTool.replace(/_/g, ' '));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 359 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 361 | <code>const RELATED_TOOL_FAMILIES = Object.freeze([</code> | 声明局部标识符 `RELATED_TOOL_FAMILIES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 362 | <code>    Object.freeze(['web_research', 'web_search', 'web_fetch']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 363 | <code>    Object.freeze(['output_read', 'output_tail', 'output_search'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 364 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 366 | <code>function requestedToolFamily(query = '') {</code> | 定义函数 `requestedToolFamily`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 367 | <code>    return RELATED_TOOL_FAMILIES.find((family) =&gt;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 368 | <code>        family.some((toolName) =&gt; queryExplicitlyRequestsTool(query, toolName))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 369 | <code>    ) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 370 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>function scoreToolForQuery(entry = {}, query = '') {</code> | 定义函数 `scoreToolForQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 373 | <code>    const text = collectToolSearchText(entry);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 374 | <code>    const toolName = canonicalToolName(entry);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 375 | <code>    const needle = normalizeForSearch(query);</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 376 | <code>    const explicitWebSearch = queryExplicitlyRequestsWebSearch(query);</code> | 声明局部标识符 `explicitWebSearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 377 | <code>    const profiles = matchingRoutingProfiles(query);</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 378 | <code>    let score = baseTextScore(query, text);</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 379 | <code>    const explicitlyRequested = queryExplicitlyRequestsTool(query, toolName);</code> | 声明局部标识符 `explicitlyRequested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 380 | <code>    const relatedFamily = requestedToolFamily(query);</code> | 声明局部标识符 `relatedFamily`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 381 | <code>    const outputStoreContext = explicitlyRequested &#124;&#124;</code> | 声明局部标识符 `outputStoreContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 382 | <code>        /\b(outputid&#124;output_id&#124;previewtruncated&#124;exec output&#124;stdout&#124;stderr&#124;full output&#124;stored output&#124;output store&#124;tail output&#124;search output)\b/i.test(query);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>    if (/^output_(read&#124;tail&#124;search)$/.test(toolName) &amp;&amp; !outputStoreContext) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 385 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 386 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>    if (explicitlyRequested) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 389 | <code>        score += 80;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 390 | <code>    } else if (relatedFamily?.includes(toolName)) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 391 | <code>        score += 36;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 392 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 394 | <code>    if (/^youtube_/.test(toolName) &amp;&amp; !queryExplicitlyMentionsYoutube(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 395 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 396 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 398 | <code>        toolName === 'video_extract_frames' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 399 | <code>        !/\b(video&#124;youtube&#124;youtu\.be&#124;youtube\.com&#124;mp4&#124;mov&#124;mkv&#124;webm&#124;frame&#124;visual)\b/i.test(query) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 400 | <code>        !/(视频&#124;画面&#124;帧&#124;视觉)/i.test(query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 401 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 402 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 403 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 405 | <code>        toolName === 'video_extract_frames' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 406 | <code>        queryContainsYoutubeUrl(query) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 407 | <code>        /\b(frame&#124;visual&#124;visible&#124;on[- ]?screen&#124;simultaneous&#124;at once&#124;species&#124;count)\b/i.test(query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 408 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 409 | <code>        score += 92;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 410 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>    if (toolName === 'youtube_transcript' &amp;&amp; queryContainsYoutubeUrl(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 412 | <code>        score += 90;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 413 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>    if (toolName === 'web_fetch' &amp;&amp; queryContainsYoutubeUrl(query) &amp;&amp; /\b(transcript&#124;字幕&#124;转写)\b/i.test(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 415 | <code>        score -= 40;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>        toolName === 'youtube_video_search' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 419 | <code>        queryExplicitlyMentionsYoutube(query) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 420 | <code>        !queryContainsYoutubeUrl(query)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 421 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 422 | <code>        score += 18;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 423 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 424 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 425 | <code>    if (needle &amp;&amp; toolName &amp;&amp; (needle === toolName &#124;&#124; needle.includes(toolName) &#124;&#124; text.includes(needle))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 426 | <code>        score += 18;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 427 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 429 | <code>        /^output_(read&#124;tail&#124;search)$/.test(toolName) &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 430 | <code>        outputStoreContext</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 431 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 432 | <code>        score += 36;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 433 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 435 | <code>        toolName === 'artifact_tools' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 436 | <code>        /\b(artifact_tools&#124;artifact runtime&#124;artifact tool&#124;artifact adapter&#124;file artifact&#124;local artifact&#124;attached file&#124;attachment&#124;local file&#124;file path&#124;pdf&#124;docx&#124;docm&#124;pptx&#124;ppt&#124;xlsx&#124;xlsm&#124;xls&#124;csv&#124;tsv&#124;spreadsheet&#124;workbook&#124;worksheet&#124;cell&#124;formula&#124;merge&#124;render&#124;roundtrip&#124;image&#124;png&#124;jpg&#124;jpeg&#124;webp)\b/i.test(query)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 437 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 438 | <code>        score += 62;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 439 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 440 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 441 | <code>        toolName === 'artifact_query' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 442 | <code>        /\b(artifactid&#124;artifact_id&#124;artifact_query&#124;context artifact&#124;artifact payload&#124;payload file&#124;fulljsonpath&#124;managed artifact&#124;query artifact&#124;artifact range&#124;artifact grid&#124;artifact search)\b/i.test(query)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 443 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 444 | <code>        score += 44;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 445 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>    if (toolName === 'output_read' &amp;&amp; /\b(full output&#124;read output&#124;stdout&#124;stderr&#124;byte range&#124;complete output&#124;stored output)\b/i.test(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 447 | <code>        score += 16;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 448 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    if (toolName === 'output_tail' &amp;&amp; /\b(tail&#124;last&#124;ending&#124;recent&#124;final lines&#124;bottom)\b/i.test(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 450 | <code>        score += 16;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 451 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>    if (toolName === 'output_search' &amp;&amp; outputStoreContext &amp;&amp; /\b(search&#124;find&#124;needle&#124;query&#124;match&#124;grep)\b/i.test(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 453 | <code>        score += 16;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 454 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>    if (entry.type === 'mcp_tool' &#124;&#124; /^mcp__/.test(normalizeForSearch(entry.id))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 456 | <code>        score += 3;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 457 | <code>    } else if (/^external__/.test(normalizeForSearch(entry.id))) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 458 | <code>        score += 4;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 459 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 461 | <code>    for (const profile of profiles) {</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 462 | <code>        if (profile.tools.includes(toolName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 463 | <code>            score += profile.bonus;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 464 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>        if ((profile.primaryTools &#124;&#124; []).includes(toolName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 466 | <code>            score += profile.primaryBonus &#124;&#124; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 467 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>        if (toolName === 'web_search' &amp;&amp; !explicitWebSearch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 469 | <code>            score -= profile.webPenalty ?? 50;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 470 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 473 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 474 | <code>        toolName === 'web_search' &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 475 | <code>        !explicitWebSearch &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 476 | <code>        /\b(attached&#124;attachment&#124;file&#124;local&#124;pdf&#124;document&#124;audio&#124;image&#124;spreadsheet&#124;presentation&#124;schema&#124;api)\b/i.test(query) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 477 | <code>        !profiles.some((profile) =&gt; profile.id === 'public_web_discovery')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 478 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 479 | <code>        score -= 25;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 480 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>    return score;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 483 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 485 | <code>function rankToolSearchResults(entries = [], query = '', limit = 8) {</code> | 定义函数 `rankToolSearchResults`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 486 | <code>    const boundedLimit = Math.max(1, Math.min(Number(limit) &#124;&#124; 8, 50));</code> | 声明局部标识符 `boundedLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 487 | <code>    return (Array.isArray(entries) ? entries : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 488 | <code>        .map((entry, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 489 | <code>            const score = scoreToolForQuery(entry, query);</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 490 | <code>            const toolName = canonicalToolName(entry);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 491 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 492 | <code>                entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 493 | <code>                score,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 494 | <code>                toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 495 | <code>                specificity: toolSpecificityScore(toolName),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 496 | <code>                index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 497 | <code>                id: normalizeForSearch(entry?.id &#124;&#124; entry?.name &#124;&#124; toolName)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 498 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 500 | <code>        .filter(({ score }) =&gt; score &gt; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 501 | <code>        .sort((left, right) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 502 | <code>            right.score - left.score &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 503 | <code>            right.specificity - left.specificity &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 504 | <code>            left.id.localeCompare(right.id) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 505 | <code>            left.index - right.index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 506 | <code>        )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>        .slice(0, boundedLimit)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 508 | <code>        .map(({ entry }) =&gt; entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 509 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 511 | <code>function buildToolRoutingAdvice(query = '', rankedTools = []) {</code> | 定义函数 `buildToolRoutingAdvice`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 512 | <code>    const profiles = matchingRoutingProfiles(query);</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 513 | <code>    if (!profiles.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 514 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 515 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>    const firstTool = canonicalToolName(rankedTools[0] &#124;&#124; {});</code> | 声明局部标识符 `firstTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 517 | <code>    const profile = profiles.find((candidate) =&gt; (</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 518 | <code>        (candidate.tools &#124;&#124; []).includes(firstTool) &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 519 | <code>        (candidate.primaryTools &#124;&#124; []).includes(firstTool)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 520 | <code>    )) &#124;&#124; profiles[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 521 | <code>    return profile.advice &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 522 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 525 | <code>    buildToolRoutingAdvice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 526 | <code>    canonicalToolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 527 | <code>    collectToolSearchText,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 528 | <code>    matchingRoutingProfiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 529 | <code>    rankToolSearchResults,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 530 | <code>    scoreToolForQuery,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 531 | <code>    toolMatchesRoutingProfile</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 532 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
