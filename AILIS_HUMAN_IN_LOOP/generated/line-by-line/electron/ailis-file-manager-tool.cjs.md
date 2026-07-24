# electron/ailis-file-manager-tool.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：文件管理工具：受路径保护地读取、写入、移动或检查本地文件。
- 文件类型：`source-code`
- 原始行数：722
- SHA-256：`5112ded1619330b06000a547dae9d5a54dba8b9c9ead29f2ab23fd76cedcd6c7`
- 可运行副本：[打开源文件](../../../source/electron/ailis-file-manager-tool.cjs)
- 依赖：`fs`、`fs/promises`、`os`、`path`
- 主要符号：`fs`、`fsp`、`os`、`path`、`FILE_MANAGER_TOOL_ID`、`DEFAULT_SCAN_LIMIT`、`DEFAULT_CANDIDATE_LIMIT`、`DEFAULT_MAX_DEPTH`、`DEFAULT_MIN_AGE_DAYS`、`TEMP_EXTENSIONS`、`ORGANIZE_BUCKETS`、`normalizeString`、`trimmed`、`normalizeBoolean`、`normalizeNumber`、`parsed`、`isPathInside`、`root`、`target`、`rootComparable`、`targetComparable`、`uniquePaths`、`seen`、`result`、`normalized`、`resolved`、`key`、`maybePath`、`userDir`、`windowsTempDir`、`windir`、`getAllowedRoots`、`getProfileTargets`、`localTemp`、`targetsByProfile`、`pathExists`、`safeStat`、`createTextResult`、`createErrorResult`、`formatBytes`、`units`、`value`、`unitIndex`、`resolveUserTarget`、`assertTargetAllowed`、`allowedRoots`、`classifyEntry`、`basename`、`lowerName`、`ext`、`now`、`minAgeDays`、`ageDays`、`relativePath`、`isTempExtension`、`isEditorBackup`、`isCrashDump`、`isPartialDownload`、`isOldLog`、`isZeroByte`、`reason`、`risk`、`walkForCandidates`、`maxDepth`、`maxEntries`、`maxCandidates`、`candidates`、`errors`、`visited`、`visit`、`stat`、`candidate`、`entries`、`summarizeCandidates`、`totalBytes`、`byReason`、`resolveScanTargets`、`explicitTargets`、`targets`、`allowed`、`blocked`、`guard`、`scanFiles`、`scans`、`scan`、`summary`、`getBucketForFile`、`uniqueDestinationPath`、`dir`、`base`、`index`、`buildOrganizePlan`、`sourceInput`、`source`、`sourceGuard`、`destination`、`destGuard`、`plan`、`maxFiles`、`from`、`bucket`、`to`、`organizeFiles`、`dryRun`、`planResult`、`moved`、`buildQuarantinePath`、`rootLabel`、`relative`、`quarantineCandidates`、`permanentlyDeleteCandidates`、`deleted`、`cleanFiles`、`scanResult`、`mode`、`quarantineRoot`、`schemaResult`、`executeFileManagerTool`、`action`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 3 | <code>const os = require('os');</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const FILE_MANAGER_TOOL_ID = 'file_manager';</code> | 声明局部标识符 `FILE_MANAGER_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 7 | <code>const DEFAULT_SCAN_LIMIT = 2000;</code> | 声明局部标识符 `DEFAULT_SCAN_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 8 | <code>const DEFAULT_CANDIDATE_LIMIT = 200;</code> | 声明局部标识符 `DEFAULT_CANDIDATE_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 9 | <code>const DEFAULT_MAX_DEPTH = 4;</code> | 声明局部标识符 `DEFAULT_MAX_DEPTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 10 | <code>const DEFAULT_MIN_AGE_DAYS = 7;</code> | 声明局部标识符 `DEFAULT_MIN_AGE_DAYS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>const TEMP_EXTENSIONS = new Set([</code> | 声明局部标识符 `TEMP_EXTENSIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 13 | <code>    '.tmp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 14 | <code>    '.temp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 15 | <code>    '.bak',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 16 | <code>    '.old',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 17 | <code>    '.log',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 18 | <code>    '.dmp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 19 | <code>    '.dump',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 20 | <code>    '.crdownload',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 21 | <code>    '.part',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 22 | <code>    '.download',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 23 | <code>    '.cache'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 24 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>const ORGANIZE_BUCKETS = Object.freeze({</code> | 声明局部标识符 `ORGANIZE_BUCKETS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 27 | <code>    Images: Object.freeze(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.heic']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 28 | <code>    Documents: Object.freeze(['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.ppt', '.pptx', '.xls', '.xlsx']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 29 | <code>    Archives: Object.freeze(['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 30 | <code>    Videos: Object.freeze(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 31 | <code>    Audio: Object.freeze(['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 32 | <code>    Code: Object.freeze(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.h', '.cs']),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 33 | <code>    Data: Object.freeze(['.json', '.csv', '.tsv', '.xml', '.yaml', '.yml', '.sqlite', '.db'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 34 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 37 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 38 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 41 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 42 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>function normalizeBoolean(value, fallback = false) {</code> | 定义函数 `normalizeBoolean`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 45 | <code>    if (typeof value === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 46 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 49 | <code>        if (/^(true&#124;1&#124;yes&#124;on)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 50 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>        if (/^(false&#124;0&#124;no&#124;off)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 53 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 54 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 55 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>    return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>function normalizeNumber(value, fallback, min, max) {</code> | 定义函数 `normalizeNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 60 | <code>    const parsed = Number(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 61 | <code>    if (!Number.isFinite(parsed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 62 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>    return Math.min(Math.max(parsed, min), max);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>function isPathInside(rootPath, targetPath) {</code> | 定义函数 `isPathInside`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 68 | <code>    const root = path.resolve(rootPath);</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 69 | <code>    const target = path.resolve(targetPath);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 70 | <code>    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;</code> | 声明局部标识符 `rootComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 71 | <code>    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;</code> | 声明局部标识符 `targetComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 72 | <code>    return targetComparable === rootComparable &#124;&#124; targetComparable.startsWith(`${rootComparable}${path.sep}`);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 73 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 75 | <code>function uniquePaths(paths) {</code> | 定义函数 `uniquePaths`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 76 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 77 | <code>    const result = [];</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 78 | <code>    for (const entry of paths) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 79 | <code>        const normalized = normalizeString(entry);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 80 | <code>        if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 81 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 82 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>        const resolved = path.resolve(normalized);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 84 | <code>        const key = process.platform === 'win32' ? resolved.toLowerCase() : resolved;</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 85 | <code>        if (!seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 86 | <code>            seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 87 | <code>            result.push(resolved);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 88 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 91 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>function maybePath(...parts) {</code> | 定义函数 `maybePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 94 | <code>    if (parts.some((part) =&gt; !normalizeString(part))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 95 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 96 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 97 | <code>    return path.join(...parts);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 98 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 100 | <code>function userDir(name) {</code> | 定义函数 `userDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 101 | <code>    return maybePath(os.homedir(), name);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 102 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 104 | <code>function windowsTempDir() {</code> | 定义函数 `windowsTempDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 105 | <code>    if (process.platform !== 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 106 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 107 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    const windir = process.env.WINDIR &#124;&#124; 'C:\\Windows';</code> | 声明局部标识符 `windir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 109 | <code>    return path.join(windir, 'Temp');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 110 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 112 | <code>function getAllowedRoots(runtime = {}) {</code> | 定义函数 `getAllowedRoots`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 113 | <code>    return uniquePaths([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 114 | <code>        runtime.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 115 | <code>        runtime.workspaceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 116 | <code>        runtime.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 117 | <code>        os.tmpdir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 118 | <code>        process.env.TEMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 119 | <code>        process.env.TMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 120 | <code>        maybePath(process.env.LOCALAPPDATA, 'Temp'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 121 | <code>        windowsTempDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 122 | <code>        userDir('Downloads'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 123 | <code>        userDir('Desktop'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 124 | <code>        userDir('Documents'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 125 | <code>        userDir('Pictures'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 126 | <code>        userDir('Videos'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 127 | <code>        userDir('Music')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 128 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>function getProfileTargets(profile, runtime = {}) {</code> | 定义函数 `getProfileTargets`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 132 | <code>    const normalized = normalizeString(profile, 'workspace').toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 133 | <code>    const localTemp = maybePath(process.env.LOCALAPPDATA, 'Temp');</code> | 声明局部标识符 `localTemp`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 134 | <code>    const targetsByProfile = {</code> | 声明局部标识符 `targetsByProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 135 | <code>        workspace: [runtime.workspaceDir &#124;&#124; runtime.workspaceRoot],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 136 | <code>        downloads: [userDir('Downloads')],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 137 | <code>        desktop: [userDir('Desktop')],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 138 | <code>        documents: [userDir('Documents')],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 139 | <code>        temp: [os.tmpdir(), process.env.TEMP, process.env.TMP, localTemp],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 140 | <code>        c_drive_safe: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 141 | <code>            os.tmpdir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 142 | <code>            process.env.TEMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 143 | <code>            process.env.TMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 144 | <code>            localTemp,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 145 | <code>            windowsTempDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 146 | <code>            userDir('Downloads')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 147 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>        windows_safe_cleanup: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 149 | <code>            os.tmpdir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 150 | <code>            process.env.TEMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 151 | <code>            process.env.TMP,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 152 | <code>            localTemp,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 153 | <code>            windowsTempDir(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 154 | <code>            userDir('Downloads')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 155 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    return uniquePaths(targetsByProfile[normalized] &#124;&#124; targetsByProfile.workspace);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 158 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 160 | <code>async function pathExists(targetPath) {</code> | 定义函数 `pathExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 161 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 162 | <code>        await fsp.access(targetPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 163 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 165 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 166 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>async function safeStat(targetPath) {</code> | 定义函数 `safeStat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 170 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 171 | <code>        return await fsp.lstat(targetPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 172 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 173 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 177 | <code>function createTextResult(text, details = {}) {</code> | 定义函数 `createTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 178 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>        content: text ? [{ type: 'text', text }] : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 180 | <code>        details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 181 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 182 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 183 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 184 | <code>function createErrorResult(status, message, details = {}) {</code> | 定义函数 `createErrorResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 185 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 186 | <code>        content: [{ type: 'text', text: message }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 187 | <code>        isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 188 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 189 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 190 | <code>            error: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 191 | <code>            ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 192 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>function formatBytes(bytes) {</code> | 定义函数 `formatBytes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 197 | <code>    if (!Number.isFinite(bytes)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 198 | <code>        return 'unknown';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    const units = ['B', 'KB', 'MB', 'GB', 'TB'];</code> | 声明局部标识符 `units`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 201 | <code>    let value = bytes;</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 202 | <code>    let unitIndex = 0;</code> | 声明局部标识符 `unitIndex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 203 | <code>    while (value &gt;= 1024 &amp;&amp; unitIndex &lt; units.length - 1) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 204 | <code>        value /= 1024;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 205 | <code>        unitIndex += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 206 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 208 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 210 | <code>function resolveUserTarget(rawTarget, runtime = {}) {</code> | 定义函数 `resolveUserTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 211 | <code>    const target = normalizeString(rawTarget);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 212 | <code>    if (!target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 213 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    return path.isAbsolute(target)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>        ? path.resolve(target)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 217 | <code>        : path.resolve(runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; process.cwd(), target);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 218 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 220 | <code>function assertTargetAllowed(targetPath, runtime = {}) {</code> | 定义函数 `assertTargetAllowed`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 221 | <code>    const allowedRoots = getAllowedRoots(runtime);</code> | 声明局部标识符 `allowedRoots`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 222 | <code>    if (!allowedRoots.some((root) =&gt; isPathInside(root, targetPath))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 223 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 224 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 225 | <code>            result: createErrorResult(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 226 | <code>                'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 227 | <code>                'file_manager 只允许访问工作区、用户常用目录和安全临时目录。要做 C 盘清理请使用 profile="c_drive_safe"，不会直接扫描整个 C:\\。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 228 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 229 | <code>                    target: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 230 | <code>                    allowedRoots</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 231 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    return { ok: true, allowedRoots };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 236 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>function classifyEntry(filePath, stat, rootPath, args = {}) {</code> | 定义函数 `classifyEntry`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 239 | <code>    const basename = path.basename(filePath);</code> | 声明局部标识符 `basename`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 240 | <code>    const lowerName = basename.toLowerCase();</code> | 声明局部标识符 `lowerName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 241 | <code>    const ext = path.extname(lowerName);</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 242 | <code>    const now = Date.now();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 243 | <code>    const minAgeDays = normalizeNumber(args.minAgeDays, DEFAULT_MIN_AGE_DAYS, 0, 3650);</code> | 声明局部标识符 `minAgeDays`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 244 | <code>    const ageDays = Math.floor((now - stat.mtimeMs) / 86400000);</code> | 声明局部标识符 `ageDays`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 245 | <code>    const relativePath = path.relative(rootPath, filePath);</code> | 声明局部标识符 `relativePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>    if (stat.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 248 | <code>        if (normalizeBoolean(args.includeDependencyDirs, false) &amp;&amp; ['node_modules', '.next', 'dist', 'build', 'out'].includes(lowerName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 249 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 250 | <code>                path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 251 | <code>                relativePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 252 | <code>                type: 'directory',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 253 | <code>                size: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 254 | <code>                sizeText: 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 255 | <code>                ageDays,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 256 | <code>                reason: 'large_generated_directory',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 257 | <code>                risk: 'medium',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 258 | <code>                recommendedAction: 'review'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 259 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 262 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>    if (!stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 268 | <code>    const isTempExtension = TEMP_EXTENSIONS.has(ext);</code> | 声明局部标识符 `isTempExtension`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 269 | <code>    const isEditorBackup = /(~&#124;\.swp&#124;\.swo&#124;\.tmp)$/i.test(lowerName);</code> | 声明局部标识符 `isEditorBackup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 270 | <code>    const isCrashDump = /\.(dmp&#124;dump&#124;mdmp)$/i.test(lowerName);</code> | 声明局部标识符 `isCrashDump`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 271 | <code>    const isPartialDownload = /\.(crdownload&#124;part&#124;download)$/i.test(lowerName);</code> | 声明局部标识符 `isPartialDownload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 272 | <code>    const isOldLog = ext === '.log' &amp;&amp; ageDays &gt;= minAgeDays;</code> | 声明局部标识符 `isOldLog`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 273 | <code>    const isZeroByte = stat.size === 0 &amp;&amp; normalizeBoolean(args.includeEmptyFiles, false);</code> | 声明局部标识符 `isZeroByte`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 274 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 275 | <code>    let reason = '';</code> | 声明局部标识符 `reason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 276 | <code>    let risk = 'low';</code> | 声明局部标识符 `risk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 277 | <code>    if (isCrashDump) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 278 | <code>        reason = 'crash_dump';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 279 | <code>        risk = 'low';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 280 | <code>    } else if (isPartialDownload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 281 | <code>        reason = 'partial_download';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 282 | <code>        risk = 'medium';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 283 | <code>    } else if (isOldLog) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 284 | <code>        reason = 'old_log';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 285 | <code>        risk = 'low';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 286 | <code>    } else if (isTempExtension &#124;&#124; isEditorBackup) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 287 | <code>        reason = 'temporary_or_backup_file';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 288 | <code>        risk = ext === '.bak' &#124;&#124; ext === '.old' ? 'medium' : 'low';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 289 | <code>    } else if (isZeroByte) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 290 | <code>        reason = 'empty_file';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 291 | <code>        risk = 'medium';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 292 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>    if (!reason) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 295 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 296 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 298 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 299 | <code>        path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 300 | <code>        relativePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 301 | <code>        type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 302 | <code>        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 303 | <code>        sizeText: formatBytes(stat.size),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 304 | <code>        ageDays,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 305 | <code>        mtime: new Date(stat.mtimeMs).toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 306 | <code>        reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 307 | <code>        risk,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 308 | <code>        recommendedAction: 'quarantine'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 309 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>async function walkForCandidates(rootPath, args = {}) {</code> | 定义函数 `walkForCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 313 | <code>    const maxDepth = normalizeNumber(args.maxDepth, DEFAULT_MAX_DEPTH, 0, 12);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 314 | <code>    const maxEntries = normalizeNumber(args.maxEntries, DEFAULT_SCAN_LIMIT, 1, 20000);</code> | 声明局部标识符 `maxEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 315 | <code>    const maxCandidates = normalizeNumber(args.maxCandidates, DEFAULT_CANDIDATE_LIMIT, 1, 5000);</code> | 声明局部标识符 `maxCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 316 | <code>    const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 317 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 318 | <code>    let visited = 0;</code> | 声明局部标识符 `visited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 319 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 320 | <code>    async function visit(currentPath, depth) {</code> | 定义函数 `visit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 321 | <code>        if (visited &gt;= maxEntries &#124;&#124; candidates.length &gt;= maxCandidates) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 322 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 323 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>        const stat = await safeStat(currentPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 325 | <code>        if (!stat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 326 | <code>            errors.push({ path: currentPath, error: 'stat_failed' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 327 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 328 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>        if (stat.isSymbolicLink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 330 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 331 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>        visited += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 333 | <code>        const candidate = classifyEntry(currentPath, stat, rootPath, args);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 334 | <code>        if (candidate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 335 | <code>            candidates.push(candidate);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 336 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>        if (!stat.isDirectory() &#124;&#124; depth &gt;= maxDepth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 338 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>        let entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 341 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 342 | <code>            entries = await fsp.readdir(currentPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 343 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 344 | <code>            errors.push({ path: currentPath, error: error.message &#124;&#124; String(error) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 345 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 346 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 348 | <code>            if (visited &gt;= maxEntries &#124;&#124; candidates.length &gt;= maxCandidates) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 349 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 350 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>            await visit(path.join(currentPath, entry), depth + 1);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 352 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 355 | <code>    await visit(rootPath, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 356 | <code>    return { candidates, errors, visited };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 357 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 358 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 359 | <code>function summarizeCandidates(targets, scans) {</code> | 定义函数 `summarizeCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 360 | <code>    const candidates = scans.flatMap((scan) =&gt; scan.candidates);</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 361 | <code>    const totalBytes = candidates.reduce((sum, item) =&gt; sum + (Number(item.size) &#124;&#124; 0), 0);</code> | 声明局部标识符 `totalBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 362 | <code>    const byReason = {};</code> | 声明局部标识符 `byReason`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 363 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 364 | <code>        byReason[candidate.reason] = (byReason[candidate.reason] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 365 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 366 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 367 | <code>        targets,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 368 | <code>        candidateCount: candidates.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 369 | <code>        totalBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 370 | <code>        totalSizeText: formatBytes(totalBytes),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 371 | <code>        byReason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 372 | <code>        visited: scans.reduce((sum, scan) =&gt; sum + scan.visited, 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 373 | <code>        errorCount: scans.reduce((sum, scan) =&gt; sum + scan.errors.length, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 374 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 377 | <code>async function resolveScanTargets(args = {}, runtime = {}) {</code> | 定义函数 `resolveScanTargets`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 378 | <code>    const explicitTargets = Array.isArray(args.targets)</code> | 声明局部标识符 `explicitTargets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 379 | <code>        ? args.targets</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 380 | <code>        : normalizeString(args.target &#124;&#124; args.path &#124;&#124; args.dir &#124;&#124; args.directory)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 381 | <code>            ? [args.target &#124;&#124; args.path &#124;&#124; args.dir &#124;&#124; args.directory]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 382 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 384 | <code>    const targets = explicitTargets.length</code> | 声明局部标识符 `targets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 385 | <code>        ? uniquePaths(explicitTargets.map((target) =&gt; resolveUserTarget(target, runtime)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 386 | <code>        : getProfileTargets(args.profile &#124;&#124; args.preset &#124;&#124; 'workspace', runtime);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>    const allowed = [];</code> | 声明局部标识符 `allowed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 389 | <code>    const blocked = [];</code> | 声明局部标识符 `blocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 390 | <code>    for (const target of targets) {</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 391 | <code>        const guard = assertTargetAllowed(target, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 392 | <code>        if (!guard.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 393 | <code>            blocked.push({ target, details: guard.result.details });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 394 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 395 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>        if (await pathExists(target)) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 397 | <code>            allowed.push(target);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 398 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 399 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>    return { allowed, blocked };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 401 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 403 | <code>async function scanFiles(args = {}, context = {}, runtime = {}) {</code> | 定义函数 `scanFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 404 | <code>    const { allowed, blocked } = await resolveScanTargets(args, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 405 | <code>    if (!allowed.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 406 | <code>        return createErrorResult('blocked', '没有可扫描的安全目标。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 407 | <code>            blocked,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 408 | <code>            profile: args.profile &#124;&#124; args.preset &#124;&#124; 'workspace'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 409 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 412 | <code>    const scans = [];</code> | 声明局部标识符 `scans`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 413 | <code>    for (const target of allowed) {</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 414 | <code>        const scan = await walkForCandidates(target, args);</code> | 声明局部标识符 `scan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 415 | <code>        scans.push({ target, ...scan });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    const summary = summarizeCandidates(allowed, scans);</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 418 | <code>    return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 419 | <code>        JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 420 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 421 | <code>                action: 'scan',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 422 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 423 | <code>                summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 424 | <code>                candidates: scans.flatMap((scan) =&gt; scan.candidates),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 425 | <code>                blocked</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 426 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>            null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 428 | <code>            2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 429 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 431 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 432 | <code>            action: 'scan',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 433 | <code>            profile: args.profile &#124;&#124; args.preset &#124;&#124; 'workspace',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 434 | <code>            summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 435 | <code>            candidates: scans.flatMap((scan) =&gt; scan.candidates),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 436 | <code>            blocked</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 437 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 439 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 440 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 441 | <code>function getBucketForFile(filePath) {</code> | 定义函数 `getBucketForFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 442 | <code>    const ext = path.extname(filePath).toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 443 | <code>    for (const [bucket, extensions] of Object.entries(ORGANIZE_BUCKETS)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 444 | <code>        if (extensions.includes(ext)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 445 | <code>            return bucket;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 446 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>    return 'Other';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 449 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>async function uniqueDestinationPath(targetPath) {</code> | 定义函数 `uniqueDestinationPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 452 | <code>    if (!(await pathExists(targetPath))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 453 | <code>        return targetPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 454 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>    const dir = path.dirname(targetPath);</code> | 声明局部标识符 `dir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 456 | <code>    const ext = path.extname(targetPath);</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 457 | <code>    const base = path.basename(targetPath, ext);</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 458 | <code>    for (let index = 1; index &lt;= 9999; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 459 | <code>        const candidate = path.join(dir, `${base} (${index})${ext}`);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 460 | <code>        if (!(await pathExists(candidate))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 461 | <code>            return candidate;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 462 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>    throw new Error(`无法为 ${targetPath} 生成不冲突的目标路径。`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 465 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>async function buildOrganizePlan(args = {}, runtime = {}) {</code> | 定义函数 `buildOrganizePlan`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 468 | <code>    const sourceInput = normalizeString(args.source &#124;&#124; args.target &#124;&#124; args.path &#124;&#124; args.dir &#124;&#124; args.directory);</code> | 声明局部标识符 `sourceInput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 469 | <code>    const source = sourceInput</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 470 | <code>        ? resolveUserTarget(sourceInput, runtime)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 471 | <code>        : getProfileTargets(args.profile &#124;&#124; args.preset &#124;&#124; 'workspace', runtime)[0];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 472 | <code>    if (!source) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 473 | <code>        return { error: createErrorResult('needs_config', 'organize 需要 source/target/path 参数，或可解析的 profile。') };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 474 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 475 | <code>    const sourceGuard = assertTargetAllowed(source, runtime);</code> | 声明局部标识符 `sourceGuard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 476 | <code>    if (!sourceGuard.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 477 | <code>        return { error: sourceGuard.result };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 478 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>    const destination = resolveUserTarget(args.destination &#124;&#124; args.dest &#124;&#124; path.join(source, 'Organized'), runtime);</code> | 声明局部标识符 `destination`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 480 | <code>    const destGuard = assertTargetAllowed(destination, runtime);</code> | 声明局部标识符 `destGuard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 481 | <code>    if (!destGuard.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 482 | <code>        return { error: destGuard.result };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 483 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>    if (!(await pathExists(source))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 485 | <code>        return { error: createErrorResult('not_found', `整理源目录不存在：${source}`, { source }) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 486 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>    const entries = await fsp.readdir(source, { withFileTypes: true });</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 489 | <code>    const plan = [];</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 490 | <code>    const maxFiles = normalizeNumber(args.maxFiles, 500, 1, 5000);</code> | 声明局部标识符 `maxFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 491 | <code>    for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 492 | <code>        if (plan.length &gt;= maxFiles &#124;&#124; !entry.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 493 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 494 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>        const from = path.join(source, entry.name);</code> | 声明局部标识符 `from`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 496 | <code>        const bucket = getBucketForFile(entry.name);</code> | 声明局部标识符 `bucket`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 497 | <code>        const to = await uniqueDestinationPath(path.join(destination, bucket, entry.name));</code> | 声明局部标识符 `to`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 498 | <code>        if (path.resolve(from) !== path.resolve(to)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 499 | <code>            plan.push({ from, to, bucket });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 500 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>    return { source, destination, plan };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 503 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>async function organizeFiles(args = {}, context = {}, runtime = {}) {</code> | 定义函数 `organizeFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 506 | <code>    const dryRun = args.dryRun !== false;</code> | 声明局部标识符 `dryRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 507 | <code>    const planResult = await buildOrganizePlan(args, runtime);</code> | 声明局部标识符 `planResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 508 | <code>    if (planResult.error) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 509 | <code>        return planResult.error;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 510 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>    const { source, destination, plan } = planResult;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 512 | <code>    if (dryRun) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 513 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 514 | <code>            JSON.stringify({ action: 'organize', status: 'planned', dryRun: true, source, destination, moveCount: plan.length, plan }, null, 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 515 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 516 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 517 | <code>                action: 'organize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 518 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 519 | <code>                source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 520 | <code>                destination,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 521 | <code>                moveCount: plan.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 522 | <code>                plan</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 523 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 525 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>    if (context.approved !== true &amp;&amp; args.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 527 | <code>        return createErrorResult('needs_approval', '整理文件会移动文件，需要用户确认：context.approved=true。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 528 | <code>            action: 'organize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 529 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 530 | <code>            destination,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 531 | <code>            moveCount: plan.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 532 | <code>            plan</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 533 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>    const moved = [];</code> | 声明局部标识符 `moved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 536 | <code>    for (const item of plan) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 537 | <code>        await fsp.mkdir(path.dirname(item.to), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 538 | <code>        await fsp.rename(item.from, item.to);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 539 | <code>        moved.push(item);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 540 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 541 | <code>    return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 542 | <code>        JSON.stringify({ action: 'organize', status: 'completed', source, destination, moved }, null, 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 543 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 544 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 545 | <code>            action: 'organize',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 546 | <code>            source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 547 | <code>            destination,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 548 | <code>            moved</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 549 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 551 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 553 | <code>function buildQuarantinePath(candidate, quarantineRoot, targetRoots) {</code> | 定义函数 `buildQuarantinePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 554 | <code>    const root = targetRoots.find((target) =&gt; isPathInside(target, candidate.path)) &#124;&#124; path.parse(candidate.path).root;</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 555 | <code>    const rootLabel = root.replace(/[:\\/]+/g, '_').replace(/^_+&#124;_+$/g, '') &#124;&#124; 'root';</code> | 声明局部标识符 `rootLabel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 556 | <code>    const relative = path.relative(root, candidate.path);</code> | 声明局部标识符 `relative`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 557 | <code>    return path.join(quarantineRoot, rootLabel, relative);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 558 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 559 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 560 | <code>async function quarantineCandidates(candidates, quarantineRoot, targetRoots) {</code> | 定义函数 `quarantineCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 561 | <code>    const moved = [];</code> | 声明局部标识符 `moved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 562 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 563 | <code>        const stat = await safeStat(candidate.path);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 564 | <code>        if (!stat &#124;&#124; !stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 565 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 566 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>        const destination = await uniqueDestinationPath(buildQuarantinePath(candidate, quarantineRoot, targetRoots));</code> | 声明局部标识符 `destination`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 568 | <code>        await fsp.mkdir(path.dirname(destination), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 569 | <code>        await fsp.rename(candidate.path, destination);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 570 | <code>        moved.push({ from: candidate.path, to: destination, reason: candidate.reason, size: candidate.size });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 571 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>    return moved;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 573 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>async function permanentlyDeleteCandidates(candidates) {</code> | 定义函数 `permanentlyDeleteCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 576 | <code>    const deleted = [];</code> | 声明局部标识符 `deleted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 577 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 578 | <code>        const stat = await safeStat(candidate.path);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 579 | <code>        if (!stat &#124;&#124; !stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 580 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 581 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>        await fsp.rm(candidate.path, { force: false, recursive: false });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 583 | <code>        deleted.push({ path: candidate.path, reason: candidate.reason, size: candidate.size });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 584 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>    return deleted;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 586 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 587 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 588 | <code>async function cleanFiles(args = {}, context = {}, runtime = {}) {</code> | 定义函数 `cleanFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 589 | <code>    const dryRun = args.dryRun !== false;</code> | 声明局部标识符 `dryRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 590 | <code>    const scanResult = await scanFiles(args, context, runtime);</code> | 声明局部标识符 `scanResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 591 | <code>    if (scanResult.isError) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 592 | <code>        return scanResult;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 593 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>    const candidates = scanResult.details.candidates &#124;&#124; [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 595 | <code>    const targets = scanResult.details.summary?.targets &#124;&#124; [];</code> | 声明局部标识符 `targets`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 596 | <code>    const mode = normalizeString(args.mode &#124;&#124; args.strategy, 'quarantine').toLowerCase();</code> | 声明局部标识符 `mode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 597 | <code>    const summary = scanResult.details.summary;</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>    if (dryRun) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 600 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 601 | <code>            JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 602 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 603 | <code>                    action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 604 | <code>                    status: 'planned',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 605 | <code>                    dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 606 | <code>                    mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 607 | <code>                    summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 608 | <code>                    candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 609 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>                null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 611 | <code>                2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 612 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 614 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 615 | <code>                action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 616 | <code>                dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 617 | <code>                mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 618 | <code>                summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 619 | <code>                candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 620 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 621 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>    if (context.approved !== true &amp;&amp; args.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 624 | <code>        return createErrorResult('needs_approval', '清理文件会移动或删除文件，需要用户确认：context.approved=true。默认建议使用 quarantine 隔离模式。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 625 | <code>            action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 626 | <code>            mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 627 | <code>            summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 628 | <code>            candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 629 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 630 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 631 | <code>    if (mode === 'delete' &amp;&amp; !(args.allowPermanentDelete === true &amp;&amp; args.dangerous === true)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 632 | <code>        return createErrorResult('blocked', '永久删除需要同时设置 allowPermanentDelete=true 和 dangerous=true。建议使用默认 quarantine。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 633 | <code>            action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 634 | <code>            mode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 635 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>    if (mode === 'delete') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 639 | <code>        const deleted = await permanentlyDeleteCandidates(candidates);</code> | 声明局部标识符 `deleted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 640 | <code>        return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 641 | <code>            JSON.stringify({ action: 'clean', status: 'completed', mode, deleted }, null, 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 642 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 643 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 644 | <code>                action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 645 | <code>                mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 646 | <code>                deleted</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 647 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 651 | <code>    const quarantineRoot = resolveUserTarget(</code> | 声明局部标识符 `quarantineRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 652 | <code>        args.quarantineDir &#124;&#124; path.join(runtime.workspaceRoot &#124;&#124; runtime.workspaceDir &#124;&#124; process.cwd(), 'tmp', 'ailis-quarantine', new Date().toISOString().replace(/[:.]/g, '-')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 653 | <code>        runtime</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 654 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 655 | <code>    const guard = assertTargetAllowed(quarantineRoot, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 656 | <code>    if (!guard.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 657 | <code>        return guard.result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 658 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 659 | <code>    const moved = await quarantineCandidates(candidates, quarantineRoot, targets);</code> | 声明局部标识符 `moved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 660 | <code>    return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 661 | <code>        JSON.stringify({ action: 'clean', status: 'completed', mode: 'quarantine', quarantineRoot, moved }, null, 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 662 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 663 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 664 | <code>            action: 'clean',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 665 | <code>            mode: 'quarantine',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 666 | <code>            quarantineRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 667 | <code>            moved</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 668 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 669 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 671 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 672 | <code>function schemaResult() {</code> | 定义函数 `schemaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 673 | <code>    return createTextResult(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 674 | <code>        JSON.stringify(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 675 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 676 | <code>                tool: FILE_MANAGER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 677 | <code>                actions: ['schema', 'scan', 'clean', 'organize'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 678 | <code>                profiles: ['workspace', 'downloads', 'desktop', 'documents', 'temp', 'c_drive_safe', 'windows_safe_cleanup'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 679 | <code>                safety: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 680 | <code>                    dryRunDefault: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 681 | <code>                    destructiveActionsRequireApproval: ['clean', 'organize'],</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 682 | <code>                    defaultCleanMode: 'quarantine',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 683 | <code>                    permanentDeleteRequires: ['context.approved=true', 'allowPermanentDelete=true', 'dangerous=true']</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 684 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>                organizeBuckets: ORGANIZE_BUCKETS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 686 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>            null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 688 | <code>            2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 689 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 690 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 691 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 692 | <code>            action: 'schema'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 693 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 694 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 697 | <code>async function executeFileManagerTool(args = {}, context = {}, runtime = {}) {</code> | 定义函数 `executeFileManagerTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 698 | <code>    const action = normalizeString(args.action &#124;&#124; args.intent &#124;&#124; args.operation, 'scan').toLowerCase();</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 699 | <code>    if (action === 'schema' &#124;&#124; action === 'help') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 700 | <code>        return schemaResult();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 701 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 702 | <code>    if (action === 'scan' &#124;&#124; action === 'analyze' &#124;&#124; action === 'plan') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 703 | <code>        return await scanFiles(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 704 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 705 | <code>    if (action === 'clean' &#124;&#124; action === 'cleanup' &#124;&#124; action === 'clear_junk') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 706 | <code>        return await cleanFiles(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 707 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 708 | <code>    if (action === 'organize' &#124;&#124; action === 'sort') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 709 | <code>        return await organizeFiles(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 710 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>    return createErrorResult('needs_config', `不支持的 file_manager action：${action}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 712 | <code>        supportedActions: ['schema', 'scan', 'clean', 'organize']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 713 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 716 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 717 | <code>    FILE_MANAGER_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 718 | <code>    executeFileManagerTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 719 | <code>    getAllowedRoots,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 720 | <code>    getProfileTargets,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 721 | <code>    ORGANIZE_BUCKETS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“文件管理工具：受路径保护地读取、写入、移动或检查本地文件。”这一文件职责。 |
| 722 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
