# electron/ailis-artifact-tools-adapters.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`source-code`
- 原始行数：4896
- SHA-256：`487abe0f9e3e84a81f2ecf987975a08ff02895e4c0856896a30e428b798d96bd`
- 可运行副本：[打开源文件](../../../source/electron/ailis-artifact-tools-adapters.cjs)
- 依赖：`fs`、`fs/promises`、`path`、`crypto`、`child_process`、`util`、`exceljs`、`./ailis-artifact-tools-model.cjs`、`./ailis-artifact-tools-file-adapters.cjs`、`json`、`math`、`sys`、`pathlib`、`openpyxl`、`openpyxl.utils`、`openpyxl.utils.cell`、`PIL`
- 主要符号：`fs`、`fsp`、`path`、`crypto`、`ExcelJS`、`execFileAsync`、`IMPLEMENTED_ADAPTER_IDS`、`XLSX_INDEX_CACHE`、`XLSX_RENDER_CACHE_VERSION`、`getFileSignature`、`stat`、`buildCacheKey`、`toAbsolutePath`、`toPortablePath`、`absolute`、`normalizeHex`、`raw`、`colName`、`current`、`name`、`mod`、`cellRef`、`parseCellRef`、`match`、`col`、`parseRangeRef`、`start`、`end`、`boundsToRangeRef`、`boundsEqual`、`boundsContain`、`parseWorkbookTarget`、`sheetName`、`rangeRef`、`quote`、`index`、`char`、`normalizeSheetName`、`quoteSheetName`、`normalizeZipPath`、`parts`、`resolveZipTarget`、`baseDir`、`normalizeInclude`、`includeHasCellLevelRequest`、`normalizeXlsxInspectKind`、`explicit`、`target`、`include`、`clampNumber`、`number`、`clonePlain`、`sha256File`、`hash`、`escapeXml`、`decodeXmlText`、`createDiagnostic`、`getCellFillRgb`、`fill`、`color`、`getCellValue`、`getFormulaResult`、`getPrimitiveText`、`noteToText`、`normalizeColor`、`summarizeBorder`、`result`、`summarizeStyle`、`style`、`getCellErrorCode`、`value`、`text`、`inspectCell`、`formulaResult`、`errorCode`、`fillRgb`、`buildFillHistogram`、`histogram`、`getWorksheetUsedBounds`、`maxRow`、`maxCol`、`bounds`、`summarizeTables`、`tables`、`collectHiddenRows`、`hidden`、`rowNumber`、`row`、`collectHiddenColumns`、`colNumber`、`summarizeDataValidations`、`model`、`summarizeConditionalFormattings`、`summarizeDefinedNames`、`normalizeDefinedNameKey`、`buildDefinedNameMap`、`map`、`key`、`parseXmlAttributes`、`attrs`、`regex`、`parseRelationshipEntries`、`relationships`、`countXmlTags`、`escaped`、`parseFirstXmlElementAttrs`、`parseDrawingAnchors`、`anchors`、`anchorRegex`、`anchorMatch`、`body`、`from`、`to`、`getNumber`、`fromCol`、`fromRow`、`toCol`、`toRow`、`embedId`、`chartId`、`relId`、`relationship`、`anchor`、`groupRelationshipsByPart`、`grouped`、`buildXlsxPackageInventory`、`names`、`entries`、`drawings`、`charts`、`images`、`tableParts`、`comments`、`externalLinks`、`macros`、`relsByPart`、`tableByPart`、`tableAssignments`、`drawingAssignments`、`sheetRelMatch`、`sheetIndex`、`resolvedTarget`、`drawingDetails`、`xml`、`relPart`、`relsById`、`imageAnchors`、`collectSheetCells`、`used`、`targetBounds`、`maxRows`、`maxCols`、`startRow`、`startCol`、`endRow`、`endCol`、`cells`、`originalRows`、`originalCols`、`cell`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4 | <code>const crypto = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 5 | <code>const { execFile } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 6 | <code>const { promisify } = require('util');</code> | 导入依赖 `util`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 7 | <code>const ExcelJS = require('exceljs');</code> | 导入依赖 `exceljs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 10 | <code>    createArtifactDiagnostic,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 11 | <code>    normalizeFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 12 | <code>} = require('./ailis-artifact-tools-model.cjs');</code> | 导入依赖 `./ailis-artifact-tools-model.cjs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 14 | <code>    FILE_ADAPTER_FORMATS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 15 | <code>    indexFileArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 16 | <code>    inspectFileArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 17 | <code>    renderFileArtifactPreview,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 18 | <code>    searchFileArtifact</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 19 | <code>} = require('./ailis-artifact-tools-file-adapters.cjs');</code> | 导入依赖 `./ailis-artifact-tools-file-adapters.cjs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>const execFileAsync = promisify(execFile);</code> | 声明局部标识符 `execFileAsync`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>const IMPLEMENTED_ADAPTER_IDS = Object.freeze(['xlsx', 'pdf', 'docx', 'pptx', 'csv', 'image']);</code> | 声明局部标识符 `IMPLEMENTED_ADAPTER_IDS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 24 | <code>const XLSX_INDEX_CACHE = new Map();</code> | 声明局部标识符 `XLSX_INDEX_CACHE`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 25 | <code>const XLSX_RENDER_CACHE_VERSION = 'xlsx-render-cache-v1';</code> | 声明局部标识符 `XLSX_RENDER_CACHE_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>async function getFileSignature(sourcePath) {</code> | 定义函数 `getFileSignature`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 28 | <code>    const stat = await fsp.stat(sourcePath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 29 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 30 | <code>        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 31 | <code>        mtimeMs: Math.round(stat.mtimeMs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 32 | <code>        ctimeMs: Math.round(stat.ctimeMs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 33 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>function buildCacheKey(parts = []) {</code> | 定义函数 `buildCacheKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 37 | <code>    return crypto</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 38 | <code>        .createHash('sha256')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 39 | <code>        .update(parts.map((entry) =&gt; String(entry ?? '')).join('\n'))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 40 | <code>        .digest('hex');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 41 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>function toAbsolutePath(sourcePath = '', repoRoot = process.cwd()) {</code> | 定义函数 `toAbsolutePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 44 | <code>    if (!sourcePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 45 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 46 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>    return path.isAbsolute(sourcePath) ? sourcePath : path.resolve(repoRoot, sourcePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>function toPortablePath(sourcePath = '', repoRoot = process.cwd()) {</code> | 定义函数 `toPortablePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 51 | <code>    const absolute = toAbsolutePath(sourcePath, repoRoot);</code> | 声明局部标识符 `absolute`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 52 | <code>    return path.relative(repoRoot, absolute).replace(/\\/g, '/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function normalizeHex(value = '') {</code> | 定义函数 `normalizeHex`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 56 | <code>    const raw = String(value &#124;&#124; '').replace(/^#/, '').trim().toUpperCase();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 57 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 58 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 59 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>    if (raw.length === 8 &amp;&amp; raw.startsWith('FF')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 61 | <code>        return raw.slice(2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 62 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>    if (raw.length === 6) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 64 | <code>        return raw;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    return raw.slice(-6);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 69 | <code>function colName(col) {</code> | 定义函数 `colName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 70 | <code>    let current = Number(col);</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 71 | <code>    let name = '';</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 72 | <code>    while (current &gt; 0) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 73 | <code>        const mod = (current - 1) % 26;</code> | 声明局部标识符 `mod`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 74 | <code>        name = String.fromCharCode(65 + mod) + name;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 75 | <code>        current = Math.floor((current - mod) / 26);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 76 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    return name;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>function cellRef(row, col) {</code> | 定义函数 `cellRef`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 81 | <code>    return `${colName(col)}${row}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 82 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>function parseCellRef(ref = '') {</code> | 定义函数 `parseCellRef`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 85 | <code>    const match = /^([A-Z]+)(\d+)$/i.exec(ref);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 86 | <code>    if (!match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 87 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    let col = 0;</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 90 | <code>    for (const char of match[1].toUpperCase()) {</code> | 声明局部标识符 `char`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 91 | <code>        col = col * 26 + (char.charCodeAt(0) - 64);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 92 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>    return { row: Number(match[2]), col };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 94 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>function parseRangeRef(ref = '') {</code> | 定义函数 `parseRangeRef`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 97 | <code>    const raw = String(ref &#124;&#124; '').replace(/\$/g, '').trim();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 98 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 99 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 100 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>    const [startRaw, endRaw = startRaw] = raw.split(':');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 102 | <code>    const start = parseCellRef(startRaw);</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 103 | <code>    const end = parseCellRef(endRaw);</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 104 | <code>    if (!start &#124;&#124; !end) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 105 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 106 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 108 | <code>        startRow: Math.min(start.row, end.row),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 109 | <code>        startCol: Math.min(start.col, end.col),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 110 | <code>        endRow: Math.max(start.row, end.row),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 111 | <code>        endCol: Math.max(start.col, end.col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 112 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>function boundsToRangeRef(bounds = {}) {</code> | 定义函数 `boundsToRangeRef`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 116 | <code>    if (!bounds &#124;&#124; !bounds.startRow &#124;&#124; !bounds.startCol &#124;&#124; !bounds.endRow &#124;&#124; !bounds.endCol) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 117 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 118 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>    return `${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(bounds.endRow, bounds.endCol)}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 120 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>function boundsEqual(left = {}, right = {}) {</code> | 定义函数 `boundsEqual`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 123 | <code>    return Boolean(left &amp;&amp; right</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 124 | <code>        &amp;&amp; left.startRow === right.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 125 | <code>        &amp;&amp; left.startCol === right.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 126 | <code>        &amp;&amp; left.endRow === right.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 127 | <code>        &amp;&amp; left.endCol === right.endCol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 128 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>function boundsContain(outer = {}, inner = {}) {</code> | 定义函数 `boundsContain`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 131 | <code>    return Boolean(outer &amp;&amp; inner</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 132 | <code>        &amp;&amp; outer.startRow &lt;= inner.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 133 | <code>        &amp;&amp; outer.startCol &lt;= inner.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 134 | <code>        &amp;&amp; outer.endRow &gt;= inner.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 135 | <code>        &amp;&amp; outer.endCol &gt;= inner.endCol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 136 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>function parseWorkbookTarget(target = '', fallbackSheetName = '') {</code> | 定义函数 `parseWorkbookTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 139 | <code>    const raw = String(target &#124;&#124; '').trim();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 140 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 141 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 142 | <code>            sheetName: fallbackSheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 143 | <code>            rangeRef: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 144 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>    let sheetName = fallbackSheetName;</code> | 声明局部标识符 `sheetName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 147 | <code>    let rangeRef = raw;</code> | 声明局部标识符 `rangeRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 148 | <code>    let quote = false;</code> | 声明局部标识符 `quote`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 149 | <code>    for (let index = 0; index &lt; raw.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 150 | <code>        const char = raw[index];</code> | 声明局部标识符 `char`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 151 | <code>        if (char === "'") {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 152 | <code>            quote = !quote;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 153 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>        if (char === '!' &amp;&amp; !quote) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 155 | <code>            sheetName = raw.slice(0, index).replace(/^'&#124;'$/g, '').replace(/''/g, "'");</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 156 | <code>            rangeRef = raw.slice(index + 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 157 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 158 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    return { sheetName, rangeRef };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 161 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>function normalizeSheetName(value = '') {</code> | 定义函数 `normalizeSheetName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 164 | <code>    return String(value &#124;&#124; '').replace(/^'&#124;'$/g, '').replace(/''/g, "'");</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>function quoteSheetName(sheetName = '') {</code> | 定义函数 `quoteSheetName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 168 | <code>    const raw = String(sheetName &#124;&#124; '');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 169 | <code>    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(raw) ? raw : `'${raw.replace(/'/g, "''")}'`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 170 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>function normalizeZipPath(value = '') {</code> | 定义函数 `normalizeZipPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 173 | <code>    const parts = [];</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 174 | <code>    for (const part of String(value &#124;&#124; '').replace(/\\/g, '/').split('/')) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 175 | <code>        if (!part &#124;&#124; part === '.') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 176 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 177 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>        if (part === '..') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 179 | <code>            parts.pop();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 180 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 181 | <code>            parts.push(part);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 182 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    return parts.join('/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 187 | <code>function resolveZipTarget(basePart = '', target = '') {</code> | 定义函数 `resolveZipTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 188 | <code>    if (!target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 189 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 190 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    if (/^[a-z]+:/i.test(target) &#124;&#124; target.startsWith('/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>        return target.replace(/^\//, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 193 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>    const baseDir = path.posix.dirname(String(basePart &#124;&#124; '').replace(/\\/g, '/'));</code> | 声明局部标识符 `baseDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 195 | <code>    return normalizeZipPath(path.posix.join(baseDir, target));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 196 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 198 | <code>function normalizeInclude(value = [], fallback = ['values', 'formulas', 'styles']) {</code> | 定义函数 `normalizeInclude`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 199 | <code>    if (Array.isArray(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 200 | <code>        return new Set(value.map((entry) =&gt; String(entry).trim().toLowerCase()).filter(Boolean));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 201 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>    if (typeof value === 'string' &amp;&amp; value.trim()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 203 | <code>        return new Set(value.split(/[,&#124;;\s]+/).map((entry) =&gt; entry.trim().toLowerCase()).filter(Boolean));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 204 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 205 | <code>    return new Set(fallback);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 206 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>function includeHasCellLevelRequest(include = new Set()) {</code> | 定义函数 `includeHasCellLevelRequest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 209 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 210 | <code>        'value',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 211 | <code>        'values',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 212 | <code>        'style',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 213 | <code>        'styles',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 214 | <code>        'fill',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 215 | <code>        'fills',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 216 | <code>        'color',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 217 | <code>        'colors',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 218 | <code>        'formula',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 219 | <code>        'formulas',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 220 | <code>        'comment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 221 | <code>        'comments',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 222 | <code>        'validation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 223 | <code>        'datavalidation'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 224 | <code>    ].some((entry) =&gt; include.has(entry));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 225 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 227 | <code>function normalizeXlsxInspectKind(input = {}) {</code> | 定义函数 `normalizeXlsxInspectKind`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 228 | <code>    const explicit = String(input.kind &#124;&#124; input.inspectKind &#124;&#124; input.inspect_kind &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `explicit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 229 | <code>    if (explicit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 230 | <code>        return explicit;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>    const target = String(input.target &#124;&#124; input.range &#124;&#124; input.addressRange &#124;&#124; input.address_range &#124;&#124; '').trim();</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 233 | <code>    if (target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 234 | <code>        return 'range';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 235 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>    const include = normalizeInclude(input.include, []);</code> | 声明局部标识符 `include`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 237 | <code>    if ((input.sheet &#124;&#124; input.sheetName &#124;&#124; input.sheet_name) &amp;&amp; includeHasCellLevelRequest(include)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 238 | <code>        return 'range';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 239 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>    return 'workbook';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 241 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 243 | <code>function clampNumber(value, fallback, min, max) {</code> | 定义函数 `clampNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 244 | <code>    const number = Number(value);</code> | 声明局部标识符 `number`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 245 | <code>    if (!Number.isFinite(number)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 246 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 247 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>    return Math.max(min, Math.min(max, number));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 249 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>function clonePlain(value) {</code> | 定义函数 `clonePlain`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 252 | <code>    if (typeof value === 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 253 | <code>        return undefined;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 254 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 256 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 257 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 258 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 259 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 262 | <code>function sha256File(filePath) {</code> | 定义函数 `sha256File`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 263 | <code>    const hash = crypto.createHash('sha256');</code> | 声明局部标识符 `hash`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 264 | <code>    hash.update(fs.readFileSync(filePath));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 265 | <code>    return hash.digest('hex');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>function escapeXml(value = '') {</code> | 定义函数 `escapeXml`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 269 | <code>    return String(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 270 | <code>        .replace(/&amp;/g, '&amp;amp;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 271 | <code>        .replace(/&lt;/g, '&amp;lt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 272 | <code>        .replace(/&gt;/g, '&amp;gt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 273 | <code>        .replace(/"/g, '&amp;quot;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 274 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>function decodeXmlText(value = '') {</code> | 定义函数 `decodeXmlText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 277 | <code>    return String(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 278 | <code>        .replace(/&amp;lt;/g, '&lt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 279 | <code>        .replace(/&amp;gt;/g, '&gt;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 280 | <code>        .replace(/&amp;quot;/g, '"')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 281 | <code>        .replace(/&amp;apos;/g, "'")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 282 | <code>        .replace(/&amp;amp;/g, '&amp;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 283 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 284 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 285 | <code>function createDiagnostic(code, severity, message, details = {}) {</code> | 定义函数 `createDiagnostic`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 286 | <code>    return createArtifactDiagnostic({ code, severity, message, details });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>function getCellFillRgb(cell) {</code> | 定义函数 `getCellFillRgb`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 290 | <code>    const fill = cell?.fill &#124;&#124; {};</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 291 | <code>    const color = fill.fgColor &#124;&#124; fill.bgColor &#124;&#124; {};</code> | 声明局部标识符 `color`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 292 | <code>    return normalizeHex(color.argb &#124;&#124; color.rgb &#124;&#124; color.indexed &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 293 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 295 | <code>function getCellValue(cell) {</code> | 定义函数 `getCellValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 296 | <code>    if (!cell &#124;&#124; cell.value === null &#124;&#124; typeof cell.value === 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 297 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 298 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    if (typeof cell.value === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 300 | <code>        if (cell.value.text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 301 | <code>            return cell.value.text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 302 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>        if (Array.isArray(cell.value.richText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 304 | <code>            return cell.value.richText.map((part) =&gt; part.text &#124;&#124; '').join('');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 305 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>        if (cell.value.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 307 | <code>            return cell.value.result ?? '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 308 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>    return cell.value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 311 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 313 | <code>function getFormulaResult(cell) {</code> | 定义函数 `getFormulaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 314 | <code>    if (!cell &#124;&#124; !cell.value &#124;&#124; typeof cell.value !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 315 | <code>        return undefined;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 316 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>    if (Object.prototype.hasOwnProperty.call(cell.value, 'result')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 318 | <code>        return clonePlain(cell.value.result);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 319 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>    if (Object.prototype.hasOwnProperty.call(cell.value, 'error')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 321 | <code>        return clonePlain(cell.value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 322 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 323 | <code>    return undefined;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>function getPrimitiveText(value) {</code> | 定义函数 `getPrimitiveText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 327 | <code>    if (value === null &#124;&#124; typeof value === 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 328 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 329 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 331 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 332 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>    return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 334 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>function noteToText(note) {</code> | 定义函数 `noteToText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 337 | <code>    if (!note) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 338 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>    if (typeof note === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 341 | <code>        return note;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 342 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>    if (typeof note.text === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 344 | <code>        return note.text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 345 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>    if (Array.isArray(note.texts)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 347 | <code>        return note.texts.map((entry) =&gt; entry.text &#124;&#124; entry).join('');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 348 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 350 | <code>        return JSON.stringify(note);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 351 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 352 | <code>        return String(note);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>function normalizeColor(color = {}) {</code> | 定义函数 `normalizeColor`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 357 | <code>    if (!color &#124;&#124; typeof color !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 358 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 359 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>    return normalizeHex(color.argb &#124;&#124; color.rgb &#124;&#124; color.indexed &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 361 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 363 | <code>function summarizeBorder(border = {}) {</code> | 定义函数 `summarizeBorder`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 364 | <code>    const result = {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 365 | <code>    for (const edge of ['top', 'right', 'bottom', 'left']) {</code> | 声明局部标识符 `edge`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 366 | <code>        if (border[edge]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 367 | <code>            result[edge] = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 368 | <code>                style: border[edge].style &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 369 | <code>                color: normalizeColor(border[edge].color)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 370 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 374 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>function summarizeStyle(cell) {</code> | 定义函数 `summarizeStyle`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 377 | <code>    const style = cell?.style &#124;&#124; {};</code> | 声明局部标识符 `style`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 378 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 379 | <code>        fillRgb: getCellFillRgb(cell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 380 | <code>        font: style.font ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 381 | <code>            name: style.font.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 382 | <code>            size: style.font.size &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 383 | <code>            bold: style.font.bold === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 384 | <code>            italic: style.font.italic === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 385 | <code>            color: normalizeColor(style.font.color)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 386 | <code>        } : {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 387 | <code>        alignment: style.alignment ? clonePlain(style.alignment) : {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 388 | <code>        numFmt: style.numFmt &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 389 | <code>        border: style.border ? summarizeBorder(style.border) : {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 390 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>function getCellErrorCode(cell) {</code> | 定义函数 `getCellErrorCode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 394 | <code>    const value = cell?.value;</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 395 | <code>    if (value &amp;&amp; typeof value === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 396 | <code>        if (value.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 397 | <code>            return value.error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 398 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>        if (value.result &amp;&amp; typeof value.result === 'object' &amp;&amp; value.result.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 400 | <code>            return value.result.error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 401 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    const text = String(cell?.text &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 404 | <code>    const match = text.match(/#(?:REF&#124;DIV\/0&#124;VALUE&#124;NAME\?&#124;N\/A&#124;NUM&#124;NULL)!?/i);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 405 | <code>    return match ? match[0].toUpperCase() : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 406 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>function inspectCell(cell, options = {}) {</code> | 定义函数 `inspectCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 409 | <code>    const include = options.include &#124;&#124; normalizeInclude();</code> | 声明局部标识符 `include`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 410 | <code>    const value = getCellValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 411 | <code>    const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 412 | <code>        ref: cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 413 | <code>        row: cell.row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 414 | <code>        col: cell.col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 415 | <code>        text: getPrimitiveText(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 416 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    if (include.has('values') &#124;&#124; include.has('value')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>        result.value = clonePlain(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>    if (include.has('formulas') &#124;&#124; include.has('formula')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 421 | <code>        result.formula = cell.formula &#124;&#124; '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 422 | <code>        result.formulaType = cell.formulaType &#124;&#124; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 423 | <code>        const formulaResult = getFormulaResult(cell);</code> | 声明局部标识符 `formulaResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 424 | <code>        if (typeof formulaResult !== 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 425 | <code>            result.result = formulaResult;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 426 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>        const errorCode = getCellErrorCode(cell);</code> | 声明局部标识符 `errorCode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 428 | <code>        if (errorCode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 429 | <code>            result.error = errorCode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 430 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>    } else if (cell.formula) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 432 | <code>        result.formula = cell.formula;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 433 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>    if (include.has('styles') &#124;&#124; include.has('style') &#124;&#124; include.has('computedstyle')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 435 | <code>        result.style = summarizeStyle(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 436 | <code>        result.fillRgb = result.style.fillRgb;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 437 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 438 | <code>        const fillRgb = getCellFillRgb(cell);</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 439 | <code>        if (fillRgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 440 | <code>            result.fillRgb = fillRgb;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 441 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>    if ((include.has('comments') &#124;&#124; include.has('comment')) &amp;&amp; cell.note) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 444 | <code>        result.comment = noteToText(cell.note);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 445 | <code>        result.note = clonePlain(cell.note);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 446 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>    if ((include.has('validation') &#124;&#124; include.has('datavalidation')) &amp;&amp; cell.dataValidation) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 448 | <code>        result.dataValidation = clonePlain(cell.dataValidation);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 451 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>function buildFillHistogram(cells) {</code> | 定义函数 `buildFillHistogram`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 454 | <code>    const histogram = {};</code> | 声明局部标识符 `histogram`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 455 | <code>    for (const cell of cells) {</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 456 | <code>        if (!cell.fillRgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 457 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 458 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>        histogram[cell.fillRgb] = (histogram[cell.fillRgb] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 460 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>    return histogram;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 462 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>function getWorksheetUsedBounds(sheet) {</code> | 定义函数 `getWorksheetUsedBounds`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 465 | <code>    let maxRow = 0;</code> | 声明局部标识符 `maxRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 466 | <code>    let maxCol = 0;</code> | 声明局部标识符 `maxCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 467 | <code>    sheet.eachRow({ includeEmpty: false }, (row) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 468 | <code>        row.eachCell({ includeEmpty: false }, (cell) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 469 | <code>            const value = getCellValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 470 | <code>            const fillRgb = getCellFillRgb(cell);</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 471 | <code>            if (value !== '' &#124;&#124; fillRgb &#124;&#124; cell.formula &#124;&#124; cell.note) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 472 | <code>                maxRow = Math.max(maxRow, cell.row &#124;&#124; row.number);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 473 | <code>                maxCol = Math.max(maxCol, cell.col &#124;&#124; cell._column?._number &#124;&#124; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 474 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 475 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 476 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>    for (const merge of sheet.model?.merges &#124;&#124; []) {</code> | 声明局部标识符 `merge`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 478 | <code>        const bounds = parseRangeRef(merge);</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 479 | <code>        if (bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 480 | <code>            maxRow = Math.max(maxRow, bounds.endRow);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 481 | <code>            maxCol = Math.max(maxCol, bounds.endCol);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 482 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 485 | <code>        startRow: maxRow ? 1 : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 486 | <code>        startCol: maxCol ? 1 : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 487 | <code>        endRow: maxRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 488 | <code>        endCol: maxCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 489 | <code>        range: maxRow &amp;&amp; maxCol ? `A1:${cellRef(maxRow, maxCol)}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 490 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>function summarizeTables(sheet, tableInventory = []) {</code> | 定义函数 `summarizeTables`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 494 | <code>    const tables = sheet.model?.tables &#124;&#124; [];</code> | 声明局部标识符 `tables`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 495 | <code>    return tables.map((table) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 496 | <code>        name: table.name &#124;&#124; table.displayName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 497 | <code>        ref: table.ref &#124;&#124; tableInventory.find((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 498 | <code>            entry.name === (table.name &#124;&#124; table.displayName)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 499 | <code>            &#124;&#124; entry.displayName === (table.name &#124;&#124; table.displayName)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 500 | <code>        )?.ref &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 501 | <code>        headerRow: table.headerRow !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 502 | <code>        totalsRow: table.totalsRow === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 503 | <code>        columns: (table.tableRef?.table?.columns &#124;&#124; table.columns &#124;&#124; []).map((column) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 504 | <code>            name: column.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 505 | <code>            filterButton: column.filterButton !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 506 | <code>            totalsRowFunction: column.totalsRowFunction &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 507 | <code>            totalsRowFormula: column.totalsRowFormula &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 508 | <code>        })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 509 | <code>        style: table.style ? clonePlain(table.style) : {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 510 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 513 | <code>function collectHiddenRows(sheet) {</code> | 定义函数 `collectHiddenRows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 514 | <code>    const hidden = [];</code> | 声明局部标识符 `hidden`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 515 | <code>    const maxRow = Math.max(sheet.rowCount &#124;&#124; 0, sheet.actualRowCount &#124;&#124; 0);</code> | 声明局部标识符 `maxRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 516 | <code>    for (let rowNumber = 1; rowNumber &lt;= maxRow; rowNumber += 1) {</code> | 声明局部标识符 `rowNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 517 | <code>        const row = sheet.getRow(rowNumber);</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 518 | <code>        if (row.hidden) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 519 | <code>            hidden.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 520 | <code>                row: rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 521 | <code>                range: `${rowNumber}:${rowNumber}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 522 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 525 | <code>    return hidden;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 526 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>function collectHiddenColumns(sheet) {</code> | 定义函数 `collectHiddenColumns`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 529 | <code>    const hidden = [];</code> | 声明局部标识符 `hidden`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 530 | <code>    const maxCol = Math.max(sheet.columnCount &#124;&#124; 0, sheet.actualColumnCount &#124;&#124; 0);</code> | 声明局部标识符 `maxCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 531 | <code>    for (let colNumber = 1; colNumber &lt;= maxCol; colNumber += 1) {</code> | 声明局部标识符 `colNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 532 | <code>        const col = sheet.getColumn(colNumber);</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 533 | <code>        if (col.hidden) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 534 | <code>            hidden.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 535 | <code>                col: colNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 536 | <code>                name: colName(colNumber),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 537 | <code>                range: `${colName(colNumber)}:${colName(colNumber)}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 538 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 539 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 540 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>    return hidden;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 542 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 544 | <code>function summarizeDataValidations(sheet) {</code> | 定义函数 `summarizeDataValidations`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 545 | <code>    const model = sheet.model?.dataValidations?.model &#124;&#124; sheet.dataValidations?.model &#124;&#124; {};</code> | 声明局部标识符 `model`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 546 | <code>    return Object.entries(model).map(([ref, validation]) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 547 | <code>        ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 548 | <code>        type: validation.type &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 549 | <code>        operator: validation.operator &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 550 | <code>        formulae: clonePlain(validation.formulae &#124;&#124; []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 551 | <code>        allowBlank: validation.allowBlank === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 552 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 553 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>function summarizeConditionalFormattings(sheet) {</code> | 定义函数 `summarizeConditionalFormattings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 556 | <code>    return (sheet.model?.conditionalFormattings &#124;&#124; []).map((entry) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 557 | <code>        ref: entry.ref &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 558 | <code>        rules: (entry.rules &#124;&#124; []).map((rule) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 559 | <code>            type: rule.type &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 560 | <code>            operator: rule.operator &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 561 | <code>            formulae: clonePlain(rule.formulae &#124;&#124; []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 562 | <code>            priority: rule.priority &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 563 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 565 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 567 | <code>function summarizeDefinedNames(workbook) {</code> | 定义函数 `summarizeDefinedNames`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 568 | <code>    const model = workbook.definedNames?.model &#124;&#124; workbook.model?.definedNames &#124;&#124; [];</code> | 声明局部标识符 `model`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 569 | <code>    return model.map((entry) =&gt; ({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 570 | <code>        name: entry.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 571 | <code>        ranges: clonePlain(entry.ranges &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 572 | <code>    })).filter((entry) =&gt; entry.name &#124;&#124; entry.ranges.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 573 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>function normalizeDefinedNameKey(name = '') {</code> | 定义函数 `normalizeDefinedNameKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 576 | <code>    return String(name &#124;&#124; '').trim().toLowerCase();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 577 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 579 | <code>function buildDefinedNameMap(workbook) {</code> | 定义函数 `buildDefinedNameMap`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 580 | <code>    const map = new Map();</code> | 声明局部标识符 `map`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 581 | <code>    for (const entry of summarizeDefinedNames(workbook)) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 582 | <code>        const key = normalizeDefinedNameKey(entry.name);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 583 | <code>        if (!key) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 584 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 585 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>        map.set(key, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 587 | <code>            name: entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 588 | <code>            ranges: (entry.ranges &#124;&#124; []).map((range) =&gt; String(range &#124;&#124; '')).filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 589 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>    return map;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 592 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>function parseXmlAttributes(raw = '') {</code> | 定义函数 `parseXmlAttributes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 595 | <code>    const attrs = {};</code> | 声明局部标识符 `attrs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 596 | <code>    const regex = /([\w:.-]+)="([^"]*)"/g;</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 597 | <code>    let match = regex.exec(raw);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 598 | <code>    while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 599 | <code>        attrs[match[1]] = decodeXmlText(match[2]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 600 | <code>        match = regex.exec(raw);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 601 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>    return attrs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 603 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 605 | <code>function parseRelationshipEntries(entries = {}) {</code> | 定义函数 `parseRelationshipEntries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 606 | <code>    const relationships = [];</code> | 声明局部标识符 `relationships`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 607 | <code>    for (const [part, xml] of Object.entries(entries)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 608 | <code>        if (!part.endsWith('.rels')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 609 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 610 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 611 | <code>        const regex = /&lt;Relationship\b([^&gt;]*)\/?&gt;/g;</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 612 | <code>        let match = regex.exec(xml);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 613 | <code>        while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 614 | <code>            const attrs = parseXmlAttributes(match[1]);</code> | 声明局部标识符 `attrs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 615 | <code>            relationships.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 616 | <code>                part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 617 | <code>                id: attrs.Id &#124;&#124; attrs.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 618 | <code>                type: attrs.Type &#124;&#124; attrs.type &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 619 | <code>                target: attrs.Target &#124;&#124; attrs.target &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 620 | <code>                targetMode: attrs.TargetMode &#124;&#124; attrs.targetMode &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 621 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>            match = regex.exec(xml);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 623 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 624 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 625 | <code>    return relationships;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 626 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 628 | <code>function countXmlTags(xml = '', tag = '') {</code> | 定义函数 `countXmlTags`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 629 | <code>    if (!tag) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 630 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 631 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>    const escaped = tag.replace(/[.*+?^${}()&#124;[\]\\]/g, '\\$&amp;');</code> | 声明局部标识符 `escaped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 633 | <code>    const regex = new RegExp(`&lt;(?:\\w+:)?${escaped}\\b`, 'g');</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 634 | <code>    return (xml.match(regex) &#124;&#124; []).length;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 635 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 637 | <code>function parseFirstXmlElementAttrs(xml = '', tagName = '') {</code> | 定义函数 `parseFirstXmlElementAttrs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 638 | <code>    const escaped = tagName.replace(/[.*+?^${}()&#124;[\]\\]/g, '\\$&amp;');</code> | 声明局部标识符 `escaped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 639 | <code>    const regex = new RegExp(`&lt;(?:\\w+:)?${escaped}\\b([^&gt;]*)&gt;`, 'i');</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 640 | <code>    const match = regex.exec(xml);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 641 | <code>    return match ? parseXmlAttributes(match[1]) : {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 642 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 643 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 644 | <code>function parseDrawingAnchors(xml = '', relsById = {}) {</code> | 定义函数 `parseDrawingAnchors`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 645 | <code>    const anchors = [];</code> | 声明局部标识符 `anchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 646 | <code>    const anchorRegex = /&lt;(?:\w+:)?(twoCellAnchor&#124;oneCellAnchor)\b[^&gt;]*&gt;([\s\S]*?)&lt;\/(?:\w+:)?\1&gt;/g;</code> | 声明局部标识符 `anchorRegex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 647 | <code>    let anchorMatch = anchorRegex.exec(xml);</code> | 声明局部标识符 `anchorMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 648 | <code>    while (anchorMatch) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 649 | <code>        const body = anchorMatch[2];</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 650 | <code>        const from = /&lt;(?:\w+:)?from\b[^&gt;]*&gt;([\s\S]*?)&lt;\/(?:\w+:)?from&gt;/i.exec(body)?.[1] &#124;&#124; '';</code> | 声明局部标识符 `from`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 651 | <code>        const to = /&lt;(?:\w+:)?to\b[^&gt;]*&gt;([\s\S]*?)&lt;\/(?:\w+:)?to&gt;/i.exec(body)?.[1] &#124;&#124; '';</code> | 声明局部标识符 `to`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 652 | <code>        const getNumber = (block, tag, fallback = 0) =&gt; {</code> | 声明局部标识符 `getNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 653 | <code>            const match = new RegExp(`&lt;(?:\\w+:)?${tag}\\b[^&gt;]*&gt;(\\d+)&lt;\\/(?:\\w+:)?${tag}&gt;`, 'i').exec(block);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 654 | <code>            return match ? Number(match[1]) : fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 655 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>        const fromCol = getNumber(from, 'col', 0);</code> | 声明局部标识符 `fromCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 657 | <code>        const fromRow = getNumber(from, 'row', 0);</code> | 声明局部标识符 `fromRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 658 | <code>        const toCol = getNumber(to, 'col', fromCol + 1);</code> | 声明局部标识符 `toCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 659 | <code>        const toRow = getNumber(to, 'row', fromRow + 1);</code> | 声明局部标识符 `toRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 660 | <code>        const embedId = /&lt;(?:\w+:)?blip\b[^&gt;]*(?:r:embed&#124;embed)="([^"]+)"/i.exec(body)?.[1] &#124;&#124; '';</code> | 声明局部标识符 `embedId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 661 | <code>        const chartId = /&lt;(?:\w+:)?chart\b[^&gt;]*(?:r:id&#124;id)="([^"]+)"/i.exec(body)?.[1] &#124;&#124; '';</code> | 声明局部标识符 `chartId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 662 | <code>        const relId = embedId &#124;&#124; chartId;</code> | 声明局部标识符 `relId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 663 | <code>        const relationship = relId ? relsById[relId] : null;</code> | 声明局部标识符 `relationship`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 664 | <code>        const anchor = {</code> | 声明局部标识符 `anchor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 665 | <code>            kind: embedId ? 'image' : (chartId ? 'chart' : 'shape'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 666 | <code>            relId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 667 | <code>            target: relationship?.target &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 668 | <code>            type: relationship?.type &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 669 | <code>            from: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 670 | <code>                row: fromRow + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 671 | <code>                col: fromCol + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 672 | <code>                ref: cellRef(fromRow + 1, fromCol + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 673 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>            to: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 675 | <code>                row: toRow + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 676 | <code>                col: toCol + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 677 | <code>                ref: cellRef(toRow + 1, toCol + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 678 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>            range: `${cellRef(fromRow + 1, fromCol + 1)}:${cellRef(toRow + 1, toCol + 1)}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 680 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 681 | <code>        anchors.push(anchor);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 682 | <code>        anchorMatch = anchorRegex.exec(xml);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 683 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>    return anchors;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 685 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 687 | <code>function groupRelationshipsByPart(relationships = []) {</code> | 定义函数 `groupRelationshipsByPart`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 688 | <code>    const grouped = new Map();</code> | 声明局部标识符 `grouped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 689 | <code>    for (const rel of relationships) {</code> | 声明局部标识符 `rel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 690 | <code>        if (!grouped.has(rel.part)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 691 | <code>            grouped.set(rel.part, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 692 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 693 | <code>        grouped.get(rel.part).push(rel);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 694 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>    return grouped;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 696 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 697 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 698 | <code>function buildXlsxPackageInventory(archive = {}, workbook = null) {</code> | 定义函数 `buildXlsxPackageInventory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 699 | <code>    const names = archive.names &#124;&#124; [];</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 700 | <code>    const entries = archive.entries &#124;&#124; {};</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 701 | <code>    const drawings = names.filter((name) =&gt; /^xl\/drawings\/drawing\d+\.xml$/i.test(name));</code> | 声明局部标识符 `drawings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 702 | <code>    const charts = names.filter((name) =&gt; /^xl\/charts\/chart\d+\.xml$/i.test(name));</code> | 声明局部标识符 `charts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 703 | <code>    const images = names.filter((name) =&gt; /^xl\/media\/[^/]+$/i.test(name));</code> | 声明局部标识符 `images`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 704 | <code>    const tableParts = names.filter((name) =&gt; /^xl\/tables\/table\d+\.xml$/i.test(name));</code> | 声明局部标识符 `tableParts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 705 | <code>    const comments = names.filter((name) =&gt; /^xl\/comments\d+\.xml$/i.test(name) &#124;&#124; /^xl\/threadedComments\//i.test(name));</code> | 声明局部标识符 `comments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 706 | <code>    const externalLinks = names.filter((name) =&gt; /^xl\/externalLinks\//i.test(name));</code> | 声明局部标识符 `externalLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 707 | <code>    const macros = names.filter((name) =&gt; /(^&#124;\/)vbaProject\.bin$/i.test(name));</code> | 声明局部标识符 `macros`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 708 | <code>    const relationships = parseRelationshipEntries(entries);</code> | 声明局部标识符 `relationships`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 709 | <code>    const relsByPart = groupRelationshipsByPart(relationships);</code> | 声明局部标识符 `relsByPart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 710 | <code>    const tableByPart = new Map(tableParts.map((part) =&gt; {</code> | 声明局部标识符 `tableByPart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 711 | <code>        const attrs = parseFirstXmlElementAttrs(entries[part] &#124;&#124; '', 'table');</code> | 声明局部标识符 `attrs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 712 | <code>        return [part, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 713 | <code>            part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 714 | <code>            id: attrs.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 715 | <code>            name: attrs.name &#124;&#124; attrs.displayName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 716 | <code>            displayName: attrs.displayName &#124;&#124; attrs.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 717 | <code>            ref: attrs.ref &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 718 | <code>            totalsRowCount: attrs.totalsRowCount &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 719 | <code>            headerRowCount: attrs.headerRowCount &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 720 | <code>        }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>    const tableAssignments = new Map();</code> | 声明局部标识符 `tableAssignments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 723 | <code>    const drawingAssignments = new Map();</code> | 声明局部标识符 `drawingAssignments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 724 | <code>    for (const rel of relationships) {</code> | 声明局部标识符 `rel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 725 | <code>        const sheetRelMatch = /^xl\/worksheets\/_rels\/sheet(\d+)\.xml\.rels$/i.exec(rel.part);</code> | 声明局部标识符 `sheetRelMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 726 | <code>        if (!sheetRelMatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 727 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 728 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>        const sheetIndex = Number(sheetRelMatch[1]) - 1;</code> | 声明局部标识符 `sheetIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 730 | <code>        const sheetName = workbook?.worksheets?.[sheetIndex]?.name &#124;&#124; `sheet${sheetIndex + 1}`;</code> | 声明局部标识符 `sheetName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 731 | <code>        const resolvedTarget = resolveZipTarget(`xl/worksheets/sheet${sheetIndex + 1}.xml`, rel.target);</code> | 声明局部标识符 `resolvedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 732 | <code>        if (/^xl\/tables\/table\d+\.xml$/i.test(resolvedTarget)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 733 | <code>            tableAssignments.set(resolvedTarget, sheetName);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 734 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 735 | <code>        if (/^xl\/drawings\/drawing\d+\.xml$/i.test(resolvedTarget)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 736 | <code>            drawingAssignments.set(resolvedTarget, sheetName);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 737 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 738 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>    const tables = [...tableByPart.values()].map((table) =&gt; ({</code> | 声明局部标识符 `tables`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 740 | <code>        ...table,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 741 | <code>        sheetName: tableAssignments.get(table.part) &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 742 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 743 | <code>    const drawingDetails = drawings.map((name) =&gt; {</code> | 声明局部标识符 `drawingDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 744 | <code>        const xml = entries[name] &#124;&#124; '';</code> | 声明局部标识符 `xml`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 745 | <code>        const relPart = `xl/drawings/_rels/${path.posix.basename(name)}.rels`;</code> | 声明局部标识符 `relPart`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 746 | <code>        const relsById = Object.fromEntries((relsByPart.get(relPart) &#124;&#124; []).map((rel) =&gt; [</code> | 声明局部标识符 `relsById`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 747 | <code>            rel.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 748 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 749 | <code>                ...rel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 750 | <code>                target: resolveZipTarget(name, rel.target)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 751 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>        ]));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>        const anchors = parseDrawingAnchors(xml, relsById).map((anchor) =&gt; ({</code> | 声明局部标识符 `anchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 754 | <code>            ...anchor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 755 | <code>            sheetName: drawingAssignments.get(name) &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 756 | <code>            drawingPart: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 757 | <code>            fullRange: drawingAssignments.get(name) ? `${drawingAssignments.get(name)}!${anchor.range}` : anchor.range</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 758 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 759 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 760 | <code>            part: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 761 | <code>            sheetName: drawingAssignments.get(name) &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 762 | <code>            shapeCount: countXmlTags(xml, 'sp'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 763 | <code>            imageCount: countXmlTags(xml, 'pic'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 764 | <code>            graphicFrameCount: countXmlTags(xml, 'graphicFrame'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 765 | <code>            chartReferenceCount: (xml.match(/chart\.xml&#124;\/charts\/chart\d+\.xml/gi) &#124;&#124; []).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 766 | <code>            anchors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 767 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 768 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 769 | <code>    const imageAnchors = drawingDetails</code> | 声明局部标识符 `imageAnchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 770 | <code>        .flatMap((drawing) =&gt; (drawing.anchors &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 771 | <code>            .filter((anchor) =&gt; anchor.kind === 'image')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 772 | <code>            .map((anchor) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 773 | <code>                sheetName: anchor.sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 774 | <code>                drawingPart: drawing.part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 775 | <code>                mediaPart: anchor.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 776 | <code>                relId: anchor.relId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 777 | <code>                range: anchor.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 778 | <code>                fullRange: anchor.fullRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 779 | <code>                from: anchor.from,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 780 | <code>                to: anchor.to</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 781 | <code>            })));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 782 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 783 | <code>        partCount: names.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 784 | <code>        relationships,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 785 | <code>        drawings: drawingDetails,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 786 | <code>        charts: charts.map((part) =&gt; ({ part })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 787 | <code>        images: images.map((part) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 788 | <code>            part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 789 | <code>            anchors: imageAnchors.filter((anchor) =&gt; anchor.mediaPart === part)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 790 | <code>        })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 791 | <code>        imageAnchors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 792 | <code>        tables,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 793 | <code>        comments: comments.map((part) =&gt; ({ part })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 794 | <code>        externalLinks: externalLinks.map((part) =&gt; ({ part })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 795 | <code>        macros: macros.map((part) =&gt; ({ part }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 796 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 797 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 798 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 799 | <code>function collectSheetCells(sheet, options = {}) {</code> | 定义函数 `collectSheetCells`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 800 | <code>    const include = normalizeInclude(options.include);</code> | 声明局部标识符 `include`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 801 | <code>    const used = getWorksheetUsedBounds(sheet);</code> | 声明局部标识符 `used`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 802 | <code>    const targetBounds = options.bounds &#124;&#124; used;</code> | 声明局部标识符 `targetBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 803 | <code>    const maxRows = clampNumber(options.maxRows, 60, 1, 1000);</code> | 声明局部标识符 `maxRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 804 | <code>    const maxCols = clampNumber(options.maxCols, 30, 1, 200);</code> | 声明局部标识符 `maxCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 805 | <code>    const startRow = targetBounds.startRow &#124;&#124; 1;</code> | 声明局部标识符 `startRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 806 | <code>    const startCol = targetBounds.startCol &#124;&#124; 1;</code> | 声明局部标识符 `startCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 807 | <code>    const endRow = Math.min(targetBounds.endRow &#124;&#124; used.endRow &#124;&#124; sheet.rowCount &#124;&#124; 1, startRow + maxRows - 1);</code> | 声明局部标识符 `endRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 808 | <code>    const endCol = Math.min(targetBounds.endCol &#124;&#124; used.endCol &#124;&#124; sheet.columnCount &#124;&#124; 1, startCol + maxCols - 1);</code> | 声明局部标识符 `endCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 809 | <code>    const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 810 | <code>    let originalRows = Math.max(0, (targetBounds.endRow &#124;&#124; 0) - startRow + 1);</code> | 声明局部标识符 `originalRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 811 | <code>    let originalCols = Math.max(0, (targetBounds.endCol &#124;&#124; 0) - startCol + 1);</code> | 声明局部标识符 `originalCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 812 | <code>    if (!originalRows &amp;&amp; used.endRow) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 813 | <code>        originalRows = used.endRow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 814 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 815 | <code>    if (!originalCols &amp;&amp; used.endCol) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 816 | <code>        originalCols = used.endCol;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 817 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 818 | <code>    for (let row = startRow; row &lt;= endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 819 | <code>        for (let col = startCol; col &lt;= endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 820 | <code>            const cell = sheet.getCell(row, col);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 821 | <code>            const value = getCellValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 822 | <code>            const fillRgb = getCellFillRgb(cell);</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 823 | <code>            if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 824 | <code>                options.includeEmpty</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 825 | <code>                &#124;&#124; value !== ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 826 | <code>                &#124;&#124; fillRgb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 827 | <code>                &#124;&#124; cell.formula</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 828 | <code>                &#124;&#124; cell.note</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 829 | <code>                &#124;&#124; cell.dataValidation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 830 | <code>                &#124;&#124; sheet.getRow(row).hidden</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 831 | <code>                &#124;&#124; sheet.getColumn(col).hidden</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 832 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 833 | <code>                cells.push(inspectCell(cell, { include }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 834 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 835 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 838 | <code>        targetRange: targetBounds.startRow ? `${cellRef(startRow, startCol)}:${cellRef(targetBounds.endRow, targetBounds.endCol)}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 839 | <code>        returnedRange: startRow &lt;= endRow &amp;&amp; startCol &lt;= endCol ? `${cellRef(startRow, startCol)}:${cellRef(endRow, endCol)}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 840 | <code>        rows: Math.max(0, endRow - startRow + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 841 | <code>        cols: Math.max(0, endCol - startCol + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 842 | <code>        originalRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 843 | <code>        originalCols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 844 | <code>        truncated: endRow &lt; (targetBounds.endRow &#124;&#124; 0) &#124;&#124; endCol &lt; (targetBounds.endCol &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 845 | <code>        cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 846 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 847 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 848 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 849 | <code>function collectFormulas(sheet) {</code> | 定义函数 `collectFormulas`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 850 | <code>    const formulas = [];</code> | 声明局部标识符 `formulas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 851 | <code>    sheet.eachRow({ includeEmpty: false }, (row) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 852 | <code>        row.eachCell({ includeEmpty: false }, (cell) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 853 | <code>            if (cell.formula &#124;&#124; cell.value?.sharedFormula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 854 | <code>                formulas.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 855 | <code>                    ref: cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 856 | <code>                    formula: cell.formula &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 857 | <code>                    sharedFormula: cell.value?.sharedFormula &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 858 | <code>                    result: getFormulaResult(cell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 859 | <code>                    error: getCellErrorCode(cell)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 860 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 862 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 863 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 864 | <code>    return formulas;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 865 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 867 | <code>function collectFormulaErrors(sheet) {</code> | 定义函数 `collectFormulaErrors`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 868 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 869 | <code>    sheet.eachRow({ includeEmpty: false }, (row) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 870 | <code>        row.eachCell({ includeEmpty: false }, (cell) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 871 | <code>            const error = getCellErrorCode(cell);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 872 | <code>            if (error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 873 | <code>                errors.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 874 | <code>                    ref: cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 875 | <code>                    formula: cell.formula &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 876 | <code>                    error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 877 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 878 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 879 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 880 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 881 | <code>    return errors;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 882 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 884 | <code>function collectComments(sheet) {</code> | 定义函数 `collectComments`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 885 | <code>    const comments = [];</code> | 声明局部标识符 `comments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 886 | <code>    sheet.eachRow({ includeEmpty: false }, (row) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 887 | <code>        row.eachCell({ includeEmpty: false }, (cell) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 888 | <code>            if (cell.note) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 889 | <code>                comments.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 890 | <code>                    ref: cell.address,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 891 | <code>                    text: noteToText(cell.note),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 892 | <code>                    note: clonePlain(cell.note)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 893 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 894 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 895 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 896 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 897 | <code>    return comments;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 898 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 899 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 900 | <code>function summarizeWorksheet(sheet, options = {}) {</code> | 定义函数 `summarizeWorksheet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 901 | <code>    const used = getWorksheetUsedBounds(sheet);</code> | 声明局部标识符 `used`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 902 | <code>    const range = collectSheetCells(sheet, {</code> | 声明局部标识符 `range`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 903 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 904 | <code>        bounds: options.bounds &#124;&#124; used</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 905 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 906 | <code>    const formulas = collectFormulas(sheet);</code> | 声明局部标识符 `formulas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 907 | <code>    const formulaErrors = collectFormulaErrors(sheet);</code> | 声明局部标识符 `formulaErrors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 908 | <code>    const hiddenRows = collectHiddenRows(sheet);</code> | 声明局部标识符 `hiddenRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 909 | <code>    const hiddenColumns = collectHiddenColumns(sheet);</code> | 声明局部标识符 `hiddenColumns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 910 | <code>    const sheetTables = (options.tableInventory &#124;&#124; []).filter((entry) =&gt; entry.sheetName === sheet.name);</code> | 声明局部标识符 `sheetTables`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 911 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 912 | <code>        name: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 913 | <code>        id: sheet.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 914 | <code>        state: sheet.state &#124;&#124; 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 915 | <code>        hidden: sheet.state &amp;&amp; sheet.state !== 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 916 | <code>        rowCount: sheet.rowCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 917 | <code>        columnCount: sheet.columnCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 918 | <code>        actualRowCount: sheet.actualRowCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 919 | <code>        actualColumnCount: sheet.actualColumnCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 920 | <code>        usedRange: used.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 921 | <code>        dimensions: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 922 | <code>            startRow: used.startRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 923 | <code>            startCol: used.startCol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 924 | <code>            endRow: used.endRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 925 | <code>            endCol: used.endCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 926 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 927 | <code>        cells: range.cells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 928 | <code>        range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 929 | <code>        fillHistogram: buildFillHistogram(range.cells),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 930 | <code>        hiddenRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 931 | <code>        hiddenColumns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 932 | <code>        merges: sheet.model?.merges &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 933 | <code>        tables: summarizeTables(sheet, sheetTables),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 934 | <code>        formulas,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 935 | <code>        formulaErrors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 936 | <code>        comments: collectComments(sheet),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 937 | <code>        dataValidations: summarizeDataValidations(sheet),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 938 | <code>        conditionalFormattings: summarizeConditionalFormattings(sheet),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 939 | <code>        views: clonePlain(sheet.views &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 940 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 941 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 942 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 943 | <code>function buildXlsxInspectView(workbookSummary, input = {}) {</code> | 定义函数 `buildXlsxInspectView`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 944 | <code>    const kind = normalizeXlsxInspectKind(input);</code> | 声明局部标识符 `kind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 945 | <code>    const target = input.target &#124;&#124; input.range &#124;&#124; '';</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 946 | <code>    const defaultSheetName = input.sheetName &#124;&#124; input.sheet &#124;&#124; workbookSummary.workbook.sheetNames[0] &#124;&#124; '';</code> | 声明局部标识符 `defaultSheetName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 947 | <code>    const parsedTarget = parseWorkbookTarget(target, defaultSheetName);</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 948 | <code>    const sheet = workbookSummary.sheets.find((entry) =&gt; entry.name === parsedTarget.sheetName) &#124;&#124; workbookSummary.sheets[0];</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 949 | <code>    if (kind === 'workbook' &#124;&#124; kind === 'summary') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 950 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 951 | <code>            kind: 'workbook',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 952 | <code>            workbook: workbookSummary.workbook,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 953 | <code>            sheets: workbookSummary.sheets.map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 954 | <code>                name: entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 955 | <code>                state: entry.state &#124;&#124; 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 956 | <code>                hidden: entry.hidden === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 957 | <code>                usedRange: entry.usedRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 958 | <code>                rowCount: entry.rowCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 959 | <code>                columnCount: entry.columnCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 960 | <code>                hiddenRowCount: entry.hiddenRows?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 961 | <code>                hiddenColumnCount: entry.hiddenColumns?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 962 | <code>                tableCount: entry.tables.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 963 | <code>                mergeCount: entry.merges.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 964 | <code>                formulaCount: entry.formulas.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 965 | <code>                formulaErrorCount: entry.formulaErrors.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 966 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 967 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 969 | <code>    if (!sheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 970 | <code>        return { kind, diagnostics: [createDiagnostic('sheet_not_found', 'error', `No worksheet matched target: ${target}`)] };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 971 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 972 | <code>    if (kind === 'sheet') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 973 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 974 | <code>            kind: 'sheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 975 | <code>            sheet</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 976 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 977 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 978 | <code>    if (kind === 'range' &#124;&#124; kind === 'table' &#124;&#124; kind === 'style' &#124;&#124; kind === 'computedstyle') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 979 | <code>        const bounds = parseRangeRef(parsedTarget.rangeRef) &#124;&#124; sheet.dimensions;</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 980 | <code>        const rangeCells = sheet.cells.filter((cell) =&gt; {</code> | 声明局部标识符 `rangeCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 981 | <code>            const parsed = parseCellRef(cell.ref);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 982 | <code>            return parsed</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 983 | <code>                &amp;&amp; parsed.row &gt;= bounds.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 984 | <code>                &amp;&amp; parsed.row &lt;= bounds.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 985 | <code>                &amp;&amp; parsed.col &gt;= bounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 986 | <code>                &amp;&amp; parsed.col &lt;= bounds.endCol;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 987 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 989 | <code>            kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 990 | <code>            sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 991 | <code>            target: `${sheet.name}!${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(bounds.endRow, bounds.endCol)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 992 | <code>            rows: bounds.endRow - bounds.startRow + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 993 | <code>            cols: bounds.endCol - bounds.startCol + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 994 | <code>            cells: rangeCells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 995 | <code>            tables: sheet.tables.filter((table) =&gt; !table.ref &#124;&#124; table.ref === parsedTarget.rangeRef),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 996 | <code>            merges: sheet.merges.filter((merge) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 997 | <code>                const mergeBounds = parseRangeRef(merge);</code> | 声明局部标识符 `mergeBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 998 | <code>                return mergeBounds</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 999 | <code>                    &amp;&amp; mergeBounds.endRow &gt;= bounds.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1000 | <code>                    &amp;&amp; mergeBounds.startRow &lt;= bounds.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1001 | <code>                    &amp;&amp; mergeBounds.endCol &gt;= bounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1002 | <code>                    &amp;&amp; mergeBounds.startCol &lt;= bounds.endCol;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1003 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1004 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1005 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>    if (kind === 'formula' &#124;&#124; kind === 'formulas') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1007 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1008 | <code>            kind: 'formula',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1009 | <code>            sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1010 | <code>            formulas: sheet.formulas,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1011 | <code>            formulaErrors: sheet.formulaErrors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1012 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1013 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1014 | <code>    if (kind === 'comment' &#124;&#124; kind === 'comments') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1015 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1016 | <code>            kind: 'comment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1017 | <code>            comments: workbookSummary.sheets.flatMap((entry) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1018 | <code>                (entry.comments &#124;&#124; []).map((comment) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1019 | <code>                    sheetName: entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1020 | <code>                    ref: `${entry.name}!${comment.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1021 | <code>                    text: comment.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1022 | <code>                    note: comment.note</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1023 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1024 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1025 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1026 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1027 | <code>    if (kind === 'visibility' &#124;&#124; kind === 'hidden' &#124;&#124; kind === 'hiddenrows' &#124;&#124; kind === 'hiddencolumns') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1028 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1029 | <code>            kind: 'visibility',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1030 | <code>            sheets: workbookSummary.sheets.map((entry) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1031 | <code>                name: entry.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1032 | <code>                state: entry.state &#124;&#124; 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1033 | <code>                hidden: entry.hidden === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1034 | <code>                hiddenRows: entry.hiddenRows &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1035 | <code>                hiddenColumns: entry.hiddenColumns &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1036 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1037 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1038 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1039 | <code>    if (kind === 'definedname' &#124;&#124; kind === 'definednames' &#124;&#124; kind === 'defined_name' &#124;&#124; kind === 'defined_names') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1040 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1041 | <code>            kind: 'definedName',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1042 | <code>            definedNames: workbookSummary.workbook.definedNames &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1043 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1044 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1045 | <code>    if (kind === 'relationship' &#124;&#124; kind === 'relationships') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1046 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1047 | <code>            kind: 'relationship',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1048 | <code>            relationships: workbookSummary.workbook.inventory?.relationships &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1049 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1050 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1051 | <code>    if (kind === 'chart' &#124;&#124; kind === 'charts') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1052 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1053 | <code>            kind: 'chart',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1054 | <code>            charts: workbookSummary.workbook.inventory?.charts &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1055 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1056 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1057 | <code>    if (kind === 'image' &#124;&#124; kind === 'images') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1058 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1059 | <code>            kind: 'image',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1060 | <code>            images: workbookSummary.workbook.inventory?.images &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1061 | <code>            imageAnchors: workbookSummary.workbook.inventory?.imageAnchors &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1062 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1063 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1064 | <code>    if (kind === 'shape' &#124;&#124; kind === 'shapes' &#124;&#124; kind === 'drawing' &#124;&#124; kind === 'drawings') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1065 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1066 | <code>            kind: 'shape',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1067 | <code>            drawings: workbookSummary.workbook.inventory?.drawings &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1068 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1069 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1070 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1071 | <code>        kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1072 | <code>        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1073 | <code>        diagnostics: [createDiagnostic('unsupported_xlsx_inspect_kind', 'warning', `Unsupported XLSX inspect kind: ${kind}`)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1074 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1076 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1077 | <code>function validateXlsxInspection(workbookSummary = {}) {</code> | 定义函数 `validateXlsxInspection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1078 | <code>    const diagnostics = [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1079 | <code>    const sheets = workbookSummary.sheets &#124;&#124; [];</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1080 | <code>    if (!sheets.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1081 | <code>        diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1082 | <code>            'xlsx_no_worksheets',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1083 | <code>            'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1084 | <code>            'Workbook contains no worksheets.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1085 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1086 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>    for (const sheet of sheets) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1088 | <code>        if (!sheet.usedRange) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1089 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1090 | <code>                'xlsx_blank_sheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1091 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1092 | <code>                `Worksheet ${sheet.name} has no used range.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1093 | <code>                { sheetName: sheet.name }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1094 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1095 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1096 | <code>        for (const error of sheet.formulaErrors &#124;&#124; []) {</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1097 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1098 | <code>                'xlsx_formula_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1099 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1100 | <code>                `Formula or cell at ${sheet.name}!${error.ref} contains ${error.error}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1101 | <code>                { sheetName: sheet.name, ref: error.ref, formula: error.formula, error: error.error }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1102 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1103 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1104 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1105 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1106 | <code>        status: diagnostics.some((entry) =&gt; entry.severity === 'error' &#124;&#124; entry.severity === 'fatal') ? 'failed' : 'passed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1107 | <code>        checks: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1108 | <code>            sheetCount: sheets.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1109 | <code>            formulaErrorCount: sheets.reduce((sum, sheet) =&gt; sum + (sheet.formulaErrors?.length &#124;&#124; 0), 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1110 | <code>            blankSheetCount: sheets.filter((sheet) =&gt; !sheet.usedRange).length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1111 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1112 | <code>        diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1113 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1114 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1116 | <code>function getNeighborRefs(ref) {</code> | 定义函数 `getNeighborRefs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1117 | <code>    const parsed = parseCellRef(ref);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1118 | <code>    if (!parsed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1119 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1120 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1121 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1122 | <code>        cellRef(parsed.row - 1, parsed.col),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1123 | <code>        cellRef(parsed.row + 1, parsed.col),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1124 | <code>        cellRef(parsed.row, parsed.col - 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1125 | <code>        cellRef(parsed.row, parsed.col + 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1126 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1129 | <code>function solveWorkbookMapPath(sheetSummary, expected = {}) {</code> | 定义函数 `solveWorkbookMapPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1130 | <code>    const config = expected.mapPath;</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1131 | <code>    if (!config) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1132 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1133 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1134 | <code>    const obstacleColor = normalizeHex(config.obstacleColor &#124;&#124; '0099FF');</code> | 声明局部标识符 `obstacleColor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1135 | <code>    const startText = String(config.startText &#124;&#124; 'START').toUpperCase();</code> | 声明局部标识符 `startText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1136 | <code>    const endText = String(config.endText &#124;&#124; 'END').toUpperCase();</code> | 声明局部标识符 `endText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1137 | <code>    const diagnostics = [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1138 | <code>    const cellsByRef = new Map(sheetSummary.cells.map((entry) =&gt; [entry.ref, entry]));</code> | 声明局部标识符 `cellsByRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1139 | <code>    const walkable = new Map(sheetSummary.cells</code> | 声明局部标识符 `walkable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1140 | <code>        .filter((entry) =&gt; entry.fillRgb &amp;&amp; normalizeHex(entry.fillRgb) !== obstacleColor)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1141 | <code>        .map((entry) =&gt; [entry.ref, entry]));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1142 | <code>    const start = [...walkable.values()].find((entry) =&gt; getPrimitiveText(entry.value ?? entry.text).toUpperCase() === startText);</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1143 | <code>    const end = [...walkable.values()].find((entry) =&gt; getPrimitiveText(entry.value ?? entry.text).toUpperCase() === endText);</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1144 | <code>    if (!start &#124;&#124; !end) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1145 | <code>        diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1146 | <code>            'map_start_or_end_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1147 | <code>            'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1148 | <code>            'Map path inspection could not find the configured START or END cell.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1149 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1150 | <code>        return { diagnostics, path: [], landed: null };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1151 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1152 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1153 | <code>    const pathRefs = [];</code> | 声明局部标识符 `pathRefs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1154 | <code>    const visited = new Set();</code> | 声明局部标识符 `visited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1155 | <code>    let previous = '';</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1156 | <code>    let current = start.ref;</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1157 | <code>    for (let guard = 0; guard &lt; walkable.size + 5; guard += 1) {</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1158 | <code>        pathRefs.push(current);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1159 | <code>        visited.add(current);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1160 | <code>        if (current === end.ref) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1161 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1162 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1163 | <code>        const candidates = getNeighborRefs(current)</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1164 | <code>            .filter((ref) =&gt; walkable.has(ref))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1165 | <code>            .filter((ref) =&gt; ref !== previous);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1166 | <code>        const unvisitedCandidates = candidates.filter((ref) =&gt; !visited.has(ref));</code> | 声明局部标识符 `unvisitedCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1167 | <code>        if (unvisitedCandidates.length !== 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1168 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1169 | <code>                unvisitedCandidates.length === 0 ? 'map_path_dead_end' : 'map_path_branch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1170 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1171 | <code>                `Map path walk found ${unvisitedCandidates.length} forward candidates at ${current}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1172 | <code>                { current, candidates: unvisitedCandidates }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1173 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1174 | <code>            if (!unvisitedCandidates.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1175 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1176 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1177 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1178 | <code>        previous = current;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1179 | <code>        current = unvisitedCandidates[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1180 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1181 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1182 | <code>    const targetIndex = Number(config.turns &#124;&#124; 0) * Number(config.cellsPerTurn &#124;&#124; 1);</code> | 声明局部标识符 `targetIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1183 | <code>    const landedRef = pathRefs[targetIndex] &#124;&#124; '';</code> | 声明局部标识符 `landedRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1184 | <code>    const landed = landedRef ? cellsByRef.get(landedRef) : null;</code> | 声明局部标识符 `landed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1185 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1186 | <code>        diagnostics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1187 | <code>        startCell: start.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1188 | <code>        endCell: end.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1189 | <code>        path: pathRefs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1190 | <code>        targetIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1191 | <code>        landed: landed ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1192 | <code>            ref: landed.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1193 | <code>            row: landed.row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1194 | <code>            col: landed.col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1195 | <code>            value: landed.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1196 | <code>            fillRgb: landed.fillRgb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1197 | <code>        } : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1198 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1199 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1201 | <code>function buildXlsxCellIndex(workbookSummary = {}) {</code> | 定义函数 `buildXlsxCellIndex`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1202 | <code>    const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1203 | <code>    for (const sheet of workbookSummary.sheets &#124;&#124; []) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1204 | <code>        const errorsByRef = new Map((sheet.formulaErrors &#124;&#124; []).map((entry) =&gt; [entry.ref, entry]));</code> | 声明局部标识符 `errorsByRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1205 | <code>        const commentsByRef = new Map((sheet.comments &#124;&#124; []).map((entry) =&gt; [entry.ref, entry]));</code> | 声明局部标识符 `commentsByRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1206 | <code>        const formulasByRef = new Map((sheet.formulas &#124;&#124; []).map((entry) =&gt; [entry.ref, entry]));</code> | 声明局部标识符 `formulasByRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1207 | <code>        const hiddenRows = new Set((sheet.hiddenRows &#124;&#124; []).map((entry) =&gt; Number(entry.row)));</code> | 声明局部标识符 `hiddenRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1208 | <code>        const hiddenColumns = new Set((sheet.hiddenColumns &#124;&#124; []).map((entry) =&gt; Number(entry.col)));</code> | 声明局部标识符 `hiddenColumns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1209 | <code>        const tableRefs = (sheet.tables &#124;&#124; []).map((table) =&gt; ({</code> | 声明局部标识符 `tableRefs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1210 | <code>            name: table.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1211 | <code>            ref: table.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1212 | <code>            bounds: parseRangeRef(table.ref)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1213 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1214 | <code>        const mergeRefs = (sheet.merges &#124;&#124; []).map((merge) =&gt; ({</code> | 声明局部标识符 `mergeRefs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1215 | <code>            ref: merge,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1216 | <code>            bounds: parseRangeRef(merge)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1217 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1218 | <code>        for (const cell of sheet.cells &#124;&#124; []) {</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1219 | <code>            const parsed = parseCellRef(cell.ref);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1220 | <code>            const tableNames = tableRefs</code> | 声明局部标识符 `tableNames`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1221 | <code>                .filter((table) =&gt; table.bounds &amp;&amp; parsed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1222 | <code>                    &amp;&amp; parsed.row &gt;= table.bounds.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1223 | <code>                    &amp;&amp; parsed.row &lt;= table.bounds.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1224 | <code>                    &amp;&amp; parsed.col &gt;= table.bounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1225 | <code>                    &amp;&amp; parsed.col &lt;= table.bounds.endCol)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1226 | <code>                .map((table) =&gt; table.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1227 | <code>                .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1228 | <code>            const mergeMatches = mergeRefs</code> | 声明局部标识符 `mergeMatches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1229 | <code>                .filter((merge) =&gt; merge.bounds &amp;&amp; parsed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1230 | <code>                    &amp;&amp; parsed.row &gt;= merge.bounds.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1231 | <code>                    &amp;&amp; parsed.row &lt;= merge.bounds.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1232 | <code>                    &amp;&amp; parsed.col &gt;= merge.bounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1233 | <code>                    &amp;&amp; parsed.col &lt;= merge.bounds.endCol)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1234 | <code>                .map((merge) =&gt; merge.ref);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1235 | <code>            cells.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1236 | <code>                kind: 'cell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1237 | <code>                sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1238 | <code>                sheetState: sheet.state &#124;&#124; 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1239 | <code>                hiddenSheet: sheet.hidden === true &#124;&#124; Boolean(sheet.state &amp;&amp; sheet.state !== 'visible'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1240 | <code>                ref: cell.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1241 | <code>                fullRef: `${sheet.name}!${cell.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1242 | <code>                row: cell.row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1243 | <code>                col: cell.col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1244 | <code>                hiddenRow: hiddenRows.has(Number(cell.row)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1245 | <code>                hiddenColumn: hiddenColumns.has(Number(cell.col)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1246 | <code>                hidden: sheet.hidden === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1247 | <code>                    &#124;&#124; Boolean(sheet.state &amp;&amp; sheet.state !== 'visible')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1248 | <code>                    &#124;&#124; hiddenRows.has(Number(cell.row))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1249 | <code>                    &#124;&#124; hiddenColumns.has(Number(cell.col)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1250 | <code>                text: cell.text &#124;&#124; getPrimitiveText(cell.value),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1251 | <code>                value: clonePlain(cell.value),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1252 | <code>                formula: cell.formula &#124;&#124; formulasByRef.get(cell.ref)?.formula &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1253 | <code>                result: clonePlain(cell.result ?? formulasByRef.get(cell.ref)?.result),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1254 | <code>                error: cell.error &#124;&#124; errorsByRef.get(cell.ref)?.error &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1255 | <code>                fillRgb: normalizeHex(cell.fillRgb &#124;&#124; cell.style?.fillRgb &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1256 | <code>                style: cell.style &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1257 | <code>                comment: cell.comment &#124;&#124; commentsByRef.get(cell.ref)?.text &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1258 | <code>                note: cell.note &#124;&#124; commentsByRef.get(cell.ref)?.note &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1259 | <code>                dataValidation: cell.dataValidation &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1260 | <code>                tableNames,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1261 | <code>                mergeRefs: mergeMatches</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1262 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1263 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1264 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1265 | <code>    return cells;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1266 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1268 | <code>function buildXlsxIndexSummary(workbookSummary = {}, cellIndex = []) {</code> | 定义函数 `buildXlsxIndexSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1269 | <code>    const formulaCount = cellIndex.filter((cell) =&gt; cell.formula).length;</code> | 声明局部标识符 `formulaCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1270 | <code>    const errorCount = cellIndex.filter((cell) =&gt; cell.error).length;</code> | 声明局部标识符 `errorCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1271 | <code>    const styledCellCount = cellIndex.filter((cell) =&gt; cell.fillRgb &#124;&#124; Object.keys(cell.style &#124;&#124; {}).length).length;</code> | 声明局部标识符 `styledCellCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1272 | <code>    const textCellCount = cellIndex.filter((cell) =&gt; cell.text).length;</code> | 声明局部标识符 `textCellCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1273 | <code>    const tableCount = (workbookSummary.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.tables?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `tableCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1274 | <code>    const mergeCount = (workbookSummary.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.merges?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `mergeCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1275 | <code>    const commentCount = (workbookSummary.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.comments?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `commentCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1276 | <code>    const hiddenSheetCount = (workbookSummary.sheets &#124;&#124; []).filter((sheet) =&gt; sheet.hidden === true &#124;&#124; (sheet.state &amp;&amp; sheet.state !== 'visible')).length;</code> | 声明局部标识符 `hiddenSheetCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1277 | <code>    const hiddenRowCount = (workbookSummary.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.hiddenRows?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `hiddenRowCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1278 | <code>    const hiddenColumnCount = (workbookSummary.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.hiddenColumns?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `hiddenColumnCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1279 | <code>    const tableRangeCount = (workbookSummary.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.tables &#124;&#124; []).filter((table) =&gt; table.ref).length, 0);</code> | 声明局部标识符 `tableRangeCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1280 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1281 | <code>        sheetCount: workbookSummary.workbook?.sheetCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1282 | <code>        indexedCellCount: cellIndex.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1283 | <code>        textCellCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1284 | <code>        styledCellCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1285 | <code>        formulaCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1286 | <code>        formulaErrorCount: errorCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1287 | <code>        tableCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1288 | <code>        tableRangeCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1289 | <code>        mergeCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1290 | <code>        commentCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1291 | <code>        hiddenSheetCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1292 | <code>        hiddenRowCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1293 | <code>        hiddenColumnCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1294 | <code>        definedNameCount: workbookSummary.workbook?.definedNames?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1295 | <code>        relationshipCount: workbookSummary.workbook?.inventory?.relationships?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1296 | <code>        chartCount: workbookSummary.workbook?.inventory?.charts?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1297 | <code>        imageCount: workbookSummary.workbook?.inventory?.images?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1298 | <code>        imageAnchorCount: workbookSummary.workbook?.inventory?.imageAnchors?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1299 | <code>        drawingCount: workbookSummary.workbook?.inventory?.drawings?.length &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1300 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1301 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1303 | <code>function createWorkbookSummaryFromIndex(index = {}, expected = {}) {</code> | 定义函数 `createWorkbookSummaryFromIndex`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1304 | <code>    const summary = clonePlain(index.structure &#124;&#124; { workbook: {}, sheets: [] });</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1305 | <code>    summary.sheets = (summary.sheets &#124;&#124; []).map((sheet) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1306 | <code>        ...sheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1307 | <code>        mapPath: solveWorkbookMapPath(sheet, expected &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1308 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1309 | <code>    return summary;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1310 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1312 | <code>function compactCandidate(match = {}) {</code> | 定义函数 `compactCandidate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1313 | <code>    const base = {</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1314 | <code>        kind: match.kind &#124;&#124; match.type &#124;&#124; 'match',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1315 | <code>        ref: match.fullRef &#124;&#124; match.ref &#124;&#124; match.name &#124;&#124; match.part &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1316 | <code>        sheetName: match.sheetName &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1317 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1318 | <code>    for (const key of [</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1319 | <code>        'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1320 | <code>        'cellText',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1321 | <code>        'value',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1322 | <code>        'formula',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1323 | <code>        'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1324 | <code>        'fillRgb',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1325 | <code>        'name',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1326 | <code>        'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1327 | <code>        'fullRange',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1328 | <code>        'target',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1329 | <code>        'part',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1330 | <code>        'mediaPart',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1331 | <code>        'drawingPart',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1332 | <code>        'reason',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1333 | <code>        'row',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1334 | <code>        'col',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1335 | <code>        'sheetState',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1336 | <code>        'hidden',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1337 | <code>        'hiddenRow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1338 | <code>        'hiddenColumn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1339 | <code>        'comment'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1340 | <code>    ]) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1341 | <code>        if (typeof match[key] !== 'undefined' &amp;&amp; match[key] !== '') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1342 | <code>            base[key] = match[key];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1343 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1344 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1345 | <code>    if (match.tableNames?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1346 | <code>        base.tableNames = match.tableNames;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1347 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1348 | <code>    if (match.mergeRefs?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1349 | <code>        base.mergeRefs = match.mergeRefs;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1350 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1351 | <code>    return base;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1352 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1353 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1354 | <code>function compactMatrixValue(value) {</code> | 定义函数 `compactMatrixValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1355 | <code>    if (value === null &#124;&#124; typeof value === 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1356 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1357 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1358 | <code>    if (typeof value === 'number' &#124;&#124; typeof value === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1359 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1360 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1361 | <code>    if (value instanceof Date) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1362 | <code>        return value.toISOString();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1363 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1364 | <code>    if (typeof value === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1365 | <code>        const text = value.text ?? value.result ?? value.hyperlink ?? value.error;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1366 | <code>        if (typeof text !== 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1367 | <code>            return compactMatrixValue(text);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1368 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1369 | <code>        const serialized = JSON.stringify(value);</code> | 声明局部标识符 `serialized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1370 | <code>        return serialized &amp;&amp; serialized.length &gt; 80 ? `${serialized.slice(0, 77)}...` : serialized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1371 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1372 | <code>    return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1373 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1375 | <code>function buildRangeMatrixRows(query = {}) {</code> | 定义函数 `buildRangeMatrixRows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1376 | <code>    const rows = Array.isArray(query.rows) ? query.rows : [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1377 | <code>    const rowCount = Number(query.rowCount &#124;&#124; rows.length &#124;&#124; 0);</code> | 声明局部标识符 `rowCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1378 | <code>    const columnCount = Number(query.columnCount &#124;&#124; query.columns?.length &#124;&#124; 0);</code> | 声明局部标识符 `columnCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1379 | <code>    const maxMatrixCells = clampNumber(query.maxMatrixCells &#124;&#124; query.max_matrix_cells, 250, 1, 2000);</code> | 声明局部标识符 `maxMatrixCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1380 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1381 | <code>        !rows.length &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1382 | <code>        !Number.isFinite(rowCount) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1383 | <code>        !Number.isFinite(columnCount) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1384 | <code>        rowCount * columnCount &gt; maxMatrixCells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1385 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1386 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1387 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1388 | <code>    return rows.map((row) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1389 | <code>        const cells = Array.isArray(row.cells) ? row.cells : [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1390 | <code>        const values = cells.map((cell) =&gt; compactMatrixValue(cell.text &#124;&#124; cell.value &#124;&#124; ''));</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1391 | <code>        const fills = cells.map((cell) =&gt; normalizeHex(cell.fillRgb &#124;&#124; ''));</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1392 | <code>        const formulas = cells.map((cell) =&gt; cell.formula &#124;&#124; '');</code> | 声明局部标识符 `formulas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1393 | <code>        const errors = cells.map((cell) =&gt; cell.error &#124;&#124; '');</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1394 | <code>        const output = {</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1395 | <code>            rowNumber: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1396 | <code>            values,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1397 | <code>            fills</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1398 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1399 | <code>        if (formulas.some(Boolean)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1400 | <code>            output.formulas = formulas;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1401 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1402 | <code>        if (errors.some(Boolean)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1403 | <code>            output.errors = errors;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1404 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1405 | <code>        return output;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1406 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1407 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1409 | <code>function buildRangeAnchors(matrixRows = [], columns = [], sheetName = '') {</code> | 定义函数 `buildRangeAnchors`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1410 | <code>    const anchors = [];</code> | 声明局部标识符 `anchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1411 | <code>    for (const row of Array.isArray(matrixRows) ? matrixRows : []) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1412 | <code>        const values = Array.isArray(row.values) ? row.values : [];</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1413 | <code>        const fills = Array.isArray(row.fills) ? row.fills : [];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1414 | <code>        const formulas = Array.isArray(row.formulas) ? row.formulas : [];</code> | 声明局部标识符 `formulas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1415 | <code>        const errors = Array.isArray(row.errors) ? row.errors : [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1416 | <code>        for (let index = 0; index &lt; Math.max(values.length, fills.length, formulas.length, errors.length); index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1417 | <code>            const column = columns[index] &#124;&#124; colName(index + 1);</code> | 声明局部标识符 `column`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1418 | <code>            const ref = `${sheetName ? `${sheetName}!` : ''}${column}${row.rowNumber}`;</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1419 | <code>            const value = values[index];</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1420 | <code>            const formula = formulas[index] &#124;&#124; '';</code> | 声明局部标识符 `formula`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1421 | <code>            const error = errors[index] &#124;&#124; '';</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1422 | <code>            const fillRgb = normalizeHex(fills[index] &#124;&#124; '');</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1423 | <code>            const text = String(value ?? '').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1424 | <code>            if (!text &amp;&amp; !formula &amp;&amp; !error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1425 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1426 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1427 | <code>            anchors.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1428 | <code>                ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1429 | <code>                row: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1430 | <code>                col: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1431 | <code>                value: text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1432 | <code>                fillRgb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1433 | <code>                formula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1434 | <code>                error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1435 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1436 | <code>            if (anchors.length &gt;= 40) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1437 | <code>                return anchors;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1438 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1439 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1440 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1441 | <code>    return anchors;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1442 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1443 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1444 | <code>function buildFillLegend(fillHistogram = {}) {</code> | 定义函数 `buildFillLegend`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1445 | <code>    return Object.entries(fillHistogram &#124;&#124; {})</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1446 | <code>        .map(([fillRgb, count]) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1447 | <code>            fillRgb: normalizeHex(fillRgb),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1448 | <code>            count: Number(count &#124;&#124; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1449 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1450 | <code>        .filter((entry) =&gt; entry.fillRgb)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1451 | <code>        .sort((left, right) =&gt; right.count - left.count &#124;&#124; left.fillRgb.localeCompare(right.fillRgb));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1452 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1453 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1454 | <code>function buildRangeReadingGuide(query = {}, compactRows = [], matrixRows = []) {</code> | 定义函数 `buildRangeReadingGuide`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1455 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1456 | <code>        completeCompactRows: query.truncated !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1457 | <code>        rowDisplayRule: 'compactRows cells are left-to-right display values; color-only cells are shown as #RRGGBB.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1458 | <code>        matrixRowsSchema: 'rows[].{rowNumber, values[], fills[], formulas?, errors?}; ref = columns[index] + rowNumber'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1459 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1462 | <code>function buildCompactXlsxObservation(input = {}) {</code> | 定义函数 `buildCompactXlsxObservation`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1463 | <code>    const index = input.index &#124;&#124; {};</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1464 | <code>    const matches = input.matches &#124;&#124; [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1465 | <code>    const workbook = index.structure?.workbook &#124;&#124; {};</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1466 | <code>    const sheets = (index.structure?.sheets &#124;&#124; []).map((sheet) =&gt; ({</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1467 | <code>        name: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1468 | <code>        state: sheet.state &#124;&#124; 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1469 | <code>        hidden: sheet.hidden === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1470 | <code>        usedRange: sheet.usedRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1471 | <code>        formulaCount: sheet.formulas?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1472 | <code>        formulaErrorCount: sheet.formulaErrors?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1473 | <code>        tableCount: sheet.tables?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1474 | <code>        mergeCount: sheet.merges?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1475 | <code>        commentCount: sheet.comments?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1476 | <code>        hiddenRowCount: sheet.hiddenRows?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1477 | <code>        hiddenColumnCount: sheet.hiddenColumns?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1478 | <code>        fillHistogram: sheet.fillHistogram &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1479 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1480 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1481 | <code>        schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1482 | <code>        format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1483 | <code>        action: input.action &#124;&#124; 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1484 | <code>        sourcePath: index.sourcePath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1485 | <code>        cache: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1486 | <code>            indexHit: index.cacheHit === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1487 | <code>            signature: index.signature &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1488 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1489 | <code>        workbook: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1490 | <code>            sheetCount: workbook.sheetCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1491 | <code>            sheetNames: workbook.sheetNames &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1492 | <code>            definedNameCount: workbook.definedNames?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1493 | <code>            relationshipCount: workbook.inventory?.relationships?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1494 | <code>            imageAnchorCount: workbook.inventory?.imageAnchors?.length &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1495 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1496 | <code>        indexSummary: index.summary &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1497 | <code>        sheets,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1498 | <code>        query: input.query &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1499 | <code>        candidateCount: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1500 | <code>        candidates: matches.slice(0, clampNumber(input.maxCandidates, 20, 1, 100)).map(compactCandidate),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1501 | <code>        diagnostics: (input.diagnostics &#124;&#124; []).slice(0, 20).map((diagnostic) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1502 | <code>            code: diagnostic.code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1503 | <code>            severity: diagnostic.severity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1504 | <code>            message: diagnostic.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1505 | <code>            target: diagnostic.target &#124;&#124; diagnostic.details?.target &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1506 | <code>        })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1507 | <code>        nextSearchKinds: ['text', 'style', 'formula', 'error', 'table', 'merge', 'comment', 'definedName', 'relationship', 'hidden', 'image']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1508 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1509 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1511 | <code>async function indexXlsxArtifact(input = {}) {</code> | 定义函数 `indexXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1512 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1513 | <code>    const signature = await getFileSignature(sourcePath);</code> | 声明局部标识符 `signature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1514 | <code>    const cacheKey = buildCacheKey(['xlsx-index', sourcePath, signature.size, signature.mtimeMs]);</code> | 声明局部标识符 `cacheKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1515 | <code>    const cached = XLSX_INDEX_CACHE.get(cacheKey);</code> | 声明局部标识符 `cached`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1516 | <code>    if (cached &amp;&amp; input.refreshIndex !== true &amp;&amp; input.refresh_index !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1517 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1518 | <code>            ...cached,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1519 | <code>            cacheHit: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1520 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1521 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1522 | <code>    const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1523 | <code>    await workbook.xlsx.readFile(sourcePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1524 | <code>    const include = normalizeInclude(input.include, ['values', 'formulas', 'styles', 'comments', 'validation']);</code> | 声明局部标识符 `include`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1525 | <code>    const archive = await readZipEntries(sourcePath, [</code> | 声明局部标识符 `archive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1526 | <code>        '\\.rels$',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1527 | <code>        '^xl/drawings/.*\\.xml$',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1528 | <code>        '^xl/charts/.*\\.xml$',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1529 | <code>        '^xl/tables/table\\d+\\.xml$',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1530 | <code>        '^xl/comments\\d+\\.xml$',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1531 | <code>        '^xl/threadedComments/.*\\.xml$',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1532 | <code>        '^xl/workbook\\.xml$'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1533 | <code>    ]).catch((error) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1534 | <code>        names: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1535 | <code>        entries: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1536 | <code>        diagnostics: [createDiagnostic('xlsx_package_inventory_failed', 'warning', `XLSX package inventory failed: ${error.message &#124;&#124; String(error)}`)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1537 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1538 | <code>    const packageInventory = buildXlsxPackageInventory(archive, workbook);</code> | 声明局部标识符 `packageInventory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1539 | <code>    const parsedTarget = parseWorkbookTarget(input.target &#124;&#124; input.range &#124;&#124; '', input.sheetName &#124;&#124; input.sheet &#124;&#124; workbook.worksheets[0]?.name &#124;&#124; '');</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1540 | <code>    const targetBounds = parseRangeRef(parsedTarget.rangeRef);</code> | 声明局部标识符 `targetBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1541 | <code>    const maxRows = input.indexMaxRows &#124;&#124; input.index_max_rows &#124;&#124; input.maxRows &#124;&#124; 1000;</code> | 声明局部标识符 `maxRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1542 | <code>    const maxCols = input.indexMaxCols &#124;&#124; input.index_max_cols &#124;&#124; input.maxCols &#124;&#124; 200;</code> | 声明局部标识符 `maxCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1543 | <code>    const sheets = workbook.worksheets.map((sheet) =&gt; {</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1544 | <code>        const shouldUseTargetBounds = parsedTarget.sheetName &amp;&amp; parsedTarget.sheetName === sheet.name &amp;&amp; targetBounds &amp;&amp; input.indexTargetOnly === true;</code> | 声明局部标识符 `shouldUseTargetBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1545 | <code>        return summarizeWorksheet(sheet, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1546 | <code>            include: [...include],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1547 | <code>            bounds: shouldUseTargetBounds ? targetBounds : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1548 | <code>            maxRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1549 | <code>            maxCols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1550 | <code>            includeEmpty: input.includeEmpty === true &#124;&#124; input.include_empty === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1551 | <code>            tableInventory: packageInventory.tables &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1552 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1553 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1554 | <code>    const workbookSummary = {</code> | 声明局部标识符 `workbookSummary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1555 | <code>        workbook: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1556 | <code>            sheetCount: sheets.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1557 | <code>            sheetNames: sheets.map((sheet) =&gt; sheet.name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1558 | <code>            creator: workbook.creator &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1559 | <code>            lastModifiedBy: workbook.lastModifiedBy &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1560 | <code>            created: workbook.created ? workbook.created.toISOString?.() &#124;&#124; String(workbook.created) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1561 | <code>            modified: workbook.modified ? workbook.modified.toISOString?.() &#124;&#124; String(workbook.modified) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1562 | <code>            definedNames: summarizeDefinedNames(workbook),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1563 | <code>            inventory: packageInventory</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1564 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1565 | <code>        sheets</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1566 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1567 | <code>    const validation = validateXlsxInspection(workbookSummary);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1568 | <code>    const cellIndex = buildXlsxCellIndex(workbookSummary);</code> | 声明局部标识符 `cellIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1569 | <code>    const index = {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1570 | <code>        schema: 'ailis.xlsx.index.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1571 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1572 | <code>        format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1573 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1574 | <code>        signature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1575 | <code>        cacheKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1576 | <code>        cacheHit: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1577 | <code>        structure: workbookSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1578 | <code>        cellIndex,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1579 | <code>        summary: buildXlsxIndexSummary(workbookSummary, cellIndex),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1580 | <code>        validation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1581 | <code>        diagnostics: [...(archive.diagnostics &#124;&#124; []), ...validation.diagnostics]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1582 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1583 | <code>    XLSX_INDEX_CACHE.set(cacheKey, index);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1584 | <code>    return index;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1585 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1586 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1587 | <code>function matchText(haystack = '', needle = '', exact = false) {</code> | 定义函数 `matchText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1588 | <code>    const left = String(haystack ?? '');</code> | 声明局部标识符 `left`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1589 | <code>    const right = String(needle ?? '');</code> | 声明局部标识符 `right`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1590 | <code>    if (!right) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1591 | <code>        return Boolean(left);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1592 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1593 | <code>    return exact ? left === right : left.toLowerCase().includes(right.toLowerCase());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1594 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1595 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1596 | <code>function inTarget(cell = {}, targetBounds = null, targetSheetName = '') {</code> | 定义函数 `inTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1597 | <code>    if (!targetBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1598 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1599 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1600 | <code>    if (targetSheetName &amp;&amp; cell.sheetName !== targetSheetName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1601 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1602 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1603 | <code>    return cell.row &gt;= targetBounds.startRow</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1604 | <code>        &amp;&amp; cell.row &lt;= targetBounds.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1605 | <code>        &amp;&amp; cell.col &gt;= targetBounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1606 | <code>        &amp;&amp; cell.col &lt;= targetBounds.endCol;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1607 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1608 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1609 | <code>function rankXlsxMatch(match = {}, query = '') {</code> | 定义函数 `rankXlsxMatch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1610 | <code>    const queryText = String(query &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `queryText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1611 | <code>    let score = 0;</code> | 声明局部标识符 `score`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1612 | <code>    if (match.kind === 'error') score += 80;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1613 | <code>    if (match.kind === 'formula') score += 60;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1614 | <code>    if (match.kind === 'style') score += 50;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1615 | <code>    if (match.kind === 'text') score += 40;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1616 | <code>    const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1617 | <code>        match.fullRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1618 | <code>        match.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1619 | <code>        match.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1620 | <code>        match.cellText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1621 | <code>        match.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1622 | <code>        match.formula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1623 | <code>        match.comment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1624 | <code>        match.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1625 | <code>        match.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1626 | <code>        match.fullRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1627 | <code>        match.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1628 | <code>        match.part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1629 | <code>        match.mediaPart,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1630 | <code>        match.drawingPart</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1631 | <code>    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1632 | <code>        .map((entry) =&gt; String(entry ?? '').toLowerCase());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1633 | <code>    if (queryText &amp;&amp; text.some((entry) =&gt; entry === queryText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1634 | <code>        score += 100;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1635 | <code>    } else if (queryText &amp;&amp; text.some((entry) =&gt; entry.includes(queryText))) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1636 | <code>        score += 30;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1637 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>    return score;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1639 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1641 | <code>async function searchXlsxArtifact(input = {}) {</code> | 定义函数 `searchXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1642 | <code>    const index = await indexXlsxArtifact(input);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1643 | <code>    const kind = String(input.searchKind &#124;&#124; input.search_kind &#124;&#124; input.kind &#124;&#124; input.type &#124;&#124; 'all').toLowerCase();</code> | 声明局部标识符 `kind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1644 | <code>    const query = String(input.query ?? input.text ?? input.term ?? '').trim();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1645 | <code>    const fillRgb = normalizeHex(input.fillRgb &#124;&#124; input.fill &#124;&#124; input.color &#124;&#124; '');</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1646 | <code>    const errorQuery = String(input.error &#124;&#124; input.errorCode &#124;&#124; input.error_code &#124;&#124; '').toUpperCase();</code> | 声明局部标识符 `errorQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1647 | <code>    const exact = input.exact === true;</code> | 声明局部标识符 `exact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1648 | <code>    const parsedTarget = parseWorkbookTarget(input.target &#124;&#124; input.range &#124;&#124; '', input.sheetName &#124;&#124; input.sheet &#124;&#124; '');</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1649 | <code>    const targetBounds = parseRangeRef(parsedTarget.rangeRef);</code> | 声明局部标识符 `targetBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1650 | <code>    const maxResults = clampNumber(input.maxResults &#124;&#124; input.max_results &#124;&#124; input.limit, 50, 1, 500);</code> | 声明局部标识符 `maxResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1651 | <code>    const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1652 | <code>    const add = (match) =&gt; {</code> | 声明局部标识符 `add`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1653 | <code>        matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1654 | <code>            ...match,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1655 | <code>            score: rankXlsxMatch(match, query &#124;&#124; fillRgb &#124;&#124; errorQuery)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1656 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1657 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1658 | <code>    const cellKinds = new Set(['all', 'cell', 'cells', 'text', 'value', 'values']);</code> | 声明局部标识符 `cellKinds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1659 | <code>    const styleKinds = new Set(['all', 'style', 'styles', 'fill', 'color', 'computedstyle']);</code> | 声明局部标识符 `styleKinds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1660 | <code>    const formulaKinds = new Set(['all', 'formula', 'formulas']);</code> | 声明局部标识符 `formulaKinds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1661 | <code>    const errorKinds = new Set(['all', 'error', 'errors', 'formula_error', 'formulaerrors']);</code> | 声明局部标识符 `errorKinds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1662 | <code>    const commentKinds = new Set(['all', 'comment', 'comments']);</code> | 声明局部标识符 `commentKinds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1663 | <code>    const hiddenKinds = new Set(['all', 'hidden', 'visibility', 'hiddenrow', 'hiddenrows', 'hiddencolumn', 'hiddencolumns', 'sheetstate']);</code> | 声明局部标识符 `hiddenKinds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1664 | <code>    for (const cell of index.cellIndex &#124;&#124; []) {</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1665 | <code>        if (!inTarget(cell, targetBounds, parsedTarget.sheetName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1666 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1667 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1668 | <code>        if (cellKinds.has(kind) &amp;&amp; (matchText(cell.text, query, exact) &#124;&#124; matchText(cell.value, query, exact))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1669 | <code>            add({ ...cell, kind: 'text', reason: query ? 'text_match' : 'non_empty_text' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1670 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1671 | <code>        if (styleKinds.has(kind) &amp;&amp; cell.fillRgb &amp;&amp; (!fillRgb &#124;&#124; normalizeHex(cell.fillRgb) === fillRgb)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1672 | <code>            add({ ...cell, kind: 'style', reason: fillRgb ? 'fill_match' : 'styled_cell' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1673 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1674 | <code>        if (formulaKinds.has(kind) &amp;&amp; cell.formula &amp;&amp; matchText(cell.formula, query, exact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1675 | <code>            add({ ...cell, kind: 'formula', reason: query ? 'formula_match' : 'formula_cell' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1676 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1677 | <code>        if (errorKinds.has(kind) &amp;&amp; cell.error &amp;&amp; (!errorQuery &#124;&#124; cell.error.toUpperCase().includes(errorQuery))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1678 | <code>            add({ ...cell, kind: 'error', reason: errorQuery ? 'error_match' : 'formula_error' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1679 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1680 | <code>        if (commentKinds.has(kind) &amp;&amp; cell.comment &amp;&amp; matchText(cell.comment, query, exact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1681 | <code>            add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1682 | <code>                ...cell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1683 | <code>                kind: 'comment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1684 | <code>                cellText: cell.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1685 | <code>                text: cell.comment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1686 | <code>                reason: query ? 'comment_match' : 'comment_cell'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1687 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1688 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1689 | <code>        if (hiddenKinds.has(kind) &amp;&amp; cell.hidden) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1690 | <code>            const haystack = [</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1691 | <code>                cell.fullRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1692 | <code>                cell.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1693 | <code>                cell.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1694 | <code>                cell.formula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1695 | <code>                cell.comment,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1696 | <code>                cell.sheetState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1697 | <code>                cell.hiddenSheet ? 'hidden_sheet' : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1698 | <code>                cell.hiddenRow ? 'hidden_row' : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1699 | <code>                cell.hiddenColumn ? 'hidden_column' : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1700 | <code>            ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1701 | <code>            if (matchText(haystack, query, exact) &#124;&#124; !query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1702 | <code>                add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1703 | <code>                    ...cell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1704 | <code>                    kind: 'hidden',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1705 | <code>                    reason: cell.hiddenSheet</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1706 | <code>                        ? 'hidden_sheet_cell'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1707 | <code>                        : (cell.hiddenRow ? 'hidden_row_cell' : 'hidden_column_cell')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1708 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1709 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1710 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1711 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1712 | <code>    if (hiddenKinds.has(kind)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1713 | <code>        for (const sheet of index.structure.sheets &#124;&#124; []) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1714 | <code>            if (sheet.hidden === true &#124;&#124; (sheet.state &amp;&amp; sheet.state !== 'visible')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1715 | <code>                const haystack = [sheet.name, sheet.state, 'hidden sheet'].join('\n');</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1716 | <code>                if (matchText(haystack, query, exact) &#124;&#124; !query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1717 | <code>                    add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1718 | <code>                        kind: 'hiddenSheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1719 | <code>                        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1720 | <code>                        ref: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1721 | <code>                        sheetState: sheet.state &#124;&#124; 'visible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1722 | <code>                        hidden: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1723 | <code>                        reason: 'hidden_sheet'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1724 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1725 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1726 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1727 | <code>            for (const row of sheet.hiddenRows &#124;&#124; []) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1728 | <code>                const ref = `${sheet.name}!${row.range}`;</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1729 | <code>                if (matchText(ref, query, exact) &#124;&#124; !query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1730 | <code>                    add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1731 | <code>                        kind: 'hiddenRow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1732 | <code>                        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1733 | <code>                        ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1734 | <code>                        row: row.row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1735 | <code>                        hidden: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1736 | <code>                        reason: 'hidden_row'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1737 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1738 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1739 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1740 | <code>            for (const column of sheet.hiddenColumns &#124;&#124; []) {</code> | 声明局部标识符 `column`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1741 | <code>                const ref = `${sheet.name}!${column.range}`;</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1742 | <code>                if (matchText(ref, query, exact) &#124;&#124; !query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1743 | <code>                    add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1744 | <code>                        kind: 'hiddenColumn',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1745 | <code>                        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1746 | <code>                        ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1747 | <code>                        col: column.col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1748 | <code>                        hidden: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1749 | <code>                        reason: 'hidden_column'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1750 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1751 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1752 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1753 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1754 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1755 | <code>    if (['all', 'table', 'tables'].includes(kind)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1756 | <code>        for (const sheet of index.structure.sheets &#124;&#124; []) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1757 | <code>            for (const table of sheet.tables &#124;&#124; []) {</code> | 声明局部标识符 `table`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1758 | <code>                const haystack = [table.name, table.ref, ...(table.columns &#124;&#124; []).map((column) =&gt; column.name)].join('\n');</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1759 | <code>                if (matchText(haystack, query, exact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1760 | <code>                    add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1761 | <code>                        kind: 'table',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1762 | <code>                        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1763 | <code>                        name: table.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1764 | <code>                        ref: table.ref ? `${sheet.name}!${table.ref}` : sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1765 | <code>                        range: table.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1766 | <code>                        columns: table.columns &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1767 | <code>                        reason: query ? 'table_match' : 'table_inventory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1768 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1769 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1770 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1771 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1772 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1773 | <code>    if (['all', 'merge', 'merges', 'merged'].includes(kind)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1774 | <code>        for (const sheet of index.structure.sheets &#124;&#124; []) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1775 | <code>            for (const merge of sheet.merges &#124;&#124; []) {</code> | 声明局部标识符 `merge`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1776 | <code>                const fullRef = `${sheet.name}!${merge}`;</code> | 声明局部标识符 `fullRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1777 | <code>                if (matchText(fullRef, query, exact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1778 | <code>                    add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1779 | <code>                        kind: 'merge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1780 | <code>                        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1781 | <code>                        ref: fullRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1782 | <code>                        range: merge,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1783 | <code>                        reason: query ? 'merge_match' : 'merge_inventory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1784 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1785 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1786 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1787 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1788 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1789 | <code>    if (['all', 'definedname', 'definednames', 'defined_name', 'defined_names'].includes(kind)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1790 | <code>        for (const definedName of index.structure.workbook.definedNames &#124;&#124; []) {</code> | 声明局部标识符 `definedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1791 | <code>            const haystack = [definedName.name, ...(definedName.ranges &#124;&#124; [])].join('\n');</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1792 | <code>            if (matchText(haystack, query, exact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1793 | <code>                add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1794 | <code>                    kind: 'definedName',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1795 | <code>                    name: definedName.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1796 | <code>                    ranges: definedName.ranges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1797 | <code>                    ref: definedName.ranges?.[0] &#124;&#124; definedName.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1798 | <code>                    reason: query ? 'defined_name_match' : 'defined_name_inventory'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1799 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1800 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1801 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1802 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1803 | <code>    const inventory = index.structure.workbook.inventory &#124;&#124; {};</code> | 声明局部标识符 `inventory`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1804 | <code>    const inventorySearch = [</code> | 声明局部标识符 `inventorySearch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1805 | <code>        ['relationship', ['relationship', 'relationships'], inventory.relationships &#124;&#124; []],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1806 | <code>        ['chart', ['chart', 'charts'], inventory.charts &#124;&#124; []],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1807 | <code>        ['image', ['image', 'images'], inventory.images &#124;&#124; []],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1808 | <code>        ['imageAnchor', ['imageanchor', 'imageanchors', 'anchor', 'anchors'], inventory.imageAnchors &#124;&#124; []],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1809 | <code>        ['shape', ['shape', 'shapes', 'drawing', 'drawings'], inventory.drawings &#124;&#124; []]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1810 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1811 | <code>    for (const [inventoryKind, aliases, items] of inventorySearch) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1812 | <code>        if (!aliases.includes(kind) &amp;&amp; kind !== 'all') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1813 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1814 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1815 | <code>        for (const item of items) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1816 | <code>            const haystack = JSON.stringify(item);</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1817 | <code>            if (matchText(haystack, query, exact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1818 | <code>                add({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1819 | <code>                    ...item,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1820 | <code>                    kind: inventoryKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1821 | <code>                    ref: item.fullRange &#124;&#124; item.range &#124;&#124; item.part &#124;&#124; item.target &#124;&#124; item.id &#124;&#124; inventoryKind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1822 | <code>                    reason: query ? `${inventoryKind}_match` : `${inventoryKind}_inventory`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1823 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1824 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1825 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1826 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1827 | <code>    const ranked = matches</code> | 声明局部标识符 `ranked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1828 | <code>        .sort((left, right) =&gt; right.score - left.score &#124;&#124; String(left.ref &#124;&#124; left.fullRef).localeCompare(String(right.ref &#124;&#124; right.fullRef)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1829 | <code>        .slice(0, maxResults);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1830 | <code>    const observation = buildCompactXlsxObservation({</code> | 声明局部标识符 `observation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1831 | <code>        index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1832 | <code>        matches: ranked,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1833 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1834 | <code>        query: query &#124;&#124; fillRgb &#124;&#124; errorQuery &#124;&#124; kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1835 | <code>        diagnostics: index.diagnostics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1836 | <code>        maxCandidates: input.maxCandidates &#124;&#124; input.max_candidates &#124;&#124; 20</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1837 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1838 | <code>    const matchMode = fillRgb</code> | 声明局部标识符 `matchMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1839 | <code>        ? 'exact_style'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1840 | <code>        : (exact ? 'exact_text' : 'lexical_substring');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1841 | <code>    observation.matchMode = matchMode;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1842 | <code>    observation.semanticLevel = 'structure';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1843 | <code>    observation.complete = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1844 | <code>    observation.truncated = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1845 | <code>    if ((query &#124;&#124; errorQuery) &amp;&amp; ranked.length === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1846 | <code>        observation.negativeResultScope = 'No deterministic workbook match was found for the requested text/style/error predicate. This does not establish broader semantic absence.';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1847 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1848 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1849 | <code>        schema: 'ailis.xlsx.search.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1850 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1851 | <code>        format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1852 | <code>        sourcePath: index.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1853 | <code>        matchMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1854 | <code>        semanticLevel: 'structure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1855 | <code>        index: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1856 | <code>            cacheHit: index.cacheHit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1857 | <code>            summary: index.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1858 | <code>            signature: index.signature</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1859 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1860 | <code>        search: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1861 | <code>            kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1862 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1863 | <code>            fillRgb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1864 | <code>            error: errorQuery,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1865 | <code>            target: input.target &#124;&#124; input.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1866 | <code>            returned: ranked.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1867 | <code>            totalCandidates: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1868 | <code>            maxResults</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1869 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1870 | <code>        matches: ranked.map(compactCandidate),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1871 | <code>        observation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1872 | <code>        diagnostics: index.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1873 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1874 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1875 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1876 | <code>async function searchArtifact(input = {}) {</code> | 定义函数 `searchArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1877 | <code>    const format = normalizeFormat(input.format, input.sourcePath &#124;&#124; input.path);</code> | 声明局部标识符 `format`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1878 | <code>    if (format === 'xlsx' &#124;&#124; format === 'xlsm') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1879 | <code>        return searchXlsxArtifact(input);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1880 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1881 | <code>    if (FILE_ADAPTER_FORMATS.has(format)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1882 | <code>        return searchFileArtifact({ ...input, format });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1883 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1884 | <code>    if (format === 'csv' &#124;&#124; format === 'tsv') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1885 | <code>        const inspection = await inspectCsvArtifact({ ...input, format });</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1886 | <code>        const query = String(input.query &#124;&#124; input.text &#124;&#124; input.term &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1887 | <code>        const rows = inspection.structure.rows &#124;&#124; [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1888 | <code>        const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1889 | <code>        rows.forEach((row, rowIndex) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1890 | <code>            row.forEach((value, colIndex) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1891 | <code>                const text = String(value ?? '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1892 | <code>                if (!query &#124;&#124; text.toLowerCase().includes(query)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1893 | <code>                    matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1894 | <code>                        kind: 'cell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1895 | <code>                        ref: `R${rowIndex + 1}C${colIndex + 1}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1896 | <code>                        row: rowIndex + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1897 | <code>                        column: colIndex + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1898 | <code>                        text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1899 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1900 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1901 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1902 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1903 | <code>        const limit = clampNumber(input.limit, 20, 1, 100);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1904 | <code>        const returned = matches.slice(0, limit);</code> | 声明局部标识符 `returned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1905 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1906 | <code>            schema: 'ailis.csv.search.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1907 | <code>            adapterId: 'csv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1908 | <code>            format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1909 | <code>            sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1910 | <code>            kind: String(input.searchKind &#124;&#124; input.kind &#124;&#124; 'all'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1911 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1912 | <code>            returned: returned.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1913 | <code>            totalCandidates: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1914 | <code>            matches: returned,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1915 | <code>            observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1916 | <code>                schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1917 | <code>                action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1918 | <code>                format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1919 | <code>                sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1920 | <code>                query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1921 | <code>                candidates: returned.map((match) =&gt; ({ ref: match.ref, kind: match.kind, text: match.text }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1922 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1923 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1924 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1925 | <code>    throw new Error(`Search is not implemented for artifact format: ${format}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1926 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1927 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1928 | <code>function normalizeQueryKey(value = '') {</code> | 定义函数 `normalizeQueryKey`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1929 | <code>    return String(value &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1930 | <code>        .trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1931 | <code>        .toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1932 | <code>        .replace(/[^a-z0-9]+/g, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1933 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1934 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1935 | <code>function getQueryCellValue(cell = {}) {</code> | 定义函数 `getQueryCellValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1936 | <code>    if (typeof cell.result !== 'undefined' &amp;&amp; cell.result !== null &amp;&amp; cell.result !== '') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1937 | <code>        return clonePlain(cell.result);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1938 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1939 | <code>    if (typeof cell.value !== 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1940 | <code>        if (cell.value &amp;&amp; typeof cell.value === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1941 | <code>            if (Object.prototype.hasOwnProperty.call(cell.value, 'result')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1942 | <code>                return clonePlain(cell.value.result);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1943 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1944 | <code>            if (Object.prototype.hasOwnProperty.call(cell.value, 'text')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1945 | <code>                return cell.value.text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1946 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1947 | <code>            if (Object.prototype.hasOwnProperty.call(cell.value, 'hyperlink')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1948 | <code>                return cell.value.text &#124;&#124; cell.value.hyperlink;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1949 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1950 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1951 | <code>        return clonePlain(cell.value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1952 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1953 | <code>    return cell.text &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1954 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1956 | <code>function valuesMatchForQuery(actual, expected) {</code> | 定义函数 `valuesMatchForQuery`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1957 | <code>    if (Array.isArray(expected)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1958 | <code>        return expected.some((entry) =&gt; valuesMatchForQuery(actual, entry));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1959 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1960 | <code>    if (typeof expected === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1961 | <code>        return Boolean(actual) === expected;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1962 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1963 | <code>    if (typeof expected === 'number') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1964 | <code>        return Number(actual) === expected;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1965 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1966 | <code>    const expectedText = String(expected ?? '').trim().toLowerCase();</code> | 声明局部标识符 `expectedText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1967 | <code>    const actualText = String(actual ?? '').trim().toLowerCase();</code> | 声明局部标识符 `actualText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1968 | <code>    if (!expectedText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1969 | <code>        return Boolean(actualText);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1970 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1971 | <code>    return actualText === expectedText;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1972 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1973 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1974 | <code>function coerceQueryNumber(value) {</code> | 定义函数 `coerceQueryNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1975 | <code>    if (typeof value === 'number' &amp;&amp; Number.isFinite(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1976 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1977 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1978 | <code>    const text = String(value ?? '').replace(/[$,%\s,]/g, '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1979 | <code>    const number = Number(text);</code> | 声明局部标识符 `number`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1980 | <code>    return Number.isFinite(number) ? number : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1981 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1982 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1983 | <code>function resolveXlsxQueryTable(index = {}, input = {}) {</code> | 定义函数 `resolveXlsxQueryTable`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1984 | <code>    const requestedName = normalizeQueryKey(input.table &#124;&#124; input.tableName &#124;&#124; input.table_name &#124;&#124; '');</code> | 声明局部标识符 `requestedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1985 | <code>    const requestedSheet = String(input.sheetName &#124;&#124; input.sheet &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedSheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1986 | <code>    const requestedRange = String(input.target &#124;&#124; input.range &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1987 | <code>    const parsedTarget = parseWorkbookTarget(requestedRange, requestedSheet);</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1988 | <code>    const tables = [];</code> | 声明局部标识符 `tables`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1989 | <code>    for (const sheet of index.structure?.sheets &#124;&#124; []) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1990 | <code>        for (const table of sheet.tables &#124;&#124; []) {</code> | 声明局部标识符 `table`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1991 | <code>            tables.push({ sheet, table });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1992 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1993 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1994 | <code>    if (requestedName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1995 | <code>        const named = tables.find(({ table }) =&gt;</code> | 声明局部标识符 `named`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1996 | <code>            normalizeQueryKey(table.name) === requestedName</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1997 | <code>            &#124;&#124; normalizeQueryKey(table.displayName) === requestedName</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1998 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1999 | <code>        if (named) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2000 | <code>            return named;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2001 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2002 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2003 | <code>    if (parsedTarget.rangeRef &#124;&#124; parsedTarget.sheetName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2004 | <code>        const targetBounds = parseRangeRef(parsedTarget.rangeRef);</code> | 声明局部标识符 `targetBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2005 | <code>        const matched = tables.find(({ sheet, table }) =&gt; {</code> | 声明局部标识符 `matched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2006 | <code>            if (parsedTarget.sheetName &amp;&amp; parsedTarget.sheetName !== sheet.name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2007 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2008 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2009 | <code>            if (!targetBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2010 | <code>                return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2011 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2012 | <code>            const tableBounds = parseRangeRef(table.ref);</code> | 声明局部标识符 `tableBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2013 | <code>            return tableBounds</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2014 | <code>                &amp;&amp; tableBounds.startRow &lt;= targetBounds.startRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2015 | <code>                &amp;&amp; tableBounds.endRow &gt;= targetBounds.endRow</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2016 | <code>                &amp;&amp; tableBounds.startCol &lt;= targetBounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2017 | <code>                &amp;&amp; tableBounds.endCol &gt;= targetBounds.endCol;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2018 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2019 | <code>        if (matched) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2020 | <code>            return matched;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2021 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2022 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2023 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2024 | <code>    return tables[0] &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2025 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2026 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2027 | <code>function buildXlsxTableRows(index = {}, sheet = {}, table = {}) {</code> | 定义函数 `buildXlsxTableRows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2028 | <code>    const bounds = parseRangeRef(table.ref &#124;&#124; '');</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2029 | <code>    if (!bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2030 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2031 | <code>            columns: table.columns &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2032 | <code>            rows: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2033 | <code>            diagnostics: [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2034 | <code>                'xlsx_query_table_range_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2035 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2036 | <code>                `Table ${table.name &#124;&#124; '(unnamed)'} does not expose a usable range.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2037 | <code>            )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2038 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2039 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2040 | <code>    const cellsByRef = new Map((index.cellIndex &#124;&#124; [])</code> | 声明局部标识符 `cellsByRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2041 | <code>        .filter((cell) =&gt; cell.sheetName === sheet.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2042 | <code>        .map((cell) =&gt; [cell.ref, cell]));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2043 | <code>    const headerCells = [];</code> | 声明局部标识符 `headerCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2044 | <code>    const columns = [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2045 | <code>    for (let col = bounds.startCol; col &lt;= bounds.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2046 | <code>        const ref = cellRef(bounds.startRow, col);</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2047 | <code>        const cell = cellsByRef.get(ref) &#124;&#124; {};</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2048 | <code>        const fallbackColumn = (table.columns &#124;&#124; [])[col - bounds.startCol] &#124;&#124; {};</code> | 声明局部标识符 `fallbackColumn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2049 | <code>        const name = String(getQueryCellValue(cell) &#124;&#124; fallbackColumn.name &#124;&#124; `Column${col - bounds.startCol + 1}`);</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2050 | <code>        headerCells.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2051 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2052 | <code>            ref: `${sheet.name}!${ref}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2053 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2054 | <code>        columns.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2055 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2056 | <code>            key: normalizeQueryKey(name) &#124;&#124; `column${col - bounds.startCol + 1}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2057 | <code>            ref: `${sheet.name}!${ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2058 | <code>            index: col - bounds.startCol</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2059 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2060 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2061 | <code>    const rows = [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2062 | <code>    for (let row = bounds.startRow + 1; row &lt;= bounds.endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2063 | <code>        const values = {};</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2064 | <code>        const cells = {};</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2065 | <code>        let nonEmpty = false;</code> | 声明局部标识符 `nonEmpty`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2066 | <code>        let hiddenRow = false;</code> | 声明局部标识符 `hiddenRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2067 | <code>        let hiddenColumn = false;</code> | 声明局部标识符 `hiddenColumn`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2068 | <code>        let hiddenSheet = sheet.hidden === true &#124;&#124; Boolean(sheet.state &amp;&amp; sheet.state !== 'visible');</code> | 声明局部标识符 `hiddenSheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2069 | <code>        for (let col = bounds.startCol; col &lt;= bounds.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2070 | <code>            const column = columns[col - bounds.startCol];</code> | 声明局部标识符 `column`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2071 | <code>            const ref = cellRef(row, col);</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2072 | <code>            const cell = cellsByRef.get(ref) &#124;&#124; {</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2073 | <code>                sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2074 | <code>                ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2075 | <code>                fullRef: `${sheet.name}!${ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2076 | <code>                row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2077 | <code>                col</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2078 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2079 | <code>            const value = getQueryCellValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2080 | <code>            values[column.name] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2081 | <code>            values[column.key] = value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2082 | <code>            cells[column.name] = compactCandidate({ ...cell, kind: 'cell' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2083 | <code>            hiddenRow = hiddenRow &#124;&#124; cell.hiddenRow === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2084 | <code>            hiddenColumn = hiddenColumn &#124;&#124; cell.hiddenColumn === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2085 | <code>            hiddenSheet = hiddenSheet &#124;&#124; cell.hiddenSheet === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2086 | <code>            if (String(value ?? '').trim()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2087 | <code>                nonEmpty = true;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 2088 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2089 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2090 | <code>        if (nonEmpty) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2091 | <code>            rows.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2092 | <code>                rowNumber: row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2093 | <code>                ref: `${sheet.name}!${cellRef(row, bounds.startCol)}:${cellRef(row, bounds.endCol)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2094 | <code>                hidden: hiddenSheet &#124;&#124; hiddenRow &#124;&#124; hiddenColumn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2095 | <code>                hiddenSheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2096 | <code>                hiddenRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2097 | <code>                hiddenColumn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2098 | <code>                values,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2099 | <code>                cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2100 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2101 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2102 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2103 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2104 | <code>        range: `${sheet.name}!${table.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2105 | <code>        columns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2106 | <code>        headerCells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2107 | <code>        rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2108 | <code>        diagnostics: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2109 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2110 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2112 | <code>function resolveXlsxQueryRange(index = {}, input = {}) {</code> | 定义函数 `resolveXlsxQueryRange`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2113 | <code>    const requestedSheet = String(input.sheetName &#124;&#124; input.sheet &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedSheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2114 | <code>    const requestedRange = String(input.target &#124;&#124; input.range &#124;&#124; input.addressRange &#124;&#124; input.address_range &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2115 | <code>    const parsedTarget = parseWorkbookTarget(requestedRange, requestedSheet);</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2116 | <code>    const sheets = index.structure?.sheets &#124;&#124; [];</code> | 声明局部标识符 `sheets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2117 | <code>    const sheet = parsedTarget.sheetName</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2118 | <code>        ? sheets.find((entry) =&gt; String(entry.name &#124;&#124; '').toLowerCase() === parsedTarget.sheetName.toLowerCase())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2119 | <code>        : sheets[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2120 | <code>    if (!sheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2121 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2122 | <code>            sheet: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2123 | <code>            bounds: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2124 | <code>            diagnostics: [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2125 | <code>                'xlsx_query_sheet_not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2126 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2127 | <code>                `No worksheet matched ${parsedTarget.sheetName &#124;&#124; requestedSheet &#124;&#124; '(first sheet)'}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2128 | <code>                { availableSheets: sheets.map((entry) =&gt; entry.name) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2129 | <code>            )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2130 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2131 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2132 | <code>    const fallbackRange = sheet.usedRange &#124;&#124; (</code> | 声明局部标识符 `fallbackRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2133 | <code>        sheet.dimensions</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2134 | <code>            ? `${cellRef(sheet.dimensions.startRow &#124;&#124; 1, sheet.dimensions.startCol &#124;&#124; 1)}:${cellRef(sheet.dimensions.endRow &#124;&#124; 1, sheet.dimensions.endCol &#124;&#124; 1)}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2135 | <code>            : 'A1:A1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2136 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2137 | <code>    const rangeRef = parsedTarget.rangeRef &#124;&#124; fallbackRange;</code> | 声明局部标识符 `rangeRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2138 | <code>    const requestedBounds = parseRangeRef(rangeRef);</code> | 声明局部标识符 `requestedBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2139 | <code>    if (!requestedBounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2140 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2141 | <code>            sheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2142 | <code>            bounds: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2143 | <code>            diagnostics: [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2144 | <code>                'xlsx_query_invalid_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2145 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2146 | <code>                `Invalid XLSX range query target: ${requestedRange &#124;&#124; rangeRef}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2147 | <code>                { target: requestedRange &#124;&#124; rangeRef }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2148 | <code>            )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2149 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2150 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2151 | <code>    const diagnostics = [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2152 | <code>    const usedBounds = parseRangeRef(sheet.usedRange &#124;&#124; '');</code> | 声明局部标识符 `usedBounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2153 | <code>    const preserveRequestedRange = input.preserveRequestedRange === true</code> | 声明局部标识符 `preserveRequestedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2154 | <code>        &#124;&#124; input.preserve_requested_range === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2155 | <code>        &#124;&#124; input.includeEmptyMargin === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2156 | <code>        &#124;&#124; input.include_empty_margin === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2157 | <code>    let bounds = requestedBounds;</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2158 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2159 | <code>        usedBounds</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2160 | <code>        &amp;&amp; parsedTarget.rangeRef</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2161 | <code>        &amp;&amp; !preserveRequestedRange</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2162 | <code>        &amp;&amp; boundsContain(requestedBounds, usedBounds)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2163 | <code>        &amp;&amp; !boundsEqual(requestedBounds, usedBounds)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2164 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2165 | <code>        bounds = usedBounds;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2166 | <code>        diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2167 | <code>            'xlsx_query_trimmed_to_used_range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2168 | <code>            'info',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2169 | <code>            `Requested range ${rangeRef} fully contains used range ${sheet.usedRange}; returning the used range to avoid model-visible empty margins.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2170 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2171 | <code>                requestedRange: `${sheet.name}!${boundsToRangeRef(requestedBounds)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2172 | <code>                usedRange: `${sheet.name}!${boundsToRangeRef(usedBounds)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2173 | <code>                preserveWith: 'preserveRequestedRange=true'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2174 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2175 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2176 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2177 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2178 | <code>        sheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2179 | <code>        bounds,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2180 | <code>        requestedRange: `${sheet.name}!${boundsToRangeRef(requestedBounds)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2181 | <code>        usedRange: usedBounds ? `${sheet.name}!${boundsToRangeRef(usedBounds)}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2182 | <code>        range: `${sheet.name}!${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(bounds.endRow, bounds.endCol)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2183 | <code>        diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2184 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2185 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2186 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2187 | <code>function compactRangeCell(cell = {}, ref = '', row = 1, col = 1, sheetName = '') {</code> | 定义函数 `compactRangeCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2188 | <code>    const fillRgb = normalizeHex(cell.fillRgb &#124;&#124; cell.style?.fillRgb &#124;&#124; '');</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2189 | <code>    const value = getQueryCellValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2190 | <code>    const text = String(cell.text ?? value ?? '').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2191 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2192 | <code>        ref: `${sheetName}!${ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2193 | <code>        address: ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2194 | <code>        row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2195 | <code>        col,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2196 | <code>        value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2197 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2198 | <code>        fillRgb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2199 | <code>        formula: cell.formula &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2200 | <code>        error: cell.error &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2201 | <code>        hidden: cell.hidden === true &#124;&#124; cell.hiddenRow === true &#124;&#124; cell.hiddenColumn === true &#124;&#124; cell.hiddenSheet === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2202 | <code>        hiddenRow: cell.hiddenRow === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2203 | <code>        hiddenColumn: cell.hiddenColumn === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2204 | <code>        hiddenSheet: cell.hiddenSheet === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2205 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2206 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2208 | <code>function displayRangeCell(cell = {}) {</code> | 定义函数 `displayRangeCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2209 | <code>    const valueText = String(cell.text ?? cell.value ?? '').trim();</code> | 声明局部标识符 `valueText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2210 | <code>    if (valueText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2211 | <code>        return valueText;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2212 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2213 | <code>    if (cell.fillRgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2214 | <code>        return `#${cell.fillRgb}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2215 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2216 | <code>    if (cell.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2217 | <code>        return `=${cell.formula}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2218 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2219 | <code>    if (cell.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2220 | <code>        return cell.error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2221 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2222 | <code>    return '.';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2223 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2225 | <code>function buildXlsxRangeRows(index = {}, input = {}) {</code> | 定义函数 `buildXlsxRangeRows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2226 | <code>    const resolved = resolveXlsxQueryRange(index, input);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2227 | <code>    if (!resolved.sheet &#124;&#124; !resolved.bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2228 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2229 | <code>            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2230 | <code>            passed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2231 | <code>            diagnostics: resolved.diagnostics &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2232 | <code>            rows: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2233 | <code>            compactGrid: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2234 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2235 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2236 | <code>    const { sheet, bounds } = resolved;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2237 | <code>    const maxRows = clampNumber(input.maxRows &#124;&#124; input.max_rows &#124;&#124; input.limitRows &#124;&#124; input.limit_rows, 80, 1, 500);</code> | 声明局部标识符 `maxRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2238 | <code>    const maxCols = clampNumber(input.maxCols &#124;&#124; input.max_cols &#124;&#124; input.limitCols &#124;&#124; input.limit_cols, 40, 1, 200);</code> | 声明局部标识符 `maxCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2239 | <code>    const returnedEndRow = Math.min(bounds.endRow, bounds.startRow + maxRows - 1);</code> | 声明局部标识符 `returnedEndRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2240 | <code>    const returnedEndCol = Math.min(bounds.endCol, bounds.startCol + maxCols - 1);</code> | 声明局部标识符 `returnedEndCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2241 | <code>    const cellsByRef = new Map((index.cellIndex &#124;&#124; [])</code> | 声明局部标识符 `cellsByRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2242 | <code>        .filter((cell) =&gt; cell.sheetName === sheet.name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2243 | <code>        .map((cell) =&gt; [cell.ref, cell]));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2244 | <code>    const columns = [];</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2245 | <code>    for (let col = bounds.startCol; col &lt;= returnedEndCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2246 | <code>        columns.push(colName(col));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2247 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2248 | <code>    const rows = [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2249 | <code>    const compactGrid = [];</code> | 声明局部标识符 `compactGrid`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2250 | <code>    const fillHistogram = {};</code> | 声明局部标识符 `fillHistogram`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2251 | <code>    for (let row = bounds.startRow; row &lt;= returnedEndRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2252 | <code>        const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2253 | <code>        const values = [];</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2254 | <code>        const fills = [];</code> | 声明局部标识符 `fills`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2255 | <code>        const display = [];</code> | 声明局部标识符 `display`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2256 | <code>        for (let col = bounds.startCol; col &lt;= returnedEndCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2257 | <code>            const ref = cellRef(row, col);</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2258 | <code>            const cell = compactRangeCell(cellsByRef.get(ref) &#124;&#124; {}, ref, row, col, sheet.name);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2259 | <code>            cells.push(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2260 | <code>            values.push(cell.value ?? '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2261 | <code>            fills.push(cell.fillRgb &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2262 | <code>            display.push(displayRangeCell(cell));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2263 | <code>            if (cell.fillRgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2264 | <code>                fillHistogram[cell.fillRgb] = (fillHistogram[cell.fillRgb] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2265 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2266 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2267 | <code>        rows.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2268 | <code>            rowNumber: row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2269 | <code>            ref: `${sheet.name}!${cellRef(row, bounds.startCol)}:${cellRef(row, returnedEndCol)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2270 | <code>            cells,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2271 | <code>            values,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2272 | <code>            fills,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2273 | <code>            display</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2274 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2275 | <code>        compactGrid.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2276 | <code>            rowNumber: row,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2277 | <code>            cells: display</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2278 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2279 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2280 | <code>    const truncated = returnedEndRow &lt; bounds.endRow &#124;&#124; returnedEndCol &lt; bounds.endCol;</code> | 声明局部标识符 `truncated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2281 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2282 | <code>        kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2283 | <code>        passed: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2284 | <code>        sheetName: sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2285 | <code>        range: resolved.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2286 | <code>        requestedRange: resolved.requestedRange &#124;&#124; resolved.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2287 | <code>        usedRange: resolved.usedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2288 | <code>        returnedRange: `${sheet.name}!${cellRef(bounds.startRow, bounds.startCol)}:${cellRef(returnedEndRow, returnedEndCol)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2289 | <code>        rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2290 | <code>        columnCount: columns.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2291 | <code>        requestedRows: Math.max(0, bounds.endRow - bounds.startRow + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2292 | <code>        requestedColumns: Math.max(0, bounds.endCol - bounds.startCol + 1),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2293 | <code>        truncated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2294 | <code>        columns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2295 | <code>        rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2296 | <code>        compactGrid,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2297 | <code>        fillHistogram,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2298 | <code>        diagnostics: resolved.diagnostics &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2299 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2300 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2302 | <code>function normalizeQueryFilter(input = {}) {</code> | 定义函数 `normalizeQueryFilter`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2303 | <code>    const filter = input.filter &#124;&#124; input.where &#124;&#124; {};</code> | 声明局部标识符 `filter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2304 | <code>    if (!filter &#124;&#124; typeof filter !== 'object' &#124;&#124; Array.isArray(filter)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2305 | <code>        return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2306 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2307 | <code>    return filter;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2308 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2310 | <code>function rowMatchesQueryFilter(row = {}, filter = {}) {</code> | 定义函数 `rowMatchesQueryFilter`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2311 | <code>    for (const [rawKey, expected] of Object.entries(filter)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2312 | <code>        const normalizedKey = normalizeQueryKey(rawKey);</code> | 声明局部标识符 `normalizedKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2313 | <code>        let actual;</code> | 声明局部标识符 `actual`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2314 | <code>        if (normalizedKey === 'hidden' &#124;&#124; normalizedKey === 'ishidden') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2315 | <code>            actual = row.hidden;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2316 | <code>        } else if (normalizedKey === 'hiddenrow') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2317 | <code>            actual = row.hiddenRow;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2318 | <code>        } else if (normalizedKey === 'hiddencolumn') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2319 | <code>            actual = row.hiddenColumn;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2320 | <code>        } else if (normalizedKey === 'hiddensheet') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2321 | <code>            actual = row.hiddenSheet;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2322 | <code>        } else if (normalizedKey === 'rownumber' &#124;&#124; normalizedKey === 'row') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2323 | <code>            actual = row.rowNumber;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2324 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2325 | <code>            actual = row.values[rawKey];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2326 | <code>            if (typeof actual === 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2327 | <code>                actual = row.values[normalizedKey];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2328 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2329 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2330 | <code>        if (!valuesMatchForQuery(actual, expected)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2331 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2332 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2333 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2334 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2335 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2336 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2337 | <code>function resolveQueryAggregate(input = {}) {</code> | 定义函数 `resolveQueryAggregate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2338 | <code>    const aggregate = input.aggregate &#124;&#124; input.aggregation &#124;&#124; {};</code> | 声明局部标识符 `aggregate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2339 | <code>    if (typeof aggregate === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2340 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2341 | <code>            op: aggregate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2342 | <code>            column: input.column &#124;&#124; input.valueColumn &#124;&#124; input.value_column &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2343 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2344 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2345 | <code>    if (aggregate &amp;&amp; typeof aggregate === 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2346 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2347 | <code>            op: aggregate.op &#124;&#124; aggregate.operation &#124;&#124; aggregate.function &#124;&#124; input.op &#124;&#124; 'count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2348 | <code>            column: aggregate.column &#124;&#124; aggregate.field &#124;&#124; aggregate.valueColumn &#124;&#124; input.column &#124;&#124; input.valueColumn &#124;&#124; input.value_column &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2349 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2350 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2351 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2352 | <code>        op: input.op &#124;&#124; 'count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2353 | <code>        column: input.column &#124;&#124; input.valueColumn &#124;&#124; input.value_column &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2354 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2355 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2357 | <code>function computeAggregate(rows = [], aggregate = {}) {</code> | 定义函数 `computeAggregate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2358 | <code>    const op = String(aggregate.op &#124;&#124; 'count').toLowerCase();</code> | 声明局部标识符 `op`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2359 | <code>    const column = aggregate.column &#124;&#124; '';</code> | 声明局部标识符 `column`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2360 | <code>    const key = normalizeQueryKey(column);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2361 | <code>    const values = rows.map((row) =&gt; row.values[column] ?? row.values[key]);</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2362 | <code>    if (op === 'count') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2363 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2364 | <code>            op,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2365 | <code>            column,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2366 | <code>            value: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2367 | <code>            rowCount: rows.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2368 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2369 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2370 | <code>    const numericValues = values</code> | 声明局部标识符 `numericValues`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2371 | <code>        .map((value, index) =&gt; ({ value: coerceQueryNumber(value), row: rows[index] }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2372 | <code>        .filter((entry) =&gt; entry.value !== null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2373 | <code>    if (!numericValues.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2374 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2375 | <code>            op,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2376 | <code>            column,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2377 | <code>            value: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2378 | <code>            rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2379 | <code>            numericCount: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2380 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2381 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2382 | <code>    if (op === 'sum') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2383 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2384 | <code>            op,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2385 | <code>            column,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2386 | <code>            value: numericValues.reduce((sum, entry) =&gt; sum + entry.value, 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2387 | <code>            rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2388 | <code>            numericCount: numericValues.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2389 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2390 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2391 | <code>    if (op === 'avg' &#124;&#124; op === 'average' &#124;&#124; op === 'mean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2392 | <code>        const sum = numericValues.reduce((total, entry) =&gt; total + entry.value, 0);</code> | 声明局部标识符 `sum`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2393 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2394 | <code>            op: 'avg',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2395 | <code>            column,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2396 | <code>            value: sum / numericValues.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2397 | <code>            rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2398 | <code>            numericCount: numericValues.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2399 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2400 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2401 | <code>    const comparator = op === 'min'</code> | 声明局部标识符 `comparator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2402 | <code>        ? (left, right) =&gt; left.value - right.value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2403 | <code>        : (left, right) =&gt; right.value - left.value;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2404 | <code>    const [best] = numericValues.sort(comparator);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2405 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2406 | <code>        op: op === 'min' ? 'min' : 'max',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2407 | <code>        column,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2408 | <code>        value: best.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2409 | <code>        rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2410 | <code>        numericCount: numericValues.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2411 | <code>        row: best.row ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2412 | <code>            rowNumber: best.row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2413 | <code>            ref: best.row.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2414 | <code>            hidden: best.row.hidden,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2415 | <code>            values: best.row.values</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2416 | <code>        } : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2417 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2418 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2419 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2420 | <code>function buildQueryObservation(query = {}) {</code> | 定义函数 `buildQueryObservation`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2421 | <code>    if (query.kind === 'range') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2422 | <code>        const compactRows = (query.compactGrid &#124;&#124; []).slice(0, 80).map((row) =&gt; ({</code> | 声明局部标识符 `compactRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2423 | <code>            rowNumber: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2424 | <code>            cells: row.cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2425 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2426 | <code>        const matrixRows = buildRangeMatrixRows(query);</code> | 声明局部标识符 `matrixRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2427 | <code>        const anchors = buildRangeAnchors(matrixRows, query.columns &#124;&#124; [], query.sheetName &#124;&#124; '');</code> | 声明局部标识符 `anchors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2428 | <code>        const fillLegend = buildFillLegend(query.fillHistogram &#124;&#124; {});</code> | 声明局部标识符 `fillLegend`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2429 | <code>        const compactRowSchema = buildRangeReadingGuide(query, compactRows, matrixRows);</code> | 声明局部标识符 `compactRowSchema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2430 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2431 | <code>            schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2432 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2433 | <code>            action: query.action &#124;&#124; 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2434 | <code>            sourcePath: query.sourcePath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2435 | <code>            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2436 | <code>            sheetName: query.sheetName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2437 | <code>            range: query.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2438 | <code>            requestedRange: query.requestedRange &#124;&#124; query.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2439 | <code>            usedRange: query.usedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2440 | <code>            returnedRange: query.returnedRange &#124;&#124; query.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2441 | <code>            rowCount: query.rowCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2442 | <code>            columnCount: query.columnCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2443 | <code>            requestedRows: query.requestedRows &#124;&#124; query.rowCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2444 | <code>            requestedColumns: query.requestedColumns &#124;&#124; query.columnCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2445 | <code>            truncated: query.truncated === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2446 | <code>            columns: query.columns &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2447 | <code>            fillHistogram: query.fillHistogram &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2448 | <code>            anchors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2449 | <code>            fillLegend,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2450 | <code>            compactRowSchema,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2451 | <code>            compactRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2452 | <code>            matrixRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2453 | <code>            cellRefRule: matrixRows.length ? 'ref = columns[index] + rowNumber' : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2454 | <code>            matrixRowsLossless: matrixRows.length &gt; 0 &amp;&amp; query.truncated !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2455 | <code>            candidateCount: compactRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2456 | <code>            diagnostics: (query.diagnostics &#124;&#124; []).slice(0, 20).map((diagnostic) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2457 | <code>                code: diagnostic.code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2458 | <code>                severity: diagnostic.severity,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2459 | <code>                message: diagnostic.message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2460 | <code>                target: diagnostic.target &#124;&#124; diagnostic.details?.target &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2461 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2462 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2463 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2464 | <code>    const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2465 | <code>    for (const row of query.rows &#124;&#124; []) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2466 | <code>        candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2467 | <code>            kind: 'row',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2468 | <code>            ref: row.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2469 | <code>            row: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2470 | <code>            hidden: row.hidden,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2471 | <code>            text: Object.entries(row.values)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2472 | <code>                .filter(([key]) =&gt; key &amp;&amp; key === normalizeQueryKey(key) ? false : true)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2473 | <code>                .map(([key, value]) =&gt; `${key}=${value}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2474 | <code>                .slice(0, 12)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2475 | <code>                .join('; ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2476 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2477 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2478 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2479 | <code>        schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2480 | <code>        format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2481 | <code>        action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2482 | <code>        sourcePath: query.sourcePath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2483 | <code>        table: query.table,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2484 | <code>        tableRange: query.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2485 | <code>        rowCount: query.rows?.length &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2486 | <code>        columns: query.columns?.map((column) =&gt; column.name) &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2487 | <code>        aggregate: query.aggregateResult &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2488 | <code>        groups: query.groups?.slice(0, 20) &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2489 | <code>        candidateCount: candidates.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2490 | <code>        candidates: candidates.slice(0, 20)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2491 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2492 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2494 | <code>async function queryXlsxArtifact(input = {}) {</code> | 定义函数 `queryXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2495 | <code>    const index = await indexXlsxArtifact(input);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2496 | <code>    const selected = resolveXlsxQueryTable(index, input);</code> | 声明局部标识符 `selected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2497 | <code>    const requestedAction = String(input.action &#124;&#124; input.operation &#124;&#124; 'query').toLowerCase();</code> | 声明局部标识符 `requestedAction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2498 | <code>    if (!selected) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2499 | <code>        const rangeData = buildXlsxRangeRows(index, input);</code> | 声明局部标识符 `rangeData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2500 | <code>        const rangeQuery = rangeData.passed === true ? {</code> | 声明局部标识符 `rangeQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2501 | <code>            schema: 'ailis.xlsx.query.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2502 | <code>            adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2503 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2504 | <code>            sourcePath: index.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2505 | <code>            sessionId: input.sessionId &#124;&#124; input.session_id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2506 | <code>            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2507 | <code>            passed: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2508 | <code>            sheetName: rangeData.sheetName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2509 | <code>            range: rangeData.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2510 | <code>            requestedRange: rangeData.requestedRange &#124;&#124; rangeData.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2511 | <code>            usedRange: rangeData.usedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2512 | <code>            returnedRange: rangeData.returnedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2513 | <code>            rowCount: rangeData.rowCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2514 | <code>            columnCount: rangeData.columnCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2515 | <code>            requestedRows: rangeData.requestedRows &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2516 | <code>            requestedColumns: rangeData.requestedColumns &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2517 | <code>            truncated: rangeData.truncated === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2518 | <code>            columns: rangeData.columns &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2519 | <code>            rows: rangeData.rows &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2520 | <code>            compactGrid: rangeData.compactGrid &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2521 | <code>            fillHistogram: rangeData.fillHistogram &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2522 | <code>            diagnostics: rangeData.diagnostics &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2523 | <code>            groups: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2524 | <code>        } : {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2525 | <code>            schema: 'ailis.xlsx.query.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2526 | <code>            adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2527 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2528 | <code>            sourcePath: index.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2529 | <code>            sessionId: input.sessionId &#124;&#124; input.session_id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2530 | <code>            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2531 | <code>            passed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2532 | <code>            diagnostics: rangeData.diagnostics?.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2533 | <code>                ? rangeData.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2534 | <code>                : [createDiagnostic('xlsx_query_no_table_or_range', 'error', 'No table was found and the used range could not be resolved for XLSX query.')],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2535 | <code>            rows: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2536 | <code>            compactGrid: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2537 | <code>            groups: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2538 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2539 | <code>        rangeQuery.observation = buildQueryObservation(rangeQuery);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2540 | <code>        rangeQuery.action = requestedAction;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2541 | <code>        rangeQuery.observation.action = requestedAction;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2542 | <code>        rangeQuery.observation.semanticLevel = 'structure';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2543 | <code>        rangeQuery.observation.complete = rangeQuery.passed === true &amp;&amp; rangeQuery.truncated !== true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2544 | <code>        return rangeQuery;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2545 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2546 | <code>    const tableData = buildXlsxTableRows(index, selected.sheet, selected.table);</code> | 声明局部标识符 `tableData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2547 | <code>    const filter = normalizeQueryFilter(input);</code> | 声明局部标识符 `filter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2548 | <code>    const filteredRows = tableData.rows.filter((row) =&gt; rowMatchesQueryFilter(row, filter));</code> | 声明局部标识符 `filteredRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2549 | <code>    const groupBy = input.groupBy &#124;&#124; input.group_by &#124;&#124; input.groupby &#124;&#124; '';</code> | 声明局部标识符 `groupBy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2550 | <code>    const groupKey = normalizeQueryKey(groupBy);</code> | 声明局部标识符 `groupKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2551 | <code>    const aggregate = resolveQueryAggregate(input);</code> | 声明局部标识符 `aggregate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2552 | <code>    const aggregateResult = computeAggregate(filteredRows, aggregate);</code> | 声明局部标识符 `aggregateResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2553 | <code>    let groups = [];</code> | 声明局部标识符 `groups`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2554 | <code>    if (groupBy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2555 | <code>        const groupMap = new Map();</code> | 声明局部标识符 `groupMap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2556 | <code>        for (const row of filteredRows) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2557 | <code>            const key = String(row.values[groupBy] ?? row.values[groupKey] ?? '');</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2558 | <code>            if (!groupMap.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2559 | <code>                groupMap.set(key, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2560 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2561 | <code>            groupMap.get(key).push(row);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2562 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2563 | <code>        groups = [...groupMap.entries()].map(([key, rows]) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2564 | <code>            key,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2565 | <code>            rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2566 | <code>            aggregate: computeAggregate(rows, aggregate),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2567 | <code>            rows: rows.slice(0, clampNumber(input.groupSampleRows &#124;&#124; input.group_sample_rows, 3, 0, 20)).map((row) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2568 | <code>                rowNumber: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2569 | <code>                ref: row.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2570 | <code>                hidden: row.hidden,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2571 | <code>                values: row.values</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2572 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2573 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2574 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2575 | <code>    const sortBy = input.sortBy &#124;&#124; input.sort_by &#124;&#124; '';</code> | 声明局部标识符 `sortBy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2576 | <code>    const sortKey = normalizeQueryKey(sortBy);</code> | 声明局部标识符 `sortKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2577 | <code>    if (sortBy) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2578 | <code>        filteredRows.sort((left, right) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2579 | <code>            const leftValue = left.values[sortBy] ?? left.values[sortKey];</code> | 声明局部标识符 `leftValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2580 | <code>            const rightValue = right.values[sortBy] ?? right.values[sortKey];</code> | 声明局部标识符 `rightValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2581 | <code>            const leftNumber = coerceQueryNumber(leftValue);</code> | 声明局部标识符 `leftNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2582 | <code>            const rightNumber = coerceQueryNumber(rightValue);</code> | 声明局部标识符 `rightNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2583 | <code>            const direction = input.descending === false &#124;&#124; input.order === 'asc' ? 1 : -1;</code> | 声明局部标识符 `direction`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2584 | <code>            if (leftNumber !== null &amp;&amp; rightNumber !== null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2585 | <code>                return direction * (leftNumber - rightNumber);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2586 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2587 | <code>            return direction * String(leftValue ?? '').localeCompare(String(rightValue ?? ''), undefined, { numeric: true });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2588 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2589 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2590 | <code>    if (groups.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2591 | <code>        groups.sort((left, right) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2592 | <code>            const leftValue = coerceQueryNumber(left.aggregate?.value);</code> | 声明局部标识符 `leftValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2593 | <code>            const rightValue = coerceQueryNumber(right.aggregate?.value);</code> | 声明局部标识符 `rightValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2594 | <code>            if (leftValue !== null &amp;&amp; rightValue !== null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2595 | <code>                return (input.descending === false &#124;&#124; input.order === 'asc' ? 1 : -1) * (leftValue - rightValue);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2596 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2597 | <code>            return String(left.key).localeCompare(String(right.key), undefined, { numeric: true });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2598 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2599 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2600 | <code>    const top = clampNumber(input.top &#124;&#124; input.limit, filteredRows.length &#124;&#124; 50, 1, 500);</code> | 声明局部标识符 `top`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2601 | <code>    const resultRows = filteredRows.slice(0, top);</code> | 声明局部标识符 `resultRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2602 | <code>    const resultGroups = groups.slice(0, clampNumber(input.topGroups &#124;&#124; input.top_groups &#124;&#124; input.top &#124;&#124; input.limit, groups.length &#124;&#124; 50, 1, 500));</code> | 声明局部标识符 `resultGroups`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2603 | <code>    const query = {</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2604 | <code>        schema: 'ailis.xlsx.query.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2605 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2606 | <code>        format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2607 | <code>        sourcePath: index.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2608 | <code>        passed: tableData.diagnostics.every((diagnostic) =&gt; diagnostic.severity !== 'error' &amp;&amp; diagnostic.severity !== 'fatal'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2609 | <code>        table: selected.table.name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2610 | <code>        sheetName: selected.sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2611 | <code>        range: tableData.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2612 | <code>        columns: tableData.columns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2613 | <code>        filter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2614 | <code>        groupBy: groupBy &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2615 | <code>        aggregate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2616 | <code>        aggregateResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2617 | <code>        rows: resultRows.map((row) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2618 | <code>            rowNumber: row.rowNumber,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2619 | <code>            ref: row.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2620 | <code>            hidden: row.hidden,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2621 | <code>            hiddenSheet: row.hiddenSheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2622 | <code>            hiddenRow: row.hiddenRow,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2623 | <code>            hiddenColumn: row.hiddenColumn,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2624 | <code>            values: row.values,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2625 | <code>            cells: row.cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2626 | <code>        })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2627 | <code>        rowCount: resultRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2628 | <code>        totalMatchedRows: filteredRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2629 | <code>        groups: resultGroups,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2630 | <code>        diagnostics: tableData.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2631 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2632 | <code>    query.observation = buildQueryObservation(query);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2633 | <code>    const computationRequested = requestedAction === 'aggregate' &#124;&#124;</code> | 声明局部标识符 `computationRequested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2634 | <code>        Boolean(input.aggregate &#124;&#124; input.aggregation &#124;&#124; input.groupBy &#124;&#124; input.group_by &#124;&#124; input.sortBy &#124;&#124; input.sort_by);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2635 | <code>    query.action = requestedAction;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2636 | <code>    query.observation.action = requestedAction;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2637 | <code>    query.observation.semanticLevel = computationRequested ? 'computation' : 'structure';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2638 | <code>    query.observation.complete = query.passed === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2639 | <code>    query.observation.truncated = resultRows.length &lt; filteredRows.length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2640 | <code>    if (computationRequested) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2641 | <code>        query.observation.computation = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2642 | <code>            schema: 'ailis.computation.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2643 | <code>            deterministic: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2644 | <code>            operation: aggregateResult?.op &#124;&#124; requestedAction,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2645 | <code>            column: aggregateResult?.column &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2646 | <code>            value: aggregateResult?.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2647 | <code>            rowCount: aggregateResult?.rowCount ?? filteredRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2648 | <code>            numericCount: aggregateResult?.numericCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2649 | <code>            filter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2650 | <code>            groupBy: groupBy &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2651 | <code>            sortBy: sortBy &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2652 | <code>            source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2653 | <code>                format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2654 | <code>                path: index.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2655 | <code>                sheet: selected.sheet.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2656 | <code>                range: tableData.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2657 | <code>                table: selected.table.name &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2658 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2659 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2660 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2661 | <code>    return query;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2662 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2663 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2664 | <code>async function inspectXlsxArtifact(input = {}) {</code> | 定义函数 `inspectXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2665 | <code>    const index = await indexXlsxArtifact(input);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2666 | <code>    const sourcePath = index.sourcePath;</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2667 | <code>    const workbookSummary = createWorkbookSummaryFromIndex(index, input.expected &#124;&#124; {});</code> | 声明局部标识符 `workbookSummary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2668 | <code>    const validation = validateXlsxInspection(workbookSummary);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2669 | <code>    const view = buildXlsxInspectView(workbookSummary, input);</code> | 声明局部标识符 `view`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2670 | <code>    const viewMatches = Array.isArray(view.cells)</code> | 声明局部标识符 `viewMatches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2671 | <code>        ? view.cells.map((cell) =&gt; ({ ...cell, kind: 'cell', fullRef: `${view.sheetName}!${cell.ref}`, sheetName: view.sheetName }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2672 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2673 | <code>    const rangeData = view.kind === 'range' &#124;&#124; view.kind === 'table' &#124;&#124; view.kind === 'style' &#124;&#124; view.kind === 'computedstyle'</code> | 声明局部标识符 `rangeData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2674 | <code>        ? buildXlsxRangeRows(index, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2675 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2676 | <code>            action: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2677 | <code>            sheet: view.sheetName &#124;&#124; input.sheet &#124;&#124; input.sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2678 | <code>            range: view.target &#124;&#124; input.range &#124;&#124; input.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2679 | <code>            maxRows: input.maxRows &#124;&#124; input.max_rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2680 | <code>            maxCols: input.maxCols &#124;&#124; input.max_cols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2681 | <code>            maxMatrixCells: input.maxMatrixCells &#124;&#124; input.max_matrix_cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2682 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2683 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2684 | <code>    const observation = rangeData?.passed === true</code> | 声明局部标识符 `observation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2685 | <code>        ? buildQueryObservation({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2686 | <code>            schema: 'ailis.xlsx.inspect.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2687 | <code>            adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2688 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2689 | <code>            sourcePath: index.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2690 | <code>            sessionId: input.sessionId &#124;&#124; input.session_id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2691 | <code>            action: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2692 | <code>            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2693 | <code>            passed: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2694 | <code>            sheetName: rangeData.sheetName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2695 | <code>            range: rangeData.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2696 | <code>            requestedRange: rangeData.requestedRange &#124;&#124; rangeData.range &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2697 | <code>            usedRange: rangeData.usedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2698 | <code>            returnedRange: rangeData.returnedRange &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2699 | <code>            rowCount: rangeData.rowCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2700 | <code>            columnCount: rangeData.columnCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2701 | <code>            requestedRows: rangeData.requestedRows &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2702 | <code>            requestedColumns: rangeData.requestedColumns &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2703 | <code>            truncated: rangeData.truncated === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2704 | <code>            columns: rangeData.columns &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2705 | <code>            rows: rangeData.rows &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2706 | <code>            compactGrid: rangeData.compactGrid &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2707 | <code>            fillHistogram: rangeData.fillHistogram &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2708 | <code>            diagnostics: [...(rangeData.diagnostics &#124;&#124; []), ...(validation.diagnostics &#124;&#124; [])],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2709 | <code>            maxMatrixCells: input.maxMatrixCells &#124;&#124; input.max_matrix_cells</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2710 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2711 | <code>        : buildCompactXlsxObservation({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2712 | <code>            index: { ...index, structure: workbookSummary },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2713 | <code>            matches: viewMatches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2714 | <code>            action: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2715 | <code>            query: input.target &#124;&#124; input.range &#124;&#124; input.kind &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2716 | <code>            diagnostics: [...(rangeData?.diagnostics &#124;&#124; []), ...(validation.diagnostics &#124;&#124; [])]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2717 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2718 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2719 | <code>        format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2720 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2721 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2722 | <code>        structure: workbookSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2723 | <code>        view,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2724 | <code>        index: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2725 | <code>            cacheHit: index.cacheHit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2726 | <code>            summary: index.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2727 | <code>            signature: index.signature</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2728 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2729 | <code>        observation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2730 | <code>        validation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2731 | <code>        text: workbookSummary.sheets.flatMap((sheet) =&gt; sheet.cells.map((cell) =&gt; cell.text).filter(Boolean)).join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2732 | <code>        diagnostics: validation.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2733 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2734 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2735 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2736 | <code>function parseDelimitedLine(line, delimiter = ',') {</code> | 定义函数 `parseDelimitedLine`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2737 | <code>    const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2738 | <code>    let current = '';</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2739 | <code>    let quoted = false;</code> | 声明局部标识符 `quoted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2740 | <code>    for (let index = 0; index &lt; line.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2741 | <code>        const char = line[index];</code> | 声明局部标识符 `char`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2742 | <code>        if (char === '"') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2743 | <code>            if (quoted &amp;&amp; line[index + 1] === '"') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2744 | <code>                current += '"';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2745 | <code>                index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2746 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2747 | <code>                quoted = !quoted;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2748 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2749 | <code>        } else if (char === delimiter &amp;&amp; !quoted) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2750 | <code>            cells.push(current);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2751 | <code>            current = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2752 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2753 | <code>            current += char;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2754 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2755 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2756 | <code>    cells.push(current);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2757 | <code>    return cells;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2758 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2759 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2760 | <code>function parseCsvText(text, delimiter = ',') {</code> | 定义函数 `parseCsvText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2761 | <code>    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2762 | <code>        .split('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2763 | <code>        .filter((line, index, lines) =&gt; line.length &#124;&#124; index &lt; lines.length - 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2764 | <code>        .map((line) =&gt; parseDelimitedLine(line, delimiter));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2765 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2766 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2767 | <code>function inferPrimitiveType(values) {</code> | 定义函数 `inferPrimitiveType`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2768 | <code>    const present = values.map((value) =&gt; String(value ?? '').trim()).filter(Boolean);</code> | 声明局部标识符 `present`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2769 | <code>    if (!present.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2770 | <code>        return 'empty';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2771 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2772 | <code>    const tests = {</code> | 声明局部标识符 `tests`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2773 | <code>        boolean: (value) =&gt; /^(true&#124;false)$/i.test(value),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2774 | <code>        number: (value) =&gt; Number.isFinite(Number(value)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2775 | <code>        date: (value) =&gt; /^\d{4}-\d{2}-\d{2}$/.test(value) &amp;&amp; !Number.isNaN(Date.parse(value))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2776 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2777 | <code>    for (const [type, test] of Object.entries(tests)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2778 | <code>        if (present.every(test)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2779 | <code>            return type;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2780 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2781 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2782 | <code>    return 'string';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2783 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2784 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2785 | <code>async function inspectCsvArtifact(input = {}) {</code> | 定义函数 `inspectCsvArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2786 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2787 | <code>    const text = await fsp.readFile(sourcePath, 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2788 | <code>    const delimiter = input.format === 'tsv' ? '\t' : ',';</code> | 声明局部标识符 `delimiter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2789 | <code>    const rows = parseCsvText(text, delimiter);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2790 | <code>    const headers = rows[0] &#124;&#124; [];</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2791 | <code>    const dataRows = rows.slice(1);</code> | 声明局部标识符 `dataRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2792 | <code>    const malformedRows = dataRows</code> | 声明局部标识符 `malformedRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2793 | <code>        .map((row, index) =&gt; ({ lineNumber: index + 2, cellCount: row.length }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2794 | <code>        .filter((row) =&gt; row.cellCount !== headers.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2795 | <code>    const columns = headers.map((header, colIndex) =&gt; ({</code> | 声明局部标识符 `columns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2796 | <code>        name: header,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2797 | <code>        type: inferPrimitiveType(dataRows.map((row) =&gt; row[colIndex])),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2798 | <code>        missing: dataRows.filter((row) =&gt; !String(row[colIndex] ?? '').trim()).length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2799 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2800 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2801 | <code>        format: input.format === 'tsv' ? 'tsv' : 'csv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2802 | <code>        adapterId: 'csv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2803 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2804 | <code>        structure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2805 | <code>            delimiter,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2806 | <code>            headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2807 | <code>            rowCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2808 | <code>            dataRowCount: dataRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2809 | <code>            rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2810 | <code>            columns,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2811 | <code>            malformedRows</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2812 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2813 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2814 | <code>        diagnostics: malformedRows.map((row) =&gt; createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2815 | <code>            'csv_malformed_row',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2816 | <code>            'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2817 | <code>            `CSV row ${row.lineNumber} has ${row.cellCount} cells; expected ${headers.length}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2818 | <code>            row</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2819 | <code>        ))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2820 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2821 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2822 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2823 | <code>function decodePdfString(value = '') {</code> | 定义函数 `decodePdfString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2824 | <code>    return String(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2825 | <code>        .replace(/\\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2826 | <code>        .replace(/\\r/g, '\r')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2827 | <code>        .replace(/\\t/g, '\t')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2828 | <code>        .replace(/\\\(/g, '(')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2829 | <code>        .replace(/\\\)/g, ')')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2830 | <code>        .replace(/\\\\/g, '\\');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2831 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2832 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2833 | <code>function extractPdfText(raw) {</code> | 定义函数 `extractPdfText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2834 | <code>    const spans = [];</code> | 声明局部标识符 `spans`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2835 | <code>    const regex = /\(((?:\\.&#124;[^\\()])*)\)\s*Tj/g;</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2836 | <code>    let match = regex.exec(raw);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2837 | <code>    while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2838 | <code>        spans.push(decodePdfString(match[1]));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2839 | <code>        match = regex.exec(raw);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2840 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2841 | <code>    return spans.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2842 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2843 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2844 | <code>async function inspectPdfArtifact(input = {}) {</code> | 定义函数 `inspectPdfArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2845 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2846 | <code>    const raw = await fsp.readFile(sourcePath, 'latin1');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2847 | <code>    const text = extractPdfText(raw);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2848 | <code>    const pageCount = (raw.match(/\/Type\s*\/Page\b/g) &#124;&#124; []).length;</code> | 声明局部标识符 `pageCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2849 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2850 | <code>        format: 'pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2851 | <code>        adapterId: 'pdf',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2852 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2853 | <code>        structure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2854 | <code>            pageCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2855 | <code>            textSpanCount: text ? text.split('\n').filter(Boolean).length : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2856 | <code>            hasTextLayer: Boolean(text.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2857 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2858 | <code>        text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2859 | <code>        diagnostics: text.trim() ? [] : [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2860 | <code>            'pdf_text_layer_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2861 | <code>            'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2862 | <code>            'PDF text-layer extraction returned no text; OCR/render fallback may be needed.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2863 | <code>        )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2864 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2865 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2867 | <code>async function readZipEntries(sourcePath, patterns) {</code> | 定义函数 `readZipEntries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2868 | <code>    const python = process.env.AILIS_ARTIFACT_PYTHON &#124;&#124; process.env.PYTHON &#124;&#124; 'python';</code> | 声明局部标识符 `python`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2869 | <code>    const script = [</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2870 | <code>        'import json, re, sys, zipfile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2871 | <code>        'path = sys.argv[1]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2872 | <code>        'patterns = [re.compile(p) for p in json.loads(sys.argv[2])]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2873 | <code>        'with zipfile.ZipFile(path) as z:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2874 | <code>        '    names = z.namelist()',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2875 | <code>        '    entries = {}',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2876 | <code>        '    for name in names:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2877 | <code>        '        if any(pattern.search(name) for pattern in patterns):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2878 | <code>        '            entries[name] = z.read(name).decode("utf-8", "replace")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2879 | <code>        'print(json.dumps({"names": names, "entries": entries}, ensure_ascii=False))'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2880 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2881 | <code>    const { stdout } = await execFileAsync(python, ['-c', script, sourcePath, JSON.stringify(patterns)], {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2882 | <code>        maxBuffer: 8 * 1024 * 1024</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2883 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2884 | <code>    return JSON.parse(stdout);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2885 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2886 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2887 | <code>function extractXmlText(xml = '') {</code> | 定义函数 `extractXmlText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2888 | <code>    const texts = [];</code> | 声明局部标识符 `texts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2889 | <code>    const regex = /&lt;(?:\w+:)?t\b[^&gt;]*&gt;([\s\S]*?)&lt;\/(?:\w+:)?t&gt;/g;</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2890 | <code>    let match = regex.exec(xml);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2891 | <code>    while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 2892 | <code>        texts.push(decodeXmlText(match[1]));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2893 | <code>        match = regex.exec(xml);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2894 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2895 | <code>    return texts;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2896 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2897 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2898 | <code>async function inspectDocxArtifact(input = {}) {</code> | 定义函数 `inspectDocxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2899 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2900 | <code>    const archive = await readZipEntries(sourcePath, ['^word/document\\.xml$']);</code> | 声明局部标识符 `archive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2901 | <code>    const documentXml = archive.entries['word/document.xml'] &#124;&#124; '';</code> | 声明局部标识符 `documentXml`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2902 | <code>    const textRuns = extractXmlText(documentXml);</code> | 声明局部标识符 `textRuns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2903 | <code>    const tableCount = (documentXml.match(/&lt;w:tbl\b/g) &#124;&#124; []).length;</code> | 声明局部标识符 `tableCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2904 | <code>    const paragraphCount = (documentXml.match(/&lt;w:p\b/g) &#124;&#124; []).length;</code> | 声明局部标识符 `paragraphCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2905 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2906 | <code>        format: 'docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2907 | <code>        adapterId: 'docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2908 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2909 | <code>        structure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2910 | <code>            partCount: archive.names.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2911 | <code>            paragraphCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2912 | <code>            tableCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2913 | <code>            textRunCount: textRuns.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2914 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2915 | <code>        text: textRuns.join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2916 | <code>        diagnostics: documentXml ? [] : [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2917 | <code>            'docx_document_part_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2918 | <code>            'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2919 | <code>            'DOCX archive does not contain word/document.xml.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2920 | <code>        )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2921 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2922 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2923 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2924 | <code>async function inspectPptxArtifact(input = {}) {</code> | 定义函数 `inspectPptxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2925 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2926 | <code>    const archive = await readZipEntries(sourcePath, ['^ppt/slides/slide\\d+\\.xml$']);</code> | 声明局部标识符 `archive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2927 | <code>    const slides = Object.entries(archive.entries)</code> | 声明局部标识符 `slides`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2928 | <code>        .sort(([left], [right]) =&gt; left.localeCompare(right, undefined, { numeric: true }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2929 | <code>        .map(([name, xml], index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2930 | <code>            index: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2931 | <code>            name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2932 | <code>            texts: extractXmlText(xml)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2933 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2934 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2935 | <code>        format: 'pptx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2936 | <code>        adapterId: 'pptx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2937 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2938 | <code>        structure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2939 | <code>            partCount: archive.names.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2940 | <code>            slideCount: slides.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2941 | <code>            slides</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2942 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2943 | <code>        text: slides.flatMap((slide) =&gt; slide.texts).join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2944 | <code>        diagnostics: slides.length ? [] : [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2945 | <code>            'pptx_slides_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2946 | <code>            'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2947 | <code>            'PPTX archive does not contain ppt/slides/slide*.xml parts.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2948 | <code>        )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2949 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2950 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2951 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2952 | <code>async function inspectArtifact(input = {}) {</code> | 定义函数 `inspectArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2953 | <code>    const format = normalizeFormat(input.format, input.sourcePath &#124;&#124; input.path);</code> | 声明局部标识符 `format`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2954 | <code>    if (format === 'xlsx' &#124;&#124; format === 'xlsm') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2955 | <code>        return inspectXlsxArtifact(input);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2956 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2957 | <code>    if (format === 'csv' &#124;&#124; format === 'tsv') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2958 | <code>        return inspectCsvArtifact({ ...input, format });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2959 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2960 | <code>    if (FILE_ADAPTER_FORMATS.has(format)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2961 | <code>        return inspectFileArtifact({ ...input, format });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2962 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2963 | <code>    throw new Error(`No implemented artifact adapter for format: ${format}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 2964 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2965 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2966 | <code>function compareStringArrays(actual = [], expected = []) {</code> | 定义函数 `compareStringArrays`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2967 | <code>    return actual.length === expected.length &amp;&amp; actual.every((entry, index) =&gt; entry === expected[index]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2968 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2970 | <code>function findXlsxSheet(structure = {}, sheetName = '') {</code> | 定义函数 `findXlsxSheet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2971 | <code>    return (structure.sheets &#124;&#124; []).find((sheet) =&gt; sheet.name === sheetName)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2972 | <code>        &#124;&#124; (structure.sheets &#124;&#124; [])[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2973 | <code>        &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2974 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2975 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2976 | <code>function findXlsxCell(structure = {}, locator = '') {</code> | 定义函数 `findXlsxCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2977 | <code>    const parsed = parseWorkbookTarget(locator, '');</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2978 | <code>    const sheet = findXlsxSheet(structure, parsed.sheetName);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2979 | <code>    if (!sheet &#124;&#124; !parsed.rangeRef) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2980 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2981 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2982 | <code>    const ref = parsed.rangeRef.split(':')[0].replace(/\$/g, '').toUpperCase();</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2983 | <code>    return (sheet.cells &#124;&#124; []).find((cell) =&gt; cell.ref.toUpperCase() === ref) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 2984 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2985 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2986 | <code>function validateAgainstExpected(inspection, expected = {}) {</code> | 定义函数 `validateAgainstExpected`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2987 | <code>    const checks = [];</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2988 | <code>    const diagnostics = [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2989 | <code>    const format = inspection.format;</code> | 声明局部标识符 `format`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2990 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2991 | <code>    if (format === 'xlsx' &amp;&amp; expected.mapPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 2992 | <code>        const sheet = inspection.structure.sheets[0] &#124;&#124; {};</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2993 | <code>        const mapPath = sheet.mapPath &#124;&#124; {};</code> | 声明局部标识符 `mapPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2994 | <code>        const landedColor = normalizeHex(mapPath.landed?.fillRgb &#124;&#124; '');</code> | 声明局部标识符 `landedColor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2995 | <code>        const expectedColor = normalizeHex(expected.mapPath.landedColor);</code> | 声明局部标识符 `expectedColor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2996 | <code>        const landedCellOk = mapPath.landed?.ref === expected.mapPath.landedCell;</code> | 声明局部标识符 `landedCellOk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2997 | <code>        const landedColorOk = landedColor === expectedColor;</code> | 声明局部标识符 `landedColorOk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2998 | <code>        const minLengthOk = (mapPath.path?.length &#124;&#124; 0) &gt;= Number(expected.mapPath.minimumPathLength &#124;&#124; 0);</code> | 声明局部标识符 `minLengthOk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2999 | <code>        checks.push({ name: 'map_path_landed_cell', passed: landedCellOk, actual: mapPath.landed?.ref &#124;&#124; '', expected: expected.mapPath.landedCell });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3000 | <code>        checks.push({ name: 'map_path_landed_color', passed: landedColorOk, actual: landedColor, expected: expectedColor });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3001 | <code>        checks.push({ name: 'map_path_minimum_length', passed: minLengthOk, actual: mapPath.path?.length &#124;&#124; 0, expected: expected.mapPath.minimumPathLength });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3002 | <code>        diagnostics.push(...(mapPath.diagnostics &#124;&#124; []));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3003 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3004 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3005 | <code>    if (format === 'xlsx' &amp;&amp; expected.xlsx) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3006 | <code>        const xlsx = expected.xlsx;</code> | 声明局部标识符 `xlsx`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3007 | <code>        const structure = inspection.structure &#124;&#124; {};</code> | 声明局部标识符 `structure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3008 | <code>        if (xlsx.sheetNames) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3009 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3010 | <code>                name: 'xlsx_sheet_names',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3011 | <code>                passed: compareStringArrays(structure.workbook?.sheetNames &#124;&#124; [], xlsx.sheetNames),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3012 | <code>                actual: structure.workbook?.sheetNames &#124;&#124; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3013 | <code>                expected: xlsx.sheetNames</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3014 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3015 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3016 | <code>        if (Number.isFinite(Number(xlsx.minimumFormulaCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3017 | <code>            const formulaCount = (structure.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.formulas?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `formulaCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3018 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3019 | <code>                name: 'xlsx_minimum_formula_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3020 | <code>                passed: formulaCount &gt;= Number(xlsx.minimumFormulaCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3021 | <code>                actual: formulaCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3022 | <code>                expected: Number(xlsx.minimumFormulaCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3023 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3024 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3025 | <code>        if (Number.isFinite(Number(xlsx.formulaErrorCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3026 | <code>            const formulaErrorCount = (structure.sheets &#124;&#124; []).reduce((sum, sheet) =&gt; sum + (sheet.formulaErrors?.length &#124;&#124; 0), 0);</code> | 声明局部标识符 `formulaErrorCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3027 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3028 | <code>                name: 'xlsx_formula_error_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3029 | <code>                passed: formulaErrorCount === Number(xlsx.formulaErrorCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3030 | <code>                actual: formulaErrorCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3031 | <code>                expected: Number(xlsx.formulaErrorCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3032 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3033 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3034 | <code>        for (const tableName of xlsx.requiredTables &#124;&#124; []) {</code> | 声明局部标识符 `tableName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3035 | <code>            const hasTable = (structure.sheets &#124;&#124; []).some((sheet) =&gt; (sheet.tables &#124;&#124; []).some((table) =&gt; table.name === tableName));</code> | 声明局部标识符 `hasTable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3036 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3037 | <code>                name: `xlsx_table_${tableName}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3038 | <code>                passed: hasTable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3039 | <code>                actual: hasTable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3040 | <code>                expected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3041 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3042 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3043 | <code>        for (const mergeRef of xlsx.requiredMerges &#124;&#124; []) {</code> | 声明局部标识符 `mergeRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3044 | <code>            const parsed = parseWorkbookTarget(mergeRef, '');</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3045 | <code>            const sheet = findXlsxSheet(structure, parsed.sheetName);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3046 | <code>            const hasMerge = Boolean(sheet &amp;&amp; (sheet.merges &#124;&#124; []).includes(parsed.rangeRef));</code> | 声明局部标识符 `hasMerge`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3047 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3048 | <code>                name: `xlsx_merge_${mergeRef}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3049 | <code>                passed: hasMerge,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3050 | <code>                actual: hasMerge,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3051 | <code>                expected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3052 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3053 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3054 | <code>        for (const expectedCell of xlsx.cells &#124;&#124; []) {</code> | 声明局部标识符 `expectedCell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3055 | <code>            const cell = findXlsxCell(structure, expectedCell.ref &#124;&#124; expectedCell.locator);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3056 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3057 | <code>                name: `xlsx_cell_exists_${expectedCell.ref &#124;&#124; expectedCell.locator}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3058 | <code>                passed: Boolean(cell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3059 | <code>                actual: Boolean(cell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3060 | <code>                expected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3061 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3062 | <code>            if (!cell) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3063 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3064 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3065 | <code>            if (Object.prototype.hasOwnProperty.call(expectedCell, 'value')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3066 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3067 | <code>                    name: `xlsx_cell_value_${expectedCell.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3068 | <code>                    passed: cell.value === expectedCell.value &#124;&#124; cell.text === String(expectedCell.value),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3069 | <code>                    actual: cell.value ?? cell.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3070 | <code>                    expected: expectedCell.value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3071 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3072 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3073 | <code>            if (expectedCell.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3074 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3075 | <code>                    name: `xlsx_cell_formula_${expectedCell.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3076 | <code>                    passed: String(cell.formula &#124;&#124; '').replace(/^=/, '') === String(expectedCell.formula).replace(/^=/, ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3077 | <code>                    actual: cell.formula &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3078 | <code>                    expected: expectedCell.formula</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3079 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3080 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3081 | <code>            if (expectedCell.fillRgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3082 | <code>                const actualFill = normalizeHex(cell.fillRgb &#124;&#124; cell.style?.fillRgb &#124;&#124; '');</code> | 声明局部标识符 `actualFill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3083 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3084 | <code>                    name: `xlsx_cell_fill_${expectedCell.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3085 | <code>                    passed: actualFill === normalizeHex(expectedCell.fillRgb),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3086 | <code>                    actual: actualFill,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3087 | <code>                    expected: normalizeHex(expectedCell.fillRgb)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3088 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3089 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3090 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3091 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3092 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3093 | <code>    if (format === 'csv' &amp;&amp; expected.headers) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3094 | <code>        const headers = inspection.structure.headers &#124;&#124; [];</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3095 | <code>        const malformed = (inspection.structure.malformedRows &#124;&#124; []).map((row) =&gt; row.lineNumber);</code> | 声明局部标识符 `malformed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3096 | <code>        checks.push({ name: 'csv_headers', passed: compareStringArrays(headers, expected.headers), actual: headers, expected: expected.headers });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3097 | <code>        checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3098 | <code>            name: 'csv_malformed_rows',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3099 | <code>            passed: compareStringArrays(malformed, expected.malformedRowNumbers &#124;&#124; []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3100 | <code>            actual: malformed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3101 | <code>            expected: expected.malformedRowNumbers &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3102 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3103 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3105 | <code>    if (format === 'pdf') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3106 | <code>        if (expected.pageCount) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3107 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3108 | <code>                name: 'pdf_page_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3109 | <code>                passed: inspection.structure.pageCount === expected.pageCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3110 | <code>                actual: inspection.structure.pageCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3111 | <code>                expected: expected.pageCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3112 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3113 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3114 | <code>        if (expected.mustContainText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3115 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3116 | <code>                name: 'pdf_text_contains',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3117 | <code>                passed: inspection.text.includes(expected.mustContainText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3118 | <code>                actual: inspection.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3119 | <code>                expected: expected.mustContainText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3120 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3121 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3122 | <code>        if (expected.mustHaveTextLayer === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3123 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3124 | <code>                name: 'pdf_has_text_layer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3125 | <code>                passed: inspection.structure.hasTextLayer === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3126 | <code>                actual: inspection.structure.hasTextLayer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3127 | <code>                expected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3128 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3129 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3130 | <code>        if (Number.isFinite(Number(expected.minimumTextSpanCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3131 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3132 | <code>                name: 'pdf_minimum_text_span_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3133 | <code>                passed: Number(inspection.structure.textSpanCount &#124;&#124; 0) &gt;= Number(expected.minimumTextSpanCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3134 | <code>                actual: inspection.structure.textSpanCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3135 | <code>                expected: Number(expected.minimumTextSpanCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3136 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3137 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3138 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3140 | <code>    if (format === 'docx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3141 | <code>        if (expected.minimumTableCount) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3142 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3143 | <code>                name: 'docx_table_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3144 | <code>                passed: inspection.structure.tableCount &gt;= expected.minimumTableCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3145 | <code>                actual: inspection.structure.tableCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3146 | <code>                expected: expected.minimumTableCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3147 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3148 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3149 | <code>        if (expected.mustContainText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3150 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3151 | <code>                name: 'docx_text_contains',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3152 | <code>                passed: inspection.text.includes(expected.mustContainText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3153 | <code>                actual: inspection.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3154 | <code>                expected: expected.mustContainText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3155 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3156 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3157 | <code>        if (Number.isFinite(Number(expected.minimumParagraphCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3158 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3159 | <code>                name: 'docx_minimum_paragraph_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3160 | <code>                passed: Number(inspection.structure.paragraphCount &#124;&#124; 0) &gt;= Number(expected.minimumParagraphCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3161 | <code>                actual: inspection.structure.paragraphCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3162 | <code>                expected: Number(expected.minimumParagraphCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3163 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3164 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3165 | <code>        if (Number.isFinite(Number(expected.minimumCommentCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3166 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3167 | <code>                name: 'docx_minimum_comment_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3168 | <code>                passed: Number(inspection.structure.commentCount &#124;&#124; 0) &gt;= Number(expected.minimumCommentCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3169 | <code>                actual: inspection.structure.commentCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3170 | <code>                expected: Number(expected.minimumCommentCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3171 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3172 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3173 | <code>        if (Number.isFinite(Number(expected.minimumImageCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3174 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3175 | <code>                name: 'docx_minimum_image_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3176 | <code>                passed: Number(inspection.structure.imageCount &#124;&#124; 0) &gt;= Number(expected.minimumImageCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3177 | <code>                actual: inspection.structure.imageCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3178 | <code>                expected: Number(expected.minimumImageCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3179 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3180 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3181 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3182 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3183 | <code>    if (format === 'pptx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3184 | <code>        if (expected.slideCount) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3185 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3186 | <code>                name: 'pptx_slide_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3187 | <code>                passed: inspection.structure.slideCount === expected.slideCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3188 | <code>                actual: inspection.structure.slideCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3189 | <code>                expected: expected.slideCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3190 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3191 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3192 | <code>        if (expected.mustContainText) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3193 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3194 | <code>                name: 'pptx_text_contains',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3195 | <code>                passed: inspection.text.includes(expected.mustContainText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3196 | <code>                actual: inspection.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3197 | <code>                expected: expected.mustContainText</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3198 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3199 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3200 | <code>        if (Number.isFinite(Number(expected.minimumImageCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3201 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3202 | <code>                name: 'pptx_minimum_image_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3203 | <code>                passed: Number(inspection.structure.imageCount &#124;&#124; inspection.structure.mediaCount &#124;&#124; 0) &gt;= Number(expected.minimumImageCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3204 | <code>                actual: inspection.structure.imageCount &#124;&#124; inspection.structure.mediaCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3205 | <code>                expected: Number(expected.minimumImageCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3206 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3207 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3208 | <code>        if (Number.isFinite(Number(expected.minimumTableCount))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3209 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3210 | <code>                name: 'pptx_minimum_table_count',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3211 | <code>                passed: Number(inspection.structure.tableCount &#124;&#124; 0) &gt;= Number(expected.minimumTableCount),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3212 | <code>                actual: inspection.structure.tableCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3213 | <code>                expected: Number(expected.minimumTableCount)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3214 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3215 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3218 | <code>    if (inspection.adapterId === 'image' &#124;&#124; ['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'bmp', 'gif'].includes(format)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3219 | <code>        if (expected.width) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3220 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3221 | <code>                name: 'image_width',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3222 | <code>                passed: inspection.structure.width === expected.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3223 | <code>                actual: inspection.structure.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3224 | <code>                expected: expected.width</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3225 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3226 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3227 | <code>        if (expected.height) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3228 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3229 | <code>                name: 'image_height',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3230 | <code>                passed: inspection.structure.height === expected.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3231 | <code>                actual: inspection.structure.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3232 | <code>                expected: expected.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3233 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3234 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3235 | <code>        if (expected.nonblank === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3236 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3237 | <code>                name: 'image_nonblank',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3238 | <code>                passed: inspection.structure.visualCheck?.blank === false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3239 | <code>                actual: inspection.structure.visualCheck,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3240 | <code>                expected: { blank: false }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3241 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3242 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3243 | <code>        if (expected.mustContainColor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3244 | <code>            const expectedColor = normalizeHex(expected.mustContainColor);</code> | 声明局部标识符 `expectedColor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3245 | <code>            const hasColor = (inspection.structure.dominantColors &#124;&#124; []).some((color) =&gt; normalizeHex(color.rgb) === expectedColor);</code> | 声明局部标识符 `hasColor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3246 | <code>            checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3247 | <code>                name: `image_contains_color_${expectedColor}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3248 | <code>                passed: hasColor,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3249 | <code>                actual: (inspection.structure.dominantColors &#124;&#124; []).map((color) =&gt; normalizeHex(color.rgb)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3250 | <code>                expected: expectedColor</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3251 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3252 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3253 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3255 | <code>    const allowedDiagnosticCodes = new Set(expected.allowedDiagnosticCodes &#124;&#124; expected.allowed_diagnostic_codes &#124;&#124; []);</code> | 声明局部标识符 `allowedDiagnosticCodes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3256 | <code>    const fatalDiagnostics = [...(inspection.diagnostics &#124;&#124; []), ...diagnostics]</code> | 声明局部标识符 `fatalDiagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3257 | <code>        .filter((diagnostic) =&gt; !allowedDiagnosticCodes.has(diagnostic.code))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3258 | <code>        .filter((diagnostic) =&gt; diagnostic.severity === 'fatal' &#124;&#124; diagnostic.severity === 'error');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3259 | <code>    checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3260 | <code>        name: 'no_fatal_diagnostics',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3261 | <code>        passed: fatalDiagnostics.length === 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3262 | <code>        actual: fatalDiagnostics.map((diagnostic) =&gt; diagnostic.code),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3263 | <code>        expected: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3264 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3266 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3267 | <code>        passed: checks.every((check) =&gt; check.passed),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3268 | <code>        checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3269 | <code>        diagnostics: [...(inspection.diagnostics &#124;&#124; []), ...diagnostics]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3270 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3271 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3273 | <code>function workbookToSvg(inspection) {</code> | 定义函数 `workbookToSvg`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3274 | <code>    const sheet = inspection.structure.sheets[0] &#124;&#124; { cells: [] };</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3275 | <code>    const filledCells = sheet.cells.filter((cell) =&gt; cell.fillRgb);</code> | 声明局部标识符 `filledCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3276 | <code>    const maxRow = Math.max(1, ...filledCells.map((cell) =&gt; cell.row));</code> | 声明局部标识符 `maxRow`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3277 | <code>    const maxCol = Math.max(1, ...filledCells.map((cell) =&gt; cell.col));</code> | 声明局部标识符 `maxCol`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3278 | <code>    const cellWidth = 54;</code> | 声明局部标识符 `cellWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3279 | <code>    const cellHeight = 30;</code> | 声明局部标识符 `cellHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3280 | <code>    const width = maxCol * cellWidth + 24;</code> | 声明局部标识符 `width`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3281 | <code>    const height = maxRow * cellHeight + 48;</code> | 声明局部标识符 `height`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3282 | <code>    const byRef = new Map(sheet.cells.map((cell) =&gt; [cell.ref, cell]));</code> | 声明局部标识符 `byRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3283 | <code>    const rects = [];</code> | 声明局部标识符 `rects`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3284 | <code>    for (let row = 1; row &lt;= maxRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3285 | <code>        for (let col = 1; col &lt;= maxCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3286 | <code>            const cell = byRef.get(cellRef(row, col)) &#124;&#124; {};</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3287 | <code>            const x = 12 + (col - 1) * cellWidth;</code> | 声明局部标识符 `x`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3288 | <code>            const y = 36 + (row - 1) * cellHeight;</code> | 声明局部标识符 `y`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3289 | <code>            const fill = cell.fillRgb ? `#${cell.fillRgb}` : '#FFFFFF';</code> | 声明局部标识符 `fill`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3290 | <code>            rects.push(`&lt;rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${fill}" stroke="#475569" stroke-width="1"/&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3291 | <code>            if (cell.text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3292 | <code>                rects.push(`&lt;text x="${x + cellWidth / 2}" y="${y + 19}" text-anchor="middle" font-family="Arial" font-size="10" fill="#111827"&gt;${escapeXml(cell.text)}&lt;/text&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3293 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3294 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3296 | <code>    return `&lt;svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"&gt;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3297 | <code>&lt;rect width="100%" height="100%" fill="#F8FAFC"/&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3298 | <code>&lt;text x="12" y="22" font-family="Arial" font-size="13" font-weight="700" fill="#0F172A"&gt;${escapeXml(sheet.name &#124;&#124; 'Workbook')}&lt;/text&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3299 | <code>${rects.join('\n')}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3300 | <code>&lt;/svg&gt;`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3301 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3302 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3303 | <code>function tableToSvg(title, rows) {</code> | 定义函数 `tableToSvg`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3304 | <code>    const maxCols = Math.max(1, ...rows.map((row) =&gt; row.length));</code> | 声明局部标识符 `maxCols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3305 | <code>    const shownRows = rows.slice(0, 10);</code> | 声明局部标识符 `shownRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3306 | <code>    const cellWidth = 118;</code> | 声明局部标识符 `cellWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3307 | <code>    const cellHeight = 28;</code> | 声明局部标识符 `cellHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3308 | <code>    const width = Math.max(360, maxCols * cellWidth + 24);</code> | 声明局部标识符 `width`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3309 | <code>    const height = shownRows.length * cellHeight + 52;</code> | 声明局部标识符 `height`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3310 | <code>    const parts = [</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3311 | <code>        `&lt;svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"&gt;`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 3312 | <code>        '&lt;rect width="100%" height="100%" fill="#F8FAFC"/&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3313 | <code>        `&lt;text x="12" y="22" font-family="Arial" font-size="13" font-weight="700" fill="#0F172A"&gt;${escapeXml(title)}&lt;/text&gt;`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3314 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3315 | <code>    shownRows.forEach((row, rowIndex) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3316 | <code>        row.forEach((value, colIndex) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3317 | <code>            const x = 12 + colIndex * cellWidth;</code> | 声明局部标识符 `x`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3318 | <code>            const y = 36 + rowIndex * cellHeight;</code> | 声明局部标识符 `y`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3319 | <code>            parts.push(`&lt;rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${rowIndex === 0 ? '#E2E8F0' : '#FFFFFF'}" stroke="#CBD5E1"/&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3320 | <code>            parts.push(`&lt;text x="${x + 6}" y="${y + 18}" font-family="Arial" font-size="10" fill="#111827"&gt;${escapeXml(String(value).slice(0, 22))}&lt;/text&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3321 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3322 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3323 | <code>    parts.push('&lt;/svg&gt;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3324 | <code>    return parts.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3325 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3327 | <code>function textToSvg(title, lines) {</code> | 定义函数 `textToSvg`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3328 | <code>    const shownLines = lines.filter(Boolean).slice(0, 14);</code> | 声明局部标识符 `shownLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3329 | <code>    const width = 760;</code> | 声明局部标识符 `width`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3330 | <code>    const height = Math.max(120, shownLines.length * 24 + 56);</code> | 声明局部标识符 `height`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3331 | <code>    const parts = [</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3332 | <code>        `&lt;svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"&gt;`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 3333 | <code>        '&lt;rect width="100%" height="100%" fill="#F8FAFC"/&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3334 | <code>        `&lt;text x="18" y="26" font-family="Arial" font-size="14" font-weight="700" fill="#0F172A"&gt;${escapeXml(title)}&lt;/text&gt;`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3335 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3336 | <code>    shownLines.forEach((line, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3337 | <code>        parts.push(`&lt;text x="18" y="${58 + index * 24}" font-family="Arial" font-size="12" fill="#111827"&gt;${escapeXml(line).slice(0, 140)}&lt;/text&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3338 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3339 | <code>    parts.push('&lt;/svg&gt;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3340 | <code>    return parts.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3341 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3343 | <code>function presentationToSvg(inspection) {</code> | 定义函数 `presentationToSvg`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3344 | <code>    const slides = inspection.structure.slides &#124;&#124; [];</code> | 声明局部标识符 `slides`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3345 | <code>    const width = 760;</code> | 声明局部标识符 `width`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3346 | <code>    const slideWidth = 330;</code> | 声明局部标识符 `slideWidth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3347 | <code>    const slideHeight = 185;</code> | 声明局部标识符 `slideHeight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3348 | <code>    const gap = 24;</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3349 | <code>    const height = Math.max(260, Math.ceil(slides.length / 2) * (slideHeight + gap) + 56);</code> | 声明局部标识符 `height`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3350 | <code>    const parts = [</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3351 | <code>        `&lt;svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"&gt;`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 3352 | <code>        '&lt;rect width="100%" height="100%" fill="#F8FAFC"/&gt;',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3353 | <code>        '&lt;text x="18" y="26" font-family="Arial" font-size="14" font-weight="700" fill="#0F172A"&gt;PPTX Contact Sheet&lt;/text&gt;'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3354 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3355 | <code>    slides.forEach((slide, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3356 | <code>        const col = index % 2;</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3357 | <code>        const row = Math.floor(index / 2);</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3358 | <code>        const x = 18 + col * (slideWidth + gap);</code> | 声明局部标识符 `x`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3359 | <code>        const y = 48 + row * (slideHeight + gap);</code> | 声明局部标识符 `y`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3360 | <code>        parts.push(`&lt;rect x="${x}" y="${y}" width="${slideWidth}" height="${slideHeight}" rx="6" fill="#FFFFFF" stroke="#CBD5E1"/&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3361 | <code>        parts.push(`&lt;text x="${x + 12}" y="${y + 24}" font-family="Arial" font-size="12" font-weight="700" fill="#0F172A"&gt;Slide ${slide.index}&lt;/text&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3362 | <code>        slide.texts.slice(0, 5).forEach((text, textIndex) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3363 | <code>            parts.push(`&lt;text x="${x + 12}" y="${y + 54 + textIndex * 22}" font-family="Arial" font-size="12" fill="#111827"&gt;${escapeXml(text).slice(0, 42)}&lt;/text&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3364 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3365 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3366 | <code>    parts.push('&lt;/svg&gt;');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3367 | <code>    return parts.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3368 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3370 | <code>async function renderXlsxRangeToPng(input = {}) {</code> | 定义函数 `renderXlsxRangeToPng`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3371 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3372 | <code>    const caseId = input.caseId &#124;&#124; path.basename(sourcePath, path.extname(sourcePath));</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3373 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3374 | <code>    const renderDir = path.join(outputDir, 'renders');</code> | 声明局部标识符 `renderDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3375 | <code>    await fsp.mkdir(renderDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3376 | <code>    const parsedTarget = parseWorkbookTarget(input.target &#124;&#124; input.range &#124;&#124; '', input.sheetName &#124;&#124; input.sheet &#124;&#124; '');</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3377 | <code>    const signature = await getFileSignature(sourcePath);</code> | 声明局部标识符 `signature`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3378 | <code>    const scale = clampNumber(input.scale &#124;&#124; 2, 2, 1, 4);</code> | 声明局部标识符 `scale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3379 | <code>    const cacheKey = buildCacheKey([</code> | 声明局部标识符 `cacheKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3380 | <code>        XLSX_RENDER_CACHE_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3381 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3382 | <code>        signature.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3383 | <code>        signature.mtimeMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3384 | <code>        parsedTarget.sheetName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3385 | <code>        parsedTarget.rangeRef &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3386 | <code>        scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3387 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3388 | <code>    const outputPath = input.outputPath</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3389 | <code>        ? toAbsolutePath(input.outputPath, input.repoRoot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3390 | <code>        : path.join(renderDir, `${caseId}-${cacheKey.slice(0, 12)}.png`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3391 | <code>    const metadataPath = `${outputPath}.json`;</code> | 声明局部标识符 `metadataPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3392 | <code>    if (input.refreshRender !== true &amp;&amp; input.refresh_render !== true &amp;&amp; fs.existsSync(outputPath) &amp;&amp; fs.existsSync(metadataPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3393 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3394 | <code>            const [stat, metadataRaw] = await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3395 | <code>                fsp.stat(outputPath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3396 | <code>                fsp.readFile(metadataPath, 'utf8')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3397 | <code>            ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3398 | <code>            const metadata = JSON.parse(metadataRaw);</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3399 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3400 | <code>                passed: stat.size &gt; 128 &amp;&amp; metadata.blank !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3401 | <code>                outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3402 | <code>                renderKind: 'xlsx_range_png_pillow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3403 | <code>                cacheHit: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3404 | <code>                cacheKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3405 | <code>                bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3406 | <code>                width: metadata.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3407 | <code>                height: metadata.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3408 | <code>                target: `${metadata.sheetName}!${metadata.range}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3409 | <code>                visualCheck: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3410 | <code>                    blank: metadata.blank === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3411 | <code>                    uniqueSampledColors: metadata.uniqueSampledColors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3412 | <code>                    nonBlankRatio: metadata.nonBlankRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3413 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3414 | <code>                diagnostics: metadata.blank === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3415 | <code>                    ? [createDiagnostic('xlsx_png_render_blank', 'error', 'Cached XLSX PNG render appears blank.', { outputPath })]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3416 | <code>                    : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3417 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3418 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3419 | <code>            // Stale or corrupt metadata falls through to a fresh render.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3420 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3421 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3422 | <code>    const python = process.env.AILIS_ARTIFACT_PYTHON &#124;&#124; process.env.PYTHON &#124;&#124; 'python';</code> | 声明局部标识符 `python`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3423 | <code>    const script = String.raw`</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3424 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3425 | <code>import math</code> | 导入依赖 `math`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3426 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3427 | <code>from pathlib import Path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3428 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3429 | <code>from openpyxl import load_workbook</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3430 | <code>from openpyxl.utils import get_column_letter, column_index_from_string</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3431 | <code>from openpyxl.utils.cell import range_boundaries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3432 | <code>from PIL import Image, ImageDraw, ImageFont</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3434 | <code>source_path, output_path, sheet_name, range_ref, scale_text = sys.argv[1:6]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3435 | <code>scale = max(1, min(4, int(float(scale_text or "2"))))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3436 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3437 | <code>def norm_hex(value, fallback="FFFFFF"):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3438 | <code>    if value is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3439 | <code>        return fallback</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3440 | <code>    raw = str(value).strip().replace("#", "").upper()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3441 | <code>    if not raw or raw in {"00000000", "000000"}:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3442 | <code>        return fallback</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3443 | <code>    if len(raw) == 8:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3444 | <code>        raw = raw[-6:]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3445 | <code>    if len(raw) != 6:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3446 | <code>        return fallback</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3447 | <code>    return raw</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3448 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3449 | <code>def rgb(value, fallback="FFFFFF"):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3450 | <code>    raw = norm_hex(value, fallback)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3451 | <code>    return tuple(int(raw[i:i+2], 16) for i in (0, 2, 4))</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3453 | <code>def col_px(width):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3454 | <code>    if width is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3455 | <code>        width = 8.43</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3456 | <code>    return max(34, int(float(width) * 7 + 8))</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3457 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3458 | <code>def row_px(height):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3459 | <code>    if height is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3460 | <code>        height = 15</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3461 | <code>    return max(22, int(float(height) * 1.35 + 8))</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3463 | <code>def display_value(cell, data_cell):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3464 | <code>    value = data_cell.value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3465 | <code>    if value is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3466 | <code>        value = cell.value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3467 | <code>    if value is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3468 | <code>        return ""</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3469 | <code>    if isinstance(value, float):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3470 | <code>        if value.is_integer():</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3471 | <code>            return str(int(value))</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3472 | <code>        return f"{value:.4g}"</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3473 | <code>    return str(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3474 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3475 | <code>wb = load_workbook(source_path, data_only=False)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3476 | <code>wb_data = load_workbook(source_path, data_only=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3477 | <code>if not sheet_name:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3478 | <code>    sheet_name = wb.sheetnames[0]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3479 | <code>if sheet_name not in wb.sheetnames:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3480 | <code>    raise ValueError(f"worksheet not found: {sheet_name}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3481 | <code>ws = wb[sheet_name]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3482 | <code>ws_data = wb_data[sheet_name]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3484 | <code>if not range_ref:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3485 | <code>    if ws.max_row and ws.max_column:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3486 | <code>        range_ref = f"A1:{get_column_letter(ws.max_column)}{ws.max_row}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3487 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 3488 | <code>        range_ref = "A1:A1"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3490 | <code>min_col, min_row, max_col, max_row = range_boundaries(range_ref.replace("$", ""))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3491 | <code>min_col = max(1, min_col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3492 | <code>min_row = max(1, min_row)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3493 | <code>max_col = max(min_col, max_col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3494 | <code>max_row = max(min_row, max_row)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3495 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3496 | <code>col_widths = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3497 | <code>for col in range(min_col, max_col + 1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3498 | <code>    letter = get_column_letter(col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3499 | <code>    col_widths.append(col_px(ws.column_dimensions[letter].width))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3500 | <code>row_heights = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3501 | <code>for row in range(min_row, max_row + 1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3502 | <code>    row_heights.append(row_px(ws.row_dimensions[row].height))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3504 | <code>left_pad = 48</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3505 | <code>top_pad = 28</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3506 | <code>width = (left_pad + sum(col_widths) + 8) * scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3507 | <code>height = (top_pad + sum(row_heights) + 8) * scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3508 | <code>image = Image.new("RGB", (width, height), (248, 250, 252))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3509 | <code>draw = ImageDraw.Draw(image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3510 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3511 | <code>    font = ImageFont.truetype("arial.ttf", 11 * scale)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3512 | <code>    bold_font = ImageFont.truetype("arialbd.ttf", 11 * scale)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3513 | <code>    header_font = ImageFont.truetype("arialbd.ttf", 10 * scale)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3514 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 3515 | <code>    font = ImageFont.load_default()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3516 | <code>    bold_font = font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3517 | <code>    header_font = font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3518 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3519 | <code>draw.rectangle([0, 0, width - 1, height - 1], fill=(248, 250, 252))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3520 | <code>draw.text((8 * scale, 7 * scale), f"{sheet_name}!{range_ref}", fill=(15, 23, 42), font=header_font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3521 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3522 | <code>x_positions = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3523 | <code>x = left_pad</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3524 | <code>for w in col_widths:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3525 | <code>    x_positions.append(x)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3526 | <code>    x += w</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3527 | <code>y_positions = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3528 | <code>y = top_pad</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3529 | <code>for h in row_heights:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3530 | <code>    y_positions.append(y)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3531 | <code>    y += h</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3533 | <code>for index, col in enumerate(range(min_col, max_col + 1)):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3534 | <code>    x0 = x_positions[index] * scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3535 | <code>    x1 = (x_positions[index] + col_widths[index]) * scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3536 | <code>    draw.rectangle([x0, top_pad * scale - 20 * scale, x1, top_pad * scale], fill=(226, 232, 240), outline=(148, 163, 184))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3537 | <code>    draw.text((x0 + 5 * scale, top_pad * scale - 16 * scale), get_column_letter(col), fill=(51, 65, 85), font=header_font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3539 | <code>for index, row in enumerate(range(min_row, max_row + 1)):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3540 | <code>    y0 = y_positions[index] * scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3541 | <code>    y1 = (y_positions[index] + row_heights[index]) * scale</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3542 | <code>    draw.rectangle([0, y0, left_pad * scale, y1], fill=(226, 232, 240), outline=(148, 163, 184))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3543 | <code>    draw.text((8 * scale, y0 + 6 * scale), str(row), fill=(51, 65, 85), font=header_font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3545 | <code>merged_slave_cells = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3546 | <code>merged_masters = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3547 | <code>for merged in ws.merged_cells.ranges:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3548 | <code>    if merged.max_col &lt; min_col or merged.min_col &gt; max_col or merged.max_row &lt; min_row or merged.min_row &gt; max_row:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3549 | <code>        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3550 | <code>    master = (merged.min_row, merged.min_col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3551 | <code>    merged_masters[master] = merged</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3552 | <code>    for row in range(merged.min_row, merged.max_row + 1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3553 | <code>        for col in range(merged.min_col, merged.max_col + 1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3554 | <code>            if (row, col) != master:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3555 | <code>                merged_slave_cells.add((row, col))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3556 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3557 | <code>for row in range(min_row, max_row + 1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3558 | <code>    for col in range(min_col, max_col + 1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3559 | <code>        if (row, col) in merged_slave_cells:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3560 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3561 | <code>        col_idx = col - min_col</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3562 | <code>        row_idx = row - min_row</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3563 | <code>        x0 = x_positions[col_idx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3564 | <code>        y0 = y_positions[row_idx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3565 | <code>        cell_width = col_widths[col_idx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3566 | <code>        cell_height = row_heights[row_idx]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3567 | <code>        if (row, col) in merged_masters:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3568 | <code>            merged = merged_masters[(row, col)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3569 | <code>            cell_width = sum(col_widths[max(merged.min_col, min_col) - min_col: min(merged.max_col, max_col) - min_col + 1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3570 | <code>            cell_height = sum(row_heights[max(merged.min_row, min_row) - min_row: min(merged.max_row, max_row) - min_row + 1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3571 | <code>        cell = ws.cell(row=row, column=col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3572 | <code>        data_cell = ws_data.cell(row=row, column=col)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3573 | <code>        fill = cell.fill</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3574 | <code>        fill_color = "FFFFFF"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3575 | <code>        if fill and fill.fill_type == "solid":</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3576 | <code>            fill_color = norm_hex(fill.fgColor.rgb or fill.fgColor.indexed)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3577 | <code>        rect = [x0 * scale, y0 * scale, (x0 + cell_width) * scale, (y0 + cell_height) * scale]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3578 | <code>        draw.rectangle(rect, fill=rgb(fill_color), outline=(203, 213, 225))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3579 | <code>        value = display_value(cell, data_cell)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3580 | <code>        if value:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3581 | <code>            text_color = rgb(getattr(cell.font.color, "rgb", None), "111827") if cell.font and cell.font.color else (17, 24, 39)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3582 | <code>            use_font = bold_font if cell.font and cell.font.bold else font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3583 | <code>            max_chars = max(4, int(cell_width / 7))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3584 | <code>            if len(value) &gt; max_chars:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3585 | <code>                value = value[:max_chars - 1] + "…"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3586 | <code>            draw.text((x0 * scale + 5 * scale, y0 * scale + 7 * scale), value, fill=text_color, font=use_font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3588 | <code>Path(output_path).parent.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3589 | <code>image.save(output_path, "PNG")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3590 | <code>pixels = list(image.getdata())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3591 | <code>step = max(1, len(pixels) // 20000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3592 | <code>sample = pixels[::step]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3593 | <code>background = (248, 250, 252)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3594 | <code>non_blank = sum(1 for pixel in sample if pixel != background)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3595 | <code>unique_colors = len(set(sample))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3596 | <code>non_blank_ratio = non_blank / max(1, len(sample))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3597 | <code>print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3598 | <code>    "outputPath": output_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3599 | <code>    "width": width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3600 | <code>    "height": height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3601 | <code>    "sheetName": sheet_name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3602 | <code>    "range": range_ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3603 | <code>    "scale": scale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3604 | <code>    "uniqueSampledColors": unique_colors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3605 | <code>    "nonBlankRatio": non_blank_ratio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3606 | <code>    "blank": unique_colors &lt;= 1 or non_blank_ratio &lt; 0.001</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3607 | <code>}, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3608 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3609 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3610 | <code>        const { stdout } = await execFileAsync(python, [</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3611 | <code>            '-c',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3612 | <code>            script,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3613 | <code>            sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3614 | <code>            outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3615 | <code>            parsedTarget.sheetName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3616 | <code>            parsedTarget.rangeRef &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3617 | <code>            String(scale)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3618 | <code>        ], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3619 | <code>            cwd: input.repoRoot &#124;&#124; process.cwd(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3620 | <code>            maxBuffer: 4 * 1024 * 1024,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3621 | <code>            timeout: clampNumber(input.timeoutMs &#124;&#124; input.timeout_ms, 60000, 5000, 180000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3622 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3623 | <code>        const metadata = JSON.parse(stdout);</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3624 | <code>        const stat = await fsp.stat(outputPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3625 | <code>        await fsp.writeFile(metadataPath, JSON.stringify({ ...metadata, cacheKey, signature }, null, 2), 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3626 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3627 | <code>            passed: stat.size &gt; 128 &amp;&amp; metadata.blank !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3628 | <code>            outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3629 | <code>            renderKind: 'xlsx_range_png_pillow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3630 | <code>            cacheHit: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3631 | <code>            cacheKey,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3632 | <code>            bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3633 | <code>            width: metadata.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3634 | <code>            height: metadata.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3635 | <code>            target: `${metadata.sheetName}!${metadata.range}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3636 | <code>            visualCheck: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3637 | <code>                blank: metadata.blank === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3638 | <code>                uniqueSampledColors: metadata.uniqueSampledColors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3639 | <code>                nonBlankRatio: metadata.nonBlankRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3640 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3641 | <code>            diagnostics: metadata.blank === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3642 | <code>                ? [createDiagnostic('xlsx_png_render_blank', 'error', 'XLSX PNG render appears blank.', { outputPath })]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3643 | <code>                : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3644 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3645 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3646 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3647 | <code>            passed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3648 | <code>            outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3649 | <code>            renderKind: 'xlsx_range_png_pillow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3650 | <code>            bytes: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3651 | <code>            diagnostics: [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3652 | <code>                'xlsx_png_render_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3653 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3654 | <code>                `XLSX PNG render failed: ${error.message &#124;&#124; String(error)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3655 | <code>                { sourcePath, target: input.target &#124;&#124; input.range &#124;&#124; '' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3656 | <code>            )]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3657 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3658 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3659 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3660 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3661 | <code>async function renderArtifactPreview(input = {}) {</code> | 定义函数 `renderArtifactPreview`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3662 | <code>    const inspection = input.inspection &#124;&#124; await inspectArtifact(input);</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3663 | <code>    const caseId = input.caseId &#124;&#124; path.basename(inspection.sourcePath, path.extname(inspection.sourcePath));</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3664 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3665 | <code>    const renderDir = path.join(outputDir, 'renders');</code> | 声明局部标识符 `renderDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3666 | <code>    await fsp.mkdir(renderDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3667 | <code>    let svg = '';</code> | 声明局部标识符 `svg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3668 | <code>    if (inspection.format === 'xlsx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3669 | <code>        return renderXlsxRangeToPng({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3670 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3671 | <code>            sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3672 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3673 | <code>            outputDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3674 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3675 | <code>    } else if (inspection.format === 'csv' &#124;&#124; inspection.format === 'tsv') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3676 | <code>        svg = tableToSvg('CSV Structure Preview', inspection.structure.rows &#124;&#124; []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3677 | <code>    } else if (FILE_ADAPTER_FORMATS.has(inspection.format) &#124;&#124; inspection.adapterId === 'image') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3678 | <code>        return renderFileArtifactPreview({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3679 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3680 | <code>            sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3681 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3682 | <code>            outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3683 | <code>            inspection</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3684 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3685 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3686 | <code>        svg = textToSvg(`${inspection.format.toUpperCase()} Text Preview`, inspection.text.split(/\r?\n/));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3687 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3688 | <code>    const outputPath = path.join(renderDir, `${caseId}.svg`);</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3689 | <code>    await fsp.writeFile(outputPath, svg, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3690 | <code>    const stat = await fsp.stat(outputPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3691 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3692 | <code>        passed: stat.size &gt; 128 &amp;&amp; svg.includes('&lt;svg') &amp;&amp; (svg.includes('&lt;text') &#124;&#124; svg.includes('&lt;rect')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3693 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3694 | <code>        renderKind: 'svg_structural_preview',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3695 | <code>        bytes: stat.size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3696 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3697 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3698 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3699 | <code>function extractFormulaReferences(formula = '', defaultSheetName = '', definedNameMap = new Map()) {</code> | 定义函数 `extractFormulaReferences`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3700 | <code>    const refs = [];</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3701 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3702 | <code>    const normalized = String(formula &#124;&#124; '').replace(/^=/, '');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3703 | <code>    const refRegex = /(?:(?:'((?:[^']&#124;'')+)'&#124;([A-Za-z_][A-Za-z0-9_ .]*))!)?(\$?[A-Z]{1,3}\$?\d+)(?:\s*:\s*(\$?[A-Z]{1,3}\$?\d+))?/g;</code> | 声明局部标识符 `refRegex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3704 | <code>    let match = refRegex.exec(normalized);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3705 | <code>    while (match) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3706 | <code>        const sheetName = (match[1] &#124;&#124; match[2] &#124;&#124; defaultSheetName &#124;&#124; '').replace(/''/g, "'");</code> | 声明局部标识符 `sheetName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3707 | <code>        const startRef = match[3].replace(/\$/g, '').toUpperCase();</code> | 声明局部标识符 `startRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3708 | <code>        const endRef = match[4] ? match[4].replace(/\$/g, '').toUpperCase() : '';</code> | 声明局部标识符 `endRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3709 | <code>        const rangeRef = endRef ? `${startRef}:${endRef}` : startRef;</code> | 声明局部标识符 `rangeRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3710 | <code>        const key = `${sheetName}!${rangeRef}`;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3711 | <code>        if (!seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3712 | <code>            seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3713 | <code>            refs.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3714 | <code>                sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3715 | <code>                ref: startRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3716 | <code>                endRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3717 | <code>                rangeRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3718 | <code>                kind: endRef ? 'range' : 'cell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3719 | <code>                fullRef: key</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3720 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3721 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3722 | <code>        match = refRegex.exec(normalized);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3723 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3724 | <code>    const tokenRegex = /\b[A-Za-z_][A-Za-z0-9_.]*\b/g;</code> | 声明局部标识符 `tokenRegex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3725 | <code>    let tokenMatch = tokenRegex.exec(normalized);</code> | 声明局部标识符 `tokenMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3726 | <code>    const ignoredTokens = new Set(['TRUE', 'FALSE']);</code> | 声明局部标识符 `ignoredTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3727 | <code>    while (tokenMatch) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 3728 | <code>        const token = tokenMatch[0];</code> | 声明局部标识符 `token`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3729 | <code>        const tokenEnd = tokenMatch.index + token.length;</code> | 声明局部标识符 `tokenEnd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3730 | <code>        const previous = normalized[tokenMatch.index - 1] &#124;&#124; '';</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3731 | <code>        const next = normalized[tokenEnd] &#124;&#124; '';</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3732 | <code>        const key = normalizeDefinedNameKey(token);</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3733 | <code>        const definedName = definedNameMap.get(key);</code> | 声明局部标识符 `definedName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3734 | <code>        if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3735 | <code>            definedName</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3736 | <code>            &amp;&amp; next !== '('</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3737 | <code>            &amp;&amp; next !== '!'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3738 | <code>            &amp;&amp; previous !== '!'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3739 | <code>            &amp;&amp; !ignoredTokens.has(token.toUpperCase())</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3740 | <code>            &amp;&amp; !seen.has(`definedName:${definedName.name}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3741 | <code>        ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3742 | <code>            seen.add(`definedName:${definedName.name}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3743 | <code>            refs.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3744 | <code>                kind: 'defined_name',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3745 | <code>                name: definedName.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3746 | <code>                ranges: definedName.ranges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3747 | <code>                fullRef: `definedName:${definedName.name}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3748 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3749 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3750 | <code>        tokenMatch = tokenRegex.exec(normalized);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 3751 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3752 | <code>    return refs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3753 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3755 | <code>function getWorkbookSheet(workbook, sheetName = '') {</code> | 定义函数 `getWorkbookSheet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3756 | <code>    const sheet = sheetName ? workbook.getWorksheet(sheetName) : workbook.worksheets[0];</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3757 | <code>    if (!sheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3758 | <code>        throw new Error(`Worksheet not found: ${sheetName}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 3759 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3760 | <code>    return sheet;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3761 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3763 | <code>function getCellNumericValue(cell) {</code> | 定义函数 `getCellNumericValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3764 | <code>    const value = getCellValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3765 | <code>    if (typeof value === 'number') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3766 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3767 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3768 | <code>    if (value &amp;&amp; typeof value === 'object' &amp;&amp; typeof value.result === 'number') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3769 | <code>        return value.result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3770 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3771 | <code>    const numeric = Number(value);</code> | 声明局部标识符 `numeric`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3772 | <code>    return Number.isFinite(numeric) ? numeric : 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3773 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3775 | <code>function expandFormulaReference(ref = {}, maxExpandedCells = 80) {</code> | 定义函数 `expandFormulaReference`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3776 | <code>    const bounds = parseRangeRef(ref.rangeRef &#124;&#124; ref.ref);</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3777 | <code>    if (!bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3778 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3779 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3780 | <code>    const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3781 | <code>    for (let row = bounds.startRow; row &lt;= bounds.endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3782 | <code>        for (let col = bounds.startCol; col &lt;= bounds.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3783 | <code>            cells.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3784 | <code>                sheetName: ref.sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3785 | <code>                ref: cellRef(row, col),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3786 | <code>                fullRef: `${ref.sheetName}!${cellRef(row, col)}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3787 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3788 | <code>            if (cells.length &gt;= maxExpandedCells) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3789 | <code>                return cells;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3790 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3791 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3792 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3793 | <code>    return cells;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3794 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3796 | <code>async function traceXlsxFormula(input = {}) {</code> | 定义函数 `traceXlsxFormula`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3797 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3798 | <code>    const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3799 | <code>    await workbook.xlsx.readFile(sourcePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3800 | <code>    const parsedTarget = parseWorkbookTarget(input.target &#124;&#124; input.range &#124;&#124; '', input.sheetName &#124;&#124; input.sheet &#124;&#124; workbook.worksheets[0]?.name &#124;&#124; '');</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3801 | <code>    const sheet = getWorkbookSheet(workbook, parsedTarget.sheetName);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3802 | <code>    const targetRef = parsedTarget.rangeRef &#124;&#124; 'A1';</code> | 声明局部标识符 `targetRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3803 | <code>    const targetCellRef = targetRef.split(':')[0].replace(/\$/g, '').toUpperCase();</code> | 声明局部标识符 `targetCellRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3804 | <code>    const maxDepth = clampNumber(input.maxDepth &#124;&#124; input.max_depth, 4, 1, 12);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3805 | <code>    const maxExpandedCells = clampNumber(input.maxExpandedCells &#124;&#124; input.max_expanded_cells, 80, 1, 500);</code> | 声明局部标识符 `maxExpandedCells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3806 | <code>    const definedNameMap = buildDefinedNameMap(workbook);</code> | 声明局部标识符 `definedNameMap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3807 | <code>    const nodes = new Map();</code> | 声明局部标识符 `nodes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3808 | <code>    const edges = [];</code> | 声明局部标识符 `edges`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3809 | <code>    const diagnostics = [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3811 | <code>    function addNode(node) {</code> | 定义函数 `addNode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3812 | <code>        const existing = nodes.get(node.id);</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3813 | <code>        nodes.set(node.id, { ...(existing &#124;&#124; {}), ...node });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3814 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3815 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3816 | <code>    function visitCell(sheetName, ref, depth, stack = []) {</code> | 定义函数 `visitCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3817 | <code>        const id = `${sheetName}!${ref}`;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3818 | <code>        if (stack.includes(id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3819 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3820 | <code>                'xlsx_formula_trace_cycle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3821 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3822 | <code>                `Formula trace encountered a cycle at ${id}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3823 | <code>                { ref: id, stack }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3824 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3825 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3826 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3827 | <code>        const worksheet = workbook.getWorksheet(sheetName);</code> | 声明局部标识符 `worksheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3828 | <code>        if (!worksheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3829 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3830 | <code>                'xlsx_formula_trace_missing_sheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3831 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3832 | <code>                `Formula reference points to a missing worksheet: ${sheetName}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3833 | <code>                { sheetName, ref }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3834 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3835 | <code>            addNode({ id, kind: 'missing_sheet', sheetName, ref });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3836 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3837 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3838 | <code>        const cell = worksheet.getCell(ref);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3839 | <code>        const formula = cell.formula &#124;&#124; '';</code> | 声明局部标识符 `formula`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3840 | <code>        const error = getCellErrorCode(cell);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3841 | <code>        addNode({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3842 | <code>            id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3843 | <code>            kind: formula ? 'formula_cell' : 'cell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3844 | <code>            sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3845 | <code>            ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3846 | <code>            value: clonePlain(getCellValue(cell)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3847 | <code>            text: getPrimitiveText(getCellValue(cell)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3848 | <code>            formula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3849 | <code>            result: getFormulaResult(cell),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3850 | <code>            error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3851 | <code>            depth</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3852 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3853 | <code>        if (!formula &#124;&#124; depth &gt;= maxDepth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3854 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3855 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3856 | <code>        const refs = extractFormulaReferences(formula, sheetName, definedNameMap);</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3857 | <code>        for (const dependency of refs) {</code> | 声明局部标识符 `dependency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3858 | <code>            if (dependency.kind === 'range') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3859 | <code>                addNode({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3860 | <code>                    id: dependency.fullRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3861 | <code>                    kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3862 | <code>                    sheetName: dependency.sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3863 | <code>                    ref: dependency.rangeRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3864 | <code>                    depth: depth + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3865 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3866 | <code>                edges.push({ from: id, to: dependency.fullRef, kind: 'references_range' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3867 | <code>                const expanded = expandFormulaReference(dependency, maxExpandedCells);</code> | 声明局部标识符 `expanded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3868 | <code>                for (const cellDependency of expanded) {</code> | 声明局部标识符 `cellDependency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3869 | <code>                    edges.push({ from: dependency.fullRef, to: cellDependency.fullRef, kind: 'contains' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3870 | <code>                    visitCell(cellDependency.sheetName, cellDependency.ref, depth + 2, [...stack, id, dependency.fullRef]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3871 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3872 | <code>                if (expanded.length &gt;= maxExpandedCells) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3873 | <code>                    diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3874 | <code>                        'xlsx_formula_trace_truncated',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3875 | <code>                        'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3876 | <code>                        `Formula range ${dependency.fullRef} was truncated during trace expansion.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3877 | <code>                        { maxExpandedCells }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3878 | <code>                    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3879 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3880 | <code>            } else if (dependency.kind === 'defined_name') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3881 | <code>                addNode({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3882 | <code>                    id: dependency.fullRef,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3883 | <code>                    kind: 'defined_name',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3884 | <code>                    name: dependency.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3885 | <code>                    ranges: dependency.ranges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3886 | <code>                    depth: depth + 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3887 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3888 | <code>                edges.push({ from: id, to: dependency.fullRef, kind: 'references_defined_name' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3889 | <code>                for (const range of dependency.ranges &#124;&#124; []) {</code> | 声明局部标识符 `range`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3890 | <code>                    const parsedRange = parseWorkbookTarget(range, sheetName);</code> | 声明局部标识符 `parsedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3891 | <code>                    const normalizedRange = String(parsedRange.rangeRef &#124;&#124; '').replace(/\$/g, '').toUpperCase();</code> | 声明局部标识符 `normalizedRange`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3892 | <code>                    const rangeId = `${parsedRange.sheetName}!${normalizedRange}`;</code> | 声明局部标识符 `rangeId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3893 | <code>                    if (!normalizedRange &#124;&#124; !parsedRange.sheetName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3894 | <code>                        diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3895 | <code>                            'xlsx_formula_trace_unresolved_defined_name',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3896 | <code>                            'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3897 | <code>                            `Defined name ${dependency.name} has an unsupported target: ${range}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3898 | <code>                            { name: dependency.name, range }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3899 | <code>                        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3900 | <code>                        continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3901 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3902 | <code>                    const rangeKind = normalizedRange.includes(':') ? 'range' : 'cell';</code> | 声明局部标识符 `rangeKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3903 | <code>                    if (rangeKind === 'range') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3904 | <code>                        addNode({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3905 | <code>                            id: rangeId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3906 | <code>                            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3907 | <code>                            sheetName: parsedRange.sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3908 | <code>                            ref: normalizedRange,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3909 | <code>                            depth: depth + 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3910 | <code>                        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3911 | <code>                        edges.push({ from: dependency.fullRef, to: rangeId, kind: 'defined_name_points_to_range' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3912 | <code>                        const expanded = expandFormulaReference({</code> | 声明局部标识符 `expanded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3913 | <code>                            sheetName: parsedRange.sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3914 | <code>                            rangeRef: normalizedRange</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3915 | <code>                        }, maxExpandedCells);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3916 | <code>                        for (const cellDependency of expanded) {</code> | 声明局部标识符 `cellDependency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3917 | <code>                            edges.push({ from: rangeId, to: cellDependency.fullRef, kind: 'contains' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3918 | <code>                            visitCell(cellDependency.sheetName, cellDependency.ref, depth + 3, [...stack, id, dependency.fullRef, rangeId]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3919 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3920 | <code>                    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3921 | <code>                        edges.push({ from: dependency.fullRef, to: rangeId, kind: 'defined_name_points_to_cell' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3922 | <code>                        visitCell(parsedRange.sheetName, normalizedRange, depth + 2, [...stack, id, dependency.fullRef]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3923 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3924 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3925 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3926 | <code>                edges.push({ from: id, to: dependency.fullRef, kind: 'references_cell' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3927 | <code>                visitCell(dependency.sheetName, dependency.ref, depth + 1, [...stack, id]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3928 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3929 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3930 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3931 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3932 | <code>    visitCell(sheet.name, targetCellRef, 0, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3933 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3934 | <code>        passed: !diagnostics.some((diagnostic) =&gt; diagnostic.severity === 'fatal' &#124;&#124; diagnostic.severity === 'error'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3935 | <code>        target: `${sheet.name}!${targetCellRef}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3936 | <code>        nodes: [...nodes.values()].sort((left, right) =&gt; String(left.id).localeCompare(String(right.id), undefined, { numeric: true })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3937 | <code>        edges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3938 | <code>        diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3939 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3940 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3942 | <code>function resolveWorksheet(workbook, input = {}) {</code> | 定义函数 `resolveWorksheet`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3943 | <code>    const parsed = parseWorkbookTarget(input.target &#124;&#124; input.range &#124;&#124; '', input.sheetName &#124;&#124; input.sheet &#124;&#124; '');</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3944 | <code>    const sheetName = input.sheetName &#124;&#124; input.sheet &#124;&#124; parsed.sheetName &#124;&#124; workbook.worksheets[0]?.name &#124;&#124; '';</code> | 声明局部标识符 `sheetName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3945 | <code>    const sheet = workbook.getWorksheet(sheetName);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3946 | <code>    if (!sheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3947 | <code>        throw new Error(`Worksheet not found: ${sheetName}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 3948 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3949 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3950 | <code>        sheet,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3951 | <code>        sheetName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3952 | <code>        rangeRef: parsed.rangeRef &#124;&#124; input.range &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3953 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3954 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3956 | <code>function splitFormulaArgs(argsText = '') {</code> | 定义函数 `splitFormulaArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3957 | <code>    const args = [];</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3958 | <code>    let depth = 0;</code> | 声明局部标识符 `depth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3959 | <code>    let current = '';</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3960 | <code>    for (const char of String(argsText)) {</code> | 声明局部标识符 `char`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3961 | <code>        if (char === '(') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3962 | <code>            depth += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3963 | <code>            current += char;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3964 | <code>        } else if (char === ')') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3965 | <code>            depth -= 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3966 | <code>            current += char;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3967 | <code>        } else if (char === ',' &amp;&amp; depth === 0) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3968 | <code>            args.push(current.trim());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3969 | <code>            current = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3970 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3971 | <code>            current += char;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3972 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3973 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3974 | <code>    if (current.trim()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3975 | <code>        args.push(current.trim());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3976 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3977 | <code>    return args;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 3978 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3979 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3980 | <code>function discoverRecalculationEngines() {</code> | 定义函数 `discoverRecalculationEngines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3981 | <code>    const engines = [];</code> | 声明局部标识符 `engines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3982 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3983 | <code>        'soffice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3984 | <code>        'libreoffice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3985 | <code>        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3986 | <code>        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3987 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3988 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3989 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 3990 | <code>            if (candidate.includes('\\') &amp;&amp; fs.existsSync(candidate)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 3991 | <code>                engines.push({ id: 'libreoffice', path: candidate });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3992 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3993 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3994 | <code>            // ignore probe failures</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3995 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3996 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 3997 | <code>    engines.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3998 | <code>        id: 'ailis_local_formula_engine',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3999 | <code>        path: 'built-in',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4000 | <code>        supported: ['SUM', 'cell references', 'range references', 'basic arithmetic']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4001 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4002 | <code>    if (process.platform === 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4003 | <code>        engines.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4004 | <code>            id: 'excel_com_optional',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4005 | <code>            path: 'win32com.client',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4006 | <code>            note: 'Available only when Microsoft Excel is installed and explicit engine=excel_com is requested.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4007 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4008 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4009 | <code>    return engines;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4010 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4012 | <code>function createFormulaEvaluator(workbook, diagnostics = []) {</code> | 定义函数 `createFormulaEvaluator`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4013 | <code>    const cache = new Map();</code> | 声明局部标识符 `cache`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4014 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4015 | <code>    function getReferenceValue(sheetName, ref, stack = []) {</code> | 定义函数 `getReferenceValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4016 | <code>        const worksheet = workbook.getWorksheet(sheetName);</code> | 声明局部标识符 `worksheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4017 | <code>        if (!worksheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4018 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4019 | <code>                'xlsx_recalculate_missing_reference',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4020 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4021 | <code>                `Cannot recalculate reference on missing worksheet: ${sheetName}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4022 | <code>                { sheetName, ref }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4023 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4024 | <code>            return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4025 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4026 | <code>        const bounds = parseRangeRef(ref);</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4027 | <code>        if (bounds &amp;&amp; (bounds.startRow !== bounds.endRow &#124;&#124; bounds.startCol !== bounds.endCol)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4028 | <code>            let sum = 0;</code> | 声明局部标识符 `sum`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4029 | <code>            for (let row = bounds.startRow; row &lt;= bounds.endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4030 | <code>                for (let col = bounds.startCol; col &lt;= bounds.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4031 | <code>                    sum += getReferenceValue(sheetName, cellRef(row, col), stack);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4032 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4033 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4034 | <code>            return sum;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4035 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4036 | <code>        const cell = worksheet.getCell(ref.split(':')[0]);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4037 | <code>        if (cell.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4038 | <code>            return evaluateCell(sheetName, cell.address, stack);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4039 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4040 | <code>        return getCellNumericValue(cell);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4041 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4042 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4043 | <code>    function evaluateExpression(expression, sheetName, stack = []) {</code> | 定义函数 `evaluateExpression`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4044 | <code>        let formula = String(expression &#124;&#124; '').replace(/^=/, '').trim();</code> | 声明局部标识符 `formula`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4045 | <code>        let guard = 0;</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4046 | <code>        while (/SUM\s*\(/i.test(formula) &amp;&amp; guard &lt; 50) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 4047 | <code>            guard += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4048 | <code>            formula = formula.replace(/SUM\s*\(([^()]*)\)/gi, (_match, argsText) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4049 | <code>                const total = splitFormulaArgs(argsText)</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4050 | <code>                    .reduce((sum, arg) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4051 | <code>                        const evaluatedArg = evaluateExpression(arg, sheetName, stack);</code> | 声明局部标识符 `evaluatedArg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4052 | <code>                        return sum + (evaluatedArg.supported ? evaluatedArg.value : 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4053 | <code>                    }, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4054 | <code>                return String(total);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4055 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4056 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4057 | <code>        const refs = extractFormulaReferences(formula, sheetName).sort((left, right) =&gt; right.fullRef.length - left.fullRef.length);</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4058 | <code>        for (const ref of refs) {</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4059 | <code>            const value = getReferenceValue(ref.sheetName, ref.rangeRef, stack);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4060 | <code>            const escaped = ref.fullRef.replace(/[.*+?^${}()&#124;[\]\\]/g, '\\$&amp;');</code> | 声明局部标识符 `escaped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4061 | <code>            const withoutDefaultSheet = ref.sheetName === sheetName</code> | 声明局部标识符 `withoutDefaultSheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4062 | <code>                ? ref.rangeRef.replace(/[.*+?^${}()&#124;[\]\\]/g, '\\$&amp;')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4063 | <code>                : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4064 | <code>            formula = formula.replace(new RegExp(escaped, 'g'), String(value));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4065 | <code>            if (withoutDefaultSheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4066 | <code>                formula = formula.replace(new RegExp(withoutDefaultSheet, 'g'), String(value));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4067 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4068 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4069 | <code>        if (!/^[0-9+\-*/().\s]+$/.test(formula)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4070 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4071 | <code>                'xlsx_recalculate_unsupported_formula',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4072 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4073 | <code>                `Local formula engine does not support expression: ${expression}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4074 | <code>                { expression, normalized: formula }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4075 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4076 | <code>            return { supported: false, value: null };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4077 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4078 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 4079 | <code>            // Formula has been reduced to numbers and arithmetic operators only.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4080 | <code>            const value = Function(`"use strict"; return (${formula});`)();</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4081 | <code>            if (!Number.isFinite(Number(value))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4082 | <code>                return { supported: false, value: null };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4083 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4084 | <code>            return { supported: true, value: Number(value) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4085 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4086 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4087 | <code>                'xlsx_recalculate_eval_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4088 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4089 | <code>                `Local formula expression evaluation failed: ${expression}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4090 | <code>                { expression, normalized: formula, error: error.message &#124;&#124; String(error) }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4091 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4092 | <code>            return { supported: false, value: null };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4093 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4094 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4095 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4096 | <code>    function evaluateCell(sheetName, ref, stack = []) {</code> | 定义函数 `evaluateCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4097 | <code>        const id = `${sheetName}!${ref}`;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4098 | <code>        if (cache.has(id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4099 | <code>            return cache.get(id);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4100 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4101 | <code>        if (stack.includes(id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4102 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4103 | <code>                'xlsx_recalculate_cycle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4104 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4105 | <code>                `Cannot recalculate cyclic formula reference at ${id}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4106 | <code>                { stack, ref: id }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4107 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4108 | <code>            return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4109 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4110 | <code>        const worksheet = workbook.getWorksheet(sheetName);</code> | 声明局部标识符 `worksheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4111 | <code>        if (!worksheet) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4112 | <code>            diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4113 | <code>                'xlsx_recalculate_missing_reference',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4114 | <code>                'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4115 | <code>                `Cannot recalculate missing worksheet: ${sheetName}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4116 | <code>                { sheetName, ref }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4117 | <code>            ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4118 | <code>            return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4119 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4120 | <code>        const cell = worksheet.getCell(ref);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4121 | <code>        if (!cell.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4122 | <code>            const value = getCellNumericValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4123 | <code>            cache.set(id, value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4124 | <code>            return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4125 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4126 | <code>        const evaluated = evaluateExpression(cell.formula, sheetName, [...stack, id]);</code> | 声明局部标识符 `evaluated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4127 | <code>        const value = evaluated.supported ? evaluated.value : getCellNumericValue(cell);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4128 | <code>        cache.set(id, value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4129 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4132 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4133 | <code>        evaluateCell,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4134 | <code>        evaluateExpression,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4135 | <code>        diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4136 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4137 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4139 | <code>function collectFormulaTargetCells(workbook, input = {}) {</code> | 定义函数 `collectFormulaTargetCells`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4140 | <code>    const parsedTarget = parseWorkbookTarget(input.target &#124;&#124; input.range &#124;&#124; '', input.sheetName &#124;&#124; input.sheet &#124;&#124; workbook.worksheets[0]?.name &#124;&#124; '');</code> | 声明局部标识符 `parsedTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4141 | <code>    if (parsedTarget.rangeRef) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4142 | <code>        const sheet = getWorkbookSheet(workbook, parsedTarget.sheetName);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4143 | <code>        const bounds = parseRangeRef(parsedTarget.rangeRef);</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4144 | <code>        if (!bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4145 | <code>            throw new Error(`Invalid recalculate target: ${input.target &#124;&#124; input.range}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 4146 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4147 | <code>        const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4148 | <code>        for (let row = bounds.startRow; row &lt;= bounds.endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4149 | <code>            for (let col = bounds.startCol; col &lt;= bounds.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4150 | <code>                const cell = sheet.getCell(row, col);</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4151 | <code>                if (cell.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4152 | <code>                    cells.push({ sheetName: sheet.name, ref: cell.address, cell });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4153 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4154 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4155 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4156 | <code>        return cells;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4157 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4158 | <code>    const cells = [];</code> | 声明局部标识符 `cells`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4159 | <code>    for (const sheet of workbook.worksheets) {</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4160 | <code>        sheet.eachRow({ includeEmpty: false }, (row) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4161 | <code>            row.eachCell({ includeEmpty: false }, (cell) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4162 | <code>                if (cell.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4163 | <code>                    cells.push({ sheetName: sheet.name, ref: cell.address, cell });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4164 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4165 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4166 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4167 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4168 | <code>    return cells;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4169 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4170 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4171 | <code>async function recalculateXlsxArtifact(input = {}) {</code> | 定义函数 `recalculateXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4172 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4173 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools', 'exports'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4174 | <code>    await fsp.mkdir(outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4175 | <code>    const outputPath = toAbsolutePath(input.outputPath &#124;&#124; input.output_path &#124;&#124; defaultExportPath(sourcePath, outputDir, 'recalculated'), input.repoRoot);</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4176 | <code>    await fsp.mkdir(path.dirname(outputPath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4177 | <code>    const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4178 | <code>    await workbook.xlsx.readFile(sourcePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4179 | <code>    const diagnostics = [];</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4180 | <code>    const engine = String(input.engine &#124;&#124; input.recalculateEngine &#124;&#124; input.recalculate_engine &#124;&#124; 'ailis_local_formula_engine').toLowerCase();</code> | 声明局部标识符 `engine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4181 | <code>    const engines = discoverRecalculationEngines();</code> | 声明局部标识符 `engines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4182 | <code>    if (!['ailis_local_formula_engine', 'local'].includes(engine)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4183 | <code>        diagnostics.push(createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4184 | <code>            'xlsx_recalculate_external_engine_unavailable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4185 | <code>            'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4186 | <code>            `Requested recalculation engine ${engine} is not wired in this runtime; using AILIS local formula engine.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4187 | <code>            { requestedEngine: engine, availableEngines: engines }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4188 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4189 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4190 | <code>    const evaluator = createFormulaEvaluator(workbook, diagnostics);</code> | 声明局部标识符 `evaluator`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4191 | <code>    const targets = collectFormulaTargetCells(workbook, input);</code> | 声明局部标识符 `targets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4192 | <code>    const updated = [];</code> | 声明局部标识符 `updated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4193 | <code>    for (const target of targets) {</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4194 | <code>        const value = evaluator.evaluateCell(target.sheetName, target.ref, []);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4195 | <code>        if (Number.isFinite(Number(value))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4196 | <code>            const formula = target.cell.formula;</code> | 声明局部标识符 `formula`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4197 | <code>            target.cell.value = { formula, result: Number(value) };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4198 | <code>            updated.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4199 | <code>                ref: `${target.sheetName}!${target.ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4200 | <code>                formula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4201 | <code>                result: Number(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4202 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4203 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4204 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4205 | <code>    await workbook.xlsx.writeFile(outputPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4206 | <code>    const reopened = await inspectXlsxArtifact({</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4207 | <code>        ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4208 | <code>        sourcePath: outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4209 | <code>        path: outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4210 | <code>        target: input.target &#124;&#124; input.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4211 | <code>        include: ['values', 'formulas', 'styles']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4212 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4213 | <code>    const blockingDiagnostics = diagnostics.filter((diagnostic) =&gt; diagnostic.severity === 'error' &#124;&#124; diagnostic.severity === 'fatal');</code> | 声明局部标识符 `blockingDiagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4214 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4215 | <code>        passed: blockingDiagnostics.length === 0 &amp;&amp; updated.length &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4216 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4217 | <code>        engine: 'ailis_local_formula_engine',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4218 | <code>        availableEngines: engines,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4219 | <code>        updatedCount: updated.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4220 | <code>        updated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4221 | <code>        reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4222 | <code>            workbook: reopened.structure.workbook,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4223 | <code>            view: reopened.view,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4224 | <code>            validation: reopened.validation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4225 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4226 | <code>        diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4227 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4228 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4230 | <code>function forEachRangeCell(sheet, rangeRef, callback) {</code> | 定义函数 `forEachRangeCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4231 | <code>    const bounds = parseRangeRef(rangeRef);</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4232 | <code>    if (!bounds) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4233 | <code>        throw new Error(`Invalid XLSX range: ${rangeRef}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 4234 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4235 | <code>    for (let row = bounds.startRow; row &lt;= bounds.endRow; row += 1) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4236 | <code>        for (let col = bounds.startCol; col &lt;= bounds.endCol; col += 1) {</code> | 声明局部标识符 `col`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4237 | <code>            callback(sheet.getCell(row, col), row - bounds.startRow, col - bounds.startCol, bounds);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4238 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4239 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4240 | <code>    return bounds;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4241 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4242 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4243 | <code>function matrixEntry(matrix, rowIndex, colIndex) {</code> | 定义函数 `matrixEntry`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4244 | <code>    if (Array.isArray(matrix) &amp;&amp; Array.isArray(matrix[rowIndex])) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4245 | <code>        return matrix[rowIndex][colIndex];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4247 | <code>    if (Array.isArray(matrix) &amp;&amp; rowIndex === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4248 | <code>        return matrix[colIndex];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4249 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4250 | <code>    return matrix;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4251 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4252 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4253 | <code>function normalizeFormulaValue(value) {</code> | 定义函数 `normalizeFormulaValue`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4254 | <code>    if (value &amp;&amp; typeof value === 'object' &amp;&amp; value.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4255 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4256 | <code>            formula: String(value.formula).replace(/^=/, ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4257 | <code>            result: clonePlain(value.result)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4258 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4259 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4260 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4261 | <code>        return { formula: value.replace(/^=/, '') };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4262 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4263 | <code>    return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4264 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4265 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4266 | <code>function applyStyleToCell(cell, style = {}) {</code> | 定义函数 `applyStyleToCell`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4267 | <code>    const normalized = clonePlain(style) &#124;&#124; {};</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4268 | <code>    if (typeof normalized.fill === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4269 | <code>        cell.fill = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4270 | <code>            type: 'pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4271 | <code>            pattern: 'solid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4272 | <code>            fgColor: { argb: `FF${normalizeHex(normalized.fill)}` }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4273 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4274 | <code>    } else if (normalized.fill &amp;&amp; typeof normalized.fill === 'object') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4275 | <code>        if (normalized.fill.color &#124;&#124; normalized.fill.fgColor &#124;&#124; normalized.fill.rgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4276 | <code>            const color = normalized.fill.color &#124;&#124; normalized.fill.fgColor &#124;&#124; normalized.fill.rgb;</code> | 声明局部标识符 `color`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4277 | <code>            cell.fill = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4278 | <code>                type: 'pattern',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4279 | <code>                pattern: normalized.fill.pattern &#124;&#124; 'solid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4280 | <code>                fgColor: { argb: `FF${normalizeHex(color)}` }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4281 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4282 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4283 | <code>            cell.fill = normalized.fill;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4284 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4285 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4286 | <code>    if (normalized.font) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4287 | <code>        const font = { ...normalized.font };</code> | 声明局部标识符 `font`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4288 | <code>        if (font.color &amp;&amp; typeof font.color === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4289 | <code>            font.color = { argb: `FF${normalizeHex(font.color)}` };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4290 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4291 | <code>        cell.font = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4292 | <code>            ...(cell.font &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4293 | <code>            ...font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4294 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4296 | <code>    if (normalized.alignment) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4297 | <code>        cell.alignment = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4298 | <code>            ...(cell.alignment &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4299 | <code>            ...normalized.alignment</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4300 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4301 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4302 | <code>    if (normalized.numFmt &#124;&#124; normalized.numberFormat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4303 | <code>        cell.numFmt = normalized.numFmt &#124;&#124; normalized.numberFormat;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4305 | <code>    if (normalized.border) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4306 | <code>        cell.border = normalized.border;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4307 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4308 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4310 | <code>function defaultExportPath(sourcePath, outputDir, suffix = 'edited') {</code> | 定义函数 `defaultExportPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4311 | <code>    const base = path.basename(sourcePath, path.extname(sourcePath));</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4312 | <code>    return path.join(outputDir, `${base}-${suffix}.xlsx`);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4313 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4315 | <code>function createOperationId(prefix = 'xlsx_edit') {</code> | 定义函数 `createOperationId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4316 | <code>    return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4317 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4319 | <code>async function editXlsxArtifact(input = {}) {</code> | 定义函数 `editXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4320 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4321 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools', 'exports'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4322 | <code>    await fsp.mkdir(outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4323 | <code>    const outputPath = toAbsolutePath(input.outputPath &#124;&#124; input.output_path &#124;&#124; defaultExportPath(sourcePath, outputDir), input.repoRoot);</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4324 | <code>    await fsp.mkdir(path.dirname(outputPath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4325 | <code>    const operationId = input.operationId &#124;&#124; input.operation_id &#124;&#124; createOperationId();</code> | 声明局部标识符 `operationId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4326 | <code>    const logDir = toAbsolutePath(input.operationLogDir &#124;&#124; input.operation_log_dir &#124;&#124; path.join(outputDir, 'operation-logs'), input.repoRoot);</code> | 声明局部标识符 `logDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4327 | <code>    await fsp.mkdir(logDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4328 | <code>    const backupPath = path.join(logDir, `${operationId}-before.xlsx`);</code> | 声明局部标识符 `backupPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4329 | <code>    const operationLogPath = path.join(logDir, `${operationId}.json`);</code> | 声明局部标识符 `operationLogPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4330 | <code>    const beforeHash = sha256File(sourcePath);</code> | 声明局部标识符 `beforeHash`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4331 | <code>    await fsp.copyFile(sourcePath, backupPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4332 | <code>    const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4333 | <code>    await workbook.xlsx.readFile(sourcePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4334 | <code>    const operations = Array.isArray(input.operations) ? input.operations : [input.operation &#124;&#124; input].filter(Boolean);</code> | 声明局部标识符 `operations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4335 | <code>    const applied = [];</code> | 声明局部标识符 `applied`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4336 | <code>    const dirtyRanges = [];</code> | 声明局部标识符 `dirtyRanges`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4337 | <code>    const affectedObjects = [];</code> | 声明局部标识符 `affectedObjects`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4338 | <code>    for (const operation of operations) {</code> | 声明局部标识符 `operation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4339 | <code>        const op = String(operation.op &#124;&#124; operation.action &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `op`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4340 | <code>        if (!op) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4341 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4342 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4343 | <code>        if (op === 'sheet.add') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4344 | <code>            const name = operation.name &#124;&#124; operation.sheetName &#124;&#124; operation.sheet;</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4345 | <code>            if (!name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4346 | <code>                throw new Error('sheet.add requires a sheet name.');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 4347 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4348 | <code>            const sheet = workbook.getWorksheet(name) &#124;&#124; workbook.addWorksheet(name);</code> | 声明局部标识符 `sheet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4349 | <code>            applied.push({ op, target: name, sheetId: sheet.id });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4350 | <code>            affectedObjects.push({ kind: 'sheet', ref: name, action: op });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4351 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4352 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4353 | <code>        const target = operation.target &#124;&#124; operation.range &#124;&#124; input.target &#124;&#124; input.range;</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4354 | <code>        const { sheet, rangeRef } = resolveWorksheet(workbook, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4355 | <code>            target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4356 | <code>            sheetName: operation.sheetName &#124;&#124; operation.sheet &#124;&#124; input.sheetName &#124;&#124; input.sheet</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4357 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4358 | <code>        if (!rangeRef) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4359 | <code>            throw new Error(`${op} requires a target range.`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 4360 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4361 | <code>        if (op === 'range.setvalues' &#124;&#124; op === 'range.set_values') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4362 | <code>            const values = operation.values ?? operation.value;</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4363 | <code>            const bounds = forEachRangeCell(sheet, rangeRef, (cell, rowIndex, colIndex) =&gt; {</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4364 | <code>                cell.value = clonePlain(matrixEntry(values, rowIndex, colIndex));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4365 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4366 | <code>            applied.push({ op: 'range.setValues', target: `${sheet.name}!${rangeRef}`, bounds });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4367 | <code>            dirtyRanges.push(`${sheet.name}!${rangeRef}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4368 | <code>            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.setValues' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4369 | <code>        } else if (op === 'range.setformulas' &#124;&#124; op === 'range.set_formulas') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4370 | <code>            const formulas = operation.formulas ?? operation.formula;</code> | 声明局部标识符 `formulas`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4371 | <code>            const results = operation.results ?? operation.result;</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4372 | <code>            const bounds = forEachRangeCell(sheet, rangeRef, (cell, rowIndex, colIndex) =&gt; {</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4373 | <code>                const formulaInput = matrixEntry(formulas, rowIndex, colIndex);</code> | 声明局部标识符 `formulaInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4374 | <code>                const formulaValue = normalizeFormulaValue(formulaInput);</code> | 声明局部标识符 `formulaValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4375 | <code>                if (formulaValue &amp;&amp; typeof formulaValue === 'object' &amp;&amp; formulaValue.formula) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4376 | <code>                    cell.value = formulaValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4377 | <code>                } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4378 | <code>                    cell.value = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4379 | <code>                        formula: String(formulaValue &#124;&#124; '').replace(/^=/, ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4380 | <code>                        result: clonePlain(matrixEntry(results, rowIndex, colIndex))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4381 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4382 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4383 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4384 | <code>            applied.push({ op: 'range.setFormulas', target: `${sheet.name}!${rangeRef}`, bounds });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4385 | <code>            dirtyRanges.push(`${sheet.name}!${rangeRef}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4386 | <code>            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.setFormulas' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4387 | <code>        } else if (op === 'range.setstyles' &#124;&#124; op === 'range.set_styles') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4388 | <code>            const style = operation.style &#124;&#124; operation.styles &#124;&#124; {};</code> | 声明局部标识符 `style`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4389 | <code>            const bounds = forEachRangeCell(sheet, rangeRef, (cell) =&gt; applyStyleToCell(cell, style));</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4390 | <code>            applied.push({ op: 'range.setStyles', target: `${sheet.name}!${rangeRef}`, bounds });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4391 | <code>            dirtyRanges.push(`${sheet.name}!${rangeRef}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4392 | <code>            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.setStyles' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4393 | <code>        } else if (op === 'range.clear') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4394 | <code>            const applyTo = String(operation.applyTo &#124;&#124; operation.apply_to &#124;&#124; 'contents').toLowerCase();</code> | 声明局部标识符 `applyTo`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4395 | <code>            const bounds = forEachRangeCell(sheet, rangeRef, (cell) =&gt; {</code> | 声明局部标识符 `bounds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4396 | <code>                if (applyTo === 'all' &#124;&#124; applyTo === 'contents') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4397 | <code>                    cell.value = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4398 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4399 | <code>                if (applyTo === 'all' &#124;&#124; applyTo === 'formats') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4400 | <code>                    cell.style = {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4401 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4402 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4403 | <code>            applied.push({ op: 'range.clear', target: `${sheet.name}!${rangeRef}`, applyTo, bounds });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4404 | <code>            dirtyRanges.push(`${sheet.name}!${rangeRef}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4405 | <code>            affectedObjects.push({ kind: 'range', ref: `${sheet.name}!${rangeRef}`, action: 'range.clear' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4406 | <code>        } else if (op === 'range.merge') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4407 | <code>            sheet.mergeCells(rangeRef);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4408 | <code>            applied.push({ op: 'range.merge', target: `${sheet.name}!${rangeRef}` });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4409 | <code>            dirtyRanges.push(`${sheet.name}!${rangeRef}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4410 | <code>            affectedObjects.push({ kind: 'merge', ref: `${sheet.name}!${rangeRef}`, action: 'range.merge' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4411 | <code>        } else if (op === 'range.unmerge' &#124;&#124; op === 'range.un_merge') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4412 | <code>            sheet.unMergeCells(rangeRef);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4413 | <code>            applied.push({ op: 'range.unmerge', target: `${sheet.name}!${rangeRef}` });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4414 | <code>            dirtyRanges.push(`${sheet.name}!${rangeRef}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4415 | <code>            affectedObjects.push({ kind: 'merge', ref: `${sheet.name}!${rangeRef}`, action: 'range.unmerge' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4416 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4417 | <code>            throw new Error(`Unsupported XLSX edit op: ${op}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 4418 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4420 | <code>    await workbook.xlsx.writeFile(outputPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4421 | <code>    const afterHash = sha256File(outputPath);</code> | 声明局部标识符 `afterHash`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4422 | <code>    const reopened = await inspectXlsxArtifact({</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4423 | <code>        ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4424 | <code>        sourcePath: outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4425 | <code>        path: outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4426 | <code>        target: input.verifyTarget &#124;&#124; input.verify_target &#124;&#124; input.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4427 | <code>        include: input.include &#124;&#124; ['values', 'formulas', 'styles']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4428 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4429 | <code>    const uniqueDirtyRanges = [...new Set(dirtyRanges)];</code> | 声明局部标识符 `uniqueDirtyRanges`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4430 | <code>    const operationLog = {</code> | 声明局部标识符 `operationLog`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4431 | <code>        id: operationId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4432 | <code>        path: operationLogPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4433 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4434 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4435 | <code>        beforeHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4436 | <code>        afterHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4437 | <code>        dirtyRanges: uniqueDirtyRanges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4438 | <code>        affectedObjects,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4439 | <code>        rollback: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4440 | <code>            strategy: 'restore_backup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4441 | <code>            backupPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4442 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4443 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4444 | <code>    await fsp.writeFile(operationLogPath, JSON.stringify({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4445 | <code>        schema: 'ailis.xlsx.operation_log.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4446 | <code>        operationId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4447 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4448 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4449 | <code>        beforeHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4450 | <code>        afterHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4451 | <code>        backupPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4452 | <code>        dirtyRanges: uniqueDirtyRanges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4453 | <code>        affectedObjects,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4454 | <code>        operations: applied,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4455 | <code>        createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4456 | <code>    }, null, 2), 'utf8');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4457 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4458 | <code>        passed: fs.existsSync(outputPath) &amp;&amp; afterHash !== beforeHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4459 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4460 | <code>        beforeHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4461 | <code>        afterHash,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4462 | <code>        operations: applied,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4463 | <code>        dirtyRanges: uniqueDirtyRanges,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4464 | <code>        affectedObjects,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4465 | <code>        operationLog,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4466 | <code>        rollback: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4467 | <code>            strategy: 'restore_backup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4468 | <code>            backupPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4469 | <code>            outputPath: sourcePath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4470 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4471 | <code>        reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4472 | <code>            workbook: reopened.structure.workbook,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4473 | <code>            view: reopened.view,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4474 | <code>            validation: reopened.validation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4475 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4476 | <code>        diagnostics: reopened.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4477 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4478 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4479 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4480 | <code>async function rollbackXlsxArtifact(input = {}) {</code> | 定义函数 `rollbackXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4481 | <code>    const backupPath = toAbsolutePath(input.backupPath &#124;&#124; input.backup_path &#124;&#124; input.rollback?.backupPath &#124;&#124; input.rollback?.backup_path, input.repoRoot);</code> | 声明局部标识符 `backupPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4482 | <code>    if (!backupPath &#124;&#124; !fs.existsSync(backupPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4483 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4484 | <code>            passed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4485 | <code>            diagnostics: [createDiagnostic('xlsx_rollback_backup_missing', 'error', `Rollback backup does not exist: ${backupPath &#124;&#124; '(missing)'}`)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4486 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4487 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4488 | <code>    const outputPath = toAbsolutePath(input.outputPath &#124;&#124; input.output_path &#124;&#124; input.restorePath &#124;&#124; input.restore_path &#124;&#124; defaultExportPath(backupPath, path.dirname(backupPath), 'rollback'), input.repoRoot);</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4489 | <code>    await fsp.mkdir(path.dirname(outputPath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4490 | <code>    await fsp.copyFile(backupPath, outputPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4491 | <code>    const reopened = await inspectXlsxArtifact({ ...input, sourcePath: outputPath, path: outputPath });</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4492 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4493 | <code>        passed: fs.existsSync(outputPath) &amp;&amp; reopened.structure.workbook.sheetCount &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4494 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4495 | <code>        backupPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4496 | <code>        mode: 'restore_backup',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4497 | <code>        reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4498 | <code>            workbook: reopened.structure.workbook,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4499 | <code>            validation: reopened.validation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4500 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4501 | <code>        diagnostics: reopened.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4502 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4503 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4505 | <code>async function exportXlsxArtifact(input = {}) {</code> | 定义函数 `exportXlsxArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4506 | <code>    if (input.operations &#124;&#124; input.operation &#124;&#124; input.op) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4507 | <code>        return editXlsxArtifact(input);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4508 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4509 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4510 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools', 'exports'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4511 | <code>    await fsp.mkdir(outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4512 | <code>    const outputPath = toAbsolutePath(input.outputPath &#124;&#124; input.output_path &#124;&#124; defaultExportPath(sourcePath, outputDir, 'exported'), input.repoRoot);</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4513 | <code>    const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4514 | <code>    await workbook.xlsx.readFile(sourcePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4515 | <code>    await workbook.xlsx.writeFile(outputPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4516 | <code>    const reopened = await inspectXlsxArtifact({ ...input, sourcePath: outputPath, path: outputPath });</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4517 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4518 | <code>        passed: fs.existsSync(outputPath) &amp;&amp; reopened.structure.workbook.sheetCount &gt; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4519 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4520 | <code>        mode: 'native_export_reopen',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4521 | <code>        reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4522 | <code>            workbook: reopened.structure.workbook,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4523 | <code>            validation: reopened.validation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4524 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4525 | <code>        diagnostics: reopened.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4526 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4527 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4528 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4529 | <code>function csvEscape(value = '') {</code> | 定义函数 `csvEscape`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4530 | <code>    const text = String(value ?? '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4531 | <code>    if (/[",\n\r]/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4532 | <code>        return `"${text.replace(/"/g, '""')}"`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4533 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4534 | <code>    return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4535 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4537 | <code>async function roundtripArtifact(input = {}) {</code> | 定义函数 `roundtripArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4538 | <code>    const inspection = input.inspection &#124;&#124; await inspectArtifact(input);</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4539 | <code>    const caseId = input.caseId &#124;&#124; path.basename(inspection.sourcePath, path.extname(inspection.sourcePath));</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4540 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4541 | <code>    const roundtripDir = path.join(outputDir, 'roundtrip');</code> | 声明局部标识符 `roundtripDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4542 | <code>    await fsp.mkdir(roundtripDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4543 | <code>    const ext = path.extname(inspection.sourcePath) &#124;&#124; `.${inspection.format}`;</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4544 | <code>    const outputPath = path.join(roundtripDir, `${caseId}${ext}`);</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4546 | <code>    if (inspection.format === 'xlsx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4547 | <code>        const workbook = new ExcelJS.Workbook();</code> | 声明局部标识符 `workbook`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4548 | <code>        await workbook.xlsx.readFile(inspection.sourcePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4549 | <code>        await workbook.xlsx.writeFile(outputPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4550 | <code>        const reopened = await inspectXlsxArtifact({ sourcePath: outputPath, expected: input.expected, repoRoot: input.repoRoot });</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4551 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4552 | <code>            passed: reopened.structure.workbook.sheetCount === inspection.structure.workbook.sheetCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4553 | <code>            mode: 'native_export_reopen',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4554 | <code>            outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4555 | <code>            reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4556 | <code>                sheetCount: reopened.structure.workbook.sheetCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4557 | <code>                sheetNames: reopened.structure.workbook.sheetNames</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4558 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4559 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4560 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4562 | <code>    if (inspection.format === 'csv' &#124;&#124; inspection.format === 'tsv') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4563 | <code>        const delimiter = inspection.format === 'tsv' ? '\t' : ',';</code> | 声明局部标识符 `delimiter`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4564 | <code>        const text = (inspection.structure.rows &#124;&#124; [])</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4565 | <code>            .map((row) =&gt; row.map(csvEscape).join(delimiter))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4566 | <code>            .join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4567 | <code>        await fsp.writeFile(outputPath, `${text}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4568 | <code>        const reopened = await inspectCsvArtifact({ sourcePath: outputPath, format: inspection.format, repoRoot: input.repoRoot });</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4569 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4570 | <code>            passed: compareStringArrays(reopened.structure.headers, inspection.structure.headers),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4571 | <code>            mode: 'normalized_export_reopen',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4572 | <code>            outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4573 | <code>            reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4574 | <code>                headers: reopened.structure.headers,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4575 | <code>                rowCount: reopened.structure.rowCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4576 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4577 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4578 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4580 | <code>    await fsp.copyFile(inspection.sourcePath, outputPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4581 | <code>    const reopened = await inspectArtifact({ sourcePath: outputPath, format: inspection.format, expected: input.expected, repoRoot: input.repoRoot });</code> | 声明局部标识符 `reopened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4582 | <code>    let passed = reopened.text.length === inspection.text.length;</code> | 声明局部标识符 `passed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4583 | <code>    if (inspection.format === 'pptx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4584 | <code>        passed = reopened.structure.slideCount === inspection.structure.slideCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4585 | <code>            &amp;&amp; reopened.structure.imageCount === inspection.structure.imageCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4586 | <code>            &amp;&amp; reopened.structure.tableCount === inspection.structure.tableCount;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4587 | <code>    } else if (inspection.format === 'docx') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4588 | <code>        passed = reopened.structure.paragraphCount === inspection.structure.paragraphCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4589 | <code>            &amp;&amp; reopened.structure.tableCount === inspection.structure.tableCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4590 | <code>            &amp;&amp; reopened.structure.imageCount === inspection.structure.imageCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4591 | <code>            &amp;&amp; reopened.structure.commentCount === inspection.structure.commentCount;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4592 | <code>    } else if (inspection.format === 'pdf') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4593 | <code>        passed = reopened.structure.pageCount === inspection.structure.pageCount</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4594 | <code>            &amp;&amp; reopened.structure.hasTextLayer === inspection.structure.hasTextLayer;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4595 | <code>    } else if (inspection.adapterId === 'image' &#124;&#124; FILE_ADAPTER_FORMATS.has(inspection.format)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4596 | <code>        if (reopened.adapterId === 'image') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4597 | <code>            passed = reopened.structure.width === inspection.structure.width</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4598 | <code>                &amp;&amp; reopened.structure.height === inspection.structure.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4599 | <code>                &amp;&amp; reopened.structure.visualCheck?.blank === inspection.structure.visualCheck?.blank;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4600 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4601 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4602 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4603 | <code>        passed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4604 | <code>        mode: 'copy_reopen',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4605 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4606 | <code>        reopened: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4607 | <code>            textLength: reopened.text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4608 | <code>            slideCount: reopened.structure.slideCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4609 | <code>            pageCount: reopened.structure.pageCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4610 | <code>            paragraphCount: reopened.structure.paragraphCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4611 | <code>            tableCount: reopened.structure.tableCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4612 | <code>            imageCount: reopened.structure.imageCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4613 | <code>            width: reopened.structure.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4614 | <code>            height: reopened.structure.height</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4615 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4616 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4617 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4619 | <code>async function runArtifactAdapterChecks(input = {}) {</code> | 定义函数 `runArtifactAdapterChecks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4620 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4621 | <code>    if (!fs.existsSync(sourcePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4622 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4623 | <code>            passed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4624 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4625 | <code>            diagnostics: [createDiagnostic('fixture_missing', 'error', `Artifact input does not exist: ${sourcePath}`)]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4626 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4627 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4628 | <code>    const inspection = await inspectArtifact({ ...input, sourcePath });</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4629 | <code>    const structure = validateAgainstExpected(inspection, input.expected &#124;&#124; {});</code> | 声明局部标识符 `structure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4630 | <code>    const render = await renderArtifactPreview({</code> | 声明局部标识符 `render`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4631 | <code>        ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4632 | <code>        target: input.expected?.render?.target &#124;&#124; input.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4633 | <code>        range: input.expected?.render?.target &#124;&#124; input.range,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4634 | <code>        scale: input.expected?.render?.scale &#124;&#124; input.scale,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4635 | <code>        inspection</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4636 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4637 | <code>    const roundtrip = await roundtripArtifact({ ...input, inspection });</code> | 声明局部标识符 `roundtrip`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4638 | <code>    let trace = null;</code> | 声明局部标识符 `trace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4639 | <code>    if (inspection.format === 'xlsx' &amp;&amp; input.expected?.formulaTrace?.target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4640 | <code>        trace = await traceXlsxFormula({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4641 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4642 | <code>            target: input.expected.formulaTrace.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4643 | <code>            maxDepth: input.expected.formulaTrace.maxDepth &#124;&#124; 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4644 | <code>            maxExpandedCells: input.expected.formulaTrace.maxExpandedCells &#124;&#124; 80</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4645 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4646 | <code>        const nodeIds = new Set((trace.nodes &#124;&#124; []).map((node) =&gt; node.id));</code> | 声明局部标识符 `nodeIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4647 | <code>        const requiredRefs = input.expected.formulaTrace.mustReference &#124;&#124; [];</code> | 声明局部标识符 `requiredRefs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4648 | <code>        const checks = requiredRefs.map((ref) =&gt; ({</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4649 | <code>            name: `formula_trace_reference_${ref}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4650 | <code>            passed: nodeIds.has(ref),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4651 | <code>            actual: nodeIds.has(ref),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4652 | <code>            expected: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4653 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4654 | <code>        trace.checks = checks;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4655 | <code>        trace.passed = trace.passed &amp;&amp; checks.every((check) =&gt; check.passed);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4656 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4657 | <code>    let searches = null;</code> | 声明局部标识符 `searches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4658 | <code>    if (Array.isArray(input.expected?.searches)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4659 | <code>        searches = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4660 | <code>        for (const searchSpec of input.expected.searches) {</code> | 声明局部标识符 `searchSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4661 | <code>            const search = await searchArtifact({</code> | 声明局部标识符 `search`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4662 | <code>                ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4663 | <code>                sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4664 | <code>                ...searchSpec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4665 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4666 | <code>            const refs = new Set((search.matches &#124;&#124; []).map((match) =&gt; match.ref &#124;&#124; match.fullRef &#124;&#124; match.name &#124;&#124; match.part &#124;&#124; match.target));</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4667 | <code>            const requiredRefs = searchSpec.mustReference &#124;&#124; searchSpec.mustRefs &#124;&#124; [];</code> | 声明局部标识符 `requiredRefs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4668 | <code>            const minimumMatches = Number(searchSpec.minimumMatches &#124;&#124; searchSpec.minMatches &#124;&#124; 1);</code> | 声明局部标识符 `minimumMatches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4669 | <code>            const searchSummary = search.search &#124;&#124; {</code> | 声明局部标识符 `searchSummary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4670 | <code>                kind: search.kind &#124;&#124; searchSpec.searchKind &#124;&#124; searchSpec.kind &#124;&#124; 'all',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4671 | <code>                query: search.query &#124;&#124; searchSpec.query &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4672 | <code>                fillRgb: search.fillRgb &#124;&#124; searchSpec.fillRgb &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4673 | <code>                returned: search.returned &#124;&#124; (search.matches &#124;&#124; []).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4674 | <code>                totalCandidates: search.totalCandidates &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4675 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4676 | <code>            const checks = [</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4677 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4678 | <code>                    name: `artifact_search_${searchSpec.searchKind &#124;&#124; searchSpec.kind &#124;&#124; 'all'}_min_matches`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4679 | <code>                    passed: (search.matches &#124;&#124; []).length &gt;= minimumMatches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4680 | <code>                    actual: (search.matches &#124;&#124; []).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4681 | <code>                    expected: minimumMatches</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4682 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4683 | <code>                ...requiredRefs.map((ref) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4684 | <code>                    name: `artifact_search_reference_${ref}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4685 | <code>                    passed: refs.has(ref),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4686 | <code>                    actual: [...refs].slice(0, 20),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4687 | <code>                    expected: ref</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4688 | <code>                }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4689 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4690 | <code>            searches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4691 | <code>                ...search,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4692 | <code>                search: searchSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4693 | <code>                checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4694 | <code>                passed: checks.every((check) =&gt; check.passed)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4695 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4696 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4697 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4698 | <code>    let queries = null;</code> | 声明局部标识符 `queries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4699 | <code>    if (inspection.format === 'xlsx' &amp;&amp; Array.isArray(input.expected?.queries)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4700 | <code>        queries = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4701 | <code>        for (const querySpec of input.expected.queries) {</code> | 声明局部标识符 `querySpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4702 | <code>            const query = await queryXlsxArtifact({</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4703 | <code>                ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4704 | <code>                sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4705 | <code>                ...querySpec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4706 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4707 | <code>            const refs = new Set([</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4708 | <code>                ...(query.rows &#124;&#124; []).map((row) =&gt; row.ref),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4709 | <code>                query.aggregateResult?.row?.ref &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4710 | <code>                ...(query.groups &#124;&#124; []).flatMap((group) =&gt; (group.rows &#124;&#124; []).map((row) =&gt; row.ref))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4711 | <code>            ].filter(Boolean));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4712 | <code>            const minimumRows = Number(querySpec.minimumRows &#124;&#124; querySpec.minRows &#124;&#124; 0);</code> | 声明局部标识符 `minimumRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4713 | <code>            const aggregateValue = typeof querySpec.aggregateValue !== 'undefined'</code> | 声明局部标识符 `aggregateValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4714 | <code>                ? querySpec.aggregateValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4715 | <code>                : querySpec.expectedValue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4716 | <code>            const aggregateTolerance = Number(querySpec.tolerance &#124;&#124; 0);</code> | 声明局部标识符 `aggregateTolerance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4717 | <code>            const checks = [];</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4718 | <code>            if (minimumRows &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4719 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4720 | <code>                    name: `artifact_query_min_rows_${querySpec.table &#124;&#124; querySpec.tableName &#124;&#124; 'table'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4721 | <code>                    passed: (query.totalMatchedRows &#124;&#124; query.rowCount &#124;&#124; 0) &gt;= minimumRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4722 | <code>                    actual: query.totalMatchedRows &#124;&#124; query.rowCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4723 | <code>                    expected: minimumRows</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4724 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4725 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4726 | <code>            if (typeof aggregateValue !== 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4727 | <code>                const actual = Number(query.aggregateResult?.value);</code> | 声明局部标识符 `actual`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4728 | <code>                const expected = Number(aggregateValue);</code> | 声明局部标识符 `expected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4729 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4730 | <code>                    name: `artifact_query_aggregate_${query.aggregateResult?.op &#124;&#124; querySpec.op &#124;&#124; 'value'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4731 | <code>                    passed: Number.isFinite(actual) &amp;&amp; Number.isFinite(expected)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4732 | <code>                        ? Math.abs(actual - expected) &lt;= aggregateTolerance</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4733 | <code>                        : String(query.aggregateResult?.value) === String(aggregateValue),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4734 | <code>                    actual: query.aggregateResult?.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4735 | <code>                    expected: aggregateValue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4736 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4737 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4738 | <code>            for (const ref of querySpec.mustReference &#124;&#124; querySpec.mustRefs &#124;&#124; []) {</code> | 声明局部标识符 `ref`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4739 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4740 | <code>                    name: `artifact_query_reference_${ref}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4741 | <code>                    passed: refs.has(ref),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4742 | <code>                    actual: [...refs].slice(0, 20),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4743 | <code>                    expected: ref</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4744 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4745 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4746 | <code>            for (const groupSpec of querySpec.mustGroups &#124;&#124; querySpec.must_groups &#124;&#124; []) {</code> | 声明局部标识符 `groupSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4747 | <code>                const group = (query.groups &#124;&#124; []).find((entry) =&gt; String(entry.key) === String(groupSpec.key));</code> | 声明局部标识符 `group`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4748 | <code>                const expectedValue = groupSpec.aggregateValue ?? groupSpec.value;</code> | 声明局部标识符 `expectedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4749 | <code>                const actualValue = group?.aggregate?.value;</code> | 声明局部标识符 `actualValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4750 | <code>                checks.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4751 | <code>                    name: `artifact_query_group_${groupSpec.key}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4752 | <code>                    passed: Boolean(group) &amp;&amp; (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4753 | <code>                        typeof expectedValue === 'undefined'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4754 | <code>                        &#124;&#124; Math.abs(Number(actualValue) - Number(expectedValue)) &lt;= aggregateTolerance</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4755 | <code>                    ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4756 | <code>                    actual: group ? { key: group.key, value: actualValue } : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4757 | <code>                    expected: groupSpec</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4758 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4759 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4760 | <code>            queries.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4761 | <code>                ...query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4762 | <code>                checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4763 | <code>                passed: query.passed !== false &amp;&amp; checks.every((check) =&gt; check.passed)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4764 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4765 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4766 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4767 | <code>    let edit = null;</code> | 声明局部标识符 `edit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4768 | <code>    if (inspection.format === 'xlsx' &amp;&amp; input.expected?.editRoundtrip?.operations) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4769 | <code>        const editOutputDir = path.join(</code> | 声明局部标识符 `editOutputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4770 | <code>            toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4771 | <code>            'exports'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4772 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4773 | <code>        edit = await editXlsxArtifact({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4774 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4775 | <code>            operations: input.expected.editRoundtrip.operations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4776 | <code>            outputDir: editOutputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4777 | <code>            outputPath: input.expected.editRoundtrip.outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4778 | <code>            verifyTarget: input.expected.editRoundtrip.verifyTarget &#124;&#124; input.expected.editRoundtrip.after?.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4779 | <code>            include: ['values', 'formulas', 'styles']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4780 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4781 | <code>        if (input.expected.editRoundtrip.after) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4782 | <code>            const editedInspection = await inspectXlsxArtifact({</code> | 声明局部标识符 `editedInspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4783 | <code>                ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4784 | <code>                sourcePath: edit.outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4785 | <code>                path: edit.outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4786 | <code>                target: input.expected.editRoundtrip.after.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4787 | <code>                include: ['values', 'formulas', 'styles']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4788 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4789 | <code>            const editedStructure = validateAgainstExpected(editedInspection, input.expected.editRoundtrip.after);</code> | 声明局部标识符 `editedStructure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4790 | <code>            edit.after = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4791 | <code>                passed: editedStructure.passed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4792 | <code>                checks: editedStructure.checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4793 | <code>                diagnostics: editedStructure.diagnostics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4794 | <code>                inspection: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4795 | <code>                    structure: editedInspection.structure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4796 | <code>                    view: editedInspection.view</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4797 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4798 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4799 | <code>            edit.passed = edit.passed &amp;&amp; editedStructure.passed;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4800 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4801 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4802 | <code>    let recalculation = null;</code> | 声明局部标识符 `recalculation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4803 | <code>    if (inspection.format === 'xlsx' &amp;&amp; input.expected?.recalculate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4804 | <code>        const recalcOutputDir = path.join(</code> | 声明局部标识符 `recalcOutputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4805 | <code>            toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4806 | <code>            'exports'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4807 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4808 | <code>        let recalcSourcePath = sourcePath;</code> | 声明局部标识符 `recalcSourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4809 | <code>        if (input.expected.recalculate.beforeOperations) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4810 | <code>            const prepared = await editXlsxArtifact({</code> | 声明局部标识符 `prepared`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4811 | <code>                ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4812 | <code>                operations: input.expected.recalculate.beforeOperations,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4813 | <code>                outputDir: recalcOutputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4814 | <code>                outputPath: input.expected.recalculate.preparedPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4815 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4816 | <code>            recalcSourcePath = prepared.outputPath;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4817 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4818 | <code>        recalculation = await recalculateXlsxArtifact({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4819 | <code>            ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4820 | <code>            sourcePath: recalcSourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4821 | <code>            path: recalcSourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4822 | <code>            target: input.expected.recalculate.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4823 | <code>            outputDir: recalcOutputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4824 | <code>            outputPath: input.expected.recalculate.outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4825 | <code>            engine: input.expected.recalculate.engine</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4826 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4827 | <code>        if (input.expected.recalculate.after) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 4828 | <code>            const recalculatedInspection = await inspectXlsxArtifact({</code> | 声明局部标识符 `recalculatedInspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4829 | <code>                ...input,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4830 | <code>                sourcePath: recalculation.outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4831 | <code>                path: recalculation.outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4832 | <code>                target: input.expected.recalculate.after.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4833 | <code>                include: ['values', 'formulas', 'styles']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4834 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4835 | <code>            const recalculatedStructure = validateAgainstExpected(recalculatedInspection, input.expected.recalculate.after);</code> | 声明局部标识符 `recalculatedStructure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4836 | <code>            recalculation.after = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4837 | <code>                passed: recalculatedStructure.passed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4838 | <code>                checks: recalculatedStructure.checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4839 | <code>                diagnostics: recalculatedStructure.diagnostics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4840 | <code>                inspection: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4841 | <code>                    structure: recalculatedInspection.structure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4842 | <code>                    view: recalculatedInspection.view</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4843 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4844 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4845 | <code>            recalculation.passed = recalculation.passed &amp;&amp; recalculatedStructure.passed;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4846 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4847 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4848 | <code>    const passed = structure.passed</code> | 声明局部标识符 `passed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4849 | <code>        &amp;&amp; render.passed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4850 | <code>        &amp;&amp; roundtrip.passed</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4851 | <code>        &amp;&amp; (!trace &#124;&#124; trace.passed)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4852 | <code>        &amp;&amp; (!searches &#124;&#124; searches.every((search) =&gt; search.passed))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4853 | <code>        &amp;&amp; (!queries &#124;&#124; queries.every((query) =&gt; query.passed))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4854 | <code>        &amp;&amp; (!edit &#124;&#124; edit.passed)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4855 | <code>        &amp;&amp; (!recalculation &#124;&#124; recalculation.passed);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4856 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 4857 | <code>        passed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4858 | <code>        status: passed ? 'passed' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4859 | <code>        adapterId: inspection.adapterId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4860 | <code>        format: inspection.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4861 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4862 | <code>        structure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4863 | <code>        render,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4864 | <code>        roundtrip,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4865 | <code>        trace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4866 | <code>        searches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4867 | <code>        queries,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4868 | <code>        edit,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4869 | <code>        recalculation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4870 | <code>        inspection: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4871 | <code>            structure: inspection.structure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4872 | <code>            textPreview: inspection.text.slice(0, 500),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4873 | <code>            diagnostics: inspection.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4874 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4875 | <code>        diagnostics: structure.diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4876 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4877 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 4878 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 4879 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4880 | <code>    IMPLEMENTED_ADAPTER_IDS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4881 | <code>    editXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4882 | <code>    exportXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4883 | <code>    indexFileArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4884 | <code>    indexXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4885 | <code>    inspectArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4886 | <code>    queryXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4887 | <code>    recalculateXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4888 | <code>    renderArtifactPreview,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4889 | <code>    rollbackXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4890 | <code>    roundtripArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4891 | <code>    runArtifactAdapterChecks,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4892 | <code>    searchArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4893 | <code>    searchXlsxArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4894 | <code>    traceXlsxFormula,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4895 | <code>    validateAgainstExpected</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4896 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
