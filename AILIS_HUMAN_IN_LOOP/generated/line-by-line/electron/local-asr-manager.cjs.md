# electron/local-asr-manager.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：606
- SHA-256：`969e3742632b8a81baab729ab6e2c7d1f5aac1098a7e11e56a79ed57b7e7f03a`
- 可运行副本：[打开源文件](../../../source/electron/local-asr-manager.cjs)
- 依赖：`fs`、`path`、`readline`、`child_process`、`./voice-runtime-bootstrap.cjs`
- 主要符号：`fs`、`path`、`readline`、`PACKAGED_ASR_RUNTIME_DIRNAME`、`SPEECH_MODEL_DIRNAME`、`normalizeString`、`safeStat`、`isDirectory`、`isFile`、`uniqueCandidates`、`seen`、`key`、`readJsonFile`、`normalizeRelativePath`、`rawPath`、`pythonLooksLikeAsrRuntime`、`probe`、`result`、`normalizeManifestPathList`、`values`、`buildRuntimeEnv`、`pythonPathEntries`、`pathEntries`、`env`、`normalizeBinaryPayload`、`isPlainTranscribePayload`、`normalizeAsrPreset`、`normalizedValue`、`getProjectRoot`、`normalizeTranscribePayload`、`audioBytes`、`rawPreset`、`DesktopASRManager`、`appDataDir`、`candidateDirs`、`candidates`、`runtimeCacheDirs`、`manifest`、`speechModelDirs`、`currentCacheDir`、`legacyCacheDir`、`packagedCacheDir`、`projectRoot`、`envPython`、`envVoicePython`、`envAsrPython`、`privateVoicePython`、`projectVoicePython`、`runtimeEnv`、`manifestReady`、`manifestPython`、`asrVenvDir`、`workerScriptPath`、`python`、`cacheDir`、`child`、`lineReader`、`trimmedLine`、`payload`、`pendingRequest`、`message`、`errorMessage`、`requestId`、`requestPayload`、`timeoutId`、`startedAt`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 3 | <code>const readline = require('readline');</code> | 导入依赖 `readline`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>const { spawn, spawnSync } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>const { getVenvPythonPath } = require('./voice-runtime-bootstrap.cjs');</code> | 导入依赖 `./voice-runtime-bootstrap.cjs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const PACKAGED_ASR_RUNTIME_DIRNAME = 'ailis-asr-runtime';</code> | 声明局部标识符 `PACKAGED_ASR_RUNTIME_DIRNAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>const SPEECH_MODEL_DIRNAME = 'speech-models';</code> | 声明局部标识符 `SPEECH_MODEL_DIRNAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>function normalizeString(value) {</code> | 定义函数 `normalizeString`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>    return String(value &#124;&#124; '').trim();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 12 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>function safeStat(filePath) {</code> | 定义函数 `safeStat`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 16 | <code>        return fs.statSync(filePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 17 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 18 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 19 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 20 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>function isDirectory(filePath) {</code> | 定义函数 `isDirectory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 23 | <code>    return Boolean(safeStat(filePath)?.isDirectory());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 24 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 25 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 26 | <code>function isFile(filePath) {</code> | 定义函数 `isFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 27 | <code>    return Boolean(safeStat(filePath)?.isFile());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 30 | <code>function uniqueCandidates(candidates = []) {</code> | 定义函数 `uniqueCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 32 | <code>    return candidates.filter((candidate) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>        const key = path.resolve(normalizeString(candidate &#124;&#124; '')).toLowerCase();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 34 | <code>        if (!key &#124;&#124; seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 35 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 36 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>        seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 38 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>function readJsonFile(filePath) {</code> | 定义函数 `readJsonFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 44 | <code>        if (!isFile(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 45 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 46 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>        return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 48 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 49 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 50 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 51 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function normalizeRelativePath(rootDir, relativePath) {</code> | 定义函数 `normalizeRelativePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 54 | <code>    const rawPath = normalizeString(relativePath);</code> | 声明局部标识符 `rawPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 55 | <code>    if (!rawPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 56 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 58 | <code>    return path.isAbsolute(rawPath)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 59 | <code>        ? rawPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 60 | <code>        : path.join(rootDir, rawPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 61 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>function pythonLooksLikeAsrRuntime(command, args = [], env = {}) {</code> | 定义函数 `pythonLooksLikeAsrRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 64 | <code>    const probe = [</code> | 声明局部标识符 `probe`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 65 | <code>        'import importlib.util, sys',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 66 | <code>        'missing = [name for name in ("numpy", "torch", "transformers") if importlib.util.find_spec(name) is None]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 67 | <code>        'sys.exit(1 if missing else 0)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 68 | <code>    ].join('; ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 69 | <code>    const result = spawnSync(command, [...args, '-c', probe], {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 70 | <code>        windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 71 | <code>        timeout: 20000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>        encoding: 'utf8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 73 | <code>        env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 74 | <code>            ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 75 | <code>            ...env</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 76 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 78 | <code>    return !result.error &amp;&amp; result.status === 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 79 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 81 | <code>function normalizeManifestPathList(rootDir, value) {</code> | 定义函数 `normalizeManifestPathList`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>    const values = Array.isArray(value)</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>        ? value</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 84 | <code>        : normalizeString(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 85 | <code>            ? String(value).split(path.delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 86 | <code>            : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 87 | <code>    return values</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>        .map((item) =&gt; normalizeRelativePath(rootDir, item))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 89 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 90 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>function buildRuntimeEnv(runtimeRoot, manifest = {}) {</code> | 定义函数 `buildRuntimeEnv`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 93 | <code>    const pythonPathEntries = normalizeManifestPathList(runtimeRoot, manifest.pythonPath);</code> | 声明局部标识符 `pythonPathEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>    const pathEntries = normalizeManifestPathList(runtimeRoot, manifest.pathAppend);</code> | 声明局部标识符 `pathEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>    const env = {};</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 96 | <code>    if (pythonPathEntries.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 97 | <code>        env.PYTHONPATH = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 98 | <code>            ...pythonPathEntries,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 99 | <code>            process.env.PYTHONPATH &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 100 | <code>        ].filter(Boolean).join(path.delimiter);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 101 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    if (pathEntries.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 103 | <code>        env.PATH = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 104 | <code>            ...pathEntries,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 105 | <code>            process.env.PATH &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 106 | <code>        ].filter(Boolean).join(path.delimiter);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 107 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    return env;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 110 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 111 | <code>function normalizeBinaryPayload(payload) {</code> | 定义函数 `normalizeBinaryPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 112 | <code>    if (!payload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 113 | <code>        return Buffer.alloc(0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 114 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>    if (Buffer.isBuffer(payload)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 117 | <code>        return payload;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 118 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 119 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 120 | <code>    if (payload instanceof Uint8Array) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 121 | <code>        return Buffer.from(payload);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 122 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>    if (ArrayBuffer.isView(payload)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 125 | <code>        return Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>    if (payload instanceof ArrayBuffer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 129 | <code>        return Buffer.from(payload);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 132 | <code>    if (Array.isArray(payload)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 133 | <code>        return Buffer.from(payload);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>    if (payload.audioBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 137 | <code>        return normalizeBinaryPayload(payload.audioBytes);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>    throw new Error('无法解析语音识别音频数据');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 141 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 142 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 143 | <code>function isPlainTranscribePayload(payload) {</code> | 定义函数 `isPlainTranscribePayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 144 | <code>    return Boolean(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>        payload &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 146 | <code>        typeof payload === 'object' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 147 | <code>        !Buffer.isBuffer(payload) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 148 | <code>        !(payload instanceof Uint8Array) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 149 | <code>        !(payload instanceof ArrayBuffer) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 150 | <code>        !ArrayBuffer.isView(payload) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 151 | <code>        !Array.isArray(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 153 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 155 | <code>function normalizeAsrPreset(value) {</code> | 定义函数 `normalizeAsrPreset`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 156 | <code>    const normalizedValue = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedValue`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 157 | <code>    if (['fast', 'low-latency', 'low_latency', 'realtime'].includes(normalizedValue)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 158 | <code>        return 'fast';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    return 'balanced';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 161 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>function getProjectRoot() {</code> | 定义函数 `getProjectRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 164 | <code>    return path.resolve(__dirname, '..');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 166 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 167 | <code>function normalizeTranscribePayload(payload) {</code> | 定义函数 `normalizeTranscribePayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 168 | <code>    const audioBytes = normalizeBinaryPayload(payload);</code> | 声明局部标识符 `audioBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 169 | <code>    const rawPreset = isPlainTranscribePayload(payload)</code> | 声明局部标识符 `rawPreset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 170 | <code>        ? payload.preset &#124;&#124; payload.options?.preset &#124;&#124; payload.asrPreset</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 171 | <code>        : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 173 | <code>        audioBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 174 | <code>        preset: normalizeAsrPreset(rawPreset)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 175 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 176 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 178 | <code>class DesktopASRManager {</code> | 定义类 `DesktopASRManager`，把相关状态与行为收拢为一个运行时对象。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 179 | <code>    constructor({ app }) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 180 | <code>        this.app = app;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 181 | <code>        this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 182 | <code>        this.pending = new Map();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 183 | <code>        this.nextRequestId = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 184 | <code>        this.pythonCommand = null;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 185 | <code>        this.warmupPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 187 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 188 | <code>    getCacheDir() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 189 | <code>        return normalizeString(process.env.AILIS_ASR_CACHE_DIR) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 190 | <code>            path.join(this.app.getPath('userData'), 'asr-cache');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 191 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 193 | <code>    getLegacyCacheDirs() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 194 | <code>        const appDataDir = this.app.getPath('appData');</code> | 声明局部标识符 `appDataDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 195 | <code>        return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 196 | <code>            path.join(appDataDir, 'ailis', 'asr-cache'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 197 | <code>            path.join(appDataDir, 'AIGril', 'asr-cache')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 198 | <code>        ].filter((candidate) =&gt; candidate !== this.getCacheDir());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 199 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>    cacheHasModel(cacheDir) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 202 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 203 | <code>            if (!cacheDir &#124;&#124; !fs.existsSync(cacheDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 205 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>            const candidateDirs = [</code> | 声明局部标识符 `candidateDirs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 207 | <code>                cacheDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 208 | <code>                path.join(cacheDir, 'hub'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 209 | <code>                path.join(cacheDir, 'transformers')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 210 | <code>            ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>            return candidateDirs.some((candidateDir) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 212 | <code>                if (!isDirectory(candidateDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 213 | <code>                    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>                return fs.readdirSync(candidateDir, { withFileTypes: true })</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>                    .some((entry) =&gt; entry.isDirectory() &amp;&amp; /^models--/i.test(entry.name));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 217 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 219 | <code>            return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 220 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 221 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>    getPackagedAsrRuntimeRoots() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 224 | <code>        const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 225 | <code>            process.env.AILIS_ASR_RUNTIME_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 226 | <code>            process.resourcesPath ? path.join(process.resourcesPath, PACKAGED_ASR_RUNTIME_DIRNAME) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 227 | <code>            path.join(getProjectRoot(), 'build-cache', PACKAGED_ASR_RUNTIME_DIRNAME),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 228 | <code>            path.join(getProjectRoot(), '.ailis-runtime', 'asr-runtime')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 229 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>        return uniqueCandidates(candidates).filter((candidate) =&gt; isDirectory(candidate));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>    getAsrRuntimeManifest(runtimeRoot) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 234 | <code>        return readJsonFile(path.join(runtimeRoot, 'manifest.json')) &#124;&#124; {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 235 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 236 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 237 | <code>    getPackagedAsrCacheDirs() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 238 | <code>        const runtimeCacheDirs = this.getPackagedAsrRuntimeRoots()</code> | 声明局部标识符 `runtimeCacheDirs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 239 | <code>            .flatMap((runtimeRoot) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 240 | <code>                const manifest = this.getAsrRuntimeManifest(runtimeRoot);</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 241 | <code>                return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 242 | <code>                    normalizeRelativePath(runtimeRoot, manifest.asrCache),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 243 | <code>                    path.join(runtimeRoot, 'asr-cache')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 244 | <code>                ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>        const speechModelDirs = [</code> | 声明局部标识符 `speechModelDirs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 247 | <code>            process.env.AILIS_ASR_BUNDLED_CACHE_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 248 | <code>            process.resourcesPath ? path.join(process.resourcesPath, SPEECH_MODEL_DIRNAME, 'asr-cache') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 249 | <code>            process.resourcesPath ? path.join(process.resourcesPath, SPEECH_MODEL_DIRNAME) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 250 | <code>            path.join(getProjectRoot(), 'Resources', SPEECH_MODEL_DIRNAME, 'asr-cache'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 251 | <code>            path.join(getProjectRoot(), 'Resources', SPEECH_MODEL_DIRNAME),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 252 | <code>            path.join(getProjectRoot(), 'dist', 'Resources', SPEECH_MODEL_DIRNAME, 'asr-cache'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 253 | <code>            path.join(getProjectRoot(), 'dist', 'Resources', SPEECH_MODEL_DIRNAME)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 254 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 255 | <code>        return uniqueCandidates([...runtimeCacheDirs, ...speechModelDirs])</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 256 | <code>            .filter((candidate) =&gt; isDirectory(candidate));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 257 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 259 | <code>    resolveCacheDir() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 260 | <code>        const currentCacheDir = this.getCacheDir();</code> | 声明局部标识符 `currentCacheDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 261 | <code>        if (this.cacheHasModel(currentCacheDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 262 | <code>            return currentCacheDir;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 263 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>        const legacyCacheDir = this.getLegacyCacheDirs().find((candidate) =&gt; this.cacheHasModel(candidate));</code> | 声明局部标识符 `legacyCacheDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 266 | <code>        if (legacyCacheDir) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 267 | <code>            console.log(`[ASR] 当前缓存为空，复用旧模型缓存：${legacyCacheDir}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 268 | <code>            return legacyCacheDir;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 269 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>        const packagedCacheDir = this.getPackagedAsrCacheDirs()</code> | 声明局部标识符 `packagedCacheDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 272 | <code>            .find((candidate) =&gt; this.cacheHasModel(candidate));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 273 | <code>        if (packagedCacheDir) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 274 | <code>            console.log(`[ASR] 使用随包本地模型缓存：${packagedCacheDir}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 275 | <code>            return packagedCacheDir;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 276 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 278 | <code>        return currentCacheDir;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 280 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 281 | <code>    getWorkerScriptPath() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 282 | <code>        if (this.app.isPackaged) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 283 | <code>            return path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'desktop_asr_worker.py');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>        return path.join(__dirname, 'desktop_asr_worker.py');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 287 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>    resolvePythonCommand() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 290 | <code>        if (this.pythonCommand) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 291 | <code>            return this.pythonCommand;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 292 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 294 | <code>        const projectRoot = getProjectRoot();</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 295 | <code>        const envPython = String(process.env.AILIS_PYTHON &#124;&#124; '').trim();</code> | 声明局部标识符 `envPython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 296 | <code>        const envVoicePython = String(process.env.AILIS_VOICE_PYTHON &#124;&#124; '').trim();</code> | 声明局部标识符 `envVoicePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 297 | <code>        const envAsrPython = String(process.env.AILIS_ASR_PYTHON &#124;&#124; '').trim();</code> | 声明局部标识符 `envAsrPython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 298 | <code>        const privateVoicePython = getVenvPythonPath(</code> | 声明局部标识符 `privateVoicePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 299 | <code>            path.join(this.app.getPath('userData'), 'local-runtimes', 'voice-venv'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 300 | <code>            process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 301 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>        const projectVoicePython = getVenvPythonPath(</code> | 声明局部标识符 `projectVoicePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 303 | <code>            path.join(projectRoot, 'build-cache', 'cosyvoice3-venv'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 304 | <code>            process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 305 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>        const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 308 | <code>        if (envAsrPython) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 309 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 310 | <code>                source: 'AILIS_ASR_PYTHON',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 311 | <code>                command: envAsrPython,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 312 | <code>                args: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 313 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>        for (const runtimeRoot of this.getPackagedAsrRuntimeRoots()) {</code> | 声明局部标识符 `runtimeRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 317 | <code>            const manifest = this.getAsrRuntimeManifest(runtimeRoot);</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 318 | <code>            const runtimeEnv = buildRuntimeEnv(runtimeRoot, manifest);</code> | 声明局部标识符 `runtimeEnv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 319 | <code>            const manifestReady = Boolean(</code> | 声明局部标识符 `manifestReady`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 320 | <code>                manifest.asrDependenciesReady &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 321 | <code>                (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 322 | <code>                    manifest.dependencies &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 323 | <code>                    manifest.dependencies.numpy &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 324 | <code>                    manifest.dependencies.torch &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 325 | <code>                    manifest.dependencies.transformers</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 326 | <code>                )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 327 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>            const manifestPython = normalizeRelativePath(runtimeRoot, manifest.asrPython &#124;&#124; manifest.python);</code> | 声明局部标识符 `manifestPython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 329 | <code>            if (manifestPython) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 330 | <code>                candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 331 | <code>                    source: 'packaged-asr-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 332 | <code>                    command: manifestPython,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 333 | <code>                    args: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 334 | <code>                    env: runtimeEnv,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 335 | <code>                    trustedAsrRuntime: manifestReady</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 336 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>            const asrVenvDir = normalizeRelativePath(runtimeRoot, manifest.asrVenv &#124;&#124; 'asr-venv');</code> | 声明局部标识符 `asrVenvDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 340 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 341 | <code>                source: 'packaged-asr-runtime',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 342 | <code>                command: getVenvPythonPath(asrVenvDir, process.platform),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 343 | <code>                args: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 344 | <code>                env: runtimeEnv,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 345 | <code>                trustedAsrRuntime: manifestReady</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 346 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 349 | <code>        if (envVoicePython) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 350 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 351 | <code>                source: 'AILIS_VOICE_PYTHON',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 352 | <code>                command: envVoicePython,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 353 | <code>                args: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 354 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>        if (envPython) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 358 | <code>            candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 359 | <code>                source: 'AILIS_PYTHON',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 360 | <code>                command: envPython,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 361 | <code>                args: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 362 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 365 | <code>        candidates.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 366 | <code>            { source: 'voice-venv', command: privateVoicePython, args: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 367 | <code>            { source: 'cosyvoice3-venv', command: projectVoicePython, args: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 368 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>        candidates.push(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 371 | <code>            { source: 'python', command: 'python', args: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 372 | <code>            { source: 'py-3.12', command: 'py', args: ['-3.12'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 373 | <code>            { source: 'py', command: 'py', args: [] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 374 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>        for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 377 | <code>            if (!candidate.command) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 378 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 379 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 380 | <code>            if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 381 | <code>                path.isAbsolute(candidate.command) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 382 | <code>                !fs.existsSync(candidate.command)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 383 | <code>            ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 384 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 385 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 387 | <code>                const result = spawnSync(candidate.command, [...candidate.args, '--version'], {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 388 | <code>                    windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 389 | <code>                    timeout: 10000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 390 | <code>                    encoding: 'utf8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 391 | <code>                    env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 392 | <code>                        ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 393 | <code>                        ...(candidate.env &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 394 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 397 | <code>                if (!result.error &amp;&amp; result.status === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 398 | <code>                    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 399 | <code>                        candidate.source === 'packaged-asr-runtime' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 400 | <code>                        !candidate.trustedAsrRuntime &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 401 | <code>                        !pythonLooksLikeAsrRuntime(candidate.command, candidate.args, candidate.env)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 402 | <code>                    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 403 | <code>                        continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 404 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>                    this.pythonCommand = candidate;</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 406 | <code>                    return candidate;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 407 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 409 | <code>                console.warn('[ASR] Python 探测失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 410 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 412 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 413 | <code>        throw new Error('未找到 AILIS 可用的 Python 运行时；请在控制面板执行“本地语音运行时诊断/一键修复”，或设置 AILIS_ASR_PYTHON / AILIS_VOICE_PYTHON。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 414 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 415 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 416 | <code>    ensureWorker() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 417 | <code>        if (this.child &amp;&amp; !this.child.killed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>            return this.child;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 419 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 421 | <code>        const workerScriptPath = this.getWorkerScriptPath();</code> | 声明局部标识符 `workerScriptPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 422 | <code>        if (!fs.existsSync(workerScriptPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 423 | <code>            throw new Error(`本地语音识别脚本不存在：${workerScriptPath}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 424 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 425 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 426 | <code>        const python = this.resolvePythonCommand();</code> | 声明局部标识符 `python`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 427 | <code>        const cacheDir = this.resolveCacheDir();</code> | 声明局部标识符 `cacheDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 428 | <code>        const child = spawn(</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 429 | <code>            python.command,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 430 | <code>            [...python.args, '-u', workerScriptPath],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 431 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 432 | <code>                cwd: path.dirname(workerScriptPath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 433 | <code>                windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 434 | <code>                stdio: ['pipe', 'pipe', 'pipe'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 435 | <code>                env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 436 | <code>                    ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 437 | <code>                    ...(python.env &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 438 | <code>                    AILIS_PROJECT_ROOT: getProjectRoot(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 439 | <code>                    AILIS_USER_DATA: this.app.getPath('userData'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 440 | <code>                    AILIS_ASR_MODEL_ID: process.env.AILIS_ASR_MODEL_ID &#124;&#124; 'openai/whisper-small',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 441 | <code>                    AILIS_ASR_MODEL_ENDPOINT: process.env.AILIS_ASR_MODEL_ENDPOINT &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 442 | <code>                    AILIS_ASR_LOCAL_ONLY: process.env.AILIS_ASR_LOCAL_ONLY &#124;&#124; '1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 443 | <code>                    AILIS_ASR_LANGUAGE: process.env.AILIS_ASR_LANGUAGE &#124;&#124; 'zh',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 444 | <code>                    AILIS_ASR_TASK: process.env.AILIS_ASR_TASK &#124;&#124; 'transcribe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 445 | <code>                    AILIS_ASR_CHUNK_LENGTH_S: process.env.AILIS_ASR_CHUNK_LENGTH_S &#124;&#124; '15',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 446 | <code>                    AILIS_ASR_BATCH_SIZE: process.env.AILIS_ASR_BATCH_SIZE &#124;&#124; '4',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 447 | <code>                    AILIS_ASR_CACHE_DIR: cacheDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 448 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 452 | <code>        const lineReader = readline.createInterface({</code> | 声明局部标识符 `lineReader`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 453 | <code>            input: child.stdout</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 454 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 456 | <code>        lineReader.on('line', (line) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 457 | <code>            const trimmedLine = String(line &#124;&#124; '').trim();</code> | 声明局部标识符 `trimmedLine`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 458 | <code>            if (!trimmedLine) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 459 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 460 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 462 | <code>            let payload = null;</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 463 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 464 | <code>                payload = JSON.parse(trimmedLine);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 465 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 466 | <code>                console.warn('[ASR] 无法解析 worker 输出：', trimmedLine);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 467 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 468 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 470 | <code>            if (!payload?.id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 471 | <code>                if (payload?.type === 'ready') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 472 | <code>                    console.log('[ASR] 本地识别 worker 已启动');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 473 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 475 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 476 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 477 | <code>            const pendingRequest = this.pending.get(String(payload.id));</code> | 声明局部标识符 `pendingRequest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 478 | <code>            if (!pendingRequest) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 479 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 480 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 482 | <code>            this.pending.delete(String(payload.id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 483 | <code>            clearTimeout(pendingRequest.timeoutId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 484 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 485 | <code>            if (payload.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 486 | <code>                pendingRequest.resolve(payload.result &#124;&#124; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 487 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 488 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 490 | <code>            pendingRequest.reject(new Error(payload.error &#124;&#124; '本地语音识别失败'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 491 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 492 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 493 | <code>        child.stderr.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 494 | <code>            const message = String(chunk &#124;&#124; '').trim();</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 495 | <code>            if (message) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 496 | <code>                console.log(`[ASR] ${message}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 497 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 498 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 500 | <code>        child.on('exit', (code, signal) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 501 | <code>            if (this.child === child) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 502 | <code>                this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 503 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>            const errorMessage = code === 0 &amp;&amp; !signal</code> | 声明局部标识符 `errorMessage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 506 | <code>                ? '本地语音识别进程已退出'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 507 | <code>                : `本地语音识别进程已退出（code=${code ?? 'null'}, signal=${signal ?? 'null'}）`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 508 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 509 | <code>            for (const [requestId, pendingRequest] of this.pending.entries()) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 510 | <code>                clearTimeout(pendingRequest.timeoutId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 511 | <code>                pendingRequest.reject(new Error(errorMessage));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 512 | <code>                this.pending.delete(requestId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 513 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 515 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 516 | <code>        child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 517 | <code>            console.error('[ASR] 无法启动本地识别 worker：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 518 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>        this.child = child;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 521 | <code>        return child;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 522 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 524 | <code>    sendRequest(action, payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 525 | <code>        const child = this.ensureWorker();</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 526 | <code>        const requestId = String(this.nextRequestId++);</code> | 声明局部标识符 `requestId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 527 | <code>        const requestPayload = {</code> | 声明局部标识符 `requestPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 528 | <code>            id: requestId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 529 | <code>            action,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 530 | <code>            ...payload</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 531 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 533 | <code>        return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 534 | <code>            const timeoutId = setTimeout(() =&gt; {</code> | 声明局部标识符 `timeoutId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 535 | <code>                this.pending.delete(requestId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 536 | <code>                reject(new Error('本地语音识别请求超时'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 537 | <code>            }, 10 * 60 * 1000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>            this.pending.set(requestId, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 540 | <code>                resolve,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 541 | <code>                reject,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 542 | <code>                timeoutId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 543 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 546 | <code>                child.stdin.write(`${JSON.stringify(requestPayload)}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 547 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 548 | <code>                clearTimeout(timeoutId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 549 | <code>                this.pending.delete(requestId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 550 | <code>                reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 551 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 553 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>    async transcribeAudioBytes(payload) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 556 | <code>        const { audioBytes, preset } = normalizeTranscribePayload(payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 557 | <code>        if (!audioBytes.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 558 | <code>            throw new Error('录音内容为空');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 559 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 561 | <code>        const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 562 | <code>        const result = await this.sendRequest('transcribe', {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 563 | <code>            audioBase64: audioBytes.toString('base64'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 564 | <code>            preset</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 565 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 567 | <code>            ...(result &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 568 | <code>            preset: result?.preset &#124;&#124; preset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 569 | <code>            manager_timing: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 570 | <code>                total_seconds: Number(((Date.now() - startedAt) / 1000).toFixed(3))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 571 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 572 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 574 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 575 | <code>    warmup() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 576 | <code>        if (this.warmupPromise) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 577 | <code>            return this.warmupPromise;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 578 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>        this.warmupPromise = this.sendRequest('warmup')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 581 | <code>            .catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 582 | <code>                this.warmupPromise = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 583 | <code>                throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 584 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 586 | <code>        return this.warmupPromise;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 587 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 589 | <code>    close() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 590 | <code>        if (!this.child &#124;&#124; this.child.killed) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 591 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 592 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 594 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 595 | <code>            this.child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 596 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 597 | <code>            console.warn('[ASR] 关闭 worker 失败：', error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 598 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 599 | <code>            this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 600 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 601 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 603 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 604 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 605 | <code>    DesktopASRManager</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 606 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
