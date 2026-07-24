# tests/ailis-agent-execution-flow.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。
- 文件类型：`source-code`
- 原始行数：2301
- SHA-256：`9ed0aaf8effff50d6802828faf13b216185a36f8987ba159345212627ffcaa9d`
- 可运行副本：[打开源文件](../../../source/tests/ailis-agent-execution-flow.test.mjs)
- 依赖：`node:assert/strict`、`node:module`、`node:test`、`../electron/ailis-agent-runner.cjs`
- 主要符号：`require`、`gateway`、`exactSpecs`、`ordinarySpecs`、`recoverySpecs`、`spec`、`specs`、`names`、`stepResults`、`explicitReasoner`、`payload`、`ordinaryPayload`、`explicitPayload`、`lowConfidenceToolCall`、`validation`、`futureToolCall`、`githubPagesCall`、`stepResult`、`refs`、`promptArtifacts`、`event`、`documentText`、`sufficiency`、`longSearchText`、`digest`、`artifact`、`rows`、`artifactText`、`parsed`、`script`、`evidenceRef`、`accepted`、`degraded`、`message`、`unsupported`、`audited`、`gap`、`coordinateOnly`、`relationVerified`、`reverseGap`、`recoveryGap`、`omitted`、`skipped`、`prioritized`、`note`、`discoveryNote`、`question`、`sourceArtifact`、`fileAttachments`、`incompleteStep`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 3 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 4 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 5 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 6 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 7 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 8 | <code>    attachAgentEvidenceArtifacts,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 9 | <code>    buildAgentDirectToolSpecs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 10 | <code>    buildAgentEvidenceArtifactsPromptObject,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 11 | <code>    buildEvidenceSufficiencyPromptObject,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 12 | <code>    buildFinalAnswerNativeToolSpec,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 13 | <code>    buildSourceQuestionEvidenceArtifact,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 14 | <code>    buildToolResultEvent,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 15 | <code>    buildToolObservationDigest,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 16 | <code>    buildLosslessToolObservationDigest,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 17 | <code>    buildAgentDecisionLowLatencyPayload,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 18 | <code>    buildExactAnswerRecoveryToolAffordanceNote,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 19 | <code>    canStartExactAnswerAuditRecovery,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 20 | <code>    isExactAnswerExecutionMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 21 | <code>    isAgentDecisionDeepThinkingMode,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 22 | <code>    isDeepThinkingAgentDecisionModel,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 23 | <code>    looksLikeSelfContainedExactAnswerQuestion,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 24 | <code>    normalizeExactAnswerSubmission,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 25 | <code>    resolveExactAnswerAuditFinalizationIteration,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 26 | <code>    resolveAgentDirectToolChoice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 27 | <code>    resolveAgentDecisionSettings,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 28 | <code>    resolveAgentDecisionTimeoutMs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 29 | <code>    resolveParallelToolCalls,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 30 | <code>    prioritizeExactAnswerRecoveryToolSpecs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 31 | <code>    sanitizeAgentToolCall,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 32 | <code>    selectExactAnswerAuditRecoveryGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 33 | <code>    detectNestedSelectorSelectionGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 34 | <code>    detectSelectorMetricEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 35 | <code>    detectSelectorTerminalRelationEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 36 | <code>    detectSelectorTerminalRelationAnswerMismatch,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 37 | <code>    detectVisualEnumerationEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 38 | <code>    detectAnswerSpecificityEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 39 | <code>    detectCompleteTitleEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 40 | <code>    detectRecordSelectorConjunctionEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 41 | <code>    detectStructuredAttachmentSemanticEvidenceGap,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 42 | <code>    detectStructuredRelationRecoveryCallGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 43 | <code>    detectVacuousDistributionConstraintGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 44 | <code>    detectRecommendedRecoveryActionGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 45 | <code>    validateExactAnswerSubmission,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 46 | <code>    validateNativeDirectToolCall</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 47 | <code>} = require('../electron/ailis-agent-runner.cjs');</code> | 导入依赖 `../electron/ailis-agent-runner.cjs`，使本文件可以复用外部模块能力。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 48 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 49 | <code>test('Agent execution flow detects exact-answer evaluation mode', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 50 | <code>    assert.equal(isExactAnswerExecutionMode({}, { answerOnly: true }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 51 | <code>    assert.equal(isExactAnswerExecutionMode({}, { exactAnswerMode: true }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 52 | <code>    assert.equal(isExactAnswerExecutionMode({ exact_answer_mode: true }, {}), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 53 | <code>    assert.equal(isExactAnswerExecutionMode({}, { executionProfile: { kind: 'exact_answer_eval' } }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 54 | <code>    assert.equal(isExactAnswerExecutionMode({}, { evaluationTaskId: 'gaia-task' }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 55 | <code>    assert.equal(isExactAnswerExecutionMode({}, {}), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 56 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 57 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 58 | <code>test('Agent direct tool specs inject native final_answer for exact-answer mode but not ordinary tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 59 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 60 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 61 | <code>            modelVisibleSpecs: () =&gt; [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 62 | <code>                name: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 63 | <code>                description: 'Search for tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 64 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 65 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 66 | <code>                    properties: { query: { type: 'string' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 67 | <code>                    required: ['query']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 68 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 69 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 70 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 71 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 72 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 73 | <code>    const exactSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `exactSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 74 | <code>        requestContext: {},</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 75 | <code>        exactAnswerMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 76 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 77 | <code>    assert.equal(exactSpecs.at(-1).name, 'final_answer');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 78 | <code>    assert.ok(exactSpecs.some((spec) =&gt; spec.name === 'tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 79 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 80 | <code>    const ordinarySpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `ordinarySpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 81 | <code>        requestContext: {},</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 82 | <code>        exactAnswerMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 83 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>    assert.equal(ordinarySpecs.some((spec) =&gt; spec.name === 'final_answer'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 85 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 86 | <code>    const recoverySpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `recoverySpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 87 | <code>        requestContext: {},</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 88 | <code>        exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 89 | <code>        suppressFinalAnswer: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 90 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>    assert.equal(recoverySpecs.some((spec) =&gt; spec.name === 'final_answer'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 92 | <code>    assert.ok(recoverySpecs.some((spec) =&gt; spec.name === 'tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 93 | <code>    assert.equal(resolveAgentDirectToolChoice({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 94 | <code>        directToolSpecs: recoverySpecs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 95 | <code>        requireToolAction: true</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 96 | <code>    }), 'required');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 97 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 98 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 99 | <code>test('Agent direct tool specs expose registered tools consistently for artifact tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 100 | <code>    const spec = (name) =&gt; ({</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 101 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 102 | <code>        description: `${name} spec`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 103 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 104 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 105 | <code>            additionalProperties: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 106 | <code>            properties: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 107 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 108 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 110 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 111 | <code>            modelVisibleSpecs: () =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 112 | <code>                spec('artifact_tools'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 113 | <code>                spec('tool_search'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 114 | <code>                spec('update_plan'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 115 | <code>                spec('request_permissions'),</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 116 | <code>                spec('artifact_query'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 117 | <code>                spec('artifact_import'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 118 | <code>                spec('mcp__ailis_research__read_spreadsheet')</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 119 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 120 | <code>            definition: (toolId) =&gt; (toolId === 'artifact_tools' ? { spec: spec('artifact_tools') } : null)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 121 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 122 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 123 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 124 | <code>    const specs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 125 | <code>        requestContext: { taskCompactPrompt: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 126 | <code>        exactAnswerMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 127 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 128 | <code>    const names = specs.map((entry) =&gt; entry.name);</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 129 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 130 | <code>    assert.ok(names.includes('artifact_tools'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 131 | <code>    assert.equal(names.includes('final_answer'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 132 | <code>    assert.ok(names.includes('request_permissions'));</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 133 | <code>    assert.ok(names.includes('tool_search'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 134 | <code>    assert.ok(names.includes('update_plan'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 135 | <code>    assert.ok(names.includes('artifact_query'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 136 | <code>    assert.ok(names.includes('artifact_import'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 137 | <code>    assert.equal(names.includes('artifact_compute'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 138 | <code>    assert.ok(names.includes('mcp__ailis_research__read_spreadsheet'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 139 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 140 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 141 | <code>test('Agent direct tool specs keep artifact tools available without forcing final_answer after query evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 142 | <code>    const spec = (name) =&gt; ({</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 143 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 144 | <code>        description: `${name} spec`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 145 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 146 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 147 | <code>            additionalProperties: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 148 | <code>            properties: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 149 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 151 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 152 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 153 | <code>            modelVisibleSpecs: () =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 154 | <code>                spec('artifact_tools'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 155 | <code>                spec('exec'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 156 | <code>                spec('read'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 157 | <code>                spec('write'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 158 | <code>                spec('apply_patch'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 159 | <code>                spec('request_permissions')</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 160 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 161 | <code>            definition: (toolId) =&gt; (toolId === 'artifact_tools' ? { spec: spec('artifact_tools') } : null)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 162 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 163 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 164 | <code>    const stepResults = [{</code> | 声明局部标识符 `stepResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 165 | <code>        id: 'query-grid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 166 | <code>        tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 167 | <code>        args: { action: 'query', sessionId: 'arts_fixture', sheet: 'Sheet1', range: 'A1:I20' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 168 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 169 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 170 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 171 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 172 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 173 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 174 | <code>                    text: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 175 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 176 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 177 | <code>                        action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 178 | <code>                        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 179 | <code>                            action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 180 | <code>                            sheetName: 'Sheet1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 181 | <code>                            range: 'Sheet1!A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 182 | <code>                            rowCount: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 183 | <code>                            columnCount: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 184 | <code>                            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 185 | <code>                            compactRows: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 186 | <code>                                { rowNumber: 1, cells: 'START &#124; #0099FF' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 187 | <code>                                { rowNumber: 2, cells: '#92D050 &#124; END' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 188 | <code>                            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 189 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>                    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 191 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 192 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 193 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 194 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 196 | <code>    const specs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 197 | <code>        stepResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 198 | <code>        requestContext: { taskCompactPrompt: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 199 | <code>        exactAnswerMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 200 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 201 | <code>    const names = specs.map((entry) =&gt; entry.name);</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 202 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 203 | <code>    assert.equal(names.includes('final_answer'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 204 | <code>    assert.ok(names.includes('artifact_tools'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 205 | <code>    assert.ok(names.includes('exec'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 206 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 207 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 208 | <code>test('Agent direct tool specs keep artifact tools available without forcing final_answer after range inspect evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 209 | <code>    const spec = (name) =&gt; ({</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 210 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 211 | <code>        description: `${name} spec`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 212 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 213 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 214 | <code>            additionalProperties: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 215 | <code>            properties: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 216 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 217 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 218 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 219 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 220 | <code>            modelVisibleSpecs: () =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 221 | <code>                spec('artifact_tools'),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 222 | <code>                spec('exec'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 223 | <code>                spec('read'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 224 | <code>                spec('write'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 225 | <code>                spec('apply_patch'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 226 | <code>                spec('request_permissions')</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 227 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 228 | <code>            definition: (toolId) =&gt; (toolId === 'artifact_tools' ? { spec: spec('artifact_tools') } : null)</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 229 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 230 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 231 | <code>    const stepResults = [{</code> | 声明局部标识符 `stepResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 232 | <code>        id: 'inspect-grid',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 233 | <code>        tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 234 | <code>        args: { action: 'inspect', sessionId: 'arts_fixture', sheet: 'Sheet1', range: 'A1:I20' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 235 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 236 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 237 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 238 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 239 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 240 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 241 | <code>                    text: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 242 | <code>                        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 243 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 244 | <code>                        action: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 245 | <code>                        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 246 | <code>                            action: 'inspect',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 247 | <code>                            kind: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 248 | <code>                            sheetName: 'Sheet1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 249 | <code>                            range: 'Sheet1!A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 250 | <code>                            rowCount: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 251 | <code>                            columnCount: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 252 | <code>                            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 253 | <code>                            matrixRows: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 254 | <code>                                { rowNumber: 1, values: ['START', ''], fills: ['', '0099FF'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 255 | <code>                                { rowNumber: 2, values: ['', 'END'], fills: ['92D050', ''] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 256 | <code>                            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 257 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 258 | <code>                    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 259 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 261 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 262 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 264 | <code>    const specs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 265 | <code>        stepResults,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 266 | <code>        requestContext: { taskCompactPrompt: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 267 | <code>        exactAnswerMode: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 268 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>    const names = specs.map((entry) =&gt; entry.name);</code> | 声明局部标识符 `names`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 270 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 271 | <code>    assert.equal(names.includes('final_answer'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 272 | <code>    assert.ok(names.includes('artifact_tools'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 273 | <code>    assert.ok(names.includes('exec'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 274 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 275 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 276 | <code>test('Agent decision timeout gives artifact and exact-answer tasks a 300s budget', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 277 | <code>    assert.equal(resolveAgentDecisionTimeoutMs({}, {}), 120000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 278 | <code>    assert.equal(resolveAgentDecisionTimeoutMs({}, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 279 | <code>        requestContext: { taskCompactPrompt: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 280 | <code>    }), 300000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 281 | <code>    assert.equal(resolveAgentDecisionTimeoutMs({}, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 282 | <code>        requestContext: { exactAnswerMode: true }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 283 | <code>    }), 300000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 284 | <code>    assert.equal(resolveAgentDecisionTimeoutMs({}, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 285 | <code>        stepResults: [{ tool: 'artifact_tools', response: { ok: true } }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 286 | <code>    }), 300000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 287 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 288 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 289 | <code>test('Agent decision model routing avoids deep-thinking models unless explicit or unavoidable', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 290 | <code>    assert.equal(isDeepThinkingAgentDecisionModel('deepseek-reasoner'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 291 | <code>    assert.equal(isDeepThinkingAgentDecisionModel('doubao-seed-1-6-thinking-250715'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 292 | <code>    assert.equal(isDeepThinkingAgentDecisionModel('openai/o4-mini'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 293 | <code>    assert.equal(isDeepThinkingAgentDecisionModel('kimi-k2.7-code'), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 294 | <code>    assert.equal(isDeepThinkingAgentDecisionModel('deepseek-chat'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 295 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 296 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 297 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 298 | <code>            model: resolveAgentDecisionSettings({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 299 | <code>                model: 'deepseek-reasoner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 300 | <code>                lowLatencyModel: 'deepseek-chat'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 301 | <code>            }).model,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 302 | <code>            source: resolveAgentDecisionSettings({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 303 | <code>                model: 'deepseek-reasoner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 304 | <code>                lowLatencyModel: 'deepseek-chat'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 305 | <code>            })._agentDecisionModelSource</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 306 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>        { model: 'deepseek-chat', source: 'settings.lowLatencyModel' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 308 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 310 | <code>    const explicitReasoner = resolveAgentDecisionSettings({</code> | 声明局部标识符 `explicitReasoner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 311 | <code>        model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 312 | <code>        agentDecisionModel: 'o4-mini'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 313 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 314 | <code>    assert.equal(explicitReasoner.model, 'o4-mini');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 315 | <code>    assert.equal(explicitReasoner._agentDecisionModelExplicit, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 316 | <code>    assert.equal(explicitReasoner._agentDecisionDeepThinkingModel, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 317 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 318 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 319 | <code>test('Agent decision parallel tool calls follow provider capability with explicit overrides', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 320 | <code>    assert.equal(resolveParallelToolCalls({ provider: 'deepseek', model: 'deepseek-chat' }, {}), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 321 | <code>    assert.equal(resolveParallelToolCalls({ provider: 'doubao', model: 'doubao-seed-1-6' }, {}), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 322 | <code>    assert.equal(resolveParallelToolCalls({ provider: 'ollama', model: 'llama3.2' }, {}), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 323 | <code>    assert.equal(resolveParallelToolCalls({ provider: 'ollama', model: 'llama3.2' }, { parallelToolCalls: true }), true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 324 | <code>    assert.equal(resolveParallelToolCalls({ provider: 'deepseek', model: 'deepseek-chat' }, { disableParallelToolCalls: true }), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 325 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 326 | <code>    const payload = buildAgentDecisionLowLatencyPayload(</code> | 声明局部标识符 `payload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 327 | <code>        { messages: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 328 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 329 | <code>            settings: { provider: 'deepseek', model: 'deepseek-chat' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 330 | <code>            requestContext: {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 331 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 332 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 333 | <code>    assert.equal(payload.parallel_tool_calls, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 334 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 335 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 336 | <code>test('Agent decision thinking controls are explicit and deep-thinking mode gets a 10 minute timeout', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 337 | <code>    const ordinaryPayload = buildAgentDecisionLowLatencyPayload(</code> | 声明局部标识符 `ordinaryPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 338 | <code>        { messages: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 339 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 340 | <code>            settings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 341 | <code>                model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 342 | <code>                reasoningEffort: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 343 | <code>                thinking: { type: 'enabled' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 344 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 345 | <code>            requestContext: {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 346 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 347 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 348 | <code>    assert.equal(Object.hasOwn(ordinaryPayload, 'reasoning_effort'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 349 | <code>    assert.equal(Object.hasOwn(ordinaryPayload, 'thinking'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 350 | <code>    assert.equal(isAgentDecisionDeepThinkingMode({ model: 'deepseek-chat' }, {}), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 351 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 352 | <code>    const explicitPayload = buildAgentDecisionLowLatencyPayload(</code> | 声明局部标识符 `explicitPayload`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 353 | <code>        { messages: [] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 354 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 355 | <code>            settings: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 356 | <code>                model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 357 | <code>                agentDecisionReasoningEffort: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 358 | <code>                agentDecisionThinking: { type: 'enabled' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 359 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 360 | <code>            requestContext: {}</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 361 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 362 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 363 | <code>    assert.equal(explicitPayload.reasoning_effort, 'high');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 364 | <code>    assert.deepEqual(explicitPayload.thinking, { type: 'enabled' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 365 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 366 | <code>        resolveAgentDecisionTimeoutMs({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 367 | <code>            model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 368 | <code>            agentDecisionReasoningEffort: 'high'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 369 | <code>        }, {}),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 370 | <code>        600000</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 371 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 372 | <code>    assert.equal(resolveAgentDecisionTimeoutMs({ model: 'o3' }, {}), 600000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 373 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 374 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 375 | <code>test('final_answer contract reminds relation tasks to verify answer role alignment', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 376 | <code>    const spec = buildFinalAnswerNativeToolSpec();</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 377 | <code>    assert.match(spec.description, /role alignment/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 378 | <code>    assert.match(spec.description, /QuestionEvidence\/source_question/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 379 | <code>    assert.match(spec.description, /candidate set/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 380 | <code>    assert.match(spec.description, /partial viewport/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 381 | <code>    assert.match(spec.parameters.properties.reason.description, /target role/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 382 | <code>    assert.match(spec.parameters.properties.reason.description, /relation table direction/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 383 | <code>    assert.match(spec.parameters.properties.reason.description, /candidate-set boundary/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 384 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 385 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 386 | <code>test('final_answer native tool contract keeps answer required but does not hard-gate audit metadata', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 387 | <code>    const spec = buildFinalAnswerNativeToolSpec();</code> | 声明局部标识符 `spec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 388 | <code>    assert.deepEqual(spec.parameters.required, ['answer']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 389 | <code>    assert.equal(spec.parameters.additionalProperties, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 390 | <code>    assert.equal(Object.hasOwn(spec.parameters.properties.confidence, 'enum'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 391 | <code>    assert.equal(Object.hasOwn(spec.parameters.properties.evidence_refs, 'minItems'), false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 392 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 393 | <code>    const lowConfidenceToolCall = {</code> | 声明局部标识符 `lowConfidenceToolCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 394 | <code>        name: 'final_answer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 395 | <code>        arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 396 | <code>            answer: 'I need to first inspect the Excel file to understand the map layout.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 397 | <code>            confidence: 'low',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 398 | <code>            evidence_refs: [],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 399 | <code>            repair_instruction: 'Need to inspect the Excel file first.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 400 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 402 | <code>    const validation = validateNativeDirectToolCall(lowConfidenceToolCall, [spec]);</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 403 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 404 | <code>    assert.equal(validation.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 405 | <code>    assert.deepEqual(validation.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 406 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 407 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 408 | <code>test('Agent tool-call sanitizer does not maintain a hardcoded runtime tool whitelist', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 409 | <code>    const futureToolCall = sanitizeAgentToolCall({</code> | 声明局部标识符 `futureToolCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 410 | <code>        tool_call: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 411 | <code>            tool: 'future_runtime_tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 412 | <code>            title: 'Use future tool',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 413 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 414 | <code>                example: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 415 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 416 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    }, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 418 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 419 | <code>    assert.equal(futureToolCall.tool, 'future_runtime_tool');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 420 | <code>    assert.equal(futureToolCall.args.example, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 421 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 422 | <code>    const githubPagesCall = sanitizeAgentToolCall({</code> | 声明局部标识符 `githubPagesCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 423 | <code>        tool: 'github_pages',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 424 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 425 | <code>            action: 'diagnose_publish',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 426 | <code>            path: '.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 427 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 428 | <code>    }, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 429 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 430 | <code>    assert.equal(githubPagesCall.tool, 'github_pages');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 431 | <code>    assert.equal(sanitizeAgentToolCall({ args: {} }, 3), null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 432 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 433 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 434 | <code>test('Agent tool observations become evidence artifacts and turn refs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 435 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 436 | <code>        id: 'step-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 437 | <code>        title: 'Read spreadsheet',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 438 | <code>        tool: 'mcp__ailis_research__read_spreadsheet',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 439 | <code>        args: { path: 'scores.xlsx', action: 'read_spreadsheet' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 440 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 441 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 442 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 443 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 444 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 445 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 446 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 447 | <code>                    text: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 448 | <code>                        shape: [10, 3],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 449 | <code>                        numeric_sums: { score: 90 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 450 | <code>                        total_numeric_sum: 90</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 451 | <code>                    })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 452 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 453 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 454 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 455 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 456 | <code>        taskType: 'exact_answer_eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 457 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 458 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 459 | <code>    assert.equal(stepResult.evidenceArtifacts.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 460 | <code>    const refs = stepResult.evidenceArtifacts.map((artifact) =&gt; artifact.id);</code> | 声明局部标识符 `refs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 461 | <code>    const promptArtifacts = buildAgentEvidenceArtifactsPromptObject([stepResult]);</code> | 声明局部标识符 `promptArtifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 462 | <code>    assert.deepEqual(promptArtifacts.map((artifact) =&gt; artifact.id), refs);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>    const event = buildToolResultEvent(stepResult);</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 465 | <code>    assert.deepEqual(event.evidenceRefs, refs);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 466 | <code>    assert.equal(event.evidenceArtifacts.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 467 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 469 | <code>test('Agent tool result events preserve complete structured document table previews', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 470 | <code>    const documentText = [</code> | 声明局部标识符 `documentText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 471 | <code>        '# DOCUMENT_READ_COMPLETE',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 472 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 473 | <code>        'paragraph_count: 40',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 474 | <code>        'table_count: 1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 475 | <code>        'truncated: false',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 476 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 477 | <code>        '## Paragraphs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 478 | <code>        '[0] Employees',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 479 | <code>        ...Array.from({ length: 120 }, (_, index) =&gt; `[${index + 1}] ${'profile '.repeat(6)}${index}`),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 480 | <code>        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 481 | <code>        '## Tables',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 482 | <code>        'Table 1 rows=13',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 483 | <code>        'Giftee &#124; Recipient',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 484 | <code>        'Harry &#124; Miguel',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 485 | <code>        'Fred &#124; Rebecca',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 486 | <code>        'Alex &#124; Tyson'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 487 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 488 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 489 | <code>    const event = buildToolResultEvent({</code> | 声明局部标识符 `event`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 490 | <code>        id: 'step-docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 491 | <code>        title: 'Read DOCX',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 492 | <code>        tool: 'mcp__ailis_research__read_document',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 493 | <code>        args: { path: 'task.docx' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 494 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 495 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 496 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 497 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 498 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 499 | <code>                content: [{ type: 'text', text: documentText }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 500 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 501 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 502 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 503 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 504 | <code>                    paragraphCount: 40,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 505 | <code>                    tableCount: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 506 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 507 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 508 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 509 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 510 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 511 | <code>    assert.match(event.preview, /Alex \&#124; Tyson/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 512 | <code>    assert.doesNotMatch(event.preview, /Alex \&#124; T\.\.\./);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 513 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 514 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 515 | <code>test('Agent evidence artifacts preserve context artifact coverage metadata', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 516 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 517 | <code>        id: 'step-artifact-range',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 518 | <code>        title: 'Query workbook range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 519 | <code>        tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 520 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 521 | <code>            action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 522 | <code>            artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 523 | <code>            sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 524 | <code>            range: 'A1:I20'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 525 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>        iteration: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 527 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 528 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 529 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 530 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 531 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 532 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 533 | <code>                    text: 'SPREADSHEET_RANGE sheet="Map" range=A1:I20\ntruncated=false; complete=true; reasoning_ready=true'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 534 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 536 | <code>                    action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 537 | <code>                    artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 538 | <code>                    sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 539 | <code>                    range: 'A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 540 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 541 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 542 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 543 | <code>                    pinnedEvidenceId: 'ev-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 544 | <code>                    coverage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 545 | <code>                        kind: 'spreadsheet_range_coverage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 546 | <code>                        queryAction: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 547 | <code>                        sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 548 | <code>                        range: 'A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 549 | <code>                        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 550 | <code>                        truncated: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 551 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 552 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 553 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 554 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 555 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 556 | <code>        taskType: 'exact_answer_eval'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 557 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 558 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 559 | <code>    assert.equal(stepResult.evidenceArtifacts.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 560 | <code>    const promptArtifacts = buildAgentEvidenceArtifactsPromptObject([stepResult]);</code> | 声明局部标识符 `promptArtifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 561 | <code>    assert.equal(promptArtifacts[0].payload.artifactId, 'ctx-spreadsheet-demo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 562 | <code>    assert.equal(promptArtifacts[0].payload.sheet, 'Map');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 563 | <code>    assert.equal(promptArtifacts[0].payload.range, 'A1:I20');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 564 | <code>    assert.equal(promptArtifacts[0].payload.complete, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 565 | <code>    assert.equal(promptArtifacts[0].payload.truncated, false);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 566 | <code>    assert.equal(promptArtifacts[0].payload.reasoningReady, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 567 | <code>    assert.equal(promptArtifacts[0].payload.pinnedEvidenceId, 'ev-demo');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 568 | <code>    assert.equal(promptArtifacts[0].payload.coverage.range, 'A1:I20');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 569 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 570 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 571 | <code>test('Agent evidence sufficiency gate summarizes ready artifact and compute evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 572 | <code>    const stepResults = [{</code> | 声明局部标识符 `stepResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 573 | <code>        id: 'step-range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 574 | <code>        title: 'Query workbook range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 575 | <code>        tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 576 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 577 | <code>            action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 578 | <code>            artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 579 | <code>            sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 580 | <code>            range: 'A1:I20'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 581 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 582 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 583 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 584 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 585 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 586 | <code>                content: [{ type: 'text', text: 'complete range evidence' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 587 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 588 | <code>                    action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 589 | <code>                    artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 590 | <code>                    sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 591 | <code>                    range: 'A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 592 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 593 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 594 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 595 | <code>                    pinnedEvidenceId: 'ev-range',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 596 | <code>                    coverage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 597 | <code>                        kind: 'spreadsheet_range_coverage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 598 | <code>                        queryAction: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 599 | <code>                        sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 600 | <code>                        range: 'A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 601 | <code>                        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 602 | <code>                        truncated: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 603 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 604 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 605 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 606 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 607 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 608 | <code>        id: 'step-covered',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 609 | <code>        title: 'Query covered subrange',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 610 | <code>        tool: 'artifact_query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 611 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 612 | <code>            action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 613 | <code>            artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 614 | <code>            sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 615 | <code>            range: 'B2:C3'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 616 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 617 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 618 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 619 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 620 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 621 | <code>                content: [{ type: 'text', text: 'covered subrange evidence' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 622 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 623 | <code>                    action: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 624 | <code>                    artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 625 | <code>                    sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 626 | <code>                    range: 'B2:C3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 627 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 628 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 629 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 630 | <code>                    coveredByEvidence: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 631 | <code>                        evidenceId: 'ev-range',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 632 | <code>                        sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 633 | <code>                        range: 'A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 634 | <code>                        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 635 | <code>                        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 636 | <code>                        reasoningReady: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 637 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 638 | <code>                    coverage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 639 | <code>                        kind: 'spreadsheet_range_coverage',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 640 | <code>                        queryAction: 'range',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 641 | <code>                        sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 642 | <code>                        range: 'B2:C3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 643 | <code>                        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 644 | <code>                        truncated: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 645 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 646 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 647 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 648 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 649 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 650 | <code>        id: 'step-compute',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 651 | <code>        title: 'Compute path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 652 | <code>        tool: 'artifact_compute',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 653 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 654 | <code>            action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 655 | <code>            artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 656 | <code>            sheet: 'Map'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 657 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 658 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 659 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 660 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 661 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 662 | <code>                content: [{ type: 'text', text: 'pathFound=true steps=12' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 663 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 664 | <code>                    action: 'find_path',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 665 | <code>                    artifactId: 'ctx-spreadsheet-demo',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 666 | <code>                    sheet: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 667 | <code>                    range: 'A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 668 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 669 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 670 | <code>                    reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 671 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 672 | <code>                        pathFound: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 673 | <code>                        steps: 12,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 674 | <code>                        visited: 35,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 675 | <code>                        pathTruncated: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 676 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 677 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 678 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 679 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 680 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 681 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 682 | <code>    const sufficiency = buildEvidenceSufficiencyPromptObject(stepResults, { exactAnswerMode: true });</code> | 声明局部标识符 `sufficiency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 683 | <code>    assert.equal(sufficiency.status, 'model_judges_evidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 684 | <code>    assert.equal(sufficiency.ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 685 | <code>    assert.equal(sufficiency.exact_answer_mode, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 686 | <code>    assert.equal(sufficiency.ready_evidence_count, 3);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 687 | <code>    assert.equal(sufficiency.has_compute_evidence, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 688 | <code>    assert.equal(sufficiency.repeated_covered_reads[0].coveredByEvidence.evidenceId, 'ev-range');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 689 | <code>    assert.equal(sufficiency.latest_ready_evidence.resultSummary.pathFound, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 690 | <code>    assert.equal(sufficiency.latest_ready_evidence.resultSummary.steps, 12);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 691 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 692 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 693 | <code>test('Agent evidence sufficiency treats complete parsed documents as reasoning-ready evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 694 | <code>    const stepResults = [{</code> | 声明局部标识符 `stepResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 695 | <code>        id: 'step-docx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 696 | <code>        title: 'Read DOCX',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 697 | <code>        tool: 'mcp__ailis_research__read_document',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 698 | <code>        args: { path: 'task.docx' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 699 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 700 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 701 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 702 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 703 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 704 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 705 | <code>                    text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 706 | <code>                        '# DOCUMENT_READ_COMPLETE',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 707 | <code>                        'paragraph_count: 3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 708 | <code>                        'table_count: 1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 709 | <code>                        'truncated: false',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 710 | <code>                        '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 711 | <code>                        '## Tables',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 712 | <code>                        'Table 1 rows=2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 713 | <code>                        'Giver &#124; Recipient',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 714 | <code>                        'Fred &#124; Rebecca'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 715 | <code>                    ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 716 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 717 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 718 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 719 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 720 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 721 | <code>    const sufficiency = buildEvidenceSufficiencyPromptObject(stepResults, { exactAnswerMode: true });</code> | 声明局部标识符 `sufficiency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 722 | <code>    assert.equal(sufficiency.status, 'model_judges_evidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 723 | <code>    assert.equal(sufficiency.ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 724 | <code>    assert.equal(sufficiency.ready_evidence[0].tool, 'mcp__ailis_research__read_document');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 725 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 727 | <code>test('Agent evidence sufficiency unwraps nested MCP structuredContent readiness', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 728 | <code>    const stepResults = [{</code> | 声明局部标识符 `stepResults`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 729 | <code>        id: 'step-web-fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 730 | <code>        title: 'Fetch evidence page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 731 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 732 | <code>        args: { url: 'https://example.test/evidence' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 733 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 734 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 735 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 736 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 737 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 738 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 739 | <code>                    server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 740 | <code>                    tool: 'web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 741 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 742 | <code>                        structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 743 | <code>                            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 744 | <code>                            url: 'https://example.test/evidence',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 745 | <code>                            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 746 | <code>                            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 747 | <code>                            reasoningReady: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 748 | <code>                            evidenceQuality: 'sufficient_evidence',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 749 | <code>                            observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 750 | <code>                                complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 751 | <code>                                truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 752 | <code>                                reasoning_ready: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 753 | <code>                                evidence_quality: 'sufficient_evidence'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 754 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 755 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 756 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 757 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 758 | <code>                content: [{ type: 'text', text: 'ready web evidence' }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 759 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 760 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 761 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 762 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 763 | <code>    const sufficiency = buildEvidenceSufficiencyPromptObject(stepResults, { exactAnswerMode: true });</code> | 声明局部标识符 `sufficiency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 764 | <code>    assert.equal(sufficiency.status, 'model_judges_evidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 765 | <code>    assert.equal(sufficiency.ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 766 | <code>    assert.equal(sufficiency.ready_evidence_count, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 767 | <code>    assert.equal(sufficiency.audit_required, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 768 | <code>    assert.equal(sufficiency.evidence_audit_candidates.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 769 | <code>    assert.equal(sufficiency.evidence_audit_candidates[0].tool, 'mcp__ailis_research__web_fetch');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 770 | <code>    assert.equal(sufficiency.evidence_audit_contract, null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 771 | <code>    assert.equal(sufficiency.ready_evidence[0].tool, 'mcp__ailis_research__web_fetch');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 772 | <code>    assert.equal(sufficiency.ready_evidence[0].coverage.reasoningReady, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 773 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 774 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 775 | <code>test('Agent model-facing observation digest stays compact and artifact-backed', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 776 | <code>    const longSearchText = Array.from({ length: 80 }, (_, index) =&gt;</code> | 声明局部标识符 `longSearchText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 777 | <code>        `${index + 1}. Result ${index}\nURL: https://example.test/${index}\nSnippet: ${'long snippet '.repeat(40)}`</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 778 | <code>    ).join('\n\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 779 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 780 | <code>        id: 'step-long',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 781 | <code>        title: 'Search noisy web results',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 782 | <code>        tool: 'mcp__ailis_research__web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 783 | <code>        args: { query: 'noisy query' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 784 | <code>        iteration: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 785 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 786 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 787 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 788 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 789 | <code>                content: [{ type: 'text', text: longSearchText }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 790 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 791 | <code>                    rows: Array.from({ length: 200 }, (_, index) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 792 | <code>                        index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 793 | <code>                        text: `${longSearchText} ${index}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 794 | <code>                    }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 795 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 796 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 797 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 798 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 800 | <code>    const digest = buildLosslessToolObservationDigest([stepResult]);</code> | 声明局部标识符 `digest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 801 | <code>    assert.equal(digest.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 802 | <code>    assert.ok(digest[0].text.length &lt;= 1200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 803 | <code>    assert.ok(JSON.stringify(digest[0].details).length &lt; 1800);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 804 | <code>    assert.deepEqual(digest[0].evidenceRefs, stepResult.evidenceArtifacts.map((artifact) =&gt; artifact.id));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 805 | <code>    assert.equal(stepResult.evidenceArtifacts[0].type, 'ResearchSourceEvidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 806 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code>test('Agent registers deterministic table aggregation as ComputationEvidence without making it a finalization gate', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 809 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 810 | <code>        id: 'step-aggregate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 811 | <code>        title: 'Aggregate workbook revenue',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 812 | <code>        tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 813 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 814 | <code>            action: 'aggregate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 815 | <code>            path: 'sales.xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 816 | <code>            table: 'SalesTable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 817 | <code>            aggregate: { op: 'sum', column: 'Revenue' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 818 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 819 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 820 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 821 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 822 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 823 | <code>                content: [{ type: 'text', text: '{"aggregateResult":{"value":91}}' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 824 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 825 | <code>                    query: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 826 | <code>                        filter: null,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 827 | <code>                        groupBy: '',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 828 | <code>                        aggregateResult: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 829 | <code>                            op: 'sum',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 830 | <code>                            column: 'Revenue',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 831 | <code>                            value: 91,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 832 | <code>                            rowCount: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 833 | <code>                            numericCount: 3</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 834 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 835 | <code>                        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 836 | <code>                            semanticLevel: 'computation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 837 | <code>                            complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 838 | <code>                            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 839 | <code>                            computation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 840 | <code>                                deterministic: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 841 | <code>                                operation: 'sum',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 842 | <code>                                column: 'Revenue',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 843 | <code>                                value: 91,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 844 | <code>                                rowCount: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 845 | <code>                                numericCount: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 846 | <code>                                source: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 847 | <code>                                    path: 'sales.xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 848 | <code>                                    table: 'SalesTable',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 849 | <code>                                    sheet: 'Data',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 850 | <code>                                    range: 'A1:D4'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 851 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 852 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 853 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 854 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 855 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 856 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 857 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 858 | <code>                    complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 859 | <code>                    truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 860 | <code>                    observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 861 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 862 | <code>                        semantic_level: 'computation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 863 | <code>                        complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 864 | <code>                        truncated: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 865 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 866 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 867 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 868 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 869 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 870 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 871 | <code>    assert.equal(stepResult.evidenceArtifacts.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 872 | <code>    assert.equal(stepResult.evidenceArtifacts[0].type, 'ComputationEvidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 873 | <code>    assert.equal(stepResult.evidenceArtifacts[0].payload.deterministic, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 874 | <code>    assert.equal(stepResult.evidenceArtifacts[0].payload.operation, 'sum');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 875 | <code>    assert.equal(stepResult.evidenceArtifacts[0].payload.result, 91);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 876 | <code>    assert.equal(stepResult.evidenceArtifacts[0].payload.source.table, 'SalesTable');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 877 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 878 | <code>    const sufficiency = buildEvidenceSufficiencyPromptObject([stepResult], { exactAnswerMode: true });</code> | 声明局部标识符 `sufficiency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 879 | <code>    assert.equal(sufficiency.has_compute_evidence, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 880 | <code>    assert.match(sufficiency.computation_guidance, /advisory/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 881 | <code>    assert.match(sufficiency.computation_guidance, /must never suppress/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 882 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 883 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 884 | <code>test('Research source evidence does not infer local paths from URL markup or prose', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 885 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 886 | <code>        id: 'step-web-source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 887 | <code>        title: 'Open research source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 888 | <code>        tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 889 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 890 | <code>            open: [{ ref_id: 'turn0search1' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 891 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 892 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 893 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 894 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 895 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 896 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 897 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 898 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 899 | <code>                    text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 900 | <code>                        '&lt;truncated omitted_approx_tokens="521" /&gt;',</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 901 | <code>                        'URL: https://journal.finfar.org/articles/dragons-are-tricksy/',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 902 | <code>                        'Retry without optional recency/domain filters.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 903 | <code>                    ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 904 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 905 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 906 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 907 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 908 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 909 | <code>    const artifact = stepResult.evidenceArtifacts[0];</code> | 声明局部标识符 `artifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 910 | <code>    assert.equal(artifact.type, 'ResearchSourceEvidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 911 | <code>    assert.equal(artifact.payload.sourceKind, 'url');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 912 | <code>    assert.equal(artifact.payload.url, 'https://journal.finfar.org/articles/dragons-are-tricksy/');</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 913 | <code>    assert.equal(artifact.payload.path, '');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 914 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 915 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 916 | <code>test('Research source evidence does not infer a Windows path from escaped output text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 917 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 918 | <code>        id: 'step-chess-analysis',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 919 | <code>        title: 'mcp__ailis_research__chess_position_analyze',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 920 | <code>        tool: 'mcp__ailis_research__chess_position_analyze',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 921 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 922 | <code>            fen: '3r2k1/pp3pp1/4b2p/7Q/3n4/PqBBR2P/5PP1/6K1 b - - 0 1'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 923 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 924 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 925 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 926 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 927 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 928 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 929 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 930 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 931 | <code>                    text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 932 | <code>                        'Status: completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 933 | <code>                        'Output:\\nbest_move_san=Rd5',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 934 | <code>                        'board_echo:\\n   +------------------------+'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 935 | <code>                    ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 936 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 937 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 938 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 939 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 940 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 941 | <code>    const artifact = stepResult.evidenceArtifacts[0];</code> | 声明局部标识符 `artifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 942 | <code>    assert.equal(artifact.type, 'ResearchSourceEvidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 943 | <code>    assert.equal(artifact.payload.sourceKind, 'observation');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 944 | <code>    assert.equal(artifact.payload.path, '');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 945 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 946 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 947 | <code>test('Agent tool observations keep small artifact query compactRows lossless', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 948 | <code>    const rows = Array.from({ length: 20 }, (_, index) =&gt; ({</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 949 | <code>        rowNumber: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 950 | <code>        cells: index === 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 951 | <code>            ? 'START &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 952 | <code>            : (index === 19</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 953 | <code>                ? '#0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #92D050 &#124; END'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 954 | <code>                : `#F478A7 &#124; #0099FF &#124; #0099FF &#124; #0099FF &#124; #F478A7 &#124; #FFFF00 &#124; #92D050 &#124; #92D050 &#124; #0099FF row-${index + 1}`)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 955 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 956 | <code>    const artifactText = JSON.stringify({</code> | 声明局部标识符 `artifactText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 957 | <code>        schema: 'ailis.artifact_tools.tool_api_result.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 958 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 959 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 960 | <code>        action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 961 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 962 | <code>        artifact: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 963 | <code>            sessionId: 'arts_fixture',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 964 | <code>            artifactId: 'art_fixture',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 965 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 966 | <code>            kind: 'workbook'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 967 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 968 | <code>        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 969 | <code>            schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 970 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 971 | <code>            action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 972 | <code>            sheetName: 'Sheet1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 973 | <code>            range: 'Sheet1!A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 974 | <code>            requestedRange: 'Sheet1!A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 975 | <code>            usedRange: 'Sheet1!A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 976 | <code>            returnedRange: 'Sheet1!A1:I20',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 977 | <code>            rowCount: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 978 | <code>            columnCount: 9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 979 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 980 | <code>            columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 981 | <code>            compactRows: rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 982 | <code>            candidateCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 983 | <code>            diagnostics: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 984 | <code>            nextActions: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 985 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 986 | <code>    }, null, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 987 | <code>    assert.ok(artifactText.length &lt; 12000);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 988 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 989 | <code>    const digest = buildToolObservationDigest([{</code> | 声明局部标识符 `digest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 990 | <code>        id: 'artifact-query',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 991 | <code>        title: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 992 | <code>        tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 993 | <code>        args: { action: 'query', sessionId: 'arts_fixture', include: ['values', 'fills'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 994 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 995 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 996 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 997 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 998 | <code>                content: [{ type: 'text', text: artifactText }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 999 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1000 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1001 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1002 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1003 | <code>    assert.equal(digest.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1004 | <code>    assert.equal(digest[0].lossless, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1005 | <code>    assert.equal(digest[0].text, artifactText);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1006 | <code>    assert.equal(digest[0].compression, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1007 | <code>    assert.match(digest[0].text, /START/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1008 | <code>    assert.match(digest[0].text, /rowNumber": 11/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1009 | <code>    assert.match(digest[0].text, /END/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1010 | <code>    assert.doesNotMatch(digest[0].text, /truncated for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1011 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1013 | <code>test('Agent tool observations compress large artifact query results by row window without next-step hints', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1014 | <code>    const rows = Array.from({ length: 220 }, (_, index) =&gt; ({</code> | 声明局部标识符 `rows`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1015 | <code>        rowNumber: index + 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1016 | <code>        cells: `R${index + 1}C1 &#124; R${index + 1}C2 &#124; R${index + 1}C3 &#124; #${String(index).padStart(6, '0')}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1017 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1018 | <code>    const artifactText = JSON.stringify({</code> | 声明局部标识符 `artifactText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1019 | <code>        schema: 'ailis.artifact_tools.tool_api_result.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1020 | <code>        ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1021 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1022 | <code>        action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1023 | <code>        adapterId: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1024 | <code>        artifact: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1025 | <code>            sessionId: 'arts_big',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1026 | <code>            artifactId: 'art_big',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1027 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1028 | <code>            kind: 'workbook'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1029 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1030 | <code>        observation: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1031 | <code>            schema: 'ailis.artifact_tools.compact_observation.v1',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1032 | <code>            format: 'xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1033 | <code>            action: 'query',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1034 | <code>            sheetName: 'Map',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1035 | <code>            range: 'Map!A1:D220',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1036 | <code>            requestedRange: 'Map!A1:D220',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1037 | <code>            usedRange: 'Map!A1:D220',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1038 | <code>            returnedRange: 'Map!A1:D220',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1039 | <code>            rowCount: 220,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1040 | <code>            columnCount: 4,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1041 | <code>            truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1042 | <code>            columns: ['A', 'B', 'C', 'D'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1043 | <code>            compactRows: rows,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1044 | <code>            candidateCount: rows.length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1045 | <code>            diagnostics: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1046 | <code>            nextActions: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1047 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1048 | <code>    }, null, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1049 | <code>    assert.ok(artifactText.length &gt; 12000);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1050 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1051 | <code>    const digest = buildToolObservationDigest([{</code> | 声明局部标识符 `digest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1052 | <code>        id: 'artifact-query-big',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1053 | <code>        title: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1054 | <code>        tool: 'artifact_tools',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1055 | <code>        args: { action: 'query', sessionId: 'arts_big', include: ['values', 'fills'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1056 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1057 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1058 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1059 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1060 | <code>                content: [{ type: 'text', text: artifactText }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1061 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1062 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1063 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1064 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1065 | <code>    const parsed = JSON.parse(digest[0].text);</code> | 声明局部标识符 `parsed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1066 | <code>    assert.equal(digest[0].lossless, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1067 | <code>    assert.equal(digest[0].compression.reason, 'artifact_tool_observation_exceeded_prompt_budget');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1068 | <code>    assert.equal(parsed.observation.promptCompression.lossless, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1069 | <code>    assert.equal(parsed.observation.promptCompression.visibleRowStrategy, 'head_tail_rows');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1070 | <code>    assert.ok(parsed.observation.promptCompression.omittedCompactRowCount &gt; 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1071 | <code>    assert.equal(parsed.observation.continuation, undefined);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1072 | <code>    assert.ok(parsed.observation.compactRows.every((row) =&gt; row.rowNumber &amp;&amp; typeof row.cells === 'string'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1073 | <code>    assert.doesNotMatch(digest[0].text, /truncated for model budget/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1074 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1076 | <code>test('Agent model-facing observation digest summarizes large tool args', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1077 | <code>    const script = 'print("solver")\n'.repeat(1200);</code> | 声明局部标识符 `script`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1078 | <code>    const stepResult = {</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1079 | <code>        id: 'step-write',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1080 | <code>        title: 'Write solver script',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1081 | <code>        tool: 'write',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1082 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1083 | <code>            path: 'solve_puzzle.py',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1084 | <code>            content: script</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1085 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1086 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1087 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1088 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1089 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1090 | <code>                content: [{ type: 'text', text: 'Wrote solve_puzzle.py' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1091 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1092 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1093 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1094 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1095 | <code>    const digest = buildLosslessToolObservationDigest([stepResult]);</code> | 声明局部标识符 `digest`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1096 | <code>    assert.equal(digest.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1097 | <code>    assert.equal(digest[0].args.path, 'solve_puzzle.py');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1098 | <code>    assert.equal(digest[0].args.content.omitted, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1099 | <code>    assert.equal(digest[0].args.content.chars, script.length);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1100 | <code>    assert.match(digest[0].args.content.sha1, /^[a-f0-9]{12}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1101 | <code>    assert.ok(JSON.stringify(digest).length &lt; 1800);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1102 | <code>    assert.doesNotMatch(JSON.stringify(digest), /solver"\)\nprint\("solver"\)\nprint\("solver/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1103 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1104 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1105 | <code>test('Agent exact-answer audit flags unknown evidence refs when evidence exists', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1106 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1107 | <code>        id: 'step-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1108 | <code>        title: 'Fetch source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1109 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1110 | <code>        args: { url: 'https://example.test/report' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1111 | <code>        iteration: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1112 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1113 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1114 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1115 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1116 | <code>                content: [{ type: 'text', text: 'The named algorithm is BaseLabelPropagation.' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1117 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1118 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1119 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1120 | <code>    const evidenceRef = stepResult.evidenceArtifacts[0].id;</code> | 声明局部标识符 `evidenceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1121 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1122 | <code>    const accepted = validateExactAnswerSubmission({</code> | 声明局部标识符 `accepted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1123 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1124 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1125 | <code>                answer: 'BaseLabelPropagation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1126 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1127 | <code>                evidence_refs: [evidenceRef]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1128 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1129 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1130 | <code>        stepResults: [stepResult]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1131 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1132 | <code>    assert.equal(accepted.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1133 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1134 | <code>    const degraded = validateExactAnswerSubmission({</code> | 声明局部标识符 `degraded`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1135 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1136 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1137 | <code>                answer: 'BaseLabelPropagation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1138 | <code>                confidence: 'low',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1139 | <code>                evidence_refs: ['artifact-missing']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1140 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1141 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1142 | <code>        stepResults: [stepResult]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1143 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1144 | <code>    assert.equal(degraded.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1145 | <code>    assert.deepEqual(degraded.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1146 | <code>    assert.ok(degraded.warnings.includes('evidence_refs_unknown'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1147 | <code>    assert.deepEqual(degraded.unknownRefs, ['artifact-missing']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1148 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1149 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1150 | <code>test('Agent exact-answer audit requests comparable metrics for geographic selectors without blocking submission', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1151 | <code>    const message = 'Which two birthplace cities are farthest apart from the westernmost to the easternmost?';</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1152 | <code>    const unsupported = detectSelectorMetricEvidenceGap({</code> | 声明局部标识符 `unsupported`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1153 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1154 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1155 | <code>            answer: 'Honolulu, Quincy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1156 | <code>            reason: 'The complete birthplace table contains both cities, so they are the extrema.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1157 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1158 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1159 | <code>    assert.equal(unsupported.error, 'selector_metric_evidence_missing');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1160 | <code>    assert.match(unsupported.instruction, /best available answer instead of returning an empty answer/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1161 | <code>    assert.match(unsupported.instruction, /tool_search first and then call the discovered evidence tool/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1163 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1164 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1165 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1166 | <code>            exactAnswerSubmission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1167 | <code>                answer: 'Braintree, Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1168 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1169 | <code>                reason: 'Honolulu has longitude -157.857 and Braintree has longitude -71.005; John Adams place_of_birth resolves to Braintree.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1170 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1171 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1172 | <code>        stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1173 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1174 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1175 | <code>    assert.equal(audited.selectorMetricGap, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1176 | <code>    assert.equal(audited.selectorTerminalRelationGap, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1177 | <code>    assert.ok(!audited.warnings.includes('selector_metric_evidence_missing'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1178 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1179 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1180 | <code>test('Agent exact-answer audit accepts shallow structured coordinate rows as comparable selector metrics', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1181 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1182 | <code>        message: 'Which birthplace cities are westernmost and easternmost?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1183 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1184 | <code>            exactAnswerSubmission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1185 | <code>                answer: 'Braintree, Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1186 | <code>                reason: 'The source-entity birthplace relations resolve the terminal cities.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1187 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1188 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1189 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1190 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1191 | <code>            args: { queries: ['Honolulu', 'Braintree'], properties: ['coordinates'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1192 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1193 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1194 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1195 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1196 | <code>                        property_rows: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1197 | <code>                            source_query: 'Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1198 | <code>                            match_rank: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1199 | <code>                            property: 'coordinates',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1200 | <code>                            latitude: 21.3047,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1201 | <code>                            longitude: -157.8572</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1202 | <code>                        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1203 | <code>                            source_query: 'Braintree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1204 | <code>                            match_rank: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1205 | <code>                            property: 'coordinates',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1206 | <code>                            latitude: 42.206,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1207 | <code>                            longitude: -71.005</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1208 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1209 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1210 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1211 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1212 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1213 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1214 | <code>    assert.equal(audited.selectorMetricGap, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1215 | <code>    assert.ok(!audited.warnings.includes('selector_metric_evidence_missing'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1216 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1217 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1218 | <code>test('Agent exact-answer audit does not count one coordinate pair as two selector candidates', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1219 | <code>    const gap = detectSelectorMetricEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1220 | <code>        message: 'Which birthplace cities are westernmost and easternmost?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1221 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1222 | <code>            answer: 'Braintree, Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1223 | <code>            reason: 'The source table contains both labels.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1224 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1225 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1226 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1227 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1228 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1229 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1230 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1231 | <code>                        property_rows: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1232 | <code>                            source_query: 'Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1233 | <code>                            match_rank: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1234 | <code>                            property: 'coordinates',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1235 | <code>                            latitude: 21.3047,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1236 | <code>                            longitude: -157.8572</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1237 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1238 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1239 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1240 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1241 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1242 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1243 | <code>    assert.equal(gap.error, 'selector_metric_evidence_missing');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1244 | <code>    assert.equal(gap.comparableValues.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1245 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1246 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1247 | <code>test('Agent exact-answer audit separates geographic metrics from terminal relation verification', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1248 | <code>    const message = 'Of the cities where presidents were born, which are westernmost and easternmost?';</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1249 | <code>    const coordinateOnly = detectSelectorTerminalRelationEvidenceGap({</code> | 声明局部标识符 `coordinateOnly`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1250 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1251 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1252 | <code>            answer: 'Honolulu, Quincy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1253 | <code>            reason: 'Honolulu is at longitude -157.857 and Quincy is at longitude -71.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1254 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1255 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1256 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1257 | <code>            args: { properties: ['coordinates'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1258 | <code>            response: { ok: true }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1259 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1260 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1261 | <code>    assert.equal(coordinateOnly.error, 'selector_terminal_relation_evidence_missing');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1262 | <code>    assert.equal(coordinateOnly.relationProperty, 'place_of_birth');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1263 | <code>    assert.match(coordinateOnly.instruction, /best available answer instead of returning an empty answer/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1264 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1265 | <code>    const relationVerified = detectSelectorTerminalRelationEvidenceGap({</code> | 声明局部标识符 `relationVerified`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1266 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1267 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1268 | <code>            answer: 'Braintree, Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1269 | <code>            reason: 'Coordinates establish the extrema.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1270 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1271 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1272 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1273 | <code>            args: { properties: ['coordinates', 'place_of_birth'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1274 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1275 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1276 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1277 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1278 | <code>                        results: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1279 | <code>                            matches: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1280 | <code>                                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1281 | <code>                                    place_of_birth: [{ label: 'Braintree' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1282 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1283 | <code>                            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1284 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1285 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1286 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1287 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1288 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1289 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1290 | <code>    assert.equal(relationVerified, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1291 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1292 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1293 | <code>test('Agent exact-answer relation audit reads shallow property rows after deep MCP results are compacted', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1294 | <code>    const gap = detectSelectorTerminalRelationEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1295 | <code>        message: 'Of the cities where presidents were born, which are westernmost and easternmost?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1296 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1297 | <code>            answer: 'Honolulu, Quincy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1298 | <code>            reason: 'Honolulu has longitude -157.857 and Quincy has longitude -71.002.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1299 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1300 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1301 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1302 | <code>            args: { properties: ['place_of_birth'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1303 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1304 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1305 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1306 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1307 | <code>                        property_rows: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1308 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1309 | <code>                                source_query: 'Barack Obama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1310 | <code>                                source_entity: 'Barack Obama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1311 | <code>                                match_rank: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1312 | <code>                                property: 'place_of_birth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1313 | <code>                                value_label: 'Kapiolani Medical Center for Women and Children',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1314 | <code>                                value_description: 'hospital in Honolulu, Hawaii'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1315 | <code>                            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1316 | <code>                            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1317 | <code>                                source_query: 'John Adams',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1318 | <code>                                source_entity: 'John Adams',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1319 | <code>                                match_rank: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1320 | <code>                                property: 'place_of_birth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1321 | <code>                                value_label: 'Braintree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1322 | <code>                                value_description: 'city in Massachusetts'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1323 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1324 | <code>                        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1325 | <code>                        results: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1326 | <code>                            query: 'John Adams',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1327 | <code>                            matches: '[deep result compacted]'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1328 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1329 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1330 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1331 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1332 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1333 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1334 | <code>    assert.equal(gap.error, 'selector_terminal_relation_answer_mismatch');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1335 | <code>    assert.deepEqual(gap.unmatchedLabels, ['Quincy']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1336 | <code>    assert.ok(gap.relationCandidates.includes('Braintree'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1337 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1338 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1339 | <code>test('Agent exact-answer relation audit flags a submitted modern label contradicted by its own historical-label rationale', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1340 | <code>    const gap = detectSelectorTerminalRelationEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1341 | <code>        message: 'Which two presidential birthplace cities are westernmost and easternmost?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1342 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1343 | <code>            answer: 'Honolulu, Quincy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1344 | <code>            reason: 'Honolulu is westernmost; Quincy, Massachusetts (the Adams birthplace, formerly Braintree) is easternmost.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1345 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1346 | <code>        stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1347 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1348 | <code>    assert.equal(gap.error, 'selector_terminal_period_label_conflict');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1349 | <code>    assert.equal(gap.periodLabelConflict, 'Quincy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1350 | <code>    assert.match(gap.instruction, /rationale itself/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1351 | <code>    assert.match(gap.instruction, /self-contradiction/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1352 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1353 | <code>    const reverseGap = detectSelectorTerminalRelationEvidenceGap({</code> | 声明局部标识符 `reverseGap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1354 | <code>        message: 'Which two presidential birthplace cities are westernmost and easternmost?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1355 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1356 | <code>            answer: 'Honolulu, Quincy',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1357 | <code>            reason: 'The presidents were born in the north precinct of Braintree, now Quincy, Massachusetts.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1358 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1359 | <code>        stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1360 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1361 | <code>    assert.equal(reverseGap.periodLabelConflict, 'Quincy');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1362 | <code>    assert.equal(reverseGap.error, 'selector_terminal_period_label_conflict');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1363 | <code>    assert.match(reverseGap.instruction, /tool_search first/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1364 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1365 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1366 | <code>test('Agent exact-answer relation recovery diagnoses structured lookups that omit the relation field', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1367 | <code>    const recoveryGap = {</code> | 声明局部标识符 `recoveryGap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1368 | <code>        error: 'selector_terminal_relation_evidence_missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1369 | <code>        relationProperty: 'place_of_birth'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1370 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1371 | <code>    const omitted = detectStructuredRelationRecoveryCallGap({</code> | 声明局部标识符 `omitted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1372 | <code>        recoveryGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1373 | <code>        toolCalls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1374 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1375 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1376 | <code>                queries: ['Quincy Massachusetts'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1377 | <code>                properties: ['coordinates']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1378 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1379 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1380 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1381 | <code>    assert.equal(omitted.error, 'structured_relation_property_omitted');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1382 | <code>    assert.match(omitted.instruction, /source entities, not the candidate answer locations/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1383 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1384 | <code>    assert.equal(detectStructuredRelationRecoveryCallGap({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1385 | <code>        recoveryGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1386 | <code>        toolCalls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1387 | <code>            tool: 'mcp__ailis_research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1388 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1389 | <code>                queries: ['John Adams', 'Barack Obama'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1390 | <code>                properties: ['place_of_birth']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1391 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1392 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1393 | <code>    }), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1394 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1395 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1396 | <code>test('Agent exact-answer audit reserves bounded recovery and final submission rounds', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1397 | <code>    assert.equal(resolveExactAnswerAuditFinalizationIteration({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1398 | <code>        currentFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1399 | <code>        baseFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1400 | <code>        auditIteration: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1401 | <code>        recoveryToolCalls: 2</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1402 | <code>    }), 8);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1403 | <code>    assert.equal(resolveExactAnswerAuditFinalizationIteration({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1404 | <code>        currentFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1405 | <code>        baseFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1406 | <code>        auditIteration: 7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1407 | <code>        recoveryToolCalls: 2</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1408 | <code>    }), 11);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1409 | <code>    assert.equal(resolveExactAnswerAuditFinalizationIteration({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1410 | <code>        currentFinalizationIteration: 11,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1411 | <code>        baseFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1412 | <code>        auditIteration: 10,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1413 | <code>        recoveryToolCalls: 2</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1414 | <code>    }), 14);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1415 | <code>    assert.equal(resolveExactAnswerAuditFinalizationIteration({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1416 | <code>        currentFinalizationIteration: 14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1417 | <code>        baseFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1418 | <code>        auditIteration: 14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1419 | <code>        recoveryToolCalls: 2</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1420 | <code>    }), 15);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1421 | <code>    assert.equal(resolveExactAnswerAuditFinalizationIteration({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1422 | <code>        currentFinalizationIteration: 14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1423 | <code>        baseFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1424 | <code>        auditIteration: 14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1425 | <code>        recoveryToolCalls: 0</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1426 | <code>    }), 15);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1427 | <code>    assert.equal(resolveExactAnswerAuditFinalizationIteration({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1428 | <code>        currentFinalizationIteration: 14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1429 | <code>        baseFinalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1430 | <code>        auditIteration: 14,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1431 | <code>        recoveryToolCalls: 0,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1432 | <code>        finalSubmissionReserve: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1433 | <code>    }), 14);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1434 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1435 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1436 | <code>test('Agent exact-answer audit advances to the next unattempted recovery gap', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1437 | <code>    const validation = {</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1438 | <code>        selectorMetricGap: { error: 'selector_metric_evidence_missing' },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1439 | <code>        selectorTerminalRelationGap: { error: 'selector_terminal_relation_evidence_missing' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1440 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1441 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1442 | <code>        selectExactAnswerAuditRecoveryGap(validation, new Set()).error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1443 | <code>        'selector_terminal_relation_evidence_missing'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1444 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1445 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1446 | <code>        selectExactAnswerAuditRecoveryGap(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1447 | <code>            validation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1448 | <code>            new Set(['selector_terminal_relation_evidence_missing'])</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1449 | <code>        ).error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1450 | <code>        'selector_metric_evidence_missing'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1451 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1452 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1453 | <code>        selectExactAnswerAuditRecoveryGap(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1454 | <code>            validation,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1455 | <code>            new Set([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1456 | <code>                'selector_metric_evidence_missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1457 | <code>                'selector_terminal_relation_evidence_missing'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1458 | <code>            ])</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1459 | <code>        ),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>        null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1461 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1462 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1464 | <code>test('Agent exact-answer audit asks for one visual enumeration cross-check without suppressing the answer', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1465 | <code>    const gap = detectVisualEnumerationEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1466 | <code>        message: 'Using the provided image, list all fractions that use / as the fraction line in order.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1467 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1468 | <code>            answer: '6/8=3/4,4/60=1/15'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1469 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1470 | <code>        stepResults: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1471 | <code>        fileAttachments: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1472 | <code>            type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1473 | <code>            path: 'C:\\tmp\\fractions.png',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1474 | <code>            name: 'fractions.png'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1475 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1476 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1477 | <code>    assert.equal(gap.error, 'visual_enumeration_not_cross_checked');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1478 | <code>    assert.match(gap.instruction, /return the best available answer/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1479 | <code>    assert.match(gap.instruction, /top-left to bottom-right/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1480 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1481 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1482 | <code>test('Agent exact-answer audit preserves a source-supported compound species name', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1483 | <code>    const gap = detectAnswerSpecificityEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1484 | <code>        message: 'What species of bird is featured?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1485 | <code>        submission: { answer: 'penguin' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1486 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1487 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1488 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1489 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1490 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1491 | <code>                    content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1492 | <code>                        type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1493 | <code>                        text: 'The segment starts with rockhopper penguins scaling a steep cliff.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1494 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1495 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1496 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1497 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1498 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1499 | <code>    assert.equal(gap.error, 'answer_entity_specificity_missing');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1500 | <code>    assert.deepEqual(gap.sourceCandidates, ['rockhopper penguin']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1501 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1502 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1503 | <code>test('Agent exact-answer audit verifies complete book titles against a full-title authority', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1504 | <code>    const gap = detectCompleteTitleEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1505 | <code>        message: 'What was the complete title of the book?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1506 | <code>        submission: { answer: 'Five Hundred Things to Eat Before It’s Too Late' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1507 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1508 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1509 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1510 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1511 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1512 | <code>                    content: [{ type: 'text', text: 'A restaurant blog uses the short title.' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1513 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1514 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1515 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1516 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1517 | <code>    assert.equal(gap.error, 'complete_title_not_verified');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1518 | <code>    assert.match(gap.instruction, /subtitle/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1519 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1520 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1521 | <code>test('Agent exact-answer audit recovers when a nested selector parent index is still incomplete', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1522 | <code>    const gap = detectNestedSelectorSelectionGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1523 | <code>        message: 'Which article has "witnesses" in the most titles, and what changed in its first rule?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1524 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1525 | <code>            answer: 'proceedings',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1526 | <code>            reason: 'I followed Rule 601.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1527 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1528 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1529 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1530 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1531 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1532 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1533 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1534 | <code>                        selectionProtocol: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1535 | <code>                            parent_kind: 'article',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1536 | <code>                            quoted_term: 'witnesses',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1537 | <code>                            boundary_complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1538 | <code>                            exact_title_match_counts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1539 | <code>                                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1540 | <code>                                    group: 'ARTICLE VII',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1541 | <code>                                    count: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1542 | <code>                                    matched_children: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1543 | <code>                                        { id: 'Rule 701' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1544 | <code>                                        { id: 'Rule 702' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1545 | <code>                                        { id: 'Rule 706' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1546 | <code>                                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1547 | <code>                                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1548 | <code>                                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1549 | <code>                                    group: 'ARTICLE VI',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1550 | <code>                                    count: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1551 | <code>                                    matched_children: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1552 | <code>                                        { id: 'Rule 611' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1553 | <code>                                        { id: 'Rule 615' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1554 | <code>                                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1555 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1556 | <code>                            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1557 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1558 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1559 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1560 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1561 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1562 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1563 | <code>    assert.equal(gap.error, 'nested_selector_candidate_boundary_incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1564 | <code>    assert.match(gap.instruction, /parent-index or continuation/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1565 | <code>    assert.match(gap.instruction, /ARTICLE VII=3/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1566 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1568 | <code>test('Agent exact-answer audit recovers before the parent index has been opened', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1569 | <code>    const gap = detectNestedSelectorSelectionGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1570 | <code>        message: 'Which article has "witnesses" in the most titles, and what changed in its first rule?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1571 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1572 | <code>            answer: 'civil',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1573 | <code>            reason: 'I opened Rule 601 directly.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1574 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1575 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1576 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1577 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1578 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1579 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1580 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1581 | <code>                        search: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1582 | <code>                            selectionAudit: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1583 | <code>                                parent_kind: 'article',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1584 | <code>                                quoted_term: 'witnesses',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1585 | <code>                                candidate_set_coverage_sufficient: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1586 | <code>                                candidates: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1587 | <code>                                    ref_id: 'turn0search0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1588 | <code>                                    structured_anchor: 'ARTICLE VI',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1589 | <code>                                    visible_snippet_occurrences: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1590 | <code>                                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1591 | <code>                                parent_index_candidates: ['turn0search2']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1592 | <code>                            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1593 | <code>                            suggestedNextCalls: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1594 | <code>                                tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1595 | <code>                                args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1596 | <code>                                    open: [{ ref_id: 'turn0search2' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1597 | <code>                                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1598 | <code>                                reason: 'Open the nearest parent index before selecting a child.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1599 | <code>                            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1600 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1601 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1602 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1603 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1604 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1605 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1606 | <code>    assert.equal(gap.error, 'nested_selector_candidate_boundary_incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1607 | <code>    assert.match(gap.instruction, /parent-index/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1608 | <code>    assert.match(gap.instruction, /turn0search2/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1609 | <code>    assert.deepEqual(gap.recommendedActions[0].args, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1610 | <code>        open: [{ ref_id: 'turn0search2' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1611 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1612 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1613 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1614 | <code>test('Agent exact-answer audit preserves recovery budget when discovery skips a recommended navigation action', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1615 | <code>    const recoveryGap = {</code> | 声明局部标识符 `recoveryGap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1616 | <code>        error: 'nested_selector_candidate_boundary_incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1617 | <code>        recommendedActions: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1618 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1619 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1620 | <code>                open: [{ ref_id: 'turn0search2' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1621 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1622 | <code>            reason: 'Open the nearest parent index before selecting a child.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1623 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1624 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1625 | <code>    const skipped = detectRecommendedRecoveryActionGap({</code> | 声明局部标识符 `skipped`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1626 | <code>        recoveryGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1627 | <code>        toolCalls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1628 | <code>            tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1629 | <code>            args: { query: 'another connector' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1630 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1631 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1632 | <code>    assert.equal(skipped.error, 'recommended_recovery_navigation_skipped');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1633 | <code>    assert.match(skipped.instruction, /turn0search2/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1634 | <code>    assert.equal(detectRecommendedRecoveryActionGap({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1635 | <code>        recoveryGap,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1636 | <code>        toolCalls: [{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1637 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1638 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1639 | <code>                open: [{ ref_id: 'turn0search2' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1640 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1641 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1642 | <code>    }), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1643 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1644 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1645 | <code>test('Agent exact-answer audit catches a selected child that conflicts with the completed winning group', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1646 | <code>    const gap = detectNestedSelectorSelectionGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1647 | <code>        message: 'Which article has "witnesses" in the most titles, and what changed in its first rule?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1648 | <code>        submission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1649 | <code>            answer: 'proceedings',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1650 | <code>            reason: 'The first rule is Rule 601 in Article VI.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1651 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1652 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1653 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1654 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1655 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1656 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1657 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1658 | <code>                        selection_protocol: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1659 | <code>                            parent_kind: 'article',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1660 | <code>                            quoted_term: 'witnesses',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1661 | <code>                            boundary_complete: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1662 | <code>                            winning_group: 'ARTICLE VII',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1663 | <code>                            exact_title_match_counts: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1664 | <code>                                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1665 | <code>                                    group: 'ARTICLE VII',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1666 | <code>                                    count: 3,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1667 | <code>                                    matched_children: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1668 | <code>                                        { id: 'Rule 701' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1669 | <code>                                        { id: 'Rule 702' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1670 | <code>                                        { id: 'Rule 706' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1671 | <code>                                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1672 | <code>                                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1673 | <code>                                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1674 | <code>                                    group: 'ARTICLE VI',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1675 | <code>                                    count: 2,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1676 | <code>                                    matched_children: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1677 | <code>                                        { id: 'Rule 611' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1678 | <code>                                        { id: 'Rule 615' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1679 | <code>                                    ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1680 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1681 | <code>                            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1682 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1683 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1684 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1685 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1686 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1687 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1688 | <code>    assert.equal(gap.error, 'nested_selector_selected_group_mismatch');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1689 | <code>    assert.equal(gap.winningGroup, 'ARTICLE VII');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1690 | <code>    assert.ok(gap.conflictingAnchors.includes('Rule 601'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1691 | <code>    assert.ok(gap.conflictingAnchors.includes('Article VI'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1692 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1694 | <code>test('Agent exact-answer relation audit catches submitted cities that disagree with primary person relations', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1695 | <code>    const gap = detectSelectorTerminalRelationAnswerMismatch({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1696 | <code>        submission: { answer: 'Honolulu, Quincy' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1697 | <code>        relationProperty: 'place_of_birth',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1698 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1699 | <code>            tool: 'mcp__research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1700 | <code>            args: { properties: ['place_of_birth'] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1701 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1702 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1703 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1704 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1705 | <code>                        results: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1706 | <code>                            query: 'Barack Obama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1707 | <code>                            matches: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1708 | <code>                                label: 'Barack Obama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1709 | <code>                                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1710 | <code>                                    place_of_birth: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1711 | <code>                                        label: 'Kapiolani Medical Center for Women and Children',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1712 | <code>                                        description: 'hospital in Honolulu, Hawaii'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1713 | <code>                                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1714 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1715 | <code>                            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1716 | <code>                        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1717 | <code>                            query: 'John Adams',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1718 | <code>                            matches: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1719 | <code>                                label: 'John Adams',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1720 | <code>                                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1721 | <code>                                    place_of_birth: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1722 | <code>                                        label: 'Braintree',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1723 | <code>                                        description: 'city in Massachusetts'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1724 | <code>                                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1725 | <code>                                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1726 | <code>                            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1727 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1728 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1729 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1730 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1731 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1732 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1733 | <code>    assert.equal(gap.error, 'selector_terminal_relation_answer_mismatch');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1734 | <code>    assert.deepEqual(gap.unmatchedLabels, ['Quincy']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1735 | <code>    assert.ok(gap.relationCandidates.includes('Braintree'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1736 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1737 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1738 | <code>test('Agent exact-answer audit can extend only the ordinary tool-round boundary', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1739 | <code>    assert.equal(canStartExactAnswerAuditRecovery({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1740 | <code>        iteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1741 | <code>        finalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1742 | <code>        safetyFinalizationReason: 'maximum_tool_rounds'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1743 | <code>    }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1744 | <code>    assert.equal(canStartExactAnswerAuditRecovery({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1745 | <code>        iteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1746 | <code>        finalizationIteration: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1747 | <code>        safetyFinalizationReason: 'time_budget'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1748 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1749 | <code>    assert.equal(canStartExactAnswerAuditRecovery({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1750 | <code>        iteration: 9,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1751 | <code>        finalizationIteration: 8</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1752 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1753 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1754 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1755 | <code>test('Agent exact-answer recovery promotes schema-matched relation tools without forcing a route', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1756 | <code>    const specs = [{</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1757 | <code>        name: 'web_run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1758 | <code>        description: 'Broad web search.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1759 | <code>        parameters: { type: 'object', properties: {} }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1760 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1761 | <code>        name: 'mcp__research__wikidata_entity_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1762 | <code>        description: 'Structured entity facts and relations.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1763 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1764 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1765 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1766 | <code>                queries: { type: 'array', items: { type: 'string' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1767 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1768 | <code>                    type: 'array',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1769 | <code>                    description: 'Supports place_of_birth and coordinates.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1770 | <code>                    items: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1771 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1772 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1773 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1774 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1775 | <code>    const gap = {</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1776 | <code>        error: 'selector_terminal_relation_evidence_missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1777 | <code>        relationProperty: 'place_of_birth'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1778 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1779 | <code>    const prioritized = prioritizeExactAnswerRecoveryToolSpecs(specs, gap);</code> | 声明局部标识符 `prioritized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1780 | <code>    assert.equal(prioritized[0].name, 'mcp__research__wikidata_entity_lookup');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1781 | <code>    assert.equal(prioritized[1].name, 'web_run');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1782 | <code>    const note = buildExactAnswerRecoveryToolAffordanceNote(prioritized, gap);</code> | 声明局部标识符 `note`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1783 | <code>    assert.match(note, /wikidata_entity_lookup/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1784 | <code>    assert.match(note, /properties:\["place_of_birth"\]/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1785 | <code>    assert.match(note, /broad web search is a fallback/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1786 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1787 | <code>    const discoveryNote = buildExactAnswerRecoveryToolAffordanceNote([</code> | 声明局部标识符 `discoveryNote`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1788 | <code>        specs[0],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1789 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1790 | <code>            name: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1791 | <code>            description: 'Discover deferred tools.',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1792 | <code>            parameters: { type: 'object', properties: { query: { type: 'string' } } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1793 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1794 | <code>    ], gap);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1795 | <code>    assert.match(discoveryNote, /not visible yet/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1796 | <code>    assert.match(discoveryNote, /use tool_search now/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1797 | <code>    assert.match(discoveryNote, /then call the discovered tool/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1798 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1799 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1800 | <code>test('Agent exact-answer audit accepts a plain final response as the answer candidate', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1801 | <code>    const validation = validateExactAnswerSubmission({</code> | 声明局部标识符 `validation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1802 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1803 | <code>            finalAnswer: 'Braintree, Honolulu',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1804 | <code>            publicReasoning: 'Plain final response after tool use.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1805 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1806 | <code>        message: 'Give the city names only.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1807 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1808 | <code>    assert.equal(validation.submission.answer, 'Braintree, Honolulu');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1809 | <code>    assert.equal(validation.submission.reason, 'Plain final response after tool use.');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1810 | <code>    assert.ok(!validation.warnings.includes('answer_missing'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1811 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1813 | <code>test('Agent exact-answer mode exposes source_question evidence for self-contained reasoning tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1814 | <code>    const question = [</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1815 | <code>        'In the fictional language of Tizin, basic sentences are arranged with the Verb first, followed by the direct object, followed by the subject of the sentence.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1816 | <code>        'The word that indicates oneself is "Pa" is the nominative form, "Mato" is the accusative form, and "Sing" is the genitive form.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1817 | <code>        'The root verb that indicates an intense like for something is "Maktay".',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1818 | <code>        'The word for apples is "Apple" is the nominative form, "Zapple" is the accusative form, and "Izapple" is the genitive form.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1819 | <code>        'Please translate "I like apples" to Tizin.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1820 | <code>    ].join('\n');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1821 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1822 | <code>    assert.equal(looksLikeSelfContainedExactAnswerQuestion(question), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1823 | <code>    const sourceArtifact = buildSourceQuestionEvidenceArtifact(question, { exactAnswerMode: true });</code> | 声明局部标识符 `sourceArtifact`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1824 | <code>    assert.equal(sourceArtifact.type, 'QuestionEvidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1825 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1826 | <code>    const promptArtifacts = buildAgentEvidenceArtifactsPromptObject([], {</code> | 声明局部标识符 `promptArtifacts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1827 | <code>        message: question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1828 | <code>        exactAnswerMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1829 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1830 | <code>    assert.equal(promptArtifacts.length, 1);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1831 | <code>    assert.equal(promptArtifacts[0].id, sourceArtifact.id);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1832 | <code>    assert.equal(promptArtifacts[0].evidenceId, 'source_question');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1833 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1834 | <code>    const sufficiency = buildEvidenceSufficiencyPromptObject([], {</code> | 声明局部标识符 `sufficiency`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1835 | <code>        message: question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1836 | <code>        exactAnswerMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1837 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1838 | <code>    assert.equal(sufficiency.status, 'model_judges_evidence');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1839 | <code>    assert.equal(sufficiency.ready, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1840 | <code>    assert.equal(sufficiency.ready_evidence[0].evidenceId, sourceArtifact.id);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1841 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1842 | <code>    const accepted = validateExactAnswerSubmission({</code> | 声明局部标识符 `accepted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1843 | <code>        message: question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1844 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1845 | <code>            exactAnswerSubmission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1846 | <code>                answer: 'Maktay Mato Apple',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1847 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1848 | <code>                evidence_refs: [sourceArtifact.id],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1849 | <code>                reason: 'The source question defines present Maktay, accusative Mato for the liker, nominative Apple for apples, and verb-object-subject order.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1850 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1851 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1852 | <code>        stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1853 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1854 | <code>    assert.equal(accepted.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1855 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1856 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1857 | <code>test('Agent exact-answer mode does not expose source_question evidence for external retrieval tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1858 | <code>    const question = 'Under DDC 633 on Bielefeld University Library BASE, as of 2020, from what country was the unknown language article with a flag unique from the others?';</code> | 声明局部标识符 `question`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1859 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1860 | <code>    assert.equal(looksLikeSelfContainedExactAnswerQuestion(question), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1861 | <code>    assert.equal(buildSourceQuestionEvidenceArtifact(question, { exactAnswerMode: true }), null);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1862 | <code>    assert.deepEqual(buildAgentEvidenceArtifactsPromptObject([], {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1863 | <code>        message: question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1864 | <code>        exactAnswerMode: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1865 | <code>    }), []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1866 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1867 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1868 | <code>        message: question,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1869 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1870 | <code>            exactAnswerSubmission: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1871 | <code>                answer: 'Guatemala',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1872 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1873 | <code>                evidence_refs: ['artifact-source-question'],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1874 | <code>                reason: 'This should still require external retrieval evidence.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1875 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1876 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1877 | <code>        stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1878 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1879 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1880 | <code>    assert.deepEqual(audited.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1881 | <code>    assert.ok(audited.warnings.includes('evidence_missing'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1882 | <code>    assert.ok(audited.warnings.includes('evidence_refs_unknown'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1883 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1884 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1885 | <code>test('Agent exact-answer audit flags raw rounded units for scaled-unit questions', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1886 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1887 | <code>        id: 'step-web',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1888 | <code>        title: 'Fetch source',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1889 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1890 | <code>        args: { url: 'https://example.test/moon' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1891 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1892 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1893 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1894 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1895 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1896 | <code>                content: [{ type: 'text', text: 'periapsis: 362600 km; marathon pace evidence available.' }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1897 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1898 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1899 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1900 | <code>    const evidenceRef = stepResult.evidenceArtifacts[0].id;</code> | 声明局部标识符 `evidenceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1901 | <code>    const message = [</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1902 | <code>        'If a runner maintained marathon pace indefinitely, how many thousand hours would it take?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1903 | <code>        'Round your result to the nearest 1000 hours.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1904 | <code>    ].join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1905 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1906 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1907 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1908 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1909 | <code>                answer: '1000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1910 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1911 | <code>                evidence_refs: [evidenceRef],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1912 | <code>                reason: 'rounded to nearest 1000 hours'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1913 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1914 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1915 | <code>        stepResults: [stepResult],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1916 | <code>        message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1917 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1918 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1919 | <code>    assert.deepEqual(audited.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1920 | <code>    assert.ok(audited.warnings.includes('scaled_unit_answer_mismatch'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1921 | <code>    assert.match(audited.scaledUnitMismatch.instruction, /divide by 1000/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1922 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1923 | <code>    const accepted = validateExactAnswerSubmission({</code> | 声明局部标识符 `accepted`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1924 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1925 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1926 | <code>                answer: '17',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1927 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1928 | <code>                evidence_refs: [evidenceRef],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1929 | <code>                reason: 'raw hours rounded to 17000, then reported as 17 thousand hours'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1930 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1931 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1932 | <code>        stepResults: [stepResult],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1933 | <code>        message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1934 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1935 | <code>    assert.equal(accepted.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1936 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1937 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1938 | <code>test('Agent exact-answer audit flags numeric answer when reason states a different final number', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1939 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1940 | <code>        id: 'step-calc',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1941 | <code>        title: 'Fetch and calculate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1942 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1943 | <code>        args: { url: 'https://example.test/evidence' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1944 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1945 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1946 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1947 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1948 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1949 | <code>                content: [{ type: 'text', text: 'The calculation gives 17 thousand hours.' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1950 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1951 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1952 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1953 | <code>    const evidenceRef = stepResult.evidenceArtifacts[0].id;</code> | 声明局部标识符 `evidenceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1954 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1955 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1956 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1957 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1958 | <code>                answer: '40',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1959 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1960 | <code>                evidence_refs: [evidenceRef],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1961 | <code>                reason: '356400 / 20.897 ≈ 17054 hours, rounded to 17000 hours, so the correct answer is 17.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1962 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1963 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1964 | <code>        stepResults: [stepResult],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1965 | <code>        message: 'How many thousand hours?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1966 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1967 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1968 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1969 | <code>    assert.deepEqual(audited.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1970 | <code>    assert.ok(audited.warnings.includes('answer_reason_conflict'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1971 | <code>    assert.equal(audited.reasonConflict.answer, '40');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1972 | <code>    assert.deepEqual(audited.reasonConflict.reasonFinalNumbers, ['17']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1973 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1974 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1975 | <code>test('Agent exact-answer audit flags incomplete first-step simulations for multi-stage random processes', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1976 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1977 | <code>        id: 'step-sim',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1978 | <code>        title: 'Run simulation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1979 | <code>        tool: 'mcp__ailis_research__run_python_file',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1980 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1981 | <code>            code: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1982 | <code>                'import random',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1983 | <code>                'from collections import defaultdict',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1984 | <code>                'def simulate_game(num_trials=100000):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1985 | <code>                '    win_counts = defaultdict(int)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1986 | <code>                '    for _ in range(num_trials):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1987 | <code>                '        ramp = list(range(1, 101))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1988 | <code>                '        platform = [ramp.pop(0), ramp.pop(0), ramp.pop(0)]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1989 | <code>                '        while True:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1990 | <code>                '            piston = random.randint(0, 2)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1991 | <code>                '            ejected = platform[piston]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1992 | <code>                '            win_counts[ejected] += 1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1993 | <code>                '            break',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1994 | <code>                '    return max(win_counts, key=win_counts.get)'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1995 | <code>            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1996 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1997 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1998 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 1999 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2000 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2001 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2002 | <code>                content: [{ type: 'text', text: 'Best ball: 1' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2003 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2004 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2005 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2006 | <code>    const evidenceRef = stepResult.evidenceArtifacts[0].id;</code> | 声明局部标识符 `evidenceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2007 | <code>    const message = [</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2008 | <code>        'At each stage of the game, one of three pistons will randomly fire.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2009 | <code>        'Balls advance on a platform and ramp after each firing.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2010 | <code>        'Which ball should you choose to maximize your odds of winning?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2011 | <code>    ].join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2012 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2013 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2014 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2015 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2016 | <code>                answer: '1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2017 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2018 | <code>                evidence_refs: [evidenceRef],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2019 | <code>                reason: 'simulation says ball 1 is best'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2020 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2021 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2022 | <code>        stepResults: [stepResult],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2023 | <code>        message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2024 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2025 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2026 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2027 | <code>    assert.deepEqual(audited.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2028 | <code>    assert.ok(audited.warnings.includes('incomplete_process_simulation_evidence'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2029 | <code>    assert.match(audited.incompleteSimulation.instruction, /full state transition loop/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2030 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2031 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2032 | <code>test('Agent exact-answer audit flags Monte Carlo-only evidence for finite stochastic exact-answer tasks', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2033 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2034 | <code>        id: 'step-monte-carlo',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2035 | <code>        title: 'Run stochastic simulation',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2036 | <code>        tool: 'mcp__ailis_research__run_python_file',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2037 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2038 | <code>            code: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2039 | <code>                'import random',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2040 | <code>                'from collections import defaultdict',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2041 | <code>                'SIM_COUNT = 20000',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2042 | <code>                'def simulate_one_game():',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2043 | <code>                '    ramp = list(range(1, 101))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2044 | <code>                '    platform = ramp[:3]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2045 | <code>                '    ramp = ramp[3:]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2046 | <code>                '    ejected = []',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2047 | <code>                '    while len(ejected) &lt; 100 and len(platform) &gt; 0:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2048 | <code>                '        piston = random.randint(0, 2)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2049 | <code>                '        ejected.append(platform[piston])',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2050 | <code>                '        platform = platform[1:]',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2051 | <code>                '        if ramp:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2052 | <code>                '            platform.append(ramp.pop(0))',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2053 | <code>                '    return ejected',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2054 | <code>                'counts = defaultdict(int)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2055 | <code>                'for _ in range(SIM_COUNT):',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2056 | <code>                '    for num in simulate_one_game():',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2057 | <code>                '        counts[num] += 1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2058 | <code>                'print(max(counts, key=counts.get))'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2059 | <code>            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2060 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2061 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2062 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2063 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2064 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2065 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2066 | <code>                content: [{ type: 'text', text: '100' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2067 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2068 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2069 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2070 | <code>    const evidenceRef = stepResult.evidenceArtifacts[0].id;</code> | 声明局部标识符 `evidenceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2071 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2072 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2073 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2074 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2075 | <code>                answer: '100',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2076 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2077 | <code>                evidence_refs: [evidenceRef],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2078 | <code>                reason: 'Monte Carlo simulation says 100 has the highest win probability.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2079 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2080 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2081 | <code>        stepResults: [stepResult],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2082 | <code>        message: 'At each stage one piston randomly fires. Which ball should you choose to maximize your odds of winning?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2083 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2084 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2085 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2086 | <code>    assert.deepEqual(audited.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2087 | <code>    assert.ok(audited.warnings.includes('monte_carlo_only_random_process_evidence'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2088 | <code>    assert.match(audited.incompleteSimulation.instruction, /exact state transition/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2089 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2090 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2091 | <code>test('Agent exact-answer audit flags ad hoc terminal probabilities in stochastic process code', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2092 | <code>    const stepResult = attachAgentEvidenceArtifacts({</code> | 声明局部标识符 `stepResult`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2093 | <code>        id: 'step-ad-hoc-terminal',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2094 | <code>        title: 'Run DP',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2095 | <code>        tool: 'mcp__ailis_research__run_python_file',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2096 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2097 | <code>            code: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2098 | <code>                'from collections import defaultdict',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2099 | <code>                'prob = defaultdict(float)',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2100 | <code>                'if idx + 1 &lt; total_balls:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2101 | <code>                '    new_prob[state] += p / 3',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2102 | <code>                'elif idx &lt; total_balls:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2103 | <code>                '    # guessed terminal split for remaining platform',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2104 | <code>                '    win_counts[c] += p / 3 * 0.5',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2105 | <code>                '    win_counts[idx + 1] += p / 3 * 0.5'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2106 | <code>            ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2107 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2108 | <code>        iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2109 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2110 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2111 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2112 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2113 | <code>                content: [{ type: 'text', text: '98' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2114 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2115 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2116 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2117 | <code>    const evidenceRef = stepResult.evidenceArtifacts[0].id;</code> | 声明局部标识符 `evidenceRef`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2119 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2120 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2121 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2122 | <code>                answer: '98',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2123 | <code>                confidence: 'high',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2124 | <code>                evidence_refs: [evidenceRef],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2125 | <code>                reason: 'DP with terminal split says 98.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2126 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2127 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2128 | <code>        stepResults: [stepResult],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2129 | <code>        message: 'At each stage one random piston fires. Which ball maximizes your odds of winning?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2130 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2131 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2132 | <code>    assert.equal(audited.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2133 | <code>    assert.deepEqual(audited.errors, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2134 | <code>    assert.ok(audited.warnings.includes('ad_hoc_terminal_transition_evidence'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2135 | <code>    assert.match(audited.incompleteSimulation.instruction, /terminal\/partial-state probabilities/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2136 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2137 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2138 | <code>test('Agent exact-answer audit treats a guaranteed single-container threshold as vacuous', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2139 | <code>    const message = [</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2140 | <code>        'The host has thirty shiny prop coins and hides them in three different prize boxes.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2141 | <code>        'The only rule restricting placement is that one box must contain at least two coins.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2142 | <code>        'What is the minimum guaranteed value in this bounded optimization problem?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2143 | <code>    ].join(' ');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2144 | <code>    const gap = detectVacuousDistributionConstraintGap({ message });</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2145 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2146 | <code>    assert.equal(gap.error, 'word_problem_quantifier_constraint_vacuous');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2147 | <code>    assert.equal(gap.total, 30);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2148 | <code>    assert.equal(gap.containerCount, 3);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2149 | <code>    assert.equal(gap.threshold, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2150 | <code>    assert.equal(gap.guaranteedMaximumLowerBound, 10);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2151 | <code>    assert.equal(gap.describedAsRestrictingRule, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2152 | <code>    assert.match(gap.instruction, /prefer the smallest quantifier repair/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2153 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2154 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2155 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2156 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2157 | <code>                answer: '12',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2158 | <code>                confidence: 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2159 | <code>                reason: 'bounded enumeration'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2160 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2161 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2162 | <code>        message</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2163 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2164 | <code>    assert.ok(audited.warnings.includes('word_problem_quantifier_constraint_vacuous'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2165 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2166 | <code>        selectExactAnswerAuditRecoveryGap(audited)?.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2167 | <code>        'word_problem_quantifier_constraint_vacuous'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2168 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2169 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2170 | <code>    assert.equal(detectVacuousDistributionConstraintGap({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2171 | <code>        message: 'Ten balls are distributed among twenty boxes. One box must contain at least two balls. What is the minimum?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2172 | <code>    }), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2173 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2174 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2175 | <code>test('Agent exact-answer audit rejects semantic zero from raw Office string search alone', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2176 | <code>    const fileAttachments = [{</code> | 声明局部标识符 `fileAttachments`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2177 | <code>        type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2178 | <code>        path: 'F:/workspace/slides.pptx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2179 | <code>        name: 'slides.pptx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2180 | <code>        extension: '.pptx'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2181 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2182 | <code>    const gap = detectStructuredAttachmentSemanticEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2183 | <code>        message: 'How many slides mention crustaceans in the attached presentation?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2184 | <code>        submission: { answer: '0' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2185 | <code>        fileAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2186 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2187 | <code>            tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2188 | <code>            args: { command: 'search raw OOXML for the word crustaceans' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2189 | <code>            response: { ok: true, status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2190 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2191 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2192 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2193 | <code>    assert.equal(gap.error, 'structured_attachment_semantic_zero_unverified');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2194 | <code>    assert.deepEqual(gap.recommendedTools, ['read_presentation']);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2195 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2196 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2197 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2198 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2199 | <code>                answer: '0',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2200 | <code>                confidence: 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2201 | <code>                reason: 'raw XML had zero exact word matches'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2202 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2203 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2204 | <code>        message: 'How many slides mention crustaceans in the attached presentation?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2205 | <code>        fileAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2206 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2207 | <code>            tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2208 | <code>            response: { ok: true, status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2209 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2210 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2211 | <code>    assert.ok(audited.warnings.includes('structured_attachment_semantic_zero_unverified'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2212 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2213 | <code>        selectExactAnswerAuditRecoveryGap(audited)?.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2214 | <code>        'structured_attachment_semantic_zero_unverified'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2215 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2216 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2217 | <code>    assert.equal(detectStructuredAttachmentSemanticEvidenceGap({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2218 | <code>        message: 'How many slides mention crustaceans in the attached presentation?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2219 | <code>        submission: { answer: '0' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2220 | <code>        fileAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2221 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2222 | <code>            tool: 'read_presentation',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2223 | <code>            response: { ok: true, status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2224 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2225 | <code>    }), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2226 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2227 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2228 | <code>test('Agent exact-answer audit requires multi-field selectors to close on one record row', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2229 | <code>    const message = 'From what country was the unknown language article with a flag unique from the others?';</code> | 声明局部标识符 `message`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2230 | <code>    const incompleteStep = {</code> | 声明局部标识符 `incompleteStep`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2231 | <code>        tool: 'web_archive_lookup',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2232 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2233 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2234 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2235 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2236 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2237 | <code>                    recordFieldProjections: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2238 | <code>                        recordNumber: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2239 | <code>                        title: 'Candidate article',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2240 | <code>                        fields: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2241 | <code>                            { label: 'Document Type', value: 'Article' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2242 | <code>                            { label: 'Country', value: 'de' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2243 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2244 | <code>                    }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2245 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2246 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2247 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2248 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2249 | <code>    const gap = detectRecordSelectorConjunctionEvidenceGap({</code> | 声明局部标识符 `gap`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2250 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2251 | <code>        submission: { answer: 'Germany' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2252 | <code>        stepResults: [incompleteStep]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2253 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2254 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2255 | <code>    assert.equal(gap.error, 'record_selector_fields_not_correlated');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2256 | <code>    assert.deepEqual(gap.requiredFields, ['language', 'document_type', 'country']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2257 | <code>    assert.deepEqual(gap.missingFields, ['language']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2258 | <code>    assert.match(gap.instruction, /do not prove a conjunction on one record/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2259 | <code>    assert.match(gap.instruction, /not a hard route/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2260 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2261 | <code>    const audited = validateExactAnswerSubmission({</code> | 声明局部标识符 `audited`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2262 | <code>        decision: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2263 | <code>            exactAnswerSubmission: normalizeExactAnswerSubmission({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2264 | <code>                answer: 'Germany',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2265 | <code>                confidence: 'medium',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2266 | <code>                reason: 'Germany is the most frequent country facet.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2267 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2268 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2269 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2270 | <code>        stepResults: [incompleteStep]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2271 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2272 | <code>    assert.ok(audited.warnings.includes('record_selector_fields_not_correlated'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2273 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2274 | <code>        selectExactAnswerAuditRecoveryGap(audited)?.error,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2275 | <code>        'record_selector_fields_not_correlated'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2276 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2277 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 2278 | <code>    assert.equal(detectRecordSelectorConjunctionEvidenceGap({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2279 | <code>        message,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2280 | <code>        submission: { answer: 'Guatemala' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2281 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2282 | <code>            ...incompleteStep,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2283 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2284 | <code>                ...incompleteStep.response,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2285 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2286 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2287 | <code>                        recordFieldProjections: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2288 | <code>                            recordNumber: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2289 | <code>                            title: 'Matching article',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2290 | <code>                            fields: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2291 | <code>                                { label: 'Language', value: 'Unknown' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2292 | <code>                                { label: 'Document Type', value: 'Article' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2293 | <code>                                { label: 'Country', value: 'gt' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2294 | <code>                            ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2295 | <code>                        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2296 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2297 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2298 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2299 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 2300 | <code>    }), null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“自动化测试：验证 ailis-agent-execution-flow 的契约与回归行为。”这一文件职责。 |
| 2301 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
