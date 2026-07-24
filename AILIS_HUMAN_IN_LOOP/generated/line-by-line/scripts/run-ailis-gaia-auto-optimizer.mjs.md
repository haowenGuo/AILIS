# scripts/run-ailis-gaia-auto-optimizer.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。
- 文件类型：`source-code`
- 原始行数：1226
- SHA-256：`87168b71fe6a79ccaa43c9dc7b8d2110721b44b9f05033a4245ca129f61afd7c`
- 可运行副本：[打开源文件](../../../source/scripts/run-ailis-gaia-auto-optimizer.mjs)
- 依赖：`node:fs/promises`、`node:fs`、`node:http`、`node:path`、`node:child_process`、`node:url`
- 主要符号：`__dirname`、`PROJECT_ROOT`、`DEFAULT_JOB_DIR`、`normalizeText`、`trimmed`、`stripJsonBom`、`isoNow`、`safeSegment`、`resolveTaskRetries`、`configured`、`override`、`shouldContinueAfterFailure`、`shouldContinueAfterVerdict`、`resolvePolicyNumber`、`parsed`、`effective`、`resolveSafetyPolicy`、`safety`、`isEmptyAnswerVerdict`、`text`、`ensureSafetyState`、`safetyPolicy`、`existing`、`recentVerdicts`、`taskAttemptCounts`、`recordSafetyOutcome`、`taskId`、`emptyAnswer`、`buildSafetyBlock`、`evaluateSafetyGate`、`repairBacklogCount`、`taskAttempts`、`recent`、`passRate`、`parseArgs`、`args`、`index`、`token`、`next`、`readJson`、`writeJson`、`appendEvent`、`payload`、`updateProgress`、`progressPath`、`previous`、`lastUpdateAt`、`buildPracticeTasks`、`normalizeAnswer`、`discoverOfficialDatasetDir`、`candidates`、`selectNextTask`、`source`、`practiceTasks`、`practice`、`cursor`、`datasetDir`、`offset`、`runProcess`、`startedAt`、`child`、`stdout`、`stderr`、`timeoutMs`、`timer`、`createPracticeScoringServer`、`server`、`url`、`requested`、`chunks`、`answers`、`submitted`、`correct`、`address`、`runPracticeTask`、`outputDir`、`commandArgs`、`processResult`、`runOfficialTask`、`requestTimeoutMs`、`llmTimeoutMs`、`submitTimeoutMs`、`readJsonIfExists`、`readJsonlIfExists`、`lines`、`summarizeStep`、`response`、`result`、`details`、`nested`、`mergedDetails`、`extractExecutionChain`、`steps`、`toolCounts`、`perTask`、`key`、`enrichTaskFromGaiaResult`、`enriched`、`question`、`fileName`、`filePath`、`resultTaskId`、`findScorePerTask`、`perTaskItems`、`ids`、`byId`、`bySubmittedAnswer`、`classifyGaiaResult`、`expected`、`stepText`、`statusText`、`highLoop`、`finalAnswer`、`buildRepairTicket`、`of`、`analyzeRun`、`summaryPath`、`resultPath`、`summary`、`rows`、`enrichedTask`、`chain`、`verdict`、`chainPath`、`verdictPath`、`repairTicketPath`、`executeTask`、`runResult`、`loadStateAndPolicy`、`policy`、`state`、`saveState`、`blockForSafetyGate`、`runController`、`jobDir`、`maxIterations`、`count`、`previousProgress`、`preRunSafetyGate`、`task`、`iteration`、`iterName`、`iterationDir`、`runId`、`postVerdictSafetyGate`、`canContinueAfterVerdict`、`isDirectRun`、`entryPath`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 2 | <code>import fsSync from 'node:fs';</code> | 导入依赖 `node:fs`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 3 | <code>import http from 'node:http';</code> | 导入依赖 `node:http`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 5 | <code>import { spawn } from 'node:child_process';</code> | 导入依赖 `node:child_process`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 6 | <code>import { fileURLToPath } from 'node:url';</code> | 导入依赖 `node:url`，使本文件可以复用外部模块能力。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const __dirname = path.dirname(fileURLToPath(import.meta.url));</code> | 声明局部标识符 `__dirname`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 9 | <code>const PROJECT_ROOT = path.resolve(__dirname, '..');</code> | 声明局部标识符 `PROJECT_ROOT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 10 | <code>const DEFAULT_JOB_DIR = path.join(PROJECT_ROOT, 'longrun', 'jobs', 'ailis-gaia-auto-optimizer');</code> | 声明局部标识符 `DEFAULT_JOB_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 11 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 12 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 13 | <code>    if (typeof value === 'number' &amp;&amp; Number.isFinite(value)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 14 | <code>        return String(value);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 15 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 16 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 17 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 18 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 19 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 20 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 21 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>function stripJsonBom(text = '') {</code> | 定义函数 `stripJsonBom`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 24 | <code>    return typeof text === 'string' ? text.replace(/^\uFEFF/, '') : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 25 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>function isoNow() {</code> | 定义函数 `isoNow`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 28 | <code>    return new Date().toISOString();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 29 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 30 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 31 | <code>function safeSegment(value, fallback = 'item') {</code> | 定义函数 `safeSegment`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 32 | <code>    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 140) &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>function resolveTaskRetries(policy = {}, args = {}) {</code> | 定义函数 `resolveTaskRetries`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 36 | <code>    if (args.taskRetries === null &#124;&#124; args.taskRetries === undefined) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 37 | <code>        const configured = Number(policy.taskRetries);</code> | 声明局部标识符 `configured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 38 | <code>        return Math.max(0, Math.min(Number.isFinite(configured) ? Math.round(configured) : 0, 3));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    const override = Number(args.taskRetries);</code> | 声明局部标识符 `override`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 41 | <code>    if (Number.isFinite(override)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 42 | <code>        return Math.max(0, Math.min(Math.round(override), 3));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 43 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 44 | <code>    const configured = Number(policy.taskRetries);</code> | 声明局部标识符 `configured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 45 | <code>    return Math.max(0, Math.min(Number.isFinite(configured) ? Math.round(configured) : 0, 3));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 46 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 47 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 48 | <code>function shouldContinueAfterFailure(policy = {}) {</code> | 定义函数 `shouldContinueAfterFailure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 49 | <code>    if (policy.continueAfterFailure === true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 50 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>    return !(Array.isArray(policy.stopWhen) &amp;&amp; policy.stopWhen.includes('repair_required'));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function shouldContinueAfterVerdict(policy = {}, verdict = {}) {</code> | 定义函数 `shouldContinueAfterVerdict`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 56 | <code>    if (!shouldContinueAfterFailure(policy)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 57 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 58 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 59 | <code>    // Environment/provider failures are systemic. Continuing would only turn</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 60 | <code>    // more tasks into duplicate empty-answer repair backlog entries.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 61 | <code>    if (normalizeText(verdict.failureCategory) === 'environment') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 62 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>    return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 65 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 66 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 67 | <code>function resolvePolicyNumber(value, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {</code> | 定义函数 `resolvePolicyNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 68 | <code>    const parsed = Number(value);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 69 | <code>    const effective = Number.isFinite(parsed) ? parsed : fallback;</code> | 声明局部标识符 `effective`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 70 | <code>    return Math.max(min, Math.min(effective, max));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 71 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>function resolveSafetyPolicy(policy = {}) {</code> | 定义函数 `resolveSafetyPolicy`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 74 | <code>    const safety = typeof policy.safety === 'object' &amp;&amp; policy.safety ? policy.safety : {};</code> | 声明局部标识符 `safety`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 75 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 76 | <code>        enabled: safety.enabled !== false &amp;&amp; policy.safetyEnabled !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 77 | <code>        maxRepairBacklog: resolvePolicyNumber(safety.maxRepairBacklog ?? policy.maxRepairBacklog, 5, { min: 0, max: 200 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 78 | <code>        maxConsecutiveFailures: resolvePolicyNumber(safety.maxConsecutiveFailures ?? policy.maxConsecutiveFailures, 3, { min: 0, max: 50 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 79 | <code>        maxEmptyAnswerStreak: resolvePolicyNumber(safety.maxEmptyAnswerStreak ?? policy.maxEmptyAnswerStreak, 2, { min: 0, max: 50 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 80 | <code>        maxSameTaskAttempts: resolvePolicyNumber(safety.maxSameTaskAttempts ?? policy.maxSameTaskAttempts, 2, { min: 0, max: 20 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 81 | <code>        recentWindow: Math.round(resolvePolicyNumber(safety.recentWindow ?? policy.recentWindow, 8, { min: 1, max: 100 })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 82 | <code>        minRecentSample: Math.round(resolvePolicyNumber(safety.minRecentSample ?? policy.minRecentSample, 4, { min: 1, max: 100 })),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 83 | <code>        minRecentPassRate: resolvePolicyNumber(safety.minRecentPassRate ?? policy.minRecentPassRate, 0.25, { min: 0, max: 1 }),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 84 | <code>        stopOnEnvironmentFailure: safety.stopOnEnvironmentFailure !== false &amp;&amp; policy.stopOnEnvironmentFailure !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 85 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 86 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 87 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 88 | <code>function isEmptyAnswerVerdict(verdict = {}) {</code> | 定义函数 `isEmptyAnswerVerdict`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 89 | <code>    const text = [</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 90 | <code>        verdict.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 91 | <code>        verdict.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 92 | <code>        verdict.optimizationFocus,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 93 | <code>        verdict.nextAction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 94 | <code>    ].map((item) =&gt; normalizeText(item)).join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 95 | <code>    return verdict.emptyAnswer === true &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 96 | <code>        /\(\s*empty\s*\)&#124;empty answer&#124;no submitted&#124;missing_exact_answer&#124;submitted answer \(\s*\)/i.test(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 97 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>function ensureSafetyState(state = {}, policy = {}) {</code> | 定义函数 `ensureSafetyState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 100 | <code>    const safetyPolicy = resolveSafetyPolicy(policy);</code> | 声明局部标识符 `safetyPolicy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 101 | <code>    const existing = typeof state.safety === 'object' &amp;&amp; state.safety ? state.safety : {};</code> | 声明局部标识符 `existing`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 102 | <code>    const recentVerdicts = Array.isArray(existing.recentVerdicts) ? existing.recentVerdicts : [];</code> | 声明局部标识符 `recentVerdicts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 103 | <code>    const taskAttemptCounts = typeof existing.taskAttemptCounts === 'object' &amp;&amp; existing.taskAttemptCounts</code> | 声明局部标识符 `taskAttemptCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 104 | <code>        ? existing.taskAttemptCounts</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 105 | <code>        : {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 106 | <code>    state.safety = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 107 | <code>        consecutiveFailures: Math.max(0, Number(existing.consecutiveFailures) &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 108 | <code>        emptyAnswerStreak: Math.max(0, Number(existing.emptyAnswerStreak) &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 109 | <code>        taskAttemptCounts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 110 | <code>        recentVerdicts: recentVerdicts.slice(-Math.max(1, safetyPolicy.recentWindow)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 111 | <code>        lastSafetyBlock: existing.lastSafetyBlock &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 112 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>    return state.safety;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 114 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 116 | <code>function recordSafetyOutcome(state = {}, { task = {}, verdict = {}, policy = {} } = {}) {</code> | 定义函数 `recordSafetyOutcome`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 117 | <code>    const safetyPolicy = resolveSafetyPolicy(policy);</code> | 声明局部标识符 `safetyPolicy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 118 | <code>    const safety = ensureSafetyState(state, policy);</code> | 声明局部标识符 `safety`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 119 | <code>    const taskId = normalizeText(task.taskId &#124;&#124; verdict.taskId, 'unknown-task');</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 120 | <code>    safety.taskAttemptCounts[taskId] = Math.max(0, Number(safety.taskAttemptCounts[taskId]) &#124;&#124; 0) + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 121 | <code>    const emptyAnswer = isEmptyAnswerVerdict(verdict);</code> | 声明局部标识符 `emptyAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 122 | <code>    safety.consecutiveFailures = verdict.ok ? 0 : safety.consecutiveFailures + 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 123 | <code>    safety.emptyAnswerStreak = verdict.ok ? 0 : (emptyAnswer ? safety.emptyAnswerStreak + 1 : 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 124 | <code>    safety.recentVerdicts = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 125 | <code>        ...(Array.isArray(safety.recentVerdicts) ? safety.recentVerdicts : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 126 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 127 | <code>            at: isoNow(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 128 | <code>            taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 129 | <code>            ok: verdict.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 130 | <code>            failureCategory: normalizeText(verdict.failureCategory),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 131 | <code>            optimizationFocus: normalizeText(verdict.optimizationFocus),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 132 | <code>            emptyAnswer</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 133 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    ].slice(-Math.max(1, safetyPolicy.recentWindow));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 135 | <code>    return safety;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 138 | <code>function buildSafetyBlock(reason, summary, extra = {}) {</code> | 定义函数 `buildSafetyBlock`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 139 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 140 | <code>        block: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 141 | <code>        reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 142 | <code>        failureCategory: 'spend_safety',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 143 | <code>        summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 144 | <code>        nextAction: 'stop paid execution, inspect accumulated chain data offline, repair the generalized bottleneck, then resume with a tiny canary batch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 145 | <code>        ...extra</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 146 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 147 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>function evaluateSafetyGate(policy = {}, state = {}, { verdict = null, task = null } = {}) {</code> | 定义函数 `evaluateSafetyGate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 150 | <code>    const safetyPolicy = resolveSafetyPolicy(policy);</code> | 声明局部标识符 `safetyPolicy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 151 | <code>    if (!safetyPolicy.enabled) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 152 | <code>        return { block: false, reason: 'disabled' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    const safety = ensureSafetyState(state, policy);</code> | 声明局部标识符 `safety`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 155 | <code>    const repairBacklogCount = Array.isArray(state.repairBacklog) ? state.repairBacklog.length : 0;</code> | 声明局部标识符 `repairBacklogCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 156 | <code>    if (safetyPolicy.maxRepairBacklog &gt; 0 &amp;&amp; repairBacklogCount &gt;= safetyPolicy.maxRepairBacklog) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 157 | <code>        return buildSafetyBlock(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 158 | <code>            'max_repair_backlog',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 159 | <code>            `Repair backlog reached ${repairBacklogCount}, limit ${safetyPolicy.maxRepairBacklog}.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 160 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    if (verdict &amp;&amp; safetyPolicy.stopOnEnvironmentFailure &amp;&amp; normalizeText(verdict.failureCategory) === 'environment') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 163 | <code>        return buildSafetyBlock(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>            'environment_failure',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 165 | <code>            `Environment/provider failure is terminal for paid runs: ${normalizeText(verdict.summary, 'provider/environment failure')}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 166 | <code>            { failureCategory: 'environment' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 167 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 169 | <code>    if (safetyPolicy.maxConsecutiveFailures &gt; 0 &amp;&amp; safety.consecutiveFailures &gt;= safetyPolicy.maxConsecutiveFailures) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 170 | <code>        return buildSafetyBlock(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 171 | <code>            'max_consecutive_failures',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 172 | <code>            `Consecutive failures reached ${safety.consecutiveFailures}, limit ${safetyPolicy.maxConsecutiveFailures}.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 173 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>    if (safetyPolicy.maxEmptyAnswerStreak &gt; 0 &amp;&amp; safety.emptyAnswerStreak &gt;= safetyPolicy.maxEmptyAnswerStreak) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 176 | <code>        return buildSafetyBlock(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 177 | <code>            'max_empty_answer_streak',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 178 | <code>            `Empty-answer streak reached ${safety.emptyAnswerStreak}, limit ${safetyPolicy.maxEmptyAnswerStreak}.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 179 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 181 | <code>    const taskId = normalizeText(task?.taskId &#124;&#124; verdict?.taskId);</code> | 声明局部标识符 `taskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 182 | <code>    const taskAttempts = taskId ? Math.max(0, Number(safety.taskAttemptCounts?.[taskId]) &#124;&#124; 0) : 0;</code> | 声明局部标识符 `taskAttempts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 183 | <code>    if (taskId &amp;&amp; safetyPolicy.maxSameTaskAttempts &gt; 0 &amp;&amp; taskAttempts &gt;= safetyPolicy.maxSameTaskAttempts) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 184 | <code>        return buildSafetyBlock(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 185 | <code>            'max_same_task_attempts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 186 | <code>            `Task ${taskId} reached ${taskAttempts} attempts, limit ${safetyPolicy.maxSameTaskAttempts}.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 187 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>    const recent = Array.isArray(safety.recentVerdicts) ? safety.recentVerdicts.slice(-safetyPolicy.recentWindow) : [];</code> | 声明局部标识符 `recent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 190 | <code>    if (recent.length &gt;= safetyPolicy.minRecentSample) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 191 | <code>        const passRate = recent.filter((item) =&gt; item.ok === true).length / recent.length;</code> | 声明局部标识符 `passRate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 192 | <code>        if (passRate &lt; safetyPolicy.minRecentPassRate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 193 | <code>            return buildSafetyBlock(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 194 | <code>                'low_recent_pass_rate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 195 | <code>                `Recent pass rate ${passRate.toFixed(2)} over ${recent.length} runs is below ${safetyPolicy.minRecentPassRate}.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 196 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 198 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 199 | <code>    return { block: false, reason: 'ok' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 200 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 202 | <code>function parseArgs(argv = process.argv.slice(2)) {</code> | 定义函数 `parseArgs`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 203 | <code>    const args = {</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 204 | <code>        jobDir: DEFAULT_JOB_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 205 | <code>        source: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 206 | <code>        dryRun: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 207 | <code>        loop: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 208 | <code>        once: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 209 | <code>        smoke: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 210 | <code>        clearRepair: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 211 | <code>        taskId: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 212 | <code>        maxIterations: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 213 | <code>        maxAgentSteps: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 214 | <code>        taskRetries: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 215 | <code>        timeoutMs: 900000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 216 | <code>        datasetDir: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 217 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    for (let index = 0; index &lt; argv.length; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 219 | <code>        const token = argv[index];</code> | 声明局部标识符 `token`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 220 | <code>        const next = () =&gt; argv[++index] &#124;&#124; '';</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 221 | <code>        if (token === '--job-dir') args.jobDir = path.resolve(next());</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 222 | <code>        else if (token === '--source') args.source = normalizeText(next()).toLowerCase();</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 223 | <code>        else if (token === '--dry-run') args.dryRun = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 224 | <code>        else if (token === '--smoke') {</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 225 | <code>            args.smoke = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 226 | <code>            args.dryRun = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 227 | <code>            args.once = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 228 | <code>        } else if (token === '--loop') args.loop = true;</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 229 | <code>        else if (token === '--once') args.once = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 230 | <code>        else if (token === '--clear-repair') args.clearRepair = true;</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 231 | <code>        else if (token === '--task-id') args.taskId = normalizeText(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 232 | <code>        else if (token === '--max-iterations') args.maxIterations = Math.max(0, Number(next()) &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 233 | <code>        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(0, Number(next()) &#124;&#124; 0);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 234 | <code>        else if (token === '--task-retries') args.taskRetries = Math.max(0, Math.min(Number(next()) &#124;&#124; 0, 3));</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 235 | <code>        else if (token === '--timeout-ms') args.timeoutMs = Math.max(30000, Number(next()) &#124;&#124; args.timeoutMs);</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 236 | <code>        else if (token === '--dataset-dir') args.datasetDir = path.resolve(next());</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 237 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 238 | <code>    return args;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 239 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 241 | <code>async function readJson(filePath, fallback) {</code> | 定义函数 `readJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 242 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 243 | <code>        return JSON.parse(stripJsonBom(await fs.readFile(filePath, 'utf8')));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 244 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 245 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 246 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 247 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 248 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 249 | <code>async function writeJson(filePath, value) {</code> | 定义函数 `writeJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 250 | <code>    await fs.mkdir(path.dirname(filePath), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 251 | <code>    await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 252 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 253 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 254 | <code>async function appendEvent(jobDir, event) {</code> | 定义函数 `appendEvent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 255 | <code>    const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 256 | <code>        at: isoNow(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 257 | <code>        jobId: 'ailis-gaia-auto-optimizer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 258 | <code>        ...event</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 259 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>    await fs.mkdir(jobDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 261 | <code>    await fs.appendFile(path.join(jobDir, 'event-log.jsonl'), `${JSON.stringify(payload)}\n`, 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 262 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>async function updateProgress(jobDir, patch) {</code> | 定义函数 `updateProgress`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 265 | <code>    const progressPath = path.join(jobDir, 'progress.json');</code> | 声明局部标识符 `progressPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 266 | <code>    const previous = await readJson(progressPath, {});</code> | 声明局部标识符 `previous`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 267 | <code>    const lastUpdateAt = isoNow();</code> | 声明局部标识符 `lastUpdateAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 268 | <code>    await writeJson(progressPath, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 269 | <code>        jobId: 'ailis-gaia-auto-optimizer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 270 | <code>        ...previous,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 271 | <code>        ...patch,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 272 | <code>        lastUpdateAt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 273 | <code>        lastUpdateAgeSeconds: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 274 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 277 | <code>function buildPracticeTasks() {</code> | 定义函数 `buildPracticeTasks`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 278 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 280 | <code>            source: 'practice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 281 | <code>            taskId: 'cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 282 | <code>            title: 'Secret Santa DOCX',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 283 | <code>            question: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 284 | <code>                'An office held a Secret Santa gift exchange where each of its twelve employees was assigned one other employee in the group to present with a gift.',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 285 | <code>                'Each employee filled out a profile including three likes or hobbies.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 286 | <code>                'On the day of the gift exchange, only eleven gifts were given, each one specific to one of the recipient\'s interests.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 287 | <code>                'Based on the information in the attached document, who did not give a gift?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 288 | <code>                '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 289 | <code>                'Please read the attached DOCX completely, extract the people, interests, gifts, and constraints, then reason through the matching.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 290 | <code>                'Return only the name as the final answer.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 291 | <code>            ].join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 292 | <code>            fileName: 'task1-secret-santa.docx',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 293 | <code>            filePath: path.join(PROJECT_ROOT, 'gaia-practice-tasks', 'task1-secret-santa.docx'),</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 294 | <code>            expectedAnswer: 'Fred',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 295 | <code>            capabilityClass: 'document_reading_and_constraint_reasoning'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 296 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 298 | <code>            source: 'practice',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 299 | <code>            taskId: '65afbc8a-89ca-4ad5-8d62-355bb401f61d',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 300 | <code>            title: 'Excel Map Path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 301 | <code>            question: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 302 | <code>                'You are given the attached Excel file as a map. You start on the START cell and move toward the END cell.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 303 | <code>                'You are allowed to move two cells per turn, and you may move up, down, left, or right.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 304 | <code>                'You may not move fewer than two cells, and you may not move backward. You must avoid moving onto any blue cells.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 305 | <code>                '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 306 | <code>                'On the eleventh turn, what is the 6-digit hex code, without prefix, of the color of the cell where you land after moving?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 307 | <code>                '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 308 | <code>                'Please inspect the full spreadsheet, including cell colors. Do not rely on a first-rows preview.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 309 | <code>                'Return only the 6-digit hex code as the final answer.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 310 | <code>            ].join('\n'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 311 | <code>            fileName: 'task2-excel-map.xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 312 | <code>            filePath: path.join(PROJECT_ROOT, 'gaia-practice-tasks', 'task2-excel-map.xlsx'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 313 | <code>            expectedAnswer: 'F478A7',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 314 | <code>            capabilityClass: 'spreadsheet_grid_color_path_reasoning'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 315 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 316 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>function normalizeAnswer(value = '') {</code> | 定义函数 `normalizeAnswer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 320 | <code>    return normalizeText(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 321 | <code>        .replace(/^final\s*answer\s*[:：]\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 322 | <code>        .replace(/^answer\s*[:：]\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 323 | <code>        .replace(/^答案\s*(?:是&#124;为)?\s*[:：]?\s*/i, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 324 | <code>        .replace(/^["'“”‘’]+&#124;["'“”‘’]+$/g, '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 325 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 326 | <code>        .trim()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 327 | <code>        .toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 328 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>function discoverOfficialDatasetDir(explicitDir = '') {</code> | 定义函数 `discoverOfficialDatasetDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 331 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 332 | <code>        explicitDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 333 | <code>        path.join(PROJECT_ROOT, 'build-cache', 'hf-datasets', 'gaia-benchmark-GAIA'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 334 | <code>        'F:\\AIGril\\build-cache\\hf-datasets\\gaia-benchmark-GAIA',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 335 | <code>        'F:\\AILIS\\build-cache\\hf-datasets\\gaia-benchmark-GAIA',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 336 | <code>        'F:\\AIGril_self_evolution_runtime\\build-cache\\hf-datasets\\gaia-benchmark-GAIA'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 337 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 338 | <code>    return candidates.find((candidate) =&gt; fsSync.existsSync(path.join(candidate, '2023', 'validation'))) &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 341 | <code>function selectNextTask({ state = {}, policy = {}, args = {} } = {}) {</code> | 定义函数 `selectNextTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 342 | <code>    const source = args.source &#124;&#124; policy.taskSource &#124;&#124; 'practice_then_official';</code> | 声明局部标识符 `source`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 343 | <code>    const practiceTasks = buildPracticeTasks();</code> | 声明局部标识符 `practiceTasks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 344 | <code>    if (args.taskId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 345 | <code>        const practice = practiceTasks.find((task) =&gt; task.taskId === args.taskId);</code> | 声明局部标识符 `practice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 346 | <code>        if (practice) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 347 | <code>            return practice;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 348 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 349 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 350 | <code>            source: 'official',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 351 | <code>            taskId: args.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 352 | <code>            offset: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 353 | <code>            title: `Official GAIA task ${args.taskId}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 354 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>    if (source === 'practice' &#124;&#124; source === 'practice_then_official' &#124;&#124; source === 'auto') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 357 | <code>        const cursor = Math.max(0, Number(state.practiceCursor) &#124;&#124; 0);</code> | 声明局部标识符 `cursor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 358 | <code>        if (cursor &lt; practiceTasks.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 359 | <code>            return practiceTasks[cursor];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 360 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>        if (source === 'practice') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 362 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 364 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 365 | <code>    if (source === 'official' &#124;&#124; source === 'practice_then_official' &#124;&#124; source === 'auto') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 366 | <code>        const datasetDir = discoverOfficialDatasetDir(args.datasetDir);</code> | 声明局部标识符 `datasetDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 367 | <code>        if (!datasetDir) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 368 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 369 | <code>                source: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 370 | <code>                taskId: 'official-dataset-missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 371 | <code>                title: 'Official GAIA dataset missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 372 | <code>                failureCategory: 'environment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 373 | <code>                error: 'No local GAIA official dataset directory found.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 374 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 375 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>        const offset = Math.max(0, Number(state.officialCursor) &#124;&#124; 0);</code> | 声明局部标识符 `offset`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 377 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 378 | <code>            source: 'official',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 379 | <code>            taskId: `official-validation-l1-offset-${offset}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 380 | <code>            offset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 381 | <code>            datasetDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 382 | <code>            title: `Official GAIA validation level 1 offset ${offset}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 383 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 384 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 386 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 387 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 388 | <code>function runProcess(command, args, options = {}) {</code> | 定义函数 `runProcess`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 389 | <code>    return new Promise((resolve) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 390 | <code>        const startedAt = Date.now();</code> | 声明局部标识符 `startedAt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 391 | <code>        const child = spawn(command, args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 392 | <code>            cwd: options.cwd &#124;&#124; PROJECT_ROOT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 393 | <code>            env: { ...process.env, ...(options.env &#124;&#124; {}) },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 394 | <code>            stdio: ['ignore', 'pipe', 'pipe'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 395 | <code>            windowsHide: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 396 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>        let stdout = '';</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 398 | <code>        let stderr = '';</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 399 | <code>        const timeoutMs = Math.max(30000, Number(options.timeoutMs) &#124;&#124; 900000);</code> | 声明局部标识符 `timeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 400 | <code>        const timer = setTimeout(() =&gt; {</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 401 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 402 | <code>                child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 403 | <code>            } catch {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 404 | <code>        }, timeoutMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 405 | <code>        child.stdout?.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 406 | <code>            stdout += chunk.toString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 407 | <code>            options.onStdout?.(chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 408 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 409 | <code>        child.stderr?.on('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 410 | <code>            stderr += chunk.toString();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 411 | <code>            options.onStderr?.(chunk);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 412 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>        child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 414 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 415 | <code>            resolve({ ok: false, exitCode: 1, stdout, stderr, error: error?.message &#124;&#124; String(error), durationMs: Date.now() - startedAt });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 416 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>        child.on('close', (code) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 418 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 419 | <code>            resolve({ ok: code === 0, exitCode: code ?? 0, stdout, stderr, durationMs: Date.now() - startedAt });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 420 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 421 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 422 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 423 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 424 | <code>async function createPracticeScoringServer(task) {</code> | 定义函数 `createPracticeScoringServer`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 425 | <code>    const server = http.createServer(async (request, response) =&gt; {</code> | 声明局部标识符 `server`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 426 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 427 | <code>            const url = new URL(request.url &#124;&#124; '/', 'http://127.0.0.1');</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 428 | <code>            if (request.method === 'GET' &amp;&amp; url.pathname === '/questions') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 429 | <code>                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 430 | <code>                response.end(JSON.stringify([{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 431 | <code>                    task_id: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 432 | <code>                    question: task.question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 433 | <code>                    file_name: task.fileName</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 434 | <code>                }]));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 436 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 437 | <code>            if (request.method === 'GET' &amp;&amp; url.pathname.startsWith('/files/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 438 | <code>                const requested = decodeURIComponent(url.pathname.slice('/files/'.length));</code> | 声明局部标识符 `requested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 439 | <code>                if (requested !== task.fileName &#124;&#124; !fsSync.existsSync(task.filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 440 | <code>                    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 441 | <code>                    response.end('file not found');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 442 | <code>                    return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 443 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>                response.writeHead(200, { 'Content-Type': 'application/octet-stream' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 445 | <code>                fsSync.createReadStream(task.filePath).pipe(response);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 446 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 447 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>            if (request.method === 'POST' &amp;&amp; url.pathname === '/submit') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 449 | <code>                const chunks = [];</code> | 声明局部标识符 `chunks`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 450 | <code>                for await (const chunk of request) {</code> | 声明局部标识符 `chunk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 451 | <code>                    chunks.push(Buffer.from(chunk));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 452 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>                const payload = JSON.parse(Buffer.concat(chunks).toString('utf8') &#124;&#124; '{}');</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 454 | <code>                const answers = Array.isArray(payload.answers) ? payload.answers : [];</code> | 声明局部标识符 `answers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 455 | <code>                const submitted = normalizeText(answers[0]?.submitted_answer);</code> | 声明局部标识符 `submitted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 456 | <code>                const correct = normalizeAnswer(submitted) === normalizeAnswer(task.expectedAnswer);</code> | 声明局部标识符 `correct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 457 | <code>                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 458 | <code>                response.end(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 459 | <code>                    username: payload.username &#124;&#124; 'AILIS-local-codex',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 460 | <code>                    score: correct ? 100 : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 461 | <code>                    correct_count: correct ? 1 : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 462 | <code>                    total_attempted: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 463 | <code>                    message: `Practice local score: ${correct ? 1 : 0}/1`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 464 | <code>                    per_task: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 465 | <code>                        task_id: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 466 | <code>                        correct,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 467 | <code>                        submitted_answer: submitted,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 468 | <code>                        final_answer: task.expectedAnswer</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 469 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 470 | <code>                }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 471 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 472 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 474 | <code>            response.end('not found');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 475 | <code>        } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 476 | <code>            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 477 | <code>            response.end(error?.stack &#124;&#124; error?.message &#124;&#124; String(error));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 478 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 479 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 480 | <code>    return new Promise((resolve) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 481 | <code>        server.listen(0, '127.0.0.1', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 482 | <code>            const address = server.address();</code> | 声明局部标识符 `address`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 483 | <code>            resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 484 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 485 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>async function runPracticeTask({ task, iterationDir, runId, policy, args }) {</code> | 定义函数 `runPracticeTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 489 | <code>    const outputDir = path.join(iterationDir, 'eval-results');</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 490 | <code>    await fs.mkdir(outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 491 | <code>    const { server, baseUrl } = await createPracticeScoringServer(task);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 492 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 493 | <code>        const commandArgs = [</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 494 | <code>            'scripts/run-gaia-level1-lite.mjs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 495 | <code>            '--output-dir', outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 496 | <code>            '--run-id', runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 497 | <code>            '--scoring-api', baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 498 | <code>            '--file-mirror', `${baseUrl}/files`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 499 | <code>            '--submit',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 500 | <code>            '--limit', '1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 501 | <code>            '--task-retries', String(resolveTaskRetries(policy, args)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 502 | <code>            '--max-agent-steps', String(args.maxAgentSteps &#124;&#124; policy.maxAgentSteps &#124;&#124; 20),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 503 | <code>            '--request-timeout-ms', '300000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 504 | <code>            '--llm-timeout-ms', '120000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 505 | <code>            '--submit-timeout-ms', '90000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 506 | <code>            '--benchmark-name', 'ailis-gaia-practice-auto-optimizer'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 507 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 508 | <code>        if (/^(1&#124;true&#124;yes&#124;on)$/i.test(process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR &#124;&#124; '')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 509 | <code>            commandArgs.push('--direct-tool-executor');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 510 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 511 | <code>        const processResult = await runProcess('node', commandArgs, {</code> | 声明局部标识符 `processResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 512 | <code>            timeoutMs: args.timeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 513 | <code>            onStdout: (chunk) =&gt; process.stdout.write(chunk),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 514 | <code>            onStderr: (chunk) =&gt; process.stderr.write(chunk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 515 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 516 | <code>        return { outputDir, processResult };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 517 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 518 | <code>        await new Promise((resolve) =&gt; server.close(resolve));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 519 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 520 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 521 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 522 | <code>async function runOfficialTask({ task, iterationDir, runId, policy, args }) {</code> | 定义函数 `runOfficialTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 523 | <code>    const outputDir = path.join(iterationDir, 'eval-results');</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 524 | <code>    await fs.mkdir(outputDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 525 | <code>    const requestTimeoutMs = Math.max(300000, Number(args.timeoutMs) &#124;&#124; Number(policy.requestTimeoutMs) &#124;&#124; 600000);</code> | 声明局部标识符 `requestTimeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 526 | <code>    const llmTimeoutMs = Math.max(120000, Number(policy.llmTimeoutMs) &#124;&#124; 120000);</code> | 声明局部标识符 `llmTimeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 527 | <code>    const submitTimeoutMs = Math.max(90000, Number(policy.submitTimeoutMs) &#124;&#124; 90000);</code> | 声明局部标识符 `submitTimeoutMs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 528 | <code>    const commandArgs = [</code> | 声明局部标识符 `commandArgs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 529 | <code>        'scripts/run-gaia-official.mjs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 530 | <code>        '--split', 'validation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 531 | <code>        '--levels', '1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 532 | <code>        '--output-dir', outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 533 | <code>        '--run-id', runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 534 | <code>        '--dataset-dir', task.datasetDir &#124;&#124; discoverOfficialDatasetDir(args.datasetDir),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 535 | <code>        '--skip-download',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 536 | <code>        '--limit', '1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 537 | <code>        '--offset', String(Math.max(0, Number(task.offset) &#124;&#124; 0)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 538 | <code>        '--max-agent-steps', String(args.maxAgentSteps &#124;&#124; policy.maxAgentSteps &#124;&#124; 20),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 539 | <code>        '--task-retries', String(resolveTaskRetries(policy, args)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 540 | <code>        '--request-timeout-ms', String(requestTimeoutMs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 541 | <code>        '--llm-timeout-ms', String(llmTimeoutMs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 542 | <code>        '--submit-timeout-ms', String(submitTimeoutMs)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 543 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>    if (task.taskId &amp;&amp; !/^official-validation-l1-offset-/.test(task.taskId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 545 | <code>        commandArgs.push('--task-ids', task.taskId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 546 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>    const processResult = await runProcess('node', commandArgs, {</code> | 声明局部标识符 `processResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 548 | <code>        timeoutMs: Math.max(Number(args.timeoutMs) &#124;&#124; 0, requestTimeoutMs + llmTimeoutMs + submitTimeoutMs + 60000),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 549 | <code>        onStdout: (chunk) =&gt; process.stdout.write(chunk),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 550 | <code>        onStderr: (chunk) =&gt; process.stderr.write(chunk)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 551 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>    return { outputDir, processResult };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 553 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 555 | <code>async function readJsonIfExists(filePath) {</code> | 定义函数 `readJsonIfExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 556 | <code>    if (!filePath &#124;&#124; !fsSync.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 557 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 558 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 559 | <code>    return JSON.parse(stripJsonBom(await fs.readFile(filePath, 'utf8')));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 560 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 561 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 562 | <code>async function readJsonlIfExists(filePath) {</code> | 定义函数 `readJsonlIfExists`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 563 | <code>    if (!filePath &#124;&#124; !fsSync.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 564 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 565 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 566 | <code>    const lines = stripJsonBom(await fs.readFile(filePath, 'utf8')).split(/\r?\n/).filter(Boolean);</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 567 | <code>    return lines.map((line) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 568 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 569 | <code>            return JSON.parse(line);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 570 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 571 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 572 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>    }).filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 574 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>function summarizeStep(step = {}, index = 0) {</code> | 定义函数 `summarizeStep`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 577 | <code>    const response = step.response &#124;&#124; {};</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 578 | <code>    const result = response.result &#124;&#124; {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 579 | <code>    const details = result.structuredContent &#124;&#124; result.details &#124;&#124; result.structured_content &#124;&#124; {};</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 580 | <code>    const nested = details.result?.structuredContent &#124;&#124; details.result?.details &#124;&#124; {};</code> | 声明局部标识符 `nested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 581 | <code>    const mergedDetails = { ...details, ...nested };</code> | 声明局部标识符 `mergedDetails`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 582 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 583 | <code>        index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 584 | <code>        tool: step.tool &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 585 | <code>        title: step.title &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 586 | <code>        args: step.args &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 587 | <code>        ok: response.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 588 | <code>        status: response.status &#124;&#124; mergedDetails.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 589 | <code>        error: normalizeText(response.error &#124;&#124; mergedDetails.error).slice(0, 500),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 590 | <code>        evidenceQuality: normalizeText(mergedDetails.evidenceQuality &#124;&#124; mergedDetails.evidence_quality &#124;&#124; mergedDetails.observationContract?.evidence_quality),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 591 | <code>        reasoningReady: mergedDetails.reasoningReady ?? mergedDetails.reasoning_ready ?? mergedDetails.observationContract?.reasoning_ready,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 592 | <code>        preview: normalizeText(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 593 | <code>            result.content?.[0]?.text &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 594 | <code>            mergedDetails.evidenceGap &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 595 | <code>            mergedDetails.recoveryHint &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 596 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 597 | <code>        ).replace(/\s+/g, ' ').slice(0, 900)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 598 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 599 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 601 | <code>function extractExecutionChain({ task, result = {}, processResult = {}, summary = null } = {}) {</code> | 定义函数 `extractExecutionChain`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 602 | <code>    const steps = Array.isArray(result.steps) ? result.steps.map(summarizeStep) : [];</code> | 声明局部标识符 `steps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 603 | <code>    const toolCounts = {};</code> | 声明局部标识符 `toolCounts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 604 | <code>    const perTask = findScorePerTask({ task, result, summary });</code> | 声明局部标识符 `perTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 605 | <code>    for (const step of steps) {</code> | 声明局部标识符 `step`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 606 | <code>        const key = step.tool &#124;&#124; '(unknown)';</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 607 | <code>        toolCounts[key] = (toolCounts[key] &#124;&#124; 0) + 1;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 608 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 609 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 610 | <code>        taskId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 611 | <code>        resultTaskId: result.task_id &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 612 | <code>        source: task.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 613 | <code>        title: task.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 614 | <code>        question: normalizeText(task.question &#124;&#124; result.question),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 615 | <code>        fileName: normalizeText(task.fileName &#124;&#124; result.file_name),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 616 | <code>        filePath: normalizeText(task.filePath &#124;&#124; result.file_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 617 | <code>        expectedAnswer: task.expectedAnswer &#124;&#124; perTask?.final_answer &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 618 | <code>        submittedAnswer: result.submitted_answer &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 619 | <code>        answerGate: result.answer_gate &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 620 | <code>        finalizer: result.finalizer &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 621 | <code>        ok: result.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 622 | <code>        status: result.status &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 623 | <code>        durationMs: result.durationMs &#124;&#124; processResult.durationMs &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 624 | <code>        stepCount: Number(result.step_count) &#124;&#124; steps.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 625 | <code>        toolCounts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 626 | <code>        steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 627 | <code>        rawStatus: result.raw_status &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 628 | <code>        score: summary?.score &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 629 | <code>        process: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 630 | <code>            ok: processResult.ok === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 631 | <code>            exitCode: processResult.exitCode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 632 | <code>            durationMs: processResult.durationMs &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 633 | <code>            stderrTail: normalizeText(processResult.stderr).slice(-2000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 634 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 635 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 636 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>function enrichTaskFromGaiaResult(task = {}, result = {}) {</code> | 定义函数 `enrichTaskFromGaiaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 639 | <code>    const enriched = { ...task };</code> | 声明局部标识符 `enriched`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 640 | <code>    const question = normalizeText(result.question);</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 641 | <code>    const fileName = normalizeText(result.file_name);</code> | 声明局部标识符 `fileName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 642 | <code>    const filePath = normalizeText(result.file_path);</code> | 声明局部标识符 `filePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 643 | <code>    const resultTaskId = normalizeText(result.task_id);</code> | 声明局部标识符 `resultTaskId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 644 | <code>    if (question &amp;&amp; !normalizeText(enriched.question)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 645 | <code>        enriched.question = question;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 646 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>    if (fileName &amp;&amp; !normalizeText(enriched.fileName)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 648 | <code>        enriched.fileName = fileName;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 649 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>    if (filePath &amp;&amp; !normalizeText(enriched.filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 651 | <code>        enriched.filePath = filePath;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 652 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 653 | <code>    if (resultTaskId &amp;&amp; resultTaskId !== normalizeText(enriched.taskId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 654 | <code>        enriched.gaiaTaskId = resultTaskId;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 655 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>    if (result.answer_gate) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 657 | <code>        enriched.lastAnswerGate = result.answer_gate;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 658 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 659 | <code>    if (result.finalizer) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 660 | <code>        enriched.lastFinalizer = result.finalizer;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 661 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>    return enriched;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 663 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 664 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 665 | <code>function findScorePerTask({ task = {}, result = {}, summary = null } = {}) {</code> | 定义函数 `findScorePerTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 666 | <code>    const perTaskItems = Array.isArray(summary?.score?.per_task) ? summary.score.per_task : [];</code> | 声明局部标识符 `perTaskItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 667 | <code>    if (!perTaskItems.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 668 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 669 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 670 | <code>    const ids = [</code> | 声明局部标识符 `ids`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 671 | <code>        task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 672 | <code>        task.gaiaTaskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 673 | <code>        result.task_id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 674 | <code>        result.taskId</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 675 | <code>    ].map((item) =&gt; normalizeText(item)).filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 676 | <code>    const byId = perTaskItems.find((item) =&gt; ids.includes(normalizeText(item.task_id)));</code> | 声明局部标识符 `byId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 677 | <code>    if (byId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 678 | <code>        return byId;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 679 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>    const submitted = normalizeAnswer(result.submitted_answer);</code> | 声明局部标识符 `submitted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 681 | <code>    const bySubmittedAnswer = submitted</code> | 声明局部标识符 `bySubmittedAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 682 | <code>        ? perTaskItems.filter((item) =&gt; normalizeAnswer(item.submitted_answer) === submitted)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 683 | <code>        : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 684 | <code>    if (bySubmittedAnswer.length === 1) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 685 | <code>        return bySubmittedAnswer[0];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 686 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>    return perTaskItems.length === 1 ? perTaskItems[0] : null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 688 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 689 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 690 | <code>function classifyGaiaResult({ task = {}, result = {}, chain = {}, processResult = {}, summary = null } = {}) {</code> | 定义函数 `classifyGaiaResult`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 691 | <code>    const perTask = findScorePerTask({ task, result, summary });</code> | 声明局部标识符 `perTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 692 | <code>    const expected = task.expectedAnswer &#124;&#124; perTask?.final_answer &#124;&#124; '';</code> | 声明局部标识符 `expected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 693 | <code>    const correct = perTask</code> | 声明局部标识符 `correct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 694 | <code>        ? perTask.correct === true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 695 | <code>        : expected</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 696 | <code>            ? normalizeAnswer(result.submitted_answer) === normalizeAnswer(expected)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 697 | <code>            : result.ok === true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 698 | <code>    const stepText = JSON.stringify(chain.steps &#124;&#124; []);</code> | 声明局部标识符 `stepText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 699 | <code>    const statusText = `${result.status &#124;&#124; ''} ${result.raw_status?.status &#124;&#124; ''} ${result.raw_status?.error &#124;&#124; ''} ${processResult.stderr &#124;&#124; ''} ${stepText}`;</code> | 声明局部标识符 `statusText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 700 | <code>    if (result.ok === true &amp;&amp; correct) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 701 | <code>        const highLoop = Number(chain.stepCount) &gt;= 10;</code> | 声明局部标识符 `highLoop`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 702 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 703 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 704 | <code>            status: highLoop ? 'passed_efficiency_review_needed' : 'passed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 705 | <code>            failureCategory: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 706 | <code>            optimizationFocus: highLoop ? 'efficiency' : 'none',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 707 | <code>            generalizedCapability: task.capabilityClass &#124;&#124; 'gaia_task_execution',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 708 | <code>            summary: highLoop</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 709 | <code>                ? `Task passed, but used ${chain.stepCount} steps. Optimize loop efficiency without reducing reliability.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 710 | <code>                : 'Task passed with acceptable local verdict.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 711 | <code>            nextAction: highLoop ? 'analyze redundant steps and reduce loop count' : 'advance to next task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 712 | <code>            emptyAnswer: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 713 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 714 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>    if (/LLM settings incomplete&#124;desktop-state\.json&#124;api.?key&#124;provider_error&#124;auth&#124;token&#124;overdue&#124;past due&#124;unpaid&#124;quota&#124;billing&#124;balance&#124;欠费&#124;余额不足&#124;额度/i.test(statusText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 716 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 717 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 718 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 719 | <code>            failureCategory: 'environment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 720 | <code>            optimizationFocus: 'configuration_and_provider_readiness',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 721 | <code>            generalizedCapability: 'llm_provider_and_dataset_environment',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 722 | <code>            summary: 'Task could not run because local provider, auth, or dataset environment is incomplete.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 723 | <code>            nextAction: 'repair environment detection and readiness reporting before rerunning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 724 | <code>            emptyAnswer: !normalizeText(result.submitted_answer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 725 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>    if (perTask &amp;&amp; perTask.correct !== true) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 728 | <code>        const submitted = normalizeText(perTask.submitted_answer &#124;&#124; result.submitted_answer &#124;&#124; '(empty)');</code> | 声明局部标识符 `submitted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 729 | <code>        const finalAnswer = normalizeText(perTask.final_answer &#124;&#124; expected &#124;&#124; '(unknown)');</code> | 声明局部标识符 `finalAnswer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 730 | <code>        if (/web_fetch&#124;web_search&#124;js_shell&#124;thin_content&#124;HTTP 403&#124;HTTP 404&#124;access_challenge&#124;miyoushe&#124;crawl4ai/i.test(statusText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 731 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 732 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 733 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 734 | <code>                failureCategory: 'web_retrieval_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 735 | <code>                optimizationFocus: 'web_search_web_fetch_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 736 | <code>                generalizedCapability: 'robust_web_retrieval_and_rendered_extraction',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 737 | <code>                summary: `Local GAIA scorer rejected web-derived answer (${submitted}); expected ${finalAnswer}. The failed chain should be repaired at the retrieval/evidence layer before finalization.`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 738 | <code>                nextAction: 'patch generalized web_search/web_fetch evidence selection, source following, or rendered extraction before rerunning',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 739 | <code>                emptyAnswer: normalizeAnswer(submitted) === normalizeAnswer('(empty)')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 740 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 741 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>        if (/describe_image&#124;read_document&#124;read_spreadsheet&#124;read_presentation&#124;pdf_extract&#124;pdf_find&#124;transcribe_audio&#124;download_file/i.test(statusText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 743 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 744 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 745 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 746 | <code>                failureCategory: 'tools_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 747 | <code>                optimizationFocus: /describe_image/i.test(statusText) ? 'vision_artifact_extraction_mcp' : 'artifact_tools_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 748 | <code>                generalizedCapability: /describe_image/i.test(statusText) ? 'robust_image_ocr_and_visual_extraction' : (task.capabilityClass &#124;&#124; 'artifact_reading_tools'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 749 | <code>                summary: `Local GAIA scorer rejected tool-derived answer (${submitted}); expected ${finalAnswer}. The failed chain used artifact/MCP tools, so repair extraction/schema/evidence quality before changing the agent.`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 750 | <code>                nextAction: 'patch the relevant MCP/tool contract, extraction quality, or evidence handoff and add a focused regression',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 751 | <code>                emptyAnswer: normalizeAnswer(submitted) === normalizeAnswer('(empty)')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 752 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 753 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 754 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 755 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 756 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 757 | <code>            failureCategory: 'harness_finalization',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 758 | <code>            optimizationFocus: 'exact_answer_finalization',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 759 | <code>            generalizedCapability: 'benchmark_final_answer_and_evidence_gate',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 760 | <code>            summary: `Local GAIA scorer rejected the submitted answer (${submitted}); expected ${finalAnswer}.`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 761 | <code>            nextAction: 'repair exact-answer reasoning, unit conversion, and scorer verdict handling before advancing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 762 | <code>            emptyAnswer: normalizeAnswer(submitted) === normalizeAnswer('(empty)')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 763 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 765 | <code>    if (/web_fetch&#124;web_search&#124;js_shell&#124;thin_content&#124;HTTP 403&#124;HTTP 404&#124;access_challenge&#124;miyoushe&#124;crawl4ai/i.test(statusText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 766 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 767 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 768 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 769 | <code>            failureCategory: 'web_retrieval_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 770 | <code>            optimizationFocus: 'web_search_web_fetch_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 771 | <code>            generalizedCapability: 'robust_web_retrieval_and_rendered_extraction',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 772 | <code>            summary: 'Failure chain involves web discovery/fetch quality, blocked pages, JS shell, or source-followup behavior.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 773 | <code>            nextAction: 'patch generalized web_search/web_fetch evidence selection or rendered extraction',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 774 | <code>            emptyAnswer: !normalizeText(result.submitted_answer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 775 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 776 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>    if (/read_document&#124;read_spreadsheet&#124;read_presentation&#124;pdf_extract&#124;pdf_find&#124;transcribe_audio&#124;describe_image&#124;download_file/i.test(statusText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 778 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 779 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 780 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 781 | <code>            failureCategory: 'tools_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 782 | <code>            optimizationFocus: 'artifact_tools_mcp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 783 | <code>            generalizedCapability: task.capabilityClass &#124;&#124; 'artifact_reading_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 784 | <code>            summary: 'Failure chain involves artifact-specific tool or MCP behavior.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 785 | <code>            nextAction: 'patch the artifact tool/MCP contract and add a focused regression',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 786 | <code>            emptyAnswer: !normalizeText(result.submitted_answer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 787 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 788 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>    if (/missing_exact_answer&#124;rejected_visible_prose&#124;finalizer&#124;answer_gate&#124;exact answer&#124;no submitted/i.test(statusText) &#124;&#124; !normalizeText(result.submitted_answer)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 790 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 791 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 792 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 793 | <code>            failureCategory: 'harness_finalization',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 794 | <code>            optimizationFocus: 'exact_answer_finalization',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 795 | <code>            generalizedCapability: 'benchmark_final_answer_and_evidence_gate',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 796 | <code>            summary: 'The agent did not produce an acceptable exact answer or the answer gate rejected it.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 797 | <code>            nextAction: 'repair exact-answer finalization and evidence digest handling',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 798 | <code>            emptyAnswer: !normalizeText(result.submitted_answer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 799 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 800 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 801 | <code>    if (Number(chain.stepCount) &gt;= 15 &#124;&#124; /loop_guard&#124;repeated&#124;same .* tried twice&#124;tool_search/i.test(statusText)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 802 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 803 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 804 | <code>            status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 805 | <code>            failureCategory: 'agent_architecture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 806 | <code>            optimizationFocus: 'agent_stopping_and_tool_choice',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 807 | <code>            generalizedCapability: 'agent_loop_control_and_ready_evidence_stopping',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 808 | <code>            summary: 'The chain suggests poor stopping behavior, repeated tool calls, or bad tool choice.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 809 | <code>            nextAction: 'patch Agent/Harness only if Tools/MCP evidence is already sufficient',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 810 | <code>            emptyAnswer: !normalizeText(result.submitted_answer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 811 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 812 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 814 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 815 | <code>        status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 816 | <code>        failureCategory: 'model_reasoning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 817 | <code>        optimizationFocus: 'reasoning_from_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 818 | <code>        generalizedCapability: task.capabilityClass &#124;&#124; 'gaia_reasoning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 819 | <code>        summary: 'Evidence may have been available, but the final answer was wrong or absent without a clearer tool failure.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 820 | <code>        nextAction: 'inspect chain and decide whether evidence extraction or reasoning prompt needs generalized repair',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 821 | <code>        emptyAnswer: !normalizeText(result.submitted_answer)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 822 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 823 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>function buildRepairTicket({ task, chain, verdict }) {</code> | 定义函数 `buildRepairTicket`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 826 | <code>    return [</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 827 | <code>        `# GAIA Repair Ticket: ${task.taskId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 828 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 829 | <code>        `- Source: ${task.source}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 830 | <code>        `- Title: ${task.title}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 831 | <code>        task.question ? `- Question: ${normalizeText(task.question).slice(0, 1000)}` : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 832 | <code>        task.fileName ? `- File: ${task.fileName}` : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 833 | <code>        task.filePath ? `- File path: ${task.filePath}` : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 834 | <code>        `- Failure category: ${verdict.failureCategory &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 835 | <code>        `- Optimization focus: ${verdict.optimizationFocus &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 836 | <code>        `- Generalized capability: ${verdict.generalizedCapability &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 837 | <code>        `- Submitted answer: ${chain.submittedAnswer &#124;&#124; '(empty)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 838 | <code>        `- Expected answer: ${chain.expectedAnswer &#124;&#124; '(unknown)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 839 | <code>        `- Step count: ${chain.stepCount}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 840 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 841 | <code>        '## Diagnosis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 842 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 843 | <code>        verdict.summary &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 844 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 845 | <code>        '## Required Repair Policy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 846 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 847 | <code>        '- Do not hard-code this task, its answer, or one-off strings.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 848 | <code>        '- Prefer a Tools/MCP fix if the first wrong turn is parser, fetcher, reader, schema, extraction, or source ranking.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 849 | <code>        '- Touch Agent/Harness only when the chain proves stopping, finalization, loop control, or evidence handoff is the generalized bottleneck.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 850 | <code>        '- Add or update a regression test that protects a class of similar tasks.',</code> | 定义类 `of`，把相关状态与行为收拢为一个运行时对象。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 851 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 852 | <code>        '## Execution Chain',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 853 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 854 | <code>        ...(chain.steps &#124;&#124; []).map((step) =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 855 | <code>            `### ${step.index + 1}. ${step.tool &#124;&#124; '(unknown tool)'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 856 | <code>            '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 857 | <code>            `- ok: ${step.ok}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 858 | <code>            `- status: ${step.status &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 859 | <code>            `- evidenceQuality: ${step.evidenceQuality &#124;&#124; '(none)'}`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 860 | <code>            `- error: ${step.error &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 861 | <code>            `- preview: ${step.preview &#124;&#124; '(none)'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 862 | <code>            ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 863 | <code>        ].join('\n')),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 864 | <code>        ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 865 | <code>    ].filter((line) =&gt; line !== null).join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 866 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 867 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 868 | <code>async function analyzeRun({ task, iterationDir, runId, outputDir, processResult }) {</code> | 定义函数 `analyzeRun`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 869 | <code>    const summaryPath = path.join(outputDir, `${runId}.summary.json`);</code> | 声明局部标识符 `summaryPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 870 | <code>    const resultPath = path.join(outputDir, `${runId}.jsonl`);</code> | 声明局部标识符 `resultPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 871 | <code>    const summary = await readJsonIfExists(summaryPath);</code> | 声明局部标识符 `summary`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 872 | <code>    const rows = await readJsonlIfExists(resultPath);</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 873 | <code>    const result = [...rows].reverse().find((row) =&gt; row.record_type === 'final') &#124;&#124; rows[rows.length - 1] &#124;&#124; {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 874 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 875 | <code>        status: processResult.ok ? 'missing_result_jsonl' : 'runner_error',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 876 | <code>        error: processResult.error &#124;&#124; processResult.stderr &#124;&#124; 'result jsonl missing'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 877 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 878 | <code>    const enrichedTask = enrichTaskFromGaiaResult(task, result);</code> | 声明局部标识符 `enrichedTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 879 | <code>    const chain = extractExecutionChain({ task: enrichedTask, result, processResult, summary });</code> | 声明局部标识符 `chain`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 880 | <code>    const verdict = classifyGaiaResult({ task: enrichedTask, result, chain, processResult, summary });</code> | 声明局部标识符 `verdict`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 881 | <code>    const chainPath = path.join(iterationDir, 'chain.json');</code> | 声明局部标识符 `chainPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 882 | <code>    const verdictPath = path.join(iterationDir, 'verdict.json');</code> | 声明局部标识符 `verdictPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 883 | <code>    const repairTicketPath = path.join(iterationDir, 'repair-ticket.md');</code> | 声明局部标识符 `repairTicketPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 884 | <code>    await writeJson(path.join(iterationDir, 'task.json'), enrichedTask);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 885 | <code>    await writeJson(chainPath, chain);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 886 | <code>    await writeJson(verdictPath, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 887 | <code>        ...verdict,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 888 | <code>        taskId: enrichedTask.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 889 | <code>        source: enrichedTask.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 890 | <code>        gaiaTaskId: enrichedTask.gaiaTaskId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 891 | <code>        question: enrichedTask.question &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 892 | <code>        fileName: enrichedTask.fileName &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 893 | <code>        filePath: enrichedTask.filePath &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 894 | <code>        chainPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 895 | <code>        summaryPath: fsSync.existsSync(summaryPath) ? summaryPath : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 896 | <code>        resultPath: fsSync.existsSync(resultPath) ? resultPath : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 897 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 898 | <code>    if (!verdict.ok &#124;&#124; verdict.optimizationFocus === 'efficiency') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 899 | <code>        await fs.writeFile(repairTicketPath, buildRepairTicket({ task: enrichedTask, chain, verdict }), 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 900 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>    return { chain, verdict, paths: { chainPath, verdictPath, repairTicketPath, summaryPath, resultPath } };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 902 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 903 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 904 | <code>async function executeTask({ task, iterationDir, runId, policy, args }) {</code> | 定义函数 `executeTask`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 905 | <code>    if (args.dryRun) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 906 | <code>        const processResult = { ok: true, exitCode: 0, stdout: '', stderr: '', durationMs: 0 };</code> | 声明局部标识符 `processResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 907 | <code>        const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 908 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 909 | <code>            status: 'dry_run_planned',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 910 | <code>            submitted_answer: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 911 | <code>            step_count: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 912 | <code>            steps: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 913 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 914 | <code>        const chain = extractExecutionChain({ task, result, processResult, summary: null });</code> | 声明局部标识符 `chain`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 915 | <code>        const verdict = {</code> | 声明局部标识符 `verdict`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 916 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 917 | <code>            status: 'planned',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 918 | <code>            failureCategory: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 919 | <code>            optimizationFocus: 'dry_run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 920 | <code>            generalizedCapability: task.capabilityClass &#124;&#124; 'gaia_task_execution',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 921 | <code>            summary: 'Dry run planned the next task without executing the benchmark.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 922 | <code>            nextAction: 'run without --dry-run to execute this task'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 923 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 924 | <code>        const chainPath = path.join(iterationDir, 'chain.json');</code> | 声明局部标识符 `chainPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 925 | <code>        const verdictPath = path.join(iterationDir, 'verdict.json');</code> | 声明局部标识符 `verdictPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 926 | <code>        await writeJson(chainPath, chain);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 927 | <code>        await writeJson(verdictPath, { ...verdict, taskId: task.taskId, source: task.source, chainPath });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 928 | <code>        return { chain, verdict, paths: { chainPath, verdictPath } };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 929 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 930 | <code>    const runResult = task.source === 'practice'</code> | 声明局部标识符 `runResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 931 | <code>        ? await runPracticeTask({ task, iterationDir, runId, policy, args })</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 932 | <code>        : await runOfficialTask({ task, iterationDir, runId, policy, args });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 933 | <code>    return await analyzeRun({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 934 | <code>        task,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 935 | <code>        iterationDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 936 | <code>        runId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 937 | <code>        outputDir: runResult.outputDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 938 | <code>        processResult: runResult.processResult</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 939 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 940 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 941 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 942 | <code>async function loadStateAndPolicy(jobDir) {</code> | 定义函数 `loadStateAndPolicy`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 943 | <code>    const policy = await readJson(path.join(jobDir, 'loop-policy.json'), {});</code> | 声明局部标识符 `policy`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 944 | <code>    const state = await readJson(path.join(jobDir, 'state.json'), {</code> | 声明局部标识符 `state`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 945 | <code>        jobId: 'ailis-gaia-auto-optimizer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 946 | <code>        status: 'created',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 947 | <code>        iteration: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 948 | <code>        practiceCursor: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 949 | <code>        officialCursor: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 950 | <code>        completedTaskIds: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 951 | <code>        failedTaskIds: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 952 | <code>        repairRequired: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 953 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 954 | <code>    return { policy, state };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 955 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 956 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 957 | <code>async function saveState(jobDir, state) {</code> | 定义函数 `saveState`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 958 | <code>    await writeJson(path.join(jobDir, 'state.json'), {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 959 | <code>        ...state,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 960 | <code>        updatedAt: isoNow()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 961 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 962 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 963 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 964 | <code>async function blockForSafetyGate(jobDir, state, gate, { iteration = 0, policy = {} } = {}) {</code> | 定义函数 `blockForSafetyGate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 965 | <code>    ensureSafetyState(state, policy);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 966 | <code>    state.status = 'repair_required';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 967 | <code>    state.repairRequired = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 968 | <code>    state.safety.lastSafetyBlock = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 969 | <code>        at: isoNow(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 970 | <code>        reason: gate.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 971 | <code>        summary: gate.summary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 972 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 973 | <code>    await saveState(jobDir, state);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 974 | <code>    await updateProgress(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 975 | <code>        status: 'repair_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 976 | <code>        currentAction: `safety gate blocked: ${gate.reason}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 977 | <code>        activeAgentRuns: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 978 | <code>        latestArtifactPath: state.lastVerdictPath &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 979 | <code>        latestEvidence: gate.summary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 980 | <code>        nextAction: gate.nextAction,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 981 | <code>        risk: gate.failureCategory === 'environment' ? 'environment' : `spend_safety:${gate.reason}`</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 982 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 983 | <code>    await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 984 | <code>        type: 'JOB_BLOCKED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 985 | <code>        iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 986 | <code>        summary: gate.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 987 | <code>        failureCategory: gate.failureCategory &#124;&#124; 'spend_safety'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 988 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 989 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 990 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 991 | <code>async function runController(args = parseArgs()) {</code> | 定义函数 `runController`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 992 | <code>    const jobDir = args.jobDir;</code> | 声明局部标识符 `jobDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 993 | <code>    await fs.mkdir(path.join(jobDir, 'iterations'), { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 994 | <code>    let { policy, state } = await loadStateAndPolicy(jobDir);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 995 | <code>    ensureSafetyState(state, policy);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 996 | <code>    if (args.clearRepair) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 997 | <code>        state.repairRequired = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 998 | <code>        state.status = 'ready_after_repair';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 999 | <code>        state.safety.lastSafetyBlock = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1000 | <code>        await saveState(jobDir, state);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1001 | <code>        await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1002 | <code>            type: 'REPAIR_CLEARED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1003 | <code>            iteration: state.iteration &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1004 | <code>            summary: 'repairRequired cleared by --clear-repair for a validation retry'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1005 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1006 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1007 | <code>    await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1008 | <code>        type: 'CONTROLLER_STARTED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1009 | <code>        iteration: state.iteration &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1010 | <code>        summary: args.dryRun ? 'controller started in dry-run mode' : 'controller started'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1011 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1012 | <code>    const maxIterations = args.maxIterations &#124;&#124; (args.loop ? Number(policy.maxIterationsPerControllerRun) &#124;&#124; 1 : 1);</code> | 声明局部标识符 `maxIterations`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1013 | <code>    for (let count = 0; count &lt; maxIterations; count += 1) {</code> | 声明局部标识符 `count`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1014 | <code>        if (fsSync.existsSync(path.join(jobDir, 'stop.flag'))) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1015 | <code>            state.status = 'stopped';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1016 | <code>            await saveState(jobDir, state);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1017 | <code>            await appendEvent(jobDir, { type: 'JOB_STOPPED', iteration: state.iteration &#124;&#124; 0, summary: 'stop.flag present' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1018 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1019 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1020 | <code>        if (state.repairRequired &amp;&amp; !args.dryRun &amp;&amp; !shouldContinueAfterFailure(policy)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1021 | <code>            const previousProgress = await readJson(path.join(jobDir, 'progress.json'), {});</code> | 声明局部标识符 `previousProgress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1022 | <code>            await updateProgress(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1023 | <code>                status: 'repair_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1024 | <code>                currentAction: 'paused_before_duplicate_retry',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1025 | <code>                latestArtifactPath: state.lastVerdictPath &#124;&#124; '',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1026 | <code>                latestEvidence: previousProgress.latestEvidence &#124;&#124; 'previous iteration requires generalized repair',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1027 | <code>                nextAction: 'Codex heartbeat/current session should patch the generalized bottleneck, run focused tests, then resume with --clear-repair; do not rerun the same failing task before repair.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1028 | <code>                risk: previousProgress.risk &#124;&#124; 'repair_required'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1029 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1030 | <code>            await appendEvent(jobDir, { type: 'JOB_BLOCKED', iteration: state.iteration &#124;&#124; 0, summary: 'repair required before next task', failureCategory: 'blocked' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1031 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1032 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1033 | <code>        const preRunSafetyGate = evaluateSafetyGate(policy, state);</code> | 声明局部标识符 `preRunSafetyGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1034 | <code>        if (!args.dryRun &amp;&amp; preRunSafetyGate.block) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1035 | <code>            await blockForSafetyGate(jobDir, state, preRunSafetyGate, { iteration: state.iteration &#124;&#124; 0, policy });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1036 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1037 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1038 | <code>        const task = selectNextTask({ state, policy, args });</code> | 声明局部标识符 `task`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1039 | <code>        if (!task) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1040 | <code>            state.status = 'completed';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1041 | <code>            await saveState(jobDir, state);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1042 | <code>            await updateProgress(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1043 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1044 | <code>                currentAction: 'all configured tasks completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1045 | <code>                nextAction: 'review report or enable official source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1046 | <code>                risk: 'none'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1047 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>            await appendEvent(jobDir, { type: 'JOB_COMPLETED', iteration: state.iteration &#124;&#124; 0, summary: 'all configured tasks completed' });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1049 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1050 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1051 | <code>        if (task.source === 'blocked') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1052 | <code>            state.status = 'blocked';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1053 | <code>            state.repairRequired = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1054 | <code>            await saveState(jobDir, state);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1055 | <code>            await updateProgress(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1056 | <code>                status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1057 | <code>                currentAction: task.title,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1058 | <code>                latestEvidence: task.error,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1059 | <code>                nextAction: 'configure local GAIA dataset path or run practice source only',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1060 | <code>                risk: 'environment'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1061 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1062 | <code>            await appendEvent(jobDir, { type: 'JOB_BLOCKED', iteration: state.iteration &#124;&#124; 0, summary: task.error, failureCategory: task.failureCategory });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1063 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1064 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1065 | <code>        const iteration = Math.max(0, Number(state.iteration) &#124;&#124; 0) + 1;</code> | 声明局部标识符 `iteration`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1066 | <code>        const iterName = `iter-${String(iteration).padStart(3, '0')}-${safeSegment(task.taskId)}`;</code> | 声明局部标识符 `iterName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1067 | <code>        const iterationDir = path.join(jobDir, 'iterations', iterName);</code> | 声明局部标识符 `iterationDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1068 | <code>        const runId = `${iterName}-${new Date().toISOString().replace(/[:.]/g, '-')}`;</code> | 声明局部标识符 `runId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1069 | <code>        await fs.mkdir(iterationDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1070 | <code>        await writeJson(path.join(iterationDir, 'task.json'), task);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1071 | <code>        await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1072 | <code>            type: 'ITERATION_STARTED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1073 | <code>            iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1074 | <code>            summary: `selected ${task.source} task ${task.taskId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1075 | <code>            artifactPaths: [path.join(iterationDir, 'task.json')]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1076 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1077 | <code>        await updateProgress(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1078 | <code>            status: args.dryRun ? 'dry_run' : 'executing_iteration',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1079 | <code>            iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1080 | <code>            currentAction: `running ${task.source} task ${task.taskId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1081 | <code>            activeAgentRuns: args.dryRun ? 0 : 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1082 | <code>            latestArtifactPath: path.join(iterationDir, 'task.json'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1083 | <code>            latestEvidence: task.title &#124;&#124; task.taskId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1084 | <code>            nextAction: 'extract execution chain and classify verdict',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1085 | <code>            risk: 'none'</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1086 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>        const { verdict, paths } = await executeTask({ task, iterationDir, runId, policy, args });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1088 | <code>        await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1089 | <code>            type: 'VERDICT_CREATED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1090 | <code>            iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1091 | <code>            summary: verdict.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1092 | <code>            artifactPaths: [paths.chainPath, paths.verdictPath].filter(Boolean),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1093 | <code>            failureCategory: verdict.failureCategory &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1094 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1095 | <code>        state.iteration = iteration;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1096 | <code>        state.lastVerdictPath = paths.verdictPath;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1097 | <code>        state.status = verdict.ok ? 'running' : (args.dryRun ? 'dry_run' : 'repair_required');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1098 | <code>        state.completedTaskIds = Array.isArray(state.completedTaskIds) ? state.completedTaskIds : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1099 | <code>        state.failedTaskIds = Array.isArray(state.failedTaskIds) ? state.failedTaskIds : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1100 | <code>        state.repairBacklog = Array.isArray(state.repairBacklog) ? state.repairBacklog : [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1101 | <code>        recordSafetyOutcome(state, { task, verdict, policy });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1102 | <code>        const postVerdictSafetyGate = !verdict.ok &amp;&amp; !args.dryRun</code> | 声明局部标识符 `postVerdictSafetyGate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1103 | <code>            ? evaluateSafetyGate(policy, state, { verdict, task })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1104 | <code>            : { block: false, reason: 'ok' };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1105 | <code>        const canContinueAfterVerdict = !verdict.ok &amp;&amp; !postVerdictSafetyGate.block &amp;&amp; shouldContinueAfterVerdict(policy, verdict);</code> | 声明局部标识符 `canContinueAfterVerdict`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1106 | <code>        if (verdict.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1107 | <code>            if (!state.completedTaskIds.includes(task.taskId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1108 | <code>                state.completedTaskIds.push(task.taskId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1109 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1110 | <code>            state.failedTaskIds = state.failedTaskIds.filter((taskId) =&gt; taskId !== task.taskId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1111 | <code>            state.repairBacklog = state.repairBacklog.filter((item) =&gt; item.taskId !== task.taskId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1112 | <code>            if (task.source === 'practice') state.practiceCursor = Math.max(Number(state.practiceCursor) &#124;&#124; 0, buildPracticeTasks().findIndex((item) =&gt; item.taskId === task.taskId) + 1);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1113 | <code>            if (task.source === 'official') state.officialCursor = Math.max(Number(state.officialCursor) &#124;&#124; 0, Number(task.offset) + 1);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1114 | <code>            state.repairRequired = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1115 | <code>        } else if (!args.dryRun) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1116 | <code>            if (!state.failedTaskIds.includes(task.taskId)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1117 | <code>                state.failedTaskIds.push(task.taskId);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1118 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>            state.repairBacklog = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1120 | <code>                ...state.repairBacklog.filter((item) =&gt; item.taskId !== task.taskId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1121 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1122 | <code>                    taskId: task.taskId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1123 | <code>                    source: task.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1124 | <code>                    offset: task.offset,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1125 | <code>                    verdictPath: paths.verdictPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1126 | <code>                    failureCategory: verdict.failureCategory &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1127 | <code>                    optimizationFocus: verdict.optimizationFocus &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1128 | <code>                    summary: verdict.summary,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1129 | <code>                    queuedAt: isoNow()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1130 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1131 | <code>            ].slice(-200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1132 | <code>            if (canContinueAfterVerdict) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1133 | <code>                if (task.source === 'practice') state.practiceCursor = Math.max(Number(state.practiceCursor) &#124;&#124; 0, buildPracticeTasks().findIndex((item) =&gt; item.taskId === task.taskId) + 1);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1134 | <code>                if (task.source === 'official') state.officialCursor = Math.max(Number(state.officialCursor) &#124;&#124; 0, Number(task.offset) + 1);</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1135 | <code>                state.status = 'running_with_repair_backlog';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1136 | <code>                state.repairRequired = false;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1137 | <code>                await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1138 | <code>                    type: 'REPAIR_QUEUED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1139 | <code>                    iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1140 | <code>                    summary: `queued repair for ${task.taskId} and continuing to the next task`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1141 | <code>                    artifactPaths: [paths.verdictPath].filter(Boolean),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1142 | <code>                    failureCategory: verdict.failureCategory &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1143 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1144 | <code>            } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1145 | <code>                state.repairRequired = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1146 | <code>                if (postVerdictSafetyGate.block) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1147 | <code>                    state.safety.lastSafetyBlock = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1148 | <code>                        at: isoNow(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1149 | <code>                        reason: postVerdictSafetyGate.reason,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1150 | <code>                        summary: postVerdictSafetyGate.summary</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1151 | <code>                    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1152 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1153 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1154 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>        await saveState(jobDir, state);</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1156 | <code>        await updateProgress(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1157 | <code>            status: state.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1158 | <code>            iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1159 | <code>            currentAction: args.dryRun</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1160 | <code>                ? 'dry run planned'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1161 | <code>                : (verdict.ok</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1162 | <code>                    ? 'iteration accepted'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1163 | <code>                    : (postVerdictSafetyGate.block ? `safety gate blocked: ${postVerdictSafetyGate.reason}` : (canContinueAfterVerdict ? 'repair ticket queued; continuing' : 'repair ticket created'))),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1164 | <code>            activeAgentRuns: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1165 | <code>            completedSteps: state.completedTaskIds.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1166 | <code>            failedSteps: state.failedTaskIds.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1167 | <code>            latestArtifactPath: paths.verdictPath,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1168 | <code>            latestEvidence: postVerdictSafetyGate.block ? postVerdictSafetyGate.summary : verdict.summary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1169 | <code>            nextAction: verdict.ok</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1170 | <code>                ? verdict.nextAction</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1171 | <code>                : (postVerdictSafetyGate.block ? postVerdictSafetyGate.nextAction : (canContinueAfterVerdict ? 'continue with next task while repair backlog remains open' : verdict.nextAction)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1172 | <code>            risk: verdict.ok</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1173 | <code>                ? 'none'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1174 | <code>                : (postVerdictSafetyGate.block</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1175 | <code>                    ? (postVerdictSafetyGate.failureCategory === 'environment' ? 'environment' : `spend_safety:${postVerdictSafetyGate.reason}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1176 | <code>                    : (canContinueAfterVerdict ? `repair_backlog:${verdict.failureCategory &#124;&#124; 'unknown'}` : (verdict.failureCategory &#124;&#124; 'none')))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1177 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1178 | <code>        if (!verdict.ok &amp;&amp; !args.dryRun &amp;&amp; !canContinueAfterVerdict) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1179 | <code>            await appendEvent(jobDir, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1180 | <code>                type: 'JOB_BLOCKED',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1181 | <code>                iteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1182 | <code>                summary: postVerdictSafetyGate.block ? postVerdictSafetyGate.summary : verdict.nextAction,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1183 | <code>                artifactPaths: [paths.verdictPath].filter(Boolean),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1184 | <code>                failureCategory: postVerdictSafetyGate.block ? (postVerdictSafetyGate.failureCategory &#124;&#124; 'spend_safety') : (verdict.failureCategory &#124;&#124; 'blocked')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1185 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1186 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1187 | <code>        if (!verdict.ok &amp;&amp; !args.dryRun &amp;&amp; (policy.stopWhen &#124;&#124; []).includes('repair_required') &amp;&amp; !canContinueAfterVerdict) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1188 | <code>            break;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1189 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1190 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1191 | <code>    return await readJson(path.join(jobDir, 'progress.json'), {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1192 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1193 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1194 | <code>const isDirectRun = (() =&gt; {</code> | 声明局部标识符 `isDirectRun`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1195 | <code>    const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';</code> | 声明局部标识符 `entryPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1196 | <code>    return Boolean(entryPath &amp;&amp; path.resolve(fileURLToPath(import.meta.url)) === entryPath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1197 | <code>})();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1198 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1199 | <code>if (isDirectRun) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1200 | <code>    runController().then((progress) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1201 | <code>        console.log(JSON.stringify(progress, null, 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1202 | <code>    }).catch((error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1203 | <code>        console.error(error?.stack &#124;&#124; error?.message &#124;&#124; String(error));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1204 | <code>        process.exitCode = 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1205 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1206 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1208 | <code>export {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1209 | <code>    buildPracticeTasks,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1210 | <code>    classifyGaiaResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1211 | <code>    discoverOfficialDatasetDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1212 | <code>    enrichTaskFromGaiaResult,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1213 | <code>    ensureSafetyState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1214 | <code>    evaluateSafetyGate,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1215 | <code>    extractExecutionChain,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1216 | <code>    isEmptyAnswerVerdict,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1217 | <code>    normalizeAnswer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1218 | <code>    parseArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1219 | <code>    recordSafetyOutcome,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1220 | <code>    resolveSafetyPolicy,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1221 | <code>    resolveTaskRetries,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1222 | <code>    runController,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1223 | <code>    shouldContinueAfterFailure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1224 | <code>    shouldContinueAfterVerdict,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1225 | <code>    selectNextTask</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“工程脚本：准备运行时、验证、评测、打包、部署或诊断 AILIS。”这一文件职责。 |
| 1226 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
