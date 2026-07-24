# electron/ailis-mcp-adapter.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。
- 文件类型：`source-code`
- 原始行数：428
- SHA-256：`f67eb8d716f064376427fe6985d6460b463a4973b8ec712a89b6ea47f23211af`
- 可运行副本：[打开源文件](../../../source/electron/ailis-mcp-adapter.cjs)
- 依赖：`./ailis-runtime-budget.cjs`
- 主要符号：`normalizeString`、`trimmed`、`cloneJson`、`appendDescription`、`current`、`separator`、`schemaPropertyNames`、`properties`、`ensureRequired`、`next`、`ensureStringField`、`closeObjectSchemas`、`schemaType`、`hasObjectShape`、`applyAilisKnownRequiredSchema`、`normalizedTool`、`localPathTools`、`buildAilisMcpToolDescriptionAddendum`、`enhanceAilisMcpToolSchema`、`schema`、`itemProperties`、`assessMcpToolSchemaStrength`、`propertyNames`、`required`、`alternativeRequired`、`missingRequired`、`buildAilisMcpToolCallArgs`、`pickFirstString`、`value`、`normalizeAilisMcpToolArgs`、`toolArgs`、`pathAlias`、`sanitizeAilisMcpNamePart`、`raw`、`sanitized`、`ailisMcpNamespaceForServer`、`normalizedServer`、`ailisMcpToolId`、`namespace`、`parseAilisDirectMcpToolId`、`toolId`、`match`、`server`、`tool`、`createAilisDirectMcpToolSpec`、`normalizedId`、`parsedId`、`modelId`、`legacyId`、`callableName`、`enhancedSchema`、`schemaAssessment`、`addendum`、`modelSpec`、`normalizeAilisMcpCallArgs`、`meta`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 2 | <code>    compactToolSchema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 3 | <code>    truncateMiddleText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 4 | <code>} = require('./ailis-runtime-budget.cjs');</code> | 导入依赖 `./ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 7 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 8 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 9 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 10 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 11 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 12 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 15 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 16 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 17 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 18 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 19 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>function appendDescription(target, text) {</code> | 定义函数 `appendDescription`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 23 | <code>    if (!target &#124;&#124; typeof target !== 'object' &#124;&#124; !text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 24 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 25 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>    const current = normalizeString(target.description);</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 27 | <code>    if (current.includes(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 28 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>    const separator = current &amp;&amp; /[.!?。！？]$/.test(current) ? ' ' : '. ';</code> | 声明局部标识符 `separator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 31 | <code>    target.description = current ? `${current}${separator}${text}` : text;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 32 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>function schemaPropertyNames(schema = {}) {</code> | 定义函数 `schemaPropertyNames`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 35 | <code>    const properties = schema &amp;&amp; typeof schema === 'object' &amp;&amp; !Array.isArray(schema)</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 36 | <code>        ? schema.properties &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 37 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 38 | <code>    return Object.keys(properties).filter(Boolean);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>function ensureRequired(schema = {}, fields = []) {</code> | 定义函数 `ensureRequired`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 42 | <code>    if (!schema &#124;&#124; typeof schema !== 'object' &#124;&#124; Array.isArray(schema)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 43 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>    const current = Array.isArray(schema.required) ? schema.required.filter((entry) =&gt; typeof entry === 'string') : [];</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 46 | <code>    const next = new Set(current);</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 47 | <code>    for (const field of fields) {</code> | 声明局部标识符 `field`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 48 | <code>        if (typeof field === 'string' &amp;&amp; field) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 49 | <code>            next.add(field);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 50 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    schema.required = [...next];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function ensureStringField(schema = {}, field = '') {</code> | 定义函数 `ensureStringField`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 56 | <code>    if (!schema &#124;&#124; typeof schema !== 'object' &#124;&#124; !field) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 57 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 58 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    if (!schema.properties &#124;&#124; typeof schema.properties !== 'object' &#124;&#124; Array.isArray(schema.properties)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>        schema.properties = {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 61 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    const current = schema.properties[field] &amp;&amp; typeof schema.properties[field] === 'object'</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 63 | <code>        ? schema.properties[field]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 64 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 65 | <code>    schema.properties[field] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 66 | <code>        type: 'string',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 67 | <code>        minLength: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 68 | <code>        ...current</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 69 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>    if (schema.properties[field].type === 'string' &amp;&amp; schema.properties[field].minLength === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 71 | <code>        schema.properties[field].minLength = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 72 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 73 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>function closeObjectSchemas(schema = {}) {</code> | 定义函数 `closeObjectSchemas`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 76 | <code>    if (!schema &#124;&#124; typeof schema !== 'object' &#124;&#124; Array.isArray(schema)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 77 | <code>        return schema;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>    const schemaType = normalizeString(schema.type);</code> | 声明局部标识符 `schemaType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 80 | <code>    const hasObjectShape = schemaType === 'object' &#124;&#124; Boolean(schema.properties);</code> | 声明局部标识符 `hasObjectShape`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 81 | <code>    if (hasObjectShape) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 82 | <code>        schema.type = 'object';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 83 | <code>        if (!schema.properties &#124;&#124; typeof schema.properties !== 'object' &#124;&#124; Array.isArray(schema.properties)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 84 | <code>            schema.properties = {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 85 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>        if (typeof schema.additionalProperties !== 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 87 | <code>            schema.additionalProperties = Object.keys(schema.properties).length ? false : true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 88 | <code>        } else if (schema.additionalProperties === true &amp;&amp; Object.keys(schema.properties).length) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 89 | <code>            schema.additionalProperties = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 90 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>        ensureRequired(schema, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 92 | <code>        for (const child of Object.values(schema.properties)) {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 93 | <code>            closeObjectSchemas(child);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 94 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>    if (schema.items) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 97 | <code>        closeObjectSchemas(schema.items);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 98 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    if (Array.isArray(schema.anyOf)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 100 | <code>        schema.anyOf.forEach(closeObjectSchemas);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 101 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    return schema;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 103 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>function applyAilisKnownRequiredSchema({ tool = '', inputSchema = {} } = {}) {</code> | 定义函数 `applyAilisKnownRequiredSchema`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 106 | <code>    const normalizedTool = normalizeString(tool).toLowerCase();</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 107 | <code>    const localPathTools = new Set([</code> | 声明局部标识符 `localPathTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 108 | <code>        'describe_image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 109 | <code>        'read_document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 110 | <code>        'read_presentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 111 | <code>        'read_spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 112 | <code>        'transcribe_audio'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 113 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    if (normalizedTool === 'web_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 115 | <code>        ensureStringField(inputSchema, 'query');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 116 | <code>        ensureRequired(inputSchema, ['query']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 117 | <code>        appendDescription(inputSchema.properties.query, 'Required. Do not call web_search with empty arguments.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 118 | <code>    } else if (normalizedTool === 'web_fetch') {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 119 | <code>        ensureStringField(inputSchema, 'url');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 120 | <code>        ensureRequired(inputSchema, ['url']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 121 | <code>        appendDescription(inputSchema.properties.url, 'Required HTTP(S) URL. Do not call web_fetch with empty arguments.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 122 | <code>    } else if (localPathTools.has(normalizedTool)) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 123 | <code>        ensureStringField(inputSchema, 'path');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 124 | <code>        ensureRequired(inputSchema, ['path']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 125 | <code>        appendDescription(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 126 | <code>            inputSchema.properties.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 127 | <code>            `Required local file path. Do not call ${normalizedTool} with empty arguments.`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 128 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>    return inputSchema;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 131 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>function buildAilisMcpToolDescriptionAddendum({ tool = '', inputSchema = {} } = {}) {</code> | 定义函数 `buildAilisMcpToolDescriptionAddendum`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 134 | <code>    const normalizedTool = normalizeString(tool).toLowerCase();</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 135 | <code>    const properties = inputSchema &amp;&amp; typeof inputSchema === 'object' ? inputSchema.properties &#124;&#124; {} : {};</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 136 | <code>    if (normalizedTool === 'edit_file' &amp;&amp; properties.edits) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 137 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>            'Use for editing existing text only.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 139 | <code>            'Arguments must include edits: [{ oldText, newText }].',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 140 | <code>            'oldText must exactly match existing file text.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 141 | <code>            'Do not use this tool to create or overwrite a whole file with { path, content }, replace_all, or edits[].content.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 142 | <code>            'For new Markdown/reports or whole-file output, use the local write tool: { path, content }.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 143 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 146 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>function enhanceAilisMcpToolSchema({ tool = '', inputSchema = {} } = {}) {</code> | 定义函数 `enhanceAilisMcpToolSchema`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 149 | <code>    const schema = cloneJson(inputSchema &#124;&#124; {});</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 150 | <code>    if (!schema &#124;&#124; typeof schema !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 151 | <code>        return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 152 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>    const normalizedTool = normalizeString(tool).toLowerCase();</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 154 | <code>    const properties = schema.properties &amp;&amp; typeof schema.properties === 'object' ? schema.properties : {};</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 155 | <code>    if (normalizedTool === 'edit_file' &amp;&amp; properties.edits) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>        appendDescription(schema, 'This edits existing text ranges. It is not a create-file or overwrite-file API.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 157 | <code>        appendDescription(properties.path, 'Path of an existing file to edit.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 158 | <code>        appendDescription(properties.edits, 'Required array of exact text replacements. Use [{ oldText, newText }], not { content }, replace_all, or edits[].content.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 159 | <code>        const itemProperties = properties.edits?.items?.properties &#124;&#124; {};</code> | 声明局部标识符 `itemProperties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 160 | <code>        appendDescription(itemProperties.oldText, 'Exact existing text to search for. It must match the file contents exactly.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 161 | <code>        appendDescription(itemProperties.newText, 'Replacement text to insert in place of oldText.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 162 | <code>        appendDescription(properties.dryRun, 'Set true only to preview the diff without applying changes.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 163 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    return compactToolSchema(closeObjectSchemas(applyAilisKnownRequiredSchema({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>        tool: normalizedTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 166 | <code>        inputSchema: schema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 167 | <code>    })));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 170 | <code>function assessMcpToolSchemaStrength(schema = {}) {</code> | 定义函数 `assessMcpToolSchemaStrength`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 171 | <code>    if (!schema &#124;&#124; typeof schema !== 'object' &#124;&#124; Array.isArray(schema)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 172 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 174 | <code>            reason: 'schema_not_object'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 175 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>    if (schema.type !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 178 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 180 | <code>            reason: 'schema_not_object_type'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 181 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    const properties = schema.properties &amp;&amp; typeof schema.properties === 'object' &amp;&amp; !Array.isArray(schema.properties)</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 184 | <code>        ? schema.properties</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 185 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 186 | <code>    const propertyNames = Object.keys(properties);</code> | 声明局部标识符 `propertyNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 187 | <code>    if (!propertyNames.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 188 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 189 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 190 | <code>            reason: 'schema_has_no_properties'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 191 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>    const required = Array.isArray(schema.required)</code> | 声明局部标识符 `required`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 194 | <code>        ? schema.required.filter((entry) =&gt; typeof entry === 'string' &amp;&amp; entry)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 195 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 196 | <code>    const alternativeRequired = Array.isArray(schema.anyOf)</code> | 声明局部标识符 `alternativeRequired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 197 | <code>        ? schema.anyOf</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 198 | <code>            .map((branch) =&gt; Array.isArray(branch?.required)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 199 | <code>                ? branch.required.filter((entry) =&gt; typeof entry === 'string' &amp;&amp; entry)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 200 | <code>                : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 201 | <code>            .filter((fields) =&gt; fields.length)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 202 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 203 | <code>    if (!required.length &amp;&amp; !alternativeRequired.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 205 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 206 | <code>            reason: 'schema_has_no_required_fields'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 207 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 208 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    const missingRequired = [...new Set([...required, ...alternativeRequired.flat()])]</code> | 声明局部标识符 `missingRequired`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 210 | <code>        .filter((field) =&gt; !Object.prototype.hasOwnProperty.call(properties, field));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 211 | <code>    if (missingRequired.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 212 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 213 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 214 | <code>            reason: `required_fields_missing_from_properties:${missingRequired.join(',')}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 215 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>    if (schema.additionalProperties !== false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 218 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>            callable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 220 | <code>            reason: 'schema_allows_additional_properties'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 221 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 224 | <code>        callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 225 | <code>        reason: 'strict_schema'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 226 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 229 | <code>function buildAilisMcpToolCallArgs({ tool = '', schemaProperties = [], inputSchema = {} } = {}) {</code> | 定义函数 `buildAilisMcpToolCallArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 230 | <code>    const normalizedTool = normalizeString(tool).toLowerCase();</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 231 | <code>    const properties = inputSchema &amp;&amp; typeof inputSchema === 'object' ? inputSchema.properties &#124;&#124; {} : {};</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 232 | <code>    if (normalizedTool === 'edit_file' &amp;&amp; properties.edits) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 233 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 234 | <code>            path: '&lt;existing file path&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 235 | <code>            edits: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 236 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 237 | <code>                    oldText: '&lt;exact existing text&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 238 | <code>                    newText: '&lt;replacement text&gt;'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 239 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>    return Object.fromEntries((schemaProperties &#124;&#124; []).map((key) =&gt; [key, `&lt;${key}&gt;`]));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 244 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>function pickFirstString(source = {}, keys = []) {</code> | 定义函数 `pickFirstString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 247 | <code>    for (const key of keys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 248 | <code>        const value = source?.[key];</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 249 | <code>        if (typeof value === 'string' &amp;&amp; value.trim()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 250 | <code>            return value.trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 251 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 254 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>function normalizeAilisMcpToolArgs({ tool = '', args = {} } = {}) {</code> | 定义函数 `normalizeAilisMcpToolArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 257 | <code>    const normalizedTool = normalizeString(tool).toLowerCase();</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 258 | <code>    const toolArgs = args &amp;&amp; typeof args === 'object' &amp;&amp; !Array.isArray(args)</code> | 声明局部标识符 `toolArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 259 | <code>        ? { ...args }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 260 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 261 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 262 | <code>        [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 263 | <code>            'describe_image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 264 | <code>            'read_document',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 265 | <code>            'read_presentation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 266 | <code>            'read_spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 267 | <code>            'transcribe_audio'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 268 | <code>        ].includes(normalizedTool) &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 269 | <code>        !normalizeString(toolArgs.path)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 270 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 271 | <code>        const pathAlias = pickFirstString(toolArgs, ['image_path', 'imagePath', 'file_path', 'filePath', 'file']);</code> | 声明局部标识符 `pathAlias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 272 | <code>        if (pathAlias) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 273 | <code>            toolArgs.path = pathAlias;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 274 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>    return toolArgs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 277 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 279 | <code>function sanitizeAilisMcpNamePart(value, fallback = '') {</code> | 定义函数 `sanitizeAilisMcpNamePart`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 280 | <code>    const raw = normalizeString(value, fallback);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 281 | <code>    const sanitized = raw</code> | 声明局部标识符 `sanitized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 282 | <code>        .replace(/[^A-Za-z0-9_-]+/g, '_')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 283 | <code>        .replace(/_+/g, '_')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 284 | <code>        .replace(/^_+&#124;_+$/g, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 285 | <code>    return sanitized &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 286 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 288 | <code>function ailisMcpNamespaceForServer(server = '') {</code> | 定义函数 `ailisMcpNamespaceForServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 289 | <code>    const normalizedServer = sanitizeAilisMcpNamePart(server, 'server');</code> | 声明局部标识符 `normalizedServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 290 | <code>    return `mcp__${normalizedServer}__`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 291 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 293 | <code>function ailisMcpToolId({ server = '', tool = '' } = {}) {</code> | 定义函数 `ailisMcpToolId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 294 | <code>    const namespace = ailisMcpNamespaceForServer(server);</code> | 声明局部标识符 `namespace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 295 | <code>    const normalizedTool = sanitizeAilisMcpNamePart(tool, 'tool');</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 296 | <code>    return `${namespace}${normalizedTool}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 297 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 299 | <code>function parseAilisDirectMcpToolId(value) {</code> | 定义函数 `parseAilisDirectMcpToolId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 300 | <code>    const toolId = normalizeString(value);</code> | 声明局部标识符 `toolId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 301 | <code>    if (!toolId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 302 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 303 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>    let match = toolId.match(/^mcp__([^_].*?)__(.+)$/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 305 | <code>    if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 306 | <code>        const server = normalizeString(match[1]);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 307 | <code>        const tool = normalizeString(match[2]);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 308 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 309 | <code>            id: ailisMcpToolId({ server, tool }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 310 | <code>            legacyId: `mcp:${server}:${tool}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 311 | <code>            namespace: ailisMcpNamespaceForServer(server),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 312 | <code>            callableName: sanitizeAilisMcpNamePart(tool, 'tool'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 313 | <code>            server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 314 | <code>            tool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 315 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>    match = toolId.match(/^mcp:([^:]+):(.+)$/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 318 | <code>    if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 319 | <code>        const server = normalizeString(match[1]);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 320 | <code>        const tool = normalizeString(match[2]);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 321 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>            id: ailisMcpToolId({ server, tool }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 323 | <code>            legacyId: `mcp:${server}:${tool}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 324 | <code>            namespace: ailisMcpNamespaceForServer(server),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 325 | <code>            callableName: sanitizeAilisMcpNamePart(tool, 'tool'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 326 | <code>            server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 327 | <code>            tool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 328 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>    match = toolId.match(/^mcp\.([^.]+)\.(.+)$/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 331 | <code>    if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 332 | <code>        const server = normalizeString(match[1]);</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 333 | <code>        const tool = normalizeString(match[2]);</code> | 声明局部标识符 `tool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 334 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 335 | <code>            id: ailisMcpToolId({ server, tool }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 336 | <code>            legacyId: `mcp:${server}:${tool}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 337 | <code>            namespace: ailisMcpNamespaceForServer(server),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 338 | <code>            callableName: sanitizeAilisMcpNamePart(tool, 'tool'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 339 | <code>            server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 340 | <code>            tool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 341 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 344 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 346 | <code>function createAilisDirectMcpToolSpec({ id, server, tool, name, title, description, inputSchema, schemaProperties, callPattern, descriptionAddendum } = {}) {</code> | 定义函数 `createAilisDirectMcpToolSpec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 347 | <code>    const normalizedServer = normalizeString(server);</code> | 声明局部标识符 `normalizedServer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 348 | <code>    const normalizedTool = normalizeString(tool &#124;&#124; name);</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 349 | <code>    const normalizedId = normalizeString(id) &#124;&#124; ailisMcpToolId({ server: normalizedServer, tool: normalizedTool });</code> | 声明局部标识符 `normalizedId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 350 | <code>    const parsedId = parseAilisDirectMcpToolId(normalizedId);</code> | 声明局部标识符 `parsedId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 351 | <code>    const modelId = parsedId?.id &#124;&#124; ailisMcpToolId({ server: normalizedServer, tool: normalizedTool });</code> | 声明局部标识符 `modelId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 352 | <code>    const legacyId = parsedId?.legacyId &#124;&#124; `mcp:${normalizedServer}:${normalizedTool}`;</code> | 声明局部标识符 `legacyId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 353 | <code>    const namespace = parsedId?.namespace &#124;&#124; ailisMcpNamespaceForServer(normalizedServer);</code> | 声明局部标识符 `namespace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 354 | <code>    const callableName = parsedId?.callableName &#124;&#124; sanitizeAilisMcpNamePart(normalizedTool, 'tool');</code> | 声明局部标识符 `callableName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 355 | <code>    const enhancedSchema = enhanceAilisMcpToolSchema({</code> | 声明局部标识符 `enhancedSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 356 | <code>        tool: normalizedTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 357 | <code>        inputSchema: inputSchema &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 358 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>    const schemaAssessment = assessMcpToolSchemaStrength(enhancedSchema);</code> | 声明局部标识符 `schemaAssessment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 360 | <code>    const addendum = Array.isArray(descriptionAddendum) &amp;&amp; descriptionAddendum.length</code> | 声明局部标识符 `addendum`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 361 | <code>        ? [...descriptionAddendum]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 362 | <code>        : buildAilisMcpToolDescriptionAddendum({ tool: normalizedTool, inputSchema: enhancedSchema });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 363 | <code>    const properties = Array.isArray(schemaProperties) &amp;&amp; schemaProperties.length</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 364 | <code>        ? [...schemaProperties]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 365 | <code>        : schemaPropertyNames(enhancedSchema);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 366 | <code>    const modelSpec = {</code> | 声明局部标识符 `modelSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 367 | <code>        type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 368 | <code>        name: modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 369 | <code>        description: truncateMiddleText([normalizeString(description), ...addendum].filter(Boolean).join(' '), 1200),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 370 | <code>        parameters: enhancedSchema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 371 | <code>        ...(schemaAssessment.callable ? { strict: true } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 372 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 374 | <code>        id: modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 375 | <code>        legacy_id: legacyId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 376 | <code>        type: 'mcp_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 377 | <code>        namespace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 378 | <code>        callable_name: callableName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 379 | <code>        server: normalizedServer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 380 | <code>        tool: normalizedTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 381 | <code>        title: normalizeString(title),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 382 | <code>        name: `${namespace}${callableName}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 383 | <code>        display_name: normalizeString(name &#124;&#124; tool) &#124;&#124; `${normalizedServer}.${normalizedTool}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 384 | <code>        description: modelSpec.description,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 385 | <code>        callable: schemaAssessment.callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 386 | <code>        modelFacing: schemaAssessment.callable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 387 | <code>        schema_status: schemaAssessment.callable ? 'strict' : 'weak_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 388 | <code>        weak_schema_reason: schemaAssessment.callable ? '' : schemaAssessment.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 389 | <code>        input_schema: enhancedSchema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 390 | <code>        schema_properties: properties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 391 | <code>        spec: modelSpec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 392 | <code>        call_pattern: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 393 | <code>            tool: modelId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 394 | <code>            args: callPattern?.args &#124;&#124; buildAilisMcpToolCallArgs({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 395 | <code>                tool: normalizedTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 396 | <code>                schemaProperties: properties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 397 | <code>                inputSchema: enhancedSchema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 398 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 403 | <code>function normalizeAilisMcpCallArgs(args = {}, options = {}) {</code> | 定义函数 `normalizeAilisMcpCallArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 404 | <code>    const toolArgs = args &amp;&amp; typeof args === 'object' &amp;&amp; !Array.isArray(args)</code> | 声明局部标识符 `toolArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 405 | <code>        ? { ...args }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 406 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 407 | <code>    const meta = toolArgs._meta &#124;&#124; toolArgs.meta;</code> | 声明局部标识符 `meta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 408 | <code>    delete toolArgs._meta;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 409 | <code>    delete toolArgs.meta;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 410 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 411 | <code>        toolArgs: normalizeAilisMcpToolArgs({ tool: options.tool, args: toolArgs }),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 412 | <code>        meta</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 413 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 417 | <code>    buildAilisMcpToolCallArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 418 | <code>    buildAilisMcpToolDescriptionAddendum,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 419 | <code>    assessMcpToolSchemaStrength,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 420 | <code>    ailisMcpNamespaceForServer,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 421 | <code>    ailisMcpToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 422 | <code>    createAilisDirectMcpToolSpec,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 423 | <code>    enhanceAilisMcpToolSchema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 424 | <code>    normalizeAilisMcpCallArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 425 | <code>    normalizeAilisMcpToolArgs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 426 | <code>    parseAilisDirectMcpToolId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 427 | <code>    sanitizeAilisMcpNamePart</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“MCP 适配层：发现、连接、调用外部工具服务器并管理会话可靠性。”这一文件职责。 |
| 428 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
