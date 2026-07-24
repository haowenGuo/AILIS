# electron/ailis-evidence-artifacts.cjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。
- 文件类型：`source-code`
- 原始行数：593
- SHA-256：`0f13beaab605f233e534dcb0a8297c375d2e88354fc8260072ba2f346d5d46e5`
- 可运行副本：[打开源文件](../../../source/electron/ailis-evidence-artifacts.cjs)
- 依赖：`crypto`
- 主要符号：`crypto`、`EVIDENCE_ARTIFACT_VERSION`、`EVIDENCE_ARTIFACT_TYPES`、`normalizeText`、`trimmed`、`normalizeArray`、`cloneJson`、`summarize`、`text`、`stableHash`、`getObservationText`、`getObservationDetails`、`result`、`structured`、`candidates`、`artifactEvidencePayload`、`artifactId`、`evidence`、`coverage`、`looksLikePdfOrBinaryText`、`normalized`、`extractUrls`、`inferExplicitPath`、`direct`、`inferPath`、`sanitized`、`windowsPath`、`relativePath`、`fileLikePath`、`inferSourceKind`、`url`、`uri`、`path`、`parseGitBranch`、`porcelain`、`branch`、`parseChangedFiles`、`files`、`parseCommitHash`、`bracket`、`hash`、`parseOperation`、`haystack`、`confidenceFromText`、`length`、`payloadForArtifact`、`args`、`details`、`urls`、`explicitPath`、`artifactPayload`、`base`、`status`、`contentType`、`changedFiles`、`query`、`matchCount`、`computation`、`validateEvidenceArtifact`、`errors`、`payload`、`contentChars`、`createEvidenceArtifact`、`normalizedEvidenceId`、`type`、`id`、`artifact`、`validation`、`getEvidenceArtifactPromptObject`、`getEvidenceArtifactsPromptObject`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>const crypto = require('crypto');</code> | 导入依赖 `crypto`，使本文件可以复用外部模块能力。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 2 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 3 | <code>const EVIDENCE_ARTIFACT_VERSION = 1;</code> | 声明局部标识符 `EVIDENCE_ARTIFACT_VERSION`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const EVIDENCE_ARTIFACT_TYPES = Object.freeze({</code> | 声明局部标识符 `EVIDENCE_ARTIFACT_TYPES`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 6 | <code>    research_source: 'ResearchSourceEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 7 | <code>    research_read_result: 'ResearchReadEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 8 | <code>    grounded_summary: 'GroundedSummaryEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 9 | <code>    issue_context: 'IssueContextEvidence',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 10 | <code>    repo_state: 'RepoStateEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 11 | <code>    change_set: 'DiffEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 12 | <code>    safety_check: 'SecretScanEvidence',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 13 | <code>    operation_result: 'OperationResultEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 14 | <code>    target_file: 'DocumentTargetEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 15 | <code>    test_failure: 'TestFailureEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 16 | <code>    parsed_content: 'DocumentParseEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 17 | <code>    backup_or_dry_run: 'DocumentProtectionEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 18 | <code>    verification_result: 'VerificationEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 19 | <code>    mailbox_query: 'MailboxQueryEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 20 | <code>    mail_summary: 'MailSummaryEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 21 | <code>    snapshot: 'VisionSnapshotEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 22 | <code>    vision_observation: 'VisionObservationEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 23 | <code>    source_question: 'QuestionEvidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 24 | <code>    computation_result: 'ComputationEvidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 25 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 26 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 27 | <code>function normalizeText(value, fallback = '') {</code> | 定义函数 `normalizeText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 28 | <code>    if (typeof value !== 'string') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 29 | <code>        return fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 30 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 31 | <code>    const trimmed = value.trim();</code> | 声明局部标识符 `trimmed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 32 | <code>    return trimmed &#124;&#124; fallback;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 33 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 34 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 35 | <code>function normalizeArray(value) {</code> | 定义函数 `normalizeArray`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 36 | <code>    if (!value) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 37 | <code>        return [];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 38 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 39 | <code>    return Array.isArray(value) ? value : [value];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 40 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 41 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 42 | <code>function cloneJson(value) {</code> | 定义函数 `cloneJson`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 43 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 44 | <code>        return JSON.parse(JSON.stringify(value));</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 45 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 46 | <code>        return value;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 47 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 48 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 49 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 50 | <code>function summarize(value, maxChars = 420) {</code> | 定义函数 `summarize`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 51 | <code>    let text = '';</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 52 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 53 | <code>        text = typeof value === 'string' ? value : JSON.stringify(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 54 | <code>    } catch {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 55 | <code>        text = String(value);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 56 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>    text = normalizeText(text.replace(/\r\n/g, '\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 58 | <code>    return text.length &gt; maxChars ? `${text.slice(0, maxChars - 3)}...` : text;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 59 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 60 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 61 | <code>function stableHash(value) {</code> | 定义函数 `stableHash`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 62 | <code>    return crypto.createHash('sha1').update(String(value &#124;&#124; '')).digest('hex').slice(0, 12);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 63 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 64 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 65 | <code>function getObservationText(observation = {}) {</code> | 定义函数 `getObservationText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 66 | <code>    return normalizeText([</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 67 | <code>        observation.resultText,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 68 | <code>        observation.preview,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 69 | <code>        summarize(observation.response?.result &#124;&#124; observation.response?.details &#124;&#124; '', 1200)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 70 | <code>    ].filter(Boolean).join('\n'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 71 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>function getObservationDetails(observation = {}) {</code> | 定义函数 `getObservationDetails`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 74 | <code>    const result = observation.response?.result &#124;&#124; {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 75 | <code>    const structured = result?.structuredContent &#124;&#124; result?.structured_content;</code> | 声明局部标识符 `structured`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 76 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 77 | <code>        structured &amp;&amp; typeof structured === 'object' ? structured : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 78 | <code>        result?.details &amp;&amp; typeof result.details === 'object' ? result.details : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 79 | <code>        observation.response?.details &amp;&amp; typeof observation.response.details === 'object' ? observation.response.details : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 80 | <code>    ].filter(Boolean);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 81 | <code>    return candidates.reduce((merged, entry) =&gt; ({ ...merged, ...entry }), {});</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 82 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 84 | <code>function artifactEvidencePayload(details = {}) {</code> | 定义函数 `artifactEvidencePayload`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 85 | <code>    const artifactId = normalizeText(</code> | 声明局部标识符 `artifactId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 86 | <code>        details.artifactId &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 87 | <code>        details.artifact_id &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 88 | <code>        details.contextArtifact?.id &#124;&#124;</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 89 | <code>        details.artifact?.artifactId &#124;&#124;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 90 | <code>        details.artifact?.id</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 91 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 92 | <code>    if (!artifactId &amp;&amp; !details.coverage &amp;&amp; !details.evidence) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 93 | <code>        return {};</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 94 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>    const evidence = details.evidence &amp;&amp; typeof details.evidence === 'object' ? details.evidence : {};</code> | 声明局部标识符 `evidence`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 96 | <code>    const coverage = details.coverage &amp;&amp; typeof details.coverage === 'object'</code> | 声明局部标识符 `coverage`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 97 | <code>        ? details.coverage</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 98 | <code>        : (evidence.coverage &amp;&amp; typeof evidence.coverage === 'object' ? evidence.coverage : null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 99 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 100 | <code>        artifactId: artifactId &#124;&#124; normalizeText(evidence.artifactId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 101 | <code>        artifactKind: normalizeText(details.artifactKind &#124;&#124; evidence.artifactKind),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 102 | <code>        artifactType: normalizeText(details.artifactType &#124;&#124; evidence.artifactType),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 103 | <code>        artifactAction: normalizeText(details.action &#124;&#124; evidence.action),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 104 | <code>        sheet: normalizeText(details.sheet &#124;&#124; evidence.sheet &#124;&#124; coverage?.sheet),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 105 | <code>        range: normalizeText(details.range &#124;&#124; evidence.range &#124;&#124; coverage?.range),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 106 | <code>        coverage: coverage ? cloneJson(coverage) : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 107 | <code>        complete: details.complete === true &#124;&#124; evidence.complete === true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 108 | <code>        truncated: details.truncated === true &#124;&#124; evidence.truncated === true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 109 | <code>        reasoningReady: details.reasoningReady === true &#124;&#124; details.reasoning_ready === true &#124;&#124; evidence.reasoningReady === true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 110 | <code>        pinnedEvidenceId: normalizeText(details.pinnedEvidenceId &#124;&#124; details.pinned_evidence_id &#124;&#124; evidence.evidenceId),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 111 | <code>        coveredByEvidence: details.coveredByEvidence &amp;&amp; typeof details.coveredByEvidence === 'object'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 112 | <code>            ? cloneJson(details.coveredByEvidence)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 113 | <code>            : null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 114 | <code>        observationContract: cloneJson(details.observationContract &#124;&#124; details.observation_contract &#124;&#124; null)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 115 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 116 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 117 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 118 | <code>function looksLikePdfOrBinaryText(text = '') {</code> | 定义函数 `looksLikePdfOrBinaryText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 119 | <code>    const normalized = normalizeText(text);</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 120 | <code>    if (!normalized) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 121 | <code>        return false;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 122 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>    return /^%PDF-\d\.\d/.test(normalized) &#124;&#124;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 124 | <code>        /\bobj\s*&lt;&lt;[\s\S]{0,240}\bstream\b/i.test(normalized) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 125 | <code>        /\/Filter\s*\/(?:FlateDecode&#124;DCTDecode&#124;LZWDecode&#124;ASCII85Decode)/i.test(normalized) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 126 | <code>        /\\x00&#124;\u0000/.test(normalized);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 127 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 129 | <code>function extractUrls(text = '') {</code> | 定义函数 `extractUrls`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 130 | <code>    return [...String(text &#124;&#124; '').matchAll(/https?:\/\/[^\s"'&lt;&gt;\)\]]+/gi)]</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 131 | <code>        .map((match) =&gt; match[0].replace(/[.,;:!?]+$/g, ''))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 132 | <code>        .filter(Boolean)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 133 | <code>        .slice(0, 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 134 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 136 | <code>function inferExplicitPath(args = {}) {</code> | 定义函数 `inferExplicitPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 137 | <code>    const candidates = [</code> | 声明局部标识符 `candidates`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 138 | <code>        args.path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 139 | <code>        args.file,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 140 | <code>        args.filePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 141 | <code>        args.cwd</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 142 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 143 | <code>    const direct = candidates</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 144 | <code>        .map((entry) =&gt; normalizeText(entry))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 145 | <code>        .find((entry) =&gt; entry &amp;&amp; !/^https?:\/\//i.test(entry));</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 146 | <code>    return direct &#124;&#124; '';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 147 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 148 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 149 | <code>function inferPath(args = {}, text = '') {</code> | 定义函数 `inferPath`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 150 | <code>    const direct = inferExplicitPath(args);</code> | 声明局部标识符 `direct`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 151 | <code>    if (direct) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 152 | <code>        return direct;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 153 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 154 | <code>    const sanitized = String(text &#124;&#124; '')</code> | 声明局部标识符 `sanitized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 155 | <code>        .replace(/https?:\/\/[^\s"'&lt;&gt;\)\]]+/gi, ' ')</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 156 | <code>        .replace(/&lt;[^&gt;]*&gt;/g, ' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 157 | <code>    const windowsPath = sanitized.match(/(?:^&#124;[\s("'=])([A-Za-z]:\\[^\r\n"'&lt;&gt;&#124;]+)/m);</code> | 声明局部标识符 `windowsPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 158 | <code>    if (windowsPath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 159 | <code>        return normalizeText(windowsPath[1]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 160 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>    const relativePath = sanitized.match(/(?:^&#124;[\s(])((?:\.{1,2}[\\/]&#124;[\\/](?![\\/]))[A-Za-z0-9._-]+(?:[\\/][^\s"'&lt;&gt;&#124;]+)*)/m);</code> | 声明局部标识符 `relativePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 162 | <code>    if (relativePath) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 163 | <code>        return normalizeText(relativePath[1]);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 164 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 165 | <code>    const fileLikePath = sanitized.match(/(?:^&#124;[\s(])([A-Za-z0-9._-]+(?:[\\/][A-Za-z0-9._-]+)+\.[A-Za-z0-9]{1,12})(?=$&#124;[\s),;:])/m);</code> | 声明局部标识符 `fileLikePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 166 | <code>    return normalizeText(fileLikePath?.[1] &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 167 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 168 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 169 | <code>function inferSourceKind(args = {}, text = '') {</code> | 定义函数 `inferSourceKind`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 170 | <code>    const url = extractUrls(text)[0] &#124;&#124; normalizeText(args.url &#124;&#124; args.href);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 171 | <code>    if (url) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 172 | <code>        if (/arxiv\.org/i.test(url)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 173 | <code>            return 'arxiv';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 174 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 175 | <code>        if (/\.pdf(?:$&#124;[?#])/i.test(url)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 176 | <code>            return 'pdf_url';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 177 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 178 | <code>        return 'url';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 179 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 180 | <code>    const uri = normalizeText(args.uri &#124;&#124; args.resource &#124;&#124; args.resourceUri);</code> | 声明局部标识符 `uri`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 181 | <code>    if (uri) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 182 | <code>        return uri.includes('://') ? 'mcp_resource' : 'resource';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 183 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    const path = inferPath(args, text);</code> | 声明局部标识符 `path`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 185 | <code>    if (path) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 186 | <code>        return /\.pdf$/i.test(path) ? 'pdf_file' : 'file';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 187 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 188 | <code>    return 'observation';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 189 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>function parseGitBranch(text = '') {</code> | 定义函数 `parseGitBranch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 192 | <code>    const normalized = String(text &#124;&#124; '');</code> | 声明局部标识符 `normalized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 193 | <code>    const porcelain = normalized.match(/^##\s+([^\s.]+)(?:\.\.\.)?/m);</code> | 声明局部标识符 `porcelain`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 194 | <code>    if (porcelain) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 195 | <code>        return porcelain[1];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 196 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 197 | <code>    const branch = normalized.match(/On branch\s+([^\s]+)/i);</code> | 声明局部标识符 `branch`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 198 | <code>    return normalizeText(branch?.[1] &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 199 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 201 | <code>function parseChangedFiles(text = '') {</code> | 定义函数 `parseChangedFiles`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 202 | <code>    const files = new Set();</code> | 声明局部标识符 `files`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 203 | <code>    for (const match of String(text &#124;&#124; '').matchAll(/^diff --git a\/(.+?) b\/(.+)$/gm)) {</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 204 | <code>        files.add(match[2] &#124;&#124; match[1]);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 205 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 206 | <code>    for (const match of String(text &#124;&#124; '').matchAll(/^\s*[ MADRCU?!]{1,2}\s+(.+)$/gm)) {</code> | 声明局部标识符 `match`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 207 | <code>        files.add(match[1].trim());</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 208 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 209 | <code>    return [...files].filter(Boolean).slice(0, 80);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 210 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 211 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 212 | <code>function parseCommitHash(text = '') {</code> | 定义函数 `parseCommitHash`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 213 | <code>    const bracket = String(text &#124;&#124; '').match(/\[[^\s\]]+\s+([0-9a-f]{7,40})\]/i);</code> | 声明局部标识符 `bracket`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 214 | <code>    if (bracket) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 215 | <code>        return bracket[1];</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 216 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>    const hash = String(text &#124;&#124; '').match(/\b[0-9a-f]{7,40}\b/i);</code> | 声明局部标识符 `hash`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 218 | <code>    return normalizeText(hash?.[0] &#124;&#124; '');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 219 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 220 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 221 | <code>function parseOperation(action = '', text = '') {</code> | 定义函数 `parseOperation`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 222 | <code>    const haystack = `${action}\n${text}`.toLowerCase();</code> | 声明局部标识符 `haystack`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 223 | <code>    if (/pull request&#124;\bpr\b/.test(haystack)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 224 | <code>        return 'pull_request';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 225 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 226 | <code>    if (/push/.test(haystack)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 227 | <code>        return 'push';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 228 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 229 | <code>    if (/commit/.test(haystack)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 230 | <code>        return 'commit';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 231 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 232 | <code>    if (/ci&#124;check/.test(haystack)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 233 | <code>        return 'ci_status';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 234 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 235 | <code>    return normalizeText(action, 'operation');</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 236 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 237 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 238 | <code>function confidenceFromText(text = '', base = 0.68) {</code> | 定义函数 `confidenceFromText`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 239 | <code>    const length = normalizeText(text).length;</code> | 声明局部标识符 `length`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 240 | <code>    if (length &gt;= 800) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 241 | <code>        return Math.min(0.98, base + 0.2);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 242 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 243 | <code>    if (length &gt;= 160) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 244 | <code>        return Math.min(0.94, base + 0.14);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 245 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 246 | <code>    if (length &gt;= 32) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 247 | <code>        return Math.min(0.88, base + 0.08);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 248 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 249 | <code>    return base;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 250 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 251 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 252 | <code>function payloadForArtifact(type, observation = {}) {</code> | 定义函数 `payloadForArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 253 | <code>    const args = observation.args &#124;&#124; {};</code> | 声明局部标识符 `args`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 254 | <code>    const text = getObservationText(observation);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 255 | <code>    const details = getObservationDetails(observation);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 256 | <code>    const urls = extractUrls(text);</code> | 声明局部标识符 `urls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 257 | <code>    const path = inferPath(args, text);</code> | 声明局部标识符 `path`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 258 | <code>    const explicitPath = inferExplicitPath(args);</code> | 声明局部标识符 `explicitPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 259 | <code>    const artifactPayload = artifactEvidencePayload(details);</code> | 声明局部标识符 `artifactPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 260 | <code>    const base = {</code> | 声明局部标识符 `base`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 261 | <code>        contentChars: text.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 262 | <code>        textHash: stableHash(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 263 | <code>        preview: summarize(text, 260),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 264 | <code>        ...artifactPayload</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 265 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 266 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 267 | <code>    if (type === 'IssueContextEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 268 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 269 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 270 | <code>            issueId: normalizeText(args.instance_id &#124;&#124; args.instanceId &#124;&#124; args.issueId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 271 | <code>            repo: normalizeText(args.repo &#124;&#124; args.repository),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 272 | <code>            hasTraceback: /traceback&#124;exception&#124;error&#124;assert/i.test(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 273 | <code>            hasReproduction: /reproduce&#124;复现&#124;steps&#124;example&#124;```/i.test(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 274 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 276 | <code>    if (type === 'ResearchSourceEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 277 | <code>        const url = urls[0] &#124;&#124; normalizeText(args.url &#124;&#124; args.href);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 278 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 279 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 280 | <code>            sourceKind: inferSourceKind(args, text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 281 | <code>            url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 282 | <code>            path: url ? explicitPath : path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 283 | <code>            uri: normalizeText(args.uri &#124;&#124; args.resource &#124;&#124; args.resourceUri),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 284 | <code>            title: normalizeText(observation.title)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 285 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 286 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 287 | <code>    if (type === 'ResearchReadEvidence' &#124;&#124; type === 'GroundedSummaryEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 288 | <code>        const details = getObservationDetails(observation);</code> | 声明局部标识符 `details`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 289 | <code>        const status = normalizeText(details.status &#124;&#124; details.errorCode &#124;&#124; details.error_code).toLowerCase();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 290 | <code>        const contentType = normalizeText(details.contentType &#124;&#124; details.content_type).toLowerCase();</code> | 声明局部标识符 `contentType`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 291 | <code>        const url = urls[0] &#124;&#124; normalizeText(args.url &#124;&#124; args.href);</code> | 声明局部标识符 `url`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 292 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 293 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 294 | <code>            sourceKind: inferSourceKind(args, text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 295 | <code>            path: url ? explicitPath : path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 296 | <code>            url,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 297 | <code>            excerptCount: text ? Math.max(1, Math.min(12, Math.ceil(text.length / 700))) : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 298 | <code>            contentType,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 299 | <code>            unsupportedContentType: status === 'unsupported_content_type',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 300 | <code>            binaryLike: looksLikePdfOrBinaryText(text) &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 301 | <code>                details.isBinary === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 302 | <code>                details.is_binary === true &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 303 | <code>                contentType.includes('application/pdf')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 304 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 305 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>    if (type === 'RepoStateEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 307 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 308 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 309 | <code>            branch: parseGitBranch(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 310 | <code>            remoteMentioned: /\borigin\/&#124;remote&#124;github\.com/i.test(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 311 | <code>            changedFiles: parseChangedFiles(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 312 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 313 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>    if (type === 'DiffEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 315 | <code>        const changedFiles = parseChangedFiles(text);</code> | 声明局部标识符 `changedFiles`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 316 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 317 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 318 | <code>            changedFiles,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 319 | <code>            hasDiff: /diff --git&#124;^\+{3}\s&#124;^-{3}\s&#124;changed files/i.test(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 320 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 321 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 322 | <code>    if (type === 'SecretScanEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 323 | <code>        const query = summarize(args.query &#124;&#124; args.pattern &#124;&#124; args.search &#124;&#124; text, 180);</code> | 声明局部标识符 `query`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 324 | <code>        const matchCount = Number(args.matchCount ?? args.matches?.length ?? observation.response?.details?.matches?.length ?? 0);</code> | 声明局部标识符 `matchCount`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 325 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 326 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 327 | <code>            scannedPatterns: ['secret', 'token', 'api_key', 'password', 'credential'].filter((word) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 328 | <code>                `${query}\n${text}`.toLowerCase().includes(word)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 329 | <code>            ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 330 | <code>            matchCount: Number.isFinite(matchCount) ? matchCount : 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 331 | <code>            safe: !/private key&#124;api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9_-]{12,}&#124;token\s*[:=]\s*['"]?[A-Za-z0-9_-]{12,}/i.test(text)</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 332 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 334 | <code>    if (type === 'OperationResultEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 335 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 336 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 337 | <code>            operation: parseOperation(observation.action, text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 338 | <code>            commitHash: parseCommitHash(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 339 | <code>            prUrl: urls.find((url) =&gt; /pull&#124;\/pr\/&#124;\/pull\//i.test(url)) &#124;&#124; '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 340 | <code>            status: normalizeText(observation.status)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 341 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 343 | <code>    if (type === 'DocumentTargetEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 344 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 345 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 346 | <code>            path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 347 | <code>            size: Number(args.size &#124;&#124; observation.response?.details?.size &#124;&#124; observation.response?.result?.details?.size &#124;&#124; 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 348 | <code>            fileType: normalizeText(path.split('.').pop())</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 349 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 350 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 351 | <code>    if (type === 'TestFailureEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 352 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 353 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 354 | <code>            tests: normalizeArray(args.tests &#124;&#124; args.failToPass &#124;&#124; args.FAIL_TO_PASS)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 355 | <code>                .map((entry) =&gt; String(entry))</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 356 | <code>                .slice(0, 80),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 357 | <code>            hasTraceback: /traceback&#124;assert&#124;failed&#124;failure&#124;error&#124;FAIL_TO_PASS/i.test(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 358 | <code>            command: normalizeText(args.command &#124;&#124; args.cmd),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 359 | <code>            expectedToFail: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 360 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 361 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>    if (type === 'DocumentParseEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 363 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 364 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 365 | <code>            path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 366 | <code>            sectionCount: Math.max(0, (text.match(/^#{1,6}\s&#124;\n\s*\d+[.)]\s/gm) &#124;&#124; []).length),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 367 | <code>            tableLike: /\&#124;.+\&#124;&#124;\t/.test(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 368 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 369 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 370 | <code>    if (type === 'DocumentProtectionEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 371 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 372 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 373 | <code>            path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 374 | <code>            dryRun: args.dryRun === true &#124;&#124; args.dry_run === true &#124;&#124; /dry[- ]?run&#124;预演/i.test(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 375 | <code>            backupMentioned: /backup&#124;备份&#124;copy&#124;hash/i.test(`${observation.action}\n${text}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 376 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 377 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 378 | <code>    if (type === 'VerificationEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 379 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 380 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 381 | <code>            path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 382 | <code>            verificationKind: normalizeText(observation.action, 'check'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 383 | <code>            passed: observation.ok === true &amp;&amp; !/failed&#124;error&#124;失败&#124;报错/i.test(text)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 384 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 386 | <code>    if (type === 'ComputationEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 387 | <code>        const computation =</code> | 声明局部标识符 `computation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 388 | <code>            details.computation &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 389 | <code>            details.observation?.computation &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 390 | <code>            details.query?.observation?.computation &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 391 | <code>            details.modelView?.observation?.computation &#124;&#124;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 392 | <code>            {};</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 393 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 394 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 395 | <code>            deterministic: computation.deterministic !== false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 396 | <code>            operation: normalizeText(computation.operation &#124;&#124; details.action &#124;&#124; observation.action),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 397 | <code>            result: computation.value ?? computation.result ?? details.aggregateResult?.value ?? details.query?.aggregateResult?.value,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 398 | <code>            rowCount: Number(computation.rowCount ?? details.aggregateResult?.rowCount ?? details.query?.aggregateResult?.rowCount ?? 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 399 | <code>            numericCount: Number(computation.numericCount ?? details.aggregateResult?.numericCount ?? details.query?.aggregateResult?.numericCount ?? 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 400 | <code>            filter: cloneJson(computation.filter &#124;&#124; details.query?.filter &#124;&#124; null),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 401 | <code>            groupBy: normalizeText(computation.groupBy &#124;&#124; details.query?.groupBy),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 402 | <code>            sortBy: normalizeText(computation.sortBy),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 403 | <code>            source: cloneJson(computation.source &#124;&#124; null)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 404 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 405 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>    if (type === 'MailboxQueryEvidence' &#124;&#124; type === 'MailSummaryEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 407 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 408 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 409 | <code>            account: normalizeText(args.account &#124;&#124; args.provider),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 410 | <code>            query: normalizeText(args.query &#124;&#124; args.filter),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 411 | <code>            messageCount: Number(args.limit &#124;&#124; observation.response?.details?.messages?.length &#124;&#124; 0)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 412 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 413 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 414 | <code>    if (type === 'VisionSnapshotEvidence' &#124;&#124; type === 'VisionObservationEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 415 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 416 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 417 | <code>            snapshotId: normalizeText(args.snapshotId &#124;&#124; observation.response?.details?.snapshotId),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 418 | <code>            target: normalizeText(args.target &#124;&#124; args.source),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 419 | <code>            imagePath: normalizeText(args.imagePath &#124;&#124; observation.response?.details?.imagePath),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 420 | <code>            bounds: cloneJson(args.bounds &#124;&#124; observation.response?.details?.bounds &#124;&#124; null)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 421 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 422 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 423 | <code>    if (type === 'QuestionEvidence') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 424 | <code>        return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 425 | <code>            ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 426 | <code>            sourceKind: 'user_question',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 427 | <code>            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 428 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 429 | <code>            reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 430 | <code>        };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 431 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 432 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 433 | <code>        ...base,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 434 | <code>        path,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 435 | <code>        urls</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 436 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 437 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 438 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 439 | <code>function validateEvidenceArtifact(artifact = {}) {</code> | 定义函数 `validateEvidenceArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 440 | <code>    const errors = [];</code> | 声明局部标识符 `errors`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 441 | <code>    if (!artifact &#124;&#124; typeof artifact !== 'object' &#124;&#124; Array.isArray(artifact)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 442 | <code>        return { ok: false, errors: ['artifact must be object'] };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 443 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 444 | <code>    for (const field of ['id', 'type', 'evidenceId', 'taskType', 'observationId']) {</code> | 声明局部标识符 `field`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 445 | <code>        if (!normalizeText(artifact[field])) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 446 | <code>            errors.push(`${field} is required`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 447 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 448 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 449 | <code>    if (!artifact.source &#124;&#124; typeof artifact.source !== 'object') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 450 | <code>        errors.push('source is required');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 451 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>    const payload = artifact.payload &#124;&#124; {};</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 453 | <code>    const contentChars = Number(payload.contentChars &#124;&#124; 0);</code> | 声明局部标识符 `contentChars`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 454 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 455 | <code>    if (['ResearchReadEvidence', 'GroundedSummaryEvidence', 'IssueContextEvidence', 'DocumentParseEvidence', 'TestFailureEvidence', 'MailSummaryEvidence', 'VisionObservationEvidence', 'QuestionEvidence'].includes(artifact.type) &amp;&amp; contentChars &lt; 12) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 456 | <code>        errors.push(`${artifact.type} requires readable content`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 457 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>    if (['ResearchReadEvidence', 'GroundedSummaryEvidence'].includes(artifact.type)) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 459 | <code>        if (payload.unsupportedContentType) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 460 | <code>            errors.push(`${artifact.type} cannot be built from unsupported content type`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 461 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 462 | <code>        if (payload.binaryLike) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 463 | <code>            errors.push(`${artifact.type} cannot be built from PDF/binary bytes`);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 464 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 465 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 466 | <code>    if (artifact.type === 'ResearchSourceEvidence' &amp;&amp; !payload.url &amp;&amp; !payload.path &amp;&amp; !payload.uri &amp;&amp; contentChars &lt; 12) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 467 | <code>        errors.push('ResearchSourceEvidence requires url, path, uri, or readable source text');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 468 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 469 | <code>    if (artifact.type === 'RepoStateEvidence' &amp;&amp; !payload.branch &amp;&amp; contentChars &lt; 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 470 | <code>        errors.push('RepoStateEvidence requires branch/status text');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 471 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 472 | <code>    if (artifact.type === 'DiffEvidence' &amp;&amp; !payload.hasDiff &amp;&amp; !payload.changedFiles?.length &amp;&amp; contentChars &lt; 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 473 | <code>        errors.push('DiffEvidence requires diff or changed file text');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 474 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 475 | <code>    if (artifact.type === 'SecretScanEvidence' &amp;&amp; !payload.scannedPatterns?.length &amp;&amp; contentChars &lt; 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 476 | <code>        errors.push('SecretScanEvidence requires scanned pattern context');</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 477 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>    if (artifact.type === 'OperationResultEvidence' &amp;&amp; !payload.operation &amp;&amp; !payload.commitHash &amp;&amp; !payload.prUrl) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 479 | <code>        errors.push('OperationResultEvidence requires operation result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 480 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 481 | <code>    if (artifact.type === 'DocumentTargetEvidence' &amp;&amp; !payload.path &amp;&amp; contentChars &lt; 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 482 | <code>        errors.push('DocumentTargetEvidence requires path or file status text');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 483 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 484 | <code>    if (artifact.type === 'TestFailureEvidence' &amp;&amp; !payload.tests?.length &amp;&amp; !payload.hasTraceback &amp;&amp; contentChars &lt; 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 485 | <code>        errors.push('TestFailureEvidence requires failing test or traceback context');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 486 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 487 | <code>    if (artifact.type === 'DocumentProtectionEvidence' &amp;&amp; !payload.dryRun &amp;&amp; !payload.backupMentioned &amp;&amp; contentChars &lt; 8) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 488 | <code>        errors.push('DocumentProtectionEvidence requires dry-run or backup context');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 489 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 490 | <code>    if (artifact.type === 'VerificationEvidence' &amp;&amp; contentChars &lt; 8 &amp;&amp; !payload.verificationKind) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 491 | <code>        errors.push('VerificationEvidence requires check result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 492 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 493 | <code>    if (artifact.type === 'VisionSnapshotEvidence' &amp;&amp; !payload.snapshotId &amp;&amp; !payload.imagePath &amp;&amp; !payload.target) {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 494 | <code>        errors.push('VisionSnapshotEvidence requires snapshot id, image path, or target');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 495 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 496 | <code>    if (artifact.type === 'ComputationEvidence' &amp;&amp; typeof payload.result === 'undefined') {</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 497 | <code>        errors.push('ComputationEvidence requires a deterministic result');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 498 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 499 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 500 | <code>        ok: errors.length === 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 501 | <code>        errors</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 502 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 505 | <code>function createEvidenceArtifact({ taskType = 'generic_task', evidenceId = '', observation = {} } = {}) {</code> | 定义函数 `createEvidenceArtifact`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 506 | <code>    const normalizedEvidenceId = normalizeText(evidenceId);</code> | 声明局部标识符 `normalizedEvidenceId`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 507 | <code>    const type = EVIDENCE_ARTIFACT_TYPES[normalizedEvidenceId] &#124;&#124; 'GenericObservationEvidence';</code> | 声明局部标识符 `type`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 508 | <code>    const text = getObservationText(observation);</code> | 声明局部标识符 `text`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 509 | <code>    const id = `artifact-${stableHash(`${taskType}:${normalizedEvidenceId}:${observation.id}:${observation.tool}:${observation.action}:${text}`)}`;</code> | 声明局部标识符 `id`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 510 | <code>    const artifact = {</code> | 声明局部标识符 `artifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 511 | <code>        version: EVIDENCE_ARTIFACT_VERSION,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 512 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 513 | <code>        type,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 514 | <code>        evidenceId: normalizedEvidenceId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 515 | <code>        taskType: normalizeText(taskType, 'generic_task'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 516 | <code>        observationId: normalizeText(observation.id, `observation-${stableHash(text)}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 517 | <code>        source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 518 | <code>            tool: normalizeText(observation.tool),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 519 | <code>            action: normalizeText(observation.action),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 520 | <code>            title: normalizeText(observation.title),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 521 | <code>            status: normalizeText(observation.status),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 522 | <code>            iteration: Number.isFinite(Number(observation.iteration)) ? Number(observation.iteration) : null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 523 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>        confidence: confidenceFromText(text),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 525 | <code>        summary: summarize(text &#124;&#124; observation.title &#124;&#124; type, 320),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 526 | <code>        payload: payloadForArtifact(type, observation),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 527 | <code>        createdAt: new Date().toISOString()</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 528 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 529 | <code>    const validation = validateEvidenceArtifact(artifact);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 530 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 531 | <code>        ...artifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 532 | <code>        validation</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 533 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 534 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>function getEvidenceArtifactPromptObject(artifact = {}) {</code> | 定义函数 `getEvidenceArtifactPromptObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 537 | <code>    return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 538 | <code>        id: artifact.id,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 539 | <code>        type: artifact.type,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 540 | <code>        evidenceId: artifact.evidenceId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 541 | <code>        observationId: artifact.observationId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 542 | <code>        source: artifact.source,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 543 | <code>        confidence: artifact.confidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 544 | <code>        summary: artifact.summary,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 545 | <code>        validation: artifact.validation,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 546 | <code>        payload: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 547 | <code>            sourceKind: artifact.payload?.sourceKind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 548 | <code>            path: artifact.payload?.path,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 549 | <code>            url: artifact.payload?.url,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 550 | <code>            uri: artifact.payload?.uri,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 551 | <code>            branch: artifact.payload?.branch,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 552 | <code>            changedFiles: artifact.payload?.changedFiles?.slice?.(0, 12),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 553 | <code>            operation: artifact.payload?.operation,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 554 | <code>            commitHash: artifact.payload?.commitHash,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 555 | <code>            prUrl: artifact.payload?.prUrl,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 556 | <code>            dryRun: artifact.payload?.dryRun,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 557 | <code>            backupMentioned: artifact.payload?.backupMentioned,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 558 | <code>            passed: artifact.payload?.passed,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 559 | <code>            artifactId: artifact.payload?.artifactId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 560 | <code>            artifactKind: artifact.payload?.artifactKind,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 561 | <code>            artifactType: artifact.payload?.artifactType,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 562 | <code>            artifactAction: artifact.payload?.artifactAction,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 563 | <code>            sheet: artifact.payload?.sheet,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 564 | <code>            range: artifact.payload?.range,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 565 | <code>            coverage: artifact.payload?.coverage,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 566 | <code>            complete: artifact.payload?.complete,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 567 | <code>            truncated: artifact.payload?.truncated,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 568 | <code>            reasoningReady: artifact.payload?.reasoningReady,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 569 | <code>            pinnedEvidenceId: artifact.payload?.pinnedEvidenceId,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 570 | <code>            coveredByEvidence: artifact.payload?.coveredByEvidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 571 | <code>            deterministic: artifact.payload?.deterministic,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 572 | <code>            computationOperation: artifact.payload?.operation,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 573 | <code>            computationResult: artifact.payload?.result,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 574 | <code>            computationRowCount: artifact.payload?.rowCount,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 575 | <code>            computationNumericCount: artifact.payload?.numericCount,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 576 | <code>            computationSource: artifact.payload?.source,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 577 | <code>            contentChars: artifact.payload?.contentChars</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 578 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 579 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 580 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 581 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 582 | <code>function getEvidenceArtifactsPromptObject(artifacts = []) {</code> | 定义函数 `getEvidenceArtifactsPromptObject`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 583 | <code>    return normalizeArray(artifacts).map(getEvidenceArtifactPromptObject);</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 584 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 585 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 586 | <code>module.exports = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 587 | <code>    EVIDENCE_ARTIFACT_VERSION,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 588 | <code>    EVIDENCE_ARTIFACT_TYPES,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 589 | <code>    createEvidenceArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 590 | <code>    getEvidenceArtifactPromptObject,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 591 | <code>    getEvidenceArtifactsPromptObject,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 592 | <code>    validateEvidenceArtifact</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“Artifact 文档/表格/幻灯片/PDF 能力：导入、解析、变换、验证或证据化产物。”这一文件职责。 |
| 593 | <code>};</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
