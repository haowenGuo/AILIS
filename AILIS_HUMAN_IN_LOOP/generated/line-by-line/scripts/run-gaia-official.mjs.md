# scripts/run-gaia-official.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：634
- SHA-256：`8dda42f2944ae91aecae855e73976c667089104440136134b9cbf1f87219282b`
- 可运行副本：[打开源文件](../../../source/scripts/run-gaia-official.mjs)
- 依赖：`node:fs/promises`、`node:fs`、`node:http`、`node:path`、`node:url`、`node:child_process`
- 主要符号：`__dirname`、`PROJECT_ROOT`、`DEFAULT_OUTPUT_DIR`、`DEFAULT_DATASET_DIR`、`DATASET_REPO`、`normalizeText`、`trimmed`、`safeFileSegment`、`parseLevels`、`text`、`levels`、`parseArgs`、`now`、`args`、`index`、`token`、`next`、`parsed`、`levelLabel`、`childEnv`、`env`、`runProcess`、`child`、`stdout`、`stderr`、`error`、`hasHfAuth`、`ensureHfAuth`、`downloadHubFile`、`localPath`、`metadataRepoPath`、`readParquetRows`、`py`、`result`、`readRowsFromResultCache`、`entries`、`files`、`fullPath`、`stat`、`goldByTaskId`、`summary`、`taskId`、`finalAnswer`、`rowsByTaskId`、`lines`、`item`、`question`、`rows`、`wanted`、`offsetRows`、`firstPresent`、`value`、`inferLevelFromMetadataPath`、`match`、`repoPathFromRow`、`rawFilePath`、`fileName`、`normalized`、`normalizeRow`、`level`、`repoFilePath`、`loadOfficialRows`、`metadataPaths`、`metadataRepoPaths`、`hasLocalMetadata`、`rawRows`、`stageQuestions`、`staged`、`fileByName`、`stagedFileName`、`stagedFilePath`、`cachedPath`、`repoPath`、`baseName`、`normalizeAnswerForScore`、`readRequestBody`、`chunks`、`createLocalScoringServer`、`server`、`url`、`payload`、`answers`、`perTask`、`gold`、`submitted`、`correct`、`correctCount`、`totalAttempted`、`requested`、`filePath`、`address`、`runLiteRunner`、`liteArgs`、`writeDesktopRealSourceArtifacts`、`sourceJsonlPath`、`sourceSummaryPath`、`writeDatasetManifest`、`manifest`、`manifestPath`、`main`、`sourceArtifacts`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2 | <code>import fsSync from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 5 | <code>import { fileURLToPath, pathToFileURL } from 'node:url';</code> | 导入依赖 `node:url`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 6 | <code>import { spawn } from 'node:child_process';</code> | 导入依赖 `node:child_process`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const __dirname = path.dirname(fileURLToPath(import.meta.url));</code> | 声明局部标识符 `__dirname`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 9 | <code>const PROJECT_ROOT = path.resolve(__dirname, '..');</code> | 声明局部标识符 `PROJECT_ROOT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 10 | <code>const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-official');</code> | 声明局部标识符 `DEFAULT_OUTPUT_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 11 | <code>const DEFAULT_DATASET_DIR = path.join(PROJECT_ROOT, 'build-cache', 'hf-datasets', 'gaia-benchmark-GAIA');</code> | 声明局部标识符 `DEFAULT_DATASET_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 12 | <code>const DATASET_REPO = 'gaia-benchmark/GAIA';</code> | 声明局部标识符 `DATASET_REPO`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 13 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 14 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>    if (typeof value === 'number' &amp;&amp; Number.isFinite(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 16 | <code>        return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 17 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 18 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 19 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 20 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 22 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 23 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 24 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 25 | <code>function safeFileSegment(value, fallback = 'item') {</code> | 定义函数 `safeFileSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 26 | <code>    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 180) &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 27 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>function parseLevels(value) {</code> | 定义函数 `parseLevels`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 30 | <code>    const text = normalizeText(value, '1').toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 31 | <code>    if (text === 'all') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 32 | <code>        return [1, 2, 3];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    const levels = [...new Set(text.split(/[,+\s]+/).map((item) =&gt; Number(item)).filter((item) =&gt; [1, 2, 3].includes(item)))];</code> | 声明局部标识符 `levels`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 35 | <code>    if (!levels.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 36 | <code>        throw new Error(`Invalid --levels value: ${value}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 37 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>    return levels.sort((a, b) =&gt; a - b);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 41 | <code>function parseArgs(argv = process.argv.slice(2)) {</code> | 定义函数 `parseArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 42 | <code>    const now = new Date().toISOString().replace(/[:.]/g, '-');</code> | 声明局部标识符 `now`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>    const args = {</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 44 | <code>        split: 'validation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>        levels: [1],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 46 | <code>        outputDir: DEFAULT_OUTPUT_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 47 | <code>        datasetDir: DEFAULT_DATASET_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 48 | <code>        runId: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>        username: 'AILIS-local-codex',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 50 | <code>        taskIds: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 51 | <code>        offset: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 52 | <code>        limit: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 53 | <code>        maxAgentSteps: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 54 | <code>        requestTimeoutMs: 300000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 55 | <code>        llmTimeoutMs: 120000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>        submitTimeoutMs: 120000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>        temperature: 0.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 58 | <code>        taskRetries: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>        downloadOnly: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 60 | <code>        skipDownload: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>        localSubmit: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 62 | <code>        directToolExecutor: /^(1&#124;true&#124;yes&#124;on)$/i.test(process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR &#124;&#124; '')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 63 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>    for (let index = 0; index &lt; argv.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 65 | <code>        const token = argv[index];</code> | 声明局部标识符 `token`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 66 | <code>        const next = () =&gt; argv[++index] &#124;&#124; '';</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>        if (token === '--split') args.split = normalizeText(next(), args.split).toLowerCase();</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 68 | <code>        else if (token === '--levels') args.levels = parseLevels(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 69 | <code>        else if (token === '--output-dir') args.outputDir = path.resolve(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 70 | <code>        else if (token === '--dataset-dir') args.datasetDir = path.resolve(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 71 | <code>        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 72 | <code>        else if (token === '--username') args.username = normalizeText(next(), args.username);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 73 | <code>        else if (token === '--task-ids') args.taskIds = next().split(/[,+\s]+/).map((item) =&gt; normalizeText(item)).filter(Boolean);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 74 | <code>        else if (token === '--offset') args.offset = Math.max(0, Number(next()) &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 75 | <code>        else if (token === '--limit') args.limit = Math.max(0, Number(next()) &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 76 | <code>        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) &#124;&#124; args.maxAgentSteps, 60));</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 77 | <code>        else if (token === '--request-timeout-ms') args.requestTimeoutMs = Math.max(30000, Number(next()) &#124;&#124; args.requestTimeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 78 | <code>        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = Math.max(30000, Number(next()) &#124;&#124; args.llmTimeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 79 | <code>        else if (token === '--submit-timeout-ms') args.submitTimeoutMs = Math.max(1000, Number(next()) &#124;&#124; args.submitTimeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 80 | <code>        else if (token === '--temperature') args.temperature = Math.min(Math.max(Number(next()) &#124;&#124; args.temperature, 0), 2);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 81 | <code>        else if (token === '--task-retries') {</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 82 | <code>            const parsed = Number(next());</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>            args.taskRetries = Math.max(0, Math.min(Number.isFinite(parsed) ? parsed : args.taskRetries, 3));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 84 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 85 | <code>        else if (token === '--download-only') args.downloadOnly = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 86 | <code>        else if (token === '--skip-download') args.skipDownload = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 87 | <code>        else if (token === '--local-submit') args.localSubmit = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 88 | <code>        else if (token === '--no-local-submit') args.localSubmit = false;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 89 | <code>        else if (token === '--direct-tool-executor') args.directToolExecutor = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 90 | <code>        else if (token === '--no-direct-tool-executor') args.directToolExecutor = false;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 91 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>    if (!['validation', 'test'].includes(args.split)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 93 | <code>        throw new Error(`Unsupported --split ${args.split}; expected validation or test.`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 94 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>    const levelLabel = args.levels.join('-');</code> | 声明局部标识符 `levelLabel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 96 | <code>    if (!args.runId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 97 | <code>        args.runId = `official-${args.split}-l${levelLabel}-${now}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 99 | <code>    args.outputDir = path.resolve(args.outputDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>    args.datasetDir = path.resolve(args.datasetDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>    args.stageFilesDir = path.join(args.outputDir, 'staged-files', args.runId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 102 | <code>    args.localSubmit = args.localSubmit ?? args.split === 'validation';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 103 | <code>    args.benchmarkName = `gaia-official-${args.split}-l${levelLabel}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>    return args;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 105 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 107 | <code>function childEnv() {</code> | 定义函数 `childEnv`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>    const env = { ...process.env };</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>    if (!env.HF_TOKEN &amp;&amp; env.HUGGINGFACE_HUB_TOKEN) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 110 | <code>        env.HF_TOKEN = env.HUGGINGFACE_HUB_TOKEN;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 111 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 112 | <code>    return env;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 113 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 115 | <code>function runProcess(command, args, options = {}) {</code> | 定义函数 `runProcess`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 116 | <code>    return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 117 | <code>        const child = spawn(command, args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>            cwd: options.cwd &#124;&#124; PROJECT_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>            env: options.env &#124;&#124; childEnv(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>            stdio: options.stdio &#124;&#124; ['ignore', 'pipe', 'pipe'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 121 | <code>            windowsHide: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 122 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>        let stdout = '';</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>        let stderr = '';</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 125 | <code>        if (child.stdout) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 126 | <code>            child.stdout.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>                stdout += chunk.toString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 128 | <code>                options.onStdout?.(chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 129 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>        if (child.stderr) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 132 | <code>            child.stderr.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>                stderr += chunk.toString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 134 | <code>                options.onStderr?.(chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>        child.on('error', reject);</code> | 注册事件处理：当用户操作、生命周期或运行时事件发生时调用相应逻辑。 |
| 138 | <code>        child.on('close', (code) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 139 | <code>            if (code === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 140 | <code>                resolve({ code, stdout, stderr });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 141 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 142 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>            const error = new Error(`${command} ${args.join(' ')} exited ${code}: ${stderr &#124;&#124; stdout}`);</code> | 声明局部标识符 `error`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 144 | <code>            error.code = code;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>            error.stdout = stdout;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 146 | <code>            error.stderr = stderr;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 147 | <code>            reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 148 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 149 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 152 | <code>async function hasHfAuth() {</code> | 定义函数 `hasHfAuth`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>    if (process.env.HF_TOKEN &#124;&#124; process.env.HUGGINGFACE_HUB_TOKEN) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 154 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 155 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 156 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 157 | <code>        await runProcess('hf', ['auth', 'whoami']);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 158 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 159 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 161 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 164 | <code>async function ensureHfAuth() {</code> | 定义函数 `ensureHfAuth`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>    if (await hasHfAuth()) {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 167 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>    throw new Error([</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 169 | <code>        `${DATASET_REPO} is gated and this machine is not logged in to Hugging Face.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>        'Run one of these first:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>        '  hf auth login',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>        'or set HF_TOKEN / HUGGINGFACE_HUB_TOKEN to a token that has accepted the GAIA dataset terms.'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 173 | <code>    ].join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 174 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 176 | <code>async function downloadHubFile(args, repoPath) {</code> | 定义函数 `downloadHubFile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 177 | <code>    const localPath = path.join(args.datasetDir, ...repoPath.split('/'));</code> | 声明局部标识符 `localPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>    if (args.skipDownload &amp;&amp; fsSync.existsSync(localPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 179 | <code>        return localPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 180 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>    if (fsSync.existsSync(localPath) &amp;&amp; fsSync.statSync(localPath).size &gt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 182 | <code>        return localPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 183 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    await fs.mkdir(args.datasetDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>    await runProcess('hf', [</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 186 | <code>        'download',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 187 | <code>        DATASET_REPO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 188 | <code>        repoPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 189 | <code>        '--repo-type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 190 | <code>        'dataset',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 191 | <code>        '--local-dir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 192 | <code>        args.datasetDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 193 | <code>        '--quiet'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 194 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>    if (!fsSync.existsSync(localPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>        throw new Error(`Downloaded ${repoPath}, but expected local file is missing: ${localPath}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 197 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>    return localPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 199 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>function metadataRepoPath(split, level) {</code> | 定义函数 `metadataRepoPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 202 | <code>    return `2023/${split}/metadata.level${level}.parquet`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 203 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 204 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 205 | <code>async function readParquetRows(metadataPaths) {</code> | 定义函数 `readParquetRows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>    const py = [</code> | 声明局部标识符 `py`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>        'import json, sys',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>        'import pandas as pd',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>        'rows=[]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 210 | <code>        'for p in sys.argv[1:]:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>        '    df=pd.read_parquet(p)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>        '    df=df.where(pd.notnull(df), None)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 213 | <code>        '    records=df.to_dict(orient="records")',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>        '    for r in records:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 215 | <code>        '        r["_metadata_path"]=p',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 216 | <code>        '        rows.append(r)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 217 | <code>        'print(json.dumps(rows, ensure_ascii=False))'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 218 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>    const result = await runProcess('python', ['-c', py, ...metadataPaths]);</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 220 | <code>    return JSON.parse(result.stdout &#124;&#124; '[]');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 221 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 223 | <code>async function readRowsFromResultCache(args, reason = '') {</code> | 定义函数 `readRowsFromResultCache`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 224 | <code>    const entries = await fs.readdir(args.outputDir, { withFileTypes: true }).catch(() =&gt; []);</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 225 | <code>    const files = await Promise.all(entries</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>        .filter((entry) =&gt; entry.isFile() &amp;&amp; /\.(jsonl&#124;summary\.json)$/i.test(entry.name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>        .map(async (entry) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 228 | <code>            const fullPath = path.join(args.outputDir, entry.name);</code> | 声明局部标识符 `fullPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 229 | <code>            const stat = await fs.stat(fullPath).catch(() =&gt; null);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 230 | <code>            return { name: entry.name, fullPath, mtimeMs: stat?.mtimeMs &#124;&#124; 0 };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>        }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>    files.sort((a, b) =&gt; b.mtimeMs - a.mtimeMs &#124;&#124; a.name.localeCompare(b.name));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 233 | <code>    const goldByTaskId = new Map();</code> | 声明局部标识符 `goldByTaskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 234 | <code>    for (const file of files.filter((entry) =&gt; /\.summary\.json$/i.test(entry.name))) {</code> | 声明局部标识符 `file`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 235 | <code>        const summary = JSON.parse(await fs.readFile(file.fullPath, 'utf8').catch(() =&gt; '{}') &#124;&#124; '{}');</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 236 | <code>        for (const item of summary?.score?.per_task &#124;&#124; []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 237 | <code>            const taskId = normalizeText(item.task_id);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 238 | <code>            const finalAnswer = normalizeText(item.final_answer);</code> | 声明局部标识符 `finalAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 239 | <code>            if (taskId &amp;&amp; finalAnswer &amp;&amp; !goldByTaskId.has(taskId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 240 | <code>                goldByTaskId.set(taskId, finalAnswer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>    const rowsByTaskId = new Map();</code> | 声明局部标识符 `rowsByTaskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 245 | <code>    for (const file of files.filter((entry) =&gt; /\.jsonl$/i.test(entry.name))) {</code> | 声明局部标识符 `file`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 246 | <code>        const lines = (await fs.readFile(file.fullPath, 'utf8').catch(() =&gt; '')).split(/\r?\n/).filter(Boolean);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 247 | <code>        for (const line of lines) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 248 | <code>            let item = null;</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 249 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 250 | <code>                item = JSON.parse(line);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 251 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 252 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 254 | <code>            if (item?.record_type &amp;&amp; item.record_type !== 'final') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 255 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 256 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>            const taskId = normalizeText(item.task_id);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 258 | <code>            const question = normalizeText(item.question);</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>            if (!taskId &#124;&#124; !question &#124;&#124; rowsByTaskId.has(taskId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 260 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 261 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>            rowsByTaskId.set(taskId, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 263 | <code>                task_id: taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 264 | <code>                question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 265 | <code>                level: Number(item.level) &#124;&#124; 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 266 | <code>                final_answer: goldByTaskId.get(taskId) &#124;&#124; normalizeText(item.final_answer),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 267 | <code>                source_file_name: normalizeText(item.file_name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 268 | <code>                source_file_path: normalizeText(item.file_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 269 | <code>                cached_file_path: normalizeText(item.file_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 270 | <code>                metadata_path: `cache:${path.basename(file.fullPath)}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 274 | <code>    let rows = [...rowsByTaskId.values()];</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 275 | <code>    if (args.taskIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 276 | <code>        const wanted = new Set(args.taskIds);</code> | 声明局部标识符 `wanted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 277 | <code>        rows = rows.filter((row) =&gt; wanted.has(row.task_id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 278 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 279 | <code>    if (!rows.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 280 | <code>        throw new Error(`Unable to recover GAIA rows from local result cache after parquet read failed: ${reason}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 281 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 282 | <code>    const offsetRows = rows.slice(args.offset);</code> | 声明局部标识符 `offsetRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 283 | <code>    return args.limit ? offsetRows.slice(0, args.limit) : offsetRows;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 286 | <code>function firstPresent(row, keys) {</code> | 定义函数 `firstPresent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 287 | <code>    for (const key of keys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 288 | <code>        const value = row?.[key];</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>        const text = normalizeText(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 290 | <code>        if (text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 291 | <code>            return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 292 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 294 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>function inferLevelFromMetadataPath(metadataPath) {</code> | 定义函数 `inferLevelFromMetadataPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 298 | <code>    const match = normalizeText(metadataPath).match(/metadata\.level(\d+)\.parquet/i);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 299 | <code>    return match ? Number(match[1]) : 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 300 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 301 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 302 | <code>function repoPathFromRow(row, split) {</code> | 定义函数 `repoPathFromRow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 303 | <code>    const rawFilePath = firstPresent(row, ['file_path', 'File path', 'filePath']);</code> | 声明局部标识符 `rawFilePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 304 | <code>    const fileName = firstPresent(row, ['file_name', 'File name', 'filename']);</code> | 声明局部标识符 `fileName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>    const normalized = rawFilePath.replace(/\\/g, '/').replace(/^\/+/, '');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 306 | <code>    if (normalized.startsWith('2023/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 307 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 308 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>    if (normalized.startsWith(`${split}/`)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 310 | <code>        return `2023/${normalized}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 311 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 312 | <code>    if (normalized &amp;&amp; normalized.includes('/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 313 | <code>        return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 314 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>    if (fileName) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 316 | <code>        return `2023/${split}/${fileName}`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 317 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>    return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 319 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 320 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 321 | <code>function normalizeRow(row, split) {</code> | 定义函数 `normalizeRow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 322 | <code>    const taskId = firstPresent(row, ['task_id', 'Task ID', 'taskId', 'id']);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 323 | <code>    const question = firstPresent(row, ['Question', 'question', 'Prompt', 'prompt']);</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 324 | <code>    const level = Number(firstPresent(row, ['Level', 'level'])) &#124;&#124; inferLevelFromMetadataPath(row._metadata_path);</code> | 声明局部标识符 `level`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 325 | <code>    const finalAnswer = firstPresent(row, ['Final answer', 'final_answer', 'answer', 'Final Answer']);</code> | 声明局部标识符 `finalAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 326 | <code>    const fileName = firstPresent(row, ['file_name', 'File name', 'filename']);</code> | 声明局部标识符 `fileName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 327 | <code>    const repoFilePath = repoPathFromRow(row, split);</code> | 声明局部标识符 `repoFilePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 328 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 329 | <code>        task_id: taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 330 | <code>        question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 331 | <code>        level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 332 | <code>        final_answer: finalAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 333 | <code>        source_file_name: fileName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 334 | <code>        source_file_path: repoFilePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 335 | <code>        metadata_path: row._metadata_path &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 336 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 337 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 339 | <code>async function loadOfficialRows(args) {</code> | 定义函数 `loadOfficialRows`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 340 | <code>    const metadataPaths = [];</code> | 声明局部标识符 `metadataPaths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 341 | <code>    const metadataRepoPaths = args.levels.map((level) =&gt; metadataRepoPath(args.split, level));</code> | 声明局部标识符 `metadataRepoPaths`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 342 | <code>    const hasLocalMetadata = args.skipDownload &amp;&amp; metadataRepoPaths.every((repoPath) =&gt; {</code> | 声明局部标识符 `hasLocalMetadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 343 | <code>        const localPath = path.join(args.datasetDir, ...repoPath.split('/'));</code> | 声明局部标识符 `localPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 344 | <code>        return fsSync.existsSync(localPath) &amp;&amp; fsSync.statSync(localPath).size &gt; 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 345 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>    if (!hasLocalMetadata) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 347 | <code>        await ensureHfAuth();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 348 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>    for (const repoPath of metadataRepoPaths) {</code> | 声明局部标识符 `repoPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 350 | <code>        metadataPaths.push(await downloadHubFile(args, repoPath));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 351 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>    let rawRows = [];</code> | 声明局部标识符 `rawRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 353 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 354 | <code>        rawRows = await readParquetRows(metadataPaths);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 355 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 356 | <code>        if (!args.skipDownload) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 357 | <code>            throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 358 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>        console.warn(`WARNING: parquet read failed; recovering GAIA rows from local result cache. ${error?.message &#124;&#124; String(error)}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 360 | <code>        return await readRowsFromResultCache(args, error?.message &#124;&#124; String(error));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 361 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>    let rows = rawRows.map((row) =&gt; normalizeRow(row, args.split))</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 363 | <code>        .filter((row) =&gt; row.task_id &amp;&amp; row.question);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 364 | <code>    if (args.taskIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 365 | <code>        const wanted = new Set(args.taskIds);</code> | 声明局部标识符 `wanted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 366 | <code>        rows = rows.filter((row) =&gt; wanted.has(row.task_id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 367 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 368 | <code>    const offsetRows = rows.slice(args.offset);</code> | 声明局部标识符 `offsetRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 369 | <code>    return args.limit ? offsetRows.slice(0, args.limit) : offsetRows;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 370 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 372 | <code>async function stageQuestions(args, rows) {</code> | 定义函数 `stageQuestions`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 373 | <code>    await fs.mkdir(args.stageFilesDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 374 | <code>    const staged = [];</code> | 声明局部标识符 `staged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 375 | <code>    const goldByTaskId = new Map();</code> | 声明局部标识符 `goldByTaskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 376 | <code>    const fileByName = new Map();</code> | 声明局部标识符 `fileByName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 377 | <code>    for (const row of rows) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 378 | <code>        let stagedFileName = '';</code> | 声明局部标识符 `stagedFileName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 379 | <code>        let stagedFilePath = '';</code> | 声明局部标识符 `stagedFilePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 380 | <code>        if (row.source_file_path &#124;&#124; row.source_file_name) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 381 | <code>            const cachedPath = normalizeText(row.cached_file_path &#124;&#124; row.source_file_path);</code> | 声明局部标识符 `cachedPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 382 | <code>            const repoPath = row.source_file_path &#124;&#124; repoPathFromRow(row, args.split);</code> | 声明局部标识符 `repoPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 383 | <code>            const localPath = cachedPath &amp;&amp; path.isAbsolute(cachedPath) &amp;&amp; fsSync.existsSync(cachedPath)</code> | 声明局部标识符 `localPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 384 | <code>                ? cachedPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 385 | <code>                : await downloadHubFile(args, repoPath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 386 | <code>            const baseName = path.basename(row.source_file_name &#124;&#124; repoPath);</code> | 声明局部标识符 `baseName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 387 | <code>            stagedFileName = `${safeFileSegment(row.task_id)}-${safeFileSegment(baseName, 'attachment')}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 388 | <code>            stagedFilePath = path.join(args.stageFilesDir, stagedFileName);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 389 | <code>            if (!fsSync.existsSync(stagedFilePath) &#124;&#124; fsSync.statSync(stagedFilePath).size !== fsSync.statSync(localPath).size) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 390 | <code>                await fs.copyFile(localPath, stagedFilePath);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 391 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>            fileByName.set(stagedFileName, stagedFilePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 393 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>        const question = {</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 395 | <code>            task_id: row.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 396 | <code>            question: row.question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 397 | <code>            level: row.level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 398 | <code>            file_name: stagedFileName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 399 | <code>            file_path: stagedFilePath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 400 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>        staged.push(question);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 402 | <code>        if (row.final_answer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 403 | <code>            goldByTaskId.set(row.task_id, row.final_answer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 404 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>    return { questions: staged, goldByTaskId, fileByName };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 407 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 408 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 409 | <code>function normalizeAnswerForScore(value) {</code> | 定义函数 `normalizeAnswerForScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 410 | <code>    return normalizeText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 411 | <code>        .replace(/\[(?:expression&#124;action&#124;tts&#124;bubble&#124;style):[^\]]+\]/gi, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 412 | <code>        .replace(/^final\s*answer\s*[:：]\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 413 | <code>        .replace(/^answer\s*[:：]\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 414 | <code>        .replace(/^答案\s*(?:是&#124;为)?\s*[:：]?\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 415 | <code>        .replace(/^the\s+answer\s+is\s+/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 416 | <code>        .replace(/[。.!！~～\s]*(?:哦&#124;呢&#124;呀)$/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 417 | <code>        .replace(/^["'“”‘’]+&#124;["'“”‘’]+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 418 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 419 | <code>        .trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 420 | <code>        .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 421 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 422 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 423 | <code>async function readRequestBody(request) {</code> | 定义函数 `readRequestBody`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 424 | <code>    const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 425 | <code>    for await (const chunk of request) {</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 426 | <code>        chunks.push(Buffer.from(chunk));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 427 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>    return Buffer.concat(chunks).toString('utf8');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 429 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>function createLocalScoringServer({ args, questions, goldByTaskId, fileByName }) {</code> | 定义函数 `createLocalScoringServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 432 | <code>    const server = http.createServer(async (request, response) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 433 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 434 | <code>            const url = new URL(request.url &#124;&#124; '/', 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 435 | <code>            if (request.method === 'GET' &amp;&amp; url.pathname === '/questions') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 436 | <code>                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 437 | <code>                response.end(JSON.stringify(questions.map((question) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 438 | <code>                    task_id: question.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 439 | <code>                    question: question.question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 440 | <code>                    level: question.level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 441 | <code>                    file_name: question.file_name &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 442 | <code>                }))));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 444 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 445 | <code>            if (request.method === 'POST' &amp;&amp; url.pathname === '/submit') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 446 | <code>                const payload = JSON.parse(await readRequestBody(request) &#124;&#124; '{}');</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 447 | <code>                const answers = Array.isArray(payload.answers) ? payload.answers : [];</code> | 声明局部标识符 `answers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 448 | <code>                const perTask = answers.map((answer) =&gt; {</code> | 声明局部标识符 `perTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 449 | <code>                    const taskId = normalizeText(answer.task_id);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 450 | <code>                    const gold = goldByTaskId.get(taskId) &#124;&#124; '';</code> | 声明局部标识符 `gold`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 451 | <code>                    const submitted = normalizeText(answer.submitted_answer);</code> | 声明局部标识符 `submitted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 452 | <code>                    const correct = Boolean(gold) &amp;&amp; normalizeAnswerForScore(submitted) === normalizeAnswerForScore(gold);</code> | 声明局部标识符 `correct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 453 | <code>                    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 454 | <code>                        task_id: taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 455 | <code>                        correct,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 456 | <code>                        submitted_answer: submitted,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 457 | <code>                        final_answer: gold</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 458 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 459 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>                const correctCount = perTask.filter((item) =&gt; item.correct).length;</code> | 声明局部标识符 `correctCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 461 | <code>                const totalAttempted = answers.length;</code> | 声明局部标识符 `totalAttempted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 462 | <code>                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 463 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 464 | <code>                    username: payload.username &#124;&#124; args.username,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 465 | <code>                    score: totalAttempted ? Number(((correctCount / totalAttempted) * 100).toFixed(2)) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 466 | <code>                    correct_count: correctCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 467 | <code>                    total_attempted: totalAttempted,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 468 | <code>                    message: `Local GAIA validation score: ${correctCount}/${totalAttempted}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 469 | <code>                    benchmark: args.benchmarkName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 470 | <code>                    per_task: perTask</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 471 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 473 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>            if (request.method === 'GET' &amp;&amp; url.pathname.startsWith('/files/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 475 | <code>                const requested = decodeURIComponent(url.pathname.slice('/files/'.length));</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 476 | <code>                const filePath = fileByName.get(requested);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 477 | <code>                if (!filePath &#124;&#124; !fsSync.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 478 | <code>                    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 479 | <code>                    response.end('file not found');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 480 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 481 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 482 | <code>                response.writeHead(200, { 'Content-Type': 'application/octet-stream' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 483 | <code>                fsSync.createReadStream(filePath).pipe(response);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 484 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 485 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 487 | <code>            response.end('not found');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 488 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 489 | <code>            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 490 | <code>            response.end(error?.stack &#124;&#124; error?.message &#124;&#124; String(error));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 491 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 492 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>    return new Promise((resolve) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 494 | <code>        server.listen(0, '127.0.0.1', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 495 | <code>            const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 496 | <code>            resolve({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 497 | <code>                server,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 498 | <code>                baseUrl: `http://127.0.0.1:${address.port}`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 499 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 500 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 504 | <code>async function runLiteRunner(args, baseUrl) {</code> | 定义函数 `runLiteRunner`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 505 | <code>    const liteArgs = [</code> | 声明局部标识符 `liteArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 506 | <code>        'scripts/run-gaia-level1-lite.mjs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 507 | <code>        '--output-dir', args.outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 508 | <code>        '--run-id', args.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 509 | <code>        '--scoring-api', baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 510 | <code>        '--file-mirror', `${baseUrl}/files`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 511 | <code>        '--username', args.username,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 512 | <code>        '--max-agent-steps', String(args.maxAgentSteps),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 513 | <code>        '--request-timeout-ms', String(args.requestTimeoutMs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 514 | <code>        '--llm-timeout-ms', String(args.llmTimeoutMs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 515 | <code>        '--submit-timeout-ms', String(args.submitTimeoutMs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 516 | <code>        '--temperature', String(args.temperature),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 517 | <code>        '--task-retries', String(args.taskRetries),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 518 | <code>        '--benchmark-name', args.benchmarkName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 519 | <code>        '--agent-code', `AILIS local AILIS Gateway ${args.benchmarkName} runner`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 520 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 521 | <code>    if (args.directToolExecutor) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 522 | <code>        liteArgs.push('--direct-tool-executor');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 523 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>    if (args.localSubmit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 525 | <code>        liteArgs.push('--submit');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 526 | <code>    } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 527 | <code>        liteArgs.push('--no-submit');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 528 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>    await runProcess('node', liteArgs, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 530 | <code>        cwd: PROJECT_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 531 | <code>        stdio: ['ignore', 'pipe', 'pipe'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 532 | <code>        onStdout: (chunk) =&gt; process.stdout.write(chunk),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 533 | <code>        onStderr: (chunk) =&gt; process.stderr.write(chunk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 534 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 536 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 537 | <code>async function writeDesktopRealSourceArtifacts(args, questions, goldByTaskId) {</code> | 定义函数 `writeDesktopRealSourceArtifacts`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 538 | <code>    const sourceJsonlPath = path.join(args.outputDir, `${args.runId}.desktop-source.jsonl`);</code> | 声明局部标识符 `sourceJsonlPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 539 | <code>    const sourceSummaryPath = path.join(args.outputDir, `${args.runId}.desktop-source.summary.json`);</code> | 声明局部标识符 `sourceSummaryPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 540 | <code>    const rows = questions.map((question, index) =&gt; ({</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 541 | <code>        record_type: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 542 | <code>        index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 543 | <code>        task_id: question.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 544 | <code>        question: question.question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 545 | <code>        level: question.level,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 546 | <code>        file_name: question.file_name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 547 | <code>        file_path: question.file_path &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 548 | <code>        final_answer: goldByTaskId.get(question.task_id) &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 549 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>    const summary = {</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 551 | <code>        benchmark: args.benchmarkName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 552 | <code>        runId: args.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 553 | <code>        sourceOnly: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 554 | <code>        questionCount: questions.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 555 | <code>        score: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 556 | <code>            per_task: rows.map((row) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 557 | <code>                task_id: row.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 558 | <code>                final_answer: row.final_answer</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 559 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 562 | <code>    await fs.writeFile(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 563 | <code>        sourceJsonlPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 564 | <code>        rows.map((row) =&gt; JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 565 | <code>        'utf8'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 566 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>    await fs.writeFile(sourceSummaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 568 | <code>    return { sourceJsonlPath, sourceSummaryPath };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 569 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 571 | <code>async function writeDatasetManifest(args, questions, goldByTaskId, sourceArtifacts = {}) {</code> | 定义函数 `writeDatasetManifest`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 572 | <code>    const manifest = {</code> | 声明局部标识符 `manifest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 573 | <code>        benchmark: args.benchmarkName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 574 | <code>        dataset: DATASET_REPO,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 575 | <code>        split: args.split,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 576 | <code>        levels: args.levels,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 577 | <code>        questionCount: questions.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 578 | <code>        questionsWithGold: [...goldByTaskId.keys()].length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 579 | <code>        stagedFilesDir: args.stageFilesDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 580 | <code>        sourceJsonlPath: sourceArtifacts.sourceJsonlPath &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 581 | <code>        sourceSummaryPath: sourceArtifacts.sourceSummaryPath &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 582 | <code>        outputDir: args.outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 583 | <code>        runId: args.runId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 584 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>    await fs.mkdir(args.outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 586 | <code>    const manifestPath = path.join(args.outputDir, `${args.runId}.dataset-manifest.json`);</code> | 声明局部标识符 `manifestPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 587 | <code>    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 588 | <code>    return manifestPath;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 589 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 590 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 591 | <code>async function main() {</code> | 定义函数 `main`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 592 | <code>    const args = parseArgs();</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 593 | <code>    await fs.mkdir(args.outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 594 | <code>    const rows = await loadOfficialRows(args);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 595 | <code>    const { questions, goldByTaskId, fileByName } = await stageQuestions(args, rows);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 596 | <code>    const sourceArtifacts = await writeDesktopRealSourceArtifacts(args, questions, goldByTaskId);</code> | 声明局部标识符 `sourceArtifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 597 | <code>    const manifestPath = await writeDatasetManifest(</code> | 声明局部标识符 `manifestPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 598 | <code>        args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 599 | <code>        questions,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 600 | <code>        goldByTaskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 601 | <code>        sourceArtifacts</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 602 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 603 | <code>    console.log(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 604 | <code>        status: 'dataset_ready',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 605 | <code>        benchmark: args.benchmarkName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 606 | <code>        split: args.split,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 607 | <code>        levels: args.levels,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 608 | <code>        questions: questions.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 609 | <code>        questionsWithGold: goldByTaskId.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 610 | <code>        attachments: fileByName.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 611 | <code>        ...sourceArtifacts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 612 | <code>        manifestPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 613 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 614 | <code>    if (args.downloadOnly) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 615 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 616 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>    const { server, baseUrl } = await createLocalScoringServer({ args, questions, goldByTaskId, fileByName });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 618 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 619 | <code>        await runLiteRunner(args, baseUrl);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 620 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 621 | <code>        await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 622 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 623 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 624 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 625 | <code>export {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 626 | <code>    writeDesktopRealSourceArtifacts</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 627 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 628 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 629 | <code>if (process.argv[1] &amp;&amp; import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 630 | <code>    main().catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 631 | <code>        console.error(error?.stack &#124;&#124; error?.message &#124;&#124; String(error));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 632 | <code>        process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 633 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 634 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
