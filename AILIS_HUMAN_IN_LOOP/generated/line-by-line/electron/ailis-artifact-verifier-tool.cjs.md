# electron/ailis-artifact-verifier-tool.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`source-code`
- 原始行数：628
- SHA-256：`54063f50a25fc696f66ecf2df5ff34e2261914a20a971dac08f8dc8b371b2fb5`
- 可运行副本：[打开源文件](../../../source/electron/ailis-artifact-verifier-tool.cjs)
- 依赖：`fs/promises`、`os`、`path`
- 主要符号：`fsp`、`os`、`path`、`ARTIFACT_VERIFIER_TOOL_ID`、`DEFAULT_MAX_BYTES`、`SUPPORTED_FORMATS`、`normalizeString`、`trimmed`、`normalizeArray`、`normalizeNumber`、`parsed`、`maybePath`、`uniquePaths`、`seen`、`result`、`normalized`、`resolved`、`key`、`isPathInside`、`root`、`target`、`rootComparable`、`targetComparable`、`getAllowedRoots`、`resolveUserPath`、`raw`、`base`、`createTextResult`、`createJsonResult`、`jsonPreview`、`text`、`createErrorResult`、`normalizeFormat`、`explicit`、`ext`、`byExt`、`hasPath`、`parts`、`current`、`hasRequiredJsonPath`、`parseDelimited`、`rows`、`row`、`cell`、`inQuotes`、`index`、`char`、`next`、`collectLineKeys`、`keys`、`section`、`line`、`sectionMatch`、`keyMatch`、`addCheck`、`normalizeContract`、`hasPaperCardContract`、`contract`、`headingMatchesAny`、`lowerHeadings`、`needle`、`verifyPaperCardContract`、`sections`、`verifyJson`、`topLevelType`、`metrics`、`requiredKeys`、`minItems`、`verifyJsonl`、`lines`、`parsedRows`、`minRows`、`verifyDelimited`、`headers`、`dataRows`、`requiredColumns`、`headerSet`、`verifyLineConfig`、`nonCommentLines`、`verifyMarkdown`、`headings`、`links`、`fences`、`requiredHeadings`、`headingText`、`minHeadings`、`minLinks`、`verifyLog`、`counts`、`maxErrors`、`minLines`、`verifyContains`、`inspectFile`、`targetPath`、`allowedRoots`、`maxBytes`、`content`、`format`、`baseDetails`、`checks`、`ok`、`details`、`schemaResult`、`executeArtifactVerifierTool`、`action`、`effectiveRuntime`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>const os = require('os');</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const ARTIFACT_VERIFIER_TOOL_ID = 'artifact_verifier';</code> | 声明局部标识符 `ARTIFACT_VERIFIER_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 6 | <code>const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;</code> | 声明局部标识符 `DEFAULT_MAX_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 7 | <code>const SUPPORTED_FORMATS = new Set(['auto', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'toml', 'markdown', 'md', 'log', 'text']);</code> | 声明局部标识符 `SUPPORTED_FORMATS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 8 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 9 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 10 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 11 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 12 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 13 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 14 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 15 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>function normalizeArray(value) {</code> | 定义函数 `normalizeArray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 18 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 19 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 20 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>    return Array.isArray(value) ? value : [value];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 22 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>function normalizeNumber(value, fallback, min, max) {</code> | 定义函数 `normalizeNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 25 | <code>    const parsed = Number(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 26 | <code>    if (!Number.isFinite(parsed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 27 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>    return Math.min(Math.max(parsed, min), max);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 30 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>function maybePath(...parts) {</code> | 定义函数 `maybePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 33 | <code>    if (parts.some((part) =&gt; !normalizeString(part))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 34 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 35 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 36 | <code>    return path.join(...parts);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>function uniquePaths(paths) {</code> | 定义函数 `uniquePaths`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 40 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 41 | <code>    const result = [];</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 42 | <code>    for (const entry of paths) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 43 | <code>        const normalized = normalizeString(entry);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 44 | <code>        if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 45 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 46 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>        const resolved = path.resolve(normalized);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 48 | <code>        const key = process.platform === 'win32' ? resolved.toLowerCase() : resolved;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 49 | <code>        if (!seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 50 | <code>            seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 51 | <code>            result.push(resolved);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 52 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 53 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>function isPathInside(rootPath, targetPath) {</code> | 定义函数 `isPathInside`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 58 | <code>    const root = path.resolve(rootPath);</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 59 | <code>    const target = path.resolve(targetPath);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 60 | <code>    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;</code> | 声明局部标识符 `rootComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 61 | <code>    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;</code> | 声明局部标识符 `targetComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 62 | <code>    return targetComparable === rootComparable &#124;&#124; targetComparable.startsWith(`${rootComparable}${path.sep}`);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>function getAllowedRoots(runtime = {}) {</code> | 定义函数 `getAllowedRoots`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 66 | <code>    return uniquePaths([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>        runtime.workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 68 | <code>        runtime.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 69 | <code>        runtime.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 70 | <code>        os.tmpdir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 71 | <code>        process.env.TEMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 72 | <code>        process.env.TMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 73 | <code>        maybePath(os.homedir(), 'Desktop'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 74 | <code>        maybePath(os.homedir(), 'Documents'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 75 | <code>        maybePath(os.homedir(), 'Downloads')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 76 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 79 | <code>function resolveUserPath(inputPath, runtime = {}) {</code> | 定义函数 `resolveUserPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 80 | <code>    const raw = normalizeString(inputPath);</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 81 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 82 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 83 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    if (path.isAbsolute(raw)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 85 | <code>        return path.resolve(raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>    const base = runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; runtime.projectRoot &#124;&#124; process.cwd();</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 88 | <code>    return path.resolve(base, raw);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 89 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 91 | <code>function createTextResult(text, details = {}) {</code> | 定义函数 `createTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 92 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 93 | <code>        content: [{ type: 'text', text }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 94 | <code>        isError: details.ok === false &#124;&#124; details.status === 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 95 | <code>        details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 96 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>function createJsonResult(payload, details = {}) {</code> | 定义函数 `createJsonResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 100 | <code>    return createTextResult(JSON.stringify(payload, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 101 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>function jsonPreview(value, maxChars = 1200) {</code> | 定义函数 `jsonPreview`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 104 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 105 | <code>        const text = JSON.stringify(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 106 | <code>        return text.length &gt; maxChars ? `${text.slice(0, maxChars - 3)}...` : text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 107 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 108 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>function createErrorResult(code, message, details = {}) {</code> | 定义函数 `createErrorResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 113 | <code>    return createTextResult(message, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 114 | <code>        status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 115 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 116 | <code>        code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 117 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 118 | <code>        ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 119 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 122 | <code>function normalizeFormat(value, filePath = '', content = '') {</code> | 定义函数 `normalizeFormat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 123 | <code>    const explicit = normalizeString(value, 'auto').toLowerCase();</code> | 声明局部标识符 `explicit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 124 | <code>    if (SUPPORTED_FORMATS.has(explicit) &amp;&amp; explicit !== 'auto') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 125 | <code>        return explicit === 'yml' ? 'yaml' : explicit === 'md' ? 'markdown' : explicit;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>    const ext = path.extname(filePath &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 128 | <code>    const byExt = {</code> | 声明局部标识符 `byExt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 129 | <code>        '.json': 'json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 130 | <code>        '.jsonl': 'jsonl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 131 | <code>        '.ndjson': 'jsonl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 132 | <code>        '.csv': 'csv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 133 | <code>        '.tsv': 'tsv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 134 | <code>        '.yaml': 'yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 135 | <code>        '.yml': 'yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 136 | <code>        '.toml': 'toml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 137 | <code>        '.md': 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 138 | <code>        '.markdown': 'markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 139 | <code>        '.log': 'log',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 140 | <code>        '.txt': 'text'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 141 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>    if (byExt[ext]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 143 | <code>        return byExt[ext];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 144 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>    const trimmed = normalizeString(content);</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 146 | <code>    if (/^[\[{]/.test(trimmed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 147 | <code>        return 'json';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 148 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    if (/^\s*#\s+/m.test(content)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 150 | <code>        return 'markdown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 151 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 152 | <code>    if (/^\s*\[[^\]]+\]\s*$/m.test(content) &amp;&amp; /^\s*[A-Za-z0-9_.-]+\s*=/m.test(content)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 153 | <code>        return 'toml';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 154 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>    if (/^\s*[A-Za-z0-9_.-]+\s*:/m.test(content)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>        return 'yaml';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 157 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>    return 'text';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 161 | <code>function hasPath(value, dottedPath) {</code> | 定义函数 `hasPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 162 | <code>    const parts = normalizeString(dottedPath).split('.').filter(Boolean);</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 163 | <code>    if (!parts.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 164 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>    let current = value;</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 167 | <code>    for (const part of parts) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 168 | <code>        if (Array.isArray(current) &amp;&amp; /^\d+$/.test(part)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 169 | <code>            current = current[Number(part)];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 170 | <code>        } else if (current &amp;&amp; typeof current === 'object' &amp;&amp; Object.prototype.hasOwnProperty.call(current, part)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 171 | <code>            current = current[part];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 172 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 173 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 177 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>function hasRequiredJsonPath(value, dottedPath) {</code> | 定义函数 `hasRequiredJsonPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 180 | <code>    if (hasPath(value, dottedPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 181 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 182 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>    if (Array.isArray(value) &amp;&amp; value.length &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 184 | <code>        return value.every((entry) =&gt; hasPath(entry, dottedPath));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 187 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 189 | <code>function parseDelimited(content, delimiter) {</code> | 定义函数 `parseDelimited`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 190 | <code>    const rows = [];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 191 | <code>    let row = [];</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 192 | <code>    let cell = '';</code> | 声明局部标识符 `cell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 193 | <code>    let inQuotes = false;</code> | 声明局部标识符 `inQuotes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 194 | <code>    for (let index = 0; index &lt; content.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 195 | <code>        const char = content[index];</code> | 声明局部标识符 `char`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 196 | <code>        const next = content[index + 1];</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 197 | <code>        if (char === '"' &amp;&amp; inQuotes &amp;&amp; next === '"') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>            cell += '"';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 199 | <code>            index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 200 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 201 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>        if (char === '"') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 203 | <code>            inQuotes = !inQuotes;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 204 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 205 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>        if (char === delimiter &amp;&amp; !inQuotes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 207 | <code>            row.push(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 208 | <code>            cell = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 209 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 210 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>        if ((char === '\n' &#124;&#124; char === '\r') &amp;&amp; !inQuotes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 212 | <code>            if (char === '\r' &amp;&amp; next === '\n') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 213 | <code>                index += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 214 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>            row.push(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 216 | <code>            rows.push(row);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 217 | <code>            row = [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 218 | <code>            cell = '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 219 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 220 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>        cell += char;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 222 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>    if (cell.length &#124;&#124; row.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>        row.push(cell);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 225 | <code>        rows.push(row);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 226 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>    return rows.filter((entry) =&gt; entry.some((cellValue) =&gt; normalizeString(cellValue)));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 228 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 230 | <code>function collectLineKeys(content, mode) {</code> | 定义函数 `collectLineKeys`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 231 | <code>    const keys = new Set();</code> | 声明局部标识符 `keys`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 232 | <code>    let section = '';</code> | 声明局部标识符 `section`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 233 | <code>    for (const rawLine of content.split(/\r?\n/)) {</code> | 声明局部标识符 `rawLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 234 | <code>        const line = rawLine.trim();</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 235 | <code>        if (!line &#124;&#124; line.startsWith('#') &#124;&#124; line.startsWith(';')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 236 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 237 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>        if (mode === 'toml') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 239 | <code>            const sectionMatch = line.match(/^\[([^\]]+)\]$/);</code> | 声明局部标识符 `sectionMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 240 | <code>            if (sectionMatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 241 | <code>                section = sectionMatch[1].trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 242 | <code>                keys.add(section);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 243 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 244 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>            const keyMatch = line.match(/^([A-Za-z0-9_.-]+)\s*=/);</code> | 声明局部标识符 `keyMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 246 | <code>            if (keyMatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>                const key = keyMatch[1].trim();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 248 | <code>                keys.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 249 | <code>                if (section) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 250 | <code>                    keys.add(`${section}.${key}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 251 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 254 | <code>            const keyMatch = line.match(/^([A-Za-z0-9_.-]+)\s*:/);</code> | 声明局部标识符 `keyMatch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 255 | <code>            if (keyMatch) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 256 | <code>                keys.add(keyMatch[1].trim());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 257 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    return keys;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 261 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 263 | <code>function addCheck(checks, id, ok, message, details = {}) {</code> | 定义函数 `addCheck`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 264 | <code>    checks.push({ id, ok: Boolean(ok), message, ...details });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 265 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>function normalizeContract(value) {</code> | 定义函数 `normalizeContract`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 268 | <code>    return normalizeString(value).toLowerCase().replace(/[_\s-]+/g, '.');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 269 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>function hasPaperCardContract(args = {}) {</code> | 定义函数 `hasPaperCardContract`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 272 | <code>    const contract = normalizeContract(args.contract &#124;&#124; args.profile &#124;&#124; args.verificationContract &#124;&#124; args.verification_contract);</code> | 声明局部标识符 `contract`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 273 | <code>    return ['paper.card', 'paper.card.v1'].includes(contract);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 274 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>function headingMatchesAny(headings, aliases) {</code> | 定义函数 `headingMatchesAny`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 277 | <code>    const lowerHeadings = headings.map((heading) =&gt; normalizeString(heading.text).toLowerCase());</code> | 声明局部标识符 `lowerHeadings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 278 | <code>    return aliases.some((alias) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>        const needle = normalizeString(alias).toLowerCase();</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 280 | <code>        return needle &amp;&amp; lowerHeadings.some((heading) =&gt; heading.includes(needle));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 281 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 284 | <code>function verifyPaperCardContract(content, headings, checks) {</code> | 定义函数 `verifyPaperCardContract`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 285 | <code>    const sections = [</code> | 声明局部标识符 `sections`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 286 | <code>        { id: 'research_problem', aliases: ['研究问题', 'research problem', 'research question'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 287 | <code>        { id: 'core_method', aliases: ['核心方法', '方法', 'core method', 'method'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 288 | <code>        { id: 'key_contribution', aliases: ['关键贡献', '贡献', 'contribution'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 289 | <code>        { id: 'limitations', aliases: ['局限性', '局限', 'limitations', 'limitation'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 290 | <code>        { id: 'reading_recommendation', aliases: ['是否值得深入读', '值得深入读', 'recommendation', 'worth reading'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 291 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>    for (const section of sections) {</code> | 声明局部标识符 `section`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 293 | <code>        addCheck(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 294 | <code>            checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 295 | <code>            `paper_card:${section.id}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 296 | <code>            headingMatchesAny(headings, section.aliases),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 297 | <code>            `paper card includes ${section.id} section`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 298 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>    addCheck(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 301 | <code>        checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 302 | <code>        'paper_card:provenance',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 303 | <code>        /(来源&#124;来自&#124;source&#124;provenance)/i.test(content) &amp;&amp; /(pdf&#124;arxiv&#124;论文页面&#124;网页&#124;page)/i.test(content),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 304 | <code>        'paper card explains whether claims come from the paper page, PDF, or another source'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 305 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>function verifyJson(content, args, checks) {</code> | 定义函数 `verifyJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 309 | <code>    const parsed = JSON.parse(content);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 310 | <code>    const topLevelType = Array.isArray(parsed) ? 'array' : typeof parsed;</code> | 声明局部标识符 `topLevelType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 311 | <code>    const metrics = {</code> | 声明局部标识符 `metrics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 312 | <code>        topLevelType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 313 | <code>        itemCount: Array.isArray(parsed) ? parsed.length : undefined,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 314 | <code>        keys: parsed &amp;&amp; typeof parsed === 'object' &amp;&amp; !Array.isArray(parsed) ? Object.keys(parsed).sort() : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 315 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    const requiredKeys = normalizeArray(args.requiredKeys &#124;&#124; args.required_fields &#124;&#124; args.requiredFields);</code> | 声明局部标识符 `requiredKeys`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 317 | <code>    for (const key of requiredKeys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 318 | <code>        addCheck(checks, `required_key:${key}`, hasRequiredJsonPath(parsed, key), `required key ${key}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 319 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>    const minItems = normalizeNumber(args.minItems ?? args.minRows, 0, 0, 1000000);</code> | 声明局部标识符 `minItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 321 | <code>    if (minItems &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 322 | <code>        addCheck(checks, 'min_items', Array.isArray(parsed) &amp;&amp; parsed.length &gt;= minItems, `array has at least ${minItems} items`, { actual: Array.isArray(parsed) ? parsed.length : 0 });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 323 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>    return { parsed, metrics };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 325 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 327 | <code>function verifyJsonl(content, args, checks) {</code> | 定义函数 `verifyJsonl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 328 | <code>    const lines = content.split(/\r?\n/).map((line) =&gt; line.trim()).filter(Boolean);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 329 | <code>    const parsedRows = [];</code> | 声明局部标识符 `parsedRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 330 | <code>    lines.forEach((line, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 331 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 332 | <code>            parsedRows.push(JSON.parse(line));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 333 | <code>            addCheck(checks, `jsonl_line:${index + 1}`, true, `line ${index + 1} parses as JSON`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 334 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 335 | <code>            addCheck(checks, `jsonl_line:${index + 1}`, false, `line ${index + 1} is invalid JSON`, { error: error.message });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 336 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>    const minRows = normalizeNumber(args.minRows ?? args.minItems, 0, 0, 1000000);</code> | 声明局部标识符 `minRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 339 | <code>    if (minRows &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 340 | <code>        addCheck(checks, 'min_rows', parsedRows.length &gt;= minRows, `jsonl has at least ${minRows} rows`, { actual: parsedRows.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 341 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 343 | <code>        parsed: parsedRows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 344 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 345 | <code>            rows: parsedRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 346 | <code>            invalidRows: checks.filter((check) =&gt; check.id.startsWith('jsonl_line:') &amp;&amp; !check.ok).length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 347 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 351 | <code>function verifyDelimited(content, args, checks, delimiter) {</code> | 定义函数 `verifyDelimited`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 352 | <code>    const rows = parseDelimited(content, delimiter);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 353 | <code>    const headers = rows[0] &#124;&#124; [];</code> | 声明局部标识符 `headers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 354 | <code>    const dataRows = rows.slice(1);</code> | 声明局部标识符 `dataRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 355 | <code>    const requiredColumns = normalizeArray(args.requiredColumns &#124;&#124; args.requiredFields &#124;&#124; args.required_fields);</code> | 声明局部标识符 `requiredColumns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 356 | <code>    const headerSet = new Set(headers.map((header) =&gt; normalizeString(header).toLowerCase()));</code> | 声明局部标识符 `headerSet`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 357 | <code>    for (const column of requiredColumns) {</code> | 声明局部标识符 `column`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 358 | <code>        const key = normalizeString(column).toLowerCase();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 359 | <code>        addCheck(checks, `required_column:${column}`, headerSet.has(key), `required column ${column}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 360 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>    const minRows = normalizeNumber(args.minRows, 0, 0, 1000000);</code> | 声明局部标识符 `minRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 362 | <code>    if (minRows &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 363 | <code>        addCheck(checks, 'min_rows', dataRows.length &gt;= minRows, `csv has at least ${minRows} data rows`, { actual: dataRows.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 364 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 366 | <code>        parsed: rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 367 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 368 | <code>            rows: dataRows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 369 | <code>            totalRows: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 370 | <code>            columns: headers.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 371 | <code>            headers</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 372 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 373 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 374 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>function verifyLineConfig(content, args, checks, mode) {</code> | 定义函数 `verifyLineConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 377 | <code>    const keys = collectLineKeys(content, mode);</code> | 声明局部标识符 `keys`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 378 | <code>    const requiredKeys = normalizeArray(args.requiredKeys &#124;&#124; args.requiredFields &#124;&#124; args.required_fields);</code> | 声明局部标识符 `requiredKeys`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 379 | <code>    for (const key of requiredKeys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 380 | <code>        addCheck(checks, `required_key:${key}`, keys.has(normalizeString(key)), `required key ${key}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 381 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>    const nonCommentLines = content.split(/\r?\n/).filter((line) =&gt; {</code> | 声明局部标识符 `nonCommentLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 383 | <code>        const trimmed = line.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 384 | <code>        return trimmed &amp;&amp; !trimmed.startsWith('#') &amp;&amp; !trimmed.startsWith(';');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 385 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>    addCheck(checks, `${mode}_non_empty`, nonCommentLines.length &gt; 0, `${mode} has non-comment content`, { actual: nonCommentLines.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 387 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 388 | <code>        parsed: { keys: Array.from(keys).sort() },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 389 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 390 | <code>            keys: Array.from(keys).sort(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 391 | <code>            nonCommentLines: nonCommentLines.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 392 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 396 | <code>function verifyMarkdown(content, args, checks) {</code> | 定义函数 `verifyMarkdown`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 397 | <code>    const headings = Array.from(content.matchAll(/^(#{1,6})\s+(.+)$/gm)).map((match) =&gt; ({</code> | 声明局部标识符 `headings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 398 | <code>        level: match[1].length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 399 | <code>        text: match[2].trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 400 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>    const links = Array.from(content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)).map((match) =&gt; match[1]);</code> | 声明局部标识符 `links`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 402 | <code>    const fences = (content.match(/```/g) &#124;&#124; []).length;</code> | 声明局部标识符 `fences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 403 | <code>    const requiredHeadings = normalizeArray(args.requiredHeadings &#124;&#124; args.requiredSections &#124;&#124; args.requiredFields);</code> | 声明局部标识符 `requiredHeadings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 404 | <code>    const headingText = headings.map((heading) =&gt; heading.text.toLowerCase());</code> | 声明局部标识符 `headingText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 405 | <code>    for (const heading of requiredHeadings) {</code> | 声明局部标识符 `heading`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 406 | <code>        const needle = normalizeString(heading).toLowerCase();</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 407 | <code>        addCheck(checks, `required_heading:${heading}`, headingText.some((text) =&gt; text.includes(needle)), `required heading ${heading}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 408 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>    const minHeadings = normalizeNumber(args.minHeadings, 0, 0, 100000);</code> | 声明局部标识符 `minHeadings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 410 | <code>    if (minHeadings &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 411 | <code>        addCheck(checks, 'min_headings', headings.length &gt;= minHeadings, `markdown has at least ${minHeadings} headings`, { actual: headings.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 412 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>    const minLinks = normalizeNumber(args.minLinks, 0, 0, 100000);</code> | 声明局部标识符 `minLinks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 414 | <code>    if (minLinks &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 415 | <code>        addCheck(checks, 'min_links', links.length &gt;= minLinks, `markdown has at least ${minLinks} links`, { actual: links.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    addCheck(checks, 'balanced_code_fences', fences % 2 === 0, 'markdown code fences are balanced', { fences });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 418 | <code>    if (hasPaperCardContract(args)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 419 | <code>        verifyPaperCardContract(content, headings, checks);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 420 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 422 | <code>        parsed: { headings, links },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 423 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 424 | <code>            headings: headings.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 425 | <code>            links: links.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 426 | <code>            codeFences: fences,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 427 | <code>            words: normalizeString(content).split(/\s+/).filter(Boolean).length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 428 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 432 | <code>function verifyLog(content, args, checks) {</code> | 定义函数 `verifyLog`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 433 | <code>    const lines = content.split(/\r?\n/).filter(Boolean);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 434 | <code>    const counts = { error: 0, warn: 0, info: 0, debug: 0 };</code> | 声明局部标识符 `counts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 435 | <code>    for (const line of lines) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 436 | <code>        if (/\b(error&#124;fatal&#124;exception&#124;traceback)\b/i.test(line)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 437 | <code>            counts.error += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 438 | <code>        } else if (/\b(warn&#124;warning)\b/i.test(line)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 439 | <code>            counts.warn += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 440 | <code>        } else if (/\binfo\b/i.test(line)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 441 | <code>            counts.info += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 442 | <code>        } else if (/\bdebug\b/i.test(line)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 443 | <code>            counts.debug += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 444 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>    const maxErrors = args.maxErrors === undefined ? null : normalizeNumber(args.maxErrors, 0, 0, 1000000);</code> | 声明局部标识符 `maxErrors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 447 | <code>    if (maxErrors !== null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 448 | <code>        addCheck(checks, 'max_errors', counts.error &lt;= maxErrors, `log has at most ${maxErrors} errors`, { actual: counts.error });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>    const minLines = normalizeNumber(args.minLines ?? args.minRows, 0, 0, 1000000);</code> | 声明局部标识符 `minLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 451 | <code>    if (minLines &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 452 | <code>        addCheck(checks, 'min_lines', lines.length &gt;= minLines, `log has at least ${minLines} lines`, { actual: lines.length });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 453 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 454 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 455 | <code>        parsed: { counts },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 456 | <code>        metrics: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 457 | <code>            lines: lines.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 458 | <code>            ...counts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 459 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 463 | <code>function verifyContains(content, args, checks) {</code> | 定义函数 `verifyContains`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 464 | <code>    const text = content.toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 465 | <code>    for (const needle of normalizeArray(args.contains &#124;&#124; args.mustContain &#124;&#124; args.requiredText)) {</code> | 声明局部标识符 `needle`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 466 | <code>        const normalized = normalizeString(needle);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 467 | <code>        if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 468 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 469 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 470 | <code>        addCheck(checks, `contains:${normalized.slice(0, 48)}`, text.includes(normalized.toLowerCase()), `contains ${normalized}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 471 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 474 | <code>async function inspectFile(args = {}, runtime = {}, verify = false) {</code> | 定义函数 `inspectFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 475 | <code>    const targetPath = resolveUserPath(args.path &#124;&#124; args.target &#124;&#124; args.file &#124;&#124; args.filename, runtime);</code> | 声明局部标识符 `targetPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 476 | <code>    if (!targetPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 477 | <code>        return createErrorResult('missing_path', 'artifact_verifier requires path/target/file.', { action: verify ? 'verify' : 'detect' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 478 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>    const allowedRoots = getAllowedRoots(runtime);</code> | 声明局部标识符 `allowedRoots`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 480 | <code>    if (!allowedRoots.some((root) =&gt; isPathInside(root, targetPath))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 481 | <code>        return createErrorResult('path_outside_workspace', 'artifact_verifier can only read files in workspace/project/temp/user document roots.', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 482 | <code>            action: verify ? 'verify' : 'detect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 483 | <code>            path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 484 | <code>            allowedRoots</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 485 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>    let stat;</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 488 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 489 | <code>        stat = await fsp.stat(targetPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 490 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 491 | <code>        return createErrorResult('file_not_found', `File not found: ${targetPath}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 492 | <code>            action: verify ? 'verify' : 'detect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 493 | <code>            path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 494 | <code>            error: error.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 495 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 497 | <code>    if (!stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 498 | <code>        return createErrorResult('not_a_file', `Target is not a file: ${targetPath}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 499 | <code>            action: verify ? 'verify' : 'detect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 500 | <code>            path: targetPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 501 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1, 50 * 1024 * 1024);</code> | 声明局部标识符 `maxBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 504 | <code>    if (stat.size &gt; maxBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 505 | <code>        return createErrorResult('file_too_large', `File is too large for artifact_verifier: ${stat.size} bytes &gt; ${maxBytes}.`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 506 | <code>            action: verify ? 'verify' : 'detect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 507 | <code>            path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 508 | <code>            size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 509 | <code>            maxBytes</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 510 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>    const content = await fsp.readFile(targetPath, normalizeString(args.encoding, 'utf8'));</code> | 声明局部标识符 `content`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 513 | <code>    const text = Buffer.isBuffer(content) ? content.toString(normalizeString(args.encoding, 'utf8')) : String(content);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 514 | <code>    const format = normalizeFormat(args.format &#124;&#124; args.kind, targetPath, text);</code> | 声明局部标识符 `format`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 515 | <code>    const baseDetails = {</code> | 声明局部标识符 `baseDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 516 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 517 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 518 | <code>        action: verify ? 'verify' : 'detect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 519 | <code>        path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 520 | <code>        format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 521 | <code>        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 522 | <code>        mtimeMs: stat.mtimeMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 523 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>    if (!verify) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 525 | <code>        return createJsonResult(baseDetails, baseDetails);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 526 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>    const checks = [];</code> | 声明局部标识符 `checks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 529 | <code>    addCheck(checks, 'exists', true, 'file exists', { path: targetPath });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 530 | <code>    addCheck(checks, 'non_empty', stat.size &gt; 0, 'file is non-empty', { size: stat.size });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 531 | <code>    verifyContains(text, args, checks);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 532 | <code>    let parsed = null;</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 533 | <code>    let metrics = {};</code> | 声明局部标识符 `metrics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 534 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 535 | <code>        if (format === 'json') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 536 | <code>            ({ parsed, metrics } = verifyJson(text, args, checks));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 537 | <code>        } else if (format === 'jsonl') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 538 | <code>            ({ parsed, metrics } = verifyJsonl(text, args, checks));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 539 | <code>        } else if (format === 'csv') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 540 | <code>            ({ parsed, metrics } = verifyDelimited(text, args, checks, ','));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 541 | <code>        } else if (format === 'tsv') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 542 | <code>            ({ parsed, metrics } = verifyDelimited(text, args, checks, '\t'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 543 | <code>        } else if (format === 'yaml') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 544 | <code>            ({ parsed, metrics } = verifyLineConfig(text, args, checks, 'yaml'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 545 | <code>        } else if (format === 'toml') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 546 | <code>            ({ parsed, metrics } = verifyLineConfig(text, args, checks, 'toml'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 547 | <code>        } else if (format === 'markdown') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 548 | <code>            ({ parsed, metrics } = verifyMarkdown(text, args, checks));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 549 | <code>        } else if (format === 'log') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 550 | <code>            ({ parsed, metrics } = verifyLog(text, args, checks));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 551 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 552 | <code>            metrics = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 553 | <code>                lines: text.split(/\r?\n/).length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 554 | <code>                characters: text.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 555 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 558 | <code>        addCheck(checks, 'parse', false, `${format} parse failed`, { error: error.message });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 559 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>    const ok = checks.every((check) =&gt; check.ok);</code> | 声明局部标识符 `ok`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 561 | <code>    const details = {</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 562 | <code>        ...baseDetails,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 563 | <code>        ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 564 | <code>        status: ok ? 'completed' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 565 | <code>        checks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 566 | <code>        metrics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 567 | <code>        parsedPreview: parsed &amp;&amp; typeof parsed === 'object' ? jsonPreview(parsed) : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 568 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 569 | <code>    return createJsonResult(details, details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 570 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 571 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 572 | <code>function schemaResult() {</code> | 定义函数 `schemaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 573 | <code>    return createJsonResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 574 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 575 | <code>            tool: ARTIFACT_VERIFIER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 576 | <code>            purpose: 'Read-only verification for structured task artifacts.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 577 | <code>            actions: ['schema', 'detect', 'verify'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 578 | <code>            formats: ['auto', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'toml', 'markdown', 'log', 'text'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 579 | <code>            contracts: ['paper_card.v1'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 580 | <code>            verifyArgs: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 581 | <code>                path: 'required file path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 582 | <code>                format: 'optional explicit format',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 583 | <code>                contract: 'optional named verification contract, e.g. paper_card.v1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 584 | <code>                requiredKeys: 'json/yaml/toml key paths',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 585 | <code>                requiredColumns: 'csv/tsv columns',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 586 | <code>                requiredHeadings: 'markdown headings',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 587 | <code>                contains: 'required text fragments',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 588 | <code>                minRows: 'csv/jsonl/log row minimum',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 589 | <code>                minItems: 'json array item minimum',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 590 | <code>                minHeadings: 'markdown heading minimum',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 591 | <code>                minLinks: 'markdown link minimum',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 592 | <code>                maxErrors: 'log error maximum'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 593 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 596 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 597 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 598 | <code>            action: 'schema'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 599 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>async function executeArtifactVerifierTool(args = {}, context = {}, runtime = {}) {</code> | 定义函数 `executeArtifactVerifierTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 604 | <code>    const action = normalizeString(args.action &#124;&#124; args.operation &#124;&#124; args.intent, 'verify').toLowerCase();</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 605 | <code>    const effectiveRuntime = {</code> | 声明局部标识符 `effectiveRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 606 | <code>        workspaceDir: runtime.workspaceDir &#124;&#124; context.workspace &#124;&#124; context.workspaceDir,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 607 | <code>        workspaceRoot: runtime.workspaceRoot &#124;&#124; context.workspaceRoot,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 608 | <code>        projectRoot: runtime.projectRoot &#124;&#124; context.projectRoot</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 609 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>    if (action === 'schema' &#124;&#124; action === 'help') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 611 | <code>        return schemaResult();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 612 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>    if (action === 'detect' &#124;&#124; action === 'inspect') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 614 | <code>        return await inspectFile(args, effectiveRuntime, false);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 615 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>    if (action === 'verify' &#124;&#124; action === 'validate' &#124;&#124; action === 'check') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 617 | <code>        return await inspectFile(args, effectiveRuntime, true);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 618 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 619 | <code>    return createErrorResult('unsupported_action', `Unsupported artifact_verifier action: ${action}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 620 | <code>        supportedActions: ['schema', 'detect', 'verify']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 621 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 624 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 625 | <code>    ARTIFACT_VERIFIER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 626 | <code>    executeArtifactVerifierTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 627 | <code>    normalizeFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 628 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
