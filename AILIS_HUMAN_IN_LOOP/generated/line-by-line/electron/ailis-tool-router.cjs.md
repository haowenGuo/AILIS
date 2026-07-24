# electron/ailis-tool-router.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工具路由层：按能力、策略和运行时状态选择可执行工具通道。
- 文件类型：`source-code`
- 原始行数：278
- SHA-256：`aca3c479f7988e3565c8d3cd386137c6c962167918655d3daf5713c352a5ee51`
- 可运行副本：[打开源文件](../../../source/electron/ailis-tool-router.cjs)
- 依赖：未从静态文本识别到显式依赖
- 主要符号：`ToolExposure`、`normalizeName`、`toolNameOf`、`annotationValue`、`annotations`、`canonicalParallelToolName`、`inferParallelToolSupport`、`explicit`、`readOnlyHint`、`canonicalName`、`safeJsonParse`、`parsed`、`normalizedToolName`、`normalizedName`、`normalizedNamespace`、`ToolRegistry`、`name`、`spec`、`supportsParallelToolCalls`、`entry`、`ToolRouter`、`toolName`、`callId`、`buildToolRouterFromModelVisibleSpecs`、`registry`、`seen`、`modelVisible`、`push`、`numericLimit`、`withoutFinal`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const ToolExposure = Object.freeze({</code> | 声明局部标识符 `ToolExposure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 4 | <code>    DIRECT: 'direct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 5 | <code>    DIRECT_MODEL_ONLY: 'direct_model_only',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 6 | <code>    DEFERRED: 'deferred'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 7 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>function normalizeName(value = '') {</code> | 定义函数 `normalizeName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 10 | <code>    return String(value &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 11 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>function toolNameOf(spec = {}) {</code> | 定义函数 `toolNameOf`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 14 | <code>    return normalizeName(spec.name &#124;&#124; spec.function?.name);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 15 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>function annotationValue(spec = {}, keys = []) {</code> | 定义函数 `annotationValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 18 | <code>    const annotations = spec.annotations &#124;&#124; spec.function?.annotations &#124;&#124; {};</code> | 声明局部标识符 `annotations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 19 | <code>    for (const key of keys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 20 | <code>        if (spec[key] !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 21 | <code>            return spec[key];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>        if (annotations[key] !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 24 | <code>            return annotations[key];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 25 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>    return undefined;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>function canonicalParallelToolName(value = '') {</code> | 定义函数 `canonicalParallelToolName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 31 | <code>    return normalizeName(value).toLowerCase().replace(/-/g, '_');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 32 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 33 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 34 | <code>function inferParallelToolSupport(name = '', spec = {}) {</code> | 定义函数 `inferParallelToolSupport`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 35 | <code>    const explicit = annotationValue(spec, [</code> | 声明局部标识符 `explicit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 36 | <code>        'supportsParallelToolCalls',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 37 | <code>        'supports_parallel_tool_calls'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 38 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>    if (typeof explicit === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 40 | <code>        return explicit;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>    const readOnlyHint = annotationValue(spec, [</code> | 声明局部标识符 `readOnlyHint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 43 | <code>        'readOnlyHint',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 44 | <code>        'read_only_hint',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 45 | <code>        'readOnly',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 46 | <code>        'read_only'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 47 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>    if (readOnlyHint === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 49 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 50 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>    const canonicalName = canonicalParallelToolName(name);</code> | 声明局部标识符 `canonicalName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 52 | <code>    if (!canonicalName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 53 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 54 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>    if (canonicalName === 'tool_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 56 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>    if (canonicalName === 'read' &#124;&#124; canonicalName === 'list' &#124;&#124; canonicalName === 'find') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 59 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>    if (/^(?:web&#124;search&#124;fetch&#124;read&#124;list&#124;find&#124;grep&#124;rg&#124;pdf&#124;doc&#124;document&#124;spreadsheet&#124;presentation&#124;image&#124;describe&#124;output&#124;artifact&#124;github&#124;browser_snapshot)(?:_&#124;$)/.test(canonicalName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 62 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>    if (/(?:__)(?:web_search&#124;web_fetch&#124;web_research&#124;search&#124;fetch&#124;read&#124;list&#124;find&#124;extract&#124;describe_image&#124;pdf_extract_text&#124;pdf_find_and_extract)$/.test(canonicalName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 65 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 66 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 68 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>function safeJsonParse(value = '', fallback = {}) {</code> | 定义函数 `safeJsonParse`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 71 | <code>    if (value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 72 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 73 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 75 | <code>        const parsed = JSON.parse(String(value &#124;&#124; '{}'));</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 76 | <code>        return parsed &amp;&amp; typeof parsed === 'object' &amp;&amp; !Array.isArray(parsed) ? parsed : fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 77 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 78 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 79 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 82 | <code>function normalizedToolName({ namespace = null, name = '' } = {}) {</code> | 定义函数 `normalizedToolName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 83 | <code>    const normalizedName = normalizeName(name);</code> | 声明局部标识符 `normalizedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 84 | <code>    const normalizedNamespace = normalizeName(namespace);</code> | 声明局部标识符 `normalizedNamespace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 85 | <code>    if (!normalizedName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 86 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 87 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>    return normalizedNamespace ? `${normalizedNamespace}__${normalizedName}` : normalizedName;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 89 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>class ToolRegistry {</code> | 定义类 `ToolRegistry`，把相关状态与行为收拢为一个运行时对象。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 92 | <code>    constructor(entries = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 93 | <code>        this.entries = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 94 | <code>        for (const entry of Array.isArray(entries) ? entries : []) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 95 | <code>            this.add(entry);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 96 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>    add(entry = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 100 | <code>        const name = toolNameOf(entry.spec &#124;&#124; entry);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 101 | <code>        if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 102 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 103 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>        const spec = entry.spec &#124;&#124; entry;</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 105 | <code>        const supportsParallelToolCalls = typeof entry.supportsParallelToolCalls === 'boolean'</code> | 声明局部标识符 `supportsParallelToolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 106 | <code>            ? entry.supportsParallelToolCalls</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 107 | <code>            : inferParallelToolSupport(name, spec);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 108 | <code>        this.entries.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 109 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 110 | <code>            exposure: entry.exposure &#124;&#124; ToolExposure.DIRECT,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 111 | <code>            spec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 112 | <code>            supportsParallelToolCalls</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 113 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    byExposure(exposure = ToolExposure.DIRECT) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 117 | <code>        return this.entries</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 118 | <code>            .filter((entry) =&gt; entry.exposure === exposure)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 119 | <code>            .map((entry) =&gt; entry.spec);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 120 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>    all() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 123 | <code>        return this.entries.map((entry) =&gt; ({ ...entry }));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 124 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>    supportsParallelToolCalls(name = '') {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 127 | <code>        const normalizedName = normalizeName(name);</code> | 声明局部标识符 `normalizedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 128 | <code>        const entry = this.entries.find((candidate) =&gt; candidate.name === normalizedName);</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 129 | <code>        return entry?.exposure !== ToolExposure.DEFERRED &amp;&amp; entry?.supportsParallelToolCalls === true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>class ToolRouter {</code> | 定义类 `ToolRouter`，把相关状态与行为收拢为一个运行时对象。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 134 | <code>    constructor({ registry = new ToolRegistry(), model_visible_specs: modelVisibleSpecs = [] } = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 135 | <code>        this.registry = registry instanceof ToolRegistry ? registry : new ToolRegistry(registry);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 136 | <code>        this.model_visible_specs = Array.isArray(modelVisibleSpecs) ? modelVisibleSpecs : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 137 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>    static fromParts(registry, modelVisibleSpecs = []) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 140 | <code>        return new ToolRouter({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 141 | <code>            registry: registry instanceof ToolRegistry ? registry : new ToolRegistry(registry),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 142 | <code>            model_visible_specs: modelVisibleSpecs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 143 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 146 | <code>    modelVisibleSpecs() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 147 | <code>        return this.model_visible_specs.map((spec) =&gt; ({ ...spec }));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 148 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>    registryEntries() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 151 | <code>        return this.registry.all();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 152 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>    buildToolCall(item = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 155 | <code>        return ToolRouter.buildToolCall(item);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 156 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>    toolSupportsParallel(call = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 159 | <code>        const toolName = normalizeName(call.toolName &#124;&#124; call.tool &#124;&#124; call.name);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 160 | <code>        return this.registry.supportsParallelToolCalls(toolName);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 161 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>    static buildToolCall(item = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 164 | <code>        if (!item &#124;&#124; typeof item !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 165 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 166 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>        if (item.type === 'function_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 168 | <code>            const toolName = normalizedToolName({</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 169 | <code>                namespace: item.namespace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 170 | <code>                name: item.name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 171 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 172 | <code>            const callId = normalizeName(item.call_id &#124;&#124; item.id);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 173 | <code>            if (!toolName &#124;&#124; !callId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 174 | <code>                return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 175 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 177 | <code>                toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 178 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 179 | <code>                payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 180 | <code>                    type: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 181 | <code>                    arguments: typeof item.arguments === 'string' ? item.arguments : JSON.stringify(item.arguments &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 182 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>                args: safeJsonParse(item.arguments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 184 | <code>                responseItem: { ...item }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 185 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>        if (item.type === 'tool_search_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 188 | <code>            if (item.execution !== 'client') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 189 | <code>                return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>            const callId = normalizeName(item.call_id &#124;&#124; item.id);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 192 | <code>            if (!callId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 193 | <code>                return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 194 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 196 | <code>                toolName: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 197 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 198 | <code>                payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 199 | <code>                    type: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 200 | <code>                    arguments: item.arguments &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 201 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>                args: item.arguments &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 203 | <code>                responseItem: { ...item }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 204 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>        if (item.type === 'custom_tool_call') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 207 | <code>            const toolName = normalizeName(item.name);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 208 | <code>            const callId = normalizeName(item.call_id &#124;&#124; item.id);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 209 | <code>            if (!toolName &#124;&#124; !callId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 210 | <code>                return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 211 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 213 | <code>                toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 214 | <code>                callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 215 | <code>                payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 216 | <code>                    type: 'custom',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 217 | <code>                    input: String(item.input &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 218 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>                args: { input: String(item.input &#124;&#124; '') },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 220 | <code>                responseItem: { ...item }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 221 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 224 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>function buildToolRouterFromModelVisibleSpecs(specs = [], {</code> | 定义函数 `buildToolRouterFromModelVisibleSpecs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 228 | <code>    exposure = ToolExposure.DIRECT,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 229 | <code>    limit = null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 230 | <code>    finalToolName = '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 231 | <code>    finalToolSpec = null</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 232 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 233 | <code>    const registry = new ToolRegistry();</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 234 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 235 | <code>    const modelVisible = [];</code> | 声明局部标识符 `modelVisible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 236 | <code>    const push = (spec, specExposure = exposure) =&gt; {</code> | 声明局部标识符 `push`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 237 | <code>        const name = toolNameOf(spec);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 238 | <code>        if (!name &#124;&#124; seen.has(name)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 239 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 240 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>        seen.add(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 242 | <code>        registry.add({ name, exposure: specExposure, spec });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 243 | <code>        modelVisible.push(spec);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 244 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 246 | <code>    for (const spec of Array.isArray(specs) ? specs : []) {</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 247 | <code>        if (finalToolName &amp;&amp; toolNameOf(spec) === finalToolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 248 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 249 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>        push(spec);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 251 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    if (finalToolSpec) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 253 | <code>        push(finalToolSpec);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 254 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 256 | <code>    if (Number.isFinite(Number(limit)) &amp;&amp; Number(limit) &gt; 0 &amp;&amp; modelVisible.length &gt; Number(limit)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 257 | <code>        const numericLimit = Number(limit);</code> | 声明局部标识符 `numericLimit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 258 | <code>        if (finalToolSpec &amp;&amp; finalToolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 259 | <code>            const withoutFinal = modelVisible.filter((spec) =&gt; toolNameOf(spec) !== finalToolName);</code> | 声明局部标识符 `withoutFinal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 260 | <code>            return ToolRouter.fromParts(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 261 | <code>                registry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 262 | <code>                withoutFinal.slice(0, Math.max(0, numericLimit - 1)).concat(finalToolSpec)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 263 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 265 | <code>        return ToolRouter.fromParts(registry, modelVisible.slice(0, numericLimit));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    return ToolRouter.fromParts(registry, modelVisible);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 268 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 271 | <code>    ToolExposure,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 272 | <code>    ToolRegistry,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 273 | <code>    ToolRouter,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 274 | <code>    buildToolRouterFromModelVisibleSpecs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 275 | <code>    inferParallelToolSupport,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 276 | <code>    safeJsonParse,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 277 | <code>    toolNameOf</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工具路由层：按能力、策略和运行时状态选择可执行工具通道。”这一文件职责。 |
| 278 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
