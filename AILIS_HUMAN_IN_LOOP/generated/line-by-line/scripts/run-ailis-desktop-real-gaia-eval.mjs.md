# scripts/run-ailis-desktop-real-gaia-eval.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：1509
- SHA-256：`67087c54f25cdf8c2a3330907c4102977fb1abb2701e19f31ae27ec52ea161a1`
- 可运行副本：[打开源文件](../../../source/scripts/run-ailis-desktop-real-gaia-eval.mjs)
- 依赖：`node:fs/promises`、`node:fs`、`node:path`、`node:url`、`node:module`、`../electron/ailis-gateway.cjs`
- 主要符号：`require`、`__dirname`、`PROJECT_ROOT`、`DEFAULT_GAIA_DIR`、`DEFAULT_OUTPUT_DIR`、`DEFAULT_SOURCE_JSONL`、`DEFAULT_SOURCE_SUMMARY`、`normalizeText`、`trimmed`、`safeFileSegment`、`timestampId`、`parseBoolEnv`、`parseArgs`、`args`、`index`、`token`、`next`、`readJson`、`readJsonl`、`text`、`appendJsonl`、`loadDesktopStateSettings`、`appData`、`stateCandidates`、`mcpCandidates`、`preferences`、`statePath`、`state`、`mcpConfigPath`、`provider`、`baseUrl`、`model`、`apiKey`、`redactLlmSettings`、`loadGoldByTaskId`、`summary`、`map`、`taskId`、`finalAnswer`、`inferSummaryPath`、`direct`、`loadTasks`、`goldByTaskId`、`rows`、`seen`、`tasks`、`question`、`filePath`、`fileName`、`wanted`、`buildFileAttachment`、`stat`、`name`、`buildDesktopRealEvalTaskText`、`lines`、`fileLines`、`buildDesktopRealPayload`、`attachments`、`desktopRealEvalTaskText`、`fetchJsonWithTimeout`、`controller`、`timeout`、`response`、`body`、`callAgent`、`payload`、`startedAt`、`round`、`debugSessionId`、`stripControlTags`、`normalizeAnswerForScore`、`normalizeLexicalAnswerForScore`、`parseNumber`、`normalized`、`parsed`、`splitListAnswer`、`splitListAnswerInOrder`、`visibleContainsListParts`、`visible`、`required`、`cursor`、`requiredCounts`、`found`、`questionRequiresListOrder`、`answersEquivalent`、`left`、`right`、`leftNumber`、`rightNumber`、`leftList`、`rightList`、`lexicalLeft`、`lexicalRight`、`parseVisibleNumber`、`match`、`parseVisibleNumbers`、`isCountQuestion`、`getQuestionNumericScale`、`answersEquivalentForQuestion`、`questionText`、`normalizePlaceAlias`、`candidatePlace`、`goldPlace`、`goldNumber`、`candidateNumber`、`visibleNumbers`、`scale`、`expected`、`isIncompleteStatus`、`cleanCandidateLine`、`isLikelyIdentifierNoise`、`pushAnswerCandidate`、`answer`、`extractAnswerCandidatesFromVisibleText`、`candidates`、`patterns`、`compact`、`contextualPatterns`、`extractQuestionAwareAnswerCandidatesFromVisibleText`、`cleaned`、`extractScaledUnitAnswerCandidatesFromVisibleText`、`looksLikeStructuredAnswerShape`、`extractStructuredAnswerCandidates`、`scoreVisibleAnswer`、`displayText`、`normalizedGold`、`normalizedVisible`、`shortGold`、`goldParts`、`usageNumber`、`value`、`number`、`summarizeUsage`、`promptTokens`、`completionTokens`、`totalTokens`、`reasoningTokens`、`cachedTokens`、`addUsage`、`summarizeEvents`、`typeCounts`、`toolCalls`、`llmCalls`、`tokenUsageEvents`、`completedLlmCalls`、`type`、`callUsage`、`call`、`usageSource`、`usage`、`finishedToolCalls`、`toolErrors`、`quantile`、`sorted`、`formatPercent`、`estimateCostUsd`、`input`、`output`、`readExistingCompleted`、`completed`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2 | <code>import fsSync from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 3 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 4 | <code>import { fileURLToPath, pathToFileURL } from 'node:url';</code> | 导入依赖 `node:url`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 5 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 8 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 9 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 10 | <code>const __dirname = path.dirname(fileURLToPath(import.meta.url));</code> | 声明局部标识符 `__dirname`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 11 | <code>const PROJECT_ROOT = path.resolve(__dirname, '..');</code> | 声明局部标识符 `PROJECT_ROOT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 12 | <code>const DEFAULT_GAIA_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-official');</code> | 声明局部标识符 `DEFAULT_GAIA_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 13 | <code>const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-desktop-real');</code> | 声明局部标识符 `DEFAULT_OUTPUT_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 14 | <code>const DEFAULT_SOURCE_JSONL = path.join(DEFAULT_GAIA_DIR, 'ailis-l1-full-current-20260707.jsonl');</code> | 声明局部标识符 `DEFAULT_SOURCE_JSONL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 15 | <code>const DEFAULT_SOURCE_SUMMARY = path.join(DEFAULT_GAIA_DIR, 'ailis-l1-full-current-20260707.summary.json');</code> | 声明局部标识符 `DEFAULT_SOURCE_SUMMARY`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 16 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 17 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 18 | <code>    if (typeof value === 'number' &amp;&amp; Number.isFinite(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 19 | <code>        return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 20 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 22 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 23 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 24 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 25 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 26 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 27 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 28 | <code>function safeFileSegment(value, fallback = 'item') {</code> | 定义函数 `safeFileSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 29 | <code>    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 160) &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 30 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 32 | <code>function timestampId() {</code> | 定义函数 `timestampId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 33 | <code>    return new Date().toISOString().replace(/[:.]/g, '-');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 34 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 35 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 36 | <code>function parseBoolEnv(value = '') {</code> | 定义函数 `parseBoolEnv`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 37 | <code>    return /^(1&#124;true&#124;yes&#124;on)$/i.test(String(value &#124;&#124; ''));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 38 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>function parseArgs(argv = process.argv.slice(2)) {</code> | 定义函数 `parseArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 41 | <code>    const args = {</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 42 | <code>        sourceJsonl: DEFAULT_SOURCE_JSONL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 43 | <code>        sourceSummary: DEFAULT_SOURCE_SUMMARY,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 44 | <code>        outputDir: DEFAULT_OUTPUT_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>        runId: `desktop-real-gaia-l1-${timestampId()}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 46 | <code>        taskIds: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 47 | <code>        offset: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 48 | <code>        limit: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>        maxAgentSteps: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 50 | <code>        requestTimeoutMs: 300000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 51 | <code>        llmTimeoutMs: 120000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 52 | <code>        temperature: 0.2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 53 | <code>        startGateway: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 54 | <code>        gatewayUrl: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 55 | <code>        workspaceRoot: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>        isolatedWorkspace: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 57 | <code>        directToolExecutor: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 58 | <code>        agentRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 59 | <code>        debugBreakAfterRound: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 60 | <code>        debugRounds: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>        planOnly: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 62 | <code>        resume: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 63 | <code>        codexModelBridge: parseBoolEnv(process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 64 | <code>        codexModel: normalizeText(process.env.AILIS_CODEX_MODEL, 'gpt-5.5'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 65 | <code>        codexReasoningEffort: normalizeText(process.env.AILIS_CODEX_REASONING_EFFORT, 'medium'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 66 | <code>        costInputPerMillion: Number(process.env.AILIS_EVAL_INPUT_USD_PER_1M &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 67 | <code>        costOutputPerMillion: Number(process.env.AILIS_EVAL_OUTPUT_USD_PER_1M &#124;&#124; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 70 | <code>    for (let index = 0; index &lt; argv.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 71 | <code>        const token = argv[index];</code> | 声明局部标识符 `token`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 72 | <code>        const next = () =&gt; argv[++index] &#124;&#124; '';</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 73 | <code>        if (token === '--source-jsonl') args.sourceJsonl = path.resolve(next());</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 74 | <code>        else if (token === '--source-summary') args.sourceSummary = path.resolve(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 75 | <code>        else if (token === '--output-dir') args.outputDir = path.resolve(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 76 | <code>        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 77 | <code>        else if (token === '--task-ids') args.taskIds = next().split(/[,+\s]+/).map((item) =&gt; normalizeText(item)).filter(Boolean);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 78 | <code>        else if (token === '--offset') args.offset = Math.max(0, Number(next()) &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 79 | <code>        else if (token === '--limit') args.limit = Math.max(0, Number(next()) &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 80 | <code>        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) &#124;&#124; args.maxAgentSteps, 80));</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 81 | <code>        else if (token === '--request-timeout-ms') args.requestTimeoutMs = Math.max(30000, Number(next()) &#124;&#124; args.requestTimeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 82 | <code>        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = Math.max(30000, Number(next()) &#124;&#124; args.llmTimeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 83 | <code>        else if (token === '--temperature') args.temperature = Math.min(Math.max(Number(next()) &#124;&#124; args.temperature, 0), 2);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 84 | <code>        else if (token === '--gateway-url') {</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 85 | <code>            args.gatewayUrl = normalizeText(next()).replace(/\/+$/, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 86 | <code>            args.startGateway = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 87 | <code>        } else if (token === '--start-gateway') args.startGateway = true;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 88 | <code>        else if (token === '--no-start-gateway') args.startGateway = false;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 89 | <code>        else if (token === '--workspace-root') args.workspaceRoot = path.resolve(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 90 | <code>        else if (token === '--isolated-workspace') args.isolatedWorkspace = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 91 | <code>        else if (token === '--desktop-workspace') args.isolatedWorkspace = false;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 92 | <code>        else if (token === '--direct-tool-executor') args.directToolExecutor = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 93 | <code>        else if (token === '--no-direct-tool-executor') args.directToolExecutor = false;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 94 | <code>        else if (token === '--agent-role') args.agentRole = normalizeText(next(), args.agentRole);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 95 | <code>        else if (token === '--debug-break-after-round') args.debugBreakAfterRound = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 96 | <code>        else if (token === '--debug-rounds') {</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 97 | <code>            args.debugBreakAfterRound = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 98 | <code>            args.debugRounds = Math.max(1, Math.min(Number(next()) &#124;&#124; 1, args.maxAgentSteps));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 99 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>        else if (token === '--plan-only') args.planOnly = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 101 | <code>        else if (token === '--resume') args.resume = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 102 | <code>        else if (token === '--no-resume') args.resume = false;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 103 | <code>        else if (token === '--codex-model-bridge') args.codexModelBridge = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 104 | <code>        else if (token === '--codex-model') args.codexModel = normalizeText(next(), args.codexModel);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 105 | <code>        else if (token === '--codex-reasoning-effort') args.codexReasoningEffort = normalizeText(next(), args.codexReasoningEffort);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 106 | <code>        else if (token === '--cost-input-per-1m') args.costInputPerMillion = Number(next()) &#124;&#124; 0;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 107 | <code>        else if (token === '--cost-output-per-1m') args.costOutputPerMillion = Number(next()) &#124;&#124; 0;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 108 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>    args.outputDir = path.resolve(args.outputDir);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>    args.resultPath = path.join(args.outputDir, `${args.runId}.jsonl`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>    args.summaryPath = path.join(args.outputDir, `${args.runId}.summary.json`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 113 | <code>    args.reportPath = path.join(args.outputDir, `${args.runId}.report.md`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 114 | <code>    args.progressPath = path.join(args.outputDir, `${args.runId}.progress.jsonl`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 115 | <code>    args.auditDir = path.join(args.outputDir, 'gateway-audit', args.runId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 116 | <code>    args.workspaceRoot = args.isolatedWorkspace</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>        ? path.join(PROJECT_ROOT, 'tmp', `ailis-desktop-real-gaia-workspace-${safeFileSegment(args.runId)}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>        : path.resolve(args.workspaceRoot &#124;&#124; PROJECT_ROOT);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>    args.workspaceMode = args.isolatedWorkspace ? 'isolated_temp_workspace' : 'desktop_project_workspace';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>    return args;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 121 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>async function readJson(filePath, fallback = null) {</code> | 定义函数 `readJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 125 | <code>        return JSON.parse((await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, ''));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 126 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 128 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 129 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 131 | <code>async function readJsonl(filePath) {</code> | 定义函数 `readJsonl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 132 | <code>    const text = (await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>    return text</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 134 | <code>        .split(/\r?\n/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>        .map((line) =&gt; line.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 136 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 137 | <code>        .map((line, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 138 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 139 | <code>                return JSON.parse(line);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>            } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 141 | <code>                error.message = `${filePath}:${index + 1}: ${error.message}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>                throw error;</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 143 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 144 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 145 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 147 | <code>async function appendJsonl(filePath, value) {</code> | 定义函数 `appendJsonl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 148 | <code>    await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 149 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>function loadDesktopStateSettings(args) {</code> | 定义函数 `loadDesktopStateSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 152 | <code>    const appData = process.env.APPDATA &#124;&#124; path.join(process.env.USERPROFILE &#124;&#124; '', 'AppData', 'Roaming');</code> | 声明局部标识符 `appData`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 153 | <code>    const stateCandidates = [</code> | 声明局部标识符 `stateCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 154 | <code>        path.join(appData, 'ailis', 'desktop-state.json'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>        path.join(appData, 'AILIS', 'desktop-state.json')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 156 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 157 | <code>    const mcpCandidates = [</code> | 声明局部标识符 `mcpCandidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 158 | <code>        path.join(appData, 'ailis', 'ailis-gateway', 'mcp-servers.json'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 159 | <code>        path.join(appData, 'AILIS', 'ailis-gateway', 'mcp-servers.json'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>        path.join(PROJECT_ROOT, '.ailis-state', 'mcp-servers.json')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 161 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    let preferences = {};</code> | 声明局部标识符 `preferences`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 163 | <code>    let statePath = '';</code> | 声明局部标识符 `statePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 164 | <code>    for (const candidate of stateCandidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>        if (!fsSync.existsSync(candidate)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 166 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 167 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 169 | <code>            const state = JSON.parse(fsSync.readFileSync(candidate, 'utf8'));</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 170 | <code>            preferences = state.preferences &#124;&#124; state.state?.preferences &#124;&#124; {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 171 | <code>            statePath = candidate;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>        } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 174 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>    const mcpConfigPath = mcpCandidates.find((candidate) =&gt; fsSync.existsSync(candidate)) &#124;&#124; '';</code> | 声明局部标识符 `mcpConfigPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 176 | <code>    if (args.codexModelBridge) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 177 | <code>        process.env.AILIS_CODEX_REASONING_EFFORT = args.codexReasoningEffort;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>            statePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 180 | <code>            mcpConfigPath,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 181 | <code>            llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 182 | <code>                provider: 'codex-model-bridge',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>                baseUrl: 'codex://chatgpt-oauth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 184 | <code>                model: args.codexModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 185 | <code>                apiKey: '',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 186 | <code>                authMode: 'chatgpt_oauth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 187 | <code>                reasoningEffort: args.codexReasoningEffort,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 188 | <code>                temperature: args.temperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 189 | <code>                timeoutMs: args.llmTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 190 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>    const provider = normalizeText(</code> | 声明局部标识符 `provider`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 194 | <code>        preferences.llmProvider &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>            process.env.AILIS_AGENT_LLM_PROVIDER &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>            process.env.AILIS_LLM_PROVIDER &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 197 | <code>            'openai-compatible'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 198 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>    const baseUrl = normalizeText(</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 200 | <code>        preferences.llmBaseUrl &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 201 | <code>            process.env.AILIS_AGENT_LLM_BASE_URL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 202 | <code>            process.env.AILIS_LLM_BASE_URL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>            process.env.OPENAI_COMPATIBLE_BASE_URL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    const model = normalizeText(</code> | 声明局部标识符 `model`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>        preferences.llmModel &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>            process.env.AILIS_AGENT_LLM_MODEL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>            process.env.AILIS_LLM_MODEL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 210 | <code>            process.env.OPENAI_COMPATIBLE_MODEL &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>    const apiKey = normalizeText(</code> | 声明局部标识符 `apiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>        preferences.llmApiKey &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 215 | <code>            process.env.AILIS_AGENT_LLM_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 216 | <code>            process.env.AILIS_LLM_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 217 | <code>            process.env.OPENAI_COMPATIBLE_API_KEY &#124;&#124;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 218 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 221 | <code>        statePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 222 | <code>        mcpConfigPath,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 223 | <code>        llmSettings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 224 | <code>            provider,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 225 | <code>            baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>            model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>            apiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 228 | <code>            temperature: args.temperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 229 | <code>            timeoutMs: args.llmTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 230 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 234 | <code>function redactLlmSettings(settings = {}) {</code> | 定义函数 `redactLlmSettings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 235 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 236 | <code>        provider: settings.provider &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 237 | <code>        baseUrl: settings.baseUrl &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 238 | <code>        model: settings.model &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 239 | <code>        authMode: settings.authMode &#124;&#124; (settings.apiKey ? 'api_key' : ''),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 240 | <code>        reasoningEffort: settings.reasoningEffort &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 241 | <code>        temperature: settings.temperature,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 242 | <code>        timeoutMs: settings.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 243 | <code>        apiKey: settings.apiKey ? `__REDACTED_${String(settings.apiKey).length}__` : ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 244 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 247 | <code>async function loadGoldByTaskId(summaryPath) {</code> | 定义函数 `loadGoldByTaskId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 248 | <code>    const summary = await readJson(summaryPath, {});</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 249 | <code>    const map = new Map();</code> | 声明局部标识符 `map`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 250 | <code>    for (const item of summary?.score?.per_task &#124;&#124; []) {</code> | 声明局部标识符 `item`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 251 | <code>        const taskId = normalizeText(item.task_id);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 252 | <code>        const finalAnswer = normalizeText(item.final_answer);</code> | 声明局部标识符 `finalAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 253 | <code>        if (taskId &amp;&amp; finalAnswer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 254 | <code>            map.set(taskId, finalAnswer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>    return map;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 258 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 260 | <code>function inferSummaryPath(sourceJsonl) {</code> | 定义函数 `inferSummaryPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 261 | <code>    const direct = sourceJsonl.replace(/\.jsonl$/i, '.summary.json');</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 262 | <code>    return fsSync.existsSync(direct) ? direct : DEFAULT_SOURCE_SUMMARY;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 263 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 265 | <code>async function loadTasks(args) {</code> | 定义函数 `loadTasks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 266 | <code>    if (!fsSync.existsSync(args.sourceJsonl)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 267 | <code>        throw new Error(`Source GAIA jsonl not found: ${args.sourceJsonl}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 268 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>    if (!fsSync.existsSync(args.sourceSummary)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 270 | <code>        args.sourceSummary = inferSummaryPath(args.sourceJsonl);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 272 | <code>    const goldByTaskId = await loadGoldByTaskId(args.sourceSummary);</code> | 声明局部标识符 `goldByTaskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 273 | <code>    const rows = await readJsonl(args.sourceJsonl);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 274 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 275 | <code>    let tasks = rows</code> | 声明局部标识符 `tasks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 276 | <code>        .filter((row) =&gt; !row.record_type &#124;&#124; row.record_type === 'final')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 277 | <code>        .map((row, index) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 278 | <code>            const taskId = normalizeText(row.task_id &#124;&#124; row.taskId &#124;&#124; row.id);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 279 | <code>            const question = normalizeText(row.question &#124;&#124; row.prompt);</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 280 | <code>            const filePath = normalizeText(row.file_path &#124;&#124; row.cached_file_path);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 281 | <code>            const fileName = normalizeText(row.file_name &#124;&#124; (filePath ? path.basename(filePath) : ''));</code> | 声明局部标识符 `fileName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 282 | <code>            const finalAnswer = normalizeText(row.final_answer &#124;&#124; row.expected_answer &#124;&#124; goldByTaskId.get(taskId));</code> | 声明局部标识符 `finalAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 283 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 284 | <code>                index: Number.isFinite(Number(row.index)) ? Number(row.index) : index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 285 | <code>                task_id: taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 286 | <code>                question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 287 | <code>                file_name: fileName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 288 | <code>                file_path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>                final_answer: finalAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 290 | <code>                source_record_type: row.record_type &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 291 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 292 | <code>        })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 293 | <code>        .filter((task) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 294 | <code>            if (!task.task_id &#124;&#124; !task.question &#124;&#124; seen.has(task.task_id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 295 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 296 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>            seen.add(task.task_id);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 298 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 299 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 300 | <code>    if (args.taskIds.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 301 | <code>        const wanted = new Set(args.taskIds);</code> | 声明局部标识符 `wanted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 302 | <code>        tasks = tasks.filter((task) =&gt; wanted.has(task.task_id));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 303 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 304 | <code>    tasks = tasks.slice(args.offset);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>    if (args.limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 306 | <code>        tasks = tasks.slice(0, args.limit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 307 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>    return tasks;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 309 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>function buildFileAttachment(task) {</code> | 定义函数 `buildFileAttachment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 312 | <code>    const filePath = normalizeText(task.file_path);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 313 | <code>    if (!filePath &#124;&#124; !path.isAbsolute(filePath) &#124;&#124; !fsSync.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 314 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 315 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    const stat = fsSync.statSync(filePath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 317 | <code>    const name = normalizeText(task.file_name, path.basename(filePath));</code> | 声明局部标识符 `name`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 318 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 319 | <code>        type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 320 | <code>        id: `gaia-file-${task.task_id}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 321 | <code>        source: 'gaia-local-file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 322 | <code>        label: name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 323 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 324 | <code>        path: filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 325 | <code>        extension: path.extname(name).toLowerCase(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 326 | <code>        kind: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 327 | <code>        size: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 328 | <code>        modifiedAt: stat.mtime.toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 329 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 332 | <code>function buildDesktopRealEvalTaskText(task, attachments = []) {</code> | 定义函数 `buildDesktopRealEvalTaskText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 333 | <code>    const lines = [task.question];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 334 | <code>    const fileLines = attachments</code> | 声明局部标识符 `fileLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 335 | <code>        .filter((attachment) =&gt; attachment?.path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 336 | <code>        .map((attachment, index) =&gt; (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 337 | <code>            `${index + 1}. ${attachment.name &#124;&#124; path.basename(attachment.path)} &#124; path=${attachment.path} &#124; kind=${attachment.kind &#124;&#124; 'file'} &#124; size=${attachment.size &#124;&#124; 0}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 338 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 339 | <code>    if (fileLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 340 | <code>        lines.push('', 'Attached files available to the task:', ...fileLines);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 341 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>    return lines.join('\n');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 343 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 344 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 345 | <code>function buildDesktopRealPayload({ args, task, llmSettings }) {</code> | 定义函数 `buildDesktopRealPayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 346 | <code>    const attachments = [buildFileAttachment(task)].filter(Boolean);</code> | 声明局部标识符 `attachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 347 | <code>    const desktopRealEvalTaskText = buildDesktopRealEvalTaskText(task, attachments);</code> | 声明局部标识符 `desktopRealEvalTaskText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 348 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 349 | <code>        sessionId: `desktop-real-gaia-${args.runId}-${task.task_id}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 350 | <code>        message: task.question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 351 | <code>        messageHistory: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 352 | <code>        attachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 353 | <code>        agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 354 | <code>        planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 355 | <code>        answerOnly: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 356 | <code>        exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 357 | <code>        memoryPolicy: 'disabled',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 358 | <code>        executionProfile: { kind: 'exact_answer_eval', answerOnly: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 359 | <code>        maxAgentSteps: args.maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 360 | <code>        maxSteps: args.maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 361 | <code>        llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 362 | <code>        directToolExecutor: args.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 363 | <code>        nativeDirectTools: args.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 364 | <code>        debugBreakAfterRound: args.debugBreakAfterRound,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 365 | <code>        context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 366 | <code>            workspace: args.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 367 | <code>            agentLoop: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 368 | <code>            planner: 'llm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 369 | <code>            answerOnly: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 370 | <code>            exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 371 | <code>            memoryPolicy: 'disabled',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 372 | <code>            executionProfile: { kind: 'exact_answer_eval', answerOnly: true },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 373 | <code>            evaluationTaskId: task.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 374 | <code>            evaluationName: 'gaia_desktop_real',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 375 | <code>            maxAgentSteps: args.maxAgentSteps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 376 | <code>            llmSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 377 | <code>            directToolExecutor: args.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 378 | <code>            nativeDirectTools: args.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 379 | <code>            debugBreakAfterRound: args.debugBreakAfterRound,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 380 | <code>            agentRole: args.agentRole,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 381 | <code>            desktopRealEval: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 382 | <code>            desktopRealEvalTaskId: task.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 383 | <code>            desktopRealEvalTaskText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 384 | <code>            desktopRealEvalWorkspaceMode: args.workspaceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 385 | <code>            approved: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 386 | <code>            autoConfirm: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 387 | <code>            approvalPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 388 | <code>            confirmationPolicy: 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 389 | <code>            visionPermissionPolicy: 'auto',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 390 | <code>            computerControlEnabled: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 391 | <code>            executeExternal: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 392 | <code>            allowOutsideWorkspace: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 393 | <code>            allowComputerWideAccess: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 394 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 395 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 396 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 398 | <code>async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 120000) {</code> | 定义函数 `fetchJsonWithTimeout`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 399 | <code>    const controller = new AbortController();</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 400 | <code>    const timeout = setTimeout(() =&gt; controller.abort(), timeoutMs);</code> | 声明局部标识符 `timeout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 401 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 402 | <code>        const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 403 | <code>            ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 404 | <code>            signal: controller.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 405 | <code>            headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 406 | <code>                'Content-Type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 407 | <code>                ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 408 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 410 | <code>        const body = await response.json().catch(() =&gt; ({}));</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 411 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 412 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 413 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 414 | <code>                status: `http_${response.status}`,</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 415 | <code>                error: body.error &#124;&#124; body.message &#124;&#124; `HTTP ${response.status}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 416 | <code>                body</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 417 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 418 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 419 | <code>        return body;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 420 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 421 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 422 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 423 | <code>            status: error?.name === 'AbortError' ? 'timeout' : 'network_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 424 | <code>            error: error?.name === 'AbortError' ? `request timeout ${timeoutMs}ms` : error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 425 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 427 | <code>        clearTimeout(timeout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 428 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 430 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 431 | <code>async function callAgent({ args, gateway, baseUrl, task, llmSettings }) {</code> | 定义函数 `callAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 432 | <code>    const payload = buildDesktopRealPayload({ args, task, llmSettings });</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 433 | <code>    const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 434 | <code>    if (gateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 435 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 436 | <code>            let response = await gateway.runAgent(payload);</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 437 | <code>            for (let round = 1; round &lt; args.debugRounds; round += 1) {</code> | 声明局部标识符 `round`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 438 | <code>                const debugSessionId = normalizeText(</code> | 声明局部标识符 `debugSessionId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 439 | <code>                    response?.debugSessionId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 440 | <code>                    response?.summary?.debugSessionId &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 441 | <code>                    response?.result?.debugSessionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 442 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>                if (response?.status !== 'debug_paused' &#124;&#124; !debugSessionId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 444 | <code>                    break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 445 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 446 | <code>                response = await gateway.runAgent({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 447 | <code>                    ...payload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 448 | <code>                    debugSessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 449 | <code>                    context: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 450 | <code>                        ...payload.context,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 451 | <code>                        debugSessionId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 452 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 454 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 456 | <code>                response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 457 | <code>                durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 458 | <code>                payloadPreview: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 459 | <code>                    sessionId: payload.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 460 | <code>                    directToolExecutor: payload.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 461 | <code>                    agentRole: payload.context.agentRole,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 462 | <code>                    attachments: payload.attachments.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 463 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 464 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 466 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 467 | <code>                response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 468 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 469 | <code>                    status: 'gateway_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 470 | <code>                    error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 471 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>                durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 473 | <code>                payloadPreview: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 474 | <code>                    sessionId: payload.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 475 | <code>                    directToolExecutor: payload.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 476 | <code>                    agentRole: payload.context.agentRole,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 477 | <code>                    attachments: payload.attachments.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 478 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 482 | <code>    const response = await fetchJsonWithTimeout(`${baseUrl}/agent/run`, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 483 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 484 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 485 | <code>    }, args.requestTimeoutMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 486 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 487 | <code>        response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 488 | <code>        durationMs: Date.now() - startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 489 | <code>        payloadPreview: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 490 | <code>            sessionId: payload.sessionId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 491 | <code>            directToolExecutor: payload.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 492 | <code>            agentRole: payload.context.agentRole,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 493 | <code>            attachments: payload.attachments.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 494 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 495 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 497 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 498 | <code>function stripControlTags(value = '') {</code> | 定义函数 `stripControlTags`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 499 | <code>    return normalizeText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 500 | <code>        .replace(/\[(?:expression&#124;action&#124;tts&#124;bubble&#124;style&#124;emotion&#124;gesture)[^\]]*]/gi, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 501 | <code>        .replace(/&lt;[^&gt;\n]{1,80}&gt;/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 502 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 503 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 504 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 505 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 506 | <code>function normalizeAnswerForScore(value = '') {</code> | 定义函数 `normalizeAnswerForScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 507 | <code>    return stripControlTags(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 508 | <code>        .replace(/^final\s*answer\s*[:：]\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 509 | <code>        .replace(/^answer\s*[:：]\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 510 | <code>        .replace(/^the\s+answer\s+is\s+/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 511 | <code>        .replace(/^答案\s*(?:是&#124;为)?\s*[:：]?\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 512 | <code>        .replace(/^最终答案\s*(?:是&#124;为)?\s*[:：]?\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 513 | <code>        .replace(/^["'“”‘’]+&#124;["'“”‘’]+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 514 | <code>        .replace(/[。.!！~～]+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 515 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 516 | <code>        .trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 517 | <code>        .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 518 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 519 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 520 | <code>function normalizeLexicalAnswerForScore(value = '') {</code> | 定义函数 `normalizeLexicalAnswerForScore`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 521 | <code>    return normalizeAnswerForScore(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 522 | <code>        .normalize('NFKD')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 523 | <code>        .replace(/[\u0300-\u036f]/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 524 | <code>        .replace(/&amp;/g, ' and ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 525 | <code>        .replace(/[\p{P}\p{S}_]+/gu, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 526 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 527 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 528 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 530 | <code>function parseNumber(value = '') {</code> | 定义函数 `parseNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 531 | <code>    const normalized = normalizeAnswerForScore(value).replace(/,/g, '');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 532 | <code>    if (!/^[+-]?(?:\d+\.?\d*&#124;\.\d+)$/.test(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 533 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 534 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>    const parsed = Number(normalized);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 536 | <code>    return Number.isFinite(parsed) ? parsed : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 537 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 538 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 539 | <code>function splitListAnswer(value = '') {</code> | 定义函数 `splitListAnswer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 540 | <code>    const normalized = normalizeAnswerForScore(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 541 | <code>    if (!normalized &#124;&#124; !/[;,，、]/.test(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 542 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 543 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>    return normalized</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 545 | <code>        .split(/[;,，、]/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 546 | <code>        .map((item) =&gt; item.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 547 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 548 | <code>        .sort();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 549 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>function splitListAnswerInOrder(value = '') {</code> | 定义函数 `splitListAnswerInOrder`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 552 | <code>    const normalized = normalizeAnswerForScore(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 553 | <code>    if (!normalized &#124;&#124; !/[;,，、]/.test(normalized)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 554 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 555 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>    return normalized</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 557 | <code>        .split(/[;,，、]/)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 558 | <code>        .map((item) =&gt; item.trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 559 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 560 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>function visibleContainsListParts(value = '', parts = [], { ordered = false } = {}) {</code> | 定义函数 `visibleContainsListParts`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 563 | <code>    const visible = normalizeAnswerForScore(value);</code> | 声明局部标识符 `visible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 564 | <code>    const required = Array.isArray(parts) ? parts.filter(Boolean) : [];</code> | 声明局部标识符 `required`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 565 | <code>    if (!visible &#124;&#124; required.length &lt; 2) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 566 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 567 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 568 | <code>    if (ordered) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 569 | <code>        let cursor = 0;</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 570 | <code>        for (const part of required) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 571 | <code>            const index = visible.indexOf(part, cursor);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 572 | <code>            if (index &lt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 573 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 574 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>            cursor = index + part.length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 576 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 578 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>    const requiredCounts = new Map();</code> | 声明局部标识符 `requiredCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 580 | <code>    for (const part of required) {</code> | 声明局部标识符 `part`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 581 | <code>        requiredCounts.set(part, (requiredCounts.get(part) &#124;&#124; 0) + 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 582 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 583 | <code>    for (const [part, count] of requiredCounts) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 584 | <code>        let found = 0;</code> | 声明局部标识符 `found`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 585 | <code>        let cursor = 0;</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 586 | <code>        while (found &lt; count) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 587 | <code>            const index = visible.indexOf(part, cursor);</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 588 | <code>            if (index &lt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 589 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 590 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 591 | <code>            found += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 592 | <code>            cursor = index + part.length;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 593 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 595 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 596 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 597 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 598 | <code>function questionRequiresListOrder(question = '') {</code> | 定义函数 `questionRequiresListOrder`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 599 | <code>    const text = normalizeText(question).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 600 | <code>    return /\border(?:ed&#124;ing)?\b&#124;\bin the order\b&#124;\bsequence\b&#124;\balphabeti[sz]&#124;\bchronological\b&#124;按.*顺序&#124;依次&#124;字母顺序/.test(text);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 601 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 602 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 603 | <code>function answersEquivalent(candidate = '', gold = '') {</code> | 定义函数 `answersEquivalent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 604 | <code>    const left = normalizeAnswerForScore(candidate);</code> | 声明局部标识符 `left`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 605 | <code>    const right = normalizeAnswerForScore(gold);</code> | 声明局部标识符 `right`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 606 | <code>    if (!left &#124;&#124; !right) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 607 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 608 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>    if (left === right) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 610 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 611 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 612 | <code>    const leftNumber = parseNumber(left);</code> | 声明局部标识符 `leftNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 613 | <code>    const rightNumber = parseNumber(right);</code> | 声明局部标识符 `rightNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 614 | <code>    if (leftNumber !== null &amp;&amp; rightNumber !== null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 615 | <code>        return Math.abs(leftNumber - rightNumber) &lt;= Math.max(1e-9, Math.abs(rightNumber) * 1e-9);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 616 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>    const leftList = splitListAnswer(left);</code> | 声明局部标识符 `leftList`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 618 | <code>    const rightList = splitListAnswer(right);</code> | 声明局部标识符 `rightList`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 619 | <code>    if (leftList.length &gt;= 2 &amp;&amp; rightList.length &gt;= 2 &amp;&amp; leftList.length === rightList.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 620 | <code>        return leftList.every((item, index) =&gt; item === rightList[index]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 621 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 622 | <code>    const lexicalLeft = normalizeLexicalAnswerForScore(left);</code> | 声明局部标识符 `lexicalLeft`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 623 | <code>    const lexicalRight = normalizeLexicalAnswerForScore(right);</code> | 声明局部标识符 `lexicalRight`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 624 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 625 | <code>        lexicalLeft &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 626 | <code>        lexicalRight &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 627 | <code>        lexicalRight.replace(/\s+/g, '').length &gt;= 4 &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 628 | <code>        lexicalLeft === lexicalRight</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 629 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 630 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 631 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 632 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 633 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 634 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 635 | <code>function parseVisibleNumber(value = '') {</code> | 定义函数 `parseVisibleNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 636 | <code>    const normalized = normalizeAnswerForScore(value).replace(/,/g, '');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 637 | <code>    const match = normalized.match(/[+-]?(?:\d+\.?\d*&#124;\.\d+)/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 638 | <code>    if (!match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 639 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 640 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 641 | <code>    const parsed = Number(match[0]);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 642 | <code>    return Number.isFinite(parsed) ? parsed : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 643 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 645 | <code>function parseVisibleNumbers(value = '') {</code> | 定义函数 `parseVisibleNumbers`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 646 | <code>    const normalized = normalizeAnswerForScore(value).replace(/,/g, '');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 647 | <code>    return [...normalized.matchAll(/[+-]?(?:\d+\.?\d*&#124;\.\d+)/g)]</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 648 | <code>        .map((match) =&gt; Number(match[0]))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 649 | <code>        .filter((number) =&gt; Number.isFinite(number));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 650 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 651 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 652 | <code>function isCountQuestion(question = '') {</code> | 定义函数 `isCountQuestion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 653 | <code>    const text = normalizeText(question).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 654 | <code>    return /\bhow\s+many\b&#124;\bnumber\s+of\b&#124;\bcount\b&#124;多少&#124;几个&#124;几位&#124;数量/.test(text);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 655 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 657 | <code>function getQuestionNumericScale(question = '') {</code> | 定义函数 `getQuestionNumericScale`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 658 | <code>    const text = normalizeText(question).toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 659 | <code>    if (/\bhow\s+many\s+thousand\b&#124;\bin\s+thousands\b&#124;\bthousand\s+(?:hours?&#124;kilometers?&#124;metres?&#124;meters?&#124;dollars?&#124;people&#124;years?)\b/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 660 | <code>        return 1000;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 661 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>    if (/\bhow\s+many\s+million\b&#124;\bin\s+millions\b&#124;\bmillion\s+(?:hours?&#124;kilometers?&#124;metres?&#124;meters?&#124;dollars?&#124;people&#124;years?)\b/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 663 | <code>        return 1_000_000;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 664 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 665 | <code>    if (/\bhow\s+many\s+billion\b&#124;\bin\s+billions\b&#124;\bbillion\s+(?:hours?&#124;kilometers?&#124;metres?&#124;meters?&#124;dollars?&#124;people&#124;years?)\b/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 666 | <code>        return 1_000_000_000;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 667 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 668 | <code>    return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 669 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 671 | <code>function answersEquivalentForQuestion(candidate = '', gold = '', question = '') {</code> | 定义函数 `answersEquivalentForQuestion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 672 | <code>    if (answersEquivalent(candidate, gold)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 673 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 674 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 675 | <code>    const questionText = normalizeText(question).toLowerCase();</code> | 声明局部标识符 `questionText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 676 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 677 | <code>        /\b(?:where&#124;city&#124;cities&#124;place&#124;location)\b&#124;城市&#124;地点&#124;哪里&#124;何处/.test(questionText) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 678 | <code>        !/\d/.test(`${candidate}${gold}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 679 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 680 | <code>        const normalizePlaceAlias = (value = '') =&gt; normalizeLexicalAnswerForScore(value)</code> | 声明局部标识符 `normalizePlaceAlias`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 681 | <code>            .replace(/^st\s+/, 'saint ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 682 | <code>            .replace(/\bst\s+(?=[a-z])/g, 'saint ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 683 | <code>        const candidatePlace = normalizePlaceAlias(candidate);</code> | 声明局部标识符 `candidatePlace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 684 | <code>        const goldPlace = normalizePlaceAlias(gold);</code> | 声明局部标识符 `goldPlace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 685 | <code>        if (candidatePlace &amp;&amp; candidatePlace === goldPlace) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 686 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 687 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 688 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 689 | <code>    const goldNumber = parseNumber(gold);</code> | 声明局部标识符 `goldNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 690 | <code>    const candidateNumber = parseVisibleNumber(candidate);</code> | 声明局部标识符 `candidateNumber`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 691 | <code>    const visibleNumbers = goldNumber !== null ? parseVisibleNumbers(candidate) : [];</code> | 声明局部标识符 `visibleNumbers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 692 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 693 | <code>        goldNumber !== null &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 694 | <code>        visibleNumbers.length === 1 &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 695 | <code>        Math.abs(visibleNumbers[0] - goldNumber) &lt;= Math.max(1e-9, Math.abs(goldNumber) * 1e-9)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 696 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 697 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 698 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 699 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 700 | <code>        isCountQuestion(question) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 701 | <code>        goldNumber !== null &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 702 | <code>        candidateNumber !== null &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 703 | <code>        Math.abs(candidateNumber - goldNumber) &lt;= Math.max(1e-9, Math.abs(goldNumber) * 1e-9)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 704 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 705 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 706 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 707 | <code>    const scale = getQuestionNumericScale(question);</code> | 声明局部标识符 `scale`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 708 | <code>    if (!scale) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 709 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 710 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>    if (candidateNumber === null &#124;&#124; goldNumber === null) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 712 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 713 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>    const expected = goldNumber * scale;</code> | 声明局部标识符 `expected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 715 | <code>    return Math.abs(candidateNumber - expected) &lt;= Math.max(1e-9, Math.abs(expected) * 1e-9);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 716 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 718 | <code>function isIncompleteStatus(status = '') {</code> | 定义函数 `isIncompleteStatus`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 719 | <code>    return /\b(?:running&#124;queued&#124;pending&#124;incomplete&#124;timeout&#124;timed_out)\b/i.test(normalizeText(status));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 720 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 721 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 722 | <code>function cleanCandidateLine(value = '') {</code> | 定义函数 `cleanCandidateLine`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 723 | <code>    return stripControlTags(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 724 | <code>        .replace(/^[-*&gt;\s]+/, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 725 | <code>        .replace(/[`*_]+/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 726 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 727 | <code>        .trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 728 | <code>        .replace(/[。.!！]+$/g, '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 729 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 730 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 731 | <code>function isLikelyIdentifierNoise(value = '') {</code> | 定义函数 `isLikelyIdentifierNoise`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 732 | <code>    const text = cleanCandidateLine(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 733 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 734 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 735 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 736 | <code>    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 737 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 738 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 739 | <code>    if (/^[a-z0-9]{6,}(?:-[a-z0-9]{4,}){2,}$/i.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 740 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 741 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>    return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 743 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 744 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 745 | <code>function pushAnswerCandidate(candidates, source, rawAnswer, maxLength = 240) {</code> | 定义函数 `pushAnswerCandidate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 746 | <code>    const answer = cleanCandidateLine(rawAnswer).slice(0, maxLength);</code> | 声明局部标识符 `answer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 747 | <code>    if (!answer &#124;&#124; isLikelyIdentifierNoise(answer)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 748 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 749 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 750 | <code>    candidates.push({ source, answer });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 751 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 753 | <code>function extractAnswerCandidatesFromVisibleText(text = '') {</code> | 定义函数 `extractAnswerCandidatesFromVisibleText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 754 | <code>    const visible = String(text &#124;&#124; '');</code> | 声明局部标识符 `visible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 755 | <code>    const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 756 | <code>    const patterns = [</code> | 声明局部标识符 `patterns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 757 | <code>        /(?:^&#124;\n)\s*(?:final\s+answer&#124;final\s+result&#124;result&#124;answer&#124;the\s+answer&#124;conclusion&#124;答案&#124;结果&#124;结论&#124;最终答案&#124;最终结果&#124;最终结论)\s*(?:is&#124;=&#124;:&#124;：&#124;为&#124;是)?\s*([^\n\r]+)/gi,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 758 | <code>        /(?:\bfinal\s+answer\b&#124;\bfinal\s+result\b&#124;\bthe\s+answer\b&#124;\banswer\b&#124;\bconclusion\b&#124;答案&#124;结论&#124;最终答案&#124;最终结果&#124;最终结论)\s*(?:is&#124;=&#124;:&#124;：&#124;为&#124;是)?\s*([^\n\r。.!；;]+)/gi,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 759 | <code>        /(?:^&#124;\n)\s*(?:therefore&#124;so)\s*,?\s*(?:the\s+answer\s+is)?\s*([^\n\r]+)/gi</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 760 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>    for (const pattern of patterns) {</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 762 | <code>        let match;</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 763 | <code>        while ((match = pattern.exec(visible)) !== null) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 764 | <code>            pushAnswerCandidate(candidates, 'visible_answer_line', match[1], 240);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 765 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>    const compact = visible.replace(/\s+/g, ' ');</code> | 声明局部标识符 `compact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 768 | <code>    const contextualPatterns = [</code> | 声明局部标识符 `contextualPatterns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 769 | <code>        /(?:highest&#124;best&#124;top&#124;winner&#124;choose&#124;pick&#124;selected&#124;maximum&#124;maximize&#124;最高&#124;最佳&#124;最优&#124;第一&#124;第\s*1&#124;选择&#124;应选&#124;选)\D{0,60}(?:#&#124;ball&#124;球&#124;球号)?\s*([A-Za-z0-9_.-]{1,40})/gi,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 770 | <code>        /(?:#&#124;ball&#124;球&#124;球号)\s*([A-Za-z0-9_.-]{1,40})\D{0,60}(?:highest&#124;best&#124;top&#124;winner&#124;maximum&#124;最高&#124;最佳&#124;最优&#124;第一)/gi,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 771 | <code>        /\&#124;\s*(?:1&#124;#?1&#124;rank\s*1&#124;top\s*1&#124;第一)?\s*\&#124;\s*(?:\*\*)?(?:#&#124;ball&#124;球&#124;球号)?\s*([A-Za-z0-9_.-]{1,40})(?:\*\*)?\s*\&#124;/gi</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 772 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 773 | <code>    for (const pattern of contextualPatterns) {</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 774 | <code>        let match;</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 775 | <code>        while ((match = pattern.exec(compact)) !== null) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 776 | <code>            pushAnswerCandidate(candidates, 'visible_contextual_answer', match[1], 120);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 777 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 778 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>    return candidates;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 780 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>function extractQuestionAwareAnswerCandidatesFromVisibleText(text = '', question = '') {</code> | 定义函数 `extractQuestionAwareAnswerCandidatesFromVisibleText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 783 | <code>    const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 784 | <code>    if (!isCountQuestion(question)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 785 | <code>        return candidates;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 786 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>    const lines = String(text &#124;&#124; '').split(/\r?\n/);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 788 | <code>    const patterns = [</code> | 声明局部标识符 `patterns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 789 | <code>        /(?:^&#124;\s)(?:total&#124;total\s+count&#124;count&#124;number&#124;数量&#124;总数&#124;总计&#124;合计&#124;一共&#124;共)\s*(?:is&#124;are&#124;=&#124;:&#124;：&#124;为&#124;是)?\s*(?:\*\*)?\s*([+-]?\d+(?:\.\d+)?(?:\s+[A-Za-z][A-Za-z\s-]{0,80})?)/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 790 | <code>        /(?:there\s+(?:are&#124;were&#124;is&#124;was)&#124;共有&#124;一共有)\s*(?:\*\*)?\s*([+-]?\d+(?:\.\d+)?(?:\s+[A-Za-z][A-Za-z\s-]{0,80})?)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 791 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 792 | <code>    for (const line of lines) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 793 | <code>        const cleaned = cleanCandidateLine(line);</code> | 声明局部标识符 `cleaned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 794 | <code>        if (!cleaned &#124;&#124; /\btotal\s+(?:lines?&#124;tokens?&#124;duration&#124;cost)\b/i.test(cleaned)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 795 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 796 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 797 | <code>        for (const pattern of patterns) {</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 798 | <code>            const match = cleaned.match(pattern);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 799 | <code>            if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 800 | <code>                pushAnswerCandidate(candidates, 'visible_count_total', match[1], 160);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 801 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 802 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 803 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 804 | <code>    return candidates;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 805 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 806 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 807 | <code>function extractScaledUnitAnswerCandidatesFromVisibleText(text = '', question = '') {</code> | 定义函数 `extractScaledUnitAnswerCandidatesFromVisibleText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 808 | <code>    if (!getQuestionNumericScale(question)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 809 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 810 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 811 | <code>    const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 812 | <code>    const patterns = [</code> | 声明局部标识符 `patterns`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 813 | <code>        /(?:rounded&#124;rounding&#124;nearest)[^:\n\r]{0,120}[:=]\s*(?:\*\*)?\s*([+-]?\d[\d,]*(?:\.\d+)?)/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 814 | <code>        /(?:rounded&#124;rounding)\D{0,80}\bto\s*(?:\*\*)?\s*([+-]?\d[\d,]*(?:\.\d+)?)(?:\s+[A-Za-z][A-Za-z\s-]{0,40})?\s*$/i,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 815 | <code>        /(?:四舍五入&#124;取整&#124;约为)[^：:\n\r]{0,80}[：:]\s*(?:\*\*)?\s*([+-]?\d[\d,]*(?:\.\d+)?)/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 816 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 817 | <code>    for (const line of String(text &#124;&#124; '').split(/\r?\n/)) {</code> | 声明局部标识符 `line`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 818 | <code>        const cleaned = cleanCandidateLine(line);</code> | 声明局部标识符 `cleaned`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 819 | <code>        if (!cleaned) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 820 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 821 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 822 | <code>        for (const pattern of patterns) {</code> | 声明局部标识符 `pattern`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 823 | <code>            const match = cleaned.match(pattern);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 824 | <code>            if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 825 | <code>                pushAnswerCandidate(candidates, 'visible_scaled_result', match[1], 80);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 826 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 827 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 828 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>    return candidates;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 830 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 831 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 832 | <code>function looksLikeStructuredAnswerShape(value = '') {</code> | 定义函数 `looksLikeStructuredAnswerShape`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 833 | <code>    const text = cleanCandidateLine(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 834 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 835 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 836 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 837 | <code>    if (text.length &gt; 320) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 838 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 839 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 840 | <code>    if (/[&#124;{}&lt;&gt;]&#124;\b```/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 841 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 842 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 843 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 844 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 845 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 846 | <code>function extractStructuredAnswerCandidates(response = {}) {</code> | 定义函数 `extractStructuredAnswerCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 847 | <code>    const direct = [</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 848 | <code>        ['exact_answer_submission', response.exactAnswerSubmission?.answer &#124;&#124; response.exact_answer_submission?.answer],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 849 | <code>        ['exact_answer', response.exactAnswer &#124;&#124; response.exact_answer],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 850 | <code>        ['task_result_exact_answer', response.taskResult?.exact_answer &#124;&#124; response.task_result?.exact_answer],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 851 | <code>        ['handoff_exact_answer', response.taskRunHandoff?.exactAnswer &#124;&#124; response.task_run_handoff?.exact_answer],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 852 | <code>        ['final_answer', response.final_answer],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 853 | <code>        ['finalAnswer', response.finalAnswer],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 854 | <code>        ['answer', response.answer]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 855 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>    return direct</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 857 | <code>        .map(([source, answer]) =&gt; ({ source, answer: cleanCandidateLine(answer &#124;&#124; '') }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 858 | <code>        .filter((item) =&gt; looksLikeStructuredAnswerShape(item.answer))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 859 | <code>        .filter((item) =&gt; item.answer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 860 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>function scoreVisibleAnswer({ response = {}, gold = '', question = '' } = {}) {</code> | 定义函数 `scoreVisibleAnswer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 863 | <code>    const displayText = normalizeText(response.displayText &#124;&#124; response.display_text &#124;&#124; response.message &#124;&#124; response.speechText &#124;&#124; '');</code> | 声明局部标识符 `displayText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 864 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 865 | <code>        ...extractStructuredAnswerCandidates(response),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 866 | <code>        ...extractQuestionAwareAnswerCandidatesFromVisibleText(displayText, question),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 867 | <code>        ...extractAnswerCandidatesFromVisibleText(displayText),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 868 | <code>        ...extractScaledUnitAnswerCandidatesFromVisibleText(displayText, question)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 869 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 870 | <code>    for (const candidate of candidates) {</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 871 | <code>        if (answersEquivalentForQuestion(candidate.answer, gold, question)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 872 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 873 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 874 | <code>                status: 'visible_answer_match',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 875 | <code>                source: candidate.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 876 | <code>                answer: candidate.answer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 877 | <code>                candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 878 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 879 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 880 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 881 | <code>    const normalizedGold = normalizeAnswerForScore(gold);</code> | 声明局部标识符 `normalizedGold`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 882 | <code>    const normalizedVisible = normalizeAnswerForScore(displayText);</code> | 声明局部标识符 `normalizedVisible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 883 | <code>    const shortGold = normalizedGold.length &lt;= 3 &#124;&#124; parseNumber(normalizedGold) !== null;</code> | 声明局部标识符 `shortGold`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 884 | <code>    if (normalizedGold &amp;&amp; !shortGold &amp;&amp; normalizedVisible.includes(normalizedGold)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 885 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 886 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 887 | <code>            status: 'visible_contains_gold',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 888 | <code>            source: 'visible_text_contains_gold',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 889 | <code>            answer: gold,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 890 | <code>            candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 891 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 892 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 893 | <code>    const goldParts = splitListAnswerInOrder(gold);</code> | 声明局部标识符 `goldParts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 894 | <code>    if (visibleContainsListParts(displayText, goldParts, {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 895 | <code>        ordered: questionRequiresListOrder(question)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 896 | <code>    })) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 897 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 898 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 899 | <code>            status: 'visible_contains_all_list_parts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 900 | <code>            source: 'visible_text_list_parts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 901 | <code>            answer: gold,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 902 | <code>            candidates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 903 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 904 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 906 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 907 | <code>        status: candidates.length ? 'answer_candidate_mismatch' : 'no_visible_answer_candidate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 908 | <code>        source: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 909 | <code>        answer: candidates[0]?.answer &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 910 | <code>        candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 911 | <code>        needsManualReview: Boolean(normalizedGold &amp;&amp; normalizedVisible)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 912 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 913 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 914 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 915 | <code>function usageNumber(usage = {}, keys = []) {</code> | 定义函数 `usageNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 916 | <code>    for (const key of keys) {</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 917 | <code>        const value = key.split('.').reduce((acc, part) =&gt; acc?.[part], usage);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 918 | <code>        const number = Number(value);</code> | 声明局部标识符 `number`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 919 | <code>        if (Number.isFinite(number)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 920 | <code>            return number;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 921 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 922 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 923 | <code>    return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 924 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 925 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 926 | <code>function summarizeUsage(usage = {}) {</code> | 定义函数 `summarizeUsage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 927 | <code>    if (!usage &#124;&#124; typeof usage !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 928 | <code>        return { promptTokens: 0, completionTokens: 0, totalTokens: 0, reasoningTokens: 0, cachedTokens: 0 };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 929 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>    const promptTokens = usageNumber(usage, ['promptTokens', 'prompt_tokens', 'input_tokens', 'promptTokenCount']);</code> | 声明局部标识符 `promptTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 931 | <code>    const completionTokens = usageNumber(usage, ['completionTokens', 'completion_tokens', 'output_tokens', 'candidatesTokenCount']);</code> | 声明局部标识符 `completionTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 932 | <code>    const totalTokens = usageNumber(usage, ['totalTokens', 'total_tokens', 'totalTokenCount']) &#124;&#124; promptTokens + completionTokens;</code> | 声明局部标识符 `totalTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 933 | <code>    const reasoningTokens = usageNumber(usage, [</code> | 声明局部标识符 `reasoningTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 934 | <code>        'reasoningTokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 935 | <code>        'completion_tokens_details.reasoning_tokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 936 | <code>        'output_tokens_details.reasoning_tokens'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 937 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 938 | <code>    const cachedTokens = usageNumber(usage, [</code> | 声明局部标识符 `cachedTokens`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 939 | <code>        'cachedTokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 940 | <code>        'prompt_tokens_details.cached_tokens',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 941 | <code>        'input_tokens_details.cached_tokens'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 942 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 943 | <code>    return { promptTokens, completionTokens, totalTokens, reasoningTokens, cachedTokens };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 944 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 946 | <code>function addUsage(left, right) {</code> | 定义函数 `addUsage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 947 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 948 | <code>        promptTokens: (left.promptTokens &#124;&#124; 0) + (right.promptTokens &#124;&#124; 0),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 949 | <code>        completionTokens: (left.completionTokens &#124;&#124; 0) + (right.completionTokens &#124;&#124; 0),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 950 | <code>        totalTokens: (left.totalTokens &#124;&#124; 0) + (right.totalTokens &#124;&#124; 0),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 951 | <code>        reasoningTokens: (left.reasoningTokens &#124;&#124; 0) + (right.reasoningTokens &#124;&#124; 0),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 952 | <code>        cachedTokens: (left.cachedTokens &#124;&#124; 0) + (right.cachedTokens &#124;&#124; 0)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 953 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 954 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 955 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 956 | <code>function summarizeEvents(events = []) {</code> | 定义函数 `summarizeEvents`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 957 | <code>    const typeCounts = {};</code> | 声明局部标识符 `typeCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 958 | <code>    const toolCalls = [];</code> | 声明局部标识符 `toolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 959 | <code>    const llmCalls = [];</code> | 声明局部标识符 `llmCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 960 | <code>    const tokenUsageEvents = [];</code> | 声明局部标识符 `tokenUsageEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 961 | <code>    const completedLlmCalls = [];</code> | 声明局部标识符 `completedLlmCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 962 | <code>    for (const event of events) {</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 963 | <code>        const type = normalizeText(event.type, '(none)');</code> | 声明局部标识符 `type`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 964 | <code>        typeCounts[type] = (typeCounts[type] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 965 | <code>        const payload = event.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 966 | <code>        if (/tool\.call&#124;mcp\.tool\.call/i.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 967 | <code>            toolCalls.push({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 968 | <code>                type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 969 | <code>                tool: payload.tool &#124;&#124; payload.toolName &#124;&#124; payload.name &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 970 | <code>                ok: payload.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 971 | <code>                status: payload.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 972 | <code>                durationMs: Number(payload.durationMs) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 973 | <code>                error: payload.error &#124;&#124; ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 974 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 975 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 976 | <code>        if (/agent\.llm_call\.completed/i.test(type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 977 | <code>            const callUsage = summarizeUsage(payload.usage &#124;&#124; {});</code> | 声明局部标识符 `callUsage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 978 | <code>            const call = {</code> | 声明局部标识符 `call`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 979 | <code>                type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 980 | <code>                phase: payload.phase &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 981 | <code>                provider: payload.provider &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 982 | <code>                model: payload.model &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 983 | <code>                status: payload.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 984 | <code>                ok: payload.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 985 | <code>                durationMs: Number(payload.durationMs) &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 986 | <code>                usage: callUsage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 987 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>            llmCalls.push(call);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 989 | <code>            completedLlmCalls.push(call);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 990 | <code>        } else if (/agent\.token_usage/i.test(type)) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 991 | <code>            tokenUsageEvents.push(summarizeUsage(payload.usage &#124;&#124; {}));</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 992 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 993 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 994 | <code>    const usageSource = tokenUsageEvents.length</code> | 声明局部标识符 `usageSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 995 | <code>        ? tokenUsageEvents</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 996 | <code>        : completedLlmCalls.map((call) =&gt; call.usage);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 997 | <code>    const usage = usageSource.reduce(</code> | 声明局部标识符 `usage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 998 | <code>        (acc, item) =&gt; addUsage(acc, item),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 999 | <code>        { promptTokens: 0, completionTokens: 0, totalTokens: 0, reasoningTokens: 0, cachedTokens: 0 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1000 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1001 | <code>    const finishedToolCalls = toolCalls.filter((item) =&gt; /finished&#124;result&#124;failure&#124;success/i.test(item.type));</code> | 声明局部标识符 `finishedToolCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1002 | <code>    const toolErrors = toolCalls.filter((item) =&gt; item.ok === false &#124;&#124; /error&#124;failed&#124;invalid/i.test(`${item.status} ${item.error}`));</code> | 声明局部标识符 `toolErrors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1003 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1004 | <code>        typeCounts: Object.fromEntries(Object.entries(typeCounts).sort((a, b) =&gt; b[1] - a[1] &#124;&#124; a[0].localeCompare(b[0]))),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1005 | <code>        llmCallCount: completedLlmCalls.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1006 | <code>        toolCallCount: toolCalls.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1007 | <code>        finishedToolCallCount: finishedToolCalls.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1008 | <code>        toolErrorCount: toolErrors.length,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1009 | <code>        llmDurationMs: completedLlmCalls.reduce((sum, item) =&gt; sum + (Number(item.durationMs) &#124;&#124; 0), 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1010 | <code>        toolDurationMs: finishedToolCalls.reduce((sum, item) =&gt; sum + (Number(item.durationMs) &#124;&#124; 0), 0),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1011 | <code>        usage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1012 | <code>        toolCalls: toolCalls.slice(0, 80),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1013 | <code>        llmCalls: llmCalls.slice(0, 40)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1014 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1015 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1016 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1017 | <code>function quantile(values = [], q = 0.5) {</code> | 定义函数 `quantile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1018 | <code>    const sorted = values.filter((value) =&gt; Number.isFinite(value)).sort((a, b) =&gt; a - b);</code> | 声明局部标识符 `sorted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1019 | <code>    if (!sorted.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1020 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1021 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1022 | <code>    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * q) - 1));</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1023 | <code>    return sorted[index];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1024 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1026 | <code>function formatPercent(numerator, denominator) {</code> | 定义函数 `formatPercent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1027 | <code>    return denominator ? `${((numerator / denominator) * 100).toFixed(2)}%` : '0.00%';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1028 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1029 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1030 | <code>function estimateCostUsd(usage, args) {</code> | 定义函数 `estimateCostUsd`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1031 | <code>    const input = (Number(usage.promptTokens) &#124;&#124; 0) * (Number(args.costInputPerMillion) &#124;&#124; 0) / 1_000_000;</code> | 声明局部标识符 `input`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1032 | <code>    const output = (Number(usage.completionTokens) &#124;&#124; 0) * (Number(args.costOutputPerMillion) &#124;&#124; 0) / 1_000_000;</code> | 声明局部标识符 `output`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1033 | <code>    return Number((input + output).toFixed(6));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1034 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>async function readExistingCompleted(resultPath) {</code> | 定义函数 `readExistingCompleted`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1037 | <code>    if (!fsSync.existsSync(resultPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1038 | <code>        return new Map();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1039 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1040 | <code>    const rows = await readJsonl(resultPath).catch(() =&gt; []);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1041 | <code>    const completed = new Map();</code> | 声明局部标识符 `completed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1042 | <code>    for (const row of rows) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1043 | <code>        if (row?.record_type === 'final' &amp;&amp; row.task_id) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1044 | <code>            completed.set(row.task_id, row);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1045 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1046 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1047 | <code>    return completed;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1048 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1049 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1050 | <code>function buildTaskResult({ args, task, response, durationMs, eventSummary, payloadPreview }) {</code> | 定义函数 `buildTaskResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1051 | <code>    const visibleScore = scoreVisibleAnswer({ response, gold: task.final_answer, question: task.question });</code> | 声明局部标识符 `visibleScore`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1052 | <code>    const responseOk = response?.ok === true;</code> | 声明局部标识符 `responseOk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1053 | <code>    const status = normalizeText(response?.status, responseOk ? 'completed' : 'unknown');</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1054 | <code>    const steps = Array.isArray(response?.steps) ? response.steps : [];</code> | 声明局部标识符 `steps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1055 | <code>    const usage = addUsage(eventSummary.usage, summarizeUsage(response?.usage &#124;&#124; {}));</code> | 声明局部标识符 `usage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1056 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1057 | <code>        record_type: 'final',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1058 | <code>        run_id: args.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1059 | <code>        task_id: task.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1060 | <code>        index: task.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1061 | <code>        question: task.question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1062 | <code>        file_name: task.file_name &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1063 | <code>        file_path: task.file_path &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1064 | <code>        final_answer: task.final_answer &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1065 | <code>        submitted_answer: visibleScore.answer &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1066 | <code>        visible_score: visibleScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1067 | <code>        ok: responseOk &amp;&amp; visibleScore.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1068 | <code>        response_ok: responseOk,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1069 | <code>        status: visibleScore.ok ? 'visible_correct' : (responseOk ? visibleScore.status : status),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1070 | <code>        raw_status: status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1071 | <code>        error: response?.error &#124;&#124; response?.blockedReason &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1072 | <code>        durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1073 | <code>        usage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1074 | <code>        estimatedCostUsd: estimateCostUsd(usage, args),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1075 | <code>        planner: response?.planner &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1076 | <code>        intent: response?.intent &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1077 | <code>        step_count: steps.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1078 | <code>        event_summary: eventSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1079 | <code>        payload_preview: payloadPreview,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1080 | <code>        display_text_preview: stripControlTags(response?.displayText &#124;&#124; response?.speechText &#124;&#124; response?.message &#124;&#124; '').slice(0, 1600),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1081 | <code>        speech_text_preview: stripControlTags(response?.speechText &#124;&#124; '').slice(0, 600)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1082 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1083 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1085 | <code>function aggregateSummary({ args, results, startedAt, finishedAt, runtimeSettings }) {</code> | 定义函数 `aggregateSummary`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1086 | <code>    const total = results.length;</code> | 声明局部标识符 `total`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1087 | <code>    const responseOk = results.filter((row) =&gt; row.response_ok).length;</code> | 声明局部标识符 `responseOk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1088 | <code>    const visibleCorrect = results.filter((row) =&gt; row.visible_score?.ok).length;</code> | 声明局部标识符 `visibleCorrect`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1089 | <code>    const incomplete = results.filter((row) =&gt; !row.visible_score?.ok &amp;&amp; isIncompleteStatus(row.raw_status &#124;&#124; row.status)).length;</code> | 声明局部标识符 `incomplete`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1090 | <code>    const failed = Math.max(0, total - visibleCorrect - incomplete);</code> | 声明局部标识符 `failed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1091 | <code>    const manualReview = results.filter((row) =&gt; row.visible_score?.needsManualReview &amp;&amp; !row.visible_score?.ok).length;</code> | 声明局部标识符 `manualReview`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1092 | <code>    const durations = results.map((row) =&gt; Number(row.durationMs) &#124;&#124; 0);</code> | 声明局部标识符 `durations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1093 | <code>    const usage = results.reduce(</code> | 声明局部标识符 `usage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1094 | <code>        (acc, row) =&gt; addUsage(acc, row.usage &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1095 | <code>        { promptTokens: 0, completionTokens: 0, totalTokens: 0, reasoningTokens: 0, cachedTokens: 0 }</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1096 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1097 | <code>    const statusCounts = {};</code> | 声明局部标识符 `statusCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1098 | <code>    const rawStatusCounts = {};</code> | 声明局部标识符 `rawStatusCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1099 | <code>    for (const row of results) {</code> | 声明局部标识符 `row`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1100 | <code>        statusCounts[row.status &#124;&#124; 'unknown'] = (statusCounts[row.status &#124;&#124; 'unknown'] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1101 | <code>        rawStatusCounts[row.raw_status &#124;&#124; 'unknown'] = (rawStatusCounts[row.raw_status &#124;&#124; 'unknown'] &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1102 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1103 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1104 | <code>        runId: args.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1105 | <code>        benchmark: 'gaia-desktop-real',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1106 | <code>        startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1107 | <code>        finishedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1108 | <code>        sourceJsonl: args.sourceJsonl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1109 | <code>        sourceSummary: args.sourceSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1110 | <code>        resultPath: args.resultPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1111 | <code>        summaryPath: args.summaryPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1112 | <code>        reportPath: args.reportPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1113 | <code>        auditDir: args.auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1114 | <code>        workspaceRoot: args.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1115 | <code>        mode: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1116 | <code>            desktopRealPayload: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1117 | <code>            workspaceMode: args.workspaceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1118 | <code>            directToolExecutor: args.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1119 | <code>            agentRole: args.agentRole,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1120 | <code>            subagentSettleTimeoutMs: args.subagentSettleTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1121 | <code>            answerPolicy: 'visible answer counts when it matches the gold answer; short numeric answers require an answer line or structured answer candidate'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1122 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1123 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1124 | <code>            desktopStatePath: runtimeSettings.statePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1125 | <code>            mcpConfigPath: runtimeSettings.mcpConfigPath,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1126 | <code>            llm: redactLlmSettings(runtimeSettings.llmSettings)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1127 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1128 | <code>        totals: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1129 | <code>            total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1130 | <code>            responseOk,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1131 | <code>            visibleCorrect,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1132 | <code>            failed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1133 | <code>            incomplete,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1134 | <code>            notCorrect: total - visibleCorrect,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1135 | <code>            manualReview,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1136 | <code>            responseOkRate: formatPercent(responseOk, total),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1137 | <code>            visibleSuccessRate: formatPercent(visibleCorrect, total)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1138 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1139 | <code>        statusCounts: Object.fromEntries(Object.entries(statusCounts).sort((a, b) =&gt; b[1] - a[1] &#124;&#124; a[0].localeCompare(b[0]))),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1140 | <code>        rawStatusCounts: Object.fromEntries(Object.entries(rawStatusCounts).sort((a, b) =&gt; b[1] - a[1] &#124;&#124; a[0].localeCompare(b[0]))),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1141 | <code>        performance: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1142 | <code>            totalDurationMs: durations.reduce((sum, value) =&gt; sum + value, 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1143 | <code>            avgDurationMs: total ? Math.round(durations.reduce((sum, value) =&gt; sum + value, 0) / total) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1144 | <code>            p50DurationMs: quantile(durations, 0.5),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1145 | <code>            p90DurationMs: quantile(durations, 0.9),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1146 | <code>            p95DurationMs: quantile(durations, 0.95),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1147 | <code>            maxDurationMs: durations.length ? Math.max(...durations) : 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1148 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1149 | <code>        cost: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1150 | <code>            usage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1151 | <code>            inputUsdPer1M: args.costInputPerMillion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1152 | <code>            outputUsdPer1M: args.costOutputPerMillion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1153 | <code>            estimatedCostUsd: estimateCostUsd(usage, args)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1154 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1156 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1157 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1158 | <code>function markdownTable(headers, rows) {</code> | 定义函数 `markdownTable`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1159 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1160 | <code>        `&#124; ${headers.join(' &#124; ')} &#124;`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1161 | <code>        `&#124; ${headers.map(() =&gt; '---').join(' &#124; ')} &#124;`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1162 | <code>        ...rows.map((row) =&gt; `&#124; ${row.map((cell) =&gt; String(cell ?? '').replace(/\&#124;/g, '\\&#124;')).join(' &#124; ')} &#124;`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1163 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1164 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1165 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1166 | <code>function buildMarkdownReport(summary, results) {</code> | 定义函数 `buildMarkdownReport`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1167 | <code>    const failures = results</code> | 声明局部标识符 `failures`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1168 | <code>        .filter((row) =&gt; !row.visible_score?.ok &amp;&amp; !isIncompleteStatus(row.raw_status &#124;&#124; row.status))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1169 | <code>        .slice(0, 20);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1170 | <code>    const incomplete = results</code> | 声明局部标识符 `incomplete`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1171 | <code>        .filter((row) =&gt; !row.visible_score?.ok &amp;&amp; isIncompleteStatus(row.raw_status &#124;&#124; row.status))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1172 | <code>        .slice(0, 20);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1173 | <code>    const taskRows = results.map((row) =&gt; [</code> | 声明局部标识符 `taskRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1174 | <code>        row.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1175 | <code>        `\`${row.task_id}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1176 | <code>        row.visible_score?.ok ? 'yes' : 'no',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1177 | <code>        row.raw_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1178 | <code>        row.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1179 | <code>        row.step_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1180 | <code>        row.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1181 | <code>        row.usage?.totalTokens &#124;&#124; 0,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1182 | <code>        row.submitted_answer &#124;&#124; '(empty)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1183 | <code>        row.final_answer &#124;&#124; '(missing)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1184 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1185 | <code>    const failureRows = failures.map((row) =&gt; [</code> | 声明局部标识符 `failureRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1186 | <code>        row.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1187 | <code>        `\`${row.task_id}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1188 | <code>        row.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1189 | <code>        row.visible_score?.answer &#124;&#124; '(none)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1190 | <code>        row.final_answer &#124;&#124; '(missing)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1191 | <code>        row.error &#124;&#124; row.display_text_preview.slice(0, 180)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1192 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1193 | <code>    const incompleteRows = incomplete.map((row) =&gt; [</code> | 声明局部标识符 `incompleteRows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1194 | <code>        row.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1195 | <code>        `\`${row.task_id}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1196 | <code>        row.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1197 | <code>        row.visible_score?.answer &#124;&#124; '(none)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1198 | <code>        row.final_answer &#124;&#124; '(missing)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1199 | <code>        row.error &#124;&#124; row.display_text_preview.slice(0, 180)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1200 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1201 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1202 | <code>        `# AILIS Desktop Real GAIA Eval - ${summary.runId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1203 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1204 | <code>        '## Scope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1205 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1206 | <code>        '- This runner evaluates the AILIS desktop-style agent path, not the strict GAIA exact-answer submission path.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1207 | <code>        `- Workspace mode: ${summary.mode.workspaceMode}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1208 | <code>        `- Workspace root: \`${summary.workspaceRoot}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1209 | <code>        `- Direct tool executor: ${summary.mode.directToolExecutor}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1210 | <code>        `- Agent role: ${summary.mode.agentRole}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1211 | <code>        `- Source: \`${summary.sourceJsonl}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1212 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1213 | <code>        '## Headline',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1214 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1215 | <code>        markdownTable(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1216 | <code>            ['Metric', 'Value'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1217 | <code>            [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1218 | <code>                ['Tasks', summary.totals.total],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1219 | <code>                ['Visible success', `${summary.totals.visibleCorrect}/${summary.totals.total} (${summary.totals.visibleSuccessRate})`],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1220 | <code>                ['Response OK', `${summary.totals.responseOk}/${summary.totals.total} (${summary.totals.responseOkRate})`],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1221 | <code>                ['Current true failures', summary.totals.failed],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1222 | <code>                ['Incomplete / still running', summary.totals.incomplete],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1223 | <code>                ['Manual review candidates', summary.totals.manualReview],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1224 | <code>                ['Avg duration ms', summary.performance.avgDurationMs],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1225 | <code>                ['P95 duration ms', summary.performance.p95DurationMs],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1226 | <code>                ['Total tokens', summary.cost.usage.totalTokens],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1227 | <code>                ['Estimated cost USD', summary.cost.estimatedCostUsd]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1228 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1229 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1230 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1231 | <code>        '## Status Counts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1232 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1233 | <code>        markdownTable(['Status', 'Count'], Object.entries(summary.statusCounts)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1234 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1235 | <code>        '## Per Task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1236 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1237 | <code>        markdownTable(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1238 | <code>            ['Index', 'Task', 'Correct', 'Raw Status', 'Eval Status', 'Steps', 'Ms', 'Tokens', 'Extracted', 'Gold'],</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1239 | <code>            taskRows</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1240 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1241 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1242 | <code>        '## Current True Failure / Review Samples',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1243 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1244 | <code>        failures.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1245 | <code>            ? markdownTable(['Index', 'Task', 'Status', 'Extracted', 'Gold', 'Preview'], failureRows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1246 | <code>            : 'No current true failed samples.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1247 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1248 | <code>        '## Incomplete / Still Running Samples',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1249 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1250 | <code>        incomplete.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1251 | <code>            ? markdownTable(['Index', 'Task', 'Status', 'Extracted', 'Gold', 'Preview'], incompleteRows)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1252 | <code>            : 'No incomplete samples.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1253 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1254 | <code>        '## Artifacts',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1255 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1256 | <code>        `- Result JSONL: \`${summary.resultPath}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1257 | <code>        `- Summary JSON: \`${summary.summaryPath}\``,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1258 | <code>        `- Gateway audit: \`${summary.auditDir}\``</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1259 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1260 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1261 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1262 | <code>async function writeSummaryAndReport({ args, results, startedAt, finishedAt, runtimeSettings }) {</code> | 定义函数 `writeSummaryAndReport`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1263 | <code>    const summary = aggregateSummary({ args, results, startedAt, finishedAt, runtimeSettings });</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1264 | <code>    await fs.writeFile(args.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1265 | <code>    await fs.writeFile(args.reportPath, buildMarkdownReport(summary, results), 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1266 | <code>    return summary;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1267 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1268 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1269 | <code>async function startGateway(args, runtimeSettings) {</code> | 定义函数 `startGateway`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1270 | <code>    if (!args.startGateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1271 | <code>        return { gateway: null, baseUrl: args.gatewayUrl };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1272 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1273 | <code>    const options = {</code> | 声明局部标识符 `options`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1274 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1275 | <code>        workspaceRoot: args.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1276 | <code>        projectRoot: PROJECT_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1277 | <code>        auditDir: args.auditDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1278 | <code>        profileCurationEnabled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1279 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1280 | <code>    configureResearchMcpLlmEnvironment(runtimeSettings.llmSettings);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1281 | <code>    if (runtimeSettings.mcpConfigPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1282 | <code>        options.mcpConfigPath = runtimeSettings.mcpConfigPath;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1283 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1284 | <code>    const gateway = new AILISGateway(options);</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1285 | <code>    const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1286 | <code>    return { gateway, baseUrl: status.url };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1287 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1289 | <code>function configureResearchMcpLlmEnvironment(llmSettings = {}) {</code> | 定义函数 `configureResearchMcpLlmEnvironment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1290 | <code>    const assignments = {</code> | 声明局部标识符 `assignments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1291 | <code>        AILIS_TOOL_LLM_PROVIDER: llmSettings.provider,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1292 | <code>        AILIS_TOOL_LLM_BASE_URL: llmSettings.baseUrl,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1293 | <code>        AILIS_TOOL_LLM_MODEL: llmSettings.model,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1294 | <code>        AILIS_TOOL_LLM_API_KEY: llmSettings.apiKey,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1295 | <code>        AILIS_TOOL_LLM_REASONING_EFFORT: llmSettings.reasoningEffort</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1296 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1297 | <code>    for (const [name, value] of Object.entries(assignments)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1298 | <code>        const normalized = normalizeText(value);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1299 | <code>        if (normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1300 | <code>            process.env[name] = normalized;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1301 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1302 | <code>            delete process.env[name];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1303 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1305 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1306 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1307 | <code>async function withTimeout(promise, timeoutMs, timeoutValue) {</code> | 定义函数 `withTimeout`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1308 | <code>    let timer = null;</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1309 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1310 | <code>        return await Promise.race([</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1311 | <code>            promise,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1312 | <code>            new Promise((resolve) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1313 | <code>                timer = setTimeout(() =&gt; resolve(timeoutValue), timeoutMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1314 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1315 | <code>        ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1316 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1317 | <code>        if (timer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1318 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1319 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1320 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1321 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1322 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1323 | <code>async function main() {</code> | 定义函数 `main`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1324 | <code>    const args = parseArgs();</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1325 | <code>    await fs.mkdir(args.outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1326 | <code>    await fs.mkdir(args.auditDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1327 | <code>    await fs.mkdir(args.workspaceRoot, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1328 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1329 | <code>    const tasks = await loadTasks(args);</code> | 声明局部标识符 `tasks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1330 | <code>    const runtimeSettings = loadDesktopStateSettings(args);</code> | 声明局部标识符 `runtimeSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1331 | <code>    const providerNeedsApiKey = !['codex-model-bridge', 'vllm', 'ollama'].includes(</code> | 声明局部标识符 `providerNeedsApiKey`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1332 | <code>        normalizeText(runtimeSettings.llmSettings.provider).toLowerCase()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1333 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1334 | <code>    if (!runtimeSettings.llmSettings.baseUrl &#124;&#124;</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1335 | <code>        !runtimeSettings.llmSettings.model &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1336 | <code>        (providerNeedsApiKey &amp;&amp; !runtimeSettings.llmSettings.apiKey)) {</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1337 | <code>        throw new Error('Missing desktop LLM settings. Configure AILIS desktop-state.json or AILIS_AGENT_LLM_* env vars.');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1338 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1339 | <code>    const plan = {</code> | 声明局部标识符 `plan`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1340 | <code>        runId: args.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1341 | <code>        taskCount: tasks.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1342 | <code>        sourceJsonl: args.sourceJsonl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1343 | <code>        sourceSummary: args.sourceSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1344 | <code>        outputDir: args.outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1345 | <code>        resultPath: args.resultPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1346 | <code>        summaryPath: args.summaryPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1347 | <code>        reportPath: args.reportPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1348 | <code>        mode: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1349 | <code>            directToolExecutor: args.directToolExecutor,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1350 | <code>            agentRole: args.agentRole,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1351 | <code>            startGateway: args.startGateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1352 | <code>            workspaceMode: args.workspaceMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1353 | <code>            codexModelBridge: args.codexModelBridge,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1354 | <code>            subagentSettleTimeoutMs: args.subagentSettleTimeoutMs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1355 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1356 | <code>        workspaceRoot: args.workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1357 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1358 | <code>            desktopStatePath: runtimeSettings.statePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1359 | <code>            mcpConfigPath: runtimeSettings.mcpConfigPath,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1360 | <code>            llm: redactLlmSettings(runtimeSettings.llmSettings)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1361 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1362 | <code>        sampleTasks: tasks.slice(0, 5).map((task) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1363 | <code>            index: task.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1364 | <code>            task_id: task.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1365 | <code>            hasGold: Boolean(task.final_answer),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1366 | <code>            hasFile: Boolean(task.file_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1367 | <code>            fileExists: task.file_path ? fsSync.existsSync(task.file_path) : false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1368 | <code>            questionPreview: task.question.slice(0, 120)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1369 | <code>        }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1370 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1371 | <code>    await fs.writeFile(path.join(args.outputDir, `${args.runId}.plan.json`), `${JSON.stringify(plan, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1372 | <code>    if (args.planOnly) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1373 | <code>        console.log(JSON.stringify(plan, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1374 | <code>        return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1375 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1376 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1377 | <code>    const startedAt = new Date().toISOString();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1378 | <code>    const existing = args.resume ? await readExistingCompleted(args.resultPath) : new Map();</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1379 | <code>    const results = [...existing.values()];</code> | 声明局部标识符 `results`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1380 | <code>    const { gateway, baseUrl } = await startGateway(args, runtimeSettings);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1381 | <code>    let gatewayStopStatus = { ok: true, status: 'not_started' };</code> | 声明局部标识符 `gatewayStopStatus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1383 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1384 | <code>        for (const task of tasks) {</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1385 | <code>            if (existing.has(task.task_id)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1386 | <code>                process.stdout.write(`[skip] ${task.task_id}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1387 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1388 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1389 | <code>            process.stdout.write(`[${results.length + 1}/${tasks.length}] ${task.task_id} ... `);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1390 | <code>            const taskEvents = [];</code> | 声明局部标识符 `taskEvents`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1391 | <code>            const listener = (event) =&gt; taskEvents.push(event);</code> | 声明局部标识符 `listener`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1392 | <code>            gateway?.on?.('event', listener);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1393 | <code>            await appendJsonl(args.progressPath, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1394 | <code>                ts: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1395 | <code>                type: 'task.started',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1396 | <code>                task_id: task.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1397 | <code>                index: task.index</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1398 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1399 | <code>            let agentResult;</code> | 声明局部标识符 `agentResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1400 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1401 | <code>                agentResult = await callAgent({ args, gateway, baseUrl, task, llmSettings: runtimeSettings.llmSettings });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1402 | <code>            } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1403 | <code>                gateway?.off?.('event', listener);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1404 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1405 | <code>            const eventSummary = summarizeEvents(taskEvents);</code> | 声明局部标识符 `eventSummary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1406 | <code>            const result = buildTaskResult({</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1407 | <code>                args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1408 | <code>                task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1409 | <code>                response: agentResult.response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1410 | <code>                durationMs: agentResult.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1411 | <code>                eventSummary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1412 | <code>                payloadPreview: agentResult.payloadPreview</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1413 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1414 | <code>            results.push(result);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1415 | <code>            await appendJsonl(args.resultPath, result);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1416 | <code>            await appendJsonl(args.progressPath, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1417 | <code>                ts: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1418 | <code>                type: 'task.finished',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1419 | <code>                task_id: task.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1420 | <code>                ok: result.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1421 | <code>                response_ok: result.response_ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1422 | <code>                status: result.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1423 | <code>                raw_status: result.raw_status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1424 | <code>                durationMs: result.durationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1425 | <code>                totalTokens: result.usage.totalTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1426 | <code>                estimatedCostUsd: result.estimatedCostUsd</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1427 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1428 | <code>            await writeSummaryAndReport({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1429 | <code>                args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1430 | <code>                results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1431 | <code>                startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1432 | <code>                finishedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1433 | <code>                runtimeSettings</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1434 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1435 | <code>            process.stdout.write(`${result.ok ? 'ok' : result.status} &#124; ${result.submitted_answer &#124;&#124; '(empty)'}\n`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1436 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1437 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1438 | <code>        if (gateway) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1439 | <code>            gatewayStopStatus = await withTimeout(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1440 | <code>                gateway.stop()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1441 | <code>                    .then(() =&gt; ({ ok: true, status: 'stopped' }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1442 | <code>                    .catch((error) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1443 | <code>                        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1444 | <code>                        status: 'stop_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1445 | <code>                        error: error?.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1446 | <code>                    })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1447 | <code>                15000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1448 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1449 | <code>                    ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1450 | <code>                    status: 'stop_timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1451 | <code>                    error: 'gateway.stop timed out after 15000ms'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1452 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1453 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1454 | <code>            if (!gatewayStopStatus.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1455 | <code>                await appendJsonl(args.progressPath, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1456 | <code>                    ts: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1457 | <code>                    type: 'gateway.stop.warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1458 | <code>                    ...gatewayStopStatus</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1459 | <code>                }).catch(() =&gt; {});</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1460 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1461 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1462 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1464 | <code>    const summary = await writeSummaryAndReport({</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1465 | <code>        args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1466 | <code>        results,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1467 | <code>        startedAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1468 | <code>        finishedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1469 | <code>        runtimeSettings</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1470 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1471 | <code>    console.log(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1472 | <code>        ok: summary.totals.visibleCorrect === summary.totals.total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1473 | <code>        runId: args.runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1474 | <code>        total: summary.totals.total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1475 | <code>        visibleCorrect: summary.totals.visibleCorrect,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1476 | <code>        visibleSuccessRate: summary.totals.visibleSuccessRate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1477 | <code>        responseOkRate: summary.totals.responseOkRate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1478 | <code>        avgDurationMs: summary.performance.avgDurationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1479 | <code>        p95DurationMs: summary.performance.p95DurationMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1480 | <code>        totalTokens: summary.cost.usage.totalTokens,</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1481 | <code>        estimatedCostUsd: summary.cost.estimatedCostUsd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1482 | <code>        gatewayStopStatus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1483 | <code>        resultPath: args.resultPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1484 | <code>        summaryPath: args.summaryPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1485 | <code>        reportPath: args.reportPath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1486 | <code>    }, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1487 | <code>    if (gatewayStopStatus.status === 'stop_timeout') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1488 | <code>        process.exit(0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1489 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1490 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1491 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1492 | <code>export {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1493 | <code>    answersEquivalent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1494 | <code>    answersEquivalentForQuestion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1495 | <code>    buildDesktopRealPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1496 | <code>    configureResearchMcpLlmEnvironment,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1497 | <code>    isIncompleteStatus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1498 | <code>    normalizeAnswerForScore,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1499 | <code>    scoreVisibleAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1500 | <code>    splitListAnswerInOrder,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1501 | <code>    summarizeEvents</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1502 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1503 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1504 | <code>if (process.argv[1] &amp;&amp; import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1505 | <code>    main().catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1506 | <code>        console.error(error?.stack &#124;&#124; error?.message &#124;&#124; String(error));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1507 | <code>        process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1508 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1509 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
