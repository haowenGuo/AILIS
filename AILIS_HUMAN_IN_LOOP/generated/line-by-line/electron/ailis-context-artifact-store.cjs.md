# electron/ailis-context-artifact-store.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`source-code`
- 原始行数：2217
- SHA-256：`77b3b0568d77f9469b97683a2dfc230d3a06195d7ff7a36556976f1871a5a539`
- 可运行副本：[打开源文件](../../../source/electron/ailis-context-artifact-store.cjs)
- 依赖：`fs/promises`、`path`、`crypto`、`./ailis-artifact-runtime.cjs`
- 主要符号：`fsp`、`path`、`DEFAULT_MAX_TEXT_CHARS`、`DEFAULT_GRID_ROWS`、`DEFAULT_GRID_COLS`、`CONTEXT_ARTIFACT_TOOL_ID`、`CONTEXT_ARTIFACT_COMPUTE_TOOL_ID`、`buildContextArtifactHandle`、`artifactId`、`normalizeString`、`trimmed`、`normalizeNumber`、`parsed`、`normalizeList`、`safeSegment`、`normalized`、`stableHash`、`cloneJson`、`uniqueStrings`、`truncateText`、`source`、`budget`、`marker`、`remaining`、`head`、`tail`、`createTextResult`、`createErrorResult`、`columnName`、`value`、`name`、`remainder`、`columnNumber`、`cellAddress`、`rangeAddress`、`parseRange`、`raw`、`single`、`col`、`row`、`match`、`startCol`、`startRow`、`endCol`、`endRow`、`parseCell`、`normalizeColor`、`mergeNestedArgs`、`nested`、`rgbFromHex`、`color`、`colorLooksLikeName`、`rgb`、`label`、`expandColorNameList`、`fills`、`expanded`、`direct`、`matches`、`extractColorHintsFromRuleText`、`hints`、`extractStepSizeFromRuleText`、`sheetBySelection`、`sheets`、`explicitName`、`sheetIndex`、`getSpreadsheetStoredBounds`、`rows`、`rowNumbers`、`columns`、`firstRow`、`firstCol`、`lastRow`、`lastCol`、`buildSpreadsheetGridCoverage`、`stored`、`maxRows`、`maxCols`、`rowCount`、`columnCount`、`complete`、`buildSpreadsheetRangeCoverage`、`coverage`、`createPinnedEvidence`、`basis`、`evidenceId`、`sameSheetName`、`coverageContains`、`findCoveringEvidence`、`pinned`、`formatSpreadsheetSummary`、`lines`、`formatSpreadsheetGrid`、`visibleRows`、`visibleColumns`、`index`、`rowNo`、`text`、`fill`、`formatSpreadsheetRange`、`parsedRange`、`returnedCells`、`outsideStoredRange`、`rowIndex`、`values`、`colIndex`、`searchSpreadsheet`、`query`、`limit`、`haystack`、`getTextArtifactPayload`、`artifact`、`getDocumentArtifactPayload`、`splitLines`、`numberedLines`、`formatTextArtifactSummary`、`previewLines`、`textSchemaResult`、`textRangeResult`、`hasOffset`、`offset`、`slice`、`nextOffset`、`startLine`、`defaultEnd`、`endLine`、`selected`、`compileSearchMatcher`、`flags`、`regex`、`needle`、`searchTextLines`、`matcher`、`contextLines`、`start`、`end`、`textTailResult`、`chars`、`allLines`、`lineCount`、`formatDocumentArtifactSummary`、`pages`、`sections`、`preview`、`documentSchemaResult`、`documentSearchResult`、`pageNo`、`documentPageResult`、`pageNumber`、`page`、`documentSectionResult`、`explicitIndex`、`title`、`section`、`spreadsheetSheetsForCompute`、`sheet`、`profileSpreadsheetArtifact`、`profiles`、`fillCounts`、`buildSpreadsheetCellMatrix`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3 | <code>const { createHash, randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 5 | <code>    buildArtifactRuntimeEnvelope,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 6 | <code>    buildArtifactRuntimeSchema,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 7 | <code>    searchArtifactRuntime,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 8 | <code>    formatArtifactRuntimeSearch</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 9 | <code>} = require('./ailis-artifact-runtime.cjs');</code> | 导入依赖 `./ailis-artifact-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>const DEFAULT_MAX_TEXT_CHARS = 8000;</code> | 声明局部标识符 `DEFAULT_MAX_TEXT_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 12 | <code>const DEFAULT_GRID_ROWS = 80;</code> | 声明局部标识符 `DEFAULT_GRID_ROWS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 13 | <code>const DEFAULT_GRID_COLS = 40;</code> | 声明局部标识符 `DEFAULT_GRID_COLS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 14 | <code>const CONTEXT_ARTIFACT_TOOL_ID = 'artifact_query';</code> | 声明局部标识符 `CONTEXT_ARTIFACT_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 15 | <code>const CONTEXT_ARTIFACT_COMPUTE_TOOL_ID = 'artifact_compute';</code> | 声明局部标识符 `CONTEXT_ARTIFACT_COMPUTE_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>function buildContextArtifactHandle(record = {}) {</code> | 定义函数 `buildContextArtifactHandle`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 18 | <code>    const artifactId = normalizeString(record.id &#124;&#124; record.artifactId &#124;&#124; record.artifact_id);</code> | 声明局部标识符 `artifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 19 | <code>    if (!artifactId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 20 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 21 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 23 | <code>        schema: 'ailis.artifact_handle.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 24 | <code>        owner: 'context_artifact_store',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 25 | <code>        tool: CONTEXT_ARTIFACT_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 26 | <code>        artifactId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 27 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 31 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 32 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 35 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 36 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 38 | <code>function normalizeNumber(value, fallback, min, max) {</code> | 定义函数 `normalizeNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 39 | <code>    const parsed = Number(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 40 | <code>    if (!Number.isFinite(parsed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 41 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 42 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>    return Math.min(Math.max(Math.round(parsed), min), max);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>function normalizeList(value) {</code> | 定义函数 `normalizeList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 47 | <code>    if (Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 48 | <code>        return value.map((entry) =&gt; normalizeString(entry)).filter(Boolean);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 49 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 51 | <code>        return value.split(/[,;\n]+/).map((entry) =&gt; normalizeString(entry)).filter(Boolean);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 52 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 54 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 56 | <code>function safeSegment(value = '', fallback = 'artifact') {</code> | 定义函数 `safeSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 57 | <code>    const normalized = normalizeString(value, fallback)</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 58 | <code>        .replace(/[^A-Za-z0-9_.-]+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 59 | <code>        .replace(/^-+&#124;-+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 60 | <code>        .slice(0, 90);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 61 | <code>    return normalized &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 62 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 64 | <code>function stableHash(value = '') {</code> | 定义函数 `stableHash`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 65 | <code>    return createHash('sha1').update(String(value &#124;&#124; '')).digest('hex').slice(0, 16);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 66 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 68 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 69 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 70 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 71 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 72 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 73 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 76 | <code>function uniqueStrings(values = []) {</code> | 定义函数 `uniqueStrings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 77 | <code>    return [...new Set(values.map((value) =&gt; normalizeString(String(value))).filter(Boolean))];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>function truncateText(text = '', maxChars = DEFAULT_MAX_TEXT_CHARS) {</code> | 定义函数 `truncateText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 81 | <code>    const source = String(text &#124;&#124; '');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 82 | <code>    const budget = Math.max(1000, Number(maxChars) &#124;&#124; DEFAULT_MAX_TEXT_CHARS);</code> | 声明局部标识符 `budget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 83 | <code>    if (source.length &lt;= budget) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 84 | <code>        return { text: source, truncated: false, originalChars: source.length };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 85 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>    const marker = '\n... [artifact query preview truncated; ask a narrower query] ...\n';</code> | 声明局部标识符 `marker`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 87 | <code>    const remaining = Math.max(0, budget - marker.length);</code> | 声明局部标识符 `remaining`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 88 | <code>    const head = Math.ceil(remaining * 0.7);</code> | 声明局部标识符 `head`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 89 | <code>    const tail = remaining - head;</code> | 声明局部标识符 `tail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 90 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 91 | <code>        text: `${source.slice(0, head)}${marker}${tail &gt; 0 ? source.slice(-tail) : ''}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 92 | <code>        truncated: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 93 | <code>        originalChars: source.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 94 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>function createTextResult(text, details = {}, structuredContent = undefined) {</code> | 定义函数 `createTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 98 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>        content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 100 | <code>        isError: details.ok === false &#124;&#124; details.status === 'failed' &#124;&#124; details.status === 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 101 | <code>        details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 102 | <code>        ...(structuredContent ? { structuredContent } : {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 103 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>function createErrorResult(code, message, details = {}) {</code> | 定义函数 `createErrorResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 107 | <code>    return createTextResult(message, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 108 | <code>        status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 109 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 110 | <code>        code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 111 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 112 | <code>        ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 113 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>function columnName(columnNumber) {</code> | 定义函数 `columnName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 117 | <code>    let value = Number(columnNumber);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 118 | <code>    let name = '';</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 119 | <code>    while (value &gt; 0) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 120 | <code>        const remainder = (value - 1) % 26;</code> | 声明局部标识符 `remainder`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 121 | <code>        name = String.fromCharCode(65 + remainder) + name;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 122 | <code>        value = Math.floor((value - 1) / 26);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 123 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>    return name &#124;&#124; 'A';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 125 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 126 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 127 | <code>function columnNumber(letters = '') {</code> | 定义函数 `columnNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 128 | <code>    return normalizeString(letters)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 129 | <code>        .toUpperCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 130 | <code>        .split('')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 131 | <code>        .reduce((sum, char) =&gt; sum * 26 + char.charCodeAt(0) - 64, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 132 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>function cellAddress(row, column) {</code> | 定义函数 `cellAddress`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 135 | <code>    return `${columnName(column)}${row}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>function rangeAddress(bounds = {}) {</code> | 定义函数 `rangeAddress`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 139 | <code>    return `${cellAddress(bounds.startRow, bounds.startCol)}:${cellAddress(bounds.endRow, bounds.endCol)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>function parseRange(value = '') {</code> | 定义函数 `parseRange`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 143 | <code>    const raw = normalizeString(value).toUpperCase();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 144 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 145 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 146 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>    const single = raw.match(/^([A-Z]+)(\d+)$/);</code> | 声明局部标识符 `single`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 148 | <code>    if (single) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 149 | <code>        const col = columnNumber(single[1]);</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 150 | <code>        const row = Number(single[2]);</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 151 | <code>        return { startRow: row, endRow: row, startCol: col, endCol: col };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 152 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>    const match = raw.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 154 | <code>    if (!match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 155 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 156 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    const startCol = columnNumber(match[1]);</code> | 声明局部标识符 `startCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 158 | <code>    const startRow = Number(match[2]);</code> | 声明局部标识符 `startRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 159 | <code>    const endCol = columnNumber(match[3]);</code> | 声明局部标识符 `endCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 160 | <code>    const endRow = Number(match[4]);</code> | 声明局部标识符 `endRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 161 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 162 | <code>        startRow: Math.min(startRow, endRow),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 163 | <code>        endRow: Math.max(startRow, endRow),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 164 | <code>        startCol: Math.min(startCol, endCol),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 165 | <code>        endCol: Math.max(startCol, endCol)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 166 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>function parseCell(value = '') {</code> | 定义函数 `parseCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 170 | <code>    const parsed = parseRange(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 171 | <code>    if (!parsed &#124;&#124; parsed.startRow !== parsed.endRow &#124;&#124; parsed.startCol !== parsed.endCol) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 172 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 175 | <code>        row: parsed.startRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 176 | <code>        col: parsed.startCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 177 | <code>        address: cellAddress(parsed.startRow, parsed.startCol)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 178 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 181 | <code>function normalizeColor(value = '') {</code> | 定义函数 `normalizeColor`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 182 | <code>    const raw = normalizeString(value).replace(/[^A-Fa-f0-9]/g, '').toUpperCase();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 183 | <code>    if (raw.length === 8 &amp;&amp; raw.startsWith('FF')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 184 | <code>        return raw.slice(2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    return raw;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 187 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>function mergeNestedArgs(args = {}) {</code> | 定义函数 `mergeNestedArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 190 | <code>    const nested = [args.params, args.config, args.options]</code> | 声明局部标识符 `nested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 191 | <code>        .find((entry) =&gt; entry &amp;&amp; typeof entry === 'object' &amp;&amp; !Array.isArray(entry)) &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 192 | <code>    return { ...nested, ...args };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 193 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>function rgbFromHex(value = '') {</code> | 定义函数 `rgbFromHex`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 196 | <code>    const color = normalizeColor(value);</code> | 声明局部标识符 `color`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 197 | <code>    if (!/^[A-F0-9]{6}$/i.test(color)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 201 | <code>        r: parseInt(color.slice(0, 2), 16),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 202 | <code>        g: parseInt(color.slice(2, 4), 16),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 203 | <code>        b: parseInt(color.slice(4, 6), 16)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 204 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 207 | <code>function colorLooksLikeName(hex = '', name = '') {</code> | 定义函数 `colorLooksLikeName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 208 | <code>    const rgb = rgbFromHex(hex);</code> | 声明局部标识符 `rgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 209 | <code>    const label = normalizeString(name).toLowerCase();</code> | 声明局部标识符 `label`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 210 | <code>    if (!rgb &#124;&#124; !label) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 211 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 212 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>    if (label === 'blue') return rgb.b &gt;= 120 &amp;&amp; rgb.b &gt;= rgb.r + 40 &amp;&amp; rgb.b &gt;= rgb.g + 40;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 214 | <code>    if (label === 'green') return rgb.g &gt;= 120 &amp;&amp; rgb.g &gt;= rgb.r + 40 &amp;&amp; rgb.g &gt;= rgb.b - 20;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 215 | <code>    if (label === 'yellow') return rgb.r &gt;= 150 &amp;&amp; rgb.g &gt;= 150 &amp;&amp; rgb.b &lt;= 120;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 216 | <code>    if (label === 'red') return rgb.r &gt;= 140 &amp;&amp; rgb.r &gt;= rgb.g + 40 &amp;&amp; rgb.r &gt;= rgb.b + 40;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 217 | <code>    if (label === 'black') return rgb.r &lt;= 60 &amp;&amp; rgb.g &lt;= 60 &amp;&amp; rgb.b &lt;= 60;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 218 | <code>    if (label === 'white') return rgb.r &gt;= 220 &amp;&amp; rgb.g &gt;= 220 &amp;&amp; rgb.b &gt;= 220;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 219 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 220 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>function expandColorNameList(values = [], cells = []) {</code> | 定义函数 `expandColorNameList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 223 | <code>    const fills = [...new Set(cells.map((cell) =&gt; normalizeColor(cell.fill)).filter(Boolean))];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 224 | <code>    const expanded = [];</code> | 声明局部标识符 `expanded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 225 | <code>    for (const value of values) {</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 226 | <code>        const direct = normalizeColor(value);</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 227 | <code>        if (/^[A-F0-9]{6}$/i.test(direct)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 228 | <code>            expanded.push(direct);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 229 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 230 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>        const label = normalizeString(value).toLowerCase();</code> | 声明局部标识符 `label`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 232 | <code>        const matches = fills.filter((fill) =&gt; colorLooksLikeName(fill, label));</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 233 | <code>        expanded.push(...matches);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 234 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    return [...new Set(expanded.filter(Boolean))];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 236 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>function extractColorHintsFromRuleText(text = '') {</code> | 定义函数 `extractColorHintsFromRuleText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 239 | <code>    const raw = normalizeString(text);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 240 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 241 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 242 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>    const hints = [];</code> | 声明局部标识符 `hints`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 244 | <code>    for (const match of raw.matchAll(/\b(?:[A-Fa-f0-9]{6}&#124;FF[A-Fa-f0-9]{6})\b/g)) {</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 245 | <code>        hints.push(match[0]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>    for (const name of ['blue', 'green', 'yellow', 'red', 'black', 'white']) {</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 248 | <code>        if (new RegExp(`\\b${name}\\b`, 'i').test(raw)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 249 | <code>            hints.push(name);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 250 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    return [...new Set(hints)];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 253 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>function extractStepSizeFromRuleText(text = '') {</code> | 定义函数 `extractStepSizeFromRuleText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 256 | <code>    const raw = normalizeString(text);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 257 | <code>    const match = raw.match(/\b(\d+)\s*(?:cells?&#124;steps?&#124;moves?&#124;squares?)\s*(?:per&#124;\/)\s*turn\b/i);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 258 | <code>    if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 259 | <code>        return Number(match[1]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 260 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>    return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 262 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>function sheetBySelection(payload = {}, args = {}) {</code> | 定义函数 `sheetBySelection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 265 | <code>    const sheets = payload.workbook?.sheets &#124;&#124; [];</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 266 | <code>    const explicitName = normalizeString(args.sheet &#124;&#124; args.sheetName &#124;&#124; args.sheet_name &#124;&#124; args.worksheet);</code> | 声明局部标识符 `explicitName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 267 | <code>    if (explicitName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 268 | <code>        return sheets.find((sheet) =&gt; normalizeString(sheet.name).toLowerCase() === explicitName.toLowerCase()) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 269 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>    const sheetIndex = Number(args.sheetIndex &#124;&#124; args.sheet_index &#124;&#124; 1);</code> | 声明局部标识符 `sheetIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 271 | <code>    if (Number.isFinite(sheetIndex) &amp;&amp; sheetIndex &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 272 | <code>        return sheets[sheetIndex - 1] &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 273 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>    return sheets[0] &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 275 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>function getSpreadsheetStoredBounds(sheet = {}) {</code> | 定义函数 `getSpreadsheetStoredBounds`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 278 | <code>    const rows = sheet.grids?.display &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 279 | <code>    const rowNumbers = sheet.grids?.rowNumbers &#124;&#124; [];</code> | 声明局部标识符 `rowNumbers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 280 | <code>    const columns = sheet.grids?.columns &#124;&#124; [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 281 | <code>    const firstRow = rowNumbers[0] &#124;&#124; 1;</code> | 声明局部标识符 `firstRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 282 | <code>    const firstCol = columns[0] ? columnNumber(columns[0]) : 1;</code> | 声明局部标识符 `firstCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 283 | <code>    const lastRow = rowNumbers.length ? rowNumbers[rowNumbers.length - 1] : firstRow + Math.max(0, rows.length - 1);</code> | 声明局部标识符 `lastRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 284 | <code>    const lastCol = columns.length ? firstCol + columns.length - 1 : firstCol;</code> | 声明局部标识符 `lastCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 285 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 286 | <code>        firstRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 287 | <code>        firstCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 288 | <code>        lastRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 289 | <code>        lastCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 290 | <code>        rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 291 | <code>        columnCount: columns.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 292 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>function buildSpreadsheetGridCoverage(sheet = {}, args = {}) {</code> | 定义函数 `buildSpreadsheetGridCoverage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 296 | <code>    const rows = sheet.grids?.display &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 297 | <code>    const rowNumbers = sheet.grids?.rowNumbers &#124;&#124; [];</code> | 声明局部标识符 `rowNumbers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 298 | <code>    const columns = sheet.grids?.columns &#124;&#124; [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 299 | <code>    const stored = getSpreadsheetStoredBounds(sheet);</code> | 声明局部标识符 `stored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 300 | <code>    const maxRows = normalizeNumber(args.maxRows &#124;&#124; args.max_rows &#124;&#124; args.limitRows, DEFAULT_GRID_ROWS, 1, 500);</code> | 声明局部标识符 `maxRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 301 | <code>    const maxCols = normalizeNumber(args.maxCols &#124;&#124; args.max_cols &#124;&#124; args.limitCols, DEFAULT_GRID_COLS, 1, 200);</code> | 声明局部标识符 `maxCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 302 | <code>    const rowCount = Math.min(rows.length, maxRows);</code> | 声明局部标识符 `rowCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 303 | <code>    const columnCount = Math.min(columns.length, maxCols);</code> | 声明局部标识符 `columnCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 304 | <code>    const startRow = rowNumbers[0] &#124;&#124; stored.firstRow;</code> | 声明局部标识符 `startRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 305 | <code>    const startCol = columns[0] ? columnNumber(columns[0]) : stored.firstCol;</code> | 声明局部标识符 `startCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 306 | <code>    const endRow = rowCount &gt; 0 ? (rowNumbers[rowCount - 1] &#124;&#124; startRow + rowCount - 1) : startRow;</code> | 声明局部标识符 `endRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 307 | <code>    const endCol = columnCount &gt; 0 ? startCol + columnCount - 1 : startCol;</code> | 声明局部标识符 `endCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 308 | <code>    const complete = rowCount === rows.length &amp;&amp; columnCount === columns.length;</code> | 声明局部标识符 `complete`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 309 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 310 | <code>        kind: 'spreadsheet_range_coverage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 311 | <code>        queryAction: 'grid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 312 | <code>        sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 313 | <code>        range: rangeAddress({ startRow, startCol, endRow, endCol }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 314 | <code>        startRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 315 | <code>        endRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 316 | <code>        startCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 317 | <code>        endCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 318 | <code>        rowCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 319 | <code>        columnCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 320 | <code>        storedRange: rangeAddress({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 321 | <code>            startRow: stored.firstRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 322 | <code>            startCol: stored.firstCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 323 | <code>            endRow: stored.lastRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 324 | <code>            endCol: stored.lastCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 325 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>        storedRows: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 327 | <code>        storedColumns: columns.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 328 | <code>        complete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 329 | <code>        truncated: !complete</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 330 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 333 | <code>function buildSpreadsheetRangeCoverage(sheet = {}, parsedRange = {}, outsideStoredRange = false, returnedCells = 0) {</code> | 定义函数 `buildSpreadsheetRangeCoverage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 334 | <code>    const stored = getSpreadsheetStoredBounds(sheet);</code> | 声明局部标识符 `stored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 335 | <code>    const coverage = {</code> | 声明局部标识符 `coverage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 336 | <code>        kind: 'spreadsheet_range_coverage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 337 | <code>        queryAction: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 338 | <code>        sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 339 | <code>        range: rangeAddress(parsedRange),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 340 | <code>        startRow: parsedRange.startRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 341 | <code>        endRow: parsedRange.endRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 342 | <code>        startCol: parsedRange.startCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 343 | <code>        endCol: parsedRange.endCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 344 | <code>        rowCount: Math.max(0, parsedRange.endRow - parsedRange.startRow + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 345 | <code>        columnCount: Math.max(0, parsedRange.endCol - parsedRange.startCol + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 346 | <code>        returnedCells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 347 | <code>        storedRange: rangeAddress({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 348 | <code>            startRow: stored.firstRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 349 | <code>            startCol: stored.firstCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 350 | <code>            endRow: stored.lastRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 351 | <code>            endCol: stored.lastCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 352 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>        complete: !outsideStoredRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 354 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 355 | <code>        outsideStoredRange</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 356 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>    return coverage;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 358 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>function createPinnedEvidence(record = {}, details = {}) {</code> | 定义函数 `createPinnedEvidence`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 361 | <code>    const coverage = details.coverage &amp;&amp; typeof details.coverage === 'object' ? details.coverage : null;</code> | 声明局部标识符 `coverage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 362 | <code>    if (!coverage &#124;&#124; details.complete !== true &#124;&#124; details.truncated === true &#124;&#124; details.reasoningReady !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 363 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 364 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>    const basis = [</code> | 声明局部标识符 `basis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 366 | <code>        record.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 367 | <code>        details.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 368 | <code>        coverage.sheet &#124;&#124; details.sheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 369 | <code>        coverage.range &#124;&#124; details.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 370 | <code>        coverage.queryAction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 371 | <code>    ].filter(Boolean).join(':');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 372 | <code>    const evidenceId = `ev-${stableHash(basis)}`;</code> | 声明局部标识符 `evidenceId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 373 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 374 | <code>        evidenceId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 375 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 376 | <code>        artifactKind: record.kind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 377 | <code>        artifactType: record.type,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 378 | <code>        sourceTool: CONTEXT_ARTIFACT_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 379 | <code>        action: details.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 380 | <code>        sheet: coverage.sheet &#124;&#124; details.sheet &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 381 | <code>        range: coverage.range &#124;&#124; details.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 382 | <code>        coverage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 383 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 384 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 385 | <code>        reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 386 | <code>        claim: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 387 | <code>            'Complete artifact evidence is already available',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 388 | <code>            coverage.sheet ? `sheet=${coverage.sheet}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 389 | <code>            coverage.range ? `range=${coverage.range}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 390 | <code>        ].filter(Boolean).join('; '),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 391 | <code>        createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 392 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>function sameSheetName(left = '', right = '') {</code> | 定义函数 `sameSheetName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 396 | <code>    return normalizeString(left).toLowerCase() === normalizeString(right).toLowerCase();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 397 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 398 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 399 | <code>function coverageContains(outer = {}, inner = {}) {</code> | 定义函数 `coverageContains`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 400 | <code>    if (!outer &#124;&#124; !inner &#124;&#124; outer.kind !== inner.kind) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 401 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 402 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    if (!sameSheetName(outer.sheet, inner.sheet)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 404 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 405 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>    for (const field of ['startRow', 'endRow', 'startCol', 'endCol']) {</code> | 声明局部标识符 `field`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 407 | <code>        if (!Number.isFinite(Number(outer[field])) &#124;&#124; !Number.isFinite(Number(inner[field]))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 408 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 409 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>    return Number(outer.startRow) &lt;= Number(inner.startRow) &amp;&amp;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 412 | <code>        Number(outer.endRow) &gt;= Number(inner.endRow) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 413 | <code>        Number(outer.startCol) &lt;= Number(inner.startCol) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 414 | <code>        Number(outer.endCol) &gt;= Number(inner.endCol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 415 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 417 | <code>function findCoveringEvidence(record = {}, coverage = null, skipEvidenceId = '') {</code> | 定义函数 `findCoveringEvidence`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 418 | <code>    if (!coverage &#124;&#124; !record?.metadata &#124;&#124; typeof record.metadata !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 419 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 420 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>    const pinned = Array.isArray(record.metadata.pinnedEvidence) ? record.metadata.pinnedEvidence : [];</code> | 声明局部标识符 `pinned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 422 | <code>    const match = pinned.find((entry) =&gt;</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 423 | <code>        entry?.evidenceId &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 424 | <code>        entry.evidenceId !== skipEvidenceId &amp;&amp;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 425 | <code>        entry.complete === true &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 426 | <code>        entry.truncated !== true &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 427 | <code>        entry.reasoningReady === true &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 428 | <code>        coverageContains(entry.coverage, coverage)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 429 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>    if (!match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 431 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 432 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 434 | <code>        evidenceId: match.evidenceId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 435 | <code>        artifactId: match.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 436 | <code>        action: match.action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 437 | <code>        sheet: match.sheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 438 | <code>        range: match.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 439 | <code>        claim: match.claim,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 440 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 441 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 442 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 443 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 446 | <code>function formatSpreadsheetSummary(record = {}, payload = {}) {</code> | 定义函数 `formatSpreadsheetSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 447 | <code>    const sheets = payload.workbook?.sheets &#124;&#124; [];</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 448 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 449 | <code>        'ARTIFACT_SUMMARY',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 450 | <code>        `artifactId=${record.id}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 451 | <code>        `kind=${record.kind &#124;&#124; 'unknown'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 452 | <code>        record.sourcePath ? `source=${record.sourcePath}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 453 | <code>        record.summary ? `summary=${record.summary}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 454 | <code>        `sheets=${sheets.map((sheet) =&gt; sheet.name).join(', ') &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 455 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 456 | <code>        'query_tools=artifact_query actions: summary, grid, range, search, runtime_schema, chunk_search, schema'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 457 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 458 | <code>    for (const sheet of sheets.slice(0, 12)) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 459 | <code>        lines.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 460 | <code>            `Sheet "${sheet.name}": range=${sheet.dimensions?.inspectedRange &#124;&#124; ''} rows=${sheet.dimensions?.rowCount &#124;&#124; 0} cols=${sheet.dimensions?.columnCount &#124;&#124; 0} complete=${sheet.completeness?.allRequestedCellsIncluded !== false}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 461 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>        if (sheet.colorLegend?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 463 | <code>            lines.push(`  fillColors=${sheet.colorLegend.map((entry) =&gt; `${entry.rgb}:${entry.count}`).join(', ')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 464 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>        if (sheet.nonEmptyCells?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 466 | <code>            lines.push(`  nonEmpty=${sheet.nonEmptyCells.slice(0, 24).map((cell) =&gt; `${cell.address}=${JSON.stringify(cell.value)}${cell.fill ? `#${cell.fill}` : ''}`).join('; ')}`);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 467 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>    if (sheets.length &gt; 12) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 470 | <code>        lines.push(`... ${sheets.length - 12} more sheets omitted; query a specific sheet.`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 471 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 473 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 475 | <code>function formatSpreadsheetGrid(sheet = {}, args = {}) {</code> | 定义函数 `formatSpreadsheetGrid`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 476 | <code>    const rows = sheet.grids?.display &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 477 | <code>    const fills = sheet.grids?.fills &#124;&#124; [];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 478 | <code>    const rowNumbers = sheet.grids?.rowNumbers &#124;&#124; [];</code> | 声明局部标识符 `rowNumbers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 479 | <code>    const columns = sheet.grids?.columns &#124;&#124; [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 480 | <code>    const maxRows = normalizeNumber(args.maxRows &#124;&#124; args.max_rows &#124;&#124; args.limitRows, DEFAULT_GRID_ROWS, 1, 500);</code> | 声明局部标识符 `maxRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 481 | <code>    const maxCols = normalizeNumber(args.maxCols &#124;&#124; args.max_cols &#124;&#124; args.limitCols, DEFAULT_GRID_COLS, 1, 200);</code> | 声明局部标识符 `maxCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 482 | <code>    const visibleRows = rows.slice(0, maxRows);</code> | 声明局部标识符 `visibleRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 483 | <code>    const visibleColumns = columns.slice(0, maxCols);</code> | 声明局部标识符 `visibleColumns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 484 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 485 | <code>        `SPREADSHEET_GRID sheet=${JSON.stringify(sheet.name &#124;&#124; '')}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 486 | <code>        `range=${sheet.dimensions?.inspectedRange &#124;&#124; ''} returnedRows=${visibleRows.length}/${rows.length} returnedCols=${visibleColumns.length}/${columns.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 487 | <code>        `complete=${visibleRows.length === rows.length &amp;&amp; visibleColumns.length === columns.length}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 488 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>    for (let index = 0; index &lt; visibleRows.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 490 | <code>        const rowNo = rowNumbers[index] &#124;&#124; index + 1;</code> | 声明局部标识符 `rowNo`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 491 | <code>        const row = visibleRows[index].slice(0, maxCols).map((value, colIndex) =&gt; {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 492 | <code>            const text = normalizeString(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 493 | <code>            const fill = fills[index]?.[colIndex] &#124;&#124; '';</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 494 | <code>            return text &#124;&#124; fill &#124;&#124; '.';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 495 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>        lines.push(`Row ${String(rowNo).padStart(3, ' ')}: ${row.join(' &#124; ')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 497 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>    if (rows.length &gt; visibleRows.length &#124;&#124; columns.length &gt; visibleColumns.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 499 | <code>        lines.push('truncated=true; ask artifact_query range/search for a narrower slice.');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 500 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 501 | <code>        lines.push('truncated=false; reasoning_ready=true');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 502 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 504 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>function formatSpreadsheetRange(sheet = {}, args = {}) {</code> | 定义函数 `formatSpreadsheetRange`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 507 | <code>    const parsedRange = parseRange(args.range &#124;&#124; args.addressRange &#124;&#124; args.address_range &#124;&#124; '');</code> | 声明局部标识符 `parsedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 508 | <code>    if (!parsedRange) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 509 | <code>        return createErrorResult('invalid_range', 'artifact_query range requires an A1 range such as A1:D20.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 510 | <code>            action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 511 | <code>            artifactId: args.artifactId &#124;&#124; args.id</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 512 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 513 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>    const rows = sheet.grids?.display &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 515 | <code>    const fills = sheet.grids?.fills &#124;&#124; [];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 516 | <code>    const rowNumbers = sheet.grids?.rowNumbers &#124;&#124; [];</code> | 声明局部标识符 `rowNumbers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 517 | <code>    const columns = sheet.grids?.columns &#124;&#124; [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 518 | <code>    const firstRow = rowNumbers[0] &#124;&#124; 1;</code> | 声明局部标识符 `firstRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 519 | <code>    const firstCol = columns[0] ? columnNumber(columns[0]) : 1;</code> | 声明局部标识符 `firstCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 520 | <code>    const lastRow = rowNumbers.length ? rowNumbers[rowNumbers.length - 1] : firstRow - 1;</code> | 声明局部标识符 `lastRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 521 | <code>    const lastCol = columns.length ? firstCol + columns.length - 1 : firstCol - 1;</code> | 声明局部标识符 `lastCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 522 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 523 | <code>        `SPREADSHEET_RANGE sheet=${JSON.stringify(sheet.name &#124;&#124; '')} range=${args.range &#124;&#124; args.addressRange &#124;&#124; args.address_range}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 524 | <code>        'display=value if present, otherwise fill RGB, "." for empty/no fill'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 525 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>    let returnedCells = 0;</code> | 声明局部标识符 `returnedCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 527 | <code>    let outsideStoredRange = false;</code> | 声明局部标识符 `outsideStoredRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 528 | <code>    for (let row = parsedRange.startRow; row &lt;= parsedRange.endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 529 | <code>        const rowIndex = row - firstRow;</code> | 声明局部标识符 `rowIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 530 | <code>        const values = [];</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 531 | <code>        for (let col = parsedRange.startCol; col &lt;= parsedRange.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 532 | <code>            const colIndex = col - firstCol;</code> | 声明局部标识符 `colIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 533 | <code>            if (row &lt; firstRow &#124;&#124; row &gt; lastRow &#124;&#124; col &lt; firstCol &#124;&#124; col &gt; lastCol) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 534 | <code>                outsideStoredRange = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 535 | <code>                values.push('[outside-artifact]');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 536 | <code>                returnedCells += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 537 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 538 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 539 | <code>            const text = normalizeString(rows[rowIndex]?.[colIndex]);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 540 | <code>            const fill = fills[rowIndex]?.[colIndex] &#124;&#124; '';</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 541 | <code>            values.push(text &#124;&#124; fill &#124;&#124; '.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 542 | <code>            returnedCells += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 543 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>        lines.push(`Row ${String(row).padStart(3, ' ')}: ${values.join(' &#124; ')}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 545 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>    lines.push(`returnedCells=${returnedCells}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 547 | <code>    const coverage = buildSpreadsheetRangeCoverage(sheet, parsedRange, outsideStoredRange, returnedCells);</code> | 声明局部标识符 `coverage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 548 | <code>    if (outsideStoredRange) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 549 | <code>        lines.push(`storedRange=${cellAddress(firstRow, firstCol)}:${cellAddress(lastRow, lastCol)}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 550 | <code>        lines.push('outsideStoredRange=true; complete=false; reasoning_ready=false; query a wider range/maxRows/maxCols through artifact_tools or artifact_query.');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 551 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 552 | <code>        lines.push('truncated=false; complete=true; reasoning_ready=true');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 553 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>    return createTextResult(lines.join('\n'), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 555 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 556 | <code>        ok: !outsideStoredRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 557 | <code>        action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 558 | <code>        artifactId: args.artifactId &#124;&#124; args.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 559 | <code>        sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 560 | <code>        range: args.range &#124;&#124; args.addressRange &#124;&#124; args.address_range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 561 | <code>        returnedCells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 562 | <code>        outsideStoredRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 563 | <code>        coverage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 564 | <code>        complete: !outsideStoredRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 565 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 566 | <code>        reasoningReady: !outsideStoredRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 567 | <code>        observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 568 | <code>            complete: !outsideStoredRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 569 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 570 | <code>            reasoning_ready: !outsideStoredRange</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 571 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>function searchSpreadsheet(payload = {}, args = {}) {</code> | 定义函数 `searchSpreadsheet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 576 | <code>    const query = normalizeString(args.query &#124;&#124; args.q &#124;&#124; args.text).toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 577 | <code>    if (!query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 578 | <code>        return createErrorResult('missing_query', 'artifact_query search requires query/q/text.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 579 | <code>            action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 580 | <code>            artifactId: args.artifactId &#124;&#124; args.id</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 581 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 583 | <code>    const limit = normalizeNumber(args.limit, 50, 1, 500);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 584 | <code>    const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 585 | <code>    for (const sheet of payload.workbook?.sheets &#124;&#124; []) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 586 | <code>        for (const cell of sheet.cells &#124;&#124; []) {</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 587 | <code>            const haystack = [</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 588 | <code>                cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 589 | <code>                cell.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 590 | <code>                cell.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 591 | <code>                cell.formula?.formula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 592 | <code>                cell.formula?.result,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 593 | <code>                cell.fill?.fgRgb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 594 | <code>                cell.fill?.bgRgb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 595 | <code>            ].filter((entry) =&gt; entry !== null &amp;&amp; entry !== undefined).join(' ').toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 596 | <code>            if (haystack.includes(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 597 | <code>                matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 598 | <code>                    sheet: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 599 | <code>                    address: cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 600 | <code>                    value: cell.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 601 | <code>                    text: cell.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 602 | <code>                    fill: cell.fill?.fgRgb &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 603 | <code>                    formula: cell.formula?.formula &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 604 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 605 | <code>                if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 606 | <code>                    break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 607 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 608 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>        if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 611 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 612 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 614 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 615 | <code>        `ARTIFACT_SEARCH artifactId=${args.artifactId &#124;&#124; args.id} query=${JSON.stringify(query)}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 616 | <code>        `matches=${matches.length} limit=${limit}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 617 | <code>        ...matches.map((match) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 618 | <code>            `${match.sheet}!${match.address}: value=${JSON.stringify(match.value)} text=${JSON.stringify(match.text)} fill=${match.fill &#124;&#124; '-'} formula=${match.formula &#124;&#124; '-'}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 619 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 620 | <code>        `truncated=${matches.length &gt;= limit}; reasoning_ready=true`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 621 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>    return createTextResult(lines.join('\n'), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 623 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 624 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 625 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 626 | <code>        artifactId: args.artifactId &#124;&#124; args.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 627 | <code>        query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 628 | <code>        matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 629 | <code>        matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 630 | <code>        truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 631 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 632 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 633 | <code>        matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 634 | <code>        truncated: matches.length &gt;= limit</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 635 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>function getTextArtifactPayload(payload = {}) {</code> | 定义函数 `getTextArtifactPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 639 | <code>    const artifact = payload.textArtifact &#124;&#124; payload.text_artifact &#124;&#124; null;</code> | 声明局部标识符 `artifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 640 | <code>    if (artifact &amp;&amp; typeof artifact === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 641 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 642 | <code>            ...artifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 643 | <code>            text: String(artifact.text &#124;&#124; '')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 644 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 645 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>    if (typeof payload.text === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 647 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 648 | <code>            text: payload.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 649 | <code>            path: payload.path &#124;&#124; payload.sourcePath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 650 | <code>            encoding: payload.encoding &#124;&#124; 'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 651 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 652 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 653 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 654 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 655 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 656 | <code>function getDocumentArtifactPayload(payload = {}) {</code> | 定义函数 `getDocumentArtifactPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 657 | <code>    const artifact = payload.documentArtifact &#124;&#124; payload.document_artifact &#124;&#124; null;</code> | 声明局部标识符 `artifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 658 | <code>    if (artifact &amp;&amp; typeof artifact === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 659 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 660 | <code>            ...artifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 661 | <code>            text: String(artifact.text &#124;&#124; '')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 662 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 664 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 665 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 667 | <code>function splitLines(text = '') {</code> | 定义函数 `splitLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 668 | <code>    return String(text &#124;&#124; '').split(/\r?\n/);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 669 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 671 | <code>function numberedLines(lines = [], startLine = 1) {</code> | 定义函数 `numberedLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 672 | <code>    return lines.map((line, index) =&gt; `${String(startLine + index).padStart(5, ' ')}: ${line}`).join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 673 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 675 | <code>function formatTextArtifactSummary(record = {}, textArtifact = {}) {</code> | 定义函数 `formatTextArtifactSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 676 | <code>    const text = String(textArtifact.text &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 677 | <code>    const lines = splitLines(text);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 678 | <code>    const previewLines = lines.slice(0, 24);</code> | 声明局部标识符 `previewLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 679 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 680 | <code>        'TEXT_ARTIFACT_SUMMARY',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 681 | <code>        `artifactId=${record.id}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 682 | <code>        `source=${record.sourcePath &#124;&#124; textArtifact.path &#124;&#124; ''}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 683 | <code>        `bytes=${record.payloadBytes &#124;&#124; textArtifact.bytes &#124;&#124; 0} chars=${text.length} lines=${lines.length}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 684 | <code>        `encoding=${textArtifact.encoding &#124;&#124; 'utf8'} type=${textArtifact.type &#124;&#124; record.type &#124;&#124; 'text'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 685 | <code>        'query_tools=artifact_query actions: text_schema, text_range, text_search, text_tail, runtime_schema, chunk_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 686 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 687 | <code>        '--- first lines ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 688 | <code>        numberedLines(previewLines, 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 689 | <code>        lines.length &gt; previewLines.length ? `... ${lines.length - previewLines.length} more lines; use text_range/text_search/text_tail.` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 690 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 691 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>function textSchemaResult(record = {}, textArtifact = {}) {</code> | 定义函数 `textSchemaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 694 | <code>    return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 695 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 696 | <code>        kind: record.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 697 | <code>        type: record.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 698 | <code>        sourcePath: record.sourcePath &#124;&#124; textArtifact.path &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 699 | <code>        actions: ['summary', 'text_schema', 'text_range', 'text_search', 'text_tail'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 700 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 701 | <code>            text_range: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 702 | <code>                startLine: '1-based line start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 703 | <code>                endLine: '1-based line end',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 704 | <code>                offset: 'optional character offset',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 705 | <code>                limit: 'optional character count'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 706 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 707 | <code>            text_search: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 708 | <code>                query: 'literal text or regex pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 709 | <code>                regex: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 710 | <code>                caseSensitive: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 711 | <code>                maxResults: 50,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 712 | <code>                contextLines: 1</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 713 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>            text_tail: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 715 | <code>                lines: 80,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 716 | <code>                chars: 'optional character tail limit'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 717 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 718 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 719 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 720 | <code>            chars: String(textArtifact.text &#124;&#124; '').length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 721 | <code>            lines: splitLines(textArtifact.text &#124;&#124; '').length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 722 | <code>            payloadBytes: record.payloadBytes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 723 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 724 | <code>    }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 725 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 726 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 727 | <code>        action: 'text_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 728 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 729 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 730 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 731 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 732 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 733 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 734 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 735 | <code>function textRangeResult(record = {}, textArtifact = {}, args = {}) {</code> | 定义函数 `textRangeResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 736 | <code>    const text = String(textArtifact.text &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 737 | <code>    const hasOffset = args.offset !== undefined &#124;&#124; args.start !== undefined;</code> | 声明局部标识符 `hasOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 738 | <code>    if (hasOffset) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 739 | <code>        const offset = normalizeNumber(args.offset ?? args.start, 0, 0, Math.max(0, text.length));</code> | 声明局部标识符 `offset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 740 | <code>        const limit = normalizeNumber(args.limit &#124;&#124; args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1, 200000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 741 | <code>        const slice = text.slice(offset, offset + limit);</code> | 声明局部标识符 `slice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 742 | <code>        const nextOffset = offset + slice.length;</code> | 声明局部标识符 `nextOffset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 743 | <code>        return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 744 | <code>            `TEXT_ARTIFACT_RANGE artifactId=${record.id} offset=${offset} limit=${limit}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 745 | <code>            `charsReturned=${slice.length} nextOffset=${nextOffset} hasMore=${nextOffset &lt; text.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 746 | <code>            'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 747 | <code>            '--- text ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 748 | <code>            slice</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 749 | <code>        ].join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 750 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 751 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 752 | <code>            action: 'text_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 753 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 754 | <code>            offset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 755 | <code>            limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 756 | <code>            charsReturned: slice.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 757 | <code>            nextOffset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 758 | <code>            hasMore: nextOffset &lt; text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 759 | <code>            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 760 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 761 | <code>            reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 762 | <code>        }, { text: slice, offset, nextOffset, hasMore: nextOffset &lt; text.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 763 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>    const lines = splitLines(text);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 765 | <code>    const startLine = normalizeNumber(args.startLine &#124;&#124; args.start_line &#124;&#124; args.lineStart &#124;&#124; args.line_start, 1, 1, Math.max(1, lines.length));</code> | 声明局部标识符 `startLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 766 | <code>    const defaultEnd = Math.min(lines.length, startLine + 119);</code> | 声明局部标识符 `defaultEnd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 767 | <code>    const endLine = normalizeNumber(args.endLine &#124;&#124; args.end_line &#124;&#124; args.lineEnd &#124;&#124; args.line_end, defaultEnd, startLine, Math.max(startLine, lines.length));</code> | 声明局部标识符 `endLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 768 | <code>    const selected = lines.slice(startLine - 1, endLine);</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 769 | <code>    return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 770 | <code>        `TEXT_ARTIFACT_RANGE artifactId=${record.id} lines=${startLine}-${endLine}/${lines.length}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 771 | <code>        `hasMore=${endLine &lt; lines.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 772 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 773 | <code>        '--- lines ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 774 | <code>        numberedLines(selected, startLine)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 775 | <code>    ].join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 776 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 777 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 778 | <code>        action: 'text_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 779 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 780 | <code>        startLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 781 | <code>        endLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 782 | <code>        lineCount: lines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 783 | <code>        hasMore: endLine &lt; lines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 784 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 785 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 786 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 787 | <code>    }, { lines: selected, startLine, endLine, hasMore: endLine &lt; lines.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 788 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 790 | <code>function compileSearchMatcher(args = {}) {</code> | 定义函数 `compileSearchMatcher`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 791 | <code>    const query = normalizeString(args.query &#124;&#124; args.q &#124;&#124; args.text &#124;&#124; args.pattern);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 792 | <code>    if (!query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 793 | <code>        return { error: 'missing_query' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 794 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>    if (args.regex === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 796 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 797 | <code>            const flags = args.caseSensitive === true ? 'g' : 'gi';</code> | 声明局部标识符 `flags`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 798 | <code>            const regex = new RegExp(query, flags);</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 799 | <code>            return { query, test: (line) =&gt; regex.test(line) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 800 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 801 | <code>            return { error: 'invalid_regex', message: error?.message &#124;&#124; String(error), query };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 802 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 803 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 804 | <code>    const needle = args.caseSensitive === true ? query : query.toLowerCase();</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 805 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 806 | <code>        query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 807 | <code>        test: (line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 808 | <code>            const haystack = args.caseSensitive === true ? String(line &#124;&#124; '') : String(line &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 809 | <code>            return haystack.includes(needle);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 810 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 811 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 812 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>function searchTextLines({ record = {}, text = '', args = {}, action = 'text_search', pageNumber = null } = {}) {</code> | 定义函数 `searchTextLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 815 | <code>    const matcher = compileSearchMatcher(args);</code> | 声明局部标识符 `matcher`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 816 | <code>    if (matcher.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 817 | <code>        return createErrorResult(matcher.error, matcher.message &#124;&#124; `${action} requires query/q/text.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 818 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 819 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 820 | <code>            query: matcher.query</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 821 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 822 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 823 | <code>    const lines = splitLines(text);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 824 | <code>    const limit = normalizeNumber(args.maxResults &#124;&#124; args.max_results &#124;&#124; args.limit, 50, 1, 500);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 825 | <code>    const contextLines = normalizeNumber(args.contextLines &#124;&#124; args.context_lines, 1, 0, 10);</code> | 声明局部标识符 `contextLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 826 | <code>    const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 827 | <code>    for (let index = 0; index &lt; lines.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 828 | <code>        if (!matcher.test(lines[index])) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 829 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 830 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 831 | <code>        const start = Math.max(0, index - contextLines);</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 832 | <code>        const end = Math.min(lines.length, index + contextLines + 1);</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 833 | <code>        matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 834 | <code>            line: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 835 | <code>            ...(pageNumber ? { page: pageNumber } : {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 836 | <code>            text: lines[index],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 837 | <code>            context: lines.slice(start, end).map((line, offset) =&gt; ({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 838 | <code>                line: start + offset + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 839 | <code>                text: line</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 840 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 841 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 842 | <code>        if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 843 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 844 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 845 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 846 | <code>    return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 847 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 848 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 849 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 850 | <code>        query: matcher.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 851 | <code>        matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 852 | <code>        truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 853 | <code>        matches</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 854 | <code>    }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 855 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 856 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 857 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 858 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 859 | <code>        query: matcher.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 860 | <code>        matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 861 | <code>        matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 862 | <code>        truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 863 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 864 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 865 | <code>    }, { matches });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 866 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 868 | <code>function textTailResult(record = {}, textArtifact = {}, args = {}) {</code> | 定义函数 `textTailResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 869 | <code>    const text = String(textArtifact.text &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 870 | <code>    if (args.chars &#124;&#124; args.maxChars &#124;&#124; args.max_chars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 871 | <code>        const chars = normalizeNumber(args.chars &#124;&#124; args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1, 200000);</code> | 声明局部标识符 `chars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 872 | <code>        const slice = text.slice(-chars);</code> | 声明局部标识符 `slice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 873 | <code>        return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 874 | <code>            `TEXT_ARTIFACT_TAIL artifactId=${record.id} chars=${slice.length}/${text.length}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 875 | <code>            'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 876 | <code>            '--- tail ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 877 | <code>            slice</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 878 | <code>        ].join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 879 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 880 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 881 | <code>            action: 'text_tail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 882 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 883 | <code>            charsReturned: slice.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 884 | <code>            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 885 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 886 | <code>            reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 887 | <code>        }, { text: slice });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 888 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 889 | <code>    const allLines = splitLines(text);</code> | 声明局部标识符 `allLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 890 | <code>    const lineCount = normalizeNumber(args.lines &#124;&#124; args.limit, 80, 1, 5000);</code> | 声明局部标识符 `lineCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 891 | <code>    const startLine = Math.max(1, allLines.length - lineCount + 1);</code> | 声明局部标识符 `startLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 892 | <code>    const selected = allLines.slice(startLine - 1);</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 893 | <code>    return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 894 | <code>        `TEXT_ARTIFACT_TAIL artifactId=${record.id} lines=${startLine}-${allLines.length}/${allLines.length}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 895 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 896 | <code>        '--- tail lines ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 897 | <code>        numberedLines(selected, startLine)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 898 | <code>    ].join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 899 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 900 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 901 | <code>        action: 'text_tail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 902 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 903 | <code>        startLine,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 904 | <code>        endLine: allLines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 905 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 906 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 907 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 908 | <code>    }, { lines: selected, startLine, endLine: allLines.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 909 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>function formatDocumentArtifactSummary(record = {}, documentArtifact = {}) {</code> | 定义函数 `formatDocumentArtifactSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 912 | <code>    const pages = Array.isArray(documentArtifact.pages) ? documentArtifact.pages : [];</code> | 声明局部标识符 `pages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 913 | <code>    const sections = Array.isArray(documentArtifact.sections) ? documentArtifact.sections : [];</code> | 声明局部标识符 `sections`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 914 | <code>    const text = String(documentArtifact.text &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 915 | <code>    const preview = truncateText(text, 4000);</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 916 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 917 | <code>        'DOCUMENT_ARTIFACT_SUMMARY',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 918 | <code>        `artifactId=${record.id}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 919 | <code>        `source=${record.sourcePath &#124;&#124; documentArtifact.path &#124;&#124; ''}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 920 | <code>        `format=${documentArtifact.format &#124;&#124; record.type &#124;&#124; 'document'} parser=${documentArtifact.parser &#124;&#124; 'unknown'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 921 | <code>        `pages=${pages.length} sections=${sections.length} chars=${text.length} lines=${splitLines(text).length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 922 | <code>        'query_tools=artifact_query actions: document_schema, document_search, document_page, document_section, runtime_schema, chunk_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 923 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 924 | <code>        '--- preview ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 925 | <code>        preview.text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 926 | <code>    ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 927 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 928 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 929 | <code>function documentSchemaResult(record = {}, documentArtifact = {}) {</code> | 定义函数 `documentSchemaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 930 | <code>    return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 931 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 932 | <code>        kind: record.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 933 | <code>        type: record.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 934 | <code>        sourcePath: record.sourcePath &#124;&#124; documentArtifact.path &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 935 | <code>        actions: ['summary', 'document_schema', 'document_search', 'document_page', 'document_section'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 936 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 937 | <code>            document_search: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 938 | <code>                query: 'literal text or regex pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 939 | <code>                regex: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 940 | <code>                caseSensitive: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 941 | <code>                maxResults: 50,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 942 | <code>                contextLines: 1</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 943 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 944 | <code>            document_page: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 945 | <code>                page: '1-based page number'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 946 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 947 | <code>            document_section: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 948 | <code>                index: '0-based section index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 949 | <code>                title: 'optional title contains match',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 950 | <code>                query: 'optional section text/title contains match'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 951 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 952 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 953 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 954 | <code>            chars: String(documentArtifact.text &#124;&#124; '').length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 955 | <code>            lines: splitLines(documentArtifact.text &#124;&#124; '').length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 956 | <code>            pages: Array.isArray(documentArtifact.pages) ? documentArtifact.pages.length : 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 957 | <code>            sections: Array.isArray(documentArtifact.sections) ? documentArtifact.sections.length : 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 958 | <code>            payloadBytes: record.payloadBytes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 959 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 960 | <code>    }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 961 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 962 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 963 | <code>        action: 'document_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 964 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 965 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 966 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 967 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 968 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 969 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 970 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 971 | <code>function documentSearchResult(record = {}, documentArtifact = {}, args = {}) {</code> | 定义函数 `documentSearchResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 972 | <code>    const pages = Array.isArray(documentArtifact.pages) ? documentArtifact.pages : [];</code> | 声明局部标识符 `pages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 973 | <code>    if (!pages.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 974 | <code>        return searchTextLines({ record, text: documentArtifact.text &#124;&#124; '', args, action: 'document_search' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 975 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>    const matcher = compileSearchMatcher(args);</code> | 声明局部标识符 `matcher`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 977 | <code>    if (matcher.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 978 | <code>        return createErrorResult(matcher.error, matcher.message &#124;&#124; 'document_search requires query/q/text.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 979 | <code>            action: 'document_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 980 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 981 | <code>            query: matcher.query</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 982 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 983 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 984 | <code>    const limit = normalizeNumber(args.maxResults &#124;&#124; args.max_results &#124;&#124; args.limit, 50, 1, 500);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 985 | <code>    const contextLines = normalizeNumber(args.contextLines &#124;&#124; args.context_lines, 1, 0, 10);</code> | 声明局部标识符 `contextLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 986 | <code>    const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 987 | <code>    for (const page of pages) {</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 988 | <code>        const pageNo = Number(page.pageNumber &#124;&#124; page.page &#124;&#124; 1);</code> | 声明局部标识符 `pageNo`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 989 | <code>        const lines = splitLines(page.text &#124;&#124; '');</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 990 | <code>        for (let index = 0; index &lt; lines.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 991 | <code>            if (!matcher.test(lines[index])) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 992 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 993 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 994 | <code>            const start = Math.max(0, index - contextLines);</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 995 | <code>            const end = Math.min(lines.length, index + contextLines + 1);</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 996 | <code>            matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 997 | <code>                page: pageNo,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 998 | <code>                line: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 999 | <code>                text: lines[index],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1000 | <code>                context: lines.slice(start, end).map((line, offset) =&gt; ({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1001 | <code>                    page: pageNo,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1002 | <code>                    line: start + offset + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1003 | <code>                    text: line</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1004 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1005 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>            if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1007 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1008 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1009 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1010 | <code>        if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1011 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1012 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1013 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1014 | <code>    return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1015 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1016 | <code>        action: 'document_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1017 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1018 | <code>        query: matcher.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1019 | <code>        matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1020 | <code>        truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1021 | <code>        matches</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1022 | <code>    }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1023 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1024 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1025 | <code>        action: 'document_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1026 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1027 | <code>        query: matcher.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1028 | <code>        matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1029 | <code>        matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1030 | <code>        truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1031 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1032 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1033 | <code>    }, { matches });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1034 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>function documentPageResult(record = {}, documentArtifact = {}, args = {}) {</code> | 定义函数 `documentPageResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1037 | <code>    const pages = Array.isArray(documentArtifact.pages) ? documentArtifact.pages : [];</code> | 声明局部标识符 `pages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1038 | <code>    const pageNumber = normalizeNumber(args.page &#124;&#124; args.pageNumber &#124;&#124; args.page_number, 1, 1, Math.max(1, pages.length &#124;&#124; 1));</code> | 声明局部标识符 `pageNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1039 | <code>    const page = pages.find((entry) =&gt; Number(entry.pageNumber &#124;&#124; entry.page) === pageNumber) &#124;&#124;</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1040 | <code>        (pageNumber === 1 ? { pageNumber: 1, text: documentArtifact.text &#124;&#124; '' } : null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1041 | <code>    if (!page) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1042 | <code>        return createErrorResult('page_not_found', `No page ${pageNumber} in document artifact.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1043 | <code>            action: 'document_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1044 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1045 | <code>            availablePages: pages.map((entry) =&gt; entry.pageNumber &#124;&#124; entry.page)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1046 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>    return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1049 | <code>        `DOCUMENT_ARTIFACT_PAGE artifactId=${record.id} page=${pageNumber}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1050 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1051 | <code>        '--- page text ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1052 | <code>        page.text &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1053 | <code>    ].join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1054 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1055 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1056 | <code>        action: 'document_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1057 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1058 | <code>        page: pageNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1059 | <code>        chars: String(page.text &#124;&#124; '').length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1060 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1061 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1062 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1063 | <code>    }, { page });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1064 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1065 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1066 | <code>function documentSectionResult(record = {}, documentArtifact = {}, args = {}) {</code> | 定义函数 `documentSectionResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1067 | <code>    const sections = Array.isArray(documentArtifact.sections) ? documentArtifact.sections : [];</code> | 声明局部标识符 `sections`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1068 | <code>    const explicitIndex = args.index ?? args.sectionIndex ?? args.section_index;</code> | 声明局部标识符 `explicitIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1069 | <code>    const title = normalizeString(args.title);</code> | 声明局部标识符 `title`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1070 | <code>    const query = normalizeString(args.query &#124;&#124; args.q &#124;&#124; args.text);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1071 | <code>    let section = null;</code> | 声明局部标识符 `section`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1072 | <code>    if (explicitIndex !== undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1073 | <code>        const index = normalizeNumber(explicitIndex, 0, 0, Math.max(0, sections.length - 1));</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1074 | <code>        section = sections[index] &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1075 | <code>    } else if (title &#124;&#124; query) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1076 | <code>        const needle = (title &#124;&#124; query).toLowerCase();</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1077 | <code>        section = sections.find((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1078 | <code>            `${entry.title &#124;&#124; ''}\n${entry.text &#124;&#124; ''}`.toLowerCase().includes(needle)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1079 | <code>        ) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1080 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1081 | <code>        section = sections[0] &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1082 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1083 | <code>    if (!section) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1084 | <code>        return createErrorResult('section_not_found', 'No matching section in document artifact.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1085 | <code>            action: 'document_section',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1086 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1087 | <code>            availableSections: sections.slice(0, 40).map((entry, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1088 | <code>                index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1089 | <code>                title: entry.title &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1090 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1093 | <code>    return createTextResult([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1094 | <code>        `DOCUMENT_ARTIFACT_SECTION artifactId=${record.id} index=${section.index ?? sections.indexOf(section)} title=${JSON.stringify(section.title &#124;&#124; '')}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1095 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1096 | <code>        '--- section text ---',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1097 | <code>        section.text &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1098 | <code>    ].join('\n'), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1099 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1100 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1101 | <code>        action: 'document_section',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1102 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1103 | <code>        sectionIndex: section.index ?? sections.indexOf(section),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1104 | <code>        title: section.title &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1105 | <code>        chars: String(section.text &#124;&#124; '').length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1106 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1107 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1108 | <code>        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1109 | <code>    }, { section });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1110 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1112 | <code>function spreadsheetSheetsForCompute(payload = {}, args = {}) {</code> | 定义函数 `spreadsheetSheetsForCompute`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1113 | <code>    const sheet = sheetBySelection(payload, args);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1114 | <code>    if (normalizeString(args.sheet &#124;&#124; args.sheetName &#124;&#124; args.sheet_name &#124;&#124; args.worksheet) &#124;&#124; args.sheetIndex &#124;&#124; args.sheet_index) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1115 | <code>        return sheet ? [sheet] : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1116 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1117 | <code>    return payload.workbook?.sheets &#124;&#124; [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1118 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1120 | <code>function profileSpreadsheetArtifact(record = {}, payload = {}, args = {}) {</code> | 定义函数 `profileSpreadsheetArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1121 | <code>    const sheets = spreadsheetSheetsForCompute(payload, args);</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1122 | <code>    if (!sheets.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1123 | <code>        return createErrorResult('sheet_not_found', 'artifact_compute profile could not find the requested worksheet.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1124 | <code>            action: 'profile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1125 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1126 | <code>            availableSheets: (payload.workbook?.sheets &#124;&#124; []).map((entry) =&gt; entry.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1127 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1129 | <code>    const profiles = sheets.slice(0, normalizeNumber(args.limit, 12, 1, 100)).map((sheet) =&gt; {</code> | 声明局部标识符 `profiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1130 | <code>        const rows = sheet.grids?.display &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1131 | <code>        const fills = sheet.grids?.fills &#124;&#124; [];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1132 | <code>        const fillCounts = new Map();</code> | 声明局部标识符 `fillCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1133 | <code>        for (const row of fills) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1134 | <code>            for (const fill of row &#124;&#124; []) {</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1135 | <code>                const normalized = normalizeColor(fill);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1136 | <code>                if (normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1137 | <code>                    fillCounts.set(normalized, (fillCounts.get(normalized) &#124;&#124; 0) + 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1138 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1139 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1140 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1141 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1142 | <code>            sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1143 | <code>            inspectedRange: sheet.dimensions?.inspectedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1144 | <code>            rows: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1145 | <code>            columns: sheet.grids?.columns?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1146 | <code>            nonEmptyCells: sheet.nonEmptyCells?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1147 | <code>            formulas: sheet.formulas?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1148 | <code>            mergedRanges: sheet.mergedRanges?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1149 | <code>            fillColors: [...fillCounts.entries()]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1150 | <code>                .sort((left, right) =&gt; right[1] - left[1] &#124;&#124; left[0].localeCompare(right[0]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1151 | <code>                .slice(0, 16)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1152 | <code>                .map(([rgb, count]) =&gt; ({ rgb, count })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1153 | <code>            complete: sheet.completeness?.allRequestedCellsIncluded !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1154 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1156 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1157 | <code>        `ARTIFACT_COMPUTE_PROFILE artifactId=${record.id}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1158 | <code>        `kind=${record.kind} sheetsProfiled=${profiles.length}/${payload.workbook?.sheets?.length &#124;&#124; profiles.length}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1159 | <code>        ...profiles.map((profile) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1160 | <code>            `Sheet "${profile.sheet}": range=${profile.inspectedRange} rows=${profile.rows} cols=${profile.columns} nonEmpty=${profile.nonEmptyCells} formulas=${profile.formulas} merged=${profile.mergedRanges} fills=${profile.fillColors.map((fill) =&gt; `${fill.rgb}:${fill.count}`).join(', ') &#124;&#124; '-'} complete=${profile.complete}`</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 1161 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1162 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1163 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1164 | <code>    return createTextResult(lines.join('\n'), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1165 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1166 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1167 | <code>        action: 'profile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1168 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1169 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1170 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1171 | <code>        reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1172 | <code>        observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1173 | <code>            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1174 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1175 | <code>            reasoning_ready: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1176 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1177 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1178 | <code>        profiles</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1179 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1180 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1182 | <code>function buildSpreadsheetCellMatrix(sheet = {}, args = {}) {</code> | 定义函数 `buildSpreadsheetCellMatrix`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1183 | <code>    const rows = sheet.grids?.display &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1184 | <code>    const fills = sheet.grids?.fills &#124;&#124; [];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1185 | <code>    const rowNumbers = sheet.grids?.rowNumbers &#124;&#124; [];</code> | 声明局部标识符 `rowNumbers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1186 | <code>    const columns = sheet.grids?.columns &#124;&#124; [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1187 | <code>    const stored = getSpreadsheetStoredBounds(sheet);</code> | 声明局部标识符 `stored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1188 | <code>    const parsedRange = parseRange(args.range &#124;&#124; args.addressRange &#124;&#124; args.address_range &#124;&#124; '');</code> | 声明局部标识符 `parsedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1189 | <code>    const startRow = parsedRange ? Math.max(parsedRange.startRow, stored.firstRow) : stored.firstRow;</code> | 声明局部标识符 `startRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1190 | <code>    const endRow = parsedRange ? Math.min(parsedRange.endRow, stored.lastRow) : stored.lastRow;</code> | 声明局部标识符 `endRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1191 | <code>    const startCol = parsedRange ? Math.max(parsedRange.startCol, stored.firstCol) : stored.firstCol;</code> | 声明局部标识符 `startCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1192 | <code>    const endCol = parsedRange ? Math.min(parsedRange.endCol, stored.lastCol) : stored.lastCol;</code> | 声明局部标识符 `endCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1193 | <code>    const matrix = [];</code> | 声明局部标识符 `matrix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1194 | <code>    const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1195 | <code>    for (let row = startRow; row &lt;= endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1196 | <code>        const rowIndex = row - stored.firstRow;</code> | 声明局部标识符 `rowIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1197 | <code>        const matrixRow = [];</code> | 声明局部标识符 `matrixRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1198 | <code>        for (let col = startCol; col &lt;= endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1199 | <code>            const colIndex = col - stored.firstCol;</code> | 声明局部标识符 `colIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1200 | <code>            const fill = normalizeColor(fills[rowIndex]?.[colIndex] &#124;&#124; '');</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1201 | <code>            const display = normalizeString(rows[rowIndex]?.[colIndex]);</code> | 声明局部标识符 `display`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1202 | <code>            const cell = {</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1203 | <code>                row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1204 | <code>                col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1205 | <code>                address: cellAddress(row, col),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1206 | <code>                display,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1207 | <code>                fill</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1208 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1209 | <code>            matrixRow.push(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1210 | <code>            cells.push(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1211 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1212 | <code>        matrix.push(matrixRow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1213 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1214 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1215 | <code>        matrix,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1216 | <code>        cells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1217 | <code>        bounds: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1218 | <code>            startRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1219 | <code>            endRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1220 | <code>            startCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1221 | <code>            endCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1222 | <code>            range: rangeAddress({ startRow, endRow, startCol, endCol })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1223 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1224 | <code>        storedRange: rangeAddress({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1225 | <code>            startRow: stored.firstRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1226 | <code>            endRow: stored.lastRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1227 | <code>            startCol: stored.firstCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1228 | <code>            endCol: stored.lastCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1229 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1230 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1231 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1233 | <code>function buildEndpointCriteria(args = {}, prefix = 'start', defaults = []) {</code> | 定义函数 `buildEndpointCriteria`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1234 | <code>    const direct = normalizeString(args[prefix]);</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1235 | <code>    const address = normalizeString(args[`${prefix}Address`] &#124;&#124; args[`${prefix}_address`] &#124;&#124; args[`${prefix}CellAddress`] &#124;&#124; args[`${prefix}_cell_address`] &#124;&#124; (parseCell(direct) ? direct : ''));</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1236 | <code>    const query = normalizeString(</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1237 | <code>        args[`${prefix}Query`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1238 | <code>        args[`${prefix}_query`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1239 | <code>        args[`${prefix}Value`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1240 | <code>        args[`${prefix}_value`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1241 | <code>        args[`${prefix}Label`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1242 | <code>        args[`${prefix}_label`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1243 | <code>        args[`${prefix}Cell`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1244 | <code>        args[`${prefix}_cell`] &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1245 | <code>        (!parseCell(direct) ? direct : '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1246 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1247 | <code>    const fill = normalizeColor(args[`${prefix}Fill`] &#124;&#124; args[`${prefix}_fill`] &#124;&#124; args[`${prefix}Color`] &#124;&#124; args[`${prefix}_color`]);</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1248 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1249 | <code>        address: parseCell(address)?.address &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1250 | <code>        queries: query ? [query] : defaults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1251 | <code>        fill</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1252 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1253 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1255 | <code>function cellMatchesQuery(cell = {}, query = '') {</code> | 定义函数 `cellMatchesQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1256 | <code>    const needle = normalizeString(query).toLowerCase();</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1257 | <code>    if (!needle) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1258 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1259 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1260 | <code>    const haystack = [</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1261 | <code>        cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1262 | <code>        cell.display,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1263 | <code>        cell.fill</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1264 | <code>    ].join(' ').toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1265 | <code>    return haystack.includes(needle);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1266 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1268 | <code>function cellMatchesCriteria(cell = {}, criteria = {}) {</code> | 定义函数 `cellMatchesCriteria`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1269 | <code>    if (criteria.address &amp;&amp; normalizeString(cell.address).toUpperCase() === criteria.address.toUpperCase()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1270 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1271 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1272 | <code>    if (criteria.fill &amp;&amp; normalizeColor(cell.fill) === normalizeColor(criteria.fill)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1273 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1274 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1275 | <code>    return (criteria.queries &#124;&#124; []).some((query) =&gt; cellMatchesQuery(cell, query));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1276 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1278 | <code>function firstMatchingCell(cells = [], criteria = {}) {</code> | 定义函数 `firstMatchingCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1279 | <code>    return cells.find((cell) =&gt; cellMatchesCriteria(cell, criteria)) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1280 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1282 | <code>function listMatchesCell(cell = {}, values = [], fills = [], addresses = []) {</code> | 定义函数 `listMatchesCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1283 | <code>    const display = normalizeString(cell.display).toLowerCase();</code> | 声明局部标识符 `display`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1284 | <code>    const address = normalizeString(cell.address).toUpperCase();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1285 | <code>    const fill = normalizeColor(cell.fill);</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1286 | <code>    if (addresses.some((entry) =&gt; normalizeString(entry).toUpperCase() === address)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1287 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1288 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1289 | <code>    if (fills.some((entry) =&gt; normalizeColor(entry) &amp;&amp; normalizeColor(entry) === fill)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1290 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1291 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1292 | <code>    return values.some((entry) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1293 | <code>        const value = normalizeString(entry).toLowerCase();</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1294 | <code>        return value &amp;&amp; (display === value &#124;&#124; display.includes(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1295 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1296 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1298 | <code>function computeSpreadsheetPath(record = {}, payload = {}, args = {}) {</code> | 定义函数 `computeSpreadsheetPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1299 | <code>    args = mergeNestedArgs(args);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1300 | <code>    const movementRuleText = normalizeString(args.movementRule &#124;&#124; args.movement_rule &#124;&#124; args.moveRules &#124;&#124; args.move_rules &#124;&#124; args.rule &#124;&#124; args.rules);</code> | 声明局部标识符 `movementRuleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1301 | <code>    const sheet = sheetBySelection(payload, args);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1302 | <code>    if (!sheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1303 | <code>        return createErrorResult('sheet_not_found', 'artifact_compute find_path could not find the requested worksheet.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1304 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1305 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1306 | <code>            availableSheets: (payload.workbook?.sheets &#124;&#124; []).map((entry) =&gt; entry.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1307 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1308 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1309 | <code>    const { matrix, cells, bounds, storedRange } = buildSpreadsheetCellMatrix(sheet, args);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1310 | <code>    if (!cells.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1311 | <code>        return createErrorResult('empty_grid', 'artifact_compute find_path has no cells in the requested range.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1312 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1313 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1314 | <code>            sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1315 | <code>            range: args.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1316 | <code>            storedRange</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1317 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1318 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1319 | <code>    const startCriteria = buildEndpointCriteria(args, 'start', ['start']);</code> | 声明局部标识符 `startCriteria`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1320 | <code>    const endCriteria = buildEndpointCriteria(args, 'end', ['end', 'goal', 'finish', 'target']);</code> | 声明局部标识符 `endCriteria`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1321 | <code>    const startCell = firstMatchingCell(cells, startCriteria);</code> | 声明局部标识符 `startCell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1322 | <code>    const endCell = firstMatchingCell(cells, endCriteria);</code> | 声明局部标识符 `endCell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1323 | <code>    if (!startCell &#124;&#124; !endCell) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1324 | <code>        return createErrorResult(!startCell ? 'start_not_found' : 'end_not_found', 'artifact_compute find_path could not identify both endpoints. Pass startAddress/endAddress or startValue/endValue.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1325 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1326 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1327 | <code>            sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1328 | <code>            range: bounds.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1329 | <code>            startFound: Boolean(startCell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1330 | <code>            endFound: Boolean(endCell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1331 | <code>            endpointHints: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1332 | <code>                start: 'startAddress/startValue/startQuery/startFill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1333 | <code>                end: 'endAddress/endValue/endQuery/endFill'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1334 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1335 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1336 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1337 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1338 | <code>    const blockedValues = normalizeList(args.blockedValues &#124;&#124; args.blocked_values &#124;&#124; args.blocked &#124;&#124; args.walls);</code> | 声明局部标识符 `blockedValues`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1339 | <code>    const rawBlockedFills = [</code> | 声明局部标识符 `rawBlockedFills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1340 | <code>        ...normalizeList(args.blockedFills &#124;&#124; args.blocked_fills &#124;&#124; args.blockedColors &#124;&#124; args.blocked_colors &#124;&#124; args.avoidColor &#124;&#124; args.avoid_color &#124;&#124; args.forbiddenColor &#124;&#124; args.forbidden_color),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1341 | <code>        ...extractColorHintsFromRuleText(movementRuleText)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1342 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1343 | <code>    const blockedFills = expandColorNameList(rawBlockedFills, cells);</code> | 声明局部标识符 `blockedFills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1344 | <code>    const blockedCells = normalizeList(args.blockedCells &#124;&#124; args.blocked_cells);</code> | 声明局部标识符 `blockedCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1345 | <code>    const passableValues = normalizeList(args.passableValues &#124;&#124; args.passable_values &#124;&#124; args.passable);</code> | 声明局部标识符 `passableValues`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1346 | <code>    const passableFills = expandColorNameList(normalizeList(args.passableFills &#124;&#124; args.passable_fills &#124;&#124; args.passableColors &#124;&#124; args.passable_colors), cells);</code> | 声明局部标识符 `passableFills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1347 | <code>    const passableCells = normalizeList(args.passableCells &#124;&#124; args.passable_cells);</code> | 声明局部标识符 `passableCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1348 | <code>    const hasPassableFilter = Boolean(passableValues.length &#124;&#124; passableFills.length &#124;&#124; passableCells.length);</code> | 声明局部标识符 `hasPassableFilter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1349 | <code>    const endpointAddresses = new Set([startCell.address, endCell.address]);</code> | 声明局部标识符 `endpointAddresses`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1350 | <code>    const cellByAddress = new Map(cells.map((cell) =&gt; [cell.address, cell]));</code> | 声明局部标识符 `cellByAddress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1351 | <code>    const isPassable = (cell) =&gt; {</code> | 声明局部标识符 `isPassable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1352 | <code>        if (!cell) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1353 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1354 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1355 | <code>        if (endpointAddresses.has(cell.address)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1356 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1357 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1358 | <code>        if (listMatchesCell(cell, blockedValues, blockedFills, blockedCells)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1359 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1360 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1361 | <code>        if (!hasPassableFilter) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1362 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1364 | <code>        return listMatchesCell(cell, passableValues, passableFills, passableCells);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1365 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1366 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1367 | <code>    const diagonal = args.diagonal === true &#124;&#124; args.allowDiagonal === true &#124;&#124; args.allow_diagonal === true;</code> | 声明局部标识符 `diagonal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1368 | <code>    const directions = diagonal</code> | 声明局部标识符 `directions`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1369 | <code>        ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1370 | <code>        : [[1, 0], [-1, 0], [0, 1], [0, -1]];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1371 | <code>    const queue = [startCell.address];</code> | 声明局部标识符 `queue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1372 | <code>    const previous = new Map([[startCell.address, null]]);</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1373 | <code>    let visited = 0;</code> | 声明局部标识符 `visited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1374 | <code>    while (queue.length) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1375 | <code>        const currentAddress = queue.shift();</code> | 声明局部标识符 `currentAddress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1376 | <code>        const current = cellByAddress.get(currentAddress);</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1377 | <code>        visited += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1378 | <code>        if (currentAddress === endCell.address) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1379 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1380 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1381 | <code>        for (const [rowDelta, colDelta] of directions) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1382 | <code>            const nextAddress = cellAddress(current.row + rowDelta, current.col + colDelta);</code> | 声明局部标识符 `nextAddress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1383 | <code>            if (previous.has(nextAddress)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1384 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1385 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1386 | <code>            const next = cellByAddress.get(nextAddress);</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1387 | <code>            if (!isPassable(next)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1388 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1389 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1390 | <code>            previous.set(nextAddress, currentAddress);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1391 | <code>            queue.push(nextAddress);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1392 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1393 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1395 | <code>    const pathFound = previous.has(endCell.address);</code> | 声明局部标识符 `pathFound`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1396 | <code>    const pathCells = [];</code> | 声明局部标识符 `pathCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1397 | <code>    if (pathFound) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1398 | <code>        let cursor = endCell.address;</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1399 | <code>        while (cursor) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1400 | <code>            const cell = cellByAddress.get(cursor);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1401 | <code>            if (cell) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1402 | <code>                pathCells.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1403 | <code>                    address: cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1404 | <code>                    row: cell.row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1405 | <code>                    col: cell.col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1406 | <code>                    display: cell.display,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1407 | <code>                    fill: cell.fill</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1408 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1409 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1410 | <code>            cursor = previous.get(cursor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1411 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1412 | <code>        pathCells.reverse();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1413 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1414 | <code>    const maxPathCells = normalizeNumber(args.maxPathCells &#124;&#124; args.max_path_cells, 160, 1, 1000);</code> | 声明局部标识符 `maxPathCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1415 | <code>    const visiblePath = pathCells.slice(0, maxPathCells);</code> | 声明局部标识符 `visiblePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1416 | <code>    let stepSize = normalizeNumber(</code> | 声明局部标识符 `stepSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1417 | <code>        args.stepSize &#124;&#124; args.step_size &#124;&#124; args.stepsPerTurn &#124;&#124; args.steps_per_turn &#124;&#124; args.moveStep &#124;&#124; args.move_step &#124;&#124; args.moveDistancePerTurn &#124;&#124; args.move_distance_per_turn &#124;&#124; args.cellsPerTurn &#124;&#124; args.cells_per_turn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1418 | <code>        0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1419 | <code>        0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1420 | <code>        1000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1421 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1422 | <code>    if (!stepSize &amp;&amp; movementRuleText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1423 | <code>        stepSize = normalizeNumber(extractStepSizeFromRuleText(movementRuleText), 0, 0, 1000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1424 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1425 | <code>    const stepToExtract = normalizeNumber(</code> | 声明局部标识符 `stepToExtract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1426 | <code>        args.stepToExtract &#124;&#124; args.step_to_extract &#124;&#124; args.targetTurn &#124;&#124; args.target_turn &#124;&#124; args.targetTurnNumber &#124;&#124; args.target_turn_number &#124;&#124; args.turnNumber &#124;&#124; args.turn_number &#124;&#124; args.turn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1427 | <code>        0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1428 | <code>        0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1429 | <code>        100000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1430 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1431 | <code>    const explicitPathIndex = normalizeNumber(</code> | 声明局部标识符 `explicitPathIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1432 | <code>        args.pathIndex &#124;&#124; args.path_index &#124;&#124; args.stepIndex &#124;&#124; args.step_index &#124;&#124; args.moveIndex &#124;&#124; args.move_index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1433 | <code>        -1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1434 | <code>        -1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1435 | <code>        1000000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1436 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1437 | <code>    const extractionIndex = stepSize &gt; 0 &amp;&amp; stepToExtract &gt; 0</code> | 声明局部标识符 `extractionIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1438 | <code>        ? stepSize * stepToExtract</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1439 | <code>        : explicitPathIndex;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1440 | <code>    const extractedCell = pathFound &amp;&amp; extractionIndex &gt;= 0 &amp;&amp; extractionIndex &lt; pathCells.length</code> | 声明局部标识符 `extractedCell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1441 | <code>        ? pathCells[extractionIndex]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1442 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1443 | <code>    const extractField = normalizeString(args.extractField &#124;&#124; args.extract_field &#124;&#124; args.returnField &#124;&#124; args.return_field).toLowerCase();</code> | 声明局部标识符 `extractField`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1444 | <code>    const answerCandidate = extractedCell</code> | 声明局部标识符 `answerCandidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1445 | <code>        ? (/address/.test(extractField)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1446 | <code>            ? extractedCell.address</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1447 | <code>            : /value&#124;display/.test(extractField)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1448 | <code>                ? normalizeString(extractedCell.display)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1449 | <code>                : normalizeColor(extractedCell.fill))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1450 | <code>        : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1451 | <code>    const extraction = extractionIndex &gt;= 0 ? {</code> | 声明局部标识符 `extraction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1452 | <code>        requested: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1453 | <code>        stepSize,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1454 | <code>        stepToExtract,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1455 | <code>        pathIndex: extractionIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1456 | <code>        zeroBasedPathIndex: extractionIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1457 | <code>        oneBasedPathIndex: extractionIndex + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1458 | <code>        extractField: extractField &#124;&#124; 'cell_color_hex',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1459 | <code>        answerCandidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1460 | <code>        cell: extractedCell ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1461 | <code>            address: extractedCell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1462 | <code>            row: extractedCell.row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1463 | <code>            col: extractedCell.col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1464 | <code>            display: extractedCell.display,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1465 | <code>            fill: extractedCell.fill</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1466 | <code>        } : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1467 | <code>        inRange: Boolean(extractedCell)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1468 | <code>    } : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1469 | <code>    const lines = [</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1470 | <code>        `ARTIFACT_COMPUTE_FIND_PATH artifactId=${record.id} sheet=${JSON.stringify(sheet.name &#124;&#124; '')}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1471 | <code>        `range=${bounds.range} storedRange=${storedRange}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1472 | <code>        `start=${startCell.address} end=${endCell.address} diagonal=${diagonal}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1473 | <code>        `pathFound=${pathFound} steps=${pathFound ? Math.max(0, pathCells.length - 1) : 0} visited=${visited}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1474 | <code>        pathFound</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1475 | <code>            ? `path=${visiblePath.map((cell) =&gt; cell.address).join(' -&gt; ')}${pathCells.length &gt; visiblePath.length ? ` -&gt; ... (${pathCells.length - visiblePath.length} more)` : ''}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1476 | <code>            : 'path=(none)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1477 | <code>        extraction ? `turn_extraction=turn:${stepToExtract &#124;&#124; ''} stepSize:${stepSize &#124;&#124; ''} pathIndex:${extractionIndex} cell:${extractedCell?.address &#124;&#124; '(out_of_range)'} fill:${extractedCell?.fill &#124;&#124; ''} value:${extractedCell?.display &#124;&#124; ''}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1478 | <code>        extraction?.answerCandidate ? `answer_candidate=${extraction.answerCandidate}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1479 | <code>        pathCells.length &gt; visiblePath.length ? 'path_truncated=true; call artifact_compute with a larger maxPathCells or narrower range if the full path is needed.' : 'path_truncated=false',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1480 | <code>        'observation_contract=complete:true truncated:false reasoning_ready:true'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1481 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1482 | <code>    const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1483 | <code>        pathFound,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1484 | <code>        steps: pathFound ? Math.max(0, pathCells.length - 1) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1485 | <code>        visited,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1486 | <code>        start: startCell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1487 | <code>        end: endCell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1488 | <code>        range: bounds.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1489 | <code>        storedRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1490 | <code>        diagonal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1491 | <code>        path: visiblePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1492 | <code>        pathTruncated: pathCells.length &gt; visiblePath.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1493 | <code>        extraction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1494 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1495 | <code>    return createTextResult(lines.join('\n'), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1496 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1497 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1498 | <code>        action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1499 | <code>        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1500 | <code>        sheet: sheet.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1501 | <code>        range: bounds.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1502 | <code>        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1503 | <code>        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1504 | <code>        reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1505 | <code>        result</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1506 | <code>    }, result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1507 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1509 | <code>class AILISContextArtifactStore {</code> | 定义类 `AILISContextArtifactStore`，把相关状态与行为收拢为一个运行时对象。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1510 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1511 | <code>        this.rootDir = path.resolve(options.rootDir &#124;&#124; path.join(process.cwd(), 'tmp', 'context-artifacts'));</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1512 | <code>        this.payloadDir = path.join(this.rootDir, 'payloads');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1513 | <code>        this.indexPath = path.join(this.rootDir, 'index.json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1514 | <code>        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1515 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1516 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1517 | <code>    async readIndex() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1518 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1519 | <code>            const parsed = JSON.parse(await fsp.readFile(this.indexPath, 'utf8'));</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1520 | <code>            return Array.isArray(parsed.artifacts) ? parsed.artifacts : [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1521 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1522 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1523 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1524 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1525 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1526 | <code>    async writeIndex(artifacts = []) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1527 | <code>        await fsp.mkdir(this.rootDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1528 | <code>        const sorted = artifacts</code> | 声明局部标识符 `sorted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1529 | <code>            .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1530 | <code>            .sort((left, right) =&gt; Number(right.createdAt &#124;&#124; 0) - Number(left.createdAt &#124;&#124; 0))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1531 | <code>            .slice(0, 2000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1532 | <code>        await fsp.writeFile(this.indexPath, `${JSON.stringify({ version: 1, artifacts: sorted }, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1533 | <code>        return sorted;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1534 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1536 | <code>    async pinEvidence(record = {}, evidence = null) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1537 | <code>        if (!record?.id &#124;&#124; !evidence?.evidenceId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1538 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1539 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1540 | <code>        const artifacts = await this.readIndex();</code> | 声明局部标识符 `artifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1541 | <code>        let pinned = null;</code> | 声明局部标识符 `pinned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1542 | <code>        const next = artifacts.map((entry) =&gt; {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1543 | <code>            if (entry.id !== record.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1544 | <code>                return entry;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1545 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1546 | <code>            const metadata = entry.metadata &amp;&amp; typeof entry.metadata === 'object' ? entry.metadata : {};</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1547 | <code>            const existing = Array.isArray(metadata.pinnedEvidence) ? metadata.pinnedEvidence : [];</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1548 | <code>            const merged = [</code> | 声明局部标识符 `merged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1549 | <code>                evidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1550 | <code>                ...existing.filter((item) =&gt; item?.evidenceId !== evidence.evidenceId)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1551 | <code>            ].slice(0, 120);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1552 | <code>            pinned = evidence;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1553 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1554 | <code>                ...entry,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1555 | <code>                metadata: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1556 | <code>                    ...metadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1557 | <code>                    pinnedEvidence: merged</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1558 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1559 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1560 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1561 | <code>        if (!pinned) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1562 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1563 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1564 | <code>        await this.writeIndex(next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1565 | <code>        this.emitGatewayEvent('context_artifact.evidence_pinned', {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1566 | <code>            artifactId: evidence.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1567 | <code>            evidenceId: evidence.evidenceId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1568 | <code>            runId: record.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1569 | <code>            sessionId: record.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1570 | <code>            action: evidence.action,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1571 | <code>            sheet: evidence.sheet,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1572 | <code>            range: evidence.range,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1573 | <code>            complete: evidence.complete,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1574 | <code>            truncated: evidence.truncated,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1575 | <code>            reasoningReady: evidence.reasoningReady</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1576 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1577 | <code>        return pinned;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1578 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1580 | <code>    async attachPinnedEvidence(record = {}, result = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1581 | <code>        const details = result?.details &amp;&amp; typeof result.details === 'object' ? result.details : {};</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1582 | <code>        const evidence = createPinnedEvidence(record, details);</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1583 | <code>        const coveredByEvidence = findCoveringEvidence(record, details.coverage, evidence?.evidenceId &#124;&#124; '');</code> | 声明局部标识符 `coveredByEvidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1584 | <code>        if (coveredByEvidence) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1585 | <code>            result.details = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1586 | <code>                ...details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1587 | <code>                coveredByEvidence</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1588 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1589 | <code>            if (Array.isArray(result.content) &amp;&amp; result.content[0]?.type === 'text') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1590 | <code>                result.content[0].text = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1591 | <code>                    result.content[0].text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1592 | <code>                    `covered_by_pinned_evidence=${coveredByEvidence.evidenceId}; coveredRange=${coveredByEvidence.range}; complete=true; truncated=false; reasoning_ready=true`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1593 | <code>                ].filter(Boolean).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1594 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1595 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1596 | <code>        if (!evidence) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1597 | <code>            return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1598 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1599 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1600 | <code>            const pinned = await this.pinEvidence(record, evidence);</code> | 声明局部标识符 `pinned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1601 | <code>            if (pinned) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1602 | <code>                result.details = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1603 | <code>                    ...(result.details &#124;&#124; details),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1604 | <code>                    evidence: pinned,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1605 | <code>                    pinnedEvidenceId: pinned.evidenceId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1606 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1607 | <code>                if (result.structuredContent &amp;&amp; typeof result.structuredContent === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1608 | <code>                    result.structuredContent = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1609 | <code>                        ...result.structuredContent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1610 | <code>                        evidence: pinned</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1611 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1612 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1613 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1614 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1615 | <code>            result.details = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1616 | <code>                ...details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1617 | <code>                evidencePinError: error?.message &#124;&#124; String(error)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1618 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1619 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1620 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1621 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1622 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1623 | <code>    async createArtifact(input = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1624 | <code>        const kind = normalizeString(input.kind &#124;&#124; input.type, 'generic');</code> | 声明局部标识符 `kind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1625 | <code>        const sourceName = safeSegment(path.basename(normalizeString(input.sourcePath &#124;&#124; input.name, kind)), kind);</code> | 声明局部标识符 `sourceName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1626 | <code>        const id = `ctx-${safeSegment(kind)}-${Date.now()}-${randomUUID().slice(0, 8)}`;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1627 | <code>        const payloadPath = path.join(this.payloadDir, `${id}-${sourceName}.json`);</code> | 声明局部标识符 `payloadPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1628 | <code>        const rawPayload = cloneJson(input.payload &#124;&#124; {});</code> | 声明局部标识符 `rawPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1629 | <code>        const runtimeEnvelope = buildArtifactRuntimeEnvelope({</code> | 声明局部标识符 `runtimeEnvelope`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1630 | <code>            artifactId: id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1631 | <code>            kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1632 | <code>            type: normalizeString(input.type &#124;&#124; kind),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1633 | <code>            sourcePath: normalizeString(input.sourcePath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1634 | <code>            summary: normalizeString(input.summary),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1635 | <code>            payload: rawPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1636 | <code>            metadata: cloneJson(input.metadata &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1637 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>        const payload = rawPayload &amp;&amp; typeof rawPayload === 'object' &amp;&amp; !Array.isArray(rawPayload)</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1639 | <code>            ? { ...rawPayload, artifactRuntime: runtimeEnvelope.payload }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1640 | <code>            : { value: rawPayload, artifactRuntime: runtimeEnvelope.payload };</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1641 | <code>        await fsp.mkdir(this.payloadDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1642 | <code>        await fsp.writeFile(payloadPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1643 | <code>        const stat = await fsp.stat(payloadPath).catch(() =&gt; ({ size: 0 }));</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1644 | <code>        const metadata = {</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1645 | <code>            ...cloneJson(input.metadata &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1646 | <code>            artifactRuntime: runtimeEnvelope.metadata</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1647 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1648 | <code>        const modelView = {</code> | 声明局部标识符 `modelView`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1649 | <code>            ...cloneJson(input.modelView &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1650 | <code>            artifactRuntime: runtimeEnvelope.modelView</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1651 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1652 | <code>        const record = {</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1653 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1654 | <code>            kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1655 | <code>            type: normalizeString(input.type &#124;&#124; kind),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1656 | <code>            status: 'available',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1657 | <code>            createdAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1658 | <code>            iso: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1659 | <code>            tool: normalizeString(input.tool),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1660 | <code>            runId: normalizeString(input.runId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1661 | <code>            sessionId: normalizeString(input.sessionId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1662 | <code>            sourcePath: normalizeString(input.sourcePath) ? path.resolve(input.sourcePath) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1663 | <code>            payloadPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1664 | <code>            payloadBytes: stat.size &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1665 | <code>            summary: normalizeString(input.summary),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1666 | <code>            metadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1667 | <code>            modelView,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1668 | <code>            queryHints: uniqueStrings([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1669 | <code>                ...(Array.isArray(input.queryHints) ? input.queryHints.map(String) : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1670 | <code>                ...runtimeEnvelope.queryHints</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1671 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1672 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1673 | <code>        record.handle = buildContextArtifactHandle(record);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1674 | <code>        const prior = await this.readIndex();</code> | 声明局部标识符 `prior`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1675 | <code>        const next = [record, ...prior.filter((entry) =&gt; entry.id !== record.id &amp;&amp; path.resolve(entry.payloadPath &#124;&#124; '') !== path.resolve(payloadPath))];</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1676 | <code>        await this.writeIndex(next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1677 | <code>        this.emitGatewayEvent('context_artifact.created', {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1678 | <code>            artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1679 | <code>            runId: record.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1680 | <code>            sessionId: record.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1681 | <code>            kind: record.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1682 | <code>            type: record.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1683 | <code>            sourcePath: record.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1684 | <code>            payloadBytes: record.payloadBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1685 | <code>            summary: record.summary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1686 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1687 | <code>        return { ...record };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1688 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1690 | <code>    async getRecord(artifactId = '') {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1691 | <code>        const id = normalizeString(artifactId);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1692 | <code>        if (!id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1693 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1694 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1695 | <code>        const artifacts = await this.readIndex();</code> | 声明局部标识符 `artifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1696 | <code>        return artifacts.find((entry) =&gt; entry.id === id) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1697 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1699 | <code>    async getPayload(record = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1700 | <code>        if (!record?.payloadPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1701 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1702 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1703 | <code>        return JSON.parse(await fsp.readFile(record.payloadPath, 'utf8'));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1704 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1705 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1706 | <code>    async findByPath(targetPath = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1707 | <code>        const resolved = path.resolve(targetPath &#124;&#124; '');</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1708 | <code>        const comparable = process.platform === 'win32' ? resolved.toLowerCase() : resolved;</code> | 声明局部标识符 `comparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1709 | <code>        const artifacts = await this.readIndex();</code> | 声明局部标识符 `artifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1710 | <code>        return artifacts.find((entry) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1711 | <code>            const payloadPath = path.resolve(entry.payloadPath &#124;&#124; '');</code> | 声明局部标识符 `payloadPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1712 | <code>            const sourcePath = entry.sourcePath ? path.resolve(entry.sourcePath) : '';</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1713 | <code>            const payloadComparable = process.platform === 'win32' ? payloadPath.toLowerCase() : payloadPath;</code> | 声明局部标识符 `payloadComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1714 | <code>            const sourceComparable = process.platform === 'win32' ? sourcePath.toLowerCase() : sourcePath;</code> | 声明局部标识符 `sourceComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1715 | <code>            return comparable === payloadComparable &#124;&#124; (sourceComparable &amp;&amp; comparable === sourceComparable &amp;&amp; entry.kind !== 'plain_text');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1716 | <code>        }) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1717 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1718 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1719 | <code>    guardReadResult(record = {}, targetPath = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1720 | <code>        return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1721 | <code>            'context_artifact_raw_read_blocked',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1722 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1723 | <code>                'This file is a managed AILIS context artifact payload.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1724 | <code>                `artifactId=${record.id}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1725 | <code>                'Do not raw-read the payload into the model context.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1726 | <code>                'Use artifact_query with summary/search/range actions for the artifact kind: spreadsheet grid/range/search, text_range/text_search/text_tail, or document_search/document_page/document_section.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1727 | <code>            ].join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1728 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1729 | <code>                status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1730 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1731 | <code>                action: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1732 | <code>                path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1733 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1734 | <code>                artifactKind: record.kind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1735 | <code>                artifactType: record.type,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1736 | <code>                payloadBytes: record.payloadBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1737 | <code>                suggestedNext: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1738 | <code>                    tool: CONTEXT_ARTIFACT_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1739 | <code>                    args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1740 | <code>                        artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1741 | <code>                        action: 'summary'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1742 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1743 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1744 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1745 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1746 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1747 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1748 | <code>    schemaResult() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1749 | <code>        return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1750 | <code>            tool: CONTEXT_ARTIFACT_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1751 | <code>            purpose: 'Query managed AILIS context artifacts without dumping large payloads into the model context.',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1752 | <code>            actions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1753 | <code>                'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1754 | <code>                'list',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1755 | <code>                'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1756 | <code>                'grid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1757 | <code>                'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1758 | <code>                'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1759 | <code>                'runtime_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1760 | <code>                'chunk_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1761 | <code>                'runtime_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1762 | <code>                'text_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1763 | <code>                'text_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1764 | <code>                'text_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1765 | <code>                'text_tail',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1766 | <code>                'document_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1767 | <code>                'document_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1768 | <code>                'document_page',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1769 | <code>                'document_section'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1770 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1771 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1772 | <code>                artifactId: 'required for summary/grid/range/search/chunk_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1773 | <code>                action: 'schema&#124;list&#124;summary&#124;grid&#124;range&#124;search&#124;runtime_schema&#124;chunk_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1774 | <code>                sheet: 'optional sheet name for spreadsheet artifacts',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1775 | <code>                range: 'A1:D20 style range for spreadsheet range queries',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1776 | <code>                query: 'text/color/address query for search or chunk_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1777 | <code>                startLine: '1-based line start for text_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1778 | <code>                endLine: '1-based line end for text_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1779 | <code>                page: '1-based page for document_page'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1780 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1781 | <code>            observation_contract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1782 | <code>                complete: 'query-scoped completeness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1783 | <code>                truncated: 'true only when this query preview was bounded',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1784 | <code>                reasoning_ready: 'true when returned evidence is ready for final reasoning'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1785 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1786 | <code>        }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1787 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1788 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1789 | <code>            action: 'schema'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1790 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1791 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1792 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1793 | <code>    computeSchemaResult() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1794 | <code>        return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1795 | <code>            tool: CONTEXT_ARTIFACT_COMPUTE_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1796 | <code>            purpose: 'Run deterministic data-worker computations on managed artifacts and return compact evidence instead of raw payloads.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1797 | <code>            actions: ['schema', 'profile', 'spreadsheet_profile', 'find_path', 'spreadsheet_find_path'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1798 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1799 | <code>                artifactId: 'required for profile/find_path',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1800 | <code>                action: 'schema&#124;profile&#124;find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1801 | <code>                sheet: 'optional worksheet name for spreadsheet artifacts',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1802 | <code>                range: 'optional A1:D20 range limiting spreadsheet compute',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1803 | <code>                startAddress: 'optional path start cell, e.g. A1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1804 | <code>                endAddress: 'optional path end cell, e.g. I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1805 | <code>                startValue: 'optional start marker text; default searches for START',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1806 | <code>                endValue: 'optional end marker text; default searches for END/GOAL/FINISH/TARGET',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1807 | <code>                blockedValues: 'optional array/string of blocked display values',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1808 | <code>                blockedFills: 'optional array/string of blocked fill colors',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1809 | <code>                passableValues: 'optional array/string; when set, only matching cells plus endpoints are passable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1810 | <code>                passableFills: 'optional array/string; when set, only matching cells plus endpoints are passable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1811 | <code>                diagonal: 'true to allow diagonal movement'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1812 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1813 | <code>            observation_contract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1814 | <code>                complete: 'true when the requested compute was fully evaluated',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1815 | <code>                truncated: 'false for compute evidence; long paths may have pathTruncated while compute remains complete',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1816 | <code>                reasoning_ready: 'true when the compact compute result can be used for answer reasoning'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1817 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1818 | <code>        }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1819 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1820 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1821 | <code>            action: 'schema'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1822 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1823 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1825 | <code>    async execute(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1826 | <code>        const action = normalizeString(args.action &#124;&#124; args.operation &#124;&#124; args.intent, 'summary').toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1827 | <code>        if (action === 'schema' &#124;&#124; action === 'help') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1828 | <code>            return this.schemaResult();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1829 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1830 | <code>        if (action === 'list') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1831 | <code>            const limit = normalizeNumber(args.limit, 20, 1, 200);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1832 | <code>            const artifacts = (await this.readIndex()).slice(0, limit).map((entry) =&gt; ({</code> | 声明局部标识符 `artifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1833 | <code>                id: entry.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1834 | <code>                kind: entry.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1835 | <code>                type: entry.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1836 | <code>                sourcePath: entry.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1837 | <code>                createdAt: entry.createdAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1838 | <code>                summary: entry.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1839 | <code>                payloadBytes: entry.payloadBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1840 | <code>                queryHints: entry.queryHints,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1841 | <code>                artifactHandle: entry.handle &#124;&#124; buildContextArtifactHandle(entry)</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1842 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1843 | <code>            return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1844 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1845 | <code>                artifacts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1846 | <code>                note: 'Use artifact_query with artifactId for summary/grid/range/search or runtime_schema/chunk_search.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1847 | <code>            }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1848 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1849 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1850 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1851 | <code>                artifacts</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1852 | <code>            }, { artifacts });</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1853 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1855 | <code>        const handle = args.artifactHandle &#124;&#124; args.artifact_handle &#124;&#124; args.handle;</code> | 声明局部标识符 `handle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1856 | <code>        const handleOwner = handle &amp;&amp; typeof handle === 'object'</code> | 声明局部标识符 `handleOwner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1857 | <code>            ? normalizeString(handle.owner &#124;&#124; handle.tool)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1858 | <code>            : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1859 | <code>        if (handleOwner &amp;&amp; !['context_artifact_store', CONTEXT_ARTIFACT_TOOL_ID].includes(handleOwner)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1860 | <code>            return createErrorResult('artifact_owner_mismatch', `Artifact handle belongs to ${handleOwner}, not artifact_query.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1861 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1862 | <code>                artifactHandle: handle,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1863 | <code>                requiredTool: handle.tool &#124;&#124; 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1864 | <code>                recoveryHint: 'Use the tool named by artifactHandle.tool with the same handle.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1865 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1866 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1867 | <code>        const artifactId = normalizeString(</code> | 声明局部标识符 `artifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1868 | <code>            args.artifactId &#124;&#124; args.artifact_id &#124;&#124; args.id &#124;&#124; handle?.artifactId &#124;&#124; handle?.artifact_id</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1869 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1870 | <code>        if (!artifactId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1871 | <code>            return createErrorResult('missing_artifact_id', 'artifact_query requires artifactId/id for this action.', { action });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1872 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1873 | <code>        if (/^art_/i.test(artifactId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1874 | <code>            return createErrorResult('artifact_owner_mismatch', `${artifactId} is an artifact_tools id, not a managed context artifact id.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1875 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1876 | <code>                artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1877 | <code>                requiredTool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1878 | <code>                recoveryHint: 'Continue with artifact_tools and the sessionId returned by open_session.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1879 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1880 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1881 | <code>        const record = await this.getRecord(artifactId);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1882 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1883 | <code>            if (/^artifact-[a-f0-9]{8,}$/i.test(artifactId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1884 | <code>                return createErrorResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1885 | <code>                    'artifact_not_found',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1886 | <code>                    `No managed context artifact found for ${artifactId}. This looks like an evidence_ref from evidence_artifacts, not a queryable context artifactId.`,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1887 | <code>                    {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1888 | <code>                        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1889 | <code>                        artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1890 | <code>                        evidenceRefMisuse: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1891 | <code>                        recoveryHint: 'Use evidence_ref ids only in final_answer.evidence_refs. For more document/table content, use the prior tool observation text, rerun the parser, or call artifact_query only with a context artifact id returned as details.artifactId/contextArtifact.id.'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1892 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1893 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1894 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1895 | <code>            return createErrorResult('artifact_not_found', `No managed context artifact found for ${artifactId}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1896 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1897 | <code>                artifactId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1898 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1899 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1900 | <code>        const payload = await this.getPayload(record).catch((error) =&gt; ({ __payloadReadError: error?.message &#124;&#124; String(error) }));</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1901 | <code>        if (payload?.__payloadReadError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1902 | <code>            return createErrorResult('artifact_payload_read_failed', payload.__payloadReadError, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1903 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1904 | <code>                artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1905 | <code>                payloadPath: record.payloadPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1906 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1907 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1909 | <code>        if (action === 'runtime_schema' &#124;&#124; action === 'artifact_runtime_schema') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1910 | <code>            const schema = buildArtifactRuntimeSchema(record, payload);</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1911 | <code>            return createTextResult(JSON.stringify(schema, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1912 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1913 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1914 | <code>                action: 'runtime_schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1915 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1916 | <code>                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1917 | <code>                truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1918 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1919 | <code>            }, schema);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1920 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1921 | <code>        if (action === 'chunk_search' &#124;&#124; action === 'runtime_search' &#124;&#124; action === 'hybrid_search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1922 | <code>            const searchResult = searchArtifactRuntime(payload, args, record);</code> | 声明局部标识符 `searchResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1923 | <code>            return createTextResult(formatArtifactRuntimeSearch(record, searchResult), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1924 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1925 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1926 | <code>                action: 'chunk_search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1927 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1928 | <code>                query: searchResult.query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1929 | <code>                matchCount: searchResult.matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1930 | <code>                totalMatches: searchResult.total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1931 | <code>                truncated: searchResult.truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1932 | <code>                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1933 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1934 | <code>            }, searchResult);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1935 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1937 | <code>        if (record.kind === 'spreadsheet' &#124;&#124; payload?.workbook?.sheets) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1938 | <code>            return this.executeSpreadsheetQuery(record, payload, { ...args, action, artifactId });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1939 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1940 | <code>        if (record.kind === 'text' &#124;&#124; payload?.textArtifact &#124;&#124; payload?.text_artifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1941 | <code>            return this.executeTextQuery(record, payload, { ...args, action, artifactId });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1942 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1943 | <code>        if (record.kind === 'document' &#124;&#124; payload?.documentArtifact &#124;&#124; payload?.document_artifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1944 | <code>            return this.executeDocumentQuery(record, payload, { ...args, action, artifactId });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1945 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1946 | <code>        return this.executeGenericQuery(record, payload, { ...args, action, artifactId });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1947 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1948 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1949 | <code>    async compute(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1950 | <code>        const action = normalizeString(args.action &#124;&#124; args.operation &#124;&#124; args.intent, 'profile').toLowerCase().replace(/[-\s]+/g, '_');</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1951 | <code>        if (action === 'schema' &#124;&#124; action === 'help') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1952 | <code>            return this.computeSchemaResult();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1953 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1954 | <code>        const artifactId = normalizeString(args.artifactId &#124;&#124; args.artifact_id &#124;&#124; args.id);</code> | 声明局部标识符 `artifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1955 | <code>        if (!artifactId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1956 | <code>            return createErrorResult('missing_artifact_id', 'artifact_compute requires artifactId/id for this action.', { action });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1957 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1958 | <code>        const record = await this.getRecord(artifactId);</code> | 声明局部标识符 `record`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1959 | <code>        if (!record) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1960 | <code>            return createErrorResult('artifact_not_found', `No managed context artifact found for ${artifactId}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1961 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1962 | <code>                artifactId</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1963 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1964 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1965 | <code>        const payload = await this.getPayload(record).catch((error) =&gt; ({ __payloadReadError: error?.message &#124;&#124; String(error) }));</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1966 | <code>        if (payload?.__payloadReadError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1967 | <code>            return createErrorResult('artifact_payload_read_failed', payload.__payloadReadError, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1968 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1969 | <code>                artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1970 | <code>                payloadPath: record.payloadPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1971 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1972 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1973 | <code>        if (record.kind === 'spreadsheet' &#124;&#124; payload?.workbook?.sheets) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1974 | <code>            return this.computeSpreadsheet(record, payload, { ...args, action, artifactId });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1975 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1976 | <code>        return createErrorResult('unsupported_artifact_kind', `artifact_compute does not support ${record.kind &#124;&#124; 'this artifact kind'} yet.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1977 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1978 | <code>            artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1979 | <code>            artifactKind: record.kind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1980 | <code>            supportedKinds: ['spreadsheet']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1981 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1982 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1983 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1984 | <code>    computeSpreadsheet(record = {}, payload = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1985 | <code>        const action = args.action;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1986 | <code>        if (action === 'profile' &#124;&#124; action === 'spreadsheet_profile' &#124;&#124; action === 'describe') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1987 | <code>            return profileSpreadsheetArtifact(record, payload, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1988 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1989 | <code>        if (action === 'find_path' &#124;&#124; action === 'spreadsheet_find_path' &#124;&#124; action === 'path') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1990 | <code>            return computeSpreadsheetPath(record, payload, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1991 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1992 | <code>        return createErrorResult('unsupported_action', `Unsupported artifact_compute action for spreadsheet: ${action}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1993 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1994 | <code>            supportedActions: ['schema', 'profile', 'find_path']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1995 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1996 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1997 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1998 | <code>    executeTextQuery(record = {}, payload = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1999 | <code>        const action = args.action;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2000 | <code>        const textArtifact = getTextArtifactPayload(payload);</code> | 声明局部标识符 `textArtifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2001 | <code>        if (!textArtifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2002 | <code>            return createErrorResult('invalid_text_artifact', 'Managed text artifact payload is missing textArtifact.text.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2003 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2004 | <code>                artifactId: record.id</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2005 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2006 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2007 | <code>        if (action === 'summary' &#124;&#124; action === 'get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2008 | <code>            const raw = formatTextArtifactSummary(record, textArtifact);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2009 | <code>            const preview = truncateText(raw, normalizeNumber(args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2010 | <code>            return createTextResult(preview.text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2011 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2012 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2013 | <code>                action: 'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2014 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2015 | <code>                truncated: preview.truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2016 | <code>                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2017 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2018 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2019 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2020 | <code>        if (action === 'text_schema') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2021 | <code>            return textSchemaResult(record, textArtifact);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2022 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2023 | <code>        if (action === 'text_range' &#124;&#124; action === 'range') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2024 | <code>            return textRangeResult(record, textArtifact, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2025 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2026 | <code>        if (action === 'text_search' &#124;&#124; action === 'search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2027 | <code>            return searchTextLines({ record, text: textArtifact.text &#124;&#124; '', args, action: 'text_search' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2028 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2029 | <code>        if (action === 'text_tail' &#124;&#124; action === 'tail') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2030 | <code>            return textTailResult(record, textArtifact, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2031 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2032 | <code>        return createErrorResult('unsupported_action', `Unsupported text artifact_query action: ${action}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2033 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2034 | <code>            supportedActions: ['schema', 'list', 'summary', 'runtime_schema', 'chunk_search', 'text_schema', 'text_range', 'text_search', 'text_tail']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2035 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2036 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2037 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2038 | <code>    executeDocumentQuery(record = {}, payload = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2039 | <code>        const action = args.action;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2040 | <code>        const documentArtifact = getDocumentArtifactPayload(payload);</code> | 声明局部标识符 `documentArtifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2041 | <code>        if (!documentArtifact) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2042 | <code>            return createErrorResult('invalid_document_artifact', 'Managed document artifact payload is missing documentArtifact.text.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2043 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2044 | <code>                artifactId: record.id</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2045 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2046 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2047 | <code>        if (action === 'summary' &#124;&#124; action === 'get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2048 | <code>            const raw = formatDocumentArtifactSummary(record, documentArtifact);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2049 | <code>            const preview = truncateText(raw, normalizeNumber(args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2050 | <code>            return createTextResult(preview.text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2051 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2052 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2053 | <code>                action: 'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2054 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2055 | <code>                truncated: preview.truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2056 | <code>                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2057 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2058 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2059 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2060 | <code>        if (action === 'document_schema') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2061 | <code>            return documentSchemaResult(record, documentArtifact);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2062 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2063 | <code>        if (action === 'document_search' &#124;&#124; action === 'search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2064 | <code>            return documentSearchResult(record, documentArtifact, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2065 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2066 | <code>        if (action === 'document_page' &#124;&#124; action === 'page') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2067 | <code>            return documentPageResult(record, documentArtifact, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2068 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2069 | <code>        if (action === 'document_section' &#124;&#124; action === 'section') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2070 | <code>            return documentSectionResult(record, documentArtifact, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2071 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2072 | <code>        return createErrorResult('unsupported_action', `Unsupported document artifact_query action: ${action}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2073 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2074 | <code>            supportedActions: ['schema', 'list', 'summary', 'runtime_schema', 'chunk_search', 'document_schema', 'document_search', 'document_page', 'document_section']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2075 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2076 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2077 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2078 | <code>    async executeSpreadsheetQuery(record = {}, payload = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2079 | <code>        const action = args.action;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2080 | <code>        if (action === 'summary' &#124;&#124; action === 'get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2081 | <code>            const raw = formatSpreadsheetSummary(record, payload);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2082 | <code>            const preview = truncateText(raw, normalizeNumber(args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2083 | <code>            return createTextResult(preview.text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2084 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2085 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2086 | <code>                action: 'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2087 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2088 | <code>                artifactKind: record.kind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2089 | <code>                truncated: preview.truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2090 | <code>                originalTextChars: preview.originalChars,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2091 | <code>                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2092 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2093 | <code>            }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2094 | <code>                artifact: record,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2095 | <code>                workbook: payload.workbook,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2096 | <code>                truncated: preview.truncated</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2097 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2098 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2099 | <code>        const sheet = sheetBySelection(payload, args);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2100 | <code>        if (!sheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2101 | <code>            return createErrorResult('sheet_not_found', 'No matching worksheet found in artifact.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2102 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2103 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2104 | <code>                availableSheets: (payload.workbook?.sheets &#124;&#124; []).map((entry) =&gt; entry.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2105 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2106 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2107 | <code>        if (action === 'grid') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2108 | <code>            const raw = formatSpreadsheetGrid(sheet, args);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2109 | <code>            const preview = truncateText(raw, normalizeNumber(args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2110 | <code>            const coverage = buildSpreadsheetGridCoverage(sheet, args);</code> | 声明局部标识符 `coverage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2111 | <code>            const truncated = preview.truncated &#124;&#124; coverage.truncated &#124;&#124; /truncated=true/.test(raw);</code> | 声明局部标识符 `truncated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2112 | <code>            return this.attachPinnedEvidence(record, createTextResult(preview.text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2113 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2114 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2115 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2116 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2117 | <code>                sheet: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2118 | <code>                coverage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2119 | <code>                truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2120 | <code>                complete: !truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2121 | <code>                reasoningReady: !truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2122 | <code>                observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2123 | <code>                    complete: !truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2124 | <code>                    truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2125 | <code>                    reasoning_ready: !truncated</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2126 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2127 | <code>            }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2128 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2129 | <code>        if (action === 'range') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2130 | <code>            return this.attachPinnedEvidence(record, formatSpreadsheetRange(sheet, args));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2131 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2132 | <code>        if (action === 'search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2133 | <code>            return searchSpreadsheet(payload, args);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2134 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2135 | <code>        return createErrorResult('unsupported_action', `Unsupported spreadsheet artifact_query action: ${action}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2136 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2137 | <code>            supportedActions: ['schema', 'list', 'summary', 'runtime_schema', 'chunk_search', 'grid', 'range', 'search']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2138 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2139 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2141 | <code>    executeGenericQuery(record = {}, payload = {}, args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2142 | <code>        const action = args.action;</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2143 | <code>        if (action === 'summary' &#124;&#124; action === 'get') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2144 | <code>            const raw = JSON.stringify({</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2145 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2146 | <code>                kind: record.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2147 | <code>                type: record.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2148 | <code>                sourcePath: record.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2149 | <code>                summary: record.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2150 | <code>                metadata: record.metadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2151 | <code>                modelView: record.modelView,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2152 | <code>                queryHints: record.queryHints,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2153 | <code>                observation_contract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2154 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2155 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2156 | <code>                    reasoning_ready: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2157 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2158 | <code>            }, null, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2159 | <code>            const preview = truncateText(raw, normalizeNumber(args.maxChars &#124;&#124; args.max_chars, DEFAULT_MAX_TEXT_CHARS, 1000, 30000));</code> | 声明局部标识符 `preview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2160 | <code>            return createTextResult(preview.text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2161 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2162 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2163 | <code>                action: 'summary',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2164 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2165 | <code>                truncated: preview.truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2166 | <code>                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2167 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2168 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2169 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2170 | <code>        if (action === 'search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2171 | <code>            const query = normalizeString(args.query &#124;&#124; args.q &#124;&#124; args.text).toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2172 | <code>            if (!query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2173 | <code>                return createErrorResult('missing_query', 'artifact_query search requires query/q/text.', { action, artifactId: record.id });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2174 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2175 | <code>            const text = JSON.stringify(payload, null, 2);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2176 | <code>            const lines = text.split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2177 | <code>            const limit = normalizeNumber(args.limit, 40, 1, 500);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2178 | <code>            const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2179 | <code>            for (let index = 0; index &lt; lines.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2180 | <code>                if (lines[index].toLowerCase().includes(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2181 | <code>                    matches.push({ line: index + 1, text: lines[index].slice(0, 1000) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2182 | <code>                    if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2183 | <code>                        break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2184 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2185 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2186 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2187 | <code>            return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2188 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2189 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2190 | <code>                query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2191 | <code>                matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2192 | <code>                matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2193 | <code>                truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2194 | <code>                reasoning_ready: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2195 | <code>            }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2196 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2197 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2198 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2199 | <code>                artifactId: record.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2200 | <code>                matchCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2201 | <code>                matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2202 | <code>                truncated: matches.length &gt;= limit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2203 | <code>                reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2204 | <code>            }, { matches });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2205 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2206 | <code>        return createErrorResult('unsupported_action', `Unsupported artifact_query action for ${record.kind}: ${action}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2207 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2208 | <code>            supportedActions: ['schema', 'list', 'summary', 'runtime_schema', 'chunk_search', 'search']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2209 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2210 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2211 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2213 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2214 | <code>    CONTEXT_ARTIFACT_COMPUTE_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2215 | <code>    CONTEXT_ARTIFACT_TOOL_ID,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2216 | <code>    AILISContextArtifactStore</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2217 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
