# electron/ailis-artifact-tools-file-adapters.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`source-code`
- 原始行数：1098
- SHA-256：`81ff1cdf28c363ecbff05b35f94c10493dc748b5b3570e5f7c8629caff0c1b7e`
- 可运行副本：[打开源文件](../../../source/electron/ailis-artifact-tools-file-adapters.cjs)
- 依赖：`fs`、`fs/promises`、`path`、`os`、`child_process`、`util`、`./ailis-artifact-tools-model.cjs`、`importlib.util`、`json`、`sys`、`pathlib`、`pypdf`、`pdfplumber`、`re`、`zipfile`、`xml.etree.ElementTree`、`PIL`
- 主要符号：`fs`、`fsp`、`path`、`os`、`execFileAsync`、`IMAGE_FORMATS`、`FILE_ADAPTER_FORMATS`、`createDiagnostic`、`toAbsolutePath`、`normalizeHex`、`raw`、`clampNumber`、`numeric`、`getBundledRuntimeRoot`、`getArtifactPython`、`candidates`、`buildWorkerEnv`、`nativeBin`、`env`、`getPdftoppmCommand`、`root`、`runPythonJson`、`python`、`compactText`、`text`、`normalizeDiagnostics`、`normalizeInspection`、`PDF_INSPECT_SCRIPT`、`diag`、`OOXML_INSPECT_SCRIPT`、`local`、`parse_xml`、`elem_text`、`read_entry`、`read_rels`、`IMAGE_INSPECT_SCRIPT`、`inspectPdfArtifact`、`sourcePath`、`inspectOoxmlArtifact`、`inspectImageArtifact`、`inspectFileArtifact`、`format`、`inspection`、`pushCandidate`、`buildSearchCandidates`、`structure`、`candidateMatches`、`normalizedKind`、`candidateKind`、`kindOk`、`expected`、`actual`、`normalizedQuery`、`haystack`、`indexFileArtifact`、`searchFileArtifact`、`kind`、`query`、`fillRgb`、`limit`、`matches`、`STRUCTURE_RENDER_SCRIPT`、`IMAGE_RENDER_SCRIPT`、`renderPdfToPng`、`caseId`、`outputDir`、`renderDir`、`page`、`prefix`、`outputPath`、`args`、`visual`、`stat`、`fallbackInspection`、`renderStructurePng`、`mode`、`payloadPath`、`payload`、`metadata`、`renderImageToPng`、`renderFileArtifactPreview`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const fs = require('fs');</code> | 导入依赖 `fs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>const fsp = require('fs/promises');</code> | 导入依赖 `fs/promises`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 3 | <code>const path = require('path');</code> | 导入依赖 `path`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4 | <code>const os = require('os');</code> | 导入依赖 `os`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 5 | <code>const { execFile } = require('child_process');</code> | 导入依赖 `child_process`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 6 | <code>const { promisify } = require('util');</code> | 导入依赖 `util`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 9 | <code>    createArtifactDiagnostic,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 10 | <code>    normalizeFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 11 | <code>} = require('./ailis-artifact-tools-model.cjs');</code> | 导入依赖 `./ailis-artifact-tools-model.cjs`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 12 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 13 | <code>const execFileAsync = promisify(execFile);</code> | 声明局部标识符 `execFileAsync`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 14 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 15 | <code>const IMAGE_FORMATS = new Set(['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'bmp', 'gif']);</code> | 声明局部标识符 `IMAGE_FORMATS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 16 | <code>const FILE_ADAPTER_FORMATS = new Set(['pdf', 'docx', 'pptx', ...IMAGE_FORMATS]);</code> | 声明局部标识符 `FILE_ADAPTER_FORMATS`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 17 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 18 | <code>function createDiagnostic(code, severity, message, details = {}) {</code> | 定义函数 `createDiagnostic`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 19 | <code>    return createArtifactDiagnostic({ code, severity, message, details });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 20 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 21 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 22 | <code>function toAbsolutePath(sourcePath = '', repoRoot = process.cwd()) {</code> | 定义函数 `toAbsolutePath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 23 | <code>    if (!sourcePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 24 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 25 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>    return path.isAbsolute(sourcePath) ? sourcePath : path.resolve(repoRoot, sourcePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 27 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 28 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 29 | <code>function normalizeHex(value = '') {</code> | 定义函数 `normalizeHex`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 30 | <code>    const raw = String(value &#124;&#124; '').replace(/^#/, '').trim().toUpperCase();</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 31 | <code>    if (!raw) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 32 | <code>        return '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>    if (raw.length === 8 &amp;&amp; raw.startsWith('FF')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 35 | <code>        return raw.slice(2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 36 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 37 | <code>    if (raw.length === 6) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 38 | <code>        return raw;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 39 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 40 | <code>    return raw.slice(-6);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 41 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 42 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 43 | <code>function clampNumber(value, fallback, min, max) {</code> | 定义函数 `clampNumber`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 44 | <code>    const numeric = Number(value);</code> | 声明局部标识符 `numeric`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 45 | <code>    if (!Number.isFinite(numeric)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 46 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>    return Math.max(min, Math.min(max, numeric));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 49 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 50 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 51 | <code>function getBundledRuntimeRoot() {</code> | 定义函数 `getBundledRuntimeRoot`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 52 | <code>    return path.join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 53 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 54 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 55 | <code>function getArtifactPython() {</code> | 定义函数 `getArtifactPython`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 56 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 57 | <code>        process.env.AILIS_ARTIFACT_PYTHON,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 58 | <code>        path.join(getBundledRuntimeRoot(), 'python', process.platform === 'win32' ? 'python.exe' : 'bin/python'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 59 | <code>        process.env.PYTHON,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 60 | <code>        process.platform === 'win32' ? 'python.exe' : 'python3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 61 | <code>        'python'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 62 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 63 | <code>    return candidates.find((candidate) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 64 | <code>        if (candidate.includes(path.sep) &#124;&#124; candidate.includes('/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 65 | <code>            return fs.existsSync(candidate);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 66 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 67 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 68 | <code>    }) &#124;&#124; 'python';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 69 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 71 | <code>function buildWorkerEnv() {</code> | 定义函数 `buildWorkerEnv`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 72 | <code>    const nativeBin = path.join(getBundledRuntimeRoot(), 'bin');</code> | 声明局部标识符 `nativeBin`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 73 | <code>    const env = { ...process.env };</code> | 声明局部标识符 `env`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 74 | <code>    if (fs.existsSync(nativeBin)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 75 | <code>        env.PATH = `${nativeBin}${path.delimiter}${env.PATH &#124;&#124; ''}`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 76 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    return env;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 78 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>function getPdftoppmCommand() {</code> | 定义函数 `getPdftoppmCommand`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 81 | <code>    const root = getBundledRuntimeRoot();</code> | 声明局部标识符 `root`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 82 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 83 | <code>        process.env.AILIS_ARTIFACT_PDFTOPPM,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 84 | <code>        path.join(root, 'native', 'poppler', 'Library', 'bin', process.platform === 'win32' ? 'pdftoppm.exe' : 'pdftoppm'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 85 | <code>        'pdftoppm'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 86 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 87 | <code>    return candidates.find((candidate) =&gt; {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 88 | <code>        if (candidate.includes(path.sep) &#124;&#124; candidate.includes('/')) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 89 | <code>            return fs.existsSync(candidate);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 90 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 92 | <code>    }) &#124;&#124; 'pdftoppm';</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 93 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 94 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 95 | <code>async function runPythonJson(script, args = [], options = {}) {</code> | 定义函数 `runPythonJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 96 | <code>    const python = options.python &#124;&#124; getArtifactPython();</code> | 声明局部标识符 `python`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 97 | <code>    const { stdout } = await execFileAsync(python, ['-c', script, ...args.map((arg) =&gt; String(arg ?? ''))], {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 98 | <code>        cwd: options.cwd &#124;&#124; process.cwd(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 99 | <code>        env: buildWorkerEnv(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 100 | <code>        maxBuffer: options.maxBuffer &#124;&#124; 16 * 1024 * 1024,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 101 | <code>        timeout: clampNumber(options.timeoutMs &#124;&#124; options.timeout_ms, 60000, 5000, 180000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 102 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 103 | <code>    return JSON.parse(stdout);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 104 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 105 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 106 | <code>function compactText(value = '', limit = 240) {</code> | 定义函数 `compactText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 107 | <code>    const text = String(value &#124;&#124; '').replace(/\s+/g, ' ').trim();</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 108 | <code>    if (text.length &lt;= limit) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 109 | <code>        return text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 110 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 111 | <code>    return `${text.slice(0, limit - 3)}...`;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 112 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 113 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 114 | <code>function normalizeDiagnostics(diagnostics = []) {</code> | 定义函数 `normalizeDiagnostics`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 115 | <code>    return diagnostics.map((diagnostic) =&gt; createDiagnostic(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 116 | <code>        diagnostic.code &#124;&#124; 'artifact_file_diagnostic',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 117 | <code>        diagnostic.severity &#124;&#124; 'info',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 118 | <code>        diagnostic.message &#124;&#124; 'Artifact file diagnostic.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 119 | <code>        diagnostic.details &#124;&#124; {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 120 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 123 | <code>function normalizeInspection(raw = {}, format = '', sourcePath = '') {</code> | 定义函数 `normalizeInspection`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 124 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 125 | <code>        format: raw.format &#124;&#124; format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 126 | <code>        adapterId: raw.adapterId &#124;&#124; format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 127 | <code>        sourcePath: raw.sourcePath &#124;&#124; sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 128 | <code>        structure: raw.structure &#124;&#124; {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 129 | <code>        view: raw.view &#124;&#124; null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 130 | <code>        text: String(raw.text &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 131 | <code>        diagnostics: normalizeDiagnostics(raw.diagnostics &#124;&#124; []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 132 | <code>        observation: raw.observation &#124;&#124; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 133 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 134 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>const PDF_INSPECT_SCRIPT = String.raw`</code> | 声明局部标识符 `PDF_INSPECT_SCRIPT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 137 | <code>import importlib.util</code> | 导入依赖 `importlib.util`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 138 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 139 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 140 | <code>from pathlib import Path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 141 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 142 | <code>source_path = Path(sys.argv[1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 143 | <code>max_text_chars = int(float(sys.argv[2] or "24000"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 144 | <code>diagnostics = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 145 | <code>pages = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 146 | <code>text_parts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 147 | <code>metadata = {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 148 | <code>has_pdfplumber = importlib.util.find_spec("pdfplumber") is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 149 | <code>has_pypdf = importlib.util.find_spec("pypdf") is not None</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 150 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 151 | <code>def diag(code, severity, message, details=None):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 152 | <code>    diagnostics.append({"code": code, "severity": severity, "message": message, "details": details or {}})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 154 | <code>if has_pypdf:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 155 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 156 | <code>        from pypdf import PdfReader</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 157 | <code>        reader = PdfReader(str(source_path))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 158 | <code>        metadata = {str(k).lstrip("/"): str(v) for k, v in (reader.metadata or {}).items()}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 159 | <code>        for index, page in enumerate(reader.pages, start=1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 160 | <code>            media = page.mediabox</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 161 | <code>            text = page.extract_text() or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 162 | <code>            annots = page.get("/Annots") or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 163 | <code>            image_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 164 | <code>            try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 165 | <code>                resources = page.get("/Resources") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 166 | <code>                xobjects = resources.get("/XObject") or {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 167 | <code>                for obj in xobjects.values():</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 168 | <code>                    resolved = obj.get_object()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 169 | <code>                    if resolved.get("/Subtype") == "/Image":</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 170 | <code>                        image_count += 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 171 | <code>            except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 172 | <code>                pass</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 173 | <code>            text_parts.append(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 174 | <code>            pages.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 175 | <code>                "index": index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 176 | <code>                "width": float(media.width),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 177 | <code>                "height": float(media.height),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 178 | <code>                "rotation": int(page.get("/Rotate") or 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 179 | <code>                "textLength": len(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 180 | <code>                "wordCount": len(text.split()),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 181 | <code>                "imageCount": image_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 182 | <code>                "annotationCount": len(annots),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 183 | <code>                "sampleText": text[:700],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 184 | <code>                "spans": []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 185 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 186 | <code>    except Exception as exc:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 187 | <code>        diag("pdf_pypdf_extract_failed", "warning", f"pypdf extraction failed: {exc}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 188 | <code>else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 189 | <code>    diag("pdf_pypdf_missing", "warning", "pypdf is not available; PDF structure extraction is limited.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>if has_pdfplumber:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 192 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 193 | <code>        import pdfplumber</code> | 导入依赖 `pdfplumber`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 194 | <code>        with pdfplumber.open(str(source_path)) as pdf:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 195 | <code>            if not pages:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 196 | <code>                pages = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 197 | <code>            for index, page in enumerate(pdf.pages, start=1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 198 | <code>                words = page.extract_words()[:220]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 199 | <code>                text = page.extract_text() or ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 200 | <code>                while len(pages) &lt; index:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 201 | <code>                    pages.append({"index": len(pages) + 1, "width": page.width, "height": page.height, "rotation": 0, "textLength": 0, "wordCount": 0, "imageCount": 0, "annotationCount": 0, "sampleText": "", "spans": []})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 202 | <code>                pages[index - 1].update({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 203 | <code>                    "width": float(page.width),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 204 | <code>                    "height": float(page.height),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 205 | <code>                    "textLength": len(text) or pages[index - 1].get("textLength", 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 206 | <code>                    "wordCount": len(words) or pages[index - 1].get("wordCount", 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 207 | <code>                    "imageCount": len(page.images),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 208 | <code>                    "charCount": len(page.chars),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 209 | <code>                    "spans": [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 210 | <code>                        "text": word.get("text", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 211 | <code>                        "x0": round(float(word.get("x0", 0)), 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 212 | <code>                        "top": round(float(word.get("top", 0)), 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 213 | <code>                        "x1": round(float(word.get("x1", 0)), 2),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 214 | <code>                        "bottom": round(float(word.get("bottom", 0)), 2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 215 | <code>                    } for word in words[:80]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 216 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>                if not text_parts:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 218 | <code>                    text_parts.append(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 219 | <code>    except Exception as exc:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 220 | <code>        diag("pdf_pdfplumber_extract_failed", "warning", f"pdfplumber extraction failed: {exc}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 222 | <code>text = "\n".join(part for part in text_parts if part)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 223 | <code>if not text.strip():</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>    diag("pdf_text_layer_missing", "warning", "PDF text-layer extraction returned no text; OCR/render fallback may be needed.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 225 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 226 | <code>print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 227 | <code>    "format": "pdf",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 228 | <code>    "adapterId": "pdf",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 229 | <code>    "sourcePath": str(source_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 230 | <code>    "structure": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 231 | <code>        "pageCount": len(pages),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 232 | <code>        "pages": pages,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 233 | <code>        "metadata": metadata,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 234 | <code>        "textSpanCount": sum(len(page.get("spans", [])) for page in pages),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 235 | <code>        "hasTextLayer": bool(text.strip())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 236 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>    "view": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 238 | <code>        "pages": [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 239 | <code>            "index": page["index"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 240 | <code>            "size": [page.get("width", 0), page.get("height", 0)],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 241 | <code>            "wordCount": page.get("wordCount", 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 242 | <code>            "sampleText": page.get("sampleText", "")[:240]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 243 | <code>        } for page in pages[:20]]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 244 | <code>    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 245 | <code>    "text": text[:max_text_chars],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 246 | <code>    "diagnostics": diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 247 | <code>}, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 248 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 249 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 250 | <code>const OOXML_INSPECT_SCRIPT = String.raw`</code> | 声明局部标识符 `OOXML_INSPECT_SCRIPT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 251 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 252 | <code>import re</code> | 导入依赖 `re`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 253 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 254 | <code>import zipfile</code> | 导入依赖 `zipfile`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 255 | <code>import xml.etree.ElementTree as ET</code> | 导入依赖 `xml.etree.ElementTree`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 256 | <code>from pathlib import Path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 257 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 258 | <code>source_path = Path(sys.argv[1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 259 | <code>format_name = sys.argv[2]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 260 | <code>max_text_chars = int(float(sys.argv[3] or "24000"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 261 | <code>diagnostics = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 262 | <code>NS = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 263 | <code>    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 264 | <code>    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 265 | <code>    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 266 | <code>    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 267 | <code>    "rel": "http://schemas.openxmlformats.org/package/2006/relationships"</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 268 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 270 | <code>def diag(code, severity, message, details=None):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 271 | <code>    diagnostics.append({"code": code, "severity": severity, "message": message, "details": details or {}})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 272 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 273 | <code>def local(tag):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 274 | <code>    return tag.rsplit("}", 1)[-1] if "}" in tag else tag</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>def parse_xml(data):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 277 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 278 | <code>        return ET.fromstring(data)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>    except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 280 | <code>        return None</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>def elem_text(elem):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 283 | <code>    if elem is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 284 | <code>        return ""</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 285 | <code>    values = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 286 | <code>    for child in elem.iter():</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 287 | <code>        if local(child.tag) == "t" and child.text:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 288 | <code>            values.append(child.text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 289 | <code>    return "".join(values)</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 290 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 291 | <code>def read_entry(z, name):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 292 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 293 | <code>        return z.read(name).decode("utf-8", "replace")</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 294 | <code>    except KeyError:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 295 | <code>        return ""</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 296 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 297 | <code>def read_rels(z, names):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 298 | <code>    rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 299 | <code>    for name in names:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 300 | <code>        if not name.endswith(".rels"):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 301 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 302 | <code>        root = parse_xml(read_entry(z, name))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 303 | <code>        if root is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 304 | <code>            continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 305 | <code>        for rel in root:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 306 | <code>            rows.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 307 | <code>                "source": name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 308 | <code>                "id": rel.attrib.get("Id", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 309 | <code>                "type": rel.attrib.get("Type", "").split("/")[-1],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 310 | <code>                "target": rel.attrib.get("Target", ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 311 | <code>                "targetMode": rel.attrib.get("TargetMode", "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 312 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    return rows</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 314 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 315 | <code>with zipfile.ZipFile(source_path) as z:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 316 | <code>    names = z.namelist()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 317 | <code>    rels = read_rels(z, names)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 318 | <code>    media = [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 319 | <code>        "part": name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 320 | <code>        "extension": Path(name).suffix.lower().lstrip("."),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 321 | <code>        "bytes": z.getinfo(name).file_size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 322 | <code>    } for name in names if re.search(r"/media/", name)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 323 | <code>    content_types = read_entry(z, "[Content_Types].xml")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 324 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 325 | <code>    if format_name == "docx":</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 326 | <code>        document_xml = read_entry(z, "word/document.xml")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 327 | <code>        root = parse_xml(document_xml)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 328 | <code>        if root is None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 329 | <code>            diag("docx_document_part_missing", "error", "DOCX archive does not contain a readable word/document.xml.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 330 | <code>            paragraphs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 331 | <code>            tables = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 332 | <code>            doc_text = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 333 | <code>        else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 334 | <code>            paragraphs = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 335 | <code>            for idx, para in enumerate(root.findall(".//w:p", NS), start=1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 336 | <code>                text = elem_text(para)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 337 | <code>                if not text and len(paragraphs) &gt;= 100:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 338 | <code>                    continue</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 339 | <code>                style = ""</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 340 | <code>                style_el = para.find("./w:pPr/w:pStyle", NS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 341 | <code>                if style_el is not None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 342 | <code>                    style = style_el.attrib.get("{%s}val" % NS["w"], "")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 343 | <code>                paragraphs.append({"index": idx, "style": style, "text": text[:900], "runCount": len(para.findall(".//w:r", NS))})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 344 | <code>            tables = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 345 | <code>            for tidx, tbl in enumerate(root.findall(".//w:tbl", NS), start=1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 346 | <code>                rows = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 347 | <code>                for tr in tbl.findall("./w:tr", NS):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 348 | <code>                    rows.append([elem_text(tc) for tc in tr.findall("./w:tc", NS)])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 349 | <code>                width = max([len(row) for row in rows] or [0])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 350 | <code>                tables.append({"index": tidx, "rowCount": len(rows), "columnCount": width, "rows": rows[:10]})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 351 | <code>            doc_text = "\n".join(p["text"] for p in paragraphs if p["text"])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 353 | <code>        comments = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 354 | <code>        comments_root = parse_xml(read_entry(z, "word/comments.xml"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 355 | <code>        if comments_root is not None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 356 | <code>            for comment in comments_root.findall(".//w:comment", NS):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 357 | <code>                comments.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 358 | <code>                    "id": comment.attrib.get("{%s}id" % NS["w"], ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 359 | <code>                    "author": comment.attrib.get("{%s}author" % NS["w"], ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 360 | <code>                    "date": comment.attrib.get("{%s}date" % NS["w"], ""),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 361 | <code>                    "text": elem_text(comment)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 362 | <code>                })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 364 | <code>        header_footer_parts = [name for name in names if re.match(r"word/(header&#124;footer)\d+\.xml$", name)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 365 | <code>        header_footer_text = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 366 | <code>        for name in header_footer_parts:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 367 | <code>            xml = read_entry(z, name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 368 | <code>            header_footer_text.append({"part": name, "text": elem_text(parse_xml(xml))})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 369 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 370 | <code>        text = "\n".join([doc_text, *[c["text"] for c in comments], *[p["text"] for p in header_footer_text]]).strip()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 371 | <code>        print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 372 | <code>            "format": "docx",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 373 | <code>            "adapterId": "docx",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 374 | <code>            "sourcePath": str(source_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 375 | <code>            "structure": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 376 | <code>                "partCount": len(names),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 377 | <code>                "paragraphCount": len(paragraphs),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 378 | <code>                "tableCount": len(tables),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 379 | <code>                "textRunCount": len(re.findall(r"&lt;w:t\b", document_xml)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 380 | <code>                "commentCount": len(comments),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 381 | <code>                "imageCount": len(media),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 382 | <code>                "relationshipCount": len(rels),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 383 | <code>                "headerFooterCount": len(header_footer_parts),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 384 | <code>                "paragraphs": paragraphs[:120],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 385 | <code>                "tables": tables,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 386 | <code>                "comments": comments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 387 | <code>                "images": media,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 388 | <code>                "relationships": rels[:240],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 389 | <code>                "headersFooters": header_footer_text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 390 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 391 | <code>            "view": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 392 | <code>                "paragraphs": paragraphs[:20],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 393 | <code>                "tables": tables[:8],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 394 | <code>                "comments": comments[:20],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 395 | <code>                "images": media[:20]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 396 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 397 | <code>            "text": text[:max_text_chars],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 398 | <code>            "diagnostics": diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 399 | <code>        }, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 400 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 401 | <code>        presentation_xml = read_entry(z, "ppt/presentation.xml")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 402 | <code>        presentation_root = parse_xml(presentation_xml)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 403 | <code>        slide_size = {"width": 0, "height": 0}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 404 | <code>        if presentation_root is not None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 405 | <code>            size_el = presentation_root.find(".//p:sldSz", NS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 406 | <code>            if size_el is not None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 407 | <code>                slide_size = {"width": int(size_el.attrib.get("cx", "0") or 0), "height": int(size_el.attrib.get("cy", "0") or 0)}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 408 | <code>        slide_names = sorted([name for name in names if re.match(r"ppt/slides/slide\d+\.xml$", name)], key=lambda n: int(re.search(r"slide(\d+)\.xml$", n).group(1)))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 409 | <code>        slides = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 410 | <code>        text_parts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 411 | <code>        image_total = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 412 | <code>        table_total = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 413 | <code>        for idx, name in enumerate(slide_names, start=1):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 414 | <code>            xml = read_entry(z, name)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 415 | <code>            root = parse_xml(xml)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 416 | <code>            texts = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 417 | <code>            if root is not None:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 418 | <code>                texts = [el.text or "" for el in root.findall(".//a:t", NS)]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 419 | <code>                shape_count = len(root.findall(".//p:sp", NS))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 420 | <code>                picture_count = len(root.findall(".//p:pic", NS))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 421 | <code>                table_count = len(root.findall(".//a:tbl", NS))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 422 | <code>            else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 423 | <code>                shape_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 424 | <code>                picture_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 425 | <code>                table_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 426 | <code>            slide_rels_name = name.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 427 | <code>            slide_rels = [rel for rel in rels if rel["source"] == slide_rels_name]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 428 | <code>            slide_images = [rel for rel in slide_rels if rel["type"] == "image"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 429 | <code>            image_total += max(picture_count, len(slide_images))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 430 | <code>            table_total += table_count</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 431 | <code>            text = "\n".join(texts)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 432 | <code>            text_parts.append(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 433 | <code>            slides.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 434 | <code>                "index": idx,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 435 | <code>                "part": name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 436 | <code>                "text": text[:1200],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 437 | <code>                "texts": texts,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 438 | <code>                "shapeCount": shape_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 439 | <code>                "pictureCount": picture_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 440 | <code>                "tableCount": table_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 441 | <code>                "relationshipCount": len(slide_rels),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 442 | <code>                "imageRelationships": slide_images</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 443 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>        if not slides:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 445 | <code>            diag("pptx_slides_missing", "error", "PPTX archive does not contain ppt/slides/slide*.xml parts.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 446 | <code>        text = "\n".join(part for part in text_parts if part)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 447 | <code>        print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 448 | <code>            "format": "pptx",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 449 | <code>            "adapterId": "pptx",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 450 | <code>            "sourcePath": str(source_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 451 | <code>            "structure": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 452 | <code>                "partCount": len(names),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 453 | <code>                "slideCount": len(slides),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 454 | <code>                "slideSize": slide_size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 455 | <code>                "slides": slides,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 456 | <code>                "imageCount": image_total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 457 | <code>                "mediaCount": len(media),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 458 | <code>                "tableCount": table_total,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 459 | <code>                "relationshipCount": len(rels),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 460 | <code>                "media": media,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 461 | <code>                "relationships": rels[:260]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 462 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 463 | <code>            "view": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 464 | <code>                "slides": [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 465 | <code>                    "index": slide["index"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 466 | <code>                    "texts": slide["texts"][:12],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 467 | <code>                    "shapeCount": slide["shapeCount"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 468 | <code>                    "pictureCount": slide["pictureCount"],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 469 | <code>                    "tableCount": slide["tableCount"]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 470 | <code>                } for slide in slides[:60]],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 471 | <code>                "media": media[:30]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 472 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 473 | <code>            "text": text[:max_text_chars],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 474 | <code>            "diagnostics": diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 475 | <code>        }, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 476 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 477 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 478 | <code>const IMAGE_INSPECT_SCRIPT = String.raw`</code> | 声明局部标识符 `IMAGE_INSPECT_SCRIPT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 479 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 480 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 481 | <code>from pathlib import Path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 482 | <code>from PIL import Image, ImageStat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 483 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 484 | <code>source_path = Path(sys.argv[1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 485 | <code>diagnostics = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 486 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 487 | <code>def diag(code, severity, message, details=None):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 488 | <code>    diagnostics.append({"code": code, "severity": severity, "message": message, "details": details or {}})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 489 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 490 | <code>with Image.open(source_path) as image:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 491 | <code>    image.load()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 492 | <code>    width, height = image.size</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 493 | <code>    mode = image.mode</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 494 | <code>    fmt = (image.format or source_path.suffix.lstrip(".")).lower()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 495 | <code>    exif_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 496 | <code>    try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 497 | <code>        exif_count = len(image.getexif() or {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 498 | <code>    except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 499 | <code>        exif_count = 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 500 | <code>    sample = image.convert("RGBA")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 501 | <code>    sample.thumbnail((160, 160))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 502 | <code>    pixels = list(sample.getdata())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 503 | <code>    first = pixels[0] if pixels else (0, 0, 0, 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 504 | <code>    changed = sum(1 for px in pixels if px != first)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 505 | <code>    non_blank_ratio = changed / max(1, len(pixels))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 506 | <code>    colors = sample.getcolors(maxcolors=160 * 160) or []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 507 | <code>    colors = sorted(colors, reverse=True)[:10]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 508 | <code>    dominant = [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 509 | <code>        "count": count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 510 | <code>        "rgb": "%02X%02X%02X" % color[:3],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 511 | <code>        "alpha": color[3]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 512 | <code>    } for count, color in colors]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 513 | <code>    stat = ImageStat.Stat(sample.convert("RGB"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 514 | <code>    blank = len(colors) &lt;= 1 or non_blank_ratio &lt; 0.001</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 515 | <code>    if blank:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 516 | <code>        diag("image_appears_blank", "warning", "Image sampled pixels appear blank or nearly uniform.")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 517 | <code>    print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 518 | <code>        "format": fmt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 519 | <code>        "adapterId": "image",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 520 | <code>        "sourcePath": str(source_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 521 | <code>        "structure": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 522 | <code>            "width": width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 523 | <code>            "height": height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 524 | <code>            "mode": mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 525 | <code>            "imageFormat": fmt,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 526 | <code>            "bytes": source_path.stat().st_size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 527 | <code>            "hasAlpha": "A" in mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 528 | <code>            "exifCount": exif_count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 529 | <code>            "dominantColors": dominant,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 530 | <code>            "visualCheck": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 531 | <code>                "blank": blank,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 532 | <code>                "uniqueSampledColors": len(colors),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 533 | <code>                "nonBlankRatio": non_blank_ratio,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 534 | <code>                "meanRgb": [round(v, 2) for v in stat.mean]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 535 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 536 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 537 | <code>        "view": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 538 | <code>            "size": [width, height],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 539 | <code>            "mode": mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 540 | <code>            "dominantColors": dominant[:6],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 541 | <code>            "visualCheck": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 542 | <code>                "blank": blank,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 543 | <code>                "uniqueSampledColors": len(colors),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 544 | <code>                "nonBlankRatio": non_blank_ratio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 545 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 546 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 547 | <code>        "text": "",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 548 | <code>        "diagnostics": diagnostics</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 549 | <code>    }, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 550 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 551 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 552 | <code>async function inspectPdfArtifact(input = {}) {</code> | 定义函数 `inspectPdfArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 553 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 554 | <code>    const raw = await runPythonJson(PDF_INSPECT_SCRIPT, [</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 555 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 556 | <code>        String(input.maxTextChars &#124;&#124; input.max_text_chars &#124;&#124; 24000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 557 | <code>    ], { cwd: input.repoRoot &#124;&#124; process.cwd(), timeoutMs: input.timeoutMs &#124;&#124; input.timeout_ms });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 558 | <code>    return normalizeInspection(raw, 'pdf', sourcePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 559 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 561 | <code>async function inspectOoxmlArtifact(input = {}, format) {</code> | 定义函数 `inspectOoxmlArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 562 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 563 | <code>    const raw = await runPythonJson(OOXML_INSPECT_SCRIPT, [</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 564 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 565 | <code>        format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 566 | <code>        String(input.maxTextChars &#124;&#124; input.max_text_chars &#124;&#124; 24000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 567 | <code>    ], { cwd: input.repoRoot &#124;&#124; process.cwd(), timeoutMs: input.timeoutMs &#124;&#124; input.timeout_ms });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 568 | <code>    return normalizeInspection(raw, format, sourcePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 569 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 571 | <code>async function inspectImageArtifact(input = {}) {</code> | 定义函数 `inspectImageArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 572 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 573 | <code>    const raw = await runPythonJson(IMAGE_INSPECT_SCRIPT, [sourcePath], {</code> | 声明局部标识符 `raw`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 574 | <code>        cwd: input.repoRoot &#124;&#124; process.cwd(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 575 | <code>        timeoutMs: input.timeoutMs &#124;&#124; input.timeout_ms</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 576 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 577 | <code>    return normalizeInspection(raw, 'image', sourcePath);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 578 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 580 | <code>async function inspectFileArtifact(input = {}) {</code> | 定义函数 `inspectFileArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 581 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 582 | <code>    const format = normalizeFormat(input.format, sourcePath);</code> | 声明局部标识符 `format`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 583 | <code>    if (format === 'pdf') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 584 | <code>        return inspectPdfArtifact({ ...input, sourcePath });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 585 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 586 | <code>    if (format === 'docx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 587 | <code>        return inspectOoxmlArtifact({ ...input, sourcePath }, 'docx');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 588 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 589 | <code>    if (format === 'pptx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 590 | <code>        return inspectOoxmlArtifact({ ...input, sourcePath }, 'pptx');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 591 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 592 | <code>    if (IMAGE_FORMATS.has(format)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 593 | <code>        const inspection = await inspectImageArtifact({ ...input, sourcePath });</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 594 | <code>        return { ...inspection, format, adapterId: 'image' };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 595 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 596 | <code>    throw new Error(`No file artifact adapter for format: ${format}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 597 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>function pushCandidate(candidates, candidate) {</code> | 定义函数 `pushCandidate`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 600 | <code>    candidates.push({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 601 | <code>        ref: candidate.ref &#124;&#124; candidate.fullRef &#124;&#124; candidate.name &#124;&#124; candidate.part &#124;&#124; `${candidate.kind}:${candidates.length + 1}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 602 | <code>        kind: candidate.kind &#124;&#124; 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 603 | <code>        text: compactText(candidate.text &#124;&#124; candidate.comment &#124;&#124; candidate.sampleText &#124;&#124; candidate.name &#124;&#124; candidate.part &#124;&#124; ''),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 604 | <code>        ...candidate</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 605 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 608 | <code>function buildSearchCandidates(inspection = {}) {</code> | 定义函数 `buildSearchCandidates`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 609 | <code>    const structure = inspection.structure &#124;&#124; {};</code> | 声明局部标识符 `structure`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 610 | <code>    const candidates = [];</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 611 | <code>    if (inspection.format === 'pdf') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 612 | <code>        for (const page of structure.pages &#124;&#124; []) {</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 613 | <code>            pushCandidate(candidates, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 614 | <code>                kind: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 615 | <code>                ref: `page:${page.index}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 616 | <code>                page: page.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 617 | <code>                text: page.sampleText &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 618 | <code>                wordCount: page.wordCount,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 619 | <code>                coordinates: (page.spans &#124;&#124; []).slice(0, 12)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 620 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 621 | <code>            for (const span of page.spans &#124;&#124; []) {</code> | 声明局部标识符 `span`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 622 | <code>                pushCandidate(candidates, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 623 | <code>                    kind: 'span',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 624 | <code>                    ref: `page:${page.index}@${span.x0},${span.top}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 625 | <code>                    page: page.index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 626 | <code>                    text: span.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 627 | <code>                    coordinates: span</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 628 | <code>                });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 629 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 630 | <code>            if (page.imageCount) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 631 | <code>                pushCandidate(candidates, { kind: 'image', ref: `page:${page.index}:images`, page: page.index, text: `${page.imageCount} image(s)` });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 632 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 633 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 634 | <code>    } else if (inspection.format === 'docx') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 635 | <code>        for (const para of structure.paragraphs &#124;&#124; []) {</code> | 声明局部标识符 `para`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 636 | <code>            pushCandidate(candidates, { kind: 'paragraph', ref: `paragraph:${para.index}`, text: para.text, style: para.style, runCount: para.runCount });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 637 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 638 | <code>        for (const table of structure.tables &#124;&#124; []) {</code> | 声明局部标识符 `table`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 639 | <code>            pushCandidate(candidates, { kind: 'table', ref: `table:${table.index}`, text: (table.rows &#124;&#124; []).flat().join(' &#124; '), rowCount: table.rowCount, columnCount: table.columnCount, rows: table.rows });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 640 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 641 | <code>        for (const comment of structure.comments &#124;&#124; []) {</code> | 声明局部标识符 `comment`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 642 | <code>            pushCandidate(candidates, { kind: 'comment', ref: `comment:${comment.id}`, text: comment.text, author: comment.author, date: comment.date });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 643 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 644 | <code>        for (const image of structure.images &#124;&#124; []) {</code> | 声明局部标识符 `image`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 645 | <code>            pushCandidate(candidates, { kind: 'image', ref: image.part, part: image.part, text: image.part, bytes: image.bytes, extension: image.extension });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 646 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>        for (const rel of structure.relationships &#124;&#124; []) {</code> | 声明局部标识符 `rel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 648 | <code>            pushCandidate(candidates, { kind: 'relationship', ref: `${rel.source}#${rel.id}`, text: `${rel.type} ${rel.target}`, ...rel });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 649 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 650 | <code>    } else if (inspection.format === 'pptx') {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 651 | <code>        for (const slide of structure.slides &#124;&#124; []) {</code> | 声明局部标识符 `slide`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 652 | <code>            pushCandidate(candidates, { kind: 'slide', ref: `slide:${slide.index}`, slide: slide.index, text: slide.text &#124;&#124; (slide.texts &#124;&#124; []).join('\n'), shapeCount: slide.shapeCount, pictureCount: slide.pictureCount, tableCount: slide.tableCount });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 653 | <code>            for (const [index, text] of (slide.texts &#124;&#124; []).entries()) {</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 654 | <code>                pushCandidate(candidates, { kind: 'text', ref: `slide:${slide.index}:text:${index + 1}`, slide: slide.index, text });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 655 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 656 | <code>            for (const rel of slide.imageRelationships &#124;&#124; []) {</code> | 声明局部标识符 `rel`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 657 | <code>                pushCandidate(candidates, { kind: 'image', ref: `slide:${slide.index}:${rel.id}`, slide: slide.index, text: rel.target, ...rel });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 658 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 659 | <code>            if (slide.tableCount) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 660 | <code>                pushCandidate(candidates, { kind: 'table', ref: `slide:${slide.index}:tables`, slide: slide.index, text: `${slide.tableCount} table(s)` });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 661 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 662 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 663 | <code>        for (const media of structure.media &#124;&#124; []) {</code> | 声明局部标识符 `media`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 664 | <code>            pushCandidate(candidates, { kind: 'media', ref: media.part, text: media.part, ...media });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 665 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 666 | <code>    } else if (inspection.adapterId === 'image' &#124;&#124; IMAGE_FORMATS.has(inspection.format)) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 667 | <code>        pushCandidate(candidates, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 668 | <code>            kind: 'metadata',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 669 | <code>            ref: 'image:metadata',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 670 | <code>            text: `${structure.imageFormat &#124;&#124; inspection.format} ${structure.width}x${structure.height} ${structure.mode}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 671 | <code>            width: structure.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 672 | <code>            height: structure.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 673 | <code>            mode: structure.mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 674 | <code>            imageFormat: structure.imageFormat</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 675 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 676 | <code>        for (const color of structure.dominantColors &#124;&#124; []) {</code> | 声明局部标识符 `color`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 677 | <code>            pushCandidate(candidates, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 678 | <code>                kind: 'color',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 679 | <code>                ref: `image:color:${color.rgb}`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 680 | <code>                text: color.rgb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 681 | <code>                rgb: color.rgb,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 682 | <code>                count: color.count,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 683 | <code>                alpha: color.alpha</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 684 | <code>            });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>        pushCandidate(candidates, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 687 | <code>            kind: 'visual',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 688 | <code>            ref: 'image:visualCheck',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 689 | <code>            text: JSON.stringify(structure.visualCheck &#124;&#124; {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 690 | <code>            ...(structure.visualCheck &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 691 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 692 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 693 | <code>    return candidates;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 694 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 695 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 696 | <code>function candidateMatches(candidate, kind, query, fillRgb) {</code> | 定义函数 `candidateMatches`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 697 | <code>    const normalizedKind = String(kind &#124;&#124; 'all').toLowerCase();</code> | 声明局部标识符 `normalizedKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 698 | <code>    const candidateKind = String(candidate.kind &#124;&#124; '').toLowerCase();</code> | 声明局部标识符 `candidateKind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 699 | <code>    const kindOk = normalizedKind === 'all'</code> | 声明局部标识符 `kindOk`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 700 | <code>        &#124;&#124; normalizedKind === candidateKind</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 701 | <code>        &#124;&#124; (normalizedKind === 'text' &amp;&amp; ['paragraph', 'slide', 'span'].includes(candidateKind))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 702 | <code>        &#124;&#124; (normalizedKind === 'inventory' &amp;&amp; ['image', 'media', 'relationship', 'metadata', 'visual'].includes(candidateKind));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 703 | <code>    if (!kindOk) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 704 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 705 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 706 | <code>    if (fillRgb) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 707 | <code>        const expected = normalizeHex(fillRgb);</code> | 声明局部标识符 `expected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 708 | <code>        const actual = normalizeHex(candidate.rgb &#124;&#124; candidate.text &#124;&#124; '');</code> | 声明局部标识符 `actual`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 709 | <code>        return actual === expected;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 710 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 711 | <code>    const normalizedQuery = String(query &#124;&#124; '').trim().toLowerCase();</code> | 声明局部标识符 `normalizedQuery`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 712 | <code>    if (!normalizedQuery) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 713 | <code>        return true;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 714 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 715 | <code>    const haystack = [</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 716 | <code>        candidate.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 717 | <code>        candidate.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 718 | <code>        candidate.text,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 719 | <code>        candidate.name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 720 | <code>        candidate.part,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 721 | <code>        candidate.target,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 722 | <code>        candidate.imageFormat,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 723 | <code>        JSON.stringify(candidate.coordinates &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 724 | <code>    ].filter(Boolean).join('\n').toLowerCase();</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 725 | <code>    return haystack.includes(normalizedQuery);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 726 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 728 | <code>async function indexFileArtifact(input = {}) {</code> | 定义函数 `indexFileArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 729 | <code>    const inspection = input.inspection &#124;&#124; await inspectFileArtifact(input);</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 730 | <code>    const candidates = buildSearchCandidates(inspection);</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 731 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 732 | <code>        schema: 'ailis.file_artifact.index.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 733 | <code>        adapterId: inspection.adapterId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 734 | <code>        format: inspection.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 735 | <code>        sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 736 | <code>        summary: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 737 | <code>            candidateCount: candidates.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 738 | <code>            textLength: inspection.text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 739 | <code>            pageCount: inspection.structure.pageCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 740 | <code>            paragraphCount: inspection.structure.paragraphCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 741 | <code>            slideCount: inspection.structure.slideCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 742 | <code>            imageCount: inspection.structure.imageCount &#124;&#124; inspection.structure.mediaCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 743 | <code>            tableCount: inspection.structure.tableCount &#124;&#124; 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 744 | <code>            commentCount: inspection.structure.commentCount &#124;&#124; 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 745 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 746 | <code>        candidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 747 | <code>        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 748 | <code>            schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 749 | <code>            action: 'index',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 750 | <code>            format: inspection.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 751 | <code>            sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 752 | <code>            summary: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 753 | <code>                candidateCount: candidates.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 754 | <code>                textLength: inspection.text.length</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 755 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>            candidates: candidates.slice(0, clampNumber(input.limit, 20, 1, 80)).map((candidate) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 757 | <code>                ref: candidate.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 758 | <code>                kind: candidate.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 759 | <code>                text: compactText(candidate.text, 180)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 760 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 762 | <code>        diagnostics: inspection.diagnostics &#124;&#124; []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 763 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 765 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 766 | <code>async function searchFileArtifact(input = {}) {</code> | 定义函数 `searchFileArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 767 | <code>    const inspection = input.inspection &#124;&#124; await inspectFileArtifact(input);</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 768 | <code>    const kind = String(input.searchKind &#124;&#124; input.search_kind &#124;&#124; input.kind &#124;&#124; 'all').toLowerCase();</code> | 声明局部标识符 `kind`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 769 | <code>    const query = String(input.query &#124;&#124; input.text &#124;&#124; input.term &#124;&#124; '').trim();</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 770 | <code>    const fillRgb = input.fillRgb &#124;&#124; input.fill_rgb &#124;&#124; input.rgb &#124;&#124; '';</code> | 声明局部标识符 `fillRgb`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 771 | <code>    const limit = clampNumber(input.limit, 20, 1, 100);</code> | 声明局部标识符 `limit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 772 | <code>    const candidates = buildSearchCandidates(inspection);</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 773 | <code>    const matches = candidates</code> | 声明局部标识符 `matches`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 774 | <code>        .filter((candidate) =&gt; candidateMatches(candidate, kind, query, fillRgb))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 775 | <code>        .slice(0, limit);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 776 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 777 | <code>        schema: 'ailis.file_artifact.search.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 778 | <code>        adapterId: inspection.adapterId,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 779 | <code>        format: inspection.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 780 | <code>        sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 781 | <code>        matchMode: fillRgb ? 'exact_style' : 'lexical_substring',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 782 | <code>        semanticLevel: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 783 | <code>        kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 784 | <code>        query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 785 | <code>        fillRgb: fillRgb ? normalizeHex(fillRgb) : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 786 | <code>        returned: matches.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 787 | <code>        totalCandidates: candidates.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 788 | <code>        matches,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 789 | <code>        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 790 | <code>            schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 791 | <code>            action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 792 | <code>            format: inspection.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 793 | <code>            sourcePath: inspection.sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 794 | <code>            matchMode: fillRgb ? 'exact_style' : 'lexical_substring',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 795 | <code>            semanticLevel: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 796 | <code>            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 797 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 798 | <code>            negativeResultScope: query &amp;&amp; matches.length === 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 799 | <code>                ? 'No lexical substring matched. This is not evidence that a semantic category is absent.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 800 | <code>                : '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 801 | <code>            query,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 802 | <code>            candidates: matches.map((candidate) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 803 | <code>                ref: candidate.ref,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 804 | <code>                kind: candidate.kind,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 805 | <code>                text: compactText(candidate.text, 220),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 806 | <code>                page: candidate.page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 807 | <code>                slide: candidate.slide,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 808 | <code>                coordinates: candidate.coordinates</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 809 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 810 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 811 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 812 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 813 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 814 | <code>const STRUCTURE_RENDER_SCRIPT = String.raw`</code> | 声明局部标识符 `STRUCTURE_RENDER_SCRIPT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 815 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 816 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 817 | <code>from pathlib import Path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 818 | <code>from PIL import Image, ImageDraw, ImageFont</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 819 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 820 | <code>input_path = Path(sys.argv[1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 821 | <code>output_path = Path(sys.argv[2])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 822 | <code>payload = json.loads(input_path.read_text(encoding="utf-8"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 823 | <code>mode = payload.get("mode", "artifact")</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 824 | <code>inspection = payload.get("inspection", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 825 | <code>structure = inspection.get("structure", {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 826 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 827 | <code>width = int(payload.get("width") or 1100)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 828 | <code>height = int(payload.get("height") or 760)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 829 | <code>image = Image.new("RGB", (width, height), (248, 250, 252))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 830 | <code>draw = ImageDraw.Draw(image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 831 | <code>try:</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 832 | <code>    font = ImageFont.truetype("arial.ttf", 20)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 833 | <code>    small = ImageFont.truetype("arial.ttf", 15)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 834 | <code>    bold = ImageFont.truetype("arialbd.ttf", 24)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 835 | <code>    tiny = ImageFont.truetype("arial.ttf", 12)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 836 | <code>except Exception:</code> | 错误处理路径：接收失败对象，并执行诊断、降级、记录或重新抛出。 |
| 837 | <code>    font = ImageFont.load_default()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 838 | <code>    small = font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 839 | <code>    bold = font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 840 | <code>    tiny = font</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 842 | <code>def text(x, y, value, fnt=small, fill=(15, 23, 42)):</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 843 | <code>    draw.text((x, y), str(value)[:140], fill=fill, font=fnt)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 844 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 845 | <code>draw.rectangle([0, 0, width, 58], fill=(15, 23, 42))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 846 | <code>text(24, 17, payload.get("title", "Artifact Preview"), bold, (255, 255, 255))</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 847 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 848 | <code>if mode == "pptx":</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 849 | <code>    slides = structure.get("slides", [])[:12]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 850 | <code>    box_w, box_h = 330, 185</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 851 | <code>    gap = 24</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 852 | <code>    x0, y0 = 24, 84</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 853 | <code>    for i, slide in enumerate(slides):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 854 | <code>        col = i % 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 855 | <code>        row = i // 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 856 | <code>        x = x0 + col * (box_w + gap)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 857 | <code>        y = y0 + row * (box_h + gap)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 858 | <code>        draw.rectangle([x, y, x + box_w, y + box_h], fill=(255, 255, 255), outline=(148, 163, 184), width=2)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 859 | <code>        text(x + 14, y + 12, f"Slide {slide.get('index')}", font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 860 | <code>        for j, line in enumerate((slide.get("texts") or [])[:5]):</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 861 | <code>            text(x + 14, y + 48 + j * 24, line, small)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 862 | <code>        footer = f"shapes={slide.get('shapeCount', 0)} images={slide.get('pictureCount', 0)} tables={slide.get('tableCount', 0)}"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 863 | <code>        text(x + 14, y + box_h - 26, footer, tiny, (71, 85, 105))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 864 | <code>else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 865 | <code>    y = 86</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 866 | <code>    metrics = []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 867 | <code>    for key in ["pageCount", "paragraphCount", "tableCount", "commentCount", "imageCount", "relationshipCount", "width", "height"]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 868 | <code>        if key in structure:</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 869 | <code>            metrics.append(f"{key}: {structure.get(key)}")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 870 | <code>    text(24, y, " &#124; ".join(metrics), font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 871 | <code>    y += 46</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 872 | <code>    if mode == "docx":</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 873 | <code>        text(24, y, "Paragraphs", font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 874 | <code>        y += 28</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 875 | <code>        for para in structure.get("paragraphs", [])[:14]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 876 | <code>            text(44, y, f"{para.get('index')}. {para.get('text', '')}", small)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 877 | <code>            y += 24</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 878 | <code>        if structure.get("tables"):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 879 | <code>            y += 12</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 880 | <code>            text(24, y, "Tables", font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 881 | <code>            y += 28</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 882 | <code>            for table in structure.get("tables", [])[:4]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 883 | <code>                text(44, y, f"table {table.get('index')}: {table.get('rowCount')}x{table.get('columnCount')} " + " &#124; ".join(sum(table.get("rows", [])[:2], [])), small)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 884 | <code>                y += 24</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 885 | <code>        if structure.get("comments"):</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 886 | <code>            y += 12</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 887 | <code>            text(24, y, "Comments", font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 888 | <code>            y += 28</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 889 | <code>            for comment in structure.get("comments", [])[:5]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 890 | <code>                text(44, y, f"comment {comment.get('id')}: {comment.get('text', '')}", small)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 891 | <code>                y += 24</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 892 | <code>    elif mode == "pdf":</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 893 | <code>        for page in structure.get("pages", [])[:10]:</code> | 循环控制：对集合、队列、重试次数或状态持续执行同一组逻辑。 |
| 894 | <code>            draw.rectangle([24, y, width - 24, y + 88], fill=(255, 255, 255), outline=(203, 213, 225))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 895 | <code>            text(42, y + 14, f"Page {page.get('index')} {int(page.get('width', 0))}x{int(page.get('height', 0))}", font)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 896 | <code>            text(42, y + 48, page.get("sampleText", ""), small)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 897 | <code>            y += 108</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 898 | <code>    else:</code> | 条件分支的替代路径：前一条件不成立时执行这里的逻辑。 |
| 899 | <code>        text(24, y, json.dumps(structure, ensure_ascii=False)[:900], small)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 900 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 901 | <code>output_path.parent.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 902 | <code>image.save(output_path, "PNG")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 903 | <code>pixels = list(image.getdata())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 904 | <code>step = max(1, len(pixels) // 20000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 905 | <code>sample = pixels[::step]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 906 | <code>background = (248, 250, 252)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 907 | <code>non_blank = sum(1 for pixel in sample if pixel != background)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 908 | <code>unique = len(set(sample))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 909 | <code>print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 910 | <code>    "outputPath": str(output_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 911 | <code>    "width": width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 912 | <code>    "height": height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 913 | <code>    "uniqueSampledColors": unique,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 914 | <code>    "nonBlankRatio": non_blank / max(1, len(sample)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 915 | <code>    "blank": unique &lt;= 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 916 | <code>}, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 917 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 918 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 919 | <code>const IMAGE_RENDER_SCRIPT = String.raw`</code> | 声明局部标识符 `IMAGE_RENDER_SCRIPT`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 920 | <code>import json</code> | 导入依赖 `json`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 921 | <code>import sys</code> | 导入依赖 `sys`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 922 | <code>from pathlib import Path</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 923 | <code>from PIL import Image</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 924 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 925 | <code>source_path = Path(sys.argv[1])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 926 | <code>output_path = Path(sys.argv[2])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 927 | <code>max_size = int(float(sys.argv[3] or "900"))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 928 | <code>with Image.open(source_path) as image:</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 929 | <code>    image = image.convert("RGBA")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 930 | <code>    image.thumbnail((max_size, max_size))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 931 | <code>    background = Image.new("RGBA", image.size, (248, 250, 252, 255))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 932 | <code>    background.alpha_composite(image)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 933 | <code>    rgb = background.convert("RGB")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 934 | <code>    output_path.parent.mkdir(parents=True, exist_ok=True)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 935 | <code>    rgb.save(output_path, "PNG")</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 936 | <code>    pixels = list(rgb.getdata())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 937 | <code>    step = max(1, len(pixels) // 20000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 938 | <code>    sample = pixels[::step]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 939 | <code>    first = sample[0] if sample else (248, 250, 252)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 940 | <code>    changed = sum(1 for pixel in sample if pixel != first)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 941 | <code>    print(json.dumps({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 942 | <code>        "outputPath": str(output_path),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 943 | <code>        "width": rgb.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 944 | <code>        "height": rgb.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 945 | <code>        "uniqueSampledColors": len(set(sample)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 946 | <code>        "nonBlankRatio": changed / max(1, len(sample)),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 947 | <code>        "blank": len(set(sample)) &lt;= 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 948 | <code>    }, ensure_ascii=False))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 949 | <code>`;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 950 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 951 | <code>async function renderPdfToPng(input = {}, inspection = null) {</code> | 定义函数 `renderPdfToPng`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 952 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 953 | <code>    const caseId = input.caseId &#124;&#124; path.basename(sourcePath, path.extname(sourcePath));</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 954 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 955 | <code>    const renderDir = path.join(outputDir, 'renders');</code> | 声明局部标识符 `renderDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 956 | <code>    await fsp.mkdir(renderDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 957 | <code>    const page = clampNumber(input.page &#124;&#124; input.pageNumber &#124;&#124; input.page_number, 1, 1, 10000);</code> | 声明局部标识符 `page`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 958 | <code>    const prefix = path.join(renderDir, `${caseId}-page-${page}`);</code> | 声明局部标识符 `prefix`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 959 | <code>    const outputPath = `${prefix}.png`;</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 960 | <code>    const args = ['-png', '-singlefile', '-f', String(page), '-l', String(page), sourcePath, prefix];</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 961 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 962 | <code>        await execFileAsync(getPdftoppmCommand(), args, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 963 | <code>            cwd: input.repoRoot &#124;&#124; process.cwd(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 964 | <code>            env: buildWorkerEnv(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 965 | <code>            maxBuffer: 4 * 1024 * 1024,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 966 | <code>            timeout: clampNumber(input.timeoutMs &#124;&#124; input.timeout_ms, 60000, 5000, 180000)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 967 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>        const visual = await inspectImageArtifact({ sourcePath: outputPath, repoRoot: input.repoRoot });</code> | 声明局部标识符 `visual`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 969 | <code>        const stat = await fsp.stat(outputPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 970 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 971 | <code>            passed: stat.size &gt; 128 &amp;&amp; visual.structure.visualCheck?.blank !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 972 | <code>            outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 973 | <code>            renderKind: 'pdf_page_png_poppler',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 974 | <code>            bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 975 | <code>            width: visual.structure.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 976 | <code>            height: visual.structure.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 977 | <code>            page,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 978 | <code>            visualCheck: visual.structure.visualCheck,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 979 | <code>            diagnostics: visual.structure.visualCheck?.blank</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 980 | <code>                ? [createDiagnostic('pdf_page_render_blank', 'error', 'Rendered PDF page appears blank.', { outputPath, page })]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 981 | <code>                : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 982 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 983 | <code>    } catch (error) {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 984 | <code>        const fallbackInspection = inspection &#124;&#124; await inspectPdfArtifact({ ...input, sourcePath });</code> | 声明局部标识符 `fallbackInspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 985 | <code>        return renderStructurePng({ ...input, inspection: fallbackInspection, mode: 'pdf', renderKind: 'pdf_structure_png_pillow', title: 'PDF Structural Preview' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 986 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 989 | <code>async function renderStructurePng(input = {}) {</code> | 定义函数 `renderStructurePng`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 990 | <code>    const inspection = input.inspection;</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 991 | <code>    const caseId = input.caseId &#124;&#124; path.basename(inspection.sourcePath, path.extname(inspection.sourcePath));</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 992 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 993 | <code>    const renderDir = path.join(outputDir, 'renders');</code> | 声明局部标识符 `renderDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 994 | <code>    await fsp.mkdir(renderDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 995 | <code>    const mode = input.mode &#124;&#124; inspection.format;</code> | 声明局部标识符 `mode`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 996 | <code>    const outputPath = input.outputPath</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 997 | <code>        ? toAbsolutePath(input.outputPath, input.repoRoot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 998 | <code>        : path.join(renderDir, `${caseId}-${mode}-preview.png`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 999 | <code>    const payloadPath = `${outputPath}.input.json`;</code> | 声明局部标识符 `payloadPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1000 | <code>    const payload = {</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1001 | <code>        mode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1002 | <code>        title: input.title &#124;&#124; `${String(inspection.format &#124;&#124; mode).toUpperCase()} Structural Preview`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1003 | <code>        inspection: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1004 | <code>            format: inspection.format,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1005 | <code>            structure: inspection.structure,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1006 | <code>            text: inspection.text</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1007 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1008 | <code>        width: input.width &#124;&#124; 1100,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1009 | <code>        height: input.height &#124;&#124; (mode === 'pptx' ? 760 : 900)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1010 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>    await fsp.writeFile(payloadPath, JSON.stringify(payload), 'utf8');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1012 | <code>    const metadata = await runPythonJson(STRUCTURE_RENDER_SCRIPT, [payloadPath, outputPath], {</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1013 | <code>        cwd: input.repoRoot &#124;&#124; process.cwd(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1014 | <code>        timeoutMs: input.timeoutMs &#124;&#124; input.timeout_ms</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1015 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1016 | <code>    const stat = await fsp.stat(outputPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1017 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1018 | <code>        passed: stat.size &gt; 128 &amp;&amp; metadata.blank !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1019 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1020 | <code>        renderKind: input.renderKind &#124;&#124; `${mode}_structure_png_pillow`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1021 | <code>        bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1022 | <code>        width: metadata.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1023 | <code>        height: metadata.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1024 | <code>        visualCheck: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1025 | <code>            blank: metadata.blank === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1026 | <code>            uniqueSampledColors: metadata.uniqueSampledColors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1027 | <code>            nonBlankRatio: metadata.nonBlankRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1028 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1029 | <code>        diagnostics: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1030 | <code>            ...(metadata.blank ? [createDiagnostic(`${mode}_png_render_blank`, 'error', `${mode.toUpperCase()} PNG render appears blank.`, { outputPath })] : []),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1031 | <code>            ...(['docx', 'pptx'].includes(mode) ? [createDiagnostic(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1032 | <code>                `${mode}_office_renderer_unavailable`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1033 | <code>                'warning',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1034 | <code>                `LibreOffice/soffice is not available in this environment; produced deterministic structural PNG preview instead of native Office layout render.`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1035 | <code>            )] : [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1036 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1037 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1038 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1039 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1040 | <code>async function renderImageToPng(input = {}, inspection = null) {</code> | 定义函数 `renderImageToPng`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1041 | <code>    const sourcePath = toAbsolutePath(input.sourcePath &#124;&#124; input.path, input.repoRoot);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1042 | <code>    const caseId = input.caseId &#124;&#124; path.basename(sourcePath, path.extname(sourcePath));</code> | 声明局部标识符 `caseId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1043 | <code>    const outputDir = toAbsolutePath(input.outputDir &#124;&#124; path.join(process.cwd(), 'eval-results', 'artifact-tools'), input.repoRoot);</code> | 声明局部标识符 `outputDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1044 | <code>    const renderDir = path.join(outputDir, 'renders');</code> | 声明局部标识符 `renderDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1045 | <code>    await fsp.mkdir(renderDir, { recursive: true });</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1046 | <code>    const outputPath = input.outputPath</code> | 声明局部标识符 `outputPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1047 | <code>        ? toAbsolutePath(input.outputPath, input.repoRoot)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1048 | <code>        : path.join(renderDir, `${caseId}-image-preview.png`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1049 | <code>    const metadata = await runPythonJson(IMAGE_RENDER_SCRIPT, [</code> | 声明局部标识符 `metadata`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1050 | <code>        sourcePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1051 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1052 | <code>        String(input.maxSize &#124;&#124; input.max_size &#124;&#124; 900)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1053 | <code>    ], { cwd: input.repoRoot &#124;&#124; process.cwd(), timeoutMs: input.timeoutMs &#124;&#124; input.timeout_ms });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1054 | <code>    const stat = await fsp.stat(outputPath);</code> | 声明局部标识符 `stat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1055 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1056 | <code>        passed: stat.size &gt; 128 &amp;&amp; metadata.blank !== true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1057 | <code>        outputPath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1058 | <code>        renderKind: 'image_png_pillow',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1059 | <code>        bytes: stat.size,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1060 | <code>        width: metadata.width,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1061 | <code>        height: metadata.height,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1062 | <code>        visualCheck: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1063 | <code>            blank: metadata.blank === true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1064 | <code>            uniqueSampledColors: metadata.uniqueSampledColors,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1065 | <code>            nonBlankRatio: metadata.nonBlankRatio</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1066 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1067 | <code>        diagnostics: metadata.blank</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1068 | <code>            ? [createDiagnostic('image_png_render_blank', 'error', 'Rendered image preview appears blank.', { outputPath })]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1069 | <code>            : []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1070 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1071 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1072 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1073 | <code>async function renderFileArtifactPreview(input = {}) {</code> | 定义函数 `renderFileArtifactPreview`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1074 | <code>    const inspection = input.inspection &#124;&#124; await inspectFileArtifact(input);</code> | 声明局部标识符 `inspection`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1075 | <code>    if (inspection.format === 'pdf') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1076 | <code>        return renderPdfToPng({ ...input, sourcePath: inspection.sourcePath }, inspection);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1077 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1078 | <code>    if (inspection.format === 'docx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1079 | <code>        return renderStructurePng({ ...input, inspection, mode: 'docx', title: 'DOCX Structural Preview' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1080 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1081 | <code>    if (inspection.format === 'pptx') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1082 | <code>        return renderStructurePng({ ...input, inspection, mode: 'pptx', renderKind: 'pptx_contact_sheet_png_pillow', title: 'PPTX Contact Sheet Preview' });</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1083 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1084 | <code>    if (inspection.adapterId === 'image' &#124;&#124; IMAGE_FORMATS.has(inspection.format)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1085 | <code>        return renderImageToPng({ ...input, sourcePath: inspection.sourcePath }, inspection);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1086 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1087 | <code>    throw new Error(`No render handler for file artifact format: ${inspection.format}`);</code> | 抛出错误：拒绝继续无效路径，并把明确失败原因交给上层处理。 |
| 1088 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1089 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1090 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1091 | <code>    FILE_ADAPTER_FORMATS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1092 | <code>    IMAGE_FORMATS,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1093 | <code>    buildSearchCandidates,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1094 | <code>    indexFileArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1095 | <code>    inspectFileArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1096 | <code>    renderFileArtifactPreview,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1097 | <code>    searchFileArtifact</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 1098 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
