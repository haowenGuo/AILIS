# scripts/prepare-ailis-voice-runtime.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：373
- SHA-256：`34fc33073943405ef099227606853abc0de4a987655269dfe31c8fbf3a0ec3ad`
- 可运行副本：[打开源文件](../../../source/scripts/prepare-ailis-voice-runtime.mjs)
- 依赖：`node:fs/promises`、`node:fs`、`node:path`、`node:child_process`、`node:module`、`node:url`、`../electron/voice-runtime-bootstrap.cjs`、`importlib.util`、`torch`
- 主要符号：`require`、`__dirname`、`PROJECT_ROOT`、`SOURCE_RUNTIME_ROOT`、`MANIFEST_FILENAME`、`INSTALL_TIMEOUT_MS`、`executableName`、`isFile`、`isDirectory`、`normalizeForCompare`、`portableRelative`、`parseArgs`、`findFileRecursive`、`stack`、`visited`、`current`、`entries`、`entryPath`、`findPrivatePythonExecutable`、`pythonRoot`、`directCandidates`、`directCandidate`、`names`、`findSitePackagesDir`、`buildPathAppendEntries`、`readJsonFile`、`buildProbeEnv`、`env`、`probeVoicePython`、`code`、`result`、`assertRequiredRuntimeFiles`、`cosyRoot`、`modelRoot`、`requiredFiles`、`missing`、`readPyvenvConfig`、`isVenvTiedToRuntimePython`、`cfg`、`privatePythonRoot`、`basePaths`、`removeBackupIfSafe`、`normalizedBackup`、`normalizedRuntime`、`ensurePortablePythonRuntime`、`bootstrap`、`paths`、`venvTiedToPrivatePython`、`privatePython`、`needsRebuild`、`backupDir`、`onOutput`、`target`、`writeReleaseManifest`、`voiceVenv`、`venvPython`、`voicePython`、`sitePackagesDir`、`pathAppendEntries`、`probeEnv`、`dependencies`、`missingDependencies`、`manifestPath`、`previousManifest`、`manifest`、`main`、`args`、`prepareResult`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2 | <code>import fsSync from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 3 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 4 | <code>import { spawnSync } from 'node:child_process';</code> | 导入依赖 `node:child_process`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 5 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 6 | <code>import { fileURLToPath } from 'node:url';</code> | 导入依赖 `node:url`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 9 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 10 | <code>    VoiceRuntimeBootstrap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 11 | <code>    DEFAULT_COSYVOICE3_MODEL_DIRNAME,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 12 | <code>    DEFAULT_VOICE_PYTHON_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 13 | <code>    getVenvPythonPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 14 | <code>} = require('../electron/voice-runtime-bootstrap.cjs');</code> | 导入依赖 `../electron/voice-runtime-bootstrap.cjs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>const __dirname = path.dirname(fileURLToPath(import.meta.url));</code> | 声明局部标识符 `__dirname`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 17 | <code>const PROJECT_ROOT = path.resolve(__dirname, '..');</code> | 声明局部标识符 `PROJECT_ROOT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 18 | <code>const SOURCE_RUNTIME_ROOT = process.env.AILIS_VOICE_RUNTIME_ROOT</code> | 声明局部标识符 `SOURCE_RUNTIME_ROOT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 19 | <code>    ? path.resolve(process.env.AILIS_VOICE_RUNTIME_ROOT)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 20 | <code>    : path.join(PROJECT_ROOT, 'models', 'voice-runtime');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 21 | <code>const MANIFEST_FILENAME = 'voice-runtime-manifest.json';</code> | 声明局部标识符 `MANIFEST_FILENAME`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 22 | <code>const INSTALL_TIMEOUT_MS = 30 * 60 * 1000;</code> | 声明局部标识符 `INSTALL_TIMEOUT_MS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 23 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 24 | <code>function executableName(name) {</code> | 定义函数 `executableName`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 25 | <code>    return process.platform === 'win32' ? `${name}.exe` : name;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 26 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>function isFile(filePath) {</code> | 定义函数 `isFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 29 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 30 | <code>        return Boolean(filePath &amp;&amp; fsSync.existsSync(filePath) &amp;&amp; fsSync.statSync(filePath).isFile());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 31 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 32 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>function isDirectory(filePath) {</code> | 定义函数 `isDirectory`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 38 | <code>        return Boolean(filePath &amp;&amp; fsSync.existsSync(filePath) &amp;&amp; fsSync.statSync(filePath).isDirectory());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 40 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>function normalizeForCompare(filePath) {</code> | 定义函数 `normalizeForCompare`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>    return path.resolve(String(filePath &#124;&#124; '')).toLowerCase().replace(/\\/g, '/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 46 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>function portableRelative(targetPath) {</code> | 定义函数 `portableRelative`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>    if (!targetPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 50 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    return path.relative(SOURCE_RUNTIME_ROOT, targetPath).replace(/\\/g, '/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function parseArgs(argv = process.argv.slice(2)) {</code> | 定义函数 `parseArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 57 | <code>        forceRebuild: argv.includes('--force-rebuild'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 58 | <code>        skipRebuild: argv.includes('--skip-rebuild'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>        allowVenvPython: argv.includes('--allow-venv-python')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 60 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 61 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 63 | <code>function findFileRecursive(rootDir, predicate, maxEntries = 60000) {</code> | 定义函数 `findFileRecursive`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 64 | <code>    if (!isDirectory(rootDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 65 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 66 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>    const stack = [rootDir];</code> | 声明局部标识符 `stack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>    let visited = 0;</code> | 声明局部标识符 `visited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 69 | <code>    while (stack.length &amp;&amp; visited &lt; maxEntries) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 70 | <code>        const current = stack.pop();</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>        let entries = [];</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 72 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 73 | <code>            entries = fsSync.readdirSync(current, { withFileTypes: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 74 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 75 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 76 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 78 | <code>            visited += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>            const entryPath = path.join(current, entry.name);</code> | 声明局部标识符 `entryPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>            if (entry.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 81 | <code>                stack.push(entryPath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 82 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>            if (entry.isFile() &amp;&amp; predicate(entryPath, entry.name)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 85 | <code>                return entryPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 86 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 88 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 89 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 90 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>function findPrivatePythonExecutable(runtimeRoot) {</code> | 定义函数 `findPrivatePythonExecutable`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 93 | <code>    const pythonRoot = path.join(runtimeRoot, 'python');</code> | 声明局部标识符 `pythonRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 94 | <code>    const directCandidates = process.platform === 'win32'</code> | 声明局部标识符 `directCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 95 | <code>        ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 96 | <code>            path.join(pythonRoot, 'python.exe'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 97 | <code>            path.join(pythonRoot, 'Scripts', 'python.exe')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>        : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>            path.join(pythonRoot, 'bin', 'python3'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>            path.join(pythonRoot, 'bin', 'python')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 102 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>    const directCandidate = directCandidates.find((candidate) =&gt; isFile(candidate));</code> | 声明局部标识符 `directCandidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>    if (directCandidate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 105 | <code>        return directCandidate;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 106 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 107 | <code>    const names = process.platform === 'win32'</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>        ? new Set(['python.exe'])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>        : new Set(['python3.12', 'python3', 'python']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>    return findFileRecursive(pythonRoot, (_filePath, name) =&gt; names.has(String(name &#124;&#124; '').toLowerCase()));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 111 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 113 | <code>function findSitePackagesDir(venvDir) {</code> | 定义函数 `findSitePackagesDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 114 | <code>    const directCandidates = process.platform === 'win32'</code> | 声明局部标识符 `directCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>        ? [path.join(venvDir, 'Lib', 'site-packages')]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 116 | <code>        : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>            path.join(venvDir, 'lib', 'python3.12', 'site-packages'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>            path.join(venvDir, 'lib', 'python3.11', 'site-packages'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>            path.join(venvDir, 'lib', 'python3.10', 'site-packages')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>    const directCandidate = directCandidates.find((candidate) =&gt; isDirectory(candidate));</code> | 声明局部标识符 `directCandidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 122 | <code>    if (directCandidate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 123 | <code>        return directCandidate;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 124 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 126 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 127 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 128 | <code>function buildPathAppendEntries(voiceVenv, sitePackagesDir) {</code> | 定义函数 `buildPathAppendEntries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 129 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 130 | <code>        process.platform === 'win32'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 131 | <code>            ? path.join(voiceVenv, 'Scripts')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 132 | <code>            : path.join(voiceVenv, 'bin'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>        path.join(voiceVenv, 'Library', 'bin'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 134 | <code>        sitePackagesDir ? path.join(sitePackagesDir, 'torch', 'lib') : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>        sitePackagesDir ? path.join(sitePackagesDir, 'torchaudio', 'lib') : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 136 | <code>    ].filter((entry) =&gt; entry &amp;&amp; isDirectory(entry));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 139 | <code>function readJsonFile(filePath) {</code> | 定义函数 `readJsonFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 140 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 141 | <code>        if (!isFile(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 142 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 143 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>        return JSON.parse(fsSync.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 145 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 146 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 147 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 150 | <code>function buildProbeEnv({ sitePackagesDir, pathAppendEntries }) {</code> | 定义函数 `buildProbeEnv`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 151 | <code>    const env = {</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 152 | <code>        ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>        PYTHONPATH: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>            sitePackagesDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>            process.env.PYTHONPATH &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 156 | <code>        ].filter(Boolean).join(path.delimiter),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 157 | <code>        PATH: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 158 | <code>            ...pathAppendEntries,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 159 | <code>            process.env.PATH &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>        ].filter(Boolean).join(path.delimiter)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 161 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    if (env.CUDA_VISIBLE_DEVICES === '-1') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 163 | <code>        delete env.CUDA_VISIBLE_DEVICES;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 164 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    return env;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 166 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 167 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 168 | <code>function probeVoicePython(pythonPath, env) {</code> | 定义函数 `probeVoicePython`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 169 | <code>    const code = `</code> | 声明局部标识符 `code`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>import importlib.util, json, sys</code> | 导入依赖 `importlib.util,`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>mods = ["numpy", "torch", "torchaudio", "transformers", "onnxruntime", "modelscope", "huggingface_hub", "soundfile", "librosa"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>info = {"python": sys.executable, "version": sys.version.split()[0]}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>for name in mods:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 174 | <code>    info[name] = importlib.util.find_spec(name) is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 175 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 176 | <code>    import torch</code> | 导入依赖 `torch`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>    info["torch_version"] = torch.__version__</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>    info["torch_cuda_available"] = bool(torch.cuda.is_available())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 179 | <code>    info["torch_cuda_version"] = str(getattr(torch.version, "cuda", "") or "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 180 | <code>except Exception as exc:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 181 | <code>    info["torch_error"] = str(exc)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 182 | <code>print(json.dumps(info, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 184 | <code>    const result = spawnSync(pythonPath, ['-c', code], {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>        cwd: PROJECT_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 186 | <code>        env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 187 | <code>        encoding: 'utf8',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 188 | <code>        windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 189 | <code>        timeout: 120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 190 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>    if (result.error &#124;&#124; result.status !== 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>        throw new Error([</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 193 | <code>            'voice runtime Python dependency probe failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 194 | <code>            result.error?.message &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>            result.stdout &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>            result.stderr &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 197 | <code>        ].filter(Boolean).join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 198 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>    return JSON.parse(String(result.stdout &#124;&#124; '{}').trim());</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 200 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>function assertRequiredRuntimeFiles(runtimeRoot) {</code> | 定义函数 `assertRequiredRuntimeFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>    const cosyRoot = path.join(runtimeRoot, 'CosyVoice');</code> | 声明局部标识符 `cosyRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>    const modelRoot = path.join(cosyRoot, 'pretrained_models', DEFAULT_COSYVOICE3_MODEL_DIRNAME);</code> | 声明局部标识符 `modelRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>    const requiredFiles = [</code> | 声明局部标识符 `requiredFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>        path.join(cosyRoot, 'cosyvoice', 'cli', 'cosyvoice.py'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>        path.join(modelRoot, 'cosyvoice3.yaml'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>        path.join(modelRoot, 'llm.pt'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>        path.join(modelRoot, 'flow.pt'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 210 | <code>        path.join(modelRoot, 'hift.pt'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>        path.join(modelRoot, 'campplus.onnx'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>        path.join(modelRoot, 'speech_tokenizer_v3.onnx'),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 213 | <code>        path.join(modelRoot, 'CosyVoice-BlankEN', 'model.safetensors')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>    const missing = requiredFiles.filter((filePath) =&gt; !isFile(filePath));</code> | 声明局部标识符 `missing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 216 | <code>    if (missing.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 217 | <code>        throw new Error(`CosyVoice3 runtime is incomplete. Missing:\n${missing.join('\n')}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 218 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>async function readPyvenvConfig(venvDir) {</code> | 定义函数 `readPyvenvConfig`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 222 | <code>    return fs.readFile(path.join(venvDir, 'pyvenv.cfg'), 'utf8').catch(() =&gt; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 223 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 225 | <code>async function isVenvTiedToRuntimePython(runtimeRoot, venvDir) {</code> | 定义函数 `isVenvTiedToRuntimePython`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>    const cfg = await readPyvenvConfig(venvDir);</code> | 声明局部标识符 `cfg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>    if (!cfg) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 228 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 229 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>    const privatePythonRoot = normalizeForCompare(path.join(runtimeRoot, 'python'));</code> | 声明局部标识符 `privatePythonRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 231 | <code>    const basePaths = cfg.split(/\r?\n/)</code> | 声明局部标识符 `basePaths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 232 | <code>        .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 233 | <code>        .filter((line) =&gt; /^(home&#124;executable)\s*=/i.test(line))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 234 | <code>        .map((line) =&gt; line.replace(/^[^=]+=/, '').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 235 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 236 | <code>        .map(normalizeForCompare);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 237 | <code>    return basePaths.some((entry) =&gt; entry.startsWith(privatePythonRoot));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 238 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 240 | <code>async function removeBackupIfSafe(backupDir) {</code> | 定义函数 `removeBackupIfSafe`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>    if (!backupDir &#124;&#124; !isDirectory(backupDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 242 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>    const normalizedBackup = normalizeForCompare(backupDir);</code> | 声明局部标识符 `normalizedBackup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 245 | <code>    const normalizedRuntime = normalizeForCompare(SOURCE_RUNTIME_ROOT);</code> | 声明局部标识符 `normalizedRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 246 | <code>    if (!normalizedBackup.startsWith(normalizedRuntime)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>        throw new Error(`Refusing to remove backup outside voice runtime root: ${backupDir}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 248 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 249 | <code>    await fs.rm(backupDir, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 250 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>async function ensurePortablePythonRuntime(args) {</code> | 定义函数 `ensurePortablePythonRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>    const bootstrap = new VoiceRuntimeBootstrap({</code> | 声明局部标识符 `bootstrap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 254 | <code>        projectRoot: PROJECT_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>        userDataPath: path.join(PROJECT_ROOT, 'state', 'voice-release-user-data'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 256 | <code>        appDataPath: path.join(PROJECT_ROOT, 'state', 'voice-release-app-data'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 257 | <code>        runtimeRoot: SOURCE_RUNTIME_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 258 | <code>        platform: process.platform</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    const paths = bootstrap.getPaths();</code> | 声明局部标识符 `paths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 261 | <code>    const venvTiedToPrivatePython = await isVenvTiedToRuntimePython(SOURCE_RUNTIME_ROOT, paths.voiceVenv);</code> | 声明局部标识符 `venvTiedToPrivatePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 262 | <code>    const privatePython = findPrivatePythonExecutable(SOURCE_RUNTIME_ROOT);</code> | 声明局部标识符 `privatePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 263 | <code>    const needsRebuild = args.forceRebuild &#124;&#124; !isFile(privatePython) &#124;&#124; !venvTiedToPrivatePython;</code> | 声明局部标识符 `needsRebuild`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 264 | <code>    if (!needsRebuild) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 265 | <code>        return { rebuilt: false, paths };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 266 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>    if (args.skipRebuild) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 268 | <code>        if (args.allowVenvPython &amp;&amp; isFile(paths.voiceVenvPython)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 269 | <code>            return { rebuilt: false, paths };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 270 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>        throw new Error('Voice runtime venv is not tied to bundled Python. Run without --skip-rebuild to prepare a portable release runtime.');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 272 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 274 | <code>    const backupDir = isDirectory(paths.voiceVenv)</code> | 声明局部标识符 `backupDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 275 | <code>        ? `${paths.voiceVenv}.backup-${Date.now()}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 276 | <code>        : '';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 277 | <code>    if (backupDir) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 278 | <code>        console.log(`[AILIS Voice Release] Existing non-portable voice venv detected; moving it to ${backupDir}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 279 | <code>        await fs.rename(paths.voiceVenv, backupDir);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 280 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 283 | <code>        const onOutput = ({ stream, text }) =&gt; {</code> | 声明局部标识符 `onOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 284 | <code>            const target = stream === 'stderr' ? process.stderr : process.stdout;</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 285 | <code>            target.write(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 286 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>        await bootstrap.installPrivatePython({ paths, onOutput });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 288 | <code>        await bootstrap.installVoicePackages({ paths, onOutput });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 290 | <code>            await removeBackupIfSafe(backupDir);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 291 | <code>        } catch (cleanupError) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 292 | <code>            console.warn(`[AILIS Voice Release] warning: backup cleanup skipped: ${cleanupError?.message &#124;&#124; cleanupError}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 293 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>        return { rebuilt: true, paths };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 296 | <code>        if (backupDir &amp;&amp; isDirectory(backupDir)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 297 | <code>            await fs.rm(paths.voiceVenv, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 298 | <code>            await fs.rename(backupDir, paths.voiceVenv);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 299 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>        throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 301 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 304 | <code>async function writeReleaseManifest({ paths }) {</code> | 定义函数 `writeReleaseManifest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>    const voiceVenv = path.join(SOURCE_RUNTIME_ROOT, 'voice-venv');</code> | 声明局部标识符 `voiceVenv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 306 | <code>    const privatePython = findPrivatePythonExecutable(SOURCE_RUNTIME_ROOT);</code> | 声明局部标识符 `privatePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 307 | <code>    const venvPython = getVenvPythonPath(voiceVenv, process.platform);</code> | 声明局部标识符 `venvPython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 308 | <code>    const voicePython = privatePython &#124;&#124; venvPython;</code> | 声明局部标识符 `voicePython`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 309 | <code>    if (!privatePython &amp;&amp; !isFile(venvPython)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 310 | <code>        throw new Error('No bundled voice Python was found.');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 311 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>    const sitePackagesDir = findSitePackagesDir(voiceVenv);</code> | 声明局部标识符 `sitePackagesDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 313 | <code>    const pathAppendEntries = buildPathAppendEntries(voiceVenv, sitePackagesDir);</code> | 声明局部标识符 `pathAppendEntries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 314 | <code>    const probeEnv = buildProbeEnv({ sitePackagesDir, pathAppendEntries });</code> | 声明局部标识符 `probeEnv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 315 | <code>    const dependencies = probeVoicePython(voicePython, probeEnv);</code> | 声明局部标识符 `dependencies`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 316 | <code>    const missingDependencies = ['torch', 'torchaudio', 'transformers', 'modelscope', 'huggingface_hub']</code> | 声明局部标识符 `missingDependencies`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 317 | <code>        .filter((name) =&gt; !dependencies[name]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 318 | <code>    if (missingDependencies.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 319 | <code>        throw new Error(`Voice runtime dependency probe missing: ${missingDependencies.join(', ')}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 320 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>    const manifestPath = path.join(SOURCE_RUNTIME_ROOT, MANIFEST_FILENAME);</code> | 声明局部标识符 `manifestPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 323 | <code>    const previousManifest = readJsonFile(manifestPath) &#124;&#124; {};</code> | 声明局部标识符 `previousManifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 324 | <code>    const manifest = {</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 325 | <code>        ...previousManifest,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 326 | <code>        schema: 'ailis.voiceRuntimeManifest',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 327 | <code>        installerVersion: Number(previousManifest.installerVersion &#124;&#124; 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 328 | <code>        packagedRuntime: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 329 | <code>        portableRuntime: Boolean(privatePython),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 330 | <code>        preparedForReleaseAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 331 | <code>        pythonVersion: DEFAULT_VOICE_PYTHON_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 332 | <code>        runtimeRoot: SOURCE_RUNTIME_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 333 | <code>        voiceVenv: 'voice-venv',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 334 | <code>        voicePython: portableRelative(voicePython),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 335 | <code>        python: privatePython ? portableRelative(privatePython) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 336 | <code>        pythonPath: sitePackagesDir ? [portableRelative(sitePackagesDir)] : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 337 | <code>        pathAppend: pathAppendEntries.map(portableRelative),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 338 | <code>        cosyVoiceRoot: 'CosyVoice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 339 | <code>        cosyVoice3ModelDir: `CosyVoice/pretrained_models/${DEFAULT_COSYVOICE3_MODEL_DIRNAME}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 340 | <code>        asrCache: isDirectory(path.join(SOURCE_RUNTIME_ROOT, 'asr-cache')) ? 'asr-cache' : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 341 | <code>        uv: isFile(path.join(SOURCE_RUNTIME_ROOT, 'uv', executableName('uv')))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 342 | <code>            ? `uv/${executableName('uv')}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 343 | <code>            : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 344 | <code>        dependencies,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 345 | <code>        components: previousManifest.components &amp;&amp; typeof previousManifest.components === 'object'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 346 | <code>            ? previousManifest.components</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 347 | <code>            : {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 348 | <code>        notes: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 349 | <code>            'Prepared for bundled AILIS release.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 350 | <code>            'Runtime lookup prefers process.resourcesPath/models/voice-runtime in packaged builds.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 351 | <code>            'pip-cache, downloads and uv-cache are intentionally excluded from release artifacts.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 352 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 355 | <code>    return manifest;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 356 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 358 | <code>async function main() {</code> | 定义函数 `main`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 359 | <code>    const args = parseArgs();</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 360 | <code>    assertRequiredRuntimeFiles(SOURCE_RUNTIME_ROOT);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 361 | <code>    const prepareResult = await ensurePortablePythonRuntime(args);</code> | 声明局部标识符 `prepareResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 362 | <code>    const manifest = await writeReleaseManifest(prepareResult);</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 363 | <code>    console.log(`[AILIS Voice Release] Prepared voice runtime: ${SOURCE_RUNTIME_ROOT}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 364 | <code>    console.log(`[AILIS Voice Release] Python: ${manifest.voicePython}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 365 | <code>    console.log(`[AILIS Voice Release] CUDA available: ${Boolean(manifest.dependencies?.torch_cuda_available)}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 366 | <code>    console.log('[AILIS Voice Release] Release packaging will exclude pip-cache/downloads/uv-cache.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 367 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 369 | <code>main().catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 370 | <code>    console.error('[AILIS Voice Release] failed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 371 | <code>    console.error(error instanceof Error ? error.stack &#124;&#124; error.message : String(error));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 372 | <code>    process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 373 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
