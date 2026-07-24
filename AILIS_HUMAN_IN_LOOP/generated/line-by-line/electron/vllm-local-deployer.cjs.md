# electron/vllm-local-deployer.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。
- 文件类型：`source-code`
- 原始行数：1858
- SHA-256：`fe6bc043c7ff9ded82c146c2eddc86af9c6b9f8adb1c82ae13c98516d287fd6f`
- 可运行副本：[打开源文件](../../../source/electron/vllm-local-deployer.cjs)
- 依赖：`events`、`child_process`、`fs`、`path`、`json`、`os`、`shutil`、`subprocess`、`sys`
- 主要符号：`fs`、`path`、`DEFAULT_HOST`、`DEFAULT_PORT`、`DEFAULT_READY_TIMEOUT_SEC`、`MAX_LOG_LINES`、`MAX_LINE_LENGTH`、`MIN_RECOMMENDED_DISK_KB`、`DEFAULT_PROJECT_VENV_DIR`、`DEFAULT_PIP_INDEX_URL`、`LEGACY_VLLM_TRANSFORMERS_VERSION`、`BYTES_PER_GIB`、`DEFAULT_UNKNOWN_MODEL_DOWNLOAD_BYTES`、`formatGiB`、`value`、`parseParameterCountFromModelId`、`text`、`matches`、`match`、`estimateRequiredDownloadBytes`、`explicitSize`、`parameterCount`、`estimatedWeightBytes`、`modelBytes`、`normalizeModelId`、`normalizeModelReference`、`normalizeSource`、`normalized`、`looksLikeLocalModelPath`、`inferVllmSource`、`normalizePort`、`numeric`、`normalizeReadyTimeoutSec`、`normalizeVllmPackage`、`getDefaultVenvDir`、`normalizeVenvDir`、`normalizeRuntimeMode`、`parseVersionTuple`、`parts`、`compareVersions`、`left`、`right`、`index`、`readLocalModelRequirements`、`modelDir`、`configPath`、`config`、`transformersVersion`、`weightStats`、`estimateLocalModelWeightSize`、`result`、`entries`、`stats`、`parseGpuMemoryMiB`、`values`、`getLargestGpuMemoryBytes`、`getNearestExistingPath`、`current`、`parent`、`getDiskFreeBytes`、`existingPath`、`inspectDownloadTarget`、`rawPath`、`requiredBytes`、`resolved`、`stat`、`parseNvidiaDriverVersion`、`evaluateRuntimeUpgradeFeasibility`、`driverVersion`、`driverMajor`、`evaluateLocalModelHardwareFit`、`weightBytes`、`largestGpuBytes`、`buildAutoLaunchProfile`、`requestedMaxModelLen`、`requestedGpuMemoryUtilization`、`requestedCpuOffloadGb`、`requestedSwapSpace`、`profile`、`targetGpuBytes`、`deficitGiB`、`findRuntimeCandidate`、`candidates`、`target`、`evaluateRuntimeModelCompatibility`、`selectedVenvDir`、`candidate`、`uniqueStrings`、`seen`、`key`、`getReusableVenvCandidates`、`mode`、`getBaseUrl`、`clientHost`、`stripAnsi`、`normalizeDiagnosticText`、`splitOutputLines`、`clipLine`、`execFileText`、`child`、`stdout`、`stderr`、`timer`、`execFileSafe`、`parseJsonSafe`、`start`、`end`、`classifyRuntimeShellFailure`、`lower`、`normalizePathForWslpath`、`isVllmServiceReady`、`baseUrl`、`controller`、`response`、`payload`、`buildRuntimeProbeScript`、`root`、`venv`、`pythonVenvLiteral`、`candidateVenvLiteral`、`resolve_venv_dir`、`probe_venv`、`buildNativeRuntimeProbeScript`、`projectRootLiteral`、`primaryVenvLiteral`、`probeNativeRuntime`、`script`、`errors`、`buildInstallPlan`、`steps`、`runtimeMode`、`windowsNativeMode`、`managedWindowsMode`、`installWslRequested`、`runtimeAvailable`、`runtimeShellFailure`、`targetModel`、`localModel`、`downloadTarget`、`serviceModelIds`、`serviceHasTargetModel`、`modelRuntimeCompatible`、`hasUsableVllmRuntime`、`diskAvailableKb`、`summarizeFailure`、`readTextFileTailLines`、`length`、`fd`、`buffer`、`readDetachedVllmLogLines`、`logDir`、`files`、`lines`、`tail`、`buildDeployCommand`、`modelId`、`normalizedSource`、`normalizedRuntimeMode`、`normalizedServedModelName`、`normalizedPort`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const { EventEmitter } = require('events');</code> | 导入依赖 `events`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 2 | <code>const { spawn } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 3 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 4 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 5 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 6 | <code>const DEFAULT_HOST = '127.0.0.1';</code> | 声明局部标识符 `DEFAULT_HOST`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 7 | <code>const DEFAULT_PORT = 8000;</code> | 声明局部标识符 `DEFAULT_PORT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 8 | <code>const DEFAULT_READY_TIMEOUT_SEC = 900;</code> | 声明局部标识符 `DEFAULT_READY_TIMEOUT_SEC`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 9 | <code>const MAX_LOG_LINES = 160;</code> | 声明局部标识符 `MAX_LOG_LINES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 10 | <code>const MAX_LINE_LENGTH = 4000;</code> | 声明局部标识符 `MAX_LINE_LENGTH`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 11 | <code>const MIN_RECOMMENDED_DISK_KB = 12 * 1024 * 1024;</code> | 声明局部标识符 `MIN_RECOMMENDED_DISK_KB`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 12 | <code>const DEFAULT_PROJECT_VENV_DIR = '.ailis-runtime/vllm-venv';</code> | 声明局部标识符 `DEFAULT_PROJECT_VENV_DIR`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 13 | <code>const DEFAULT_PIP_INDEX_URL = 'https://pypi.tuna.tsinghua.edu.cn/simple';</code> | 声明局部标识符 `DEFAULT_PIP_INDEX_URL`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 14 | <code>const LEGACY_VLLM_TRANSFORMERS_VERSION = '4.44.2';</code> | 声明局部标识符 `LEGACY_VLLM_TRANSFORMERS_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 15 | <code>const BYTES_PER_GIB = 1024 ** 3;</code> | 声明局部标识符 `BYTES_PER_GIB`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 16 | <code>const DEFAULT_UNKNOWN_MODEL_DOWNLOAD_BYTES = 20 * BYTES_PER_GIB;</code> | 声明局部标识符 `DEFAULT_UNKNOWN_MODEL_DOWNLOAD_BYTES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>function formatGiB(bytes = 0) {</code> | 定义函数 `formatGiB`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 19 | <code>    const value = Number(bytes) &#124;&#124; 0;</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 20 | <code>    return `${(value / BYTES_PER_GIB).toFixed(1)}GB`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 21 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 22 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 23 | <code>function parseParameterCountFromModelId(modelId = '') {</code> | 定义函数 `parseParameterCountFromModelId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 24 | <code>    const text = String(modelId &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 25 | <code>    const matches = Array.from(text.matchAll(/(^&#124;[^A-Za-z0-9])([0-9]+(?:\.[0-9]+)?)\s*([bm])([^A-Za-z0-9]&#124;$)/gi));</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 26 | <code>    if (!matches.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 27 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 28 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 29 | <code>    const match = matches[matches.length - 1];</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 30 | <code>    const value = Number(match[2]);</code> | 声明局部标识符 `value`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 31 | <code>    if (!Number.isFinite(value) &#124;&#124; value &lt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 32 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    return match[3].toLowerCase() === 'b'</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 35 | <code>        ? value * 1_000_000_000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 36 | <code>        : value * 1_000_000;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 37 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 38 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 39 | <code>function estimateRequiredDownloadBytes({ modelId = '', sizeBytes = 0 } = {}) {</code> | 定义函数 `estimateRequiredDownloadBytes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 40 | <code>    const explicitSize = Math.max(0, Number(sizeBytes) &#124;&#124; 0);</code> | 声明局部标识符 `explicitSize`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 41 | <code>    const parameterCount = parseParameterCountFromModelId(modelId);</code> | 声明局部标识符 `parameterCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 42 | <code>    const estimatedWeightBytes = parameterCount &gt; 0</code> | 声明局部标识符 `estimatedWeightBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 43 | <code>        ? parameterCount * 2.2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 44 | <code>        : DEFAULT_UNKNOWN_MODEL_DOWNLOAD_BYTES;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 45 | <code>    const modelBytes = Math.max(explicitSize, estimatedWeightBytes);</code> | 声明局部标识符 `modelBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 46 | <code>    return Math.ceil(modelBytes * 1.25 + 4 * BYTES_PER_GIB);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>function normalizeModelId(value = '') {</code> | 定义函数 `normalizeModelId`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 50 | <code>    return String(value &#124;&#124; '').trim().slice(0, 240);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 51 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>function normalizeModelReference(value = '') {</code> | 定义函数 `normalizeModelReference`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 54 | <code>    return String(value &#124;&#124; '').trim().slice(0, 1000);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 55 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 56 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 57 | <code>function normalizeSource(value = 'modelscope') {</code> | 定义函数 `normalizeSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 58 | <code>    const normalized = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 59 | <code>    if (normalized === 'local' &#124;&#124; normalized === 'path' &#124;&#124; normalized === 'folder') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 60 | <code>        return 'local';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 61 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 62 | <code>    if (normalized === 'hf' &#124;&#124; normalized === 'huggingface' &#124;&#124; normalized === 'hugging-face') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 63 | <code>        return 'hf';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>    if (normalized === 'ms' &#124;&#124; normalized === 'modelscope' &#124;&#124; normalized === 'model-scope') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 66 | <code>        return 'modelscope';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 68 | <code>    return 'modelscope';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 69 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>function looksLikeLocalModelPath(value = '') {</code> | 定义函数 `looksLikeLocalModelPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 72 | <code>    const text = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 73 | <code>    if (!text) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 74 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 75 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>    return /^[A-Za-z]:[\\/]/.test(text) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 77 | <code>        /^\\\\/.test(text) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 78 | <code>        text.startsWith('/') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 79 | <code>        text.startsWith('~/') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 80 | <code>        text.startsWith('./') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 81 | <code>        text.startsWith('../') &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 82 | <code>        fs.existsSync(text);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 83 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>function inferVllmSource(source = 'modelscope', model = '') {</code> | 定义函数 `inferVllmSource`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 86 | <code>    const normalized = normalizeSource(source);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 87 | <code>    if (normalized !== 'local' &amp;&amp; looksLikeLocalModelPath(model)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 88 | <code>        return 'local';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 89 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 90 | <code>    return normalized;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 91 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 93 | <code>function normalizePort(value = DEFAULT_PORT) {</code> | 定义函数 `normalizePort`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 94 | <code>    const numeric = Number(value);</code> | 声明局部标识符 `numeric`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 95 | <code>    if (!Number.isFinite(numeric)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 96 | <code>        return DEFAULT_PORT;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 97 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>    return Math.max(1, Math.min(65535, Math.floor(numeric)));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 99 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 100 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 101 | <code>function normalizeReadyTimeoutSec(value = DEFAULT_READY_TIMEOUT_SEC) {</code> | 定义函数 `normalizeReadyTimeoutSec`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 102 | <code>    const numeric = Number(value);</code> | 声明局部标识符 `numeric`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 103 | <code>    if (!Number.isFinite(numeric)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 104 | <code>        return DEFAULT_READY_TIMEOUT_SEC;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 105 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 106 | <code>    return Math.max(60, Math.min(7200, Math.floor(numeric)));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 107 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 109 | <code>function normalizeVllmPackage(value = 'auto') {</code> | 定义函数 `normalizeVllmPackage`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 110 | <code>    const normalized = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 111 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 112 | <code>        return 'auto';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 113 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 114 | <code>    return normalized.slice(0, 160);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 115 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 117 | <code>function getDefaultVenvDir(platform = process.platform) {</code> | 定义函数 `getDefaultVenvDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 118 | <code>    return DEFAULT_PROJECT_VENV_DIR;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 119 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 121 | <code>function normalizeVenvDir(value = '', platform = process.platform) {</code> | 定义函数 `normalizeVenvDir`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 122 | <code>    const normalized = String(value &#124;&#124; '').trim();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 123 | <code>    return (normalized &#124;&#124; getDefaultVenvDir(platform)).slice(0, 260);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 124 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 125 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 126 | <code>function normalizeRuntimeMode(value = '', platform = process.platform) {</code> | 定义函数 `normalizeRuntimeMode`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 127 | <code>    const normalized = String(value &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 128 | <code>    if (normalized === 'auto' &#124;&#124; normalized === 'managed' &#124;&#124; normalized === 'ailis-managed' &#124;&#124; normalized === 'automatic') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 129 | <code>        return platform === 'win32' ? 'wsl' : 'native';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 130 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 131 | <code>    if (normalized === 'wsl' &#124;&#124; normalized === 'linux-wsl' &#124;&#124; normalized === 'compat' &#124;&#124; normalized === 'compatibility') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 132 | <code>        return 'wsl';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 133 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>    if (normalized === 'native' &#124;&#124; normalized === 'host' &#124;&#124; normalized === 'windows' &#124;&#124; normalized === 'local') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 135 | <code>        return 'native';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 136 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>    return platform === 'win32' ? 'native' : 'native';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 138 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>function parseVersionTuple(value = '') {</code> | 定义函数 `parseVersionTuple`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 141 | <code>    const parts = String(value &#124;&#124; '')</code> | 声明局部标识符 `parts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 142 | <code>        .match(/\d+/g)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 143 | <code>        ?.slice(0, 3)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 144 | <code>        .map((part) =&gt; Number(part)) &#124;&#124; [];</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 145 | <code>    while (parts.length &lt; 3) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 146 | <code>        parts.push(0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 147 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>    return parts;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 149 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>function compareVersions(a = '', b = '') {</code> | 定义函数 `compareVersions`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 152 | <code>    const left = parseVersionTuple(a);</code> | 声明局部标识符 `left`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 153 | <code>    const right = parseVersionTuple(b);</code> | 声明局部标识符 `right`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 154 | <code>    for (let index = 0; index &lt; 3; index += 1) {</code> | 声明局部标识符 `index`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 155 | <code>        if (left[index] &gt; right[index]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 156 | <code>            return 1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 158 | <code>        if (left[index] &lt; right[index]) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 159 | <code>            return -1;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>    return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 163 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 165 | <code>function readLocalModelRequirements(modelPath = '') {</code> | 定义函数 `readLocalModelRequirements`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 166 | <code>    const modelDir = String(modelPath &#124;&#124; '').trim();</code> | 声明局部标识符 `modelDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 167 | <code>    if (!modelDir) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 168 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 169 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 170 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 171 | <code>        const configPath = path.join(modelDir, 'config.json');</code> | 声明局部标识符 `configPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 172 | <code>        if (!fs.existsSync(configPath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 173 | <code>            return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));</code> | 声明局部标识符 `config`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 176 | <code>        const transformersVersion = String(config.transformers_version &#124;&#124; '').trim();</code> | 声明局部标识符 `transformersVersion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 177 | <code>        const weightStats = estimateLocalModelWeightSize(modelDir);</code> | 声明局部标识符 `weightStats`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 178 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>            modelType: String(config.model_type &#124;&#124; '').trim(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 180 | <code>            architectures: Array.isArray(config.architectures) ? config.architectures.filter(Boolean) : [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 181 | <code>            transformersVersion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 182 | <code>            weightBytes: weightStats.bytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 183 | <code>            weightFileCount: weightStats.fileCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 184 | <code>            legacyTransformersVersion: LEGACY_VLLM_TRANSFORMERS_VERSION,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 185 | <code>            requiresModernTransformers: Boolean(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 186 | <code>                transformersVersion &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 187 | <code>                compareVersions(transformersVersion, LEGACY_VLLM_TRANSFORMERS_VERSION) &gt; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 188 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 191 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 192 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>function estimateLocalModelWeightSize(modelDir = '') {</code> | 定义函数 `estimateLocalModelWeightSize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 196 | <code>    const result = { bytes: 0, fileCount: 0 };</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 197 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 198 | <code>        const entries = fs.readdirSync(modelDir, { withFileTypes: true });</code> | 声明局部标识符 `entries`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 199 | <code>        for (const entry of entries) {</code> | 声明局部标识符 `entry`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 200 | <code>            if (!entry.isFile()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 201 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 202 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>            if (!/\.(safetensors&#124;bin&#124;gguf&#124;pth&#124;pt)$/i.test(entry.name)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 204 | <code>                continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 205 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>            const stats = fs.statSync(path.join(modelDir, entry.name));</code> | 声明局部标识符 `stats`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 207 | <code>            result.bytes += Number(stats.size) &#124;&#124; 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 208 | <code>            result.fileCount += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 209 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 210 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 211 | <code>        // Best-effort sizing only; deployment can still continue without it.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 212 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 214 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 215 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 216 | <code>function parseGpuMemoryMiB(gpuInfo = '') {</code> | 定义函数 `parseGpuMemoryMiB`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 217 | <code>    const values = [];</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 218 | <code>    const text = String(gpuInfo &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 219 | <code>    for (const segment of text.split(/[;\n]+/)) {</code> | 声明局部标识符 `segment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 220 | <code>        const match = segment.match(/,\s*([0-9]+(?:\.[0-9]+)?)\s*MiB\s*,/i);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 221 | <code>        if (match) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 222 | <code>            values.push(Number(match[1]));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 223 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>    return values.filter((value) =&gt; Number.isFinite(value) &amp;&amp; value &gt; 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 226 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 228 | <code>function getLargestGpuMemoryBytes(gpuInfo = '') {</code> | 定义函数 `getLargestGpuMemoryBytes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 229 | <code>    const values = parseGpuMemoryMiB(gpuInfo);</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 230 | <code>    return values.length ? Math.max(...values) * 1024 * 1024 : 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 233 | <code>function getNearestExistingPath(targetPath = '') {</code> | 定义函数 `getNearestExistingPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 234 | <code>    let current = path.resolve(String(targetPath &#124;&#124; '.'));</code> | 声明局部标识符 `current`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 235 | <code>    while (current &amp;&amp; !fs.existsSync(current)) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 236 | <code>        const parent = path.dirname(current);</code> | 声明局部标识符 `parent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 237 | <code>        if (!parent &#124;&#124; parent === current) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 238 | <code>            return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 239 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 240 | <code>        current = parent;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 241 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 242 | <code>    return current;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 243 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 244 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 245 | <code>function getDiskFreeBytes(targetPath = '') {</code> | 定义函数 `getDiskFreeBytes`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 246 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 247 | <code>        const existingPath = getNearestExistingPath(targetPath);</code> | 声明局部标识符 `existingPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 248 | <code>        if (!existingPath &#124;&#124; typeof fs.statfsSync !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 249 | <code>            return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 250 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>        const stats = fs.statfsSync(existingPath);</code> | 声明局部标识符 `stats`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 252 | <code>        return Number(stats.bavail &#124;&#124; 0) * Number(stats.bsize &#124;&#124; 0);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 253 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 254 | <code>        return 0;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 255 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 256 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>function inspectDownloadTarget({ downloadDir = '', modelId = '', modelSizeBytes = 0 } = {}) {</code> | 定义函数 `inspectDownloadTarget`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 259 | <code>    const rawPath = String(downloadDir &#124;&#124; '').trim();</code> | 声明局部标识符 `rawPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 260 | <code>    const requiredBytes = estimateRequiredDownloadBytes({ modelId, sizeBytes: modelSizeBytes });</code> | 声明局部标识符 `requiredBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 261 | <code>    const result = {</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 262 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 263 | <code>        path: rawPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 264 | <code>        exists: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 265 | <code>        parentExists: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 266 | <code>        freeBytes: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 267 | <code>        requiredBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 268 | <code>        requiredGiB: Number((requiredBytes / BYTES_PER_GIB).toFixed(1)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 269 | <code>        freeGiB: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 270 | <code>        blockers: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 271 | <code>        warnings: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 272 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 273 | <code>    if (!rawPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 274 | <code>        result.blockers.push('请选择模型安装路径。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 275 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 276 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 277 | <code>    const resolved = path.resolve(rawPath);</code> | 声明局部标识符 `resolved`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 278 | <code>    result.path = resolved;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 279 | <code>    let stat = null;</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 280 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 281 | <code>        stat = fs.existsSync(resolved) ? fs.statSync(resolved) : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 282 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 283 | <code>        stat = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 284 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 285 | <code>    if (stat &amp;&amp; !stat.isDirectory()) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 286 | <code>        result.blockers.push('安装路径必须是文件夹，不能是文件。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 287 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 288 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 289 | <code>    result.exists = Boolean(stat?.isDirectory());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 290 | <code>    const parent = result.exists ? resolved : path.dirname(resolved);</code> | 声明局部标识符 `parent`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 291 | <code>    result.parentExists = fs.existsSync(parent);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 292 | <code>    if (!result.parentExists) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 293 | <code>        result.blockers.push('安装路径的上级目录不存在，请换一个有效目录。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 294 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 295 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 296 | <code>    result.freeBytes = getDiskFreeBytes(resolved);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 297 | <code>    result.freeGiB = Number((result.freeBytes / BYTES_PER_GIB).toFixed(1));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 298 | <code>    if (result.freeBytes &gt; 0 &amp;&amp; result.freeBytes &lt; requiredBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 299 | <code>        result.blockers.push(`安装路径可用空间约 ${formatGiB(result.freeBytes)}，预计至少需要 ${formatGiB(requiredBytes)}。请换更小模型或更大磁盘。`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 300 | <code>        return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 301 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 302 | <code>    if (!result.exists) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 303 | <code>        result.warnings.push('安装目录不存在，部署时会尝试创建。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 304 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    if (!result.freeBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 306 | <code>        result.warnings.push('无法确认安装路径剩余空间，部署前请手动确认磁盘空间。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 307 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>    result.ok = result.blockers.length === 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 309 | <code>    return result;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 310 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 311 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 312 | <code>function parseNvidiaDriverVersion(gpuInfo = '') {</code> | 定义函数 `parseNvidiaDriverVersion`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 313 | <code>    const text = String(gpuInfo &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 314 | <code>    const match = text.match(/,\s*([0-9]{3,}(?:\.[0-9]+)?)\s*(?:;&#124;$)/);</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 315 | <code>    return match ? match[1] : '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 316 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 317 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 318 | <code>function evaluateRuntimeUpgradeFeasibility(runtime = {}, modelRequirements = null) {</code> | 定义函数 `evaluateRuntimeUpgradeFeasibility`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 319 | <code>    if (!modelRequirements?.requiresModernTransformers) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 320 | <code>        return { ok: true, severity: '', reason: '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 321 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>    const driverVersion = parseNvidiaDriverVersion(runtime?.gpuInfo &#124;&#124; '');</code> | 声明局部标识符 `driverVersion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 323 | <code>    const driverMajor = Number.parseInt(driverVersion, 10);</code> | 声明局部标识符 `driverMajor`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 324 | <code>    if (Number.isFinite(driverMajor) &amp;&amp; driverMajor &gt; 0 &amp;&amp; driverMajor &lt; 550) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 325 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 326 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 327 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 328 | <code>            reason: `当前 NVIDIA 驱动 ${driverVersion} 偏旧，AILIS 会优先在隔离 runtime 中升级 vLLM/Transformers 并验证当前模型；如果底层 CUDA/PyTorch 不兼容，再保留旧环境并给出失败原因。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 329 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 331 | <code>    return { ok: true, severity: '', reason: '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 332 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 334 | <code>function evaluateLocalModelHardwareFit(runtime = {}, modelRequirements = null) {</code> | 定义函数 `evaluateLocalModelHardwareFit`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 335 | <code>    const weightBytes = Number(modelRequirements?.weightBytes) &#124;&#124; 0;</code> | 声明局部标识符 `weightBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 336 | <code>    const largestGpuBytes = getLargestGpuMemoryBytes(runtime?.gpuInfo &#124;&#124; '');</code> | 声明局部标识符 `largestGpuBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 337 | <code>    if (!weightBytes &#124;&#124; !largestGpuBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 338 | <code>        return { ok: true, severity: '', reason: '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 339 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 340 | <code>    if (weightBytes &gt; largestGpuBytes) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 341 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 342 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 343 | <code>            severity: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 344 | <code>            reason: `本地模型权重约 ${formatGiB(weightBytes)}，大于当前最大 GPU 显存约 ${formatGiB(largestGpuBytes)}。纯 GPU 加载不稳，AILIS 会自动降低上下文并尝试 CPU offload；速度会变慢。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 345 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 346 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    if (weightBytes &gt; largestGpuBytes * 0.85) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 348 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 349 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 350 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 351 | <code>            reason: `本地模型权重约 ${formatGiB(weightBytes)}，接近当前最大 GPU 显存约 ${formatGiB(largestGpuBytes)}。vLLM 还需要 KV cache 和运行时开销，建议降低上下文长度或使用量化模型。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 352 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 353 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    return { ok: true, severity: '', reason: '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 355 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 356 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 357 | <code>function buildAutoLaunchProfile(diagnosis = {}, payload = {}) {</code> | 定义函数 `buildAutoLaunchProfile`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 358 | <code>    const requestedMaxModelLen = Math.max(0, Math.floor(Number(payload.maxModelLen) &#124;&#124; 0));</code> | 声明局部标识符 `requestedMaxModelLen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 359 | <code>    const requestedGpuMemoryUtilization = String(payload.gpuMemoryUtilization &#124;&#124; '').trim();</code> | 声明局部标识符 `requestedGpuMemoryUtilization`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 360 | <code>    const requestedCpuOffloadGb = Math.max(0, Number(payload.cpuOffloadGb &#124;&#124; payload.cpuOffloadGB &#124;&#124; 0) &#124;&#124; 0);</code> | 声明局部标识符 `requestedCpuOffloadGb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 361 | <code>    const requestedSwapSpace = Math.max(0, Math.floor(Number(payload.swapSpace &#124;&#124; payload.swapSpaceGb &#124;&#124; 0) &#124;&#124; 0));</code> | 声明局部标识符 `requestedSwapSpace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 362 | <code>    const profile = {</code> | 声明局部标识符 `profile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 363 | <code>        adjusted: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 364 | <code>        reason: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 365 | <code>        maxModelLen: requestedMaxModelLen,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 366 | <code>        gpuMemoryUtilization: requestedGpuMemoryUtilization,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 367 | <code>        cpuOffloadGb: requestedCpuOffloadGb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 368 | <code>        swapSpace: requestedSwapSpace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 369 | <code>        notes: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 370 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 371 | <code>    const weightBytes = Number(diagnosis.modelRequirements?.weightBytes) &#124;&#124; 0;</code> | 声明局部标识符 `weightBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 372 | <code>    const largestGpuBytes = getLargestGpuMemoryBytes(diagnosis.runtime?.gpuInfo &#124;&#124; '');</code> | 声明局部标识符 `largestGpuBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 373 | <code>    if (!weightBytes &#124;&#124; !largestGpuBytes &#124;&#124; diagnosis.source !== 'local') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 374 | <code>        return profile;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 375 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 376 | <code>    if (diagnosis.modelHardwareFit?.severity === 'high') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 377 | <code>        const targetGpuBytes = largestGpuBytes * 0.82;</code> | 声明局部标识符 `targetGpuBytes`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 378 | <code>        const deficitGiB = Math.max(1, Math.ceil((weightBytes - targetGpuBytes) / BYTES_PER_GIB + 1));</code> | 声明局部标识符 `deficitGiB`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 379 | <code>        if (!profile.maxModelLen) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 380 | <code>            profile.maxModelLen = 2048;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 381 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 382 | <code>        if (!profile.gpuMemoryUtilization) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 383 | <code>            profile.gpuMemoryUtilization = '0.82';</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 384 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>        if (!profile.cpuOffloadGb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 386 | <code>            profile.cpuOffloadGb = Math.min(16, deficitGiB);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 387 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 388 | <code>        if (!profile.swapSpace) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 389 | <code>            profile.swapSpace = Math.max(4, Math.ceil(profile.cpuOffloadGb + 2));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 390 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>        profile.adjusted = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 392 | <code>        profile.reason = `模型权重 ${formatGiB(weightBytes)} 超过 GPU 显存 ${formatGiB(largestGpuBytes)}，将自动降低上下文并启用 CPU offload。`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 393 | <code>    } else if (diagnosis.modelHardwareFit?.severity === 'warning') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 394 | <code>        if (!profile.maxModelLen) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 395 | <code>            profile.maxModelLen = 4096;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 396 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>        if (!profile.gpuMemoryUtilization) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 398 | <code>            profile.gpuMemoryUtilization = '0.85';</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 399 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>        profile.adjusted = true;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 401 | <code>        profile.reason = `模型权重接近 GPU 显存，将自动降低上下文长度以减少 KV cache 压力。`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 402 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 403 | <code>    if (profile.adjusted) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 404 | <code>        profile.notes = [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 405 | <code>            profile.maxModelLen ? `max_model_len=${profile.maxModelLen}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 406 | <code>            profile.gpuMemoryUtilization ? `gpu_memory_utilization=${profile.gpuMemoryUtilization}` : '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 407 | <code>            profile.cpuOffloadGb ? `cpu_offload_gb=${profile.cpuOffloadGb}` : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 408 | <code>            profile.swapSpace ? `swap_space=${profile.swapSpace}` : ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 409 | <code>        ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 410 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>    return profile;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 412 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 414 | <code>function findRuntimeCandidate(runtime = {}, venvDir = '') {</code> | 定义函数 `findRuntimeCandidate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 415 | <code>    const candidates = Array.isArray(runtime.runtimeCandidates) ? runtime.runtimeCandidates : [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 416 | <code>    const target = String(venvDir &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `target`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 417 | <code>    if (!target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 419 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 420 | <code>    return candidates.find((candidate) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 421 | <code>        const values = [</code> | 声明局部标识符 `values`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 422 | <code>            candidate?.venvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 423 | <code>            candidate?.resolvedVenvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 424 | <code>            candidate?.venvPython</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 425 | <code>        ].map((value) =&gt; String(value &#124;&#124; '').trim().toLowerCase());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 426 | <code>        return values.some((value) =&gt; value &amp;&amp; (value === target &#124;&#124; value.includes(target)));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 427 | <code>    }) &#124;&#124; null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 428 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>function evaluateRuntimeModelCompatibility(runtime = {}, modelRequirements = null) {</code> | 定义函数 `evaluateRuntimeModelCompatibility`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 431 | <code>    if (!modelRequirements?.requiresModernTransformers) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 432 | <code>        return { ok: true, reason: '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 433 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 434 | <code>    const selectedVenvDir = runtime.reusableVenvDir &#124;&#124; '';</code> | 声明局部标识符 `selectedVenvDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 435 | <code>    const candidate = findRuntimeCandidate(runtime, selectedVenvDir);</code> | 声明局部标识符 `candidate`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 436 | <code>    const transformersVersion = String(candidate?.transformersVersion &#124;&#124; runtime.transformersVersion &#124;&#124; '').trim();</code> | 声明局部标识符 `transformersVersion`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 437 | <code>    if (!transformersVersion) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 438 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 439 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 440 | <code>            reason: `本地模型声明需要 transformers ${modelRequirements.transformersVersion}+，但当前 vLLM runtime 无法确认 transformers 版本。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 441 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 443 | <code>    if (compareVersions(transformersVersion, modelRequirements.transformersVersion) &lt; 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 444 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 445 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 446 | <code>            reason: `本地模型声明需要 transformers ${modelRequirements.transformersVersion}+，当前可复用 runtime 是 ${transformersVersion}，需要升级。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 447 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    return { ok: true, reason: '' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 450 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 452 | <code>function uniqueStrings(values = []) {</code> | 定义函数 `uniqueStrings`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 453 | <code>    const seen = new Set();</code> | 声明局部标识符 `seen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 454 | <code>    return values</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 455 | <code>        .map((value) =&gt; String(value &#124;&#124; '').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 456 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 457 | <code>        .filter((value) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 458 | <code>            const key = value.toLowerCase();</code> | 声明局部标识符 `key`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 459 | <code>            if (seen.has(key)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 460 | <code>                return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 461 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>            seen.add(key);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 463 | <code>            return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 464 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 467 | <code>function getReusableVenvCandidates(venvDir = '', platform = process.platform, runtimeMode = 'native') {</code> | 定义函数 `getReusableVenvCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 468 | <code>    const mode = normalizeRuntimeMode(runtimeMode, platform);</code> | 声明局部标识符 `mode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 469 | <code>    return uniqueStrings([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 470 | <code>        normalizeVenvDir(venvDir, platform),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 471 | <code>        getDefaultVenvDir(platform),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 472 | <code>        ...(platform === 'win32' &amp;&amp; mode === 'wsl'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 473 | <code>            ? ['~/.cache/ailis/vllm-venv', '~/.cache/ailis/vllm-smoke-venv']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 474 | <code>            : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 475 | <code>        DEFAULT_PROJECT_VENV_DIR</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 476 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 477 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>function getBaseUrl({ host = DEFAULT_HOST, port = DEFAULT_PORT } = {}) {</code> | 定义函数 `getBaseUrl`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 480 | <code>    const clientHost = host === '0.0.0.0' &#124;&#124; host === '::' ? DEFAULT_HOST : host;</code> | 声明局部标识符 `clientHost`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 481 | <code>    return `http://${clientHost}:${normalizePort(port)}/v1`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 482 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>function stripAnsi(value = '') {</code> | 定义函数 `stripAnsi`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 485 | <code>    return String(value &#124;&#124; '').replace(/\0/g, '').replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 486 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 488 | <code>function normalizeDiagnosticText(value = '') {</code> | 定义函数 `normalizeDiagnosticText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 489 | <code>    return stripAnsi(value)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 490 | <code>        .replace(/\s+/g, ' ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 491 | <code>        .trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 492 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 494 | <code>function splitOutputLines(chunk = '') {</code> | 定义函数 `splitOutputLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 495 | <code>    return stripAnsi(chunk)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 496 | <code>        .replace(/\r\n/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 497 | <code>        .replace(/\r/g, '\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 498 | <code>        .split('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 499 | <code>        .map((line) =&gt; line.trimEnd())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 500 | <code>        .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 501 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 503 | <code>function clipLine(line = '') {</code> | 定义函数 `clipLine`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 504 | <code>    const text = String(line &#124;&#124; '');</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 505 | <code>    return text.length &gt; MAX_LINE_LENGTH ? `${text.slice(0, MAX_LINE_LENGTH)}...` : text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 506 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 508 | <code>function execFileText(command, args = [], { timeoutMs = 12000 } = {}) {</code> | 定义函数 `execFileText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 509 | <code>    return new Promise((resolve, reject) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 510 | <code>        const child = spawn(command, args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 511 | <code>            windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 512 | <code>            shell: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 513 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>        let stdout = '';</code> | 声明局部标识符 `stdout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 515 | <code>        let stderr = '';</code> | 声明局部标识符 `stderr`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 516 | <code>        const timer = setTimeout(() =&gt; {</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 517 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 518 | <code>                child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 519 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 520 | <code>                // Ignore kill races.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 521 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 522 | <code>            reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 523 | <code>        }, timeoutMs);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 524 | <code>        child.stdout?.on?.('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 525 | <code>            stdout += String(chunk &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 526 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>        child.stderr?.on?.('data', (chunk) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 528 | <code>            stderr += String(chunk &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 529 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 530 | <code>        child.on('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 531 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 532 | <code>            reject(error);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 533 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>        child.on('exit', (code) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 535 | <code>            clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 536 | <code>            if (Number(code) === 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 537 | <code>                resolve(stdout);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 538 | <code>                return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 539 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 540 | <code>            reject(new Error(stderr &#124;&#124; stdout &#124;&#124; `${command} exited with code ${code}`));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 541 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 542 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 544 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 545 | <code>function execFileSafe(command, args = [], options = {}) {</code> | 定义函数 `execFileSafe`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 546 | <code>    return execFileText(command, args, options)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 547 | <code>        .then((stdout) =&gt; ({ ok: true, stdout, error: '' }))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 548 | <code>        .catch((error) =&gt; ({ ok: false, stdout: '', error: error.message &#124;&#124; String(error) }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 549 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 550 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 551 | <code>function parseJsonSafe(value, fallback = null) {</code> | 定义函数 `parseJsonSafe`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 552 | <code>    const text = stripAnsi(value);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 553 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 554 | <code>        return JSON.parse(text);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 555 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 556 | <code>        const start = text.indexOf('{');</code> | 声明局部标识符 `start`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 557 | <code>        const end = text.lastIndexOf('}');</code> | 声明局部标识符 `end`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 558 | <code>        if (start &gt;= 0 &amp;&amp; end &gt; start) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 559 | <code>            try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 560 | <code>                return JSON.parse(text.slice(start, end + 1));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 561 | <code>            } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 562 | <code>                return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 563 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 564 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 565 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 566 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 567 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 568 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 569 | <code>function classifyRuntimeShellFailure(error = '', { platform = process.platform } = {}) {</code> | 定义函数 `classifyRuntimeShellFailure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 570 | <code>    const text = normalizeDiagnosticText(error);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 571 | <code>    const lower = text.toLowerCase();</code> | 声明局部标识符 `lower`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 572 | <code>    if (!lower) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 573 | <code>        return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 574 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 575 | <code>    if (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 576 | <code>        platform === 'win32' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 577 | <code>        /wsl_e_user_not_found&#124;getpwuid&#124;getpwnam&#124;utilinitgroups&#124;createprocesscommon&#124;createprocessparsecommon&#124;create process failed/.test(lower)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 578 | <code>    ) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 579 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 580 | <code>            code: 'wsl_shell_unusable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 581 | <code>            blocking: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 582 | <code>            message: 'AILIS 托管运行环境已经安装，但当前无法启动。AILIS 已尝试自动重启该环境；如果仍失败，请先重启电脑，之后再点“部署并启用”。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 583 | <code>            detail: text.slice(0, 1000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 584 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>    if (platform === 'win32' &amp;&amp; /the attempted operation is not supported&#124;wsl.*not.*running&#124;failed to launch&#124;access is denied/.test(lower)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 587 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 588 | <code>            code: 'wsl_shell_unusable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 589 | <code>            blocking: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 590 | <code>            message: 'AILIS 托管运行环境当前无法启动。AILIS 已尝试自动恢复；如果仍失败，请重启电脑后再试。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 591 | <code>            detail: text.slice(0, 1000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 592 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>    return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 595 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 597 | <code>function normalizePathForWslpath(value = '') {</code> | 定义函数 `normalizePathForWslpath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 598 | <code>    return String(value &#124;&#124; '').replace(/\\/g, '/');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 599 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 600 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 601 | <code>async function isVllmServiceReady({ host = DEFAULT_HOST, port = DEFAULT_PORT, timeoutMs = 3500 } = {}) {</code> | 定义函数 `isVllmServiceReady`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 602 | <code>    const baseUrl = getBaseUrl({ host, port });</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 603 | <code>    if (typeof globalThis.fetch !== 'function') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 604 | <code>        return { ok: false, baseUrl, modelIds: [], error: 'fetch_unavailable' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 605 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>    const controller = new AbortController();</code> | 声明局部标识符 `controller`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 607 | <code>    const timer = setTimeout(() =&gt; controller.abort(), timeoutMs);</code> | 声明局部标识符 `timer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 608 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 609 | <code>        const response = await globalThis.fetch(`${baseUrl}/models`, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 610 | <code>            signal: controller.signal,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 611 | <code>            headers: { accept: 'application/json' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 612 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 613 | <code>        if (!response.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 614 | <code>            return { ok: false, baseUrl, modelIds: [], error: `${response.status} ${response.statusText}` };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 615 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 616 | <code>        const payload = await response.json();</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 617 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 618 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 619 | <code>            baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 620 | <code>            modelIds: Array.isArray(payload?.data)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 621 | <code>                ? payload.data.map((item) =&gt; item?.id).filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 622 | <code>                : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 623 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 624 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 625 | <code>        return { ok: false, baseUrl, modelIds: [], error: error.message &#124;&#124; String(error) };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 626 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 627 | <code>        clearTimeout(timer);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 628 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 630 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 631 | <code>function buildRuntimeProbeScript(projectRoot = '.', venvDir = DEFAULT_PROJECT_VENV_DIR, candidateVenvDirs = []) {</code> | 定义函数 `buildRuntimeProbeScript`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 632 | <code>    const root = String(projectRoot &#124;&#124; '.').replace(/\\/g, '/').replace(/"/g, '\\"');</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 633 | <code>    const venv = String(venvDir &#124;&#124; DEFAULT_PROJECT_VENV_DIR).replace(/\\/g, '/').replace(/"/g, '\\"');</code> | 声明局部标识符 `venv`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 634 | <code>    const pythonVenvLiteral = JSON.stringify(String(venvDir &#124;&#124; DEFAULT_PROJECT_VENV_DIR).replace(/\\/g, '/'));</code> | 声明局部标识符 `pythonVenvLiteral`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 635 | <code>    const candidateVenvLiteral = JSON.stringify(uniqueStrings([</code> | 声明局部标识符 `candidateVenvLiteral`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 636 | <code>        venvDir &#124;&#124; DEFAULT_PROJECT_VENV_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 637 | <code>        ...candidateVenvDirs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 638 | <code>    ]).map((value) =&gt; String(value &#124;&#124; '').replace(/\\/g, '/')));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 639 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 640 | <code>set +e</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 641 | <code>cd "${root}" 2&gt;/dev/null &#124;&#124; true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 642 | <code>venv_dir="${venv}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 643 | <code>case "$venv_dir" in</code> | 多分支标签：定义 switch 结构中的一个具体处理入口。 |
| 644 | <code>  "~") venv_dir="$HOME" ;;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 645 | <code>  "~/"*) venv_dir="$HOME/\${venv_dir#\\~/}" ;;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 646 | <code>esac</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 647 | <code>venv_python="$venv_dir/bin/python"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 648 | <code>gpu_info=""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 649 | <code>if command -v nvidia-smi &gt;/dev/null 2&gt;&amp;1; then</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 650 | <code>  gpu_info="$(nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2&gt;/dev/null &#124; tr '\\n' '; ' &#124; sed 's/[[:space:]]*$//')"</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 651 | <code>fi</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 652 | <code>disk_available_kb="$(df -Pk . 2&gt;/dev/null &#124; awk 'NR==2 {print $4}')"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 653 | <code>if ! command -v python3 &gt;/dev/null 2&gt;&amp;1; then</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 654 | <code>  gpu_info_json="$(printf '%s' "$gpu_info" &#124; sed 's/\\\\/\\\\\\\\/g; s/"/\\\\"/g')"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 655 | <code>  venv_python_json="$(printf '%s' "$venv_python" &#124; sed 's/\\\\/\\\\\\\\/g; s/"/\\\\"/g')"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 656 | <code>  printf '{"shellOk":true,"pythonPath":"","pythonVersion":"","pythonOk":false,"pythonMissing":true,"venvAvailable":false,"pipAvailable":false,"gpuInfo":"%s","venvPython":"%s","venvExists":false,"vllmInstalled":false,"diskAvailableKb":%s}\\n' "$gpu_info_json" "$venv_python_json" "\${disk_available_kb:-0}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 657 | <code>  exit 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 658 | <code>fi</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 659 | <code>python3 -c '</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 660 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 661 | <code>import os</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 662 | <code>import shutil</code> | 导入依赖 `shutil`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 663 | <code>import subprocess</code> | 导入依赖 `subprocess`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 664 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 665 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 666 | <code>primary_venv_dir = os.path.expanduser(${pythonVenvLiteral})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 667 | <code>candidate_venv_dirs = ${candidateVenvLiteral}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 668 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 669 | <code>def resolve_venv_dir(raw):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 670 | <code>    value = os.path.expanduser(str(raw or "").strip())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 671 | <code>    if not value:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 672 | <code>        value = primary_venv_dir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 673 | <code>    if not os.path.isabs(value):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 674 | <code>        value = os.path.abspath(value)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 675 | <code>    return value</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 676 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 677 | <code>def probe_venv(raw):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 678 | <code>    resolved = resolve_venv_dir(raw)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 679 | <code>    venv_python_path = os.path.join(resolved, "bin", "python")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 680 | <code>    exists = os.path.exists(venv_python_path) and os.access(venv_python_path, os.X_OK)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 681 | <code>    installed = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 682 | <code>    transformers_version = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 683 | <code>    if exists:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 684 | <code>        try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 685 | <code>            subprocess.check_call(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 686 | <code>                [venv_python_path, "-c", "import vllm"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 687 | <code>                stdout=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 688 | <code>                stderr=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 689 | <code>                timeout=20</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 690 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 691 | <code>            installed = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 692 | <code>        except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 693 | <code>            installed = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 694 | <code>        try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 695 | <code>            transformers_version = subprocess.check_output(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 696 | <code>                [venv_python_path, "-c", "import transformers; print(transformers.__version__)"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 697 | <code>                stderr=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 698 | <code>                text=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 699 | <code>                timeout=10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 700 | <code>            ).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 701 | <code>        except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 702 | <code>            transformers_version = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 703 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 704 | <code>        "venvDir": str(raw or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 705 | <code>        "resolvedVenvDir": resolved,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 706 | <code>        "venvPython": venv_python_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 707 | <code>        "venvExists": exists,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 708 | <code>        "vllmInstalled": installed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 709 | <code>        "transformersVersion": transformers_version</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 710 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 712 | <code>python_path = shutil.which("python3") or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 713 | <code>python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 714 | <code>python_ok = sys.version_info &gt;= (3, 10)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 715 | <code>gpu_info = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 716 | <code>if shutil.which("nvidia-smi"):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 717 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 718 | <code>        gpu_info = subprocess.check_output(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 719 | <code>            ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 720 | <code>            stderr=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 721 | <code>            text=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 722 | <code>            timeout=8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 723 | <code>        ).replace("\\n", "; ").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 724 | <code>    except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 725 | <code>        gpu_info = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 726 | <code>venv_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 727 | <code>pip_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 728 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 729 | <code>    subprocess.check_call([sys.executable, "-m", "venv", "--help"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 730 | <code>    venv_available = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 731 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 732 | <code>    venv_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 733 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 734 | <code>    subprocess.check_call([sys.executable, "-m", "pip", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 735 | <code>    pip_available = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 736 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 737 | <code>    pip_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 738 | <code>runtime_candidates = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 739 | <code>seen_candidates = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 740 | <code>for raw_candidate in [${pythonVenvLiteral}, *candidate_venv_dirs]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 741 | <code>    key = str(raw_candidate or "").strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 742 | <code>    if not key or key in seen_candidates:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 743 | <code>        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 744 | <code>    seen_candidates.add(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 745 | <code>    runtime_candidates.append(probe_venv(raw_candidate))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 746 | <code>primary_runtime = runtime_candidates[0] if runtime_candidates else probe_venv(${pythonVenvLiteral})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 747 | <code>reusable_runtime = next((candidate for candidate in runtime_candidates if candidate.get("vllmInstalled")), None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 748 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 749 | <code>    project_disk_available_kb = shutil.disk_usage(".").free // 1024</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 750 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 751 | <code>    project_disk_available_kb = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 752 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 753 | <code>    runtime_disk_path = os.path.dirname(primary_runtime.get("resolvedVenvDir", "")) or os.path.expanduser("~/.cache/ailis")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 754 | <code>    while runtime_disk_path and not os.path.exists(runtime_disk_path):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 755 | <code>        parent = os.path.dirname(runtime_disk_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 756 | <code>        if parent == runtime_disk_path:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 757 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 758 | <code>        runtime_disk_path = parent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 759 | <code>    if not runtime_disk_path:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 760 | <code>        runtime_disk_path = "."</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 761 | <code>    runtime_disk_available_kb = shutil.disk_usage(runtime_disk_path).free // 1024</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 762 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 763 | <code>    runtime_disk_available_kb = project_disk_available_kb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 764 | <code>print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 765 | <code>    "shellOk": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 766 | <code>    "pythonPath": python_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 767 | <code>    "pythonVersion": python_version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 768 | <code>    "pythonOk": python_ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 769 | <code>    "pythonMissing": not bool(python_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 770 | <code>    "venvAvailable": venv_available,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 771 | <code>    "pipAvailable": pip_available,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 772 | <code>    "gpuInfo": gpu_info,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 773 | <code>    "venvPython": primary_runtime.get("venvPython", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 774 | <code>    "venvExists": primary_runtime.get("venvExists", False),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 775 | <code>    "vllmInstalled": primary_runtime.get("vllmInstalled", False),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 776 | <code>    "transformersVersion": primary_runtime.get("transformersVersion", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 777 | <code>    "runtimeCandidates": runtime_candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 778 | <code>    "reusableVenvDir": reusable_runtime.get("venvDir", "") if reusable_runtime else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 779 | <code>    "reusableVenvPython": reusable_runtime.get("venvPython", "") if reusable_runtime else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 780 | <code>    "diskAvailableKb": runtime_disk_available_kb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 781 | <code>    "runtimeDiskAvailableKb": runtime_disk_available_kb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 782 | <code>    "projectDiskAvailableKb": project_disk_available_kb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 783 | <code>}))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 784 | <code>'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 785 | <code>`.trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 786 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 787 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 788 | <code>function buildNativeRuntimeProbeScript(projectRoot = '.', venvDir = DEFAULT_PROJECT_VENV_DIR, candidateVenvDirs = []) {</code> | 定义函数 `buildNativeRuntimeProbeScript`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 789 | <code>    const projectRootLiteral = JSON.stringify(path.resolve(projectRoot &#124;&#124; '.'));</code> | 声明局部标识符 `projectRootLiteral`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 790 | <code>    const primaryVenvLiteral = JSON.stringify(String(venvDir &#124;&#124; DEFAULT_PROJECT_VENV_DIR));</code> | 声明局部标识符 `primaryVenvLiteral`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 791 | <code>    const candidateVenvLiteral = JSON.stringify(uniqueStrings([</code> | 声明局部标识符 `candidateVenvLiteral`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 792 | <code>        venvDir &#124;&#124; DEFAULT_PROJECT_VENV_DIR,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 793 | <code>        ...candidateVenvDirs</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 794 | <code>    ]));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>    return `</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 796 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 797 | <code>import os</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 798 | <code>import shutil</code> | 导入依赖 `shutil`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 799 | <code>import subprocess</code> | 导入依赖 `subprocess`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 800 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 801 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 802 | <code>project_root = ${projectRootLiteral}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 803 | <code>primary_venv_dir = ${primaryVenvLiteral}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 804 | <code>candidate_venv_dirs = ${candidateVenvLiteral}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 805 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 806 | <code>def resolve_venv_dir(raw):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 807 | <code>    value = os.path.expanduser(str(raw or "").strip())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 808 | <code>    if not value:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 809 | <code>        value = primary_venv_dir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 810 | <code>    if not os.path.isabs(value):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 811 | <code>        value = os.path.abspath(os.path.join(project_root, value))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 812 | <code>    return value</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>def probe_venv(raw):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 815 | <code>    resolved = resolve_venv_dir(raw)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 816 | <code>    python_name = os.path.join("Scripts", "python.exe") if os.name == "nt" else os.path.join("bin", "python")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 817 | <code>    venv_python_path = os.path.join(resolved, python_name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 818 | <code>    exists = os.path.exists(venv_python_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 819 | <code>    installed = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 820 | <code>    transformers_version = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 821 | <code>    if exists:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 822 | <code>        try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 823 | <code>            subprocess.check_call(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 824 | <code>                [venv_python_path, "-c", "import vllm"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 825 | <code>                stdout=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 826 | <code>                stderr=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 827 | <code>                timeout=20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 828 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 829 | <code>            installed = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 830 | <code>        except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 831 | <code>            installed = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 832 | <code>        try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 833 | <code>            transformers_version = subprocess.check_output(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 834 | <code>                [venv_python_path, "-c", "import transformers; print(transformers.__version__)"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 835 | <code>                stderr=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 836 | <code>                text=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 837 | <code>                timeout=10,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 838 | <code>            ).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 839 | <code>        except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 840 | <code>            transformers_version = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 841 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 842 | <code>        "venvDir": str(raw or ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 843 | <code>        "resolvedVenvDir": resolved,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 844 | <code>        "venvPython": venv_python_path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 845 | <code>        "venvExists": exists,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 846 | <code>        "vllmInstalled": installed,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 847 | <code>        "transformersVersion": transformers_version,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 848 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 849 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 850 | <code>gpu_info = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 851 | <code>if shutil.which("nvidia-smi"):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 852 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 853 | <code>        gpu_info = subprocess.check_output(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 854 | <code>            ["nvidia-smi", "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader"],</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 855 | <code>            stderr=subprocess.DEVNULL,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 856 | <code>            text=True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 857 | <code>            timeout=8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 858 | <code>        ).replace("\\n", "; ").strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 859 | <code>    except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 860 | <code>        gpu_info = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 861 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 862 | <code>venv_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 863 | <code>pip_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 864 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 865 | <code>    subprocess.check_call([sys.executable, "-m", "venv", "--help"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 866 | <code>    venv_available = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 867 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 868 | <code>    venv_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 869 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 870 | <code>    subprocess.check_call([sys.executable, "-m", "pip", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 871 | <code>    pip_available = True</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 872 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 873 | <code>    pip_available = False</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 874 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 875 | <code>runtime_candidates = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 876 | <code>seen_candidates = set()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 877 | <code>for raw_candidate in [primary_venv_dir, *candidate_venv_dirs]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 878 | <code>    key = str(raw_candidate or "").strip().lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 879 | <code>    if not key or key in seen_candidates:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 880 | <code>        continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 881 | <code>    seen_candidates.add(key)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 882 | <code>    runtime_candidates.append(probe_venv(raw_candidate))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 883 | <code>primary_runtime = runtime_candidates[0] if runtime_candidates else probe_venv(primary_venv_dir)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 884 | <code>reusable_runtime = next((candidate for candidate in runtime_candidates if candidate.get("vllmInstalled")), None)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 885 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 886 | <code>    project_disk_available_kb = shutil.disk_usage(project_root).free // 1024</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 887 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 888 | <code>    project_disk_available_kb = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 889 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 890 | <code>    runtime_disk_path = os.path.dirname(primary_runtime.get("resolvedVenvDir", "")) or project_root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 891 | <code>    while runtime_disk_path and not os.path.exists(runtime_disk_path):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 892 | <code>        parent = os.path.dirname(runtime_disk_path)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 893 | <code>        if parent == runtime_disk_path:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 894 | <code>            break</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 895 | <code>        runtime_disk_path = parent</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 896 | <code>    if not runtime_disk_path:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 897 | <code>        runtime_disk_path = project_root</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 898 | <code>    runtime_disk_available_kb = shutil.disk_usage(runtime_disk_path).free // 1024</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 899 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 900 | <code>    runtime_disk_available_kb = project_disk_available_kb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 901 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 902 | <code>print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 903 | <code>    "shellOk": True,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 904 | <code>    "pythonPath": sys.executable,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 905 | <code>    "pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 906 | <code>    "pythonOk": sys.version_info &gt;= (3, 10),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 907 | <code>    "pythonMissing": False,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 908 | <code>    "venvAvailable": venv_available,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 909 | <code>    "pipAvailable": pip_available,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 910 | <code>    "gpuInfo": gpu_info,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 911 | <code>    "venvPython": primary_runtime.get("venvPython", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 912 | <code>    "venvExists": primary_runtime.get("venvExists", False),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 913 | <code>    "vllmInstalled": primary_runtime.get("vllmInstalled", False),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 914 | <code>    "transformersVersion": primary_runtime.get("transformersVersion", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 915 | <code>    "runtimeCandidates": runtime_candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 916 | <code>    "reusableVenvDir": reusable_runtime.get("venvDir", "") if reusable_runtime else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 917 | <code>    "reusableVenvPython": reusable_runtime.get("venvPython", "") if reusable_runtime else "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 918 | <code>    "diskAvailableKb": runtime_disk_available_kb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 919 | <code>    "runtimeDiskAvailableKb": runtime_disk_available_kb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 920 | <code>    "projectDiskAvailableKb": project_disk_available_kb</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 921 | <code>}))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 922 | <code>`.trim();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 923 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 924 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 925 | <code>async function probeNativeRuntime({ projectRoot = '.', platform = process.platform, venvDir = DEFAULT_PROJECT_VENV_DIR } = {}) {</code> | 定义函数 `probeNativeRuntime`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 926 | <code>    const script = buildNativeRuntimeProbeScript(</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 927 | <code>        projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 928 | <code>        venvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 929 | <code>        getReusableVenvCandidates(venvDir, platform, 'native')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 930 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 931 | <code>    const candidates = platform === 'win32'</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 932 | <code>        ? [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 933 | <code>            ['python', ['-c', script]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 934 | <code>            ['py', ['-3', '-c', script]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 935 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 936 | <code>        : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 937 | <code>            ['python3', ['-c', script]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 938 | <code>            ['python', ['-c', script]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 939 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 940 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 941 | <code>    for (const [command, args] of candidates) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 942 | <code>        const result = await execFileSafe(command, args, { timeoutMs: 30000 });</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 943 | <code>        if (result.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 944 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 945 | <code>                available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 946 | <code>                shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 947 | <code>                ...(parseJsonSafe(result.stdout, {}) &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 948 | <code>                error: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 949 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 950 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 951 | <code>        errors.push(`${command}: ${result.error}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 952 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 953 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 954 | <code>        available: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 955 | <code>        shellOk: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 956 | <code>        pythonOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 957 | <code>        pythonMissing: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 958 | <code>        pythonPath: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 959 | <code>        pythonVersion: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 960 | <code>        venvAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 961 | <code>        pipAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 962 | <code>        gpuInfo: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 963 | <code>        venvExists: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 964 | <code>        vllmInstalled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 965 | <code>        runtimeCandidates: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 966 | <code>        error: errors.join(' &#124; ')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 967 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 969 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 970 | <code>function buildInstallPlan(diagnosis = {}) {</code> | 定义函数 `buildInstallPlan`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 971 | <code>    const steps = [];</code> | 声明局部标识符 `steps`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 972 | <code>    const runtimeMode = normalizeRuntimeMode(diagnosis.runtimeMode &#124;&#124; '', diagnosis.platform);</code> | 声明局部标识符 `runtimeMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 973 | <code>    const windowsNativeMode = diagnosis.platform === 'win32' &amp;&amp; runtimeMode === 'native';</code> | 声明局部标识符 `windowsNativeMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 974 | <code>    const managedWindowsMode = diagnosis.platform === 'win32' &amp;&amp; runtimeMode === 'wsl';</code> | 声明局部标识符 `managedWindowsMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 975 | <code>    const installWslRequested = diagnosis.installWslRequested !== false;</code> | 声明局部标识符 `installWslRequested`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 976 | <code>    const runtimeAvailable = Boolean(diagnosis.runtime?.available &#124;&#124; diagnosis.runtime?.shellOk);</code> | 声明局部标识符 `runtimeAvailable`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 977 | <code>    const runtimeShellFailure = diagnosis.runtime?.shellFailure?.blocking ? diagnosis.runtime.shellFailure : null;</code> | 声明局部标识符 `runtimeShellFailure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 978 | <code>    const targetModel = normalizeModelId(diagnosis.targetModel &#124;&#124; diagnosis.modelId &#124;&#124; '');</code> | 声明局部标识符 `targetModel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 979 | <code>    const localModel = normalizeSource(diagnosis.source &#124;&#124; '') === 'local';</code> | 声明局部标识符 `localModel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 980 | <code>    const downloadTarget = diagnosis.downloadTarget &#124;&#124; null;</code> | 声明局部标识符 `downloadTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 981 | <code>    const serviceModelIds = Array.isArray(diagnosis.service?.modelIds) ? diagnosis.service.modelIds : [];</code> | 声明局部标识符 `serviceModelIds`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 982 | <code>    const serviceHasTargetModel = Boolean(</code> | 声明局部标识符 `serviceHasTargetModel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 983 | <code>        diagnosis.service?.ok &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 984 | <code>        targetModel &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 985 | <code>        serviceModelIds.some((id) =&gt; String(id &#124;&#124; '').trim() === targetModel)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 986 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>    const modelRuntimeCompatible = diagnosis.runtime?.modelCompatibility?.ok !== false;</code> | 声明局部标识符 `modelRuntimeCompatible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 988 | <code>    const hasUsableVllmRuntime = modelRuntimeCompatible &amp;&amp; Boolean(</code> | 声明局部标识符 `hasUsableVllmRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 989 | <code>        diagnosis.runtime?.vllmInstalled &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 990 | <code>        diagnosis.runtime?.reusableVenvDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 991 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 992 | <code>    if (diagnosis.platform === 'win32' &amp;&amp; runtimeMode === 'wsl' &amp;&amp; !diagnosis.wsl?.available) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 993 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 994 | <code>            id: 'install_wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 995 | <code>            title: '准备 AILIS 托管兼容环境',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 996 | <code>            severity: installWslRequested ? 'required' : 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 997 | <code>            requiresSystemChange: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 998 | <code>            requiresUserAction: !installWslRequested,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 999 | <code>            description: installWslRequested</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1000 | <code>                ? 'AILIS 会尝试自动启用 Windows 的本地模型兼容环境并安装 Ubuntu；系统组件首次启用后可能需要重启。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1001 | <code>                : '当前选择了兼容模式，但没有检测到可用运行环境。请允许 AILIS 自动准备，或切换到连接已有服务。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1002 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1003 | <code>    } else if (diagnosis.platform === 'win32' &amp;&amp; runtimeMode === 'wsl' &amp;&amp; !diagnosis.wsl?.distros?.length) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1004 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1005 | <code>            id: 'install_wsl_distro',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1006 | <code>            title: '安装 AILIS 托管 Linux 运行环境',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1007 | <code>            severity: installWslRequested ? 'required' : 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1008 | <code>            requiresSystemChange: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1009 | <code>            requiresUserAction: !installWslRequested,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1010 | <code>            description: installWslRequested</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1011 | <code>                ? 'AILIS 会自动安装可用的 Ubuntu 运行环境，用于承载 vLLM、Python 和 CUDA 依赖。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1012 | <code>                : '当前没有可用的托管 Linux 运行环境。请允许 AILIS 自动安装，或切换到连接已有服务。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1013 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1014 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1015 | <code>    if (runtimeShellFailure) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1016 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1017 | <code>            id: 'repair_wsl_shell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1018 | <code>            title: managedWindowsMode ? '修复 AILIS 托管运行环境' : '修复 WSL/Ubuntu Shell',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1019 | <code>            severity: 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1020 | <code>            requiresSystemChange: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1021 | <code>            requiresUserAction: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1022 | <code>            description: managedWindowsMode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1023 | <code>                ? `AILIS 检测到托管运行环境已经安装但无法启动：${runtimeShellFailure.message}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1024 | <code>                : runtimeShellFailure.message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1025 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1026 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1027 | <code>    if (windowsNativeMode &amp;&amp; !diagnosis.service?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1028 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1029 | <code>            id: 'windows_native_vllm_service_required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1030 | <code>            title: '连接已有 vLLM 服务',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1031 | <code>            severity: 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1032 | <code>            requiresUserAction: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1033 | <code>            description: '当前是高级连接模式，本机 OpenAI-compatible vLLM 服务未响应。普通用户应使用 AILIS 自动部署模式。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1034 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>    } else if (windowsNativeMode &amp;&amp; diagnosis.service?.ok &amp;&amp; targetModel &amp;&amp; !serviceHasTargetModel) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1036 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1037 | <code>            id: 'windows_native_vllm_model_mismatch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1038 | <code>            title: '当前 Windows vLLM 服务模型不匹配',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1039 | <code>            severity: 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1040 | <code>            requiresUserAction: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1041 | <code>            description: `已连接到 Windows 本地 vLLM 服务，但它没有提供 ${targetModel}。请用该模型重启服务，或把 AILIS 模型名改成服务实际返回的模型。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1042 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1043 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1044 | <code>    if (!windowsNativeMode &amp;&amp; !runtimeShellFailure &amp;&amp; runtimeAvailable &amp;&amp; (</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1045 | <code>        !diagnosis.runtime?.pythonOk &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1046 | <code>        diagnosis.runtime?.pythonMissing &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1047 | <code>        diagnosis.runtime?.venvAvailable === false &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1048 | <code>        diagnosis.runtime?.pipAvailable === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1049 | <code>    )) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1050 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1051 | <code>            id: 'install_python',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1052 | <code>            title: '安装 Python 3.10+、venv 和 pip',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1053 | <code>            severity: 'required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1054 | <code>            requiresNetwork: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1055 | <code>            description: '部署时会尝试在 Linux/WSL 中自动安装 python3、python3-venv、python3-pip。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1056 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1057 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1058 | <code>    if (runtimeAvailable &amp;&amp; diagnosis.runtimeUpgradeFeasibility?.ok === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1059 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1060 | <code>            id: 'gpu_driver_update',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1061 | <code>            title: '更新 NVIDIA 驱动或切换部署方式',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1062 | <code>            severity: 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1063 | <code>            requiresSystemChange: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1064 | <code>            requiresUserAction: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1065 | <code>            description: diagnosis.runtimeUpgradeFeasibility.reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1066 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1067 | <code>    } else if (runtimeAvailable &amp;&amp; diagnosis.runtimeUpgradeFeasibility?.severity === 'warning') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1068 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1069 | <code>            id: 'runtime_upgrade_caution',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1070 | <code>            title: '自动升级 vLLM Runtime 并验证模型',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1071 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1072 | <code>            description: diagnosis.runtimeUpgradeFeasibility.reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1073 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1074 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>    if (!windowsNativeMode &amp;&amp; runtimeAvailable &amp;&amp; !hasUsableVllmRuntime) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1076 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1077 | <code>            id: 'install_vllm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1078 | <code>            title: diagnosis.runtime?.modelCompatibility?.ok === false ? '升级 vLLM 运行时以支持当前模型' : '创建 vLLM 私有运行时并安装依赖',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1079 | <code>            severity: 'required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1080 | <code>            requiresNetwork: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1081 | <code>            description: diagnosis.runtime?.modelCompatibility?.reason &#124;&#124; '将在项目目录 .ailis-runtime/vllm-venv 中创建私有 venv，并安装 vLLM 与模型下载依赖。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1082 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1083 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>    if (!localModel) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1085 | <code>        if (!downloadTarget?.path) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1086 | <code>            steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1087 | <code>                id: 'select_download_dir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1088 | <code>                title: '选择模型安装路径',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1089 | <code>                severity: 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1090 | <code>                requiresUserAction: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1091 | <code>                description: '自动安装模型前需要先选择下载/安装目录，AILIS 会检查目录和剩余空间。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1092 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1093 | <code>        } else if (downloadTarget.blockers?.length) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1094 | <code>            steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1095 | <code>                id: 'download_dir_not_ready',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1096 | <code>                title: '模型安装路径不可用',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1097 | <code>                severity: 'blocking',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1098 | <code>                requiresUserAction: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1099 | <code>                description: downloadTarget.blockers.join('；')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1100 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1101 | <code>        } else if (downloadTarget.warnings?.length) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1102 | <code>            steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1103 | <code>                id: 'download_dir_warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1104 | <code>                title: '模型安装路径需要确认',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1105 | <code>                severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1106 | <code>                description: downloadTarget.warnings.join('；')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1107 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1108 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1109 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1110 | <code>    const diskAvailableKb = Number(diagnosis.runtime?.runtimeDiskAvailableKb &#124;&#124; diagnosis.runtime?.diskAvailableKb) &#124;&#124; 0;</code> | 声明局部标识符 `diskAvailableKb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1111 | <code>    if (runtimeAvailable &amp;&amp; diskAvailableKb &gt; 0 &amp;&amp; diskAvailableKb &lt; MIN_RECOMMENDED_DISK_KB) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1112 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1113 | <code>            id: 'disk_space_low',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1114 | <code>            title: '本地磁盘空间偏低',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1115 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1116 | <code>            description: `vLLM runtime/cache 所在磁盘可用空间约 ${Math.max(0.1, diskAvailableKb / 1024 / 1024).toFixed(1)}GB。安装或升级 vLLM/PyTorch 通常需要较大临时空间。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1117 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1118 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>    if (!windowsNativeMode &amp;&amp; runtimeAvailable &amp;&amp; diagnosis.modelHardwareFit?.severity) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1120 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1121 | <code>            id: 'gpu_memory_fit',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1122 | <code>            title: diagnosis.modelHardwareFit.ok ? '模型显存余量偏紧' : '模型权重大于可用 GPU 显存',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1123 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1124 | <code>            description: diagnosis.modelHardwareFit.reason</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1125 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1126 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1127 | <code>    if (!windowsNativeMode &amp;&amp; runtimeAvailable &amp;&amp; diagnosis.launchProfile?.adjusted) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1128 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1129 | <code>            id: 'auto_launch_profile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1130 | <code>            title: '自动调整 vLLM 启动参数',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1131 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1132 | <code>            description: `${diagnosis.launchProfile.reason} 参数：${diagnosis.launchProfile.notes?.join('，') &#124;&#124; '自动配置'}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1133 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1134 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1135 | <code>    if (!windowsNativeMode &amp;&amp; runtimeAvailable &amp;&amp; targetModel &amp;&amp; !serviceHasTargetModel &amp;&amp; !localModel &amp;&amp; downloadTarget?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1136 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1137 | <code>            id: 'download_model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1138 | <code>            title: '下载开源模型权重到本地缓存',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1139 | <code>            severity: 'required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1140 | <code>            requiresNetwork: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1141 | <code>            description: `将从 Hugging Face 或 ModelScope 下载 ${targetModel} 到 ${downloadTarget.path}，并复用本地模型缓存。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1142 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1143 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1144 | <code>    if (!windowsNativeMode &amp;&amp; runtimeAvailable &amp;&amp; !diagnosis.runtime?.gpuInfo) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1145 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1146 | <code>            id: 'gpu_check',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1147 | <code>            title: '未检测到 NVIDIA GPU / CUDA',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1148 | <code>            severity: 'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1149 | <code>            description: 'vLLM 通常需要 CUDA GPU。AILIS 仍可尝试部署，但模型加载可能失败或非常慢。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1150 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1151 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1152 | <code>    if (!windowsNativeMode &amp;&amp; !diagnosis.service?.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1153 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1154 | <code>            id: 'start_vllm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1155 | <code>            title: '启动 vLLM OpenAI-compatible 服务',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1156 | <code>            severity: 'required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1157 | <code>            description: '部署完成后会在 http://127.0.0.1:8000/v1 启动服务，并等待 /v1/models 就绪。'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1158 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1159 | <code>    } else if (!windowsNativeMode &amp;&amp; targetModel &amp;&amp; !serviceHasTargetModel) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1160 | <code>        steps.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1161 | <code>            id: 'switch_vllm_service',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1162 | <code>            title: '停止旧 vLLM 服务并切换模型',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1163 | <code>            severity: 'required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1164 | <code>            description: `当前端口正在服务 ${serviceModelIds.join(', ') &#124;&#124; '其他模型'}；部署时会先停止旧服务，释放端口和显存，再启动 ${targetModel}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1165 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1166 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1167 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1168 | <code>        ok: !steps.some((step) =&gt; step.severity === 'blocking'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1169 | <code>        steps,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1170 | <code>        requiresNetwork: steps.some((step) =&gt; step.requiresNetwork),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1171 | <code>        requiresSystemChange: steps.some((step) =&gt; step.requiresSystemChange),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1172 | <code>        blockingSteps: steps.filter((step) =&gt; step.severity === 'blocking')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1173 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1174 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1175 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1176 | <code>function summarizeFailure(lines = [], exitCode = null) {</code> | 定义函数 `summarizeFailure`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1177 | <code>    const text = lines.join('\n').toLowerCase();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1178 | <code>    if (/wsl_e_user_not_found&#124;getpwuid&#124;getpwnam&#124;utilinitgroups&#124;createprocesscommon&#124;createprocessparsecommon&#124;create process failed/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1179 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1180 | <code>            code: 'wsl_shell_unusable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1181 | <code>            message: 'AILIS 托管运行环境已经安装，但当前无法启动。AILIS 已尝试自动恢复；如果仍失败，请重启电脑后再试。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1182 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1183 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1184 | <code>    if (/vllm runtime still cannot read this local model config&#124;model type [`'"]?qwen3&#124;transformers does not recognize&#124;version of transformers is out of date&#124;configuration_auto\.py&#124;keyerror:\s*['"]qwen3&#124;unrecognized configuration class&#124;unknown model type/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1185 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1186 | <code>            code: 'model_runtime_incompatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1187 | <code>            message: '当前 vLLM / Transformers 运行时不支持这个模型架构。需要升级本地 vLLM runtime，或换用当前 runtime 支持的模型。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1188 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1189 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1190 | <code>    if (/no wsl distro found&#124;wsl was not found&#124;wsl --install/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1191 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1192 | <code>            code: 'wsl_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1193 | <code>            message: 'Windows 上自动部署 vLLM 需要 WSL2/Ubuntu。当前没有可用 WSL 发行版，控制面板无法继续安装。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1194 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1195 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1196 | <code>    if (/python3 was not found&#124;python .*too old&#124;python 3\.10/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1197 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1198 | <code>            code: 'python_missing',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1199 | <code>            message: 'vLLM 运行环境缺少 Python 3.10+。需要先让本地/WSL 具备可用 Python。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1200 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1201 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1202 | <code>    if (/trust_remote_code&#124;trust-remote-code&#124;remote code/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1203 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1204 | <code>            code: 'trust_remote_code',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1205 | <code>            message: '该模型可能需要启用 Trust Remote Code。只在信任模型仓库时勾选后重试。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1206 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1207 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1208 | <code>    if (/snapshot_download&#124;localentrynotfound&#124;huggingface&#124;modelscope&#124;hub&#124;repo_info&#124;network is unreachable&#124;cannot find the appropriate snapshot&#124;connecterror&#124;connection/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1209 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1210 | <code>            code: 'model_download_or_network',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1211 | <code>            message: '模型权重下载失败，通常是 Hugging Face / ModelScope 网络不可达、模型 ID 不存在、代理未配置，或本地没有可复用缓存。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1212 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1213 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1214 | <code>    if (/nvidia-smi was not found&#124;cuda out of memory&#124;outofmemoryerror&#124;out of memory&#124;oom&#124;no cuda gpus? are available&#124;cuda error&#124;cuda driver version is insufficient&#124;failed to initialize nvml&#124;cublas&#124;libcuda/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1215 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1216 | <code>            code: 'gpu_or_cuda',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1217 | <code>            message: 'vLLM 启动失败可能与 CUDA/GPU/显存有关。请查看日志中的 CUDA、GPU 或 OOM 信息。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1218 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1219 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1220 | <code>    if (/did not become ready&#124;wait.*ready&#124;ready timeout&#124;timed out&#124;timeout/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1221 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1222 | <code>            code: 'ready_timeout',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1223 | <code>            message: 'vLLM 进程没有在限定时间内完成加载。常见原因是模型太大、下载慢、显存不足或首次编译耗时。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1224 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1225 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1226 | <code>    if (/pip install&#124;failed building wheel&#124;could not find a version&#124;network&#124;connection&#124;ssl&#124;proxy/.test(text)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1227 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1228 | <code>            code: 'install_or_network',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1229 | <code>            message: 'vLLM 环境安装或模型下载失败，可能是网络、pip 源、代理或依赖编译问题。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1230 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1231 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1232 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1233 | <code>        code: 'process_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1234 | <code>        message: `vLLM 自动部署进程退出失败${exitCode === null ? '' : `（exitCode=${exitCode}）`}。请查看下方日志摘要。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1235 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1236 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1238 | <code>function readTextFileTailLines(filePath, { maxBytes = 64 * 1024, maxLines = 80 } = {}) {</code> | 定义函数 `readTextFileTailLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1239 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1240 | <code>        if (!fs.existsSync(filePath)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1241 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1242 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1243 | <code>        const stats = fs.statSync(filePath);</code> | 声明局部标识符 `stats`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1244 | <code>        const length = Math.min(Number(stats.size) &#124;&#124; 0, maxBytes);</code> | 声明局部标识符 `length`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1245 | <code>        if (length &lt;= 0) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1246 | <code>            return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1247 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1248 | <code>        const fd = fs.openSync(filePath, 'r');</code> | 声明局部标识符 `fd`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1249 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1250 | <code>            const buffer = Buffer.alloc(length);</code> | 声明局部标识符 `buffer`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1251 | <code>            fs.readSync(fd, buffer, 0, length, Math.max(0, stats.size - length));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1252 | <code>            return splitOutputLines(buffer.toString('utf8')).slice(-maxLines);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1253 | <code>        } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1254 | <code>            fs.closeSync(fd);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1255 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1256 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1257 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1258 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1259 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1261 | <code>function readDetachedVllmLogLines(projectRoot = '') {</code> | 定义函数 `readDetachedVllmLogLines`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1262 | <code>    const logDir = path.join(projectRoot &#124;&#124; '.', '.ailis-runtime', 'vllm');</code> | 声明局部标识符 `logDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1263 | <code>    const files = [</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1264 | <code>        ['stderr', path.join(logDir, 'vllm.err.log')],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1265 | <code>        ['stdout', path.join(logDir, 'vllm.out.log')]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1266 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1267 | <code>    const lines = [];</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1268 | <code>    for (const [label, filePath] of files) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 1269 | <code>        const tail = readTextFileTailLines(filePath, { maxBytes: 80 * 1024, maxLines: 60 });</code> | 声明局部标识符 `tail`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1270 | <code>        if (!tail.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1271 | <code>            continue;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1272 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1273 | <code>        lines.push(`[AILIS vLLM] 最近 ${label} 日志：${filePath}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1274 | <code>        lines.push(...tail.map((line) =&gt; `[vLLM ${label}] ${line}`));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1275 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1276 | <code>    return lines;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1277 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1278 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1279 | <code>function buildDeployCommand({</code> | 定义函数 `buildDeployCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1280 | <code>    projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1281 | <code>    platform = process.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1282 | <code>    source = 'modelscope',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1283 | <code>    model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1284 | <code>    venvDir = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1285 | <code>    downloadDir = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1286 | <code>    dtype = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1287 | <code>    maxModelLen = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1288 | <code>    cpuOffloadGb = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1289 | <code>    swapSpace = 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1290 | <code>    gpuMemoryUtilization = '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1291 | <code>    pipIndexUrl = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1292 | <code>    pipExtraIndexUrl = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1293 | <code>    servedModelName = '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1294 | <code>    host = DEFAULT_HOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1295 | <code>    port = DEFAULT_PORT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1296 | <code>    readyTimeoutSec = DEFAULT_READY_TIMEOUT_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1297 | <code>    vllmPackage = 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1298 | <code>    trustRemoteCode = false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1299 | <code>    installWsl = true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1300 | <code>    runtimeMode = ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1301 | <code>} = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1302 | <code>    const modelId = normalizeModelReference(model);</code> | 声明局部标识符 `modelId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1303 | <code>    if (!modelId) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1304 | <code>        throw new Error('模型 ID 不能为空。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1305 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1306 | <code>    const normalizedSource = inferVllmSource(source, modelId);</code> | 声明局部标识符 `normalizedSource`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1307 | <code>    const normalizedRuntimeMode = normalizeRuntimeMode(runtimeMode, platform);</code> | 声明局部标识符 `normalizedRuntimeMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1308 | <code>    const normalizedServedModelName = normalizeModelId(servedModelName);</code> | 声明局部标识符 `normalizedServedModelName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1309 | <code>    const normalizedPort = normalizePort(port);</code> | 声明局部标识符 `normalizedPort`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1310 | <code>    const normalizedTimeout = normalizeReadyTimeoutSec(readyTimeoutSec);</code> | 声明局部标识符 `normalizedTimeout`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1311 | <code>    const normalizedVllmPackage = normalizeVllmPackage(vllmPackage);</code> | 声明局部标识符 `normalizedVllmPackage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1312 | <code>    const normalizedVenvDir = normalizeVenvDir(venvDir, platform);</code> | 声明局部标识符 `normalizedVenvDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1313 | <code>    const normalizedDownloadDir = String(downloadDir &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedDownloadDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1314 | <code>    const normalizedDType = String(dtype &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedDType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1315 | <code>    const normalizedMaxModelLen = Math.max(0, Math.floor(Number(maxModelLen) &#124;&#124; 0));</code> | 声明局部标识符 `normalizedMaxModelLen`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1316 | <code>    const normalizedCpuOffloadGb = Math.max(0, Number(cpuOffloadGb) &#124;&#124; 0);</code> | 声明局部标识符 `normalizedCpuOffloadGb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1317 | <code>    const normalizedSwapSpace = Math.max(0, Math.floor(Number(swapSpace) &#124;&#124; 0));</code> | 声明局部标识符 `normalizedSwapSpace`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1318 | <code>    const normalizedGpuMemoryUtilization = String(gpuMemoryUtilization &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedGpuMemoryUtilization`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1319 | <code>    const normalizedPipIndexUrl = String(pipIndexUrl &#124;&#124; DEFAULT_PIP_INDEX_URL).trim();</code> | 声明局部标识符 `normalizedPipIndexUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1320 | <code>    const normalizedPipExtraIndexUrl = String(pipExtraIndexUrl &#124;&#124; '').trim();</code> | 声明局部标识符 `normalizedPipExtraIndexUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1321 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1322 | <code>    if (platform === 'win32' &amp;&amp; normalizedRuntimeMode !== 'wsl') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1323 | <code>        throw new Error('当前是高级连接模式，AILIS 不会在这个模式里安装 runtime。请使用 managed/auto 部署模式，或连接已有 OpenAI-compatible vLLM 服务。');</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1324 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1326 | <code>    if (platform === 'win32') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1327 | <code>        const scriptPath = path.join(projectRoot, 'scripts', 'bootstrap-vllm-local.ps1');</code> | 声明局部标识符 `scriptPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1328 | <code>        const args = [</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1329 | <code>            '-NoProfile',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1330 | <code>            '-ExecutionPolicy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1331 | <code>            'Bypass',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1332 | <code>            '-File',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1333 | <code>            scriptPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1334 | <code>            '-Source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1335 | <code>            normalizedSource,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1336 | <code>            '-Model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1337 | <code>            modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1338 | <code>            ...(normalizedServedModelName ? ['-ServedModelName', normalizedServedModelName] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1339 | <code>            '-VenvDir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1340 | <code>            normalizedVenvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1341 | <code>            ...(normalizedDownloadDir ? ['-DownloadDir', normalizedDownloadDir] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1342 | <code>            ...(normalizedDType ? ['-DType', normalizedDType] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1343 | <code>            ...(normalizedMaxModelLen &gt; 0 ? ['-MaxModelLen', String(normalizedMaxModelLen)] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1344 | <code>            ...(normalizedCpuOffloadGb &gt; 0 ? ['-CpuOffloadGb', String(normalizedCpuOffloadGb)] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1345 | <code>            ...(normalizedSwapSpace &gt; 0 ? ['-SwapSpace', String(normalizedSwapSpace)] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1346 | <code>            ...(normalizedGpuMemoryUtilization ? ['-GpuMemoryUtilization', normalizedGpuMemoryUtilization] : []),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1347 | <code>            ...(normalizedPipIndexUrl ? ['-PipIndexUrl', normalizedPipIndexUrl] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1348 | <code>            ...(normalizedPipExtraIndexUrl ? ['-PipExtraIndexUrl', normalizedPipExtraIndexUrl] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1349 | <code>            '-HostName',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1350 | <code>            host,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1351 | <code>            '-Port',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1352 | <code>            String(normalizedPort),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1353 | <code>            '-Start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1354 | <code>            '-Detached',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1355 | <code>            '-WaitReady',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1356 | <code>            '-ReadyTimeoutSec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1357 | <code>            String(normalizedTimeout),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1358 | <code>            '-VllmPackage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1359 | <code>            normalizedVllmPackage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1360 | <code>        ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1361 | <code>        if (trustRemoteCode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1362 | <code>            args.push('-TrustRemoteCode');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1363 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1364 | <code>        if (installWsl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1365 | <code>            args.push('-InstallWsl');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1366 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1367 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1368 | <code>            command: 'powershell.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1369 | <code>            args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1370 | <code>            cwd: projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1371 | <code>            runtimeMode: normalizedRuntimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1372 | <code>            source: normalizedSource,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1373 | <code>            modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1374 | <code>            servedModelId: normalizedServedModelName &#124;&#124; modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1375 | <code>            venvDir: normalizedVenvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1376 | <code>            downloadDir: normalizedDownloadDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1377 | <code>            vllmPackage: normalizedVllmPackage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1378 | <code>            pipIndexUrl: normalizedPipIndexUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1379 | <code>            baseUrl: getBaseUrl({ host, port: normalizedPort })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1380 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1381 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1382 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1383 | <code>    const scriptPath = path.join(projectRoot, 'scripts', 'bootstrap-vllm-local.sh');</code> | 声明局部标识符 `scriptPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1384 | <code>    const args = [</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1385 | <code>        scriptPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1386 | <code>        '--source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1387 | <code>        normalizedSource,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1388 | <code>        '--model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1389 | <code>        modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1390 | <code>        ...(normalizedServedModelName ? ['--served-model-name', normalizedServedModelName] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1391 | <code>        '--venv-dir',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1392 | <code>        normalizedVenvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1393 | <code>        ...(normalizedDownloadDir ? ['--download-dir', normalizedDownloadDir] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1394 | <code>            ...(normalizedDType ? ['--dtype', normalizedDType] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1395 | <code>            ...(normalizedMaxModelLen &gt; 0 ? ['--max-model-len', String(normalizedMaxModelLen)] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1396 | <code>            ...(normalizedCpuOffloadGb &gt; 0 ? ['--cpu-offload-gb', String(normalizedCpuOffloadGb)] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1397 | <code>            ...(normalizedSwapSpace &gt; 0 ? ['--swap-space', String(normalizedSwapSpace)] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1398 | <code>            ...(normalizedGpuMemoryUtilization ? ['--gpu-memory-utilization', normalizedGpuMemoryUtilization] : []),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1399 | <code>        ...(normalizedPipIndexUrl ? ['--pip-index-url', normalizedPipIndexUrl] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1400 | <code>        ...(normalizedPipExtraIndexUrl ? ['--pip-extra-index-url', normalizedPipExtraIndexUrl] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1401 | <code>        '--host',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1402 | <code>        host,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1403 | <code>        '--port',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1404 | <code>        String(normalizedPort),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1405 | <code>        '--start',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1406 | <code>        '--detached',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1407 | <code>        '--wait-ready',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1408 | <code>        '--ready-timeout-sec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1409 | <code>        String(normalizedTimeout),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1410 | <code>        '--vllm-package',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1411 | <code>        normalizedVllmPackage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1412 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1413 | <code>    if (trustRemoteCode) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1414 | <code>        args.push('--trust-remote-code');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1415 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1416 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1417 | <code>        command: 'bash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1418 | <code>        args,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1419 | <code>        cwd: projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1420 | <code>        runtimeMode: normalizedRuntimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1421 | <code>        source: normalizedSource,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1422 | <code>        modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1423 | <code>        servedModelId: normalizedServedModelName &#124;&#124; modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1424 | <code>        venvDir: normalizedVenvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1425 | <code>        downloadDir: normalizedDownloadDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1426 | <code>        vllmPackage: normalizedVllmPackage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1427 | <code>        pipIndexUrl: normalizedPipIndexUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1428 | <code>        baseUrl: getBaseUrl({ host, port: normalizedPort })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1429 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1430 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1431 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1432 | <code>class VllmLocalDeployer extends EventEmitter {</code> | 定义类 `VllmLocalDeployer`，把相关状态与行为收拢为一个运行时对象。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1433 | <code>    constructor({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1434 | <code>        projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1435 | <code>        platform = process.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1436 | <code>        processFactory = spawn</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1437 | <code>    } = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1438 | <code>        super();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1439 | <code>        this.projectRoot = projectRoot &#124;&#124; path.resolve(__dirname, '..');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1440 | <code>        this.platform = platform;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1441 | <code>        this.processFactory = processFactory;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1442 | <code>        this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1443 | <code>        this.status = this.createIdleStatus();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1444 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1446 | <code>    createIdleStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1447 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1448 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1449 | <code>            status: 'idle',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1450 | <code>            running: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1451 | <code>            modelId: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1452 | <code>            source: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1453 | <code>            runtimeMode: 'native',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1454 | <code>            servedModelId: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1455 | <code>            baseUrl: getBaseUrl(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1456 | <code>            startedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1457 | <code>            endedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1458 | <code>            exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1459 | <code>            failure: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1460 | <code>            diagnosis: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1461 | <code>            installPlan: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1462 | <code>            logLines: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1463 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1464 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1465 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1466 | <code>    async diagnose(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1467 | <code>        const host = payload.host &#124;&#124; DEFAULT_HOST;</code> | 声明局部标识符 `host`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1468 | <code>        const port = normalizePort(payload.port &#124;&#124; DEFAULT_PORT);</code> | 声明局部标识符 `port`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1469 | <code>        const runtimeMode = normalizeRuntimeMode(payload.runtimeMode &#124;&#124; '', this.platform);</code> | 声明局部标识符 `runtimeMode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1470 | <code>        const venvDir = normalizeVenvDir(payload.venvDir &#124;&#124; '', this.platform);</code> | 声明局部标识符 `venvDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1471 | <code>        const diagnosis = {</code> | 声明局部标识符 `diagnosis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1472 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1473 | <code>            platform: this.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1474 | <code>            runtimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1475 | <code>            installWslRequested: payload.installWsl !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1476 | <code>            projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1477 | <code>            modelId: normalizeModelReference(payload.modelId &#124;&#124; payload.model &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1478 | <code>            source: inferVllmSource(payload.source &#124;&#124; '', payload.modelId &#124;&#124; payload.model &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1479 | <code>            venvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1480 | <code>            checkedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1481 | <code>            wsl: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1482 | <code>                required: this.platform === 'win32' &amp;&amp; runtimeMode === 'wsl',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1483 | <code>                available: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1484 | <code>                distros: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1485 | <code>                error: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1486 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1487 | <code>        runtime: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1488 | <code>            available: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1489 | <code>            shellOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1490 | <code>            pythonOk: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1491 | <code>            pythonMissing: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1492 | <code>            pythonPath: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1493 | <code>            pythonVersion: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1494 | <code>            venvAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1495 | <code>            pipAvailable: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1496 | <code>            gpuInfo: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1497 | <code>            venvExists: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1498 | <code>            vllmInstalled: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1499 | <code>            error: ''</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1500 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1501 | <code>            service: await isVllmServiceReady({ host, port }),</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1502 | <code>            targetModel: normalizeModelId(payload.servedModelName &#124;&#124; payload.modelId &#124;&#124; payload.model &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1503 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1505 | <code>        if (this.platform === 'win32' &amp;&amp; runtimeMode === 'wsl') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1506 | <code>            const wslStatus = await execFileSafe('wsl.exe', ['--status'], { timeoutMs: 8000 });</code> | 声明局部标识符 `wslStatus`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1507 | <code>            diagnosis.wsl.available = wslStatus.ok;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1508 | <code>            diagnosis.wsl.error = wslStatus.ok ? '' : wslStatus.error;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1509 | <code>            if (wslStatus.ok) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1510 | <code>                const distroResult = await execFileSafe('wsl.exe', ['-l', '-q'], { timeoutMs: 8000 });</code> | 声明局部标识符 `distroResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1511 | <code>                diagnosis.wsl.distros = splitOutputLines(distroResult.stdout)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1512 | <code>                    .map((line) =&gt; line.replace(/\0/g, '').trim())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1513 | <code>                    .filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1514 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1515 | <code>            if (diagnosis.wsl.distros.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1516 | <code>                const pathResult = await execFileSafe(</code> | 声明局部标识符 `pathResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1517 | <code>                    'wsl.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1518 | <code>                    ['--', 'wslpath', '-a', normalizePathForWslpath(this.projectRoot)],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1519 | <code>                    { timeoutMs: 8000 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1520 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1521 | <code>                const wslProjectRoot = pathResult.ok</code> | 声明局部标识符 `wslProjectRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1522 | <code>                    ? splitOutputLines(pathResult.stdout)[0] &#124;&#124; '/mnt/f/AILIS_self_evolution_runtime'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1523 | <code>                    : '/mnt/f/AILIS_self_evolution_runtime';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1524 | <code>                let runtimeResult = await execFileSafe(</code> | 声明局部标识符 `runtimeResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1525 | <code>                    'wsl.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1526 | <code>                    ['--', 'bash', '-lc', buildRuntimeProbeScript(wslProjectRoot, venvDir, getReusableVenvCandidates(venvDir, this.platform, runtimeMode))],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1527 | <code>                    { timeoutMs: 30000 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1528 | <code>                );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1529 | <code>                let shellFailure = runtimeResult.ok</code> | 声明局部标识符 `shellFailure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1530 | <code>                    ? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1531 | <code>                    : classifyRuntimeShellFailure(runtimeResult.error, { platform: this.platform });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1532 | <code>                if (!runtimeResult.ok &amp;&amp; shellFailure?.blocking) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1533 | <code>                    await execFileSafe('wsl.exe', ['--shutdown'], { timeoutMs: 15000 });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1534 | <code>                    await new Promise((resolve) =&gt; setTimeout(resolve, 1200));</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1535 | <code>                    runtimeResult = await execFileSafe(</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1536 | <code>                        'wsl.exe',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1537 | <code>                        ['--', 'bash', '-lc', buildRuntimeProbeScript(wslProjectRoot, venvDir, getReusableVenvCandidates(venvDir, this.platform, runtimeMode))],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1538 | <code>                        { timeoutMs: 30000 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1539 | <code>                    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1540 | <code>                    shellFailure = runtimeResult.ok</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1541 | <code>                        ? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1542 | <code>                        : classifyRuntimeShellFailure(runtimeResult.error, { platform: this.platform });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1543 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1544 | <code>                diagnosis.runtime = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1545 | <code>                    ...diagnosis.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1546 | <code>                    available: runtimeResult.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1547 | <code>                    ...(parseJsonSafe(runtimeResult.stdout, {}) &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1548 | <code>                    error: runtimeResult.ok ? '' : runtimeResult.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1549 | <code>                    shellFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1550 | <code>                };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1551 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1552 | <code>        } else if (this.platform === 'win32') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1553 | <code>            diagnosis.runtime = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1554 | <code>                ...diagnosis.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1555 | <code>                ...(await probeNativeRuntime({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1556 | <code>                    projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1557 | <code>                    platform: this.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1558 | <code>                    venvDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1559 | <code>                })),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1560 | <code>                shellFailure: null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1561 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1562 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1563 | <code>            const runtimeResult = await execFileSafe(</code> | 声明局部标识符 `runtimeResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1564 | <code>                'bash',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1565 | <code>                ['-lc', buildRuntimeProbeScript(this.projectRoot, venvDir, getReusableVenvCandidates(venvDir, this.platform, runtimeMode))],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1566 | <code>                { timeoutMs: 30000 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1567 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1568 | <code>            diagnosis.runtime = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1569 | <code>                ...diagnosis.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1570 | <code>                available: runtimeResult.ok,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1571 | <code>                ...(parseJsonSafe(runtimeResult.stdout, {}) &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1572 | <code>                error: runtimeResult.ok ? '' : runtimeResult.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1573 | <code>                shellFailure: runtimeResult.ok</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1574 | <code>                    ? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1575 | <code>                    : classifyRuntimeShellFailure(runtimeResult.error, { platform: this.platform })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1576 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1577 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1579 | <code>        diagnosis.modelRequirements = diagnosis.source === 'local'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1580 | <code>            ? readLocalModelRequirements(payload.modelId &#124;&#124; payload.model &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1581 | <code>            : null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1582 | <code>        diagnosis.downloadTarget = diagnosis.source === 'local'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1583 | <code>            ? null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1584 | <code>            : inspectDownloadTarget({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1585 | <code>                downloadDir: payload.downloadDir &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1586 | <code>                modelId: diagnosis.modelId &#124;&#124; diagnosis.targetModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1587 | <code>                modelSizeBytes: payload.modelSizeBytes &#124;&#124; payload.sizeBytes &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1588 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1589 | <code>        if (this.platform === 'win32' &amp;&amp; runtimeMode === 'native') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1590 | <code>            diagnosis.runtime.modelCompatibility = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1591 | <code>            diagnosis.runtimeUpgradeFeasibility = { ok: true, severity: '', reason: '' };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1592 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1593 | <code>            diagnosis.runtime.modelCompatibility = evaluateRuntimeModelCompatibility(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1594 | <code>                diagnosis.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1595 | <code>                diagnosis.modelRequirements</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1596 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1597 | <code>            diagnosis.runtimeUpgradeFeasibility = evaluateRuntimeUpgradeFeasibility(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1598 | <code>                diagnosis.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1599 | <code>                diagnosis.modelRequirements</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1600 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1601 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1602 | <code>        if (this.platform === 'win32' &amp;&amp; runtimeMode === 'native') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1603 | <code>            diagnosis.modelHardwareFit = { ok: true, severity: '', reason: '' };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1604 | <code>            diagnosis.launchProfile = { adjusted: false, notes: [] };</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1605 | <code>        } else {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1606 | <code>            diagnosis.modelHardwareFit = evaluateLocalModelHardwareFit(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1607 | <code>                diagnosis.runtime,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1608 | <code>                diagnosis.modelRequirements</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1609 | <code>            );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1610 | <code>            diagnosis.launchProfile = buildAutoLaunchProfile(diagnosis, payload);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1611 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1612 | <code>        const modelRuntimeCompatible = diagnosis.runtime?.modelCompatibility?.ok !== false;</code> | 声明局部标识符 `modelRuntimeCompatible`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1613 | <code>        diagnosis.recommendedVenvDir = modelRuntimeCompatible</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1614 | <code>            ? (diagnosis.runtime?.reusableVenvDir &#124;&#124; venvDir)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1615 | <code>            : venvDir;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1616 | <code>        diagnosis.installPlan = buildInstallPlan(diagnosis);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1617 | <code>        const hasUsableVllmRuntime = modelRuntimeCompatible &amp;&amp; Boolean(diagnosis.runtime?.vllmInstalled &#124;&#124; diagnosis.runtime?.reusableVenvDir);</code> | 声明局部标识符 `hasUsableVllmRuntime`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1618 | <code>        const serviceHasTargetModel = Boolean(</code> | 声明局部标识符 `serviceHasTargetModel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1619 | <code>            diagnosis.service?.ok &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1620 | <code>            diagnosis.targetModel &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1621 | <code>            Array.isArray(diagnosis.service?.modelIds) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1622 | <code>            diagnosis.service.modelIds.some((id) =&gt; String(id &#124;&#124; '').trim() === diagnosis.targetModel)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1623 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1624 | <code>        const serviceReadyForTarget = Boolean(diagnosis.service?.ok &amp;&amp; (!diagnosis.targetModel &#124;&#124; serviceHasTargetModel));</code> | 声明局部标识符 `serviceReadyForTarget`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1625 | <code>        diagnosis.ok = serviceReadyForTarget &#124;&#124; (</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1626 | <code>            diagnosis.installPlan.ok &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1627 | <code>            (diagnosis.runtime?.available &#124;&#124; diagnosis.runtime?.shellOk) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1628 | <code>            diagnosis.runtime?.pythonOk &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1629 | <code>            hasUsableVllmRuntime</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1630 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1631 | <code>        this.status = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1632 | <code>            ...this.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1633 | <code>            diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1634 | <code>            installPlan: diagnosis.installPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1635 | <code>            runtimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1636 | <code>            baseUrl: diagnosis.service?.baseUrl &#124;&#124; getBaseUrl({ host, port })</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1637 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>        return diagnosis;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1639 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1641 | <code>    appendLog(chunk) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1642 | <code>        const nextLines = splitOutputLines(chunk).map(clipLine);</code> | 声明局部标识符 `nextLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1643 | <code>        if (!nextLines.length) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1644 | <code>            return;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1645 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1646 | <code>        this.status.logLines.push(...nextLines);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1647 | <code>        if (this.status.logLines.length &gt; MAX_LOG_LINES) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1648 | <code>            this.status.logLines = this.status.logLines.slice(-MAX_LOG_LINES);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1649 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1650 | <code>        this.emit('status', this.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1651 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1652 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1653 | <code>    async start(payload = {}) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1654 | <code>        if (this.child &amp;&amp; this.status.status === 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1655 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1656 | <code>                ...this.getStatus(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1657 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1658 | <code>                error: '已有 vLLM 部署任务正在运行。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1659 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1660 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1661 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1662 | <code>        const diagnosis = await this.diagnose(payload);</code> | 声明局部标识符 `diagnosis`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1663 | <code>        const launchProfile = diagnosis.launchProfile &#124;&#124; buildAutoLaunchProfile(diagnosis, payload);</code> | 声明局部标识符 `launchProfile`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1664 | <code>        if (diagnosis.installPlan?.ok === false) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1665 | <code>            const blockers = diagnosis.installPlan.blockingSteps &#124;&#124; [];</code> | 声明局部标识符 `blockers`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1666 | <code>            const message = blockers.length</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1667 | <code>                ? `部署前检查未通过：${blockers.map((step) =&gt; step.title).join('；')}。`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1668 | <code>                : '部署前检查未通过。';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1669 | <code>            this.status = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1670 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1671 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1672 | <code>                running: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1673 | <code>                source: diagnosis.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1674 | <code>                runtimeMode: diagnosis.runtimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1675 | <code>                modelId: diagnosis.modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1676 | <code>                servedModelId: diagnosis.targetModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1677 | <code>                baseUrl: diagnosis.service?.baseUrl &#124;&#124; getBaseUrl({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1678 | <code>                    host: payload.host &#124;&#124; DEFAULT_HOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1679 | <code>                    port: payload.port &#124;&#124; DEFAULT_PORT</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1680 | <code>                }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1681 | <code>                startedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1682 | <code>                endedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1683 | <code>                exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1684 | <code>                diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1685 | <code>                installPlan: diagnosis.installPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1686 | <code>                logLines: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1687 | <code>                    `[AILIS vLLM] ${message}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1688 | <code>                    ...blockers.map((step) =&gt; `[AILIS vLLM] ${step.title}: ${step.description}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1689 | <code>                ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1690 | <code>                failure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1691 | <code>                    code: 'preflight_blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1692 | <code>                    message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1693 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1694 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1695 | <code>            this.emit('status', this.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1696 | <code>            return this.getStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1697 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1698 | <code>        const effectiveVenvDir = payload.venvDir &#124;&#124; diagnosis.recommendedVenvDir &#124;&#124; diagnosis.runtime?.reusableVenvDir &#124;&#124; '';</code> | 声明局部标识符 `effectiveVenvDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1699 | <code>        const command = buildDeployCommand({</code> | 声明局部标识符 `command`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1700 | <code>            projectRoot: this.projectRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1701 | <code>            platform: this.platform,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1702 | <code>            runtimeMode: diagnosis.runtimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1703 | <code>            source: payload.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1704 | <code>            model: payload.modelId &#124;&#124; payload.model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1705 | <code>            venvDir: effectiveVenvDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1706 | <code>            downloadDir: payload.downloadDir &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1707 | <code>            dtype: payload.dtype &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1708 | <code>            maxModelLen: payload.maxModelLen &#124;&#124; launchProfile.maxModelLen &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1709 | <code>            cpuOffloadGb: payload.cpuOffloadGb &#124;&#124; payload.cpuOffloadGB &#124;&#124; launchProfile.cpuOffloadGb &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1710 | <code>            swapSpace: payload.swapSpace &#124;&#124; payload.swapSpaceGb &#124;&#124; launchProfile.swapSpace &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1711 | <code>            gpuMemoryUtilization: payload.gpuMemoryUtilization &#124;&#124; launchProfile.gpuMemoryUtilization &#124;&#124; '',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1712 | <code>            pipIndexUrl: payload.pipIndexUrl &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1713 | <code>            pipExtraIndexUrl: payload.pipExtraIndexUrl &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1714 | <code>            servedModelName: payload.servedModelName &#124;&#124; payload.servedModelId &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1715 | <code>            host: payload.host &#124;&#124; DEFAULT_HOST,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1716 | <code>            port: payload.port &#124;&#124; DEFAULT_PORT,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1717 | <code>            readyTimeoutSec: payload.readyTimeoutSec &#124;&#124; DEFAULT_READY_TIMEOUT_SEC,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1718 | <code>            vllmPackage: payload.vllmPackage &#124;&#124; payload.package &#124;&#124; 'auto',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1719 | <code>            trustRemoteCode: payload.trustRemoteCode === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1720 | <code>            installWsl: payload.installWsl !== false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1721 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1722 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1723 | <code>        this.status = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1724 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1725 | <code>            status: 'running',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1726 | <code>            running: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1727 | <code>            runtimeMode: command.runtimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1728 | <code>            source: command.source,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1729 | <code>            modelId: command.modelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1730 | <code>            servedModelId: command.servedModelId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1731 | <code>            baseUrl: command.baseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1732 | <code>            startedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1733 | <code>            endedAt: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1734 | <code>            exitCode: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1735 | <code>            failure: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1736 | <code>            diagnosis,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1737 | <code>            installPlan: diagnosis.installPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1738 | <code>            logLines: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1739 | <code>                `[AILIS vLLM] 自动部署已启动：${command.modelId}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1740 | <code>                `[AILIS vLLM] 来源：${command.source}，API Base：${command.baseUrl}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1741 | <code>                `[AILIS vLLM] vLLM 运行时：${command.venvDir}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1742 | <code>                `[AILIS vLLM] vLLM 安装策略：${command.vllmPackage}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1743 | <code>                `[AILIS vLLM] pip 镜像：${command.pipIndexUrl &#124;&#124; '默认 PyPI'}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1744 | <code>                ...(launchProfile.adjusted</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1745 | <code>                    ? [`[AILIS vLLM] 自动启动策略：${launchProfile.reason} ${launchProfile.notes.join('，')}`]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1746 | <code>                    : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1747 | <code>                ...(diagnosis.runtime?.modelCompatibility?.ok === false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1748 | <code>                    ? [`[AILIS vLLM] 当前运行时需要升级：${diagnosis.runtime.modelCompatibility.reason}`]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1749 | <code>                    : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1750 | <code>            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1751 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1752 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1753 | <code>        const child = this.processFactory(command.command, command.args, {</code> | 声明局部标识符 `child`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1754 | <code>            cwd: command.cwd,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1755 | <code>            windowsHide: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1756 | <code>            env: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1757 | <code>                ...process.env,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1758 | <code>                AILIS_VLLM_UI_DEPLOY: '1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1759 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1760 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1761 | <code>        this.child = child;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1763 | <code>        child.stdout?.on?.('data', (chunk) =&gt; this.appendLog(chunk));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1764 | <code>        child.stderr?.on?.('data', (chunk) =&gt; this.appendLog(chunk));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1765 | <code>        child.on?.('error', (error) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1766 | <code>            this.status = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1767 | <code>                ...this.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1768 | <code>                ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1769 | <code>                status: 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1770 | <code>                running: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1771 | <code>                endedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1772 | <code>                failure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1773 | <code>                    code: 'spawn_failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1774 | <code>                    message: error.message &#124;&#124; String(error)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1775 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1776 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1777 | <code>            this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1778 | <code>            this.emit('status', this.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1779 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1780 | <code>        child.on?.('exit', (code) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1781 | <code>            const success = Number(code) === 0;</code> | 声明局部标识符 `success`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1782 | <code>            const nextLogLines = success</code> | 声明局部标识符 `nextLogLines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1783 | <code>                ? this.status.logLines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1784 | <code>                : [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1785 | <code>                    ...this.status.logLines,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1786 | <code>                    ...readDetachedVllmLogLines(this.projectRoot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1787 | <code>                ].slice(-MAX_LOG_LINES);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1788 | <code>            this.status = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1789 | <code>                ...this.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1790 | <code>                ok: success,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1791 | <code>                status: success ? 'ready' : 'failed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1792 | <code>                running: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1793 | <code>                endedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1794 | <code>                exitCode: Number.isFinite(Number(code)) ? Number(code) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1795 | <code>                logLines: nextLogLines,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1796 | <code>                failure: success ? null : summarizeFailure(nextLogLines, code)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1797 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1798 | <code>            if (success) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1799 | <code>                this.status.logLines.push(`[AILIS vLLM] 部署完成：${this.status.baseUrl}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1800 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1801 | <code>            this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1802 | <code>            this.emit('status', this.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1803 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1804 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1805 | <code>        this.emit('status', this.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1806 | <code>        return this.getStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1807 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1808 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1809 | <code>    cancel() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1810 | <code>        if (!this.child &#124;&#124; this.status.status !== 'running') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1811 | <code>            return this.getStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1812 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1813 | <code>        try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1814 | <code>            this.child.kill();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1815 | <code>        } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1816 | <code>            // The child may have already exited.</code> | 注释：记录作者意图、约束、分段说明或维护提示；不会直接执行。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1817 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1818 | <code>        this.status = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1819 | <code>            ...this.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1820 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1821 | <code>            status: 'cancelled',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1822 | <code>            running: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1823 | <code>            endedAt: new Date().toISOString(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1824 | <code>            failure: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1825 | <code>                code: 'cancelled',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1826 | <code>                message: '用户已取消 vLLM 自动部署任务。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1827 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1828 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1829 | <code>        this.child = null;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1830 | <code>        this.emit('status', this.getStatus());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1831 | <code>        return this.getStatus();</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1832 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1834 | <code>    getStatus() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1835 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1836 | <code>            ...this.status,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1837 | <code>            logLines: [...(this.status.logLines &#124;&#124; [])]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1838 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1839 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1840 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1842 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1843 | <code>    VllmLocalDeployer,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1844 | <code>    buildNativeRuntimeProbeScript,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1845 | <code>    buildRuntimeProbeScript,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1846 | <code>    buildAutoLaunchProfile,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1847 | <code>    buildInstallPlan,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1848 | <code>    buildDeployCommand,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1849 | <code>    estimateRequiredDownloadBytes,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1850 | <code>    getBaseUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1851 | <code>    getReusableVenvCandidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1852 | <code>    inspectDownloadTarget,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1853 | <code>    normalizeRuntimeMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1854 | <code>    normalizeVllmPackage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1855 | <code>    normalizePathForWslpath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1856 | <code>    parseJsonSafe,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1857 | <code>    summarizeFailure</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“AILIS 仓库组成文件；需结合目录、引用关系和逐行讲解理解其职责。”这一文件职责。 |
| 1858 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
