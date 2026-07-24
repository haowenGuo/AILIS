# electron/ailis-agent-object-model.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：1052
- SHA-256：`27dac1b705b371852d0a0e6d0bee79d9a202354558ed82e9683dccd11b08b1f1`
- 可运行副本：[打开源文件](../../../source/electron/ailis-agent-object-model.cjs)
- 依赖：`./ailis-runtime-budget.cjs`、`./ailis-response-model.cjs`、`./ailis-agent-runtime-protocol.cjs`
- 主要符号：`DEFAULT_TOOL_OUTPUT_CHARS`、`DEFAULT_THREAD_ITEM_PREVIEW_CHARS`、`TOOL_SEARCH_OUTPUT_DESCRIPTION_CHARS`、`TOOL_SEARCH_OUTPUT_PROPERTIES_LIMIT`、`cloneJson`、`extractText`、`text`、`mergeObjects`、`canonicalCallId`、`normalizeProviderMetadata`、`providerMetadata`、`WEB_MODEL_ADJUDICATION_KEYS`、`WEB_MODEL_ADJUDICATION_LINE`、`isWebToolName`、`normalized`、`sanitizeWebToolDetailsForModel`、`sanitizeWebToolTextForModel`、`normalizeToolOutput`、`response`、`result`、`details`、`ok`、`errorSummary`、`toolName`、`rawText`、`outputText`、`modelDetails`、`startedAt`、`finishedAt`、`durationMs`、`normalizeOutputStoreDetails`、`outputStore`、`outputId`、`bytes`、`lineCount`、`previewTruncated`、`buildModelVisibleToolMetadata`、`readArgs`、`tailArgs`、`searchArgs`、`firstObject`、`toolResultDetailViews`、`queue`、`views`、`seen`、`view`、`nested`、`normalizeStringList`、`schemaForToolSearchResult`、`compactToolSearchResultForHistory`、`schema`、`id`、`name`、`properties`、`webSearchOutputFromToolOutput`、`candidates`、`value`、`normalizeWebSearchCall`、`sourceCall`、`action`、`formatWebRunOpenPage`、`target`、`formatWebSearchCandidates`、`lines`、`refId`、`formatWebSearchStatus`、`status`、`formatWebSearchSelectionAudit`、`audit`、`count`、`parentRefs`、`suggestedCallToolName`、`normalizedTool`、`nativeTools`、`normalizedSource`、`mcpSource`、`formatWebSuggestedNextCalls`、`calls`、`formatWebSearchSources`、`sources`、`openPage`、`meta`、`excerpt`、`formatWebSearchDiagnostics`、`execution`、`diagnostics`、`pipeline`、`buildWebSearchFunctionOutput`、`contentItems`、`formatSourceViewportLinks`、`links`、`sourceRef`、`url`、`sourceViewportFromToolOutput`、`sourceWindow`、`actionType`、`normalizedActionType`、`lineStart`、`normalizeSourceViewportWebSearchCall`、`formatSourceViewportLines`、`rendered`、`lineEnd`、`formatExpandedLongSourceLines`、`expanded`、`compactTableCell`、`formatStructuredTableProjections`、`tables`、`projections`、`visibleChars`、`columns`、`metadata`、`projectionRows`、`formatSourceViewportMatches`、`matches`、`lineno`、`formatSourceSelectionProtocol`、`protocol`、`ranges`、`buildSourceViewportFunctionOutput`、`header`、`toolOutputToResponseItems`、`callId`、`tools`、`sourceViewport`、`webSearchOutput`、`metadataLines`、`output`、`modelImage`、`modelImageUrl`、`outputPayload`、`toolOutputToRuntimeEvent`、`toolOutputToThreadItem`、`makeRolloutItem`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>'use strict';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const { summarizeForModel } = require('./ailis-runtime-budget.cjs');</code> | 导入依赖 `./ailis-runtime-budget.cjs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>    ContentItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 6 | <code>    FunctionCallOutputPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 7 | <code>    ResponseItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>    normalizeText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>    safeJsonStringify</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>} = require('./ailis-response-model.cjs');</code> | 导入依赖 `./ailis-response-model.cjs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 12 | <code>    RUNTIME_LAYER,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 13 | <code>    normalizeRuntimeEvent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>} = require('./ailis-agent-runtime-protocol.cjs');</code> | 导入依赖 `./ailis-agent-runtime-protocol.cjs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>const DEFAULT_TOOL_OUTPUT_CHARS = 24000;</code> | 声明局部标识符 `DEFAULT_TOOL_OUTPUT_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>const DEFAULT_THREAD_ITEM_PREVIEW_CHARS = 1200;</code> | 声明局部标识符 `DEFAULT_THREAD_ITEM_PREVIEW_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>const TOOL_SEARCH_OUTPUT_DESCRIPTION_CHARS = 220;</code> | 声明局部标识符 `TOOL_SEARCH_OUTPUT_DESCRIPTION_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>const TOOL_SEARCH_OUTPUT_PROPERTIES_LIMIT = 32;</code> | 声明局部标识符 `TOOL_SEARCH_OUTPUT_PROPERTIES_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>    if (value == null &#124;&#124; typeof value !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 23 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 24 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>    return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 26 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>function extractText(value) {</code> | 定义函数 `extractText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 29 | <code>    if (value == null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 30 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 31 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 33 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>    if (typeof value.text === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 36 | <code>        return value.text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    if (typeof value.content === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 39 | <code>        return value.content;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>    if (Array.isArray(value.content)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 42 | <code>        const text = value.content</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>            .map((part) =&gt; (typeof part?.text === 'string' ? part.text : ''))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 44 | <code>            .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 45 | <code>            .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 46 | <code>        if (text.trim()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 47 | <code>            return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>    if (typeof value.stdout === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>        return value.stdout;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 52 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    if (typeof value.preview === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 54 | <code>        return value.preview;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    return safeJsonStringify(value, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>function mergeObjects(...values) {</code> | 定义函数 `mergeObjects`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 60 | <code>    return values</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 61 | <code>        .filter((value) =&gt; value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 62 | <code>        .reduce((merged, value) =&gt; ({ ...merged, ...cloneJson(value) }), {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 63 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>function canonicalCallId(input = {}, index = 0) {</code> | 定义函数 `canonicalCallId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 66 | <code>    return normalizeText(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>        input.callId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 68 | <code>            input.call_id &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 69 | <code>            input.nativeToolCall?.call_id &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 70 | <code>            input.nativeToolCall?.id &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 71 | <code>            input.id &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>            `call_${index + 1}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 73 | <code>    ).replace(/[^A-Za-z0-9_-]/g, '_');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 74 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>function normalizeProviderMetadata(input = {}) {</code> | 定义函数 `normalizeProviderMetadata`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 77 | <code>    const providerMetadata =</code> | 声明局部标识符 `providerMetadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 78 | <code>        input.providerMetadata &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>        input.provider_metadata &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 80 | <code>        input.nativeToolCall?.providerMetadata &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>        input.nativeToolCall?.provider_metadata &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>        null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>    return providerMetadata &amp;&amp; typeof providerMetadata === 'object' &amp;&amp; !Array.isArray(providerMetadata)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 84 | <code>        ? cloneJson(providerMetadata)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 85 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 86 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>const WEB_MODEL_ADJUDICATION_KEYS = new Set([</code> | 声明局部标识符 `WEB_MODEL_ADJUDICATION_KEYS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 89 | <code>    'complete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 90 | <code>    'outputComplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 91 | <code>    'output_complete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 92 | <code>    'outputTruncatedForModel',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 93 | <code>    'output_truncated_for_model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>    'sourceRetrievalComplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>    'source_retrieval_complete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 96 | <code>    'sourceWindowCoversTask',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 97 | <code>    'source_window_covers_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 98 | <code>    'observationContract',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 99 | <code>    'observation_contract',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 100 | <code>    'readiness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 101 | <code>    'reasoningReady',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 102 | <code>    'reasoning_ready',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 103 | <code>    'modelJudgesEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 104 | <code>    'model_judges_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 105 | <code>    'isEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 106 | <code>    'is_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 107 | <code>    'answerReadiness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 108 | <code>    'answer_readiness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 109 | <code>    'retrievalReadiness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 110 | <code>    'retrieval_readiness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 111 | <code>    'readinessAuthority',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 112 | <code>    'readiness_authority',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 113 | <code>    'evidenceDecision',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 114 | <code>    'evidence_decision',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 115 | <code>    'requiresEvidenceAudit',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 116 | <code>    'requires_evidence_audit',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 117 | <code>    'evidenceGap',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 118 | <code>    'evidence_gap',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 119 | <code>    'evidenceQuality',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 120 | <code>    'evidence_quality',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 121 | <code>    'evidenceScore',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 122 | <code>    'evidence_score',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 123 | <code>    'evidenceScoreBreakdown',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 124 | <code>    'evidence_score_breakdown',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 125 | <code>    'contentQuality',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 126 | <code>    'content_quality',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 127 | <code>    'recoveryHint',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 128 | <code>    'recovery_hint',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 129 | <code>    'outputPolicy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 130 | <code>    'output_policy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 131 | <code>    'retrievalNote',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 132 | <code>    'retrieval_note',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 133 | <code>    'pageType',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 134 | <code>    'page_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 135 | <code>    'pageStatus',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 136 | <code>    'page_status'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 137 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>const WEB_MODEL_ADJUDICATION_LINE = /^\s*(?:complete&#124;output[_ ]?(?:complete&#124;truncated[_ ]?for[_ ]?model&#124;policy)&#124;source[_ ]?retrieval[_ ]?complete&#124;source[_ ]?window[_ ]?covers[_ ]?task&#124;observation[_ ]?contract&#124;reasoning[_ ]?ready&#124;model[_ ]?judges[_ ]?evidence&#124;is[_ ]?evidence&#124;(?:answer&#124;retrieval)?[_ ]?readiness&#124;readiness[_ ]?authority&#124;evidence[_ ]?(?:decision&#124;gap&#124;quality&#124;score)&#124;content[_ ]?quality&#124;requires[_ ]?evidence[_ ]?audit&#124;recovery[_ ]?hint&#124;retrieval[_ ]?note&#124;suggested[_ ]?next[_ ]?calls&#124;page[_ ]?(?:type&#124;status))\s*[:=]/i;</code> | 声明局部标识符 `WEB_MODEL_ADJUDICATION_LINE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>function isWebToolName(toolName = '') {</code> | 定义函数 `isWebToolName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 142 | <code>    const normalized = normalizeText(toolName).toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 143 | <code>    return /(?:^&#124;__&#124;:&#124;\.)(web_run&#124;web_search&#124;web_fetch&#124;web_research&#124;web_extract_links&#124;open_page&#124;find_in_page)$/.test(normalized) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 144 | <code>        ['web_run', 'web_search', 'web_fetch', 'web_research', 'web_extract_links', 'open_page', 'find_in_page'].includes(normalized);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 145 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>function sanitizeWebToolDetailsForModel(value, depth = 0) {</code> | 定义函数 `sanitizeWebToolDetailsForModel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 148 | <code>    if (depth &gt; 8 &#124;&#124; value === null &#124;&#124; value === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 149 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 150 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    if (Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 152 | <code>        return value.map((item) =&gt; sanitizeWebToolDetailsForModel(item, depth + 1));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    if (typeof value !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 155 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 156 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    return Object.fromEntries(Object.entries(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 158 | <code>        .filter(([key]) =&gt; !WEB_MODEL_ADJUDICATION_KEYS.has(key))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>        .map(([key, item]) =&gt; [key, sanitizeWebToolDetailsForModel(item, depth + 1)]));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 160 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 162 | <code>function sanitizeWebToolTextForModel(value = '') {</code> | 定义函数 `sanitizeWebToolTextForModel`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 163 | <code>    const text = normalizeText(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 164 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 165 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 166 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>    if ((text.startsWith('{') &amp;&amp; text.endsWith('}')) &#124;&#124; (text.startsWith('[') &amp;&amp; text.endsWith(']'))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 168 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 169 | <code>            return safeJsonStringify(sanitizeWebToolDetailsForModel(JSON.parse(text)), text);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 170 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 171 | <code>            // Fall through to the line-oriented representation used by MCP text output.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    return text</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 175 | <code>        .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 176 | <code>        .filter((line) =&gt; !WEB_MODEL_ADJUDICATION_LINE.test(line))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 177 | <code>        .join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 178 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 179 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>function normalizeToolOutput(input = {}, index = 0, options = {}) {</code> | 定义函数 `normalizeToolOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 182 | <code>    const response = input.response &#124;&#124; input.result &#124;&#124; {};</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 183 | <code>    const result = response.result ?? input.output ?? response.output ?? null;</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 184 | <code>    const details = mergeObjects(</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 185 | <code>        response.result?.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>        response.result?.details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 187 | <code>        response.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 188 | <code>        response.structured_content,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 189 | <code>        response.details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 190 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    const ok = response.ok === true &#124;&#124; input.ok === true;</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 192 | <code>    const errorSummary = normalizeText(</code> | 声明局部标识符 `errorSummary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 193 | <code>        response.error &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 194 | <code>            input.error &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 195 | <code>            details.errorSummary &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 196 | <code>            details.error &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 197 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 198 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>    const toolName = normalizeText(input.tool &#124;&#124; input.name &#124;&#124; input.nativeToolCall?.name);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 200 | <code>    const rawText = extractText(result) &#124;&#124; errorSummary &#124;&#124; extractText(response);</code> | 声明局部标识符 `rawText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 201 | <code>    const outputText = isWebToolName(toolName)</code> | 声明局部标识符 `outputText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 202 | <code>        ? sanitizeWebToolTextForModel(rawText)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 203 | <code>        : rawText;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 204 | <code>    const modelDetails = isWebToolName(toolName)</code> | 声明局部标识符 `modelDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 205 | <code>        ? sanitizeWebToolDetailsForModel(details &#124;&#124; {})</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 206 | <code>        : cloneJson(details &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 207 | <code>    const startedAt = Number(input.startedAt ?? input.started_at ?? 0) &#124;&#124; null;</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 208 | <code>    const finishedAt = Number(input.finishedAt ?? input.finished_at ?? 0) &#124;&#124; null;</code> | 声明局部标识符 `finishedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 209 | <code>    const durationMs = Number(</code> | 声明局部标识符 `durationMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 210 | <code>        input.durationMs ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 211 | <code>            input.duration_ms ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 212 | <code>            response.durationMs ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 213 | <code>            response.duration_ms ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 214 | <code>            details.durationMs ??</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 215 | <code>            details.duration_ms</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 216 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>        schema: 'ailis.tool_output.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 220 | <code>        callId: canonicalCallId(input, index),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 221 | <code>        sourceId: input.id &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 222 | <code>        toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 223 | <code>        title: normalizeText(input.title &#124;&#124; input.tool &#124;&#124; input.name &#124;&#124; 'tool'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 224 | <code>        args: cloneJson(input.modelArgs &#124;&#124; input.args &#124;&#124; input.nativeToolCall?.arguments &#124;&#124; {}),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 225 | <code>        status: normalizeText(response.status &#124;&#124; input.status &#124;&#124; (ok ? 'completed' : 'failed')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 226 | <code>        ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 227 | <code>        outputText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 228 | <code>        outputPreview: summarizeForModel(outputText, options.previewChars &#124;&#124; DEFAULT_THREAD_ITEM_PREVIEW_CHARS),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 229 | <code>        errorSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 230 | <code>        evidenceRefs: Array.isArray(input.evidenceRefs) ? input.evidenceRefs.slice() : [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 231 | <code>        evidenceArtifacts: Array.isArray(input.evidenceArtifacts) ? cloneJson(input.evidenceArtifacts) : [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 232 | <code>        providerMetadata: normalizeProviderMetadata(input),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 233 | <code>        details: modelDetails,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 234 | <code>        startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 235 | <code>        finishedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 236 | <code>        durationMs: Number.isFinite(durationMs) ? durationMs : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 237 | <code>        original: options.keepOriginal === true ? cloneJson(input) : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 238 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>function normalizeOutputStoreDetails(details = {}) {</code> | 定义函数 `normalizeOutputStoreDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 242 | <code>    const outputStore = details &amp;&amp; typeof details.outputStore === 'object' ? details.outputStore : {};</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 243 | <code>    const outputId = normalizeText(details.outputId &#124;&#124; outputStore.outputId);</code> | 声明局部标识符 `outputId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 244 | <code>    if (!outputId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 245 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    const bytes = details.outputBytes ?? outputStore.bytes ?? outputStore.combinedBytes ?? null;</code> | 声明局部标识符 `bytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 248 | <code>    const lineCount = details.outputLineCount ?? outputStore.lineCount ?? null;</code> | 声明局部标识符 `lineCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 249 | <code>    const previewTruncated = details.outputPreviewTruncated === true &#124;&#124; outputStore.previewTruncated === true;</code> | 声明局部标识符 `previewTruncated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 250 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 251 | <code>        outputId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 252 | <code>        bytes: Number.isFinite(Number(bytes)) ? Number(bytes) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 253 | <code>        lineCount: Number.isFinite(Number(lineCount)) ? Number(lineCount) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 254 | <code>        previewTruncated</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 255 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>function buildModelVisibleToolMetadata(toolOutput = {}) {</code> | 定义函数 `buildModelVisibleToolMetadata`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 259 | <code>    const outputStore = normalizeOutputStoreDetails(toolOutput.details &#124;&#124; {});</code> | 声明局部标识符 `outputStore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 260 | <code>    if (!outputStore) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 261 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 262 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>    const readArgs = { outputId: outputStore.outputId };</code> | 声明局部标识符 `readArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 264 | <code>    const tailArgs = { outputId: outputStore.outputId };</code> | 声明局部标识符 `tailArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 265 | <code>    const searchArgs = { outputId: outputStore.outputId, query: '&lt;text&gt;' };</code> | 声明局部标识符 `searchArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 266 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 267 | <code>        [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 268 | <code>            `OutputArtifact: outputId=${outputStore.outputId}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 269 | <code>            outputStore.bytes != null ? `bytes=${outputStore.bytes}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 270 | <code>            outputStore.lineCount != null ? `lines=${outputStore.lineCount}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 271 | <code>            `previewTruncated=${outputStore.previewTruncated ? 'true' : 'false'}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 272 | <code>        ].filter(Boolean).join(' '),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 273 | <code>        outputStore.previewTruncated</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 274 | <code>            ? `OutputArtifactTools: output_read ${safeJsonStringify(readArgs, '{}')} &#124; output_tail ${safeJsonStringify(tailArgs, '{}')} &#124; output_search ${safeJsonStringify(searchArgs, '{}')}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 275 | <code>            : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 276 | <code>        outputStore.previewTruncated</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 277 | <code>            ? 'OutputArtifactHint: full stdout/stderr is stored by outputId; inspect only the needed slice instead of rerunning the same command to recover truncated text.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 278 | <code>            : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 279 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 280 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>function firstObject(...values) {</code> | 定义函数 `firstObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 283 | <code>    return values.find((value) =&gt; value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value)) &#124;&#124; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>function toolResultDetailViews(toolOutput = {}) {</code> | 定义函数 `toolResultDetailViews`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 287 | <code>    const queue = [firstObject(toolOutput.details)];</code> | 声明局部标识符 `queue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 288 | <code>    const views = [];</code> | 声明局部标识符 `views`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 289 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 290 | <code>    while (queue.length &amp;&amp; views.length &lt; 16) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 291 | <code>        const view = queue.shift();</code> | 声明局部标识符 `view`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 292 | <code>        if (!view &#124;&#124; typeof view !== 'object' &#124;&#124; Array.isArray(view) &#124;&#124; seen.has(view)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 293 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 294 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>        seen.add(view);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 296 | <code>        views.push(view);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 297 | <code>        for (const key of ['structuredContent', 'structured_content', 'details', 'result']) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 298 | <code>            const nested = view[key];</code> | 声明局部标识符 `nested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 299 | <code>            if (nested &amp;&amp; typeof nested === 'object' &amp;&amp; !Array.isArray(nested)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 300 | <code>                queue.push(nested);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 301 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>    return views;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 305 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>function normalizeStringList(values = [], limit = TOOL_SEARCH_OUTPUT_PROPERTIES_LIMIT) {</code> | 定义函数 `normalizeStringList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 308 | <code>    return (Array.isArray(values) ? values : [])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 309 | <code>        .map((entry) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 310 | <code>            if (entry &amp;&amp; typeof entry === 'object' &amp;&amp; !Array.isArray(entry)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 311 | <code>                return normalizeText(entry.name &#124;&#124; entry.id &#124;&#124; entry.key &#124;&#124; entry.property &#124;&#124; entry.path);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 312 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>            return normalizeText(entry);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 314 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>        .filter((entry) =&gt; entry !== '[object Object]')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 316 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 317 | <code>        .slice(0, limit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 318 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>function schemaForToolSearchResult(tool = {}) {</code> | 定义函数 `schemaForToolSearchResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 321 | <code>    return firstObject(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>        tool.input_schema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 323 | <code>        tool.inputSchema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 324 | <code>        tool.parameters,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 325 | <code>        tool.schema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 326 | <code>        tool.spec?.parameters,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 327 | <code>        tool.function?.parameters,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 328 | <code>        tool.modelFacing?.parameters,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 329 | <code>        tool.model_facing?.parameters,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 330 | <code>        tool.contract?.schema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 331 | <code>        tool.contract?.inputSchema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 332 | <code>        tool.contract?.input_schema</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 333 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>function compactToolSearchResultForHistory(tool = {}) {</code> | 定义函数 `compactToolSearchResultForHistory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 337 | <code>    const schema = schemaForToolSearchResult(tool);</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 338 | <code>    const id = normalizeText(tool.id &#124;&#124; tool.name &#124;&#124; tool.spec?.name &#124;&#124; tool.function?.name);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 339 | <code>    const name = normalizeText(tool.name &#124;&#124; tool.spec?.name &#124;&#124; tool.function?.name &#124;&#124; id);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 340 | <code>    const properties = normalizeStringList(</code> | 声明局部标识符 `properties`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 341 | <code>        Array.isArray(tool.schema_properties)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 342 | <code>            ? tool.schema_properties</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 343 | <code>            : Object.keys(firstObject(schema.properties))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 344 | <code>                .filter((property) =&gt; property &amp;&amp; property !== '[object Object]')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 345 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 347 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 348 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 349 | <code>        server: normalizeText(tool.server &#124;&#124; tool.provider &#124;&#124; tool.namespace),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 350 | <code>        tool: normalizeText(tool.tool &#124;&#124; tool.callable_name &#124;&#124; name),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 351 | <code>        description: summarizeForModel(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 352 | <code>            normalizeText(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 353 | <code>                tool.description &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 354 | <code>                    tool.spec?.description &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 355 | <code>                    tool.modelFacing?.description &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 356 | <code>                    tool.model_facing?.description &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 357 | <code>                    tool.contract?.purpose &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 358 | <code>                    tool.contract?.description &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 359 | <code>                    tool.summary &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 360 | <code>                    tool.title &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 361 | <code>                    name</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 362 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>            TOOL_SEARCH_OUTPUT_DESCRIPTION_CHARS</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 364 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>        required: normalizeStringList(schema.required),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 366 | <code>        properties,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 367 | <code>        spec_ref: normalizeText(tool.spec_ref &#124;&#124; tool.specRef &#124;&#124; (id ? `tool_registry:${id}` : 'tool_registry:unknown'))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 368 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 371 | <code>function webSearchOutputFromToolOutput(toolOutput = {}) {</code> | 定义函数 `webSearchOutputFromToolOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 372 | <code>    const candidates = toolResultDetailViews(toolOutput).flatMap((details) =&gt; [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 373 | <code>        details.webSearchOutput,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 374 | <code>        details.web_search_output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 375 | <code>        details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 376 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>    return candidates.find((candidate) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 378 | <code>        const value = firstObject(candidate);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 379 | <code>        return normalizeText(value.webSearchCall?.type &#124;&#124; value.web_search_call?.type) === 'web_search_call' &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 380 | <code>            normalizeText(value.type) === 'web_search_call';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 381 | <code>    }) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 382 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>function normalizeWebSearchCall(webSearchOutput = {}, callId = '') {</code> | 定义函数 `normalizeWebSearchCall`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 385 | <code>    const sourceCall = firstObject(</code> | 声明局部标识符 `sourceCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 386 | <code>        webSearchOutput.webSearchCall,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 387 | <code>        webSearchOutput.web_search_call,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 388 | <code>        normalizeText(webSearchOutput.type) === 'web_search_call' ? webSearchOutput : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 389 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>    const action = firstObject(sourceCall.action, webSearchOutput.action);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 391 | <code>    return ResponseItem.webSearchCall({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 392 | <code>        id: sourceCall.id &#124;&#124; (callId ? `${callId}_web_search` : null),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 393 | <code>        status: sourceCall.status &#124;&#124; webSearchOutput.status &#124;&#124; 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 394 | <code>        action</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 395 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>function formatWebRunOpenPage({ refId = '', url = '', lineno = 1 } = {}) {</code> | 定义函数 `formatWebRunOpenPage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 399 | <code>    const target = normalizeText(refId &#124;&#124; url);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 400 | <code>    if (!target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 401 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 402 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    return `Open page: web_run ${safeJsonStringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 404 | <code>        open: [{ ref_id: target, lineno: Number(lineno &#124;&#124; 1) &#124;&#124; 1 }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 405 | <code>    }, '{}')}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 406 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>function formatWebSearchCandidates(webSearchOutput = {}, toolName = '') {</code> | 定义函数 `formatWebSearchCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 409 | <code>    const candidates = Array.isArray(webSearchOutput.search?.results)</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 410 | <code>        ? webSearchOutput.search.results</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 411 | <code>        : Array.isArray(webSearchOutput.search?.candidates)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 412 | <code>        ? webSearchOutput.search.candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 413 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 414 | <code>    if (!candidates.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 415 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    const lines = ['Search results:'];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 418 | <code>    candidates.slice(0, 8).forEach((candidate, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 419 | <code>        const refId = normalizeText(candidate.ref_id &#124;&#124; candidate.refId &#124;&#124; candidate.id &#124;&#124; `candidate_${index + 1}`);</code> | 声明局部标识符 `refId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 420 | <code>        lines.push(`${index + 1}. [${refId}] ${candidate.title &#124;&#124; candidate.url &#124;&#124; '(untitled)'}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 421 | <code>        if (candidate.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 422 | <code>            lines.push(`   URL: ${candidate.url}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 423 | <code>            lines.push(`   ${toolName === 'web_run'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 424 | <code>                ? formatWebRunOpenPage({ refId, url: candidate.url })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 425 | <code>                : `Open page: web_fetch ${safeJsonStringify({ url: candidate.url, lineno: 1 }, '{}')}`}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 426 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>        if (candidate.snippet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 428 | <code>            lines.push(`   Snippet: ${candidate.snippet}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 429 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 432 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>function formatWebSearchStatus(webSearchOutput = {}) {</code> | 定义函数 `formatWebSearchStatus`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 435 | <code>    const status = normalizeText(webSearchOutput.search?.status &#124;&#124; webSearchOutput.status).toLowerCase();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 436 | <code>    if (status === 'empty') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 437 | <code>        return 'Search status: empty. No candidate pages were returned.';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 438 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 439 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 440 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 441 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 442 | <code>function formatWebSearchSelectionAudit(webSearchOutput = {}) {</code> | 定义函数 `formatWebSearchSelectionAudit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 443 | <code>    const audit = firstObject(</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 444 | <code>        webSearchOutput.search?.selectionAudit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 445 | <code>        webSearchOutput.search?.selection_audit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 446 | <code>        webSearchOutput.selectionAudit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 447 | <code>        webSearchOutput.selection_audit</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 448 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    if (!normalizeText(audit.status)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 450 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 451 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 453 | <code>        'Selection protocol:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 454 | <code>        `status=${normalizeText(audit.status)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 455 | <code>        audit.selector ? `requested_selector=${audit.selector}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 456 | <code>        audit.parent_kind ? `parent_candidate_type=${audit.parent_kind}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 457 | <code>        audit.quoted_term ? `quoted_term="${audit.quoted_term}"` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 458 | <code>        audit.lexical_match ? `lexical_match=${audit.lexical_match}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 459 | <code>        'Search ranking is not candidate-selection evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 460 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 461 | <code>    const candidates = Array.isArray(audit.candidates) ? audit.candidates : [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 462 | <code>    if (candidates.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 463 | <code>        lines.push('Visible diagnostic child-title counts:');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 464 | <code>        candidates.slice(0, 8).forEach((candidate) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 465 | <code>            const refId = normalizeText(candidate.ref_id &#124;&#124; candidate.refId &#124;&#124; candidate.id);</code> | 声明局部标识符 `refId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 466 | <code>            const count = Number(candidate.visible_snippet_occurrences);</code> | 声明局部标识符 `count`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 467 | <code>            lines.push(`- [${refId}] ${Number.isFinite(count) ? count : 0} exact matching title unit(s)`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 468 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 470 | <code>    if (audit.candidate_set_coverage_sufficient === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 471 | <code>        lines.push('Candidate-set coverage is insufficient; do not select a child yet.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 472 | <code>        const parentRefs = normalizeStringList(</code> | 声明局部标识符 `parentRefs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 473 | <code>            audit.parent_index_candidates &#124;&#124; audit.parentIndexCandidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 474 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 475 | <code>        if (parentRefs.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 476 | <code>            lines.push(`Open the nearest parent index first: [${parentRefs[0]}].`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 477 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 478 | <code>            lines.push('Run a fresh concise parent-index query before selecting a child.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 479 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 481 | <code>        lines.push('Verify unique matching titles on the leading parent candidates before selecting a child.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 482 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>    if (normalizeText(audit.caveat)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 484 | <code>        lines.push(`Caveat: ${normalizeText(audit.caveat)}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 485 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 487 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>function suggestedCallToolName(tool = '', sourceToolName = '') {</code> | 定义函数 `suggestedCallToolName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 490 | <code>    const normalizedTool = normalizeText(tool);</code> | 声明局部标识符 `normalizedTool`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 491 | <code>    const nativeTools = new Set([</code> | 声明局部标识符 `nativeTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 492 | <code>        'web_run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 493 | <code>        'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 494 | <code>        'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 495 | <code>        'write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 496 | <code>        'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 497 | <code>        'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 498 | <code>        'update_plan',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 499 | <code>        'request_permissions',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 500 | <code>        'final_answer'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 501 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>    if (!normalizedTool &#124;&#124; normalizedTool.includes('__') &#124;&#124; nativeTools.has(normalizedTool)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 503 | <code>        return normalizedTool;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 504 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>    const normalizedSource = normalizeText(sourceToolName);</code> | 声明局部标识符 `normalizedSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 506 | <code>    if (normalizedSource === 'web_run') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 507 | <code>        return normalizedTool === 'web_run'</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 508 | <code>            ? normalizedTool</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 509 | <code>            : `mcp__ailis_research__${normalizedTool}`;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 510 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>    const mcpSource = normalizedSource.match(/^mcp__(.+?)__.+$/);</code> | 声明局部标识符 `mcpSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 512 | <code>    return mcpSource</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 513 | <code>        ? `mcp__${mcpSource[1]}__${normalizedTool}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 514 | <code>        : normalizedTool;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 515 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 517 | <code>function formatWebSuggestedNextCalls(webSearchOutput = {}, sourceToolName = '') {</code> | 定义函数 `formatWebSuggestedNextCalls`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 518 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 519 | <code>        webSearchOutput.search?.suggestedNextCalls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 520 | <code>        webSearchOutput.search?.suggested_next_calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 521 | <code>        webSearchOutput.suggestedNextCalls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 522 | <code>        webSearchOutput.suggested_next_calls,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 523 | <code>        webSearchOutput.observationContract?.next_actions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 524 | <code>        webSearchOutput.observation_contract?.next_actions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 525 | <code>    ].find(Array.isArray) &#124;&#124; [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 526 | <code>    const calls = candidates.filter((call) =&gt; (</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 527 | <code>        call &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 528 | <code>        typeof call === 'object' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 529 | <code>        normalizeText(call.tool) &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 530 | <code>        call.args &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 531 | <code>        typeof call.args === 'object' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 532 | <code>        !Array.isArray(call.args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 533 | <code>    )).slice(0, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 534 | <code>    if (!calls.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 535 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 536 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 537 | <code>    const lines = ['Suggested next calls (tool-provided options; the model decides whether to use them):'];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 538 | <code>    calls.forEach((call) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 539 | <code>        lines.push(`${suggestedCallToolName(call.tool, sourceToolName)} ${safeJsonStringify(call.args, '{}')}`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 540 | <code>        if (normalizeText(call.reason)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 541 | <code>            lines.push(`Reason: ${normalizeText(call.reason)}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 542 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 545 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 547 | <code>function formatWebSearchSources(webSearchOutput = {}, toolName = '') {</code> | 定义函数 `formatWebSearchSources`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 548 | <code>    const sources = Array.isArray(webSearchOutput.fetch?.sources)</code> | 声明局部标识符 `sources`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 549 | <code>        ? webSearchOutput.fetch.sources</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 550 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 551 | <code>    if (!sources.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 552 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 553 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>    const lines = ['Sources:'];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 555 | <code>    sources.slice(0, 8).forEach((source, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 556 | <code>        const refId = normalizeText(source.ref_id &#124;&#124; source.refId &#124;&#124; source.id &#124;&#124; `source_${index + 1}`);</code> | 声明局部标识符 `refId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 557 | <code>        lines.push(`[${refId}] ${source.title &#124;&#124; source.url &#124;&#124; '(untitled)'}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 558 | <code>        if (source.url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 559 | <code>            lines.push(`URL: ${source.url}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 560 | <code>            const openPage = firstObject(source.open_page, source.openPage);</code> | 声明局部标识符 `openPage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 561 | <code>            lines.push(toolName === 'web_run'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 562 | <code>                ? formatWebRunOpenPage({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 563 | <code>                    refId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 564 | <code>                    url: normalizeText(openPage.url &#124;&#124; source.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 565 | <code>                    lineno: Number(openPage.lineno &#124;&#124; 1) &#124;&#124; 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 566 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>                : `Open page: web_fetch ${safeJsonStringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 568 | <code>                    url: normalizeText(openPage.url &#124;&#124; source.url),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 569 | <code>                    lineno: Number(openPage.lineno &#124;&#124; 1) &#124;&#124; 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 570 | <code>                }, '{}')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 571 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>        const meta = [</code> | 声明局部标识符 `meta`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 573 | <code>            source.host ? `host=${source.host}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 574 | <code>            source.status ? `status=${source.status}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 575 | <code>        ].filter(Boolean).join('; ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 576 | <code>        if (meta) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 577 | <code>            lines.push(meta);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 578 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>        const excerpt = normalizeText(source.excerpt &#124;&#124; source.fetched_excerpt &#124;&#124; source.fetchedExcerpt);</code> | 声明局部标识符 `excerpt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 580 | <code>        if (excerpt) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 581 | <code>            lines.push('Fetched excerpt:');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 582 | <code>            lines.push(summarizeForModel(excerpt, 2400));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 583 | <code>        } else if (Array.isArray(source.evidenceSnippets) &amp;&amp; source.evidenceSnippets.length) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 584 | <code>            lines.push('Evidence snippets:');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 585 | <code>            source.evidenceSnippets.slice(0, 3).forEach((snippet) =&gt; lines.push(`- ${snippet}`));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 586 | <code>        } else if (source.searchSnippet) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 587 | <code>            lines.push(`Search snippet: ${source.searchSnippet}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 588 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 589 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 591 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 593 | <code>function formatWebSearchDiagnostics(webSearchOutput = {}) {</code> | 定义函数 `formatWebSearchDiagnostics`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 594 | <code>    const execution = firstObject(webSearchOutput.execution);</code> | 声明局部标识符 `execution`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 595 | <code>    const diagnostics = firstObject(webSearchOutput.retrievalDiagnostics, webSearchOutput.retrieval_diagnostics);</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 596 | <code>    const lines = ['Retrieval diagnostics:'];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 597 | <code>    if (execution.mode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 598 | <code>        lines.push(`mode=${execution.mode}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 599 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>    if (execution.durationMs != null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 601 | <code>        lines.push(`duration_ms=${execution.durationMs}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 602 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 603 | <code>    if (diagnostics.fetchedPageCount != null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 604 | <code>        lines.push(`fetched_page_count=${diagnostics.fetchedPageCount}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 605 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>    if (diagnostics.blockedPageCount != null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 607 | <code>        lines.push(`blocked_page_count=${diagnostics.blockedPageCount}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 608 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>    const pipeline = Array.isArray(execution.pipeline) ? execution.pipeline : [];</code> | 声明局部标识符 `pipeline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 610 | <code>    if (pipeline.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 611 | <code>        lines.push('Pipeline:');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 612 | <code>        pipeline.slice(0, 10).forEach((step) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 613 | <code>            lines.push(`- ${step.stage &#124;&#124; 'step'}: ${step.status &#124;&#124; 'unknown'}${step.note ? `; ${step.note}` : ''}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 614 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 615 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>    return lines.length &gt; 1 ? lines.join('\n') : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 617 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>function buildWebSearchFunctionOutput(toolOutput = {}, webSearchOutput = {}) {</code> | 定义函数 `buildWebSearchFunctionOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 620 | <code>    const contentItems = [</code> | 声明局部标识符 `contentItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 621 | <code>        ContentItem.inputText([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 622 | <code>            'Web search completed.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 623 | <code>            `Tool: ${toolOutput.toolName}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 624 | <code>            toolOutput.durationMs != null ? `duration_ms=${toolOutput.durationMs}` : ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 625 | <code>        ].filter(Boolean).join('\n')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 626 | <code>        ContentItem.inputText(formatWebSearchStatus(webSearchOutput)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 627 | <code>        ContentItem.inputText(formatWebSearchSelectionAudit(webSearchOutput)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 628 | <code>        ContentItem.inputText(formatWebSearchCandidates(webSearchOutput, toolOutput.toolName)),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 629 | <code>        ContentItem.inputText(formatWebSuggestedNextCalls(webSearchOutput, toolOutput.toolName)),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 630 | <code>        ContentItem.inputText(formatWebSearchSources(webSearchOutput, toolOutput.toolName)),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 631 | <code>        ContentItem.inputText(formatWebSearchDiagnostics(webSearchOutput))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 632 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 633 | <code>    if (!contentItems.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 634 | <code>        contentItems.push(ContentItem.inputText('Web search completed. Structured results are available in the preceding web_search_call item.'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 635 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>    return FunctionCallOutputPayload.fromContentItems(contentItems, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 637 | <code>        success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 638 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 639 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 641 | <code>function formatSourceViewportLinks(toolOutput = {}, details = {}) {</code> | 定义函数 `formatSourceViewportLinks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 642 | <code>    if (normalizeText(toolOutput.toolName) !== 'web_run') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 643 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 644 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 645 | <code>    const links = Array.isArray(details.observedRelevantLinks)</code> | 声明局部标识符 `links`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 646 | <code>        ? details.observedRelevantLinks</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 647 | <code>        : Array.isArray(details.observed_relevant_links)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 648 | <code>        ? details.observed_relevant_links</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 649 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 650 | <code>    if (!links.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 651 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 652 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 653 | <code>    const sourceRef = normalizeText(details.ref_id &#124;&#124; details.sourceWindow?.ref_id &#124;&#124; details.source?.ref_id);</code> | 声明局部标识符 `sourceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 654 | <code>    if (!sourceRef) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 655 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 656 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 657 | <code>    const lines = ['Links:'];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 658 | <code>    links.slice(0, 8).forEach((link, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 659 | <code>        const url = normalizeText(link.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 660 | <code>        if (!url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 661 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 662 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>        const id = Number(link.id) &#124;&#124; index + 1;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 664 | <code>        lines.push(`${index + 1}. [${id}] ${link.text &#124;&#124; link.title &#124;&#124; url}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 665 | <code>        lines.push(`   URL: ${url}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 666 | <code>        lines.push(`   Click link: web_run ${safeJsonStringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 667 | <code>            click: [{ ref_id: sourceRef, id }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 668 | <code>        }, '{}')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 669 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>    return lines.length &gt; 1 ? lines.join('\n') : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 671 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 672 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 673 | <code>function sourceViewportFromToolOutput(toolOutput = {}) {</code> | 定义函数 `sourceViewportFromToolOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 674 | <code>    for (const details of toolResultDetailViews(toolOutput)) {</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 675 | <code>        const sourceWindow = firstObject(</code> | 声明局部标识符 `sourceWindow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 676 | <code>            details.sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 677 | <code>            details.source_window,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 678 | <code>            details.sourceViewport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 679 | <code>            details.source_viewport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 680 | <code>            details.source</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 681 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 682 | <code>        if (normalizeText(sourceWindow.type) !== 'source_viewport') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 683 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 684 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>        const toolName = normalizeText(toolOutput.toolName);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 686 | <code>        const action = firstObject(sourceWindow.action);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 687 | <code>        const actionType = normalizeText(action.type);</code> | 声明局部标识符 `actionType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 688 | <code>        const normalizedActionType = actionType === 'find_in_page'</code> | 声明局部标识符 `normalizedActionType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 689 | <code>            ? 'find_in_page'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 690 | <code>            : actionType === 'open_page'</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 691 | <code>            ? 'open_page'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 692 | <code>            : /(?:^&#124;__)web_find$/.test(toolName)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 693 | <code>            ? 'find_in_page'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 694 | <code>            : 'open_page';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 695 | <code>        const url = normalizeText(sourceWindow.url &#124;&#124; sourceWindow.ref_id &#124;&#124; details.url);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 696 | <code>        const lineStart = Number(</code> | 声明局部标识符 `lineStart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 697 | <code>            sourceWindow.lineno &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 698 | <code>                sourceWindow.lineStart &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 699 | <code>                sourceWindow.line_start &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 700 | <code>                details.lineno &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 701 | <code>                details.lineStart &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 702 | <code>                details.line_start &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 703 | <code>                1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 704 | <code>        ) &#124;&#124; 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 705 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 706 | <code>            sourceWindow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 707 | <code>            action: normalizedActionType === 'find_in_page'</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 708 | <code>                ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 709 | <code>                    type: 'find_in_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 710 | <code>                    ...(url ? { url } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 711 | <code>                    ...(normalizeText(action.pattern &#124;&#124; details.pattern)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 712 | <code>                        ? { pattern: normalizeText(action.pattern &#124;&#124; details.pattern) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 713 | <code>                        : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 714 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>                : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 716 | <code>                    type: 'open_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 717 | <code>                    ...(url ? { url } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 718 | <code>                    lineno: lineStart</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 719 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 720 | <code>            details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 721 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 723 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 724 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 726 | <code>function normalizeSourceViewportWebSearchCall(sourceViewport = {}, callId = '') {</code> | 定义函数 `normalizeSourceViewportWebSearchCall`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 727 | <code>    const action = firstObject(sourceViewport.action);</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 728 | <code>    return ResponseItem.webSearchCall({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 729 | <code>        id: callId ? `${callId}_${action.type &#124;&#124; 'open_page'}` : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 730 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 731 | <code>        action</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 732 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 733 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>function formatSourceViewportLines(sourceWindow = {}) {</code> | 定义函数 `formatSourceViewportLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 736 | <code>    const lines = Array.isArray(sourceWindow.lines) ? sourceWindow.lines : [];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 737 | <code>    const rendered = lines</code> | 声明局部标识符 `rendered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 738 | <code>        .map((line) =&gt; normalizeText(line.rendered) &#124;&#124; `L${Number(line.lineno &#124;&#124; line.lineNumber &#124;&#124; line.line_number &#124;&#124; 0)}: ${line.text &#124;&#124; ''}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 739 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 740 | <code>        .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 741 | <code>    const lineStart = Number(sourceWindow.lineStart &#124;&#124; sourceWindow.line_start &#124;&#124; sourceWindow.lineno &#124;&#124; 1) &#124;&#124; 1;</code> | 声明局部标识符 `lineStart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 742 | <code>    const lineEnd = Number(sourceWindow.lineEnd &#124;&#124; sourceWindow.line_end &#124;&#124; lineStart) &#124;&#124; lineStart;</code> | 声明局部标识符 `lineEnd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 743 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 744 | <code>        'Source viewport:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 745 | <code>        `URL: ${sourceWindow.url &#124;&#124; sourceWindow.ref_id &#124;&#124; ''}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 746 | <code>        `Content type: ${sourceWindow.contentType &#124;&#124; sourceWindow.content_type &#124;&#124; 'text/plain'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 747 | <code>        `Total lines: ${Number(sourceWindow.totalLines &#124;&#124; sourceWindow.total_lines &#124;&#124; 0) &#124;&#124; 0}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 748 | <code>        `Line range: L${lineStart}-L${lineEnd}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 749 | <code>        `Has more before: ${(sourceWindow.hasMoreBefore ?? sourceWindow.has_more_before) ? 'true' : 'false'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 750 | <code>        `Has more after: ${(sourceWindow.hasMoreAfter ?? sourceWindow.has_more_after) ? 'true' : 'false'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 751 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 752 | <code>        rendered</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 753 | <code>    ].filter((line, index) =&gt; index === 7 &#124;&#124; normalizeText(line)).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 754 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 755 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 756 | <code>function formatExpandedLongSourceLines(sourceWindow = {}) {</code> | 定义函数 `formatExpandedLongSourceLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 757 | <code>    const lines = Array.isArray(sourceWindow.lines) ? sourceWindow.lines : [];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 758 | <code>    const expanded = lines</code> | 声明局部标识符 `expanded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 759 | <code>        .map((line) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 760 | <code>            lineno: Number(line.lineno &#124;&#124; line.lineNumber &#124;&#124; line.line_number &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 761 | <code>            text: normalizeText(line.text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 762 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 763 | <code>        .filter((line) =&gt; line.text.length &gt;= 500)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 764 | <code>        .slice(0, 4);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 765 | <code>    if (!expanded.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 766 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 767 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 768 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 769 | <code>        'Expanded long source lines (kept intact so relationship context is not split by viewport compaction):',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 770 | <code>        ...expanded.map((line) =&gt; `L${line.lineno &#124;&#124; '?'}: ${line.text}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 771 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 772 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 773 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 774 | <code>function compactTableCell(value = '') {</code> | 定义函数 `compactTableCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 775 | <code>    return normalizeText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 776 | <code>        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 777 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 778 | <code>        .slice(0, 240);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 779 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 780 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 781 | <code>function formatStructuredTableProjections(details = {}) {</code> | 定义函数 `formatStructuredTableProjections`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 782 | <code>    const tables = Array.isArray(details.structuredTables)</code> | 声明局部标识符 `tables`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 783 | <code>        ? details.structuredTables</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 784 | <code>        : Array.isArray(details.structured_tables)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 785 | <code>        ? details.structured_tables</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 786 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 787 | <code>    const projections = tables</code> | 声明局部标识符 `projections`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 788 | <code>        .map((table) =&gt; table?.projection)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 789 | <code>        .filter((projection) =&gt; projection?.queryRelevant === true &#124;&#124; projection?.query_relevant === true)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 790 | <code>        .slice(0, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 791 | <code>    if (!projections.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 792 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 793 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 794 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 795 | <code>        'Structured table projection (query-selected columns; source row order preserved):'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 796 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 797 | <code>    let visibleChars = lines[0].length;</code> | 声明局部标识符 `visibleChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 798 | <code>    for (const projection of projections) {</code> | 声明局部标识符 `projection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 799 | <code>        const columns = Array.isArray(projection.columns)</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 800 | <code>            ? projection.columns.map(compactTableCell)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 801 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 802 | <code>        const metadata = [</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 803 | <code>            `columns=${columns.join(' &#124; ')}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 804 | <code>            `rows=${Number(projection.rowCount &#124;&#124; projection.row_count &#124;&#124; 0)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 805 | <code>            `rows_complete=${(projection.rowsComplete ?? projection.rows_complete) === true ? 'true' : 'false'}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 806 | <code>        ].join('; ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 807 | <code>        lines.push(metadata);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 808 | <code>        visibleChars += metadata.length + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 809 | <code>        const projectionRows = Array.isArray(projection.rows) ? projection.rows : [];</code> | 声明局部标识符 `projectionRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 810 | <code>        for (const row of projectionRows.filter(Array.isArray)) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 811 | <code>            const rendered = row.map(compactTableCell).join(' &#124; ');</code> | 声明局部标识符 `rendered`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 812 | <code>            if (visibleChars + rendered.length + 1 &gt; 5200) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 813 | <code>                lines.push('[additional structured rows retained in the tool artifact]');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 814 | <code>                return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 815 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 816 | <code>            lines.push(rendered);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 817 | <code>            visibleChars += rendered.length + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 818 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 819 | <code>        if (projectionRows.some((row) =&gt; !Array.isArray(row))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 820 | <code>            lines.push('[additional structured rows retained in the tool artifact]');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 821 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 822 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 823 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 824 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 826 | <code>function formatSourceViewportMatches(details = {}) {</code> | 定义函数 `formatSourceViewportMatches`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 827 | <code>    const matches = Array.isArray(details.matches) ? details.matches : [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 828 | <code>    if (!matches.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 829 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 830 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 831 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 832 | <code>        `Find matches: ${matches.length}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 833 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 834 | <code>    matches.slice(0, 12).forEach((match) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 835 | <code>        const lineno = Number(match.lineno &#124;&#124; match.lineNumber &#124;&#124; match.line_number &#124;&#124; 0) &#124;&#124; '?';</code> | 声明局部标识符 `lineno`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 836 | <code>        lines.push(`L${lineno}: ${match.text &#124;&#124; ''}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 837 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 839 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 841 | <code>function formatSourceSelectionProtocol(details = {}) {</code> | 定义函数 `formatSourceSelectionProtocol`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 842 | <code>    const protocol = firstObject(details.selectionProtocol, details.selection_protocol);</code> | 声明局部标识符 `protocol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 843 | <code>    if (!normalizeText(protocol.status)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 844 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 845 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 846 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 847 | <code>        'Selection dependency:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 848 | <code>        `status=${normalizeText(protocol.status)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 849 | <code>        protocol.parent_kind ? `parent_candidate_type=${protocol.parent_kind}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 850 | <code>        protocol.quoted_term ? `quoted_term="${protocol.quoted_term}"` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 851 | <code>        `candidate_boundary_complete=${protocol.boundary_complete === true ? 'true' : 'false'}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 852 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 853 | <code>    const ranges = Array.isArray(protocol.covered_ranges) ? protocol.covered_ranges : [];</code> | 声明局部标识符 `ranges`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 854 | <code>    if (ranges.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 855 | <code>        lines.push(`covered_ranges=${ranges.map((range) =&gt; `L${range[0]}-L${range[1]}`).join(', ')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 856 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 857 | <code>    if (protocol.boundary_complete !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 858 | <code>        lines.push('Continue the parent index; do not select or open a child yet.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 859 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 860 | <code>        lines.push('The parent-index boundary is covered. Apply the requested comparison before opening the selected child.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 861 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 863 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 864 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 865 | <code>function buildSourceViewportFunctionOutput(toolOutput = {}, sourceViewport = {}) {</code> | 定义函数 `buildSourceViewportFunctionOutput`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 866 | <code>    const { sourceWindow, action, details } = sourceViewport;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 867 | <code>    const header = action.type === 'find_in_page'</code> | 声明局部标识符 `header`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 868 | <code>        ? 'Find in page completed.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 869 | <code>        : 'Opened page source viewport.';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 870 | <code>    const contentItems = [</code> | 声明局部标识符 `contentItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 871 | <code>        ContentItem.inputText([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 872 | <code>            header,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 873 | <code>            `Tool: ${toolOutput.toolName}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 874 | <code>            action.url ? `url=${action.url}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 875 | <code>            action.type === 'find_in_page' &amp;&amp; action.pattern ? `pattern=${action.pattern}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 876 | <code>            action.type === 'open_page' &amp;&amp; action.lineno ? `lineno=${action.lineno}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 877 | <code>            toolOutput.durationMs != null ? `duration_ms=${toolOutput.durationMs}` : ''</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 878 | <code>        ].filter(Boolean).join('\n')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 879 | <code>        ContentItem.inputText(formatSourceViewportMatches(details)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 880 | <code>        ContentItem.inputText(formatSourceSelectionProtocol(details)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 881 | <code>        ContentItem.inputText(formatWebSuggestedNextCalls(details, toolOutput.toolName)),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 882 | <code>        ContentItem.inputText(formatSourceViewportLinks(toolOutput, details)),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 883 | <code>        ContentItem.inputText(formatStructuredTableProjections(details)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 884 | <code>        ContentItem.inputText(formatExpandedLongSourceLines(sourceWindow)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 885 | <code>        ContentItem.inputText(formatSourceViewportLines(sourceWindow))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 886 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 887 | <code>    return FunctionCallOutputPayload.fromContentItems(contentItems, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 888 | <code>        success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 889 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 890 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 891 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 892 | <code>function toolOutputToResponseItems(toolOutput = {}, options = {}) {</code> | 定义函数 `toolOutputToResponseItems`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 893 | <code>    const toolName = normalizeText(toolOutput.toolName);</code> | 声明局部标识符 `toolName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 894 | <code>    if (!toolName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 895 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 896 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 897 | <code>    const callId = canonicalCallId(toolOutput);</code> | 声明局部标识符 `callId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 898 | <code>    if (toolName === 'tool_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 899 | <code>        const tools = Array.isArray(toolOutput.details?.tools)</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 900 | <code>            ? toolOutput.details.tools.map(compactToolSearchResultForHistory)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 901 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 902 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 903 | <code>            ResponseItem.toolSearchCall({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 904 | <code>                call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 905 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 906 | <code>                execution: 'client',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 907 | <code>                provider_metadata: toolOutput.providerMetadata &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 908 | <code>                arguments: toolOutput.args &#124;&#124; {}</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 909 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>            ResponseItem.toolSearchOutput({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 911 | <code>                call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 912 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 913 | <code>                execution: 'client',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 914 | <code>                tools</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 915 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 916 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 917 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 918 | <code>    const sourceViewport = sourceViewportFromToolOutput(toolOutput);</code> | 声明局部标识符 `sourceViewport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 919 | <code>    if (sourceViewport) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 920 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 921 | <code>            ResponseItem.functionCall({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 922 | <code>                name: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 923 | <code>                arguments: toolOutput.args &#124;&#124; {},</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 924 | <code>                provider_metadata: toolOutput.providerMetadata &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 925 | <code>                call_id: callId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 926 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 927 | <code>            normalizeSourceViewportWebSearchCall(sourceViewport, callId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 928 | <code>            ResponseItem.functionCallOutput({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 929 | <code>                call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 930 | <code>                output: buildSourceViewportFunctionOutput(toolOutput, sourceViewport)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 931 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 932 | <code>        ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 933 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 934 | <code>    const webSearchOutput = webSearchOutputFromToolOutput(toolOutput);</code> | 声明局部标识符 `webSearchOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 935 | <code>    if (webSearchOutput) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 936 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 937 | <code>            ResponseItem.functionCall({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 938 | <code>                name: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 939 | <code>                arguments: toolOutput.args &#124;&#124; {},</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 940 | <code>                provider_metadata: toolOutput.providerMetadata &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 941 | <code>                call_id: callId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 942 | <code>            }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>            normalizeWebSearchCall(webSearchOutput, callId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 944 | <code>            ResponseItem.functionCallOutput({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 945 | <code>                call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 946 | <code>                output: buildWebSearchFunctionOutput(toolOutput, webSearchOutput)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 947 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 948 | <code>        ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 949 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 950 | <code>    const metadataLines = buildModelVisibleToolMetadata(toolOutput);</code> | 声明局部标识符 `metadataLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 951 | <code>    const output = [</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 952 | <code>        toolOutput.ok ? 'Status: completed' : `Status: ${toolOutput.status &#124;&#124; 'failed'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 953 | <code>        toolOutput.errorSummary ? `Error: ${toolOutput.errorSummary}` : '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 954 | <code>        toolOutput.durationMs != null ? `DurationMs: ${toolOutput.durationMs}` : '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 955 | <code>        ...metadataLines,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 956 | <code>        'Output:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 957 | <code>        summarizeForModel(toolOutput.outputText &#124;&#124; '', options.toolOutputChars &#124;&#124; DEFAULT_TOOL_OUTPUT_CHARS)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 958 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 959 | <code>    const modelImage = toolOutput.details?.modelImage &#124;&#124; toolOutput.details?.model_image &#124;&#124; null;</code> | 声明局部标识符 `modelImage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 960 | <code>    const modelImageUrl = normalizeText(</code> | 声明局部标识符 `modelImageUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 961 | <code>        modelImage?.image_url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 962 | <code>        modelImage?.imageUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 963 | <code>        modelImage?.url &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 964 | <code>        modelImage?.path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 965 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 966 | <code>    const outputPayload = modelImageUrl</code> | 声明局部标识符 `outputPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 967 | <code>        ? FunctionCallOutputPayload.fromContentItems([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 968 | <code>              ContentItem.inputText(output),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 969 | <code>              ContentItem.inputImage({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 970 | <code>                  image_url: modelImageUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 971 | <code>                  detail: normalizeText(modelImage?.detail) &#124;&#124; 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 972 | <code>              })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>          ], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 974 | <code>              success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 975 | <code>          })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>        : FunctionCallOutputPayload.normalize(output, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 977 | <code>              success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 978 | <code>          });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 979 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 980 | <code>        ResponseItem.functionCall({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 981 | <code>            name: toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 982 | <code>            arguments: toolOutput.args &#124;&#124; {},</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 983 | <code>            provider_metadata: toolOutput.providerMetadata &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 984 | <code>            call_id: callId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 985 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>        ResponseItem.functionCallOutput({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 987 | <code>            call_id: callId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 988 | <code>            output: outputPayload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 989 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 990 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 991 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 993 | <code>function toolOutputToRuntimeEvent(toolOutput = {}) {</code> | 定义函数 `toolOutputToRuntimeEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 994 | <code>    return normalizeRuntimeEvent({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 995 | <code>        type: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 996 | <code>        id: toolOutput.sourceId &#124;&#124; toolOutput.callId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 997 | <code>        callId: toolOutput.callId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 998 | <code>        title: toolOutput.title,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 999 | <code>        tool: toolOutput.toolName,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1000 | <code>        args: cloneJson(toolOutput.args &#124;&#124; {}),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1001 | <code>        status: toolOutput.status &#124;&#124; 'unknown',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1002 | <code>        ok: toolOutput.ok === true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1003 | <code>        preview: toolOutput.outputPreview &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1004 | <code>        errorSummary: toolOutput.errorSummary &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1005 | <code>        evidenceRefs: Array.isArray(toolOutput.evidenceRefs) ? toolOutput.evidenceRefs.slice() : [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1006 | <code>        evidenceArtifacts: Array.isArray(toolOutput.evidenceArtifacts) ? cloneJson(toolOutput.evidenceArtifacts) : [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1007 | <code>        durationMs: toolOutput.durationMs</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1008 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1009 | <code>        layer: RUNTIME_LAYER.TOOL_EXECUTOR,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1010 | <code>        status: toolOutput.status &#124;&#124; 'unknown'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1011 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1012 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1013 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1014 | <code>function toolOutputToThreadItem(toolOutput = {}) {</code> | 定义函数 `toolOutputToThreadItem`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1015 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1016 | <code>        schema: 'ailis.thread_item.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1017 | <code>        type: 'tool_result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1018 | <code>        status: toolOutput.ok ? 'completed' : 'failed',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1019 | <code>        id: toolOutput.sourceId &#124;&#124; toolOutput.callId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1020 | <code>        callId: toolOutput.callId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1021 | <code>        title: toolOutput.title &#124;&#124; toolOutput.toolName &#124;&#124; 'tool result',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1022 | <code>        tool: toolOutput.toolName &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1023 | <code>        ok: toolOutput.ok === true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1024 | <code>        result_status: toolOutput.status &#124;&#124; 'unknown',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1025 | <code>        preview: toolOutput.outputPreview &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1026 | <code>        error_summary: toolOutput.errorSummary &#124;&#124; null,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1027 | <code>        evidence_refs: Array.isArray(toolOutput.evidenceRefs) ? toolOutput.evidenceRefs.slice() : [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1028 | <code>        duration_ms: toolOutput.durationMs</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1029 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1030 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1032 | <code>function makeRolloutItem(kind, payload = {}) {</code> | 定义函数 `makeRolloutItem`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1033 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1034 | <code>        schema: 'ailis.rollout_item.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1035 | <code>        type: kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1036 | <code>        payload: cloneJson(payload),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1037 | <code>        recordedAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1038 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1039 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1040 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1041 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1042 | <code>    DEFAULT_THREAD_ITEM_PREVIEW_CHARS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1043 | <code>    DEFAULT_TOOL_OUTPUT_CHARS,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1044 | <code>    extractText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1045 | <code>    makeRolloutItem,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1046 | <code>    normalizeToolOutput,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1047 | <code>    sanitizeWebToolDetailsForModel,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1048 | <code>    sanitizeWebToolTextForModel,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1049 | <code>    toolOutputToResponseItems,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1050 | <code>    toolOutputToRuntimeEvent,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1051 | <code>    toolOutputToThreadItem</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1052 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
