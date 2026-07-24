# scripts/run-ailis-self-debug-eval.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。
- 文件类型：`source-code`
- 原始行数：392
- SHA-256：`9f62769f924d9409d2d78171b67f895b0f3c45de5226a1d3cbca35c420570fda`
- 可运行副本：[打开源文件](../../../source/scripts/run-ailis-self-debug-eval.mjs)
- 依赖：`node:fs/promises`、`node:path`、`node:child_process`、`node:url`、`node:util`、`node:module`、`../electron/ailis-runtime.cjs`
- 主要符号：`require`、`execFileAsync`、`__filename`、`__dirname`、`projectRoot`、`DEFAULT_QUIXBUGS_REPO`、`DEFAULT_QUIXBUGS_DIR`、`DEFAULT_OUTPUT_DIR`、`DEFAULT_PROGRAMS`、`parseArgs`、`args`、`index`、`arg`、`pathExists`、`runCommand`、`startedAt`、`result`、`ensureQuixBugs`、`clone`、`copyBenchmarkSource`、`normalizeText`、`splitPatchLines`、`normalized`、`renderFullFilePatch`、`oldLines`、`newLines`、`quixTestCommand`、`readProgramPatch`、`relativePath`、`buggyPath`、`correctPath`、`summarizeCase`、`runQuixBugsCase`、`caseDir`、`auditDir`、`runtime`、`runId`、`testCommand`、`metrics`、`phases`、`baseline`、`opened`、`caseId`、`evidence`、`diagnosis`、`beforeApply`、`candidateDiff`、`proposed`、`validated`、`blocked`、`stillBeforeApply`、`applied`、`buildSummary`、`total`、`count`、`passed`、`runAILISSelfDebugEval`、`benchmark`、`cases`、`report`、`reportPath`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 2 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 3 | <code>import { execFile } from 'node:child_process';</code> | 导入依赖 `node:child_process`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 4 | <code>import { fileURLToPath } from 'node:url';</code> | 导入依赖 `node:url`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 5 | <code>import { promisify } from 'node:util';</code> | 导入依赖 `node:util`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 9 | <code>const { AILISRuntime } = require('../electron/ailis-runtime.cjs');</code> | 导入依赖 `../electron/ailis-runtime.cjs`，使本文件可以复用外部模块能力。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 10 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 11 | <code>const execFileAsync = promisify(execFile);</code> | 声明局部标识符 `execFileAsync`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 12 | <code>const __filename = fileURLToPath(import.meta.url);</code> | 声明局部标识符 `__filename`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 13 | <code>const __dirname = path.dirname(__filename);</code> | 声明局部标识符 `__dirname`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 14 | <code>const projectRoot = path.resolve(__dirname, '..');</code> | 声明局部标识符 `projectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 15 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 16 | <code>const DEFAULT_QUIXBUGS_REPO = 'https://github.com/jkoppel/QuixBugs';</code> | 声明局部标识符 `DEFAULT_QUIXBUGS_REPO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 17 | <code>const DEFAULT_QUIXBUGS_DIR = path.join(projectRoot, 'build-cache', 'quixbugs');</code> | 声明局部标识符 `DEFAULT_QUIXBUGS_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 18 | <code>const DEFAULT_OUTPUT_DIR = path.join(projectRoot, 'eval-results', 'engineering', 'self-debug-quixbugs');</code> | 声明局部标识符 `DEFAULT_OUTPUT_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 19 | <code>const DEFAULT_PROGRAMS = ['bucketsort', 'find_in_sorted', 'flatten', 'gcd'];</code> | 声明局部标识符 `DEFAULT_PROGRAMS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 20 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 21 | <code>function parseArgs(argv = process.argv.slice(2)) {</code> | 定义函数 `parseArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 22 | <code>    const args = {</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 23 | <code>        benchmark: 'quixbugs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 24 | <code>        sourceDir: DEFAULT_QUIXBUGS_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 25 | <code>        repoUrl: DEFAULT_QUIXBUGS_REPO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 26 | <code>        outputDir: DEFAULT_OUTPUT_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 27 | <code>        programs: [...DEFAULT_PROGRAMS],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 28 | <code>        limit: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 29 | <code>        timeoutMs: 60000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 30 | <code>        mode: 'oracle-patch'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 31 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 32 | <code>    for (let index = 0; index &lt; argv.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 33 | <code>        const arg = argv[index];</code> | 声明局部标识符 `arg`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 34 | <code>        if (arg === '--source-dir') args.sourceDir = path.resolve(argv[++index] &#124;&#124; args.sourceDir);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 35 | <code>        else if (arg === '--repo-url') args.repoUrl = argv[++index] &#124;&#124; args.repoUrl;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 36 | <code>        else if (arg === '--output-dir') args.outputDir = path.resolve(argv[++index] &#124;&#124; args.outputDir);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 37 | <code>        else if (arg === '--programs') args.programs = String(argv[++index] &#124;&#124; '').split(/[,\s]+/).map((entry) =&gt; entry.trim()).filter(Boolean);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 38 | <code>        else if (arg === '--program') args.programs = [argv[++index] &#124;&#124; ''].filter(Boolean);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 39 | <code>        else if (arg === '--limit') args.limit = Number(argv[++index] &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 40 | <code>        else if (arg === '--timeout-ms') args.timeoutMs = Number(argv[++index] &#124;&#124; args.timeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 41 | <code>        else if (arg === '--mode') args.mode = argv[++index] &#124;&#124; args.mode;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 42 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 43 | <code>    if (args.limit &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 44 | <code>        args.programs = args.programs.slice(0, args.limit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 45 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 46 | <code>    return args;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>async function pathExists(filePath) {</code> | 定义函数 `pathExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 50 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 51 | <code>        await fs.access(filePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 52 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 54 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>async function runCommand(command, args = [], options = {}) {</code> | 定义函数 `runCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 59 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 60 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 61 | <code>        const result = await execFileAsync(command, args, {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 62 | <code>            cwd: options.cwd &#124;&#124; projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 63 | <code>            env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 64 | <code>                ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 65 | <code>                ...(options.env &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 66 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>            timeout: options.timeoutMs &#124;&#124; 60000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 68 | <code>            maxBuffer: 20 * 1024 * 1024,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 69 | <code>            windowsHide: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 70 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 71 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 72 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 73 | <code>            command: [command, ...args].join(' '),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 74 | <code>            cwd: options.cwd &#124;&#124; projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 75 | <code>            exitCode: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 76 | <code>            durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 77 | <code>            stdout: String(result.stdout &#124;&#124; '').slice(-12000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 78 | <code>            stderr: String(result.stderr &#124;&#124; '').slice(-12000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 79 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 80 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 81 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 82 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 83 | <code>            command: [command, ...args].join(' '),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 84 | <code>            cwd: options.cwd &#124;&#124; projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 85 | <code>            exitCode: typeof error.code === 'number' ? error.code : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 86 | <code>            signal: error.signal &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 87 | <code>            durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 88 | <code>            stdout: String(error.stdout &#124;&#124; '').slice(-12000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 89 | <code>            stderr: String(error.stderr &#124;&#124; error.message &#124;&#124; '').slice(-12000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 90 | <code>            error: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 91 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 93 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>async function ensureQuixBugs(args) {</code> | 定义函数 `ensureQuixBugs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 96 | <code>    if (await pathExists(path.join(args.sourceDir, '.git'))) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 97 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 98 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 99 | <code>            sourceDir: args.sourceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 100 | <code>            cloned: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 101 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>    await fs.mkdir(path.dirname(args.sourceDir), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 104 | <code>    const clone = await runCommand('git', ['clone', '--depth', '1', args.repoUrl, args.sourceDir], {</code> | 声明局部标识符 `clone`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 105 | <code>        cwd: projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 106 | <code>        timeoutMs: 120000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 107 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 109 | <code>        ok: clone.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 110 | <code>        sourceDir: args.sourceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 111 | <code>        cloned: clone.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 112 | <code>        clone</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 113 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>async function copyBenchmarkSource(sourceDir, targetDir) {</code> | 定义函数 `copyBenchmarkSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 117 | <code>    await fs.rm(targetDir, { recursive: true, force: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 118 | <code>    await fs.mkdir(path.dirname(targetDir), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 119 | <code>    await fs.cp(sourceDir, targetDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 120 | <code>        recursive: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 121 | <code>        filter: (entry) =&gt; !entry.includes(`${path.sep}.git${path.sep}`) &amp;&amp; !entry.endsWith(`${path.sep}.git`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 122 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 124 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 125 | <code>function normalizeText(text = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 126 | <code>    return String(text &#124;&#124; '').replace(/\r\n/g, '\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function splitPatchLines(text = '') {</code> | 定义函数 `splitPatchLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 130 | <code>    const normalized = normalizeText(text);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 131 | <code>    return normalized.endsWith('\n') ? normalized.slice(0, -1).split('\n') : normalized.split('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 132 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 134 | <code>function renderFullFilePatch(relativePath, oldText, newText) {</code> | 定义函数 `renderFullFilePatch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 135 | <code>    const oldLines = splitPatchLines(oldText);</code> | 声明局部标识符 `oldLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 136 | <code>    const newLines = splitPatchLines(newText);</code> | 声明局部标识符 `newLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 137 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>        `diff --git a/${relativePath} b/${relativePath}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 139 | <code>        `--- a/${relativePath}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 140 | <code>        `+++ b/${relativePath}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 141 | <code>        `@@ -1,${oldLines.length} +1,${newLines.length} @@`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 142 | <code>        ...oldLines.map((line) =&gt; `-${line}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 143 | <code>        ...newLines.map((line) =&gt; `+${line}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 144 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 145 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 146 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 148 | <code>function quixTestCommand(program) {</code> | 定义函数 `quixTestCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 149 | <code>    return `python -m pytest python_testcases/test_${program}.py -q`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 150 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>async function readProgramPatch(caseDir, program) {</code> | 定义函数 `readProgramPatch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 153 | <code>    const relativePath = `python_programs/${program}.py`;</code> | 声明局部标识符 `relativePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 154 | <code>    const buggyPath = path.join(caseDir, 'python_programs', `${program}.py`);</code> | 声明局部标识符 `buggyPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 155 | <code>    const correctPath = path.join(caseDir, 'correct_python_programs', `${program}.py`);</code> | 声明局部标识符 `correctPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 156 | <code>    const [buggy, correct] = await Promise.all([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 157 | <code>        fs.readFile(buggyPath, 'utf8'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 158 | <code>        fs.readFile(correctPath, 'utf8')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 159 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    return renderFullFilePatch(relativePath, buggy, correct);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 161 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>function summarizeCase(result) {</code> | 定义函数 `summarizeCase`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 164 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 165 | <code>        program: result.program,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 166 | <code>        status: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 167 | <code>        baselineFailed: result.metrics.baselineFailed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 168 | <code>        evidenceCollected: result.metrics.evidenceCollected,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 169 | <code>        diagnosisReady: result.metrics.diagnosisReady,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 170 | <code>        patchProposed: result.metrics.patchProposed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 171 | <code>        patchValidated: result.metrics.patchValidated,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 172 | <code>        approvalBlocked: result.metrics.approvalBlocked,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 173 | <code>        repaired: result.metrics.repaired,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 174 | <code>        validationPassed: result.metrics.validationPassed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 175 | <code>        durationMs: result.durationMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 176 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 177 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 179 | <code>async function runQuixBugsCase(args, program) {</code> | 定义函数 `runQuixBugsCase`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 180 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 181 | <code>    const caseDir = path.join(args.outputDir, 'cases', program, 'repo');</code> | 声明局部标识符 `caseDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 182 | <code>    await copyBenchmarkSource(args.sourceDir, caseDir);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 183 | <code>    const auditDir = path.join(args.outputDir, 'cases', program, '.ailis-state');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 184 | <code>    const runtime = new AILISRuntime({</code> | 声明局部标识符 `runtime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 185 | <code>        workspaceRoot: caseDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 186 | <code>        projectRoot: caseDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 187 | <code>        auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 188 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>    const runId = `self-debug-quixbugs-${program}`;</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 190 | <code>    const testCommand = quixTestCommand(program);</code> | 声明局部标识符 `testCommand`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 191 | <code>    const metrics = {</code> | 声明局部标识符 `metrics`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 192 | <code>        baselineFailed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 193 | <code>        evidenceCollected: false,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 194 | <code>        diagnosisReady: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 195 | <code>        patchProposed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 196 | <code>        patchValidated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 197 | <code>        approvalBlocked: false,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 198 | <code>        repaired: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 199 | <code>        validationPassed: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 200 | <code>        noUnauthorizedMutation: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 201 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 202 | <code>    const phases = {};</code> | 声明局部标识符 `phases`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 203 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 204 | <code>        await runtime.startRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 205 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 206 | <code>            sessionId: 'self-debug-eval',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 207 | <code>            message: `QuixBugs ${program} should repair failing tests.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 208 | <code>            planner: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 209 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>        const baseline = await runCommand('python', ['-m', 'pytest', `python_testcases/test_${program}.py`, '-q'], {</code> | 声明局部标识符 `baseline`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 211 | <code>            cwd: caseDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 212 | <code>            timeoutMs: args.timeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 213 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 214 | <code>        phases.baseline = baseline;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 215 | <code>        metrics.baselineFailed = baseline.ok === false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 217 | <code>        const opened = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `opened`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 218 | <code>            action: 'open_case',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 219 | <code>            bugReport: `Open-source QuixBugs benchmark failure for ${program}. Repair the buggy Python implementation so its pytest testcase passes.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 220 | <code>            affectedCapability: 'code_repair',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 221 | <code>            recentRunId: runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 222 | <code>            sourceHints: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 223 | <code>                `python_programs/${program}.py`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 224 | <code>                `python_testcases/test_${program}.py`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 225 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 227 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 228 | <code>            sessionId: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 229 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>        phases.openCase = opened.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 231 | <code>        const caseId = opened.details.case?.id &#124;&#124; '';</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>        const evidence = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 234 | <code>            action: 'collect_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 235 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 236 | <code>            maxFileChars: 20000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 237 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 238 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 239 | <code>            sessionId: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 240 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 241 | <code>        phases.collectEvidence = evidence.details;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 242 | <code>        metrics.evidenceCollected = evidence.details.status === 'completed' &amp;&amp; evidence.details.evidenceCount &gt;= 2;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 243 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 244 | <code>        const diagnosis = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `diagnosis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 245 | <code>            action: 'diagnose',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 246 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 247 | <code>            validationCommands: [testCommand]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 248 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 249 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 250 | <code>            sessionId: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 251 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 252 | <code>        phases.diagnose = diagnosis.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 253 | <code>        metrics.diagnosisReady = ['ready_for_patch_proposal', 'needs_more_evidence'].includes(diagnosis.details.diagnosis?.status);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 255 | <code>        const beforeApply = await fs.readFile(path.join(caseDir, 'python_programs', `${program}.py`), 'utf8');</code> | 声明局部标识符 `beforeApply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 256 | <code>        const candidateDiff = await readProgramPatch(caseDir, program);</code> | 声明局部标识符 `candidateDiff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 257 | <code>        const proposed = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `proposed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 258 | <code>            action: 'propose_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 259 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 260 | <code>            title: `QuixBugs ${program} repair`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 261 | <code>            candidateDiff,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 262 | <code>            validationCommands: [testCommand]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 263 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 264 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 265 | <code>            sessionId: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 266 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 267 | <code>        phases.proposePatch = proposed.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 268 | <code>        metrics.patchProposed = proposed.details.status === 'completed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>        const validated = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `validated`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 271 | <code>            action: 'validate_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 272 | <code>            caseId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 273 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 274 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 275 | <code>            sessionId: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 276 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>        phases.validatePatch = validated.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 278 | <code>        metrics.patchValidated = validated.details.status === 'completed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 279 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 280 | <code>        const blocked = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `blocked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 281 | <code>            action: 'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 282 | <code>            caseId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 283 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 284 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 285 | <code>            sessionId: 'self-debug-eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 286 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>        phases.applyWithoutApproval = blocked.details;</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 288 | <code>        const stillBeforeApply = await fs.readFile(path.join(caseDir, 'python_programs', `${program}.py`), 'utf8');</code> | 声明局部标识符 `stillBeforeApply`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 289 | <code>        metrics.approvalBlocked = blocked.details.status === 'needs_approval';</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 290 | <code>        metrics.noUnauthorizedMutation = stillBeforeApply === beforeApply;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 291 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 292 | <code>        const applied = await runtime.executeTool('self_debugger', {</code> | 声明局部标识符 `applied`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 293 | <code>            action: 'apply_patch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 294 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 295 | <code>            approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 296 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 297 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 298 | <code>            sessionId: 'self-debug-eval',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 299 | <code>            approved: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 300 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>        phases.applyPatch = applied.details;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 302 | <code>        metrics.repaired = applied.details.status === 'completed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 303 | <code>        metrics.validationPassed = applied.details.repairResult?.status === 'completed';</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 304 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 305 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 306 | <code>            program,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 307 | <code>            benchmark: 'QuixBugs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 308 | <code>            mode: args.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 309 | <code>            status: metrics.repaired &amp;&amp; metrics.validationPassed ? 'passed' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 310 | <code>            durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 311 | <code>            runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 312 | <code>            caseId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 313 | <code>            caseDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 314 | <code>            metrics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 315 | <code>            phases</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 316 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 318 | <code>        await runtime.shutdown().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 319 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 322 | <code>function buildSummary(cases) {</code> | 定义函数 `buildSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 323 | <code>    const total = cases.length;</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 324 | <code>    const count = (name) =&gt; cases.filter((entry) =&gt; entry.metrics[name]).length;</code> | 声明局部标识符 `count`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 325 | <code>    const passed = cases.filter((entry) =&gt; entry.status === 'passed').length;</code> | 声明局部标识符 `passed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 326 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 327 | <code>        total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 328 | <code>        passed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 329 | <code>        failed: total - passed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 330 | <code>        repairPassRate: total ? Number((passed / total).toFixed(4)) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 331 | <code>        baselineFailureRate: total ? Number((count('baselineFailed') / total).toFixed(4)) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 332 | <code>        evidenceCollectionRate: total ? Number((count('evidenceCollected') / total).toFixed(4)) : 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 333 | <code>        patchValidationRate: total ? Number((count('patchValidated') / total).toFixed(4)) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 334 | <code>        approvalBlockRate: total ? Number((count('approvalBlocked') / total).toFixed(4)) : 0,</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 335 | <code>        unauthorizedMutationRate: total ? Number(((total - count('noUnauthorizedMutation')) / total).toFixed(4)) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 336 | <code>        validationPassRate: total ? Number((count('validationPassed') / total).toFixed(4)) : 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 337 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 340 | <code>export async function runAILISSelfDebugEval(options = {}) {</code> | 定义函数 `runAILISSelfDebugEval`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 341 | <code>    const args = {</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 342 | <code>        ...parseArgs([]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 343 | <code>        ...options</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 344 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>    if (args.benchmark !== 'quixbugs') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 346 | <code>        throw new Error(`Unsupported self-debug benchmark: ${args.benchmark}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 347 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>    if (args.mode !== 'oracle-patch') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 349 | <code>        throw new Error(`Unsupported self-debug eval mode for this runner: ${args.mode}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 350 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>    await fs.mkdir(args.outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 352 | <code>    const benchmark = await ensureQuixBugs(args);</code> | 声明局部标识符 `benchmark`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 353 | <code>    if (!benchmark.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 354 | <code>        throw new Error(`Unable to prepare QuixBugs: ${benchmark.clone?.stderr &#124;&#124; benchmark.clone?.error &#124;&#124; 'unknown error'}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 355 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>    const cases = [];</code> | 声明局部标识符 `cases`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 357 | <code>    for (const program of args.programs) {</code> | 声明局部标识符 `program`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 358 | <code>        cases.push(await runQuixBugsCase(args, program));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 359 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>    const report = {</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 361 | <code>        ok: cases.every((entry) =&gt; entry.status === 'passed'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 362 | <code>        generatedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 363 | <code>        benchmark: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 364 | <code>            name: 'QuixBugs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 365 | <code>            sourceDir: args.sourceDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 366 | <code>            repoUrl: args.repoUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 367 | <code>            mode: args.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 368 | <code>            programs: args.programs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 369 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>        metrics: buildSummary(cases),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 371 | <code>        cases,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 372 | <code>        caseSummaries: cases.map(summarizeCase)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 373 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 374 | <code>    const reportPath = path.join(args.outputDir, 'self-debug-quixbugs.report.json');</code> | 声明局部标识符 `reportPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 375 | <code>    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 376 | <code>    report.output = reportPath;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 377 | <code>    return report;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 378 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 379 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 380 | <code>if (process.argv[1] &amp;&amp; path.resolve(process.argv[1]) === __filename) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 381 | <code>    const report = await runAILISSelfDebugEval(parseArgs());</code> | 声明局部标识符 `report`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 382 | <code>    console.log(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 383 | <code>        ok: report.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 384 | <code>        output: report.output,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 385 | <code>        benchmark: report.benchmark,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 386 | <code>        metrics: report.metrics,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 387 | <code>        cases: report.caseSummaries</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 388 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 389 | <code>    if (!report.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 390 | <code>        process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自调试运行时：分类失败、收集诊断、提出修复并保留审计证据。”这一文件职责。 |
| 391 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
