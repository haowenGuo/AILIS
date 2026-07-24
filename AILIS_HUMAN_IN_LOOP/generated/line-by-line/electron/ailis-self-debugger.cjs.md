# electron/ailis-self-debugger.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。
- 文件类型：`source-code`
- 原始行数：821
- SHA-256：`25006a551c7e6cf79314428e98879a338047c9cf3cd06ddea3612177dfe417a0`
- 可运行副本：[打开源文件](../../../source/electron/ailis-self-debugger.cjs)
- 依赖：`fs`、`fs/promises`、`path`、`crypto`、`./ailis-tool-contracts.cjs`
- 主要符号：`fs`、`fsp`、`path`、`SELF_DEBUGGER_ACTIONS`、`DEFAULT_MAX_FILE_CHARS`、`DEFAULT_MAX_TRANSCRIPT_ITEMS`、`DEFAULT_MAX_LOG_CHARS`、`normalizeString`、`trimmed`、`normalizeAction`、`normalizeArray`、`isPlainObject`、`cloneJson`、`safeSegment`、`clampText`、`text`、`formatToolResult`、`readJsonFile`、`raw`、`writeJsonFileAtomic`、`tmpPath`、`pathExists`、`resolveInside`、`base`、`resolved`、`relative`、`redactText`、`inferValidationCommands`、`cap`、`files`、`buildSourceHints`、`hints`、`walkFiles`、`maxFiles`、`maxDepth`、`results`、`queue`、`current`、`entries`、`fullPath`、`AILISSelfDebugger`、`action`、`state`、`next`、`id`、`bugReport`、`now`、`affectedCapability`、`sourceHints`、`debugCase`、`status`、`cases`、`transcriptPath`、`items`、`candidates`、`logs`、`evidence`、`filePath`、`stat`、`opened`、`transcript`、`health`、`registry`、`collected`、`validationCommands`、`missingEvidence`、`diagnosis`、`diagnosed`、`candidateDiff`、`candidatePatchPath`、`repairProposal`、`repair`、`proposal`、`validation`、`result`、`proposed`、`validated`、`applied`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 3 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 4 | <code>const { randomUUID } = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 5 | <code>const { getToolContractPromptText } = require('./ailis-tool-contracts.cjs');</code> | 导入依赖 `./ailis-tool-contracts.cjs`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const SELF_DEBUGGER_ACTIONS = Object.freeze([</code> | 声明局部标识符 `SELF_DEBUGGER_ACTIONS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 8 | <code>    'schema',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 9 | <code>    'open_case',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 10 | <code>    'create_case',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 11 | <code>    'list_cases',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 12 | <code>    'get_case',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 13 | <code>    'collect_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 14 | <code>    'diagnose',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 15 | <code>    'propose_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 16 | <code>    'validate_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 17 | <code>    'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 18 | <code>    'run_loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 19 | <code>    'mark_case',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 20 | <code>    'close_case'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 21 | <code>]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>const DEFAULT_MAX_FILE_CHARS = 18000;</code> | 声明局部标识符 `DEFAULT_MAX_FILE_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 24 | <code>const DEFAULT_MAX_TRANSCRIPT_ITEMS = 80;</code> | 声明局部标识符 `DEFAULT_MAX_TRANSCRIPT_ITEMS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 25 | <code>const DEFAULT_MAX_LOG_CHARS = 20000;</code> | 声明局部标识符 `DEFAULT_MAX_LOG_CHARS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>function normalizeString(value, fallback = '') {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 28 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 29 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 30 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 32 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>function normalizeAction(value, fallback = 'open_case') {</code> | 定义函数 `normalizeAction`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 36 | <code>    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>function normalizeArray(value) {</code> | 定义函数 `normalizeArray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 40 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 41 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 42 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>    return Array.isArray(value) ? value : [value];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 44 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 45 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 46 | <code>function isPlainObject(value) {</code> | 定义函数 `isPlainObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 47 | <code>    return Boolean(value &amp;&amp; typeof value === 'object' &amp;&amp; !Array.isArray(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 51 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 52 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 54 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>function safeSegment(value, fallback = 'case') {</code> | 定义函数 `safeSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 59 | <code>    return normalizeString(value, fallback)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 60 | <code>        .replace(/[^a-zA-Z0-9._-]+/g, '-')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 61 | <code>        .replace(/^-+&#124;-+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 62 | <code>        .slice(0, 90) &#124;&#124; fallback;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 63 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>function clampText(value, maxChars = DEFAULT_MAX_FILE_CHARS) {</code> | 定义函数 `clampText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 66 | <code>    const text = typeof value === 'string' ? value : JSON.stringify(value &#124;&#124; '', null, 2);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 67 | <code>    if (text.length &lt;= maxChars) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 68 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 69 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>    return `${text.slice(0, maxChars)}\n...[truncated ${text.length - maxChars} chars]`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 71 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>function formatToolResult(payload, isError = false) {</code> | 定义函数 `formatToolResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 74 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>        content: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 76 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 77 | <code>                type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 78 | <code>                text: JSON.stringify(payload, null, 2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 79 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 81 | <code>        details: payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 82 | <code>        isError</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 83 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>async function readJsonFile(filePath, fallback) {</code> | 定义函数 `readJsonFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 87 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 88 | <code>        const raw = await fsp.readFile(filePath, 'utf8');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 89 | <code>        return JSON.parse(raw &#124;&#124; '{}');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 90 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 91 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 92 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>async function writeJsonFileAtomic(filePath, value) {</code> | 定义函数 `writeJsonFileAtomic`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 96 | <code>    await fsp.mkdir(path.dirname(filePath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 97 | <code>    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;</code> | 声明局部标识符 `tmpPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 98 | <code>    await fsp.writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 99 | <code>    await fsp.rename(tmpPath, filePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 100 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 101 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 102 | <code>async function pathExists(filePath) {</code> | 定义函数 `pathExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 103 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 104 | <code>        await fsp.access(filePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 105 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 106 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 107 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 108 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>function resolveInside(root, value, label = 'path') {</code> | 定义函数 `resolveInside`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 112 | <code>    const base = path.resolve(root);</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 113 | <code>    const resolved = path.isAbsolute(String(value &#124;&#124; ''))</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 114 | <code>        ? path.resolve(String(value &#124;&#124; ''))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 115 | <code>        : path.resolve(base, String(value &#124;&#124; ''));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 116 | <code>    const relative = path.relative(base, resolved);</code> | 声明局部标识符 `relative`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 117 | <code>    if (relative.startsWith('..') &#124;&#124; path.isAbsolute(relative)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 118 | <code>        throw new Error(`${label} is outside allowed root: ${resolved}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 119 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>    return resolved;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 121 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>function redactText(text = '') {</code> | 定义函数 `redactText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 124 | <code>    return String(text &#124;&#124; '')</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 125 | <code>        .replace(/(api[_-]?key&#124;token&#124;password&#124;secret&#124;authorization&#124;credential)(["'\s:=]+)([^\s"',}]+)/gi, '$1$2__REDACTED__')</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 126 | <code>        .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer __REDACTED__');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function inferValidationCommands({ affectedCapability = '', sourceHints = [] } = {}) {</code> | 定义函数 `inferValidationCommands`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 130 | <code>    const cap = normalizeString(affectedCapability).toLowerCase();</code> | 声明局部标识符 `cap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 131 | <code>    const files = normalizeArray(sourceHints).join(' ').toLowerCase();</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 132 | <code>    if (cap.includes('vision') &#124;&#124; files.includes('vision')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 133 | <code>        return ['pnpm test:ailis-agent', 'pnpm ailis:tool-doctor:plan'];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>    if (cap.includes('mcp') &#124;&#124; files.includes('mcp')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 136 | <code>        return ['pnpm ailis:mcp-soak', 'pnpm test:ailis-runtime'];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 137 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>    if (cap.includes('capability') &#124;&#124; files.includes('capability')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 139 | <code>        return ['pnpm test:ailis-capability-manager', 'pnpm ailis:tool-doctor:plan'];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 141 | <code>    if (cap.includes('skill') &#124;&#124; files.includes('skill')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 142 | <code>        return ['pnpm test:ailis-skills', 'pnpm ailis:validate-harness'];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 143 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>    return ['pnpm ailis:validate-harness', 'pnpm ailis:tool-doctor:plan'];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>function buildSourceHints({ affectedCapability = '', bugReport = '', sourceHints = [] } = {}) {</code> | 定义函数 `buildSourceHints`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 148 | <code>    const hints = new Set(normalizeArray(sourceHints).map(String).filter(Boolean));</code> | 声明局部标识符 `hints`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 149 | <code>    const text = `${affectedCapability} ${bugReport}`.toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 150 | <code>    if (/vision&#124;截图&#124;screen&#124;capture/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 151 | <code>        hints.add('electron/ailis-agent-runner.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 152 | <code>        hints.add('electron/ailis-gateway.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 153 | <code>        hints.add('src/ailis-chat-service.js');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 154 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 155 | <code>    if (/mcp&#124;server&#124;tool/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>        hints.add('electron/ailis-mcp-session.cjs');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 157 | <code>        hints.add('electron/ailis-runtime.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 158 | <code>        hints.add('electron/ailis-tool-contracts.cjs');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 159 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    if (/capability&#124;安装&#124;skill&#124;repair&#124;修复/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 161 | <code>        hints.add('electron/ailis-capability-manager.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 162 | <code>        hints.add('electron/ailis-tool-doctor.cjs');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 163 | <code>        hints.add('electron/ailis-skills.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 164 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    if (/agent&#124;loop&#124;执行&#124;任务/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 166 | <code>        hints.add('electron/ailis-agent-runner.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 167 | <code>        hints.add('electron/ailis-runtime.cjs');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 168 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>    return [...hints];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 170 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 171 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 172 | <code>async function walkFiles(root, options = {}) {</code> | 定义函数 `walkFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 173 | <code>    const maxFiles = Number(options.maxFiles &#124;&#124; 400);</code> | 声明局部标识符 `maxFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 174 | <code>    const maxDepth = Number(options.maxDepth &#124;&#124; 5);</code> | 声明局部标识符 `maxDepth`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 175 | <code>    const results = [];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 176 | <code>    const queue = [{ dir: root, depth: 0 }];</code> | 声明局部标识符 `queue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 177 | <code>    while (queue.length &amp;&amp; results.length &lt; maxFiles) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 178 | <code>        const current = queue.shift();</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 179 | <code>        let entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 180 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 181 | <code>            entries = await fsp.readdir(current.dir, { withFileTypes: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 182 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 183 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 184 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 185 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 186 | <code>            if (results.length &gt;= maxFiles) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 187 | <code>                break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 188 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>            if (['node_modules', '.git', 'dist', 'release', 'build-cache'].includes(entry.name)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 190 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 191 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>            const fullPath = path.join(current.dir, entry.name);</code> | 声明局部标识符 `fullPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 193 | <code>            if (entry.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 194 | <code>                if (current.depth &lt; maxDepth) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 195 | <code>                    queue.push({ dir: fullPath, depth: current.depth + 1 });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 196 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 198 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>            results.push(fullPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 200 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>    return results;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 203 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>class AILISSelfDebugger {</code> | 定义类 `AILISSelfDebugger`，把相关状态与行为收拢为一个运行时对象。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 206 | <code>    constructor(options = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 207 | <code>        this.workspaceRoot = path.resolve(options.workspaceRoot &#124;&#124; process.cwd());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 208 | <code>        this.projectRoot = path.resolve(options.projectRoot &#124;&#124; this.workspaceRoot);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 209 | <code>        this.auditDir = path.resolve(options.auditDir &#124;&#124; path.join(this.projectRoot, '.ailis-state'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 210 | <code>        this.stateDir = path.resolve(options.stateDir &#124;&#124; path.join(this.auditDir, 'self-debug'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 211 | <code>        this.casesPath = path.join(this.stateDir, 'cases.json');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 212 | <code>        this.transcriptDir = path.join(this.auditDir, 'transcripts');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 213 | <code>        this.toolDoctor = options.toolDoctor &#124;&#124; null;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 214 | <code>        this.capabilityManager = options.capabilityManager &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 215 | <code>        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () =&gt; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 218 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 219 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 220 | <code>            enabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 221 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 222 | <code>            stateDir: this.stateDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 223 | <code>            casesPath: this.casesPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 224 | <code>            actions: [...SELF_DEBUGGER_ACTIONS]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 225 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>    async execute(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 229 | <code>        const action = normalizeAction(args.action &#124;&#124; args.operation &#124;&#124; args.intent, 'open_case');</code> | 声明局部标识符 `action`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 230 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 231 | <code>            if (action === 'schema') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 232 | <code>                return formatToolResult(this.buildSchema());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 233 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 234 | <code>            if (['open_case', 'create_case'].includes(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 235 | <code>                return formatToolResult(await this.openCase(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 236 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>            if (action === 'list_cases') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 238 | <code>                return formatToolResult(await this.listCases(args));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 239 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>            if (action === 'get_case') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 241 | <code>                return formatToolResult(await this.getCaseResult(args));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 242 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>            if (action === 'collect_evidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 244 | <code>                return formatToolResult(await this.collectEvidence(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 245 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>            if (action === 'diagnose') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>                return formatToolResult(await this.diagnose(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 248 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 249 | <code>            if (action === 'propose_patch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 250 | <code>                return formatToolResult(await this.proposePatch(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 251 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>            if (action === 'validate_patch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 253 | <code>                return formatToolResult(await this.validatePatch(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 254 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>            if (action === 'apply_patch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 256 | <code>                return formatToolResult(await this.applyPatch(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 257 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>            if (action === 'run_loop') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 259 | <code>                return formatToolResult(await this.runLoop(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 260 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>            if (['mark_case', 'close_case'].includes(action)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 262 | <code>                return formatToolResult(await this.markCase(args, context));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 263 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>            return formatToolResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 265 | <code>                status: 'unsupported_action',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 266 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 267 | <code>                supportedActions: [...SELF_DEBUGGER_ACTIONS]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 268 | <code>            }, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 269 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 270 | <code>            return formatToolResult({</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 271 | <code>                status: 'error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 272 | <code>                action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 273 | <code>                error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 274 | <code>            }, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 275 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>    buildSchema() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 279 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 280 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 281 | <code>            tool: 'self_debugger',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 282 | <code>            contract: getToolContractPromptText('self_debugger') &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 283 | <code>            protocol: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 284 | <code>                'Open a self-debug case from user bug feedback.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 285 | <code>                'Collect trace, log, source, registry, and health evidence before patching.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 286 | <code>                'Create a diagnosis packet and patch proposal instead of guessing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 287 | <code>                'Validate/apply repair patches only through Capability Manager, with rollback on validation failure.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 288 | <code>                'Return a user-facing summary separately from raw evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 289 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 290 | <code>            actions: [...SELF_DEBUGGER_ACTIONS]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 291 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>    async loadCases() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 295 | <code>        const state = await readJsonFile(this.casesPath, null);</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 296 | <code>        if (state &amp;&amp; state.version === 1 &amp;&amp; Array.isArray(state.cases)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 297 | <code>            return state;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 298 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 299 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 300 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 301 | <code>            createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 302 | <code>            updatedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 303 | <code>            cases: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 304 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 307 | <code>    async saveCases(state) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 308 | <code>        const next = {</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 309 | <code>            version: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 310 | <code>            createdAt: state.createdAt &#124;&#124; new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 311 | <code>            updatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 312 | <code>            cases: Array.isArray(state.cases) ? state.cases : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 313 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>        await writeJsonFileAtomic(this.casesPath, next);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 315 | <code>        return next;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 316 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>    async upsertCase(debugCase) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 319 | <code>        const state = await this.loadCases();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 320 | <code>        const next = state.cases.filter((entry) =&gt; entry.id !== debugCase.id);</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 321 | <code>        next.push(debugCase);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 322 | <code>        await this.saveCases({ ...state, cases: next.sort((a, b) =&gt; a.createdAt.localeCompare(b.createdAt)) });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 323 | <code>        return debugCase;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 324 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>    async getCase(caseId) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 327 | <code>        const id = normalizeString(caseId);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 328 | <code>        if (!id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 329 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 330 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>        const state = await this.loadCases();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 332 | <code>        return state.cases.find((entry) =&gt; entry.id === id) &#124;&#124; null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 333 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 335 | <code>    async openCase(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 336 | <code>        const bugReport = normalizeString(args.bugReport &#124;&#124; args.report &#124;&#124; args.message &#124;&#124; args.summary);</code> | 声明局部标识符 `bugReport`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 337 | <code>        if (!bugReport) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 338 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>                status: 'invalid_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 340 | <code>                error: 'self_debugger.open_case requires bugReport/report/message'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 341 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>        const now = new Date().toISOString();</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 344 | <code>        const affectedCapability = normalizeString(args.affectedCapability &#124;&#124; args.capability &#124;&#124; args.area &#124;&#124; '');</code> | 声明局部标识符 `affectedCapability`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 345 | <code>        const sourceHints = buildSourceHints({</code> | 声明局部标识符 `sourceHints`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 346 | <code>            affectedCapability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 347 | <code>            bugReport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 348 | <code>            sourceHints: args.sourceHints &#124;&#124; args.files</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 349 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>        const debugCase = {</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 351 | <code>            id: normalizeString(args.caseId &#124;&#124; args.id, `debug-${safeSegment(affectedCapability &#124;&#124; bugReport)}-${randomUUID().slice(0, 8)}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 352 | <code>            status: 'open',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 353 | <code>            phase: 'case_opened',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 354 | <code>            createdAt: now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 355 | <code>            updatedAt: now,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 356 | <code>            bugReport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 357 | <code>            affectedCapability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 358 | <code>            recentRunId: normalizeString(args.recentRunId &#124;&#124; args.runId &#124;&#124; context.runId),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 359 | <code>            sessionId: normalizeString(args.sessionId &#124;&#124; context.sessionId &#124;&#124; context.sessionKey),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 360 | <code>            sourceHints,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 361 | <code>            symptoms: normalizeArray(args.symptoms).map(String),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 362 | <code>            risk: normalizeString(args.risk, 'high'),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 363 | <code>            evidence: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 364 | <code>            diagnosis: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 365 | <code>            repairProposal: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 366 | <code>            validation: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 367 | <code>            repairResult: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 368 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>        await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 370 | <code>        this.emitGatewayEvent('self_debug.case.opened', {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 371 | <code>            caseId: debugCase.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 372 | <code>            affectedCapability: debugCase.affectedCapability</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 373 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 374 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 375 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 376 | <code>            case: debugCase,</code> | 多分支标签：定义 switch 结构中的一个具体处理入口。 |
| 377 | <code>            nextAction: 'collect_evidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 378 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 381 | <code>    async listCases(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 382 | <code>        const state = await this.loadCases();</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 383 | <code>        const status = normalizeString(args.status);</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 384 | <code>        const cases = state.cases</code> | 声明局部标识符 `cases`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 385 | <code>            .filter((entry) =&gt; !status &#124;&#124; entry.status === status)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 386 | <code>            .slice(-(Number(args.limit &#124;&#124; 50)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 387 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 388 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 389 | <code>            casesPath: this.casesPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 390 | <code>            caseCount: cases.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 391 | <code>            cases</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 392 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 395 | <code>    async getCaseResult(args = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 396 | <code>        const debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 397 | <code>        if (!debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 398 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 399 | <code>                status: 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 400 | <code>                caseId: normalizeString(args.caseId &#124;&#124; args.id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 401 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 404 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 405 | <code>            case: debugCase</code> | 多分支标签：定义 switch 结构中的一个具体处理入口。 |
| 406 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>    async locateTranscript(runId = '') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 410 | <code>        const id = normalizeString(runId);</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 411 | <code>        if (!id &#124;&#124; !(await pathExists(this.transcriptDir))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 412 | <code>            return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 413 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>        const files = await walkFiles(this.transcriptDir, { maxFiles: 1000, maxDepth: 4 });</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 415 | <code>        return files.find((file) =&gt; path.basename(file) === `${safeSegment(id, id)}.jsonl`) &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 416 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 418 | <code>    async readTranscriptEvidence(runId, maxItems = DEFAULT_MAX_TRANSCRIPT_ITEMS) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 419 | <code>        const transcriptPath = await this.locateTranscript(runId);</code> | 声明局部标识符 `transcriptPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 420 | <code>        if (!transcriptPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 421 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 422 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 423 | <code>        const raw = await fsp.readFile(transcriptPath, 'utf8');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 424 | <code>        const items = raw</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 425 | <code>            .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 426 | <code>            .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 427 | <code>            .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 428 | <code>            .map((line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 429 | <code>                try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 430 | <code>                    return JSON.parse(line);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 431 | <code>                } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 432 | <code>                    return { raw: line };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 433 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>            .slice(-maxItems);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 436 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 437 | <code>            id: `transcript:${runId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 438 | <code>            type: 'transcript',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 439 | <code>            path: transcriptPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 440 | <code>            itemCount: items.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 441 | <code>            preview: items.map((item) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 442 | <code>                type: item.type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 443 | <code>                status: item.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 444 | <code>                tool: item.payload?.tool &#124;&#124; item.payload?.toolCall?.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 445 | <code>                summary: item.payload?.summary &#124;&#124; item.payload?.message &#124;&#124; item.payload?.displayText &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 446 | <code>            })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 447 | <code>            items</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 448 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 451 | <code>    async readLogEvidence(args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 452 | <code>        const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 453 | <code>            path.join(this.auditDir, 'audit.jsonl'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 454 | <code>            path.join(this.projectRoot, 'tmp', 'ailis-gateway', 'audit.jsonl')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 455 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 456 | <code>        const logs = [];</code> | 声明局部标识符 `logs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 457 | <code>        for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 458 | <code>            if (!(await pathExists(candidate))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 459 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 460 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>            const raw = await fsp.readFile(candidate, 'utf8');</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 462 | <code>            logs.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 463 | <code>                id: `log:${path.basename(candidate)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 464 | <code>                type: 'log',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 465 | <code>                path: candidate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 466 | <code>                preview: redactText(raw.slice(-Number(args.maxLogChars &#124;&#124; DEFAULT_MAX_LOG_CHARS)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 467 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>        return logs;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 470 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 472 | <code>    async readSourceEvidence(debugCase, args = {}) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 473 | <code>        const hints = buildSourceHints({</code> | 声明局部标识符 `hints`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 474 | <code>            affectedCapability: debugCase.affectedCapability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 475 | <code>            bugReport: debugCase.bugReport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 476 | <code>            sourceHints: normalizeArray(args.sourceHints &#124;&#124; args.files &#124;&#124; debugCase.sourceHints)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 477 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>        const evidence = [];</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 479 | <code>        for (const hint of hints.slice(0, Number(args.maxFiles &#124;&#124; 12))) {</code> | 声明局部标识符 `hint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 480 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 481 | <code>                const filePath = resolveInside(this.projectRoot, hint, 'source hint');</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 482 | <code>                if (!(await pathExists(filePath))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 483 | <code>                    evidence.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 484 | <code>                        id: `source-missing:${hint}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 485 | <code>                        type: 'source_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 486 | <code>                        path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 487 | <code>                        summary: 'Source hint does not exist.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 488 | <code>                    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 490 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 491 | <code>                const stat = await fsp.stat(filePath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 492 | <code>                if (stat.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 493 | <code>                    continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 494 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>                const text = await fsp.readFile(filePath, 'utf8');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 496 | <code>                evidence.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 497 | <code>                    id: `source:${path.relative(this.projectRoot, filePath)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 498 | <code>                    type: 'source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 499 | <code>                    path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 500 | <code>                    bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 501 | <code>                    preview: redactText(clampText(text, Number(args.maxFileChars &#124;&#124; DEFAULT_MAX_FILE_CHARS)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 502 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 504 | <code>                evidence.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 505 | <code>                    id: `source-error:${hint}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 506 | <code>                    type: 'source_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 507 | <code>                    path: hint,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 508 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 509 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 510 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 512 | <code>        return evidence;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 513 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 515 | <code>    async collectEvidence(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 516 | <code>        let debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 517 | <code>        if (!debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 518 | <code>            const opened = await this.openCase(args, context);</code> | 声明局部标识符 `opened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 519 | <code>            debugCase = opened.case;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 520 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 521 | <code>        const evidence = [];</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 522 | <code>        const transcript = await this.readTranscriptEvidence(</code> | 声明局部标识符 `transcript`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 523 | <code>            normalizeString(args.recentRunId &#124;&#124; debugCase.recentRunId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 524 | <code>            Number(args.maxTranscriptItems &#124;&#124; DEFAULT_MAX_TRANSCRIPT_ITEMS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 525 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>        if (transcript) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 527 | <code>            evidence.push(transcript);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 528 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>        evidence.push(...await this.readLogEvidence(args));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 530 | <code>        evidence.push(...await this.readSourceEvidence(debugCase, args));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 531 | <code>        if (this.toolDoctor?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 532 | <code>            const health = await this.toolDoctor.execute({</code> | 声明局部标识符 `health`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 533 | <code>                action: 'health_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 534 | <code>                includeMcp: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 535 | <code>                timeoutMs: args.timeoutMs &#124;&#124; 5000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 536 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 537 | <code>            evidence.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 538 | <code>                id: 'tool_doctor:health_check',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 539 | <code>                type: 'tool_health',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 540 | <code>                status: health.details?.status &#124;&#124; 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 541 | <code>                preview: health.details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 542 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>        if (this.capabilityManager?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 545 | <code>            const registry = await this.capabilityManager.execute({</code> | 声明局部标识符 `registry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 546 | <code>                action: 'refresh_registry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 547 | <code>                includeHealth: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 548 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 549 | <code>            evidence.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 550 | <code>                id: 'capability_manager:registry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 551 | <code>                type: 'capability_registry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 552 | <code>                status: registry.details?.status &#124;&#124; 'unknown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 553 | <code>                capabilityCount: registry.details?.capabilityCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 554 | <code>                preview: registry.details?.capabilities &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 555 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>        debugCase.evidence = evidence;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 558 | <code>        debugCase.phase = 'evidence_collected';</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 559 | <code>        debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 560 | <code>        await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 561 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 562 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 563 | <code>            caseId: debugCase.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 564 | <code>            phase: debugCase.phase,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 565 | <code>            evidenceCount: evidence.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 566 | <code>            evidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 567 | <code>            nextAction: 'diagnose'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 568 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 569 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 571 | <code>    async diagnose(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 572 | <code>        let debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 573 | <code>        if (!debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 574 | <code>            const collected = await this.collectEvidence(args, context);</code> | 声明局部标识符 `collected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 575 | <code>            debugCase = await this.getCase(collected.caseId);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 576 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>        if (!debugCase.evidence?.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 578 | <code>            await this.collectEvidence({ ...args, caseId: debugCase.id }, context);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 579 | <code>            debugCase = await this.getCase(debugCase.id);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 580 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 581 | <code>        const validationCommands = normalizeArray(args.validationCommands).length</code> | 声明局部标识符 `validationCommands`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 582 | <code>            ? normalizeArray(args.validationCommands).map(String)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 583 | <code>            : inferValidationCommands({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 584 | <code>                affectedCapability: debugCase.affectedCapability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 585 | <code>                sourceHints: debugCase.sourceHints</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 586 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 587 | <code>        const missingEvidence = [];</code> | 声明局部标识符 `missingEvidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 588 | <code>        if (!debugCase.evidence.some((entry) =&gt; entry.type === 'source')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 589 | <code>            missingEvidence.push('source_excerpt');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 590 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>        if (!debugCase.evidence.some((entry) =&gt; entry.type === 'transcript')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 592 | <code>            missingEvidence.push('recent_transcript');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 593 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>        const diagnosis = {</code> | 声明局部标识符 `diagnosis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 595 | <code>            id: `diagnosis-${randomUUID().slice(0, 8)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 596 | <code>            status: missingEvidence.length ? 'needs_more_evidence' : 'ready_for_patch_proposal',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 597 | <code>            createdAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 598 | <code>            bugReport: debugCase.bugReport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 599 | <code>            affectedCapability: debugCase.affectedCapability,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 600 | <code>            evidenceIds: debugCase.evidence.map((entry) =&gt; entry.id),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 601 | <code>            missingEvidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 602 | <code>            suspectedFiles: debugCase.evidence</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 603 | <code>                .filter((entry) =&gt; entry.type === 'source')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 604 | <code>                .map((entry) =&gt; entry.path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 605 | <code>            validationCommands,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 606 | <code>            repairProtocol: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 607 | <code>                'Do not patch until evidence supports the suspected module.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 608 | <code>                'Generate a minimal unified diff candidate patch.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 609 | <code>                'Call self_debugger.validate_patch before applying.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 610 | <code>                'Call self_debugger.apply_patch only with approval; validation failure must roll back.'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 611 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>            promptForPatchAuthor: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 613 | <code>                'Use the evidence previews to propose the smallest patch.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 614 | <code>                'Do not edit unrelated behavior.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 615 | <code>                'Include tests or focused validation commands when possible.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 616 | <code>            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 617 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 618 | <code>        debugCase.diagnosis = diagnosis;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 619 | <code>        debugCase.phase = diagnosis.status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 620 | <code>        debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 621 | <code>        await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 622 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 623 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 624 | <code>            caseId: debugCase.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 625 | <code>            diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 626 | <code>            nextAction: diagnosis.status === 'ready_for_patch_proposal' ? 'propose_patch' : 'collect_evidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 627 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 630 | <code>    async proposePatch(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 631 | <code>        let debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 632 | <code>        if (!debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 633 | <code>            const diagnosed = await this.diagnose(args, context);</code> | 声明局部标识符 `diagnosed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 634 | <code>            debugCase = await this.getCase(diagnosed.caseId);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 635 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>        const candidateDiff = normalizeString(args.candidateDiff &#124;&#124; args.patch);</code> | 声明局部标识符 `candidateDiff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 637 | <code>        const candidatePatchPath = normalizeString(args.candidatePatchPath &#124;&#124; args.patchPath);</code> | 声明局部标识符 `candidatePatchPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 638 | <code>        if (!candidateDiff &amp;&amp; !candidatePatchPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 639 | <code>            debugCase.phase = 'needs_patch_proposal';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 640 | <code>            debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 641 | <code>            await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 642 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 643 | <code>                status: 'needs_patch_proposal',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 644 | <code>                caseId: debugCase.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 645 | <code>                diagnosis: debugCase.diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 646 | <code>                requiredPatchFormat: 'unified diff',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 647 | <code>                validationCommands: debugCase.diagnosis?.validationCommands &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 648 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>        const validationCommands = normalizeArray(args.validationCommands &#124;&#124; debugCase.diagnosis?.validationCommands).map(String);</code> | 声明局部标识符 `validationCommands`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 651 | <code>        let repairProposal = null;</code> | 声明局部标识符 `repairProposal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 652 | <code>        if (this.toolDoctor?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 653 | <code>            const repair = await this.toolDoctor.execute({</code> | 声明局部标识符 `repair`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 654 | <code>                action: 'propose_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 655 | <code>                tool: 'self_debugger',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 656 | <code>                title: normalizeString(args.title, `Self debug repair for ${debugCase.affectedCapability &#124;&#124; debugCase.id}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 657 | <code>                reason: debugCase.bugReport,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 658 | <code>                evidence: debugCase.evidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 659 | <code>                candidateDiff,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 660 | <code>                candidatePatchPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 661 | <code>                validationCommands,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 662 | <code>                risk: normalizeString(args.risk, 'high')</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 663 | <code>            }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 664 | <code>            repairProposal = repair.details?.repair &#124;&#124; repair.details &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 665 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 666 | <code>            repairProposal = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 667 | <code>                id: `repair-${debugCase.id}-${randomUUID().slice(0, 8)}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 668 | <code>                status: 'proposed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 669 | <code>                candidateDiff,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 670 | <code>                candidatePatchPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 671 | <code>                validationCommands</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 672 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 673 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 674 | <code>        debugCase.repairProposal = repairProposal;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 675 | <code>        debugCase.phase = 'patch_proposed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 676 | <code>        debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 677 | <code>        await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 678 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 679 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 680 | <code>            caseId: debugCase.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 681 | <code>            repairProposal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 682 | <code>            nextAction: 'validate_patch'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 683 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 686 | <code>    async validatePatch(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 687 | <code>        const debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 688 | <code>        const proposal = debugCase?.repairProposal &#124;&#124; {};</code> | 声明局部标识符 `proposal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 689 | <code>        const candidateDiff = normalizeString(args.candidateDiff &#124;&#124; proposal.candidateDiff);</code> | 声明局部标识符 `candidateDiff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 690 | <code>        const candidatePatchPath = normalizeString(args.candidatePatchPath &#124;&#124; args.patchPath &#124;&#124; proposal.candidatePatchPath);</code> | 声明局部标识符 `candidatePatchPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 691 | <code>        if (!this.capabilityManager?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 692 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 693 | <code>                status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 694 | <code>                reason: 'capability_manager_not_available'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 695 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 696 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 697 | <code>        const validation = await this.capabilityManager.execute({</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 698 | <code>            action: 'execute_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 699 | <code>            repair: proposal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 700 | <code>            candidateDiff,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 701 | <code>            candidatePatchPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 702 | <code>            validationCommands: normalizeArray(args.validationCommands &#124;&#124; proposal.validationCommands).map(String),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 703 | <code>            dryRun: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 704 | <code>            allowGitFallback: args.allowGitFallback === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 705 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 706 | <code>        if (debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 707 | <code>            debugCase.validation = validation.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 708 | <code>            debugCase.phase = validation.details?.status === 'validated' ? 'patch_validated' : 'patch_validation_failed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 709 | <code>            debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 710 | <code>            await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 711 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 712 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 713 | <code>            status: validation.details?.status === 'validated' ? 'completed' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 714 | <code>            caseId: debugCase?.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 715 | <code>            validation: validation.details,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 716 | <code>            nextAction: validation.details?.status === 'validated' ? 'apply_patch' : 'propose_patch'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 717 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 718 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 719 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 720 | <code>    async applyPatch(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 721 | <code>        const debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 722 | <code>        const proposal = debugCase?.repairProposal &#124;&#124; {};</code> | 声明局部标识符 `proposal`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 723 | <code>        if (args.approved !== true &amp;&amp; context.approved !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 724 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 725 | <code>                status: 'needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 726 | <code>                caseId: debugCase?.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 727 | <code>                approvalText: 'Apply self-debug repair patch and run validation?'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 728 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 729 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>        if (!this.capabilityManager?.execute) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 731 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 732 | <code>                status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 733 | <code>                reason: 'capability_manager_not_available'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 734 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 735 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 736 | <code>        const result = await this.capabilityManager.execute({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 737 | <code>            action: 'execute_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 738 | <code>            repair: proposal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 739 | <code>            candidateDiff: normalizeString(args.candidateDiff &#124;&#124; proposal.candidateDiff),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 740 | <code>            candidatePatchPath: normalizeString(args.candidatePatchPath &#124;&#124; args.patchPath &#124;&#124; proposal.candidatePatchPath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 741 | <code>            validationCommands: normalizeArray(args.validationCommands &#124;&#124; proposal.validationCommands).map(String),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 742 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 743 | <code>            allowGitFallback: args.allowGitFallback === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 744 | <code>        }, context);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 745 | <code>        if (debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 746 | <code>            debugCase.repairResult = result.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 747 | <code>            debugCase.phase = result.details?.status === 'completed' ? 'repair_verified' : result.details?.status &#124;&#124; 'repair_failed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 748 | <code>            debugCase.status = result.details?.status === 'completed' ? 'fixed' : 'open';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 749 | <code>            debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 750 | <code>            await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 751 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 753 | <code>            status: result.details?.status === 'completed' ? 'completed' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 754 | <code>            caseId: debugCase?.id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 755 | <code>            repairResult: result.details</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 756 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 757 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 758 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 759 | <code>    async runLoop(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 760 | <code>        const opened = await this.openCase(args, context);</code> | 声明局部标识符 `opened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 761 | <code>        const collected = await this.collectEvidence({ ...args, caseId: opened.case.id }, context);</code> | 声明局部标识符 `collected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 762 | <code>        const diagnosed = await this.diagnose({ ...args, caseId: opened.case.id }, context);</code> | 声明局部标识符 `diagnosed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 763 | <code>        if (!normalizeString(args.candidateDiff &#124;&#124; args.patch &#124;&#124; args.candidatePatchPath &#124;&#124; args.patchPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 764 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 765 | <code>                status: 'needs_patch_proposal',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 766 | <code>                caseId: opened.case.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 767 | <code>                evidenceCount: collected.evidenceCount,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 768 | <code>                diagnosis: diagnosed.diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 769 | <code>                nextAction: 'Agent should generate a minimal candidateDiff, then call self_debugger.propose_patch.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 770 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 771 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 772 | <code>        const proposed = await this.proposePatch({ ...args, caseId: opened.case.id }, context);</code> | 声明局部标识符 `proposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 773 | <code>        const validated = await this.validatePatch({ ...args, caseId: opened.case.id }, context);</code> | 声明局部标识符 `validated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 774 | <code>        if (args.approved === true &#124;&#124; context.approved === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 775 | <code>            const applied = await this.applyPatch({ ...args, caseId: opened.case.id, approved: true }, context);</code> | 声明局部标识符 `applied`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 776 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 777 | <code>                status: applied.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 778 | <code>                caseId: opened.case.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 779 | <code>                evidenceCount: collected.evidenceCount,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 780 | <code>                diagnosis: diagnosed.diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 781 | <code>                repairProposal: proposed.repairProposal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 782 | <code>                validation: validated.validation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 783 | <code>                repairResult: applied.repairResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 784 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 785 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 786 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 787 | <code>            status: 'validated_needs_approval',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 788 | <code>            caseId: opened.case.id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 789 | <code>            evidenceCount: collected.evidenceCount,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 790 | <code>            diagnosis: diagnosed.diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 791 | <code>            repairProposal: proposed.repairProposal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 792 | <code>            validation: validated.validation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 793 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 794 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 796 | <code>    async markCase(args = {}, context = {}) {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 797 | <code>        const debugCase = await this.getCase(args.caseId &#124;&#124; args.id);</code> | 声明局部标识符 `debugCase`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 798 | <code>        if (!debugCase) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 799 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 800 | <code>                status: 'not_found',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 801 | <code>                caseId: normalizeString(args.caseId &#124;&#124; args.id)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 802 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 803 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 804 | <code>        const status = normalizeString(args.status, args.action === 'close_case' ? 'closed' : debugCase.status);</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 805 | <code>        debugCase.status = status;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 806 | <code>        debugCase.phase = normalizeString(args.phase, status === 'closed' ? 'closed' : debugCase.phase);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 807 | <code>        debugCase.note = normalizeString(args.note &#124;&#124; args.summary &#124;&#124; debugCase.note);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 808 | <code>        debugCase.updatedAt = new Date().toISOString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 809 | <code>        debugCase.markedByRunId = normalizeString(args.runId &#124;&#124; context.runId &#124;&#124; debugCase.markedByRunId);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 810 | <code>        await this.upsertCase(debugCase);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 811 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 812 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 813 | <code>            case: debugCase</code> | 多分支标签：定义 switch 结构中的一个具体处理入口。 |
| 814 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 815 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 816 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 817 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 818 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 819 | <code>    AILISSelfDebugger,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 820 | <code>    SELF_DEBUGGER_ACTIONS</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 821 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
