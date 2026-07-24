# electron/ailis-code-tool.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：860
- SHA-256：`3bda55368c3237a9e1fea0a3f190b18d8e3ba930b406755505e090da939eb690`
- 可运行副本：[打开源文件](../../../source/electron/ailis-code-tool.cjs)
- 依赖：`fs`、`fs/promises`、`os`、`path`、`child_process`、`@babel/parser`、`@babel/traverse`、`@babel/generator`、`typescript`
- 主要符号：`fs`、`fsp`、`os`、`path`、`parser`、`traverseModule`、`generateModule`、`ts`、`CODE_TOOL_ID`、`DEFAULT_LIMIT`、`DEFAULT_MAX_FILE_BYTES`、`DEFAULT_INDEX_FILE_LIMIT`、`traverse`、`generate`、`TEXT_EXTENSIONS`、`DEFAULT_EXCLUDES`、`normalizeString`、`trimmed`、`normalizeBoolean`、`normalizeNumber`、`parsed`、`createTextResult`、`createErrorResult`、`isPathInside`、`root`、`target`、`rootComparable`、`targetComparable`、`resolveTargetPath`、`value`、`guardPath`、`workspace`、`approvalRequired`、`runExecFile`、`useShell`、`safeStat`、`isTextFile`、`maxBytes`、`walkCodeFiles`、`limit`、`maxDepth`、`excludes`、`files`、`errors`、`visit`、`stat`、`base`、`entries`、`parseSource`、`ext`、`isTypeScript`、`locOf`、`extractSymbolsFromAst`、`symbols`、`actionSchema`、`schema`、`actionGit`、`cwd`、`guard`、`result`、`text`、`actionGitCommit`、`approval`、`message`、`actionSearch`、`query`、`byName`、`rg`、`matches`、`event`、`regex`、`lines`、`index`、`actionIndex`、`includeSymbols`、`actionSymbols`、`actionRenameSymbol`、`from`、`to`、`source`、`ast`、`replacements`、`output`、`details`、`actionLspStatus`、`version`、`tls`、`actionLspDiagnostics`、`diagnostics`、`loc`、`actionTest`、`script`、`runner`、`commandArgs`、`actionCiStatus`、`ghCheck`、`actionPrCreate`、`title`、`body`、`prArgs`、`executeCodeTool`、`action`、`diffArgs`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 3 | <code>const os = require('os');</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>const { execFile } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const parser = require('@babel/parser');</code> | 导入依赖 `@babel/parser`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>const traverseModule = require('@babel/traverse');</code> | 导入依赖 `@babel/traverse`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>const generateModule = require('@babel/generator');</code> | 导入依赖 `@babel/generator`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>const ts = require('typescript');</code> | 导入依赖 `typescript`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>const CODE_TOOL_ID = 'code';</code> | 声明局部标识符 `CODE_TOOL_ID`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 13 | <code>const DEFAULT_LIMIT = 200;</code> | 声明局部标识符 `DEFAULT_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>const DEFAULT_MAX_FILE_BYTES = 512 * 1024;</code> | 声明局部标识符 `DEFAULT_MAX_FILE_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>const DEFAULT_INDEX_FILE_LIMIT = 2000;</code> | 声明局部标识符 `DEFAULT_INDEX_FILE_LIMIT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 16 | <code>const traverse = traverseModule.default &#124;&#124; traverseModule;</code> | 声明局部标识符 `traverse`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>const generate = generateModule.default &#124;&#124; generateModule;</code> | 声明局部标识符 `generate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 19 | <code>const TEXT_EXTENSIONS = new Set([</code> | 声明局部标识符 `TEXT_EXTENSIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>    '.cjs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 21 | <code>    '.css',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 22 | <code>    '.html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>    '.js',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>    '.json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 25 | <code>    '.jsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 26 | <code>    '.md',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 27 | <code>    '.mjs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 28 | <code>    '.ts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 29 | <code>    '.tsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 30 | <code>    '.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>    '.vue',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>    '.yaml',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 33 | <code>    '.yml'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 34 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>const DEFAULT_EXCLUDES = new Set([</code> | 声明局部标识符 `DEFAULT_EXCLUDES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 37 | <code>    '.git',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 38 | <code>    '.ailis-code-index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 39 | <code>    '.ailis-rollback',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 40 | <code>    'build-cache',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 41 | <code>    'dist',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 42 | <code>    'node_modules',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>    'out',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 44 | <code>    'release'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 45 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 47 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 48 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 49 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 50 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 52 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function normalizeBoolean(value, fallback = false) {</code> | 定义函数 `normalizeBoolean`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 56 | <code>    if (typeof value === 'boolean') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 57 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 58 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    if (typeof value === 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>        if (/^(true&#124;1&#124;yes&#124;on)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 61 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 62 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 63 | <code>        if (/^(false&#124;0&#124;no&#124;off)$/i.test(value.trim())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 64 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>    return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 68 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>function normalizeNumber(value, fallback, min, max) {</code> | 定义函数 `normalizeNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 71 | <code>    const parsed = Number(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>    if (!Number.isFinite(parsed)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 73 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 74 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 75 | <code>    return Math.min(Math.max(parsed, min), max);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 76 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 78 | <code>function createTextResult(text, details = {}) {</code> | 定义函数 `createTextResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 80 | <code>        content: text ? [{ type: 'text', text }] : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>        details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>function createErrorResult(status, message, details = {}) {</code> | 定义函数 `createErrorResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 86 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 87 | <code>        content: [{ type: 'text', text: message }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 88 | <code>        isError: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 89 | <code>        details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 90 | <code>            status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 91 | <code>            error: message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 92 | <code>            ...details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 93 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 96 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 97 | <code>function isPathInside(rootPath, targetPath) {</code> | 定义函数 `isPathInside`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 98 | <code>    const root = path.resolve(rootPath);</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 99 | <code>    const target = path.resolve(targetPath);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 100 | <code>    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;</code> | 声明局部标识符 `rootComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 101 | <code>    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;</code> | 声明局部标识符 `targetComparable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 102 | <code>    return targetComparable === rootComparable &#124;&#124; targetComparable.startsWith(`${rootComparable}${path.sep}`);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 103 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 105 | <code>function resolveTargetPath(rawPath, runtime = {}) {</code> | 定义函数 `resolveTargetPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 106 | <code>    const value = normalizeString(rawPath, '.');</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 107 | <code>    if (value === '~') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 108 | <code>        return os.homedir();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>    if (value.startsWith('~/') &#124;&#124; value.startsWith(`~${path.sep}`)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 111 | <code>        return path.resolve(os.homedir(), value.slice(2));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 112 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    if (path.isAbsolute(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 114 | <code>        return path.resolve(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 115 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>    return path.resolve(runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; process.cwd(), value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 117 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 119 | <code>function guardPath(targetPath, context = {}, runtime = {}) {</code> | 定义函数 `guardPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 120 | <code>    const workspace = path.resolve(runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; process.cwd());</code> | 声明局部标识符 `workspace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 121 | <code>    if (isPathInside(workspace, targetPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 122 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 123 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>    if (context.allowOutsideWorkspace === true &#124;&#124; context.allowComputerWideAccess === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 125 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>    return createErrorResult('blocked', 'code 工具默认只访问当前工作区。访问外部路径需要 context.allowOutsideWorkspace=true。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 128 | <code>        path: targetPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 129 | <code>        workspace</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 133 | <code>function approvalRequired(action, args, context) {</code> | 定义函数 `approvalRequired`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 134 | <code>    if (args.dryRun === true &#124;&#124; context.approved === true &#124;&#124; args.approved === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 135 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    return createErrorResult('needs_approval', `${action} 会修改代码或远程状态，需要用户确认：context.approved=true。`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 139 | <code>        approval: 'required'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 140 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>async function runExecFile(command, args = [], options = {}) {</code> | 定义函数 `runExecFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 144 | <code>    return await new Promise((resolve) =&gt; {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 145 | <code>        const useShell = process.platform === 'win32' &amp;&amp; /^(npm&#124;npx&#124;pnpm&#124;yarn)$/i.test(command);</code> | 声明局部标识符 `useShell`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 146 | <code>        execFile(command, args, { windowsHide: true, timeout: 30000, shell: useShell, ...options }, (error, stdout, stderr) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 147 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 148 | <code>                ok: !error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 149 | <code>                exitCode: error?.code ?? 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 150 | <code>                stdout: String(stdout &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 151 | <code>                stderr: String(stderr &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>                error: error ? error.message &#124;&#124; String(error) : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 153 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 158 | <code>async function safeStat(targetPath) {</code> | 定义函数 `safeStat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 159 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 160 | <code>        return await fsp.lstat(targetPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 161 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 162 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 163 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 166 | <code>function isTextFile(filePath, stat, args = {}) {</code> | 定义函数 `isTextFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 167 | <code>    if (!stat?.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 168 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 169 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    const maxBytes = normalizeNumber(args.maxFileBytes, DEFAULT_MAX_FILE_BYTES, 1024, 16 * 1024 * 1024);</code> | 声明局部标识符 `maxBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 171 | <code>    if (stat.size &gt; maxBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 172 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    if (TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 175 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 176 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>    return normalizeBoolean(args.includeUnknownText, false);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 178 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 180 | <code>async function walkCodeFiles(root, args = {}) {</code> | 定义函数 `walkCodeFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 181 | <code>    const limit = normalizeNumber(args.limit, DEFAULT_INDEX_FILE_LIMIT, 1, 50000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 182 | <code>    const maxDepth = normalizeNumber(args.maxDepth, 12, 0, 50);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 183 | <code>    const excludes = new Set([</code> | 声明局部标识符 `excludes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 184 | <code>        ...DEFAULT_EXCLUDES,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 185 | <code>        ...(Array.isArray(args.exclude) ? args.exclude.map((entry) =&gt; normalizeString(entry)).filter(Boolean) : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>    const files = [];</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 188 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 189 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 190 | <code>    async function visit(current, depth) {</code> | 定义函数 `visit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 191 | <code>        if (files.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 193 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>        const stat = await safeStat(current);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 195 | <code>        if (!stat &#124;&#124; stat.isSymbolicLink()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>        const base = path.basename(current);</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 199 | <code>        if (excludes.has(base)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 200 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 201 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>        if (stat.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 203 | <code>            if (isTextFile(current, stat, args)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>                files.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 205 | <code>                    path: current,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 206 | <code>                    relativePath: path.relative(root, current) &#124;&#124; path.basename(current),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 207 | <code>                    size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 208 | <code>                    modifiedAt: stat.mtime.toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 209 | <code>                    ext: path.extname(current).toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 210 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 212 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 213 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        if (!stat.isDirectory() &#124;&#124; depth &gt;= maxDepth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 215 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>        let entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 218 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 219 | <code>            entries = await fsp.readdir(current);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 220 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 221 | <code>            errors.push({ path: current, error: error?.message &#124;&#124; String(error) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 222 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 225 | <code>            await visit(path.join(current, entry), depth + 1);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 226 | <code>            if (files.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 227 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 228 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 232 | <code>    await visit(root, 0);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 233 | <code>    return { files, errors };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 234 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 236 | <code>function parseSource(source, filePath) {</code> | 定义函数 `parseSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 237 | <code>    const ext = path.extname(filePath).toLowerCase();</code> | 声明局部标识符 `ext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 238 | <code>    const isTypeScript = ext === '.ts' &#124;&#124; ext === '.tsx';</code> | 声明局部标识符 `isTypeScript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 239 | <code>    return parser.parse(source, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 240 | <code>        sourceType: 'unambiguous',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 241 | <code>        errorRecovery: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 242 | <code>        plugins: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 243 | <code>            'jsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 244 | <code>            'classProperties',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 245 | <code>            'classPrivateProperties',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 246 | <code>            'classPrivateMethods',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 247 | <code>            'decorators-legacy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 248 | <code>            'dynamicImport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 249 | <code>            'importMeta',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 250 | <code>            ...(isTypeScript ? ['typescript'] : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 251 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>function locOf(node) {</code> | 定义函数 `locOf`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 256 | <code>    return node?.loc</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 257 | <code>        ? {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 258 | <code>              line: node.loc.start.line,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 259 | <code>              column: node.loc.start.column</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 260 | <code>          }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>        : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 262 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>function extractSymbolsFromAst(ast, filePath) {</code> | 定义函数 `extractSymbolsFromAst`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 265 | <code>    const symbols = [];</code> | 声明局部标识符 `symbols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 266 | <code>    traverse(ast, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 267 | <code>        ImportDeclaration(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 268 | <code>            symbols.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 269 | <code>                kind: 'import',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 270 | <code>                name: nodePath.node.source?.value &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 271 | <code>                filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 272 | <code>                loc: locOf(nodePath.node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 273 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>        ExportNamedDeclaration(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 276 | <code>            symbols.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 277 | <code>                kind: 'export',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 278 | <code>                name: nodePath.node.declaration?.id?.name &#124;&#124; nodePath.node.source?.value &#124;&#124; 'named',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 279 | <code>                filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 280 | <code>                loc: locOf(nodePath.node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 281 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 283 | <code>        ExportDefaultDeclaration(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 284 | <code>            symbols.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 285 | <code>                kind: 'export_default',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 286 | <code>                name: nodePath.node.declaration?.id?.name &#124;&#124; 'default',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 287 | <code>                filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 288 | <code>                loc: locOf(nodePath.node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 289 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 291 | <code>        FunctionDeclaration(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 292 | <code>            if (nodePath.node.id?.name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 293 | <code>                symbols.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 294 | <code>                    kind: 'function',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 295 | <code>                    name: nodePath.node.id.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 296 | <code>                    filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 297 | <code>                    loc: locOf(nodePath.node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 298 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>        ClassDeclaration(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 302 | <code>            if (nodePath.node.id?.name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 303 | <code>                symbols.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 304 | <code>                    kind: 'class',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 305 | <code>                    name: nodePath.node.id.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 306 | <code>                    filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 307 | <code>                    loc: locOf(nodePath.node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 308 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>        VariableDeclarator(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 312 | <code>            if (nodePath.node.id?.type === 'Identifier') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 313 | <code>                symbols.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 314 | <code>                    kind: 'variable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 315 | <code>                    name: nodePath.node.id.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 316 | <code>                    filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 317 | <code>                    loc: locOf(nodePath.node)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 318 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 319 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>    return symbols;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 323 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>async function actionSchema(runtime) {</code> | 定义函数 `actionSchema`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 326 | <code>    const schema = {</code> | 声明局部标识符 `schema`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 327 | <code>        tool: CODE_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 328 | <code>        actions: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 329 | <code>            'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 330 | <code>            'git_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 331 | <code>            'git_diff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 332 | <code>            'git_log',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 333 | <code>            'git_branch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 334 | <code>            'git_commit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 335 | <code>            'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 336 | <code>            'index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 337 | <code>            'semantic_index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 338 | <code>            'symbols',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 339 | <code>            'rename_symbol',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 340 | <code>            'lsp_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 341 | <code>            'lsp_diagnostics',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 342 | <code>            'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 343 | <code>            'ci_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 344 | <code>            'pr_create'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 345 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>        workspace: runtime.workspaceDir &#124;&#124; runtime.workspaceRoot &#124;&#124; process.cwd(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 347 | <code>        mutatingActions: ['git_commit', 'rename_symbol', 'test', 'pr_create']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 348 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>    return createTextResult(JSON.stringify(schema, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 350 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 351 | <code>        action: 'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 352 | <code>        schema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 353 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 356 | <code>async function actionGit(args, context, runtime, gitArgs, action) {</code> | 定义函数 `actionGit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 357 | <code>    const cwd = resolveTargetPath(args.cwd &#124;&#124; args.workdir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 358 | <code>    const guard = guardPath(cwd, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 359 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 360 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 361 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>    const result = await runExecFile('git', gitArgs, { cwd, timeout: normalizeNumber(args.timeoutMs, 30000, 1000, 300000) });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 363 | <code>    if (!result.ok &amp;&amp; ![0, 1].includes(result.exitCode)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 364 | <code>        return createErrorResult('error', result.stderr &#124;&#124; result.error &#124;&#124; 'git 执行失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 365 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 366 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 367 | <code>            exitCode: result.exitCode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 368 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>    const text = result.stdout &#124;&#124; result.stderr;</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 371 | <code>    return createTextResult(text, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 372 | <code>        status: result.ok &#124;&#124; result.exitCode === 1 ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 373 | <code>        action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 374 | <code>        cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 375 | <code>        exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 376 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 377 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 378 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>async function actionGitCommit(args, context, runtime) {</code> | 定义函数 `actionGitCommit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 382 | <code>    const approval = approvalRequired('git_commit', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 383 | <code>    if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 384 | <code>        return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 385 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>    const message = normalizeString(args.message &#124;&#124; args.m);</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 387 | <code>    if (!message) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 388 | <code>        return createErrorResult('needs_config', 'git_commit 需要 message 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 389 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 390 | <code>    const cwd = resolveTargetPath(args.cwd &#124;&#124; args.workdir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 391 | <code>    const guard = guardPath(cwd, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 392 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 393 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 394 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 396 | <code>        return createTextResult(JSON.stringify({ action: 'git_commit', dryRun: true, cwd, message }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 397 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 398 | <code>            action: 'git_commit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 399 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 400 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 401 | <code>            message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 402 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 404 | <code>    const result = await runExecFile('git', ['commit', '-m', message], { cwd, timeout: normalizeNumber(args.timeoutMs, 30000, 1000, 300000) });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 405 | <code>    if (!result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 406 | <code>        return createErrorResult('error', result.stderr &#124;&#124; result.error &#124;&#124; 'git commit 失败。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 407 | <code>            action: 'git_commit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 408 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 409 | <code>            exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 410 | <code>            stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 411 | <code>            stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 412 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>    return createTextResult(result.stdout &#124;&#124; result.stderr, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 415 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 416 | <code>        action: 'git_commit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 417 | <code>        cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 418 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 419 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 420 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>async function actionSearch(args, context, runtime) {</code> | 定义函数 `actionSearch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 424 | <code>    const root = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 425 | <code>    const guard = guardPath(root, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 426 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 427 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 428 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>    const query = normalizeString(args.query &#124;&#124; args.text &#124;&#124; args.contains &#124;&#124; args.name);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 430 | <code>    if (!query) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 431 | <code>        return createErrorResult('needs_config', 'code.search 需要 query/text/name 参数。');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 432 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>    const limit = normalizeNumber(args.limit, DEFAULT_LIMIT, 1, 2000);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 434 | <code>    const byName = normalizeBoolean(args.byName, Boolean(args.name));</code> | 声明局部标识符 `byName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 435 | <code>    if (!byName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 436 | <code>        const rg = await runExecFile('rg', ['--json', '--max-count', String(limit), query, root], { cwd: root, timeout: 30000 });</code> | 声明局部标识符 `rg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 437 | <code>        if (rg.ok &#124;&#124; rg.exitCode === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 438 | <code>            const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 439 | <code>            for (const line of rg.stdout.split(/\r?\n/)) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 440 | <code>                if (!line.trim()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 441 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 442 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 444 | <code>                    const event = JSON.parse(line);</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 445 | <code>                    if (event.type === 'match') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 446 | <code>                        matches.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 447 | <code>                            path: event.data?.path?.text &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 448 | <code>                            line: event.data?.line_number &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 449 | <code>                            text: event.data?.lines?.text &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 450 | <code>                        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>                } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 453 | <code>                if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 454 | <code>                    break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 455 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 456 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 457 | <code>            return createTextResult(JSON.stringify({ action: 'search', root, query, matches }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 458 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 459 | <code>                action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 460 | <code>                root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 461 | <code>                query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 462 | <code>                matches</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 463 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>    const { files, errors } = await walkCodeFiles(root, args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 468 | <code>    const matches = [];</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 469 | <code>    const regex = new RegExp(query.replace(/[.+^${}()&#124;[\]\\]/g, '\\$&amp;'), 'i');</code> | 声明局部标识符 `regex`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 470 | <code>    for (const file of files) {</code> | 声明局部标识符 `file`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 471 | <code>        if (byName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 472 | <code>            if (regex.test(path.basename(file.path)) &#124;&#124; regex.test(file.relativePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 473 | <code>                matches.push(file);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 474 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 475 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 476 | <code>            const text = await fsp.readFile(file.path, 'utf8').catch(() =&gt; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 477 | <code>            const lines = text.split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 478 | <code>            for (let index = 0; index &lt; lines.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 479 | <code>                if (regex.test(lines[index])) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 480 | <code>                    matches.push({ path: file.path, line: index + 1, text: lines[index] });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 481 | <code>                    break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 482 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>        if (matches.length &gt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 486 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 487 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 488 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>    return createTextResult(JSON.stringify({ action: 'search', root, query, matches, errors }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 490 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 491 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 492 | <code>        root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 493 | <code>        query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 494 | <code>        matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 495 | <code>        errors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 496 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 497 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 499 | <code>async function actionIndex(args, context, runtime) {</code> | 定义函数 `actionIndex`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 500 | <code>    const root = resolveTargetPath(args.path &#124;&#124; args.dir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 501 | <code>    const guard = guardPath(root, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 502 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 503 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 504 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>    const { files, errors } = await walkCodeFiles(root, args);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 506 | <code>    const includeSymbols = normalizeBoolean(args.includeSymbols, args.action === 'semantic_index');</code> | 声明局部标识符 `includeSymbols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 507 | <code>    const symbols = [];</code> | 声明局部标识符 `symbols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 508 | <code>    if (includeSymbols) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 509 | <code>        for (const file of files) {</code> | 声明局部标识符 `file`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 510 | <code>            if (!/\.[cm]?[jt]sx?$/i.test(file.path)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 511 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 512 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 513 | <code>            const text = await fsp.readFile(file.path, 'utf8').catch(() =&gt; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 514 | <code>            if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 515 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 516 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 517 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 518 | <code>                symbols.push(...extractSymbolsFromAst(parseSource(text, file.path), file.path));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 519 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 520 | <code>                errors.push({ path: file.path, error: error?.message &#124;&#124; String(error) });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 521 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 522 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>    const index = {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 525 | <code>        action: includeSymbols ? 'semantic_index' : 'index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 526 | <code>        root,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 527 | <code>        generatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 528 | <code>        count: files.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 529 | <code>        files,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 530 | <code>        symbols,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 531 | <code>        errors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 532 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 533 | <code>    return createTextResult(JSON.stringify(index, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 534 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 535 | <code>        ...index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 536 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 537 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>async function actionSymbols(args, context, runtime) {</code> | 定义函数 `actionSymbols`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 540 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.file, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 541 | <code>    const guard = guardPath(target, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 542 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 543 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 544 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 545 | <code>    const text = await fsp.readFile(target, 'utf8').catch(() =&gt; null);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 546 | <code>    if (text === null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 547 | <code>        return createErrorResult('not_found', `代码文件不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 548 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 549 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 550 | <code>        const symbols = extractSymbolsFromAst(parseSource(text, target), target);</code> | 声明局部标识符 `symbols`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 551 | <code>        return createTextResult(JSON.stringify({ action: 'symbols', path: target, symbols }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 552 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 553 | <code>            action: 'symbols',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 554 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 555 | <code>            symbols</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 556 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 558 | <code>        return createErrorResult('parse_error', error?.message &#124;&#124; String(error), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 559 | <code>            action: 'symbols',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 560 | <code>            path: target</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 561 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 562 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 565 | <code>async function actionRenameSymbol(args, context, runtime) {</code> | 定义函数 `actionRenameSymbol`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 566 | <code>    const approval = approvalRequired('rename_symbol', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 567 | <code>    if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 568 | <code>        return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 569 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.file, runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 571 | <code>    const guard = guardPath(target, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 572 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 573 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 574 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>    const from = normalizeString(args.from &#124;&#124; args.oldName &#124;&#124; args.symbol);</code> | 声明局部标识符 `from`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 576 | <code>    const to = normalizeString(args.to &#124;&#124; args.newName);</code> | 声明局部标识符 `to`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 577 | <code>    if (!from &#124;&#124; !to &#124;&#124; !/^[$A-Z_a-z][$\w]*$/.test(from) &#124;&#124; !/^[$A-Z_a-z][$\w]*$/.test(to)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 578 | <code>        return createErrorResult('needs_config', 'rename_symbol 需要合法的 from/to 标识符。', { from, to });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 579 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>    const source = await fsp.readFile(target, 'utf8').catch(() =&gt; null);</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 581 | <code>    if (source === null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 582 | <code>        return createErrorResult('not_found', `代码文件不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 583 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 584 | <code>    const ast = parseSource(source, target);</code> | 声明局部标识符 `ast`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 585 | <code>    let replacements = 0;</code> | 声明局部标识符 `replacements`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 586 | <code>    traverse(ast, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 587 | <code>        Identifier(nodePath) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 588 | <code>            if (nodePath.node.name === from) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 589 | <code>                nodePath.node.name = to;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 590 | <code>                replacements += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 591 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>    const output = generate(ast, { retainLines: true, comments: true }, source).code;</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 595 | <code>    const details = {</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 596 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 597 | <code>        action: 'rename_symbol',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 598 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 599 | <code>        from,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 600 | <code>        to,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 601 | <code>        replacements,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 602 | <code>        dryRun: args.dryRun === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 603 | <code>        output: args.dryRun === true ? output : undefined</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 604 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 605 | <code>    if (args.dryRun !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 606 | <code>        await fsp.writeFile(target, output, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 607 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 608 | <code>    return createTextResult(JSON.stringify(details, null, 2), details);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 609 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>async function actionLspStatus(args, context, runtime) {</code> | 定义函数 `actionLspStatus`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 612 | <code>    const cwd = resolveTargetPath(args.cwd &#124;&#124; '.', runtime);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 613 | <code>    const guard = guardPath(cwd, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 614 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 615 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 616 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>    const version = ts.version;</code> | 声明局部标识符 `version`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 618 | <code>    const tls = await runExecFile(process.platform === 'win32' ? 'where.exe' : 'which', ['typescript-language-server'], { timeout: 5000 });</code> | 声明局部标识符 `tls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 619 | <code>    return createTextResult(JSON.stringify({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 620 | <code>        action: 'lsp_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 621 | <code>        typescriptVersion: version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 622 | <code>        typescriptLanguageServerAvailable: tls.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 623 | <code>        binaryLookup: tls.stdout &#124;&#124; tls.stderr &#124;&#124; tls.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 624 | <code>    }, null, 2), {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 625 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 626 | <code>        action: 'lsp_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 627 | <code>        typescriptVersion: version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 628 | <code>        typescriptLanguageServerAvailable: tls.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 629 | <code>        binaryLookup: tls.stdout &#124;&#124; tls.stderr &#124;&#124; tls.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 630 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 631 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 633 | <code>async function actionLspDiagnostics(args, context, runtime) {</code> | 定义函数 `actionLspDiagnostics`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 634 | <code>    const target = resolveTargetPath(args.path &#124;&#124; args.file &#124;&#124; '.', runtime);</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 635 | <code>    const guard = guardPath(target, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 636 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 637 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 638 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 639 | <code>    const stat = await safeStat(target);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 640 | <code>    if (!stat) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 641 | <code>        return createErrorResult('not_found', `路径不存在：${target}`, { path: target });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 642 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 643 | <code>    if (stat.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 644 | <code>        const result = await runExecFile('npx', ['tsc', '--noEmit', '--pretty', 'false'], {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 645 | <code>            cwd: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 646 | <code>            timeout: normalizeNumber(args.timeoutMs, 60000, 1000, 300000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 647 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>        return createTextResult(result.stdout &#124;&#124; result.stderr &#124;&#124; 'tsc completed', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 649 | <code>            status: result.ok ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 650 | <code>            action: 'lsp_diagnostics',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 651 | <code>            path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 652 | <code>            exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 653 | <code>            stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 654 | <code>            stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 655 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 657 | <code>    const source = await fsp.readFile(target, 'utf8');</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 658 | <code>    const output = ts.transpileModule(source, {</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 659 | <code>        compilerOptions: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 660 | <code>            jsx: ts.JsxEmit.ReactJSX,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 661 | <code>            module: ts.ModuleKind.ESNext,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 662 | <code>            target: ts.ScriptTarget.ES2022</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 663 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 664 | <code>        fileName: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 665 | <code>        reportDiagnostics: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 666 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 667 | <code>    const diagnostics = (output.diagnostics &#124;&#124; []).map((diagnostic) =&gt; {</code> | 声明局部标识符 `diagnostics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 668 | <code>        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 669 | <code>        const loc = diagnostic.file &amp;&amp; typeof diagnostic.start === 'number'</code> | 声明局部标识符 `loc`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 670 | <code>            ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 671 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 672 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 673 | <code>            code: diagnostic.code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 674 | <code>            category: ts.DiagnosticCategory[diagnostic.category],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 675 | <code>            message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 676 | <code>            line: loc ? loc.line + 1 : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 677 | <code>            column: loc ? loc.character + 1 : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 678 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>    return createTextResult(JSON.stringify({ action: 'lsp_diagnostics', path: target, diagnostics }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 681 | <code>        status: diagnostics.length ? 'error' : 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 682 | <code>        action: 'lsp_diagnostics',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 683 | <code>        path: target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 684 | <code>        diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 685 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 688 | <code>async function actionTest(args, context, runtime) {</code> | 定义函数 `actionTest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 689 | <code>    const approval = approvalRequired('test', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 690 | <code>    if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 691 | <code>        return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 692 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 693 | <code>    const cwd = resolveTargetPath(args.cwd &#124;&#124; args.workdir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 694 | <code>    const guard = guardPath(cwd, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 695 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 696 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 697 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 698 | <code>    const script = normalizeString(args.script &#124;&#124; args.command, 'test');</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 699 | <code>    const runner = normalizeString(args.runner, 'pnpm');</code> | 声明局部标识符 `runner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 700 | <code>    const commandArgs = runner === 'npm' ? ['run', script] : ['run', script];</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 701 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 702 | <code>        return createTextResult(JSON.stringify({ action: 'test', dryRun: true, cwd, runner, script }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 703 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 704 | <code>            action: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 705 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 706 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 707 | <code>            runner,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 708 | <code>            script</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 709 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 710 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>    const result = await runExecFile(runner, commandArgs, { cwd, timeout: normalizeNumber(args.timeoutMs, 120000, 1000, 30 * 60 * 1000) });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 712 | <code>    return createTextResult(result.stdout &#124;&#124; result.stderr, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 713 | <code>        status: result.ok ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 714 | <code>        action: 'test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 715 | <code>        cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 716 | <code>        runner,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 717 | <code>        script,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 718 | <code>        exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 719 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 720 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 721 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 723 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 724 | <code>async function actionCiStatus(args, context, runtime) {</code> | 定义函数 `actionCiStatus`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 725 | <code>    const cwd = resolveTargetPath(args.cwd &#124;&#124; args.workdir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 726 | <code>    const guard = guardPath(cwd, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 727 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 728 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 729 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>    const ghCheck = await runExecFile(process.platform === 'win32' ? 'where.exe' : 'which', ['gh'], { timeout: 5000 });</code> | 声明局部标识符 `ghCheck`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 731 | <code>    if (!ghCheck.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 732 | <code>        return createErrorResult('needs_config', 'ci_status 需要安装并登录 GitHub CLI：gh。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 733 | <code>            action: 'ci_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 734 | <code>            lookup: ghCheck.stderr &#124;&#124; ghCheck.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 735 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 736 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 737 | <code>    const limit = String(normalizeNumber(args.limit, 10, 1, 100));</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 738 | <code>    const result = await runExecFile('gh', ['run', 'list', '--limit', limit], { cwd, timeout: 30000 });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 739 | <code>    return createTextResult(result.stdout &#124;&#124; result.stderr, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 740 | <code>        status: result.ok ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 741 | <code>        action: 'ci_status',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 742 | <code>        cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 743 | <code>        exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 744 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 745 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 746 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 747 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 749 | <code>async function actionPrCreate(args, context, runtime) {</code> | 定义函数 `actionPrCreate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 750 | <code>    const approval = approvalRequired('pr_create', args, context);</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 751 | <code>    if (approval) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 752 | <code>        return approval;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>    const cwd = resolveTargetPath(args.cwd &#124;&#124; args.workdir &#124;&#124; '.', runtime);</code> | 声明局部标识符 `cwd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 755 | <code>    const guard = guardPath(cwd, context, runtime);</code> | 声明局部标识符 `guard`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 756 | <code>    if (guard) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 757 | <code>        return guard;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 758 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 759 | <code>    const title = normalizeString(args.title);</code> | 声明局部标识符 `title`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 760 | <code>    const body = normalizeString(args.body);</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 761 | <code>    if (!title) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 762 | <code>        return createErrorResult('needs_config', 'pr_create 需要 title 参数。', { action: 'pr_create' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 763 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>    const ghCheck = await runExecFile(process.platform === 'win32' ? 'where.exe' : 'which', ['gh'], { timeout: 5000 });</code> | 声明局部标识符 `ghCheck`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 765 | <code>    if (!ghCheck.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 766 | <code>        return createErrorResult('needs_config', 'pr_create 需要安装并登录 GitHub CLI：gh。', {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 767 | <code>            action: 'pr_create',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 768 | <code>            lookup: ghCheck.stderr &#124;&#124; ghCheck.error</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 769 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 770 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 771 | <code>    if (args.dryRun === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 772 | <code>        return createTextResult(JSON.stringify({ action: 'pr_create', dryRun: true, cwd, title, body }, null, 2), {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 773 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 774 | <code>            action: 'pr_create',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 775 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 776 | <code>            cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 777 | <code>            title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 778 | <code>            body</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 779 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 780 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>    const prArgs = ['pr', 'create', '--title', title, '--body', body &#124;&#124; ''];</code> | 声明局部标识符 `prArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 782 | <code>    if (args.draft !== false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 783 | <code>        prArgs.push('--draft');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 784 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 785 | <code>    const result = await runExecFile('gh', prArgs, { cwd, timeout: 60000 });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 786 | <code>    return createTextResult(result.stdout &#124;&#124; result.stderr, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 787 | <code>        status: result.ok ? 'completed' : 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 788 | <code>        action: 'pr_create',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 789 | <code>        cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 790 | <code>        exitCode: result.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 791 | <code>        stdout: result.stdout,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 792 | <code>        stderr: result.stderr</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 793 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 794 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>async function executeCodeTool(args = {}, context = {}, runtime = {}) {</code> | 定义函数 `executeCodeTool`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 797 | <code>    const action = normalizeString(args.action &#124;&#124; args.operation &#124;&#124; args.intent, 'schema').toLowerCase();</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 798 | <code>    if (action === 'schema' &#124;&#124; action === 'help') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 799 | <code>        return await actionSchema(runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 800 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 801 | <code>    if (action === 'git_status' &#124;&#124; action === 'status') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 802 | <code>        return await actionGit(args, context, runtime, ['status', '--short', '--branch'], 'git_status');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 803 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 804 | <code>    if (action === 'git_diff' &#124;&#124; action === 'diff') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 805 | <code>        const diffArgs = ['diff'];</code> | 声明局部标识符 `diffArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 806 | <code>        if (args.staged === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 807 | <code>            diffArgs.push('--staged');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 808 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 809 | <code>        if (args.path) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 810 | <code>            diffArgs.push('--', args.path);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 811 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 812 | <code>        return await actionGit(args, context, runtime, diffArgs, 'git_diff');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 813 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 814 | <code>    if (action === 'git_log' &#124;&#124; action === 'log') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 815 | <code>        return await actionGit(args, context, runtime, ['log', '--oneline', '-n', String(normalizeNumber(args.limit, 10, 1, 200))], 'git_log');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 816 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 817 | <code>    if (action === 'git_branch' &#124;&#124; action === 'branch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 818 | <code>        return await actionGit(args, context, runtime, ['branch', '--show-current'], 'git_branch');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 819 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 820 | <code>    if (action === 'git_commit' &#124;&#124; action === 'commit') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 821 | <code>        return await actionGitCommit(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 822 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 823 | <code>    if (action === 'search') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 824 | <code>        return await actionSearch(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 825 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 826 | <code>    if (action === 'index' &#124;&#124; action === 'semantic_index') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 827 | <code>        return await actionIndex({ ...args, action }, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 828 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>    if (action === 'symbols' &#124;&#124; action === 'outline') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 830 | <code>        return await actionSymbols(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 831 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 832 | <code>    if (action === 'rename_symbol' &#124;&#124; action === 'ast_rename') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 833 | <code>        return await actionRenameSymbol(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 834 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 835 | <code>    if (action === 'lsp_status') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 836 | <code>        return await actionLspStatus(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 837 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 838 | <code>    if (action === 'lsp_diagnostics' &#124;&#124; action === 'diagnostics') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 839 | <code>        return await actionLspDiagnostics(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 840 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 841 | <code>    if (action === 'test' &#124;&#124; action === 'run_tests') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 842 | <code>        return await actionTest(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 843 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 844 | <code>    if (action === 'ci_status') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 845 | <code>        return await actionCiStatus(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 846 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 847 | <code>    if (action === 'pr_create' &#124;&#124; action === 'pull_request') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 848 | <code>        return await actionPrCreate(args, context, runtime);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 849 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 850 | <code>    return createErrorResult('needs_config', `不支持的 code action：${action}`, {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 851 | <code>        supportedActions: (await actionSchema(runtime)).details.schema.actions</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 852 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 854 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 855 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 856 | <code>    CODE_TOOL_ID,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 857 | <code>    executeCodeTool,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 858 | <code>    parseSource,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 859 | <code>    extractSymbolsFromAst</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 860 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
