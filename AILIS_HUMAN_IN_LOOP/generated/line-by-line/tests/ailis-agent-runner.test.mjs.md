# tests/ailis-agent-runner.test.mjs 逐行讲解

- 快照提交：`a1f34b0c24bbf5fce436670e26ced97da3cb72c7`
- 文件职责：TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。
- 文件类型：`source-code`
- 原始行数：1695
- SHA-256：`12d9eed0b3a735851346a3f85852a4918d1f3984230e60200342bd63adc0c018`
- 可运行副本：[打开源文件](../../../source/tests/ailis-agent-runner.test.mjs)
- 依赖：`node:assert/strict`、`node:fs/promises`、`node:os`、`node:path`、`node:test`、`node:module`、`../electron/ailis-gateway.cjs`、`../electron/ailis-model-input-builder.cjs`、`../electron/ailis-agent-object-model.cjs`、`../electron/ailis-agent-runner.cjs`
- 主要符号：`require`、`imagePath`、`audioPath`、`prompt`、`initial`、`next`、`screenshotOutput`、`handoffSpec`、`requiredChoice`、`ordinaryChoice`、`finalChoice`、`invalidDecision`、`first`、`second`、`corrected`、`tools`、`holidayTools`、`provenance`、`reminderTools`、`reminderCall`、`relativeContext`、`discoveryOnly`、`executed`、`latestFailed`、`progress`、`searchStep`、`requestContext`、`withArchive`、`workspaceRoot`、`sourceRoot`、`sourcePath`、`staged`、`longName`、`sourceUrl`、`handoff`、`serialized`、`result`、`specs`、`jsonFetch`、`response`、`body`、`runAgent`、`visibleText`、`embeddedJsonText`、`fullWidthTags`、`personaPrompt`、`taskPrompt`、`exactPersonaPrompt`、`messages`、`developerTexts`、`rootDir`、`gateway`、`lookup`、`runner`、`personaContext`、`taskContext`、`personaContextText`、`taskContextText`、`compileCalls`、`recordCalls`、`readSpec`、`split`、`leaked`、`lines`、`toolOutput`、`serializedItems`、`calls`、`llmSettings`、`collaborationSpecs`、`personaSpecs`、`taskSpecs`、`items`、`contextManager`、`checkpoint`、`recentCheckpoint`、`status`、`baseUrl`、`chat`、`classifyConversation`、`classifyTask`、`emotional`、`taskClarification`、`write`、`read`、`approval`、`rpc`、`audit`、`auditDir`、`restoredRunner`、`restored`

> 阅读方法：先理解文件职责与依赖，再按行阅读；涉及异步、权限、记忆、工具和外部 I/O 的行应继续追踪调用方、错误路径和测试。

| 行号 | 原代码 | 逐行说明 |
| ---: | --- | --- |
| 1 | <code>import assert from 'node:assert/strict';</code> | 导入依赖 `node:assert/strict`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 2 | <code>import fs from 'node:fs/promises';</code> | 导入依赖 `node:fs/promises`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 3 | <code>import os from 'node:os';</code> | 导入依赖 `node:os`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 4 | <code>import path from 'node:path';</code> | 导入依赖 `node:path`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 5 | <code>import test from 'node:test';</code> | 导入依赖 `node:test`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 6 | <code>import { createRequire } from 'node:module';</code> | 导入依赖 `node:module`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 7 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 8 | <code>const require = createRequire(import.meta.url);</code> | 声明局部标识符 `require`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 9 | <code>const { AILISGateway } = require('../electron/ailis-gateway.cjs');</code> | 导入依赖 `../electron/ailis-gateway.cjs`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 10 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 11 | <code>    recordToolOutputToContextManager</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 12 | <code>} = require('../electron/ailis-model-input-builder.cjs');</code> | 导入依赖 `../electron/ailis-model-input-builder.cjs`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 13 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 14 | <code>    normalizeToolOutput,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 15 | <code>    toolOutputToResponseItems</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 16 | <code>} = require('../electron/ailis-agent-object-model.cjs');</code> | 导入依赖 `../electron/ailis-agent-object-model.cjs`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 17 | <code>const {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 18 | <code>    AILISAgentRunner,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 19 | <code>        assessAgentCompletionEvidence,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 20 | <code>        buildAgentDirectToolSpecs,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 21 | <code>        buildDirectModelImageAttachments,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 22 | <code>        buildInvalidDecisionProgressRecord,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 23 | <code>        buildLlmAgentDirectToolPrompt,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 24 | <code>    buildResearchProgressState,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 25 | <code>        buildStagedAttachmentFilename,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 26 | <code>        buildTaskRunHandoffPackage,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 27 | <code>        build_forked_context_checkpoint,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 28 | <code>        buildToolObservationDigest,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 29 | <code>        detectInvalidDecisionNoProgress,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 30 | <code>    isAgentLlmSettingsMissing,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 31 | <code>    looksLikeLeakedAgentProtocol,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 32 | <code>    resolveAgentDirectToolChoice,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 33 | <code>    resolveMemoryPolicy,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 34 | <code>    stageFileAttachmentsForWorkspace,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 35 | <code>    splitNativeProgressNoteArgs,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 36 | <code>    stripControlTags,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 37 | <code>    validateNativeDirectToolCall</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 38 | <code>} = require('../electron/ailis-agent-runner.cjs');</code> | 导入依赖 `../electron/ailis-agent-runner.cjs`，使本文件可以复用外部模块能力。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 39 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 40 | <code>test('direct model image attachments are scoped to Codex bridge image inputs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 41 | <code>    const imagePath = path.join('C:', 'tmp', 'board.png');</code> | 声明局部标识符 `imagePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 42 | <code>    const audioPath = path.join('C:', 'tmp', 'speech.mp3');</code> | 声明局部标识符 `audioPath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 43 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 44 | <code>    assert.deepEqual(buildDirectModelImageAttachments([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 45 | <code>        { path: imagePath, name: 'board.png' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 46 | <code>    ], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 47 | <code>        provider: 'codex-model-bridge'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 48 | <code>    }), [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 49 | <code>        image_url: imagePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 50 | <code>        detail: 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 51 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 52 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 53 | <code>    assert.deepEqual(buildDirectModelImageAttachments([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 54 | <code>        { path: audioPath, name: 'speech.mp3' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 55 | <code>    ], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 56 | <code>        provider: 'codex-model-bridge'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 57 | <code>    }), []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 58 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 59 | <code>    assert.deepEqual(buildDirectModelImageAttachments([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 60 | <code>        { path: imagePath, name: 'board.png' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 61 | <code>    ], {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 62 | <code>        provider: 'openai'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 63 | <code>    }), []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 64 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 65 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 66 | <code>test('TaskAgent treats perceived optimal-action claims as requiring a domain verifier', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 67 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 68 | <code>        message: 'Choose the guaranteed winning move from the attached image.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 69 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 70 | <code>        modelImageAttachments: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 71 | <code>            image_url: path.join('C:', 'tmp', 'board.png'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 72 | <code>            detail: 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 73 | <code>        }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 74 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 75 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 76 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 77 | <code>    assert.match(prompt.instructions, /perception alone is not verification/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 78 | <code>    assert.match(prompt.instructions, /domain rules engine, solver, simulator, or validator/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 79 | <code>    assert.ok(prompt.messages.some((message) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 80 | <code>        Array.isArray(message.content) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 81 | <code>        message.content.some((part) =&gt; part.type === 'image_url')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 82 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 83 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 84 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 85 | <code>test('TaskAgent preserves multiplicity and order for extracted lists', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 86 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 87 | <code>        message: 'Extract every value from the image in source order.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 88 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 89 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 90 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 91 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 92 | <code>    assert.match(prompt.instructions, /preserve every source occurrence/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 93 | <code>    assert.match(prompt.instructions, /repeated items are evidence, not duplicates to remove/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 94 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 95 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 96 | <code>test('TaskAgent verifies aggregate-selector winners against entity-level historical labels', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 97 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 98 | <code>        message: 'Which two historical birthplace cities are farthest apart?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 99 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 100 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 101 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 102 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 103 | <code>    assert.match(prompt.instructions, /establish the complete candidate set/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 104 | <code>    assert.match(prompt.instructions, /complete table of entity labels without the selector metric does not establish the winner/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 105 | <code>    assert.match(prompt.instructions, /obtain comparable coordinates for the boundary contenders/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 106 | <code>    assert.match(prompt.instructions, /verify each selected terminal record against an entity-level source/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 107 | <code>    assert.match(prompt.instructions, /preserve the entity-level source-period label/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 108 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 109 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 110 | <code>test('TaskAgent keeps tool-returned image artifacts enabled on the next model turn', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 111 | <code>    const imagePath = path.join(os.tmpdir(), `ailis-rendered-page-${Date.now()}.png`);</code> | 声明局部标识符 `imagePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 112 | <code>    return fs.writeFile(</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 113 | <code>        imagePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 114 | <code>        Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=', 'base64')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 115 | <code>    ).then(() =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 116 | <code>        const initial = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `initial`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 117 | <code>            message: 'Inspect the rendered page layout.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 118 | <code>            contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 119 | <code>            tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 120 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 121 | <code>        recordToolOutputToContextManager(initial.contextManager, {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 122 | <code>            id: 'web-screenshot-context-1',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 123 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 124 | <code>            args: { screenshot: [{ ref_id: 'turn0view0' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 125 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 126 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 127 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 128 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 129 | <code>                    content: [{ type: 'text', text: `Captured screenshot at ${imagePath}` }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 130 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 131 | <code>                        modelImage: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 132 | <code>                            image_url: imagePath,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 133 | <code>                            detail: 'original'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 134 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 135 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 136 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 137 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 138 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 139 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 140 | <code>        const next = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `next`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 141 | <code>            message: 'Inspect the rendered page layout.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 142 | <code>            contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 143 | <code>            contextManager: initial.contextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 144 | <code>            tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 145 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 146 | <code>        const screenshotOutput = next.input.find((item) =&gt;</code> | 声明局部标识符 `screenshotOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 147 | <code>            item?.type === 'function_call_output' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 148 | <code>            item?.output?.body?.kind === 'content_items'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 149 | <code>        );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 150 | <code>        assert.ok(screenshotOutput);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 151 | <code>        assert.ok(screenshotOutput.output.body.value.some((part) =&gt; part.type === 'input_image'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 152 | <code>        assert.ok(next.messages.some((message) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 153 | <code>            message.role === 'user' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 154 | <code>            Array.isArray(message.content) &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 155 | <code>            message.content.some((part) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 156 | <code>                part.type === 'image_url' &amp;&amp;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 157 | <code>                /^data:image\/png;base64,/.test(part.image_url?.url &#124;&#124; '')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 158 | <code>            )</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 159 | <code>        ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 160 | <code>    }).finally(() =&gt; fs.rm(imagePath, { force: true }));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 161 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 162 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 163 | <code>test('explicit task execution forces Persona handoff without changing ordinary conversation', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 164 | <code>    const handoffSpec = {</code> | 声明局部标识符 `handoffSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 165 | <code>        name: 'handoff_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 166 | <code>        description: 'System TaskAgent handoff.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 167 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 168 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 169 | <code>            required: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 170 | <code>            properties: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 171 | <code>            additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 172 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 173 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 174 | <code>    const requiredChoice = resolveAgentDirectToolChoice({</code> | 声明局部标识符 `requiredChoice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 175 | <code>        agentRuntimeRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 176 | <code>        requestContext: { requireTaskExecution: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 177 | <code>        directToolSpecs: [handoffSpec]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 178 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 179 | <code>    const ordinaryChoice = resolveAgentDirectToolChoice({</code> | 声明局部标识符 `ordinaryChoice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 180 | <code>        agentRuntimeRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 181 | <code>        requestContext: {},</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 182 | <code>        directToolSpecs: [handoffSpec]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 183 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 184 | <code>    const finalChoice = resolveAgentDirectToolChoice({</code> | 声明局部标识符 `finalChoice`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 185 | <code>        agentRuntimeRole: 'persona_orchestrator',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 186 | <code>        requestContext: { requireTaskExecution: true },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 187 | <code>        directToolSpecs: [handoffSpec],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 188 | <code>        safetyFinalizationReason: 'time_budget'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 189 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 190 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 191 | <code>    assert.deepEqual(requiredChoice, { name: 'handoff_task', required: true });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 192 | <code>    assert.equal(ordinaryChoice, 'auto');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 193 | <code>    assert.equal(finalChoice, 'none');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 194 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 195 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 196 | <code>        message: 'How many days until the holiday?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 197 | <code>        requireTaskExecution: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 198 | <code>        tools: [handoffSpec]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 199 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 200 | <code>    assert.match(prompt.instructions, /explicit task-execution contract/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 201 | <code>    assert.match(prompt.instructions, /do not answer the task directly/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 202 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 203 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 204 | <code>test('TaskAgent schema recovery guidance and invalid-decision fuse reject identical retries', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 205 | <code>    const invalidDecision = {</code> | 声明局部标识符 `invalidDecision`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 206 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 207 | <code>        status: 'invalid_native_tool_args',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 208 | <code>        error: 'year is required',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 209 | <code>        nativeToolCall: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 210 | <code>            name: 'datetime_info_to_timestamp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 211 | <code>            arguments: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 212 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 213 | <code>        raw: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 214 | <code>            errors: ['year is required', 'month is required'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 215 | <code>            schema: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 216 | <code>                type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 217 | <code>                required: ['year', 'month'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 218 | <code>                properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 219 | <code>                    year: { type: 'integer' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 220 | <code>                    month: { type: 'integer' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 221 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 222 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 223 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 224 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 225 | <code>    const first = buildInvalidDecisionProgressRecord(invalidDecision, 0);</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 226 | <code>    const second = buildInvalidDecisionProgressRecord(invalidDecision, 1);</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 227 | <code>    const corrected = buildInvalidDecisionProgressRecord({</code> | 声明局部标识符 `corrected`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 228 | <code>        ...invalidDecision,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 229 | <code>        nativeToolCall: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 230 | <code>            name: 'datetime_info_to_timestamp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 231 | <code>            arguments: { year: 2026, month: 7 }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 232 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 233 | <code>    }, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 234 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 235 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 236 | <code>        detectInvalidDecisionNoProgress([first, second]),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 237 | <code>        'repeated_invalid_native_tool_call'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 238 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 239 | <code>    assert.equal(detectInvalidDecisionNoProgress([second, corrected]), '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 240 | <code>    assert.equal(detectInvalidDecisionNoProgress([</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 241 | <code>        buildInvalidDecisionProgressRecord({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 242 | <code>            status: 'model_input_custom_json_decision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 243 | <code>            raw: { content: '{"plan_update":[]}' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 244 | <code>        }, 0),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 245 | <code>        buildInvalidDecisionProgressRecord({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 246 | <code>            status: 'model_input_custom_json_decision',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 247 | <code>            raw: { content: '{"plan_update":[]}' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 248 | <code>        }, 1)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 249 | <code>    ]), '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 250 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 251 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 252 | <code>        message: 'Convert tomorrow at 5 PM, then create the reminder.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 253 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 254 | <code>        requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 255 | <code>        tools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 256 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 257 | <code>                name: 'datetime_info_to_timestamp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 258 | <code>                parameters: invalidDecision.raw.schema</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 259 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 260 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 261 | <code>                name: 'utilities_2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 262 | <code>                description: 'Get current POSIX timestamp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 263 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 264 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 265 | <code>                    properties: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 266 | <code>                    additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 267 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 268 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 269 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 270 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 271 | <code>    assert.match(prompt.instructions, /Never repeat the same rejected tool name and arguments/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 272 | <code>    assert.match(prompt.instructions, /Build tool arguments only from explicit evidence/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 273 | <code>    assert.match(prompt.instructions, /leave optional fields omitted/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 274 | <code>    assert.match(prompt.instructions, /runtime clock, plausible default, or inferred context is not evidence/i);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 275 | <code>    assert.match(prompt.instructions, /preserve the exact literal text on the first lookup/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 276 | <code>    assert.match(prompt.instructions, /explicit execution-evidence contract/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 277 | <code>    assert.match(prompt.instructions, /ground it with runtime_environment and the exposed temporal tools/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 278 | <code>    assert.match(prompt.instructions, /identify it from its name or description even when names are opaque/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 279 | <code>    assert.match(prompt.instructions, /call it first/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 280 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 281 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 282 | <code>test('TaskAgent preserves missing current-time prerequisites for stateful temporal tools', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 283 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 284 | <code>        message: 'Push my upcoming reminder to tomorrow at 5 PM.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 285 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 286 | <code>        tools: [</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 287 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 288 | <code>                name: 'shift_timestamp',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 289 | <code>                description: 'Shift a POSIX timestamp by a requested delta.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 290 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 291 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 292 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 293 | <code>                        timestamp: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 294 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 295 | <code>                    required: ['timestamp']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 296 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 297 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 298 | <code>            {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 299 | <code>                name: 'search_reminder',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 300 | <code>                description: 'Search reminders by optional timestamp bounds.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 301 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 302 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 303 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 304 | <code>                        reminder_timestamp_lowerbound: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 305 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 306 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 307 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 308 | <code>        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 309 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 310 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 311 | <code>    assert.match(prompt.instructions, /no current-time observation capability is available/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 312 | <code>    assert.match(prompt.instructions, /do not derive absolute values from runtime_environment/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 313 | <code>    assert.match(prompt.instructions, /Ask for an absolute time anchor or return the missing prerequisite/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 314 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 315 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 316 | <code>test('native tool validation preserves type-scrambled scalar leaves', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 317 | <code>    const tools = [{</code> | 声明局部标识符 `tools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 318 | <code>        name: 'search_contacts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 319 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 320 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 321 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 322 | <code>                name: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 323 | <code>                    description: 'Name of contact person'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 324 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 325 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 326 | <code>            required: ['name']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 327 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 328 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 329 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 330 | <code>    assert.equal(validateNativeDirectToolCall({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 331 | <code>        name: 'search_contacts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 332 | <code>        arguments: { name: 'Homer S' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 333 | <code>    }, tools).ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 334 | <code>    assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 335 | <code>        validateNativeDirectToolCall({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 336 | <code>            name: 'search_contacts',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 337 | <code>            arguments: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 338 | <code>        }, tools).errors.join(' '),</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 339 | <code>        /name is required/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 340 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 341 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 342 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 343 | <code>test('native tool validation enforces literal entity and relative-time evidence provenance', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 344 | <code>    const holidayTools = [{</code> | 声明局部标识符 `holidayTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 345 | <code>        name: 'search_holiday',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 346 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 347 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 348 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 349 | <code>                holiday_name: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 350 | <code>                year: { type: ['integer', 'null'] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 351 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 352 | <code>            required: ['holiday_name']</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 353 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 354 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 355 | <code>    const provenance = {</code> | 声明局部标识符 `provenance`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 356 | <code>        enforceEvidenceProvenance: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 357 | <code>        userText: 'What is the timestamp for Thanksgiving?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 358 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 359 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 360 | <code>    assert.equal(validateNativeDirectToolCall({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 361 | <code>        name: 'search_holiday',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 362 | <code>        arguments: { holiday_name: 'Thanksgiving' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 363 | <code>    }, holidayTools, provenance).ok, true);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 364 | <code>    assert.match(validateNativeDirectToolCall({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 365 | <code>        name: 'search_holiday',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 366 | <code>        arguments: { holiday_name: 'Thanksgiving Day' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 367 | <code>    }, holidayTools, provenance).errors.join(' '), /preserve the user's exact literal value/i);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 368 | <code>    assert.equal(validateNativeDirectToolCall({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 369 | <code>        name: 'search_holiday',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 370 | <code>        arguments: { holiday_name: 'Thanksgiving Day' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 371 | <code>    }, holidayTools, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 372 | <code>        ...provenance,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 373 | <code>        userText: 'What is the timestamp for Thanksgiving Day?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 374 | <code>    }).ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 375 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 376 | <code>    const reminderTools = [{</code> | 声明局部标识符 `reminderTools`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 377 | <code>        name: 'utilities_2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 378 | <code>        description: 'Get current POSIX timestamp.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 379 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 380 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 381 | <code>            properties: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 382 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 383 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 384 | <code>        name: 'search_reminder',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 385 | <code>        description: 'Search reminders by optional timestamp bounds.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 386 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 387 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 388 | <code>            properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 389 | <code>                creation_timestamp_lowerbound: { type: 'number' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 390 | <code>                creation_timestamp_upperbound: { type: 'number' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 391 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 392 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 393 | <code>    }];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 394 | <code>    const reminderCall = {</code> | 声明局部标识符 `reminderCall`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 395 | <code>        name: 'search_reminder',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 396 | <code>        arguments: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 397 | <code>            creation_timestamp_lowerbound: 1784131200,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 398 | <code>            creation_timestamp_upperbound: 1784217600</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 399 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 400 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 401 | <code>    const relativeContext = {</code> | 声明局部标识符 `relativeContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 402 | <code>        enforceEvidenceProvenance: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 403 | <code>        originalUserGoal: 'What reminder did I create yesterday?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 404 | <code>        userText: 'Use the device date to figure it out.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 405 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 406 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 407 | <code>    assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 408 | <code>        validateNativeDirectToolCall(reminderCall, reminderTools, relativeContext).errors.join(' '),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 409 | <code>        /requires a successful current-time observation first/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 410 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 411 | <code>    assert.equal(validateNativeDirectToolCall(reminderCall, reminderTools, {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 412 | <code>        ...relativeContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 413 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 414 | <code>            tool: 'utilities_2',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 415 | <code>            response: { ok: true, result: { content: '1784245587' } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 416 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 417 | <code>    }).ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 418 | <code>    assert.equal(validateNativeDirectToolCall(reminderCall, reminderTools.slice(1), {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 419 | <code>        ...relativeContext,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 420 | <code>        userText: 'Use 2026-07-16 as yesterday.'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 421 | <code>    }).ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 422 | <code>    assert.match(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 423 | <code>        validateNativeDirectToolCall(reminderCall, reminderTools.slice(1), relativeContext).errors.join(' '),</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 424 | <code>        /no current-time observation capability or explicit absolute time anchor/i</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 425 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 426 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 427 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 428 | <code>test('execution-evidence completion gate prevents false completed results', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 429 | <code>    assert.deepEqual(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 430 | <code>        assessAgentCompletionEvidence({</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 431 | <code>            agentRuntimeRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 432 | <code>            requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 433 | <code>            stepResults: []</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 434 | <code>        }),</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 435 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 436 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 437 | <code>            status: 'incomplete',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 438 | <code>            reason: 'execution_evidence_missing',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 439 | <code>            unresolvedFields: ['No successful task-execution tool call was recorded.']</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 440 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 441 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 442 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 443 | <code>    const discoveryOnly = assessAgentCompletionEvidence({</code> | 声明局部标识符 `discoveryOnly`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 444 | <code>        agentRuntimeRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 445 | <code>        requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 446 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 447 | <code>            tool: 'tool_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 448 | <code>            response: { ok: true, status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 449 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 450 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 451 | <code>    assert.equal(discoveryOnly.status, 'incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 452 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 453 | <code>    const executed = assessAgentCompletionEvidence({</code> | 声明局部标识符 `executed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 454 | <code>        agentRuntimeRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 455 | <code>        requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 456 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 457 | <code>            tool: 'search_messages',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 458 | <code>            response: { ok: true, status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 459 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 460 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 461 | <code>    assert.equal(executed.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 462 | <code>    assert.equal(executed.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 463 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 464 | <code>    const latestFailed = assessAgentCompletionEvidence({</code> | 声明局部标识符 `latestFailed`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 465 | <code>        agentRuntimeRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 466 | <code>        requireExecutionEvidence: true,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 467 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 468 | <code>            tool: 'datetime_info_to_timestamp',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 469 | <code>            response: { ok: true, status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 470 | <code>        }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 471 | <code>            tool: 'add_reminder',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 472 | <code>            response: { ok: false, status: 'invalid_args', error: 'content is required' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 473 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 474 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 475 | <code>    assert.equal(latestFailed.status, 'incomplete');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 476 | <code>    assert.deepEqual(latestFailed.unresolvedFields, ['content is required']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 477 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 478 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 479 | <code>test('TaskAgent research progress preserves mechanical web state without deciding the answer', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 480 | <code>    const progress = buildResearchProgressState([{</code> | 声明局部标识符 `progress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 481 | <code>        id: 'web-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 482 | <code>        tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 483 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 484 | <code>            search_query: [{ q: 'original author 2019 topic' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 485 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 486 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 487 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 488 | <code>            status: 'partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 489 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 490 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 491 | <code>                    observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 492 | <code>                        status: 'partial',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 493 | <code>                        transport_ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 494 | <code>                        content_ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 495 | <code>                        capability_ready: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 496 | <code>                        semantic_level: 'metadata',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 497 | <code>                        complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 498 | <code>                        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 499 | <code>                        next_actions: [{ tool: 'web_run', args: { open: [{ ref_id: 'turn0search0' }] } }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 500 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 501 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 502 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 503 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 504 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 505 | <code>        id: 'web-2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 506 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 507 | <code>        args: { url: 'https://blocked.example.test/paper' },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 508 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 509 | <code>            ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 510 | <code>            status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 511 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 512 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 513 | <code>                    observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 514 | <code>                        status: 'blocked',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 515 | <code>                        transport_ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 516 | <code>                        content_ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 517 | <code>                        capability_ready: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 518 | <code>                        semantic_level: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 519 | <code>                        complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 520 | <code>                        truncated: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 521 | <code>                        error_code: 'access_denied'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 522 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 523 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 524 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 525 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 526 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 527 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 528 | <code>    assert.equal(progress.schema, 'ailis.research_progress.v1');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 529 | <code>    assert.equal(progress.attempts.length, 2);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 530 | <code>    assert.deepEqual(progress.attempts[0].queries, ['original author 2019 topic']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 531 | <code>    assert.deepEqual(progress.blockedHosts, ['blocked.example.test']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 532 | <code>    assert.equal(progress.attempts[1].errorCode, 'access_denied');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 533 | <code>    assert.doesNotMatch(JSON.stringify(progress), /finalAnswer&#124;candidateAnswer&#124;author\s*:/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 534 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 535 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 536 | <code>test('TaskAgent research progress exposes archive affordance after repeated historical searches', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 537 | <code>    const searchStep = (id, query) =&gt; ({</code> | 声明局部标识符 `searchStep`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 538 | <code>        id,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 539 | <code>        tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 540 | <code>        args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 541 | <code>            search_query: [{ q: query }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 542 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 543 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 544 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 545 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 546 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 547 | <code>                details: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 548 | <code>                    observationContract: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 549 | <code>                        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 550 | <code>                        transport_ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 551 | <code>                        content_ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 552 | <code>                        capability_ready: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 553 | <code>                        semantic_level: 'metadata',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 554 | <code>                        complete: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 555 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 556 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 557 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 558 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 559 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 560 | <code>    const requestContext = {</code> | 声明局部标识符 `requestContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 561 | <code>        currentUserMessage: 'As of 2020, which country appeared in the public library database result page?'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 562 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 563 | <code>    const progress = buildResearchProgressState([</code> | 声明局部标识符 `progress`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 564 | <code>        searchStep('search-1', 'library database country 2020'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 565 | <code>        searchStep('search-2', 'public catalog result country')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 566 | <code>    ], requestContext);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 568 | <code>    assert.equal(progress.attempts[0].operation, 'search');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 569 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 570 | <code>        progress.strategyAlerts[0].code,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 571 | <code>        'historical_archive_not_tried_after_repeated_search'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 572 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 573 | <code>    assert.match(progress.instruction, /web_run\.archive/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 574 | <code>    assert.match(progress.instruction, /not a hard route/i);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 575 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 576 | <code>    const withArchive = buildResearchProgressState([</code> | 声明局部标识符 `withArchive`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 577 | <code>        searchStep('search-1', 'library database country 2020'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 578 | <code>        searchStep('search-2', 'public catalog result country'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 579 | <code>        {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 580 | <code>            id: 'archive-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 581 | <code>            tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 582 | <code>            args: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 583 | <code>                archive: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 584 | <code>                    url: 'https://example.test/catalog?',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 585 | <code>                    mode: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 586 | <code>                    contains: '2020 country'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 587 | <code>                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 588 | <code>            },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 589 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 590 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 591 | <code>                status: 'completed'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 592 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 593 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 594 | <code>    ], requestContext);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 595 | <code>    assert.equal(withArchive.attempts[2].operation, 'archive');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 596 | <code>    assert.deepEqual(withArchive.strategyAlerts, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 597 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 598 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 599 | <code>test('AILIS stages external attachments inside the active workspace', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 600 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-attachment-workspace-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 601 | <code>    const sourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-attachment-source-'));</code> | 声明局部标识符 `sourceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 602 | <code>    const sourcePath = path.join(sourceRoot, 'inventory.xlsx');</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 603 | <code>    await fs.writeFile(sourcePath, 'spreadsheet-bytes');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 604 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 605 | <code>    const staged = await stageFileAttachmentsForWorkspace([{</code> | 声明局部标识符 `staged`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 606 | <code>        type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 607 | <code>        name: 'inventory.xlsx',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 608 | <code>        path: sourcePath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 609 | <code>    }], workspaceRoot, 'session:with:unsafe/chars');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 611 | <code>    assert.equal(staged.length, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 612 | <code>    assert.equal(staged[0].staged, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 613 | <code>    assert.equal(staged[0].stageStatus, 'copied_to_workspace');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 614 | <code>    assert.equal(path.relative(workspaceRoot, staged[0].path).startsWith('..'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 615 | <code>    assert.equal(await fs.readFile(staged[0].path, 'utf8'), 'spreadsheet-bytes');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 616 | <code>    assert.equal(staged[0].originalPath, sourcePath);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 617 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 618 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 619 | <code>test('AILIS preserves file extensions when staging long attachment names', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 620 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-long-attachment-workspace-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 621 | <code>    const sourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-long-attachment-source-'));</code> | 声明局部标识符 `sourceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 622 | <code>    const longName = `${'gaia-attachment-'.repeat(12)}dataset.xlsx`;</code> | 声明局部标识符 `longName`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 623 | <code>    const sourcePath = path.join(sourceRoot, longName);</code> | 声明局部标识符 `sourcePath`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 624 | <code>    await fs.writeFile(sourcePath, 'spreadsheet-bytes');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 625 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 626 | <code>    const [staged] = await stageFileAttachmentsForWorkspace([{</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 627 | <code>        type: 'file',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 628 | <code>        name: longName,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 629 | <code>        path: sourcePath</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 630 | <code>    }], workspaceRoot, 'gaia-long-name');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 631 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 632 | <code>    assert.equal(staged.staged, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 633 | <code>    assert.equal(path.extname(staged.path), '.xlsx');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 634 | <code>    assert.ok(path.basename(staged.path).length &lt;= 99);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 635 | <code>    assert.equal(await fs.readFile(staged.path, 'utf8'), 'spreadsheet-bytes');</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 636 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 637 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 638 | <code>test('AILIS staging uses a stable attachment identity instead of recursively growing filenames', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 639 | <code>    const first = buildStagedAttachmentFilename({</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 640 | <code>        id: 'gaia-file-99c9cc74',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 641 | <code>        name: `${'99c9cc74-'.repeat(18)}recipe.mp3`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 642 | <code>        path: 'F:\\source\\recipe.mp3'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 643 | <code>    }, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 644 | <code>    const second = buildStagedAttachmentFilename({</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 645 | <code>        id: 'gaia-file-99c9cc74',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 646 | <code>        name: first,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 647 | <code>        path: `F:\\workspace\\${first}`</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 648 | <code>    }, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 649 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 650 | <code>    assert.equal(first, second);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 651 | <code>    assert.equal(path.extname(first), '.mp3');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 652 | <code>    assert.ok(first.length &lt;= 68);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 653 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 654 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 655 | <code>test('TaskAgent handoff preserves structured web source refs when prose omits URLs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 656 | <code>    const sourceUrl = 'https://docs.example.test/guide';</code> | 声明局部标识符 `sourceUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 657 | <code>    const handoff = buildTaskRunHandoffPackage({</code> | 声明局部标识符 `handoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 658 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 659 | <code>        runId: 'task-run-source-refs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 660 | <code>        sessionId: 'task-session-source-refs',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 661 | <code>        message: 'research the current guide with sources',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 662 | <code>        finalAnswer: 'The guide is complete and uses the official documentation.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 663 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 664 | <code>            id: 'fetch-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 665 | <code>            iteration: 1,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 666 | <code>            tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 667 | <code>            title: 'Open official guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 668 | <code>            args: { url: sourceUrl, lineno: 17 },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 669 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 670 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 671 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 672 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 673 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 674 | <code>                        result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 675 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 676 | <code>                        webSearchOutput: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 677 | <code>                            fetch: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 678 | <code>                                sources: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 679 | <code>                                    ref_id: 'source_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 680 | <code>                                    title: 'Official guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 681 | <code>                                    url: sourceUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 682 | <code>                                    lineno: 17</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 683 | <code>                                }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 684 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 685 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 686 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 687 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 688 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 689 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 690 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 691 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 692 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 693 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 694 | <code>    assert.deepEqual(handoff.sourceRefs, [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 695 | <code>        ref_id: 'source_1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 696 | <code>        title: 'Official guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 697 | <code>        url: sourceUrl,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 698 | <code>        lineno: 17</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 699 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 700 | <code>    assert.equal(handoff.userVisibleSummary, 'The guide is complete and uses the official documentation.');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 701 | <code>    assert.match(handoff.collectedData[0].sourceRefs[0].url, /docs\.example\.test/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 702 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 703 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 704 | <code>test('TaskAgent handoff keeps raw web_search candidates separate from opened source refs', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 705 | <code>    const handoff = buildTaskRunHandoffPackage({</code> | 声明局部标识符 `handoff`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 706 | <code>        status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 707 | <code>        finalAnswer: 'No supported answer was found.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 708 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 709 | <code>            id: 'search-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 710 | <code>            tool: 'web_search',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 711 | <code>            args: { query: 'specific article' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 712 | <code>            response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 713 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 714 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 715 | <code>                result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 716 | <code>                    structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 717 | <code>                        search: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 718 | <code>                            results: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 719 | <code>                                title: 'Unrelated candidate',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 720 | <code>                                url: 'https://example.test/unrelated'</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 721 | <code>                            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 722 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 723 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 724 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 725 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 726 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 727 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 728 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 729 | <code>    assert.deepEqual(handoff.sourceRefs, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 730 | <code>    assert.doesNotMatch(handoff.userVisibleSummary, /example\.test\/unrelated/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 731 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 732 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 733 | <code>test('TaskAgent context keeps the original user goal separate from delegated work', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 734 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 735 | <code>        message: 'Read every spreadsheet row and report the raw table.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 736 | <code>        originalUserGoal: 'Calculate total food sales excluding drinks and return USD with two decimals.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 737 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 738 | <code>        taskAgentInheritanceMode: 'checkpoint',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 739 | <code>        taskState: { schema: 'ailis.agent_task_state.v1' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 740 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 741 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 742 | <code>    const serialized = JSON.stringify(prompt.contextPackage);</code> | 声明局部标识符 `serialized`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 743 | <code>    assert.match(serialized, /Calculate total food sales excluding drinks/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 744 | <code>    assert.match(serialized, /Read every spreadsheet row and report the raw table/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 745 | <code>    assert.match(serialized, /original_user_goal/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 746 | <code>    assert.match(serialized, /delegated_task/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 747 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 748 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 749 | <code>test('TaskAgent loads structured MCP follow-up action specs on the next turn', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 750 | <code>    const result = {};</code> | 声明局部标识符 `result`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 751 | <code>    Object.defineProperty(result, '__ailisSuggestedMcpTools', {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 752 | <code>        value: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 753 | <code>            id: 'mcp__ailis_research__open_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 754 | <code>            callable: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 755 | <code>            spec: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 756 | <code>                name: 'mcp__ailis_research__open_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 757 | <code>                description: 'Open a selected source.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 758 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 759 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 760 | <code>                    required: ['url'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 761 | <code>                    properties: { url: { type: 'string' } },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 762 | <code>                    additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 763 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 764 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 765 | <code>        }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 766 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 767 | <code>    const specs = buildAgentDirectToolSpecs({</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 768 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 769 | <code>            modelVisibleSpecs: () =&gt; [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 770 | <code>            definition: () =&gt; null</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 771 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 772 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 773 | <code>        stepResults: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 774 | <code>            tool: 'mcp__ailis_research__web_research',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 775 | <code>            response: { ok: true, result }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 776 | <code>        }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 777 | <code>        requestContext: { agentRole: 'task_agent' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 778 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 779 | <code>    assert.ok(specs.some((spec) =&gt; spec.name === 'mcp__ailis_research__open_page'));</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 780 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 781 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 782 | <code>async function jsonFetch(url, options = {}) {</code> | 定义函数 `jsonFetch`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 783 | <code>    const response = await fetch(url, {</code> | 声明局部标识符 `response`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 784 | <code>        ...options,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 785 | <code>        headers: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 786 | <code>            'content-type': 'application/json',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 787 | <code>            ...(options.headers &#124;&#124; {})</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 788 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 789 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 790 | <code>    const body = await response.json();</code> | 声明局部标识符 `body`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 791 | <code>    return { response, body };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 792 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 793 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 794 | <code>async function runAgent(baseUrl, payload) {</code> | 定义函数 `runAgent`；应继续阅读其参数、返回值、异常和所有调用方。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 795 | <code>    return await jsonFetch(`${baseUrl}/agent/run`, {</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 796 | <code>        method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 797 | <code>        body: JSON.stringify(payload)</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 798 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 799 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 800 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 801 | <code>test('AILIS Agent Runner strips persona_output blocks from visible text', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 802 | <code>    const visibleText = stripControlTags(`我喜欢和你一起研究新东西。</code> | 声明局部标识符 `visibleText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 803 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 804 | <code>&lt;persona_output&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 805 | <code>{"emotion":"joyful","gestureIntent":"open_hands","taskState":"listening"}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 806 | <code>&lt;/persona_output&gt;`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 807 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 808 | <code>    assert.equal(visibleText, '我喜欢和你一起研究新东西。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 809 | <code>    assert.doesNotMatch(visibleText, /persona_output&#124;gestureIntent&#124;taskState/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 810 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 811 | <code>    const embeddedJsonText = stripControlTags(`{好的啦～被你夸得有点小害羞呢。</code> | 声明局部标识符 `embeddedJsonText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 812 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 813 | <code>{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 814 | <code>"persona_output": {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 815 | <code>"emotion": "happy",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 816 | <code>"gestureIntent": "tilt_head_smile",</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 817 | <code>"taskState": "idle_listening"</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 818 | <code>}</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 819 | <code>}}`);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 820 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 821 | <code>    assert.equal(embeddedJsonText, '好的啦～被你夸得有点小害羞呢。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 822 | <code>    assert.doesNotMatch(embeddedJsonText, /persona_output&#124;gestureIntent&#124;taskState/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 823 | <code>    assert.doesNotMatch(embeddedJsonText, /^\{&#124;\}$/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 824 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 825 | <code>    const fullWidthTags = stripControlTags(</code> | 声明局部标识符 `fullWidthTags`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 826 | <code>        '[expression:happy]【expression:surprised】【emotion:flustered】我没有把内部表情标签说出来。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 827 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 828 | <code>    assert.equal(fullWidthTags, '我没有把内部表情标签说出来。');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 829 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 830 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 831 | <code>test('AILIS parent Persona prompt stays conversational while TaskAgent keeps execution guidance', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 832 | <code>    const personaPrompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `personaPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 833 | <code>        message: '老婆，你的说话语气怎么有点冷漠',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 834 | <code>        toolSummary: 'Persona tool surface: handoff_task.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 835 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 836 | <code>    assert.match(personaPrompt.instructions, /当前有效交互偏好/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 837 | <code>    assert.match(personaPrompt.instructions, /Keep ordinary conversation natural/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 838 | <code>    assert.match(personaPrompt.instructions, /authoritative host clock/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 839 | <code>    assert.match(personaPrompt.instructions, /call handoff_task exactly once/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 840 | <code>    assert.match(personaPrompt.instructions, /Harness transfers the immutable current user request/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 841 | <code>    assert.match(personaPrompt.instructions, /TaskResult packet is the factual boundary/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 842 | <code>    assert.match(personaPrompt.instructions, /You do not create, wait for, resume, list, or close agents/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 843 | <code>    assert.doesNotMatch(personaPrompt.instructions, /arithmetic, multi-step logic, optimization/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 844 | <code>    assert.doesNotMatch(personaPrompt.instructions, /spawn_agent creates&#124;subagent_notification&#124;task_name/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 845 | <code>    assert.doesNotMatch(personaPrompt.instructions, /mcp__ailis_research__web_research&#124;For local file and data tasks&#124;When exec output is truncated/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 846 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 847 | <code>    const taskPrompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `taskPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 848 | <code>        message: '查找最新资料并验证结果',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 849 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 850 | <code>        toolSummary: 'Direct tools are exposed.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 851 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 852 | <code>    assert.doesNotMatch(taskPrompt.instructions, /mcp__ailis_research__web_research/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 853 | <code>    assert.match(taskPrompt.instructions, /public web facts/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 854 | <code>    assert.match(taskPrompt.instructions, /For local file and data tasks/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 855 | <code>    assert.match(taskPrompt.instructions, /join across records, global ordering or de-duplication/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 856 | <code>    assert.match(taskPrompt.instructions, /tool_search for a dedicated metadata, document, API, or data capability/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 857 | <code>    assert.match(taskPrompt.instructions, /do not spend the remaining work budget paging through a site/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 858 | <code>    assert.doesNotMatch(taskPrompt.instructions, /open_page actions&#124;most authoritative returned source URL/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 859 | <code>    assert.match(taskPrompt.instructions, /mechanical transport metadata, not a decision/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 860 | <code>    assert.match(taskPrompt.instructions, /candidate-set boundary/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 861 | <code>    assert.match(taskPrompt.instructions, /remaining relevant lines or sections/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 862 | <code>    assert.doesNotMatch(taskPrompt.instructions, /complete=true&#124;reasoning_ready=true/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 863 | <code>    assert.match(taskPrompt.instructions, /bounded numerical optimization, minimax, game-strategy/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 864 | <code>    assert.match(taskPrompt.instructions, /exhaustively enumerate the finite integer state space/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 865 | <code>    assert.match(taskPrompt.instructions, /literal reading makes an explicitly stated restriction redundant or vacuous/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 866 | <code>    assert.match(taskPrompt.instructions, /prefer the smallest non-vacuous quantifier repair/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 867 | <code>    assert.match(taskPrompt.instructions, /verify every predicate on the same record row/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 868 | <code>    assert.match(taskPrompt.instructions, /direct authoritative page, document, or API response/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 869 | <code>    assert.match(taskPrompt.instructions, /preserve the name, place, organization, category/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 870 | <code>    assert.match(taskPrompt.instructions, /compact operand ledger/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 871 | <code>    assert.match(taskPrompt.instructions, /do not invent a terminal probability/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 872 | <code>    assert.match(taskPrompt.instructions, /layout-sensitive or source-form questions/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 873 | <code>    assert.match(taskPrompt.instructions, /do not convert a stacked fraction into a slash expression/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 874 | <code>    assert.match(taskPrompt.instructions, /exact whole token or phrase/);</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 875 | <code>    assert.match(taskPrompt.instructions, /Do not merge singular\/plural forms/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 876 | <code>    assert.match(taskPrompt.instructions, /do not put an unverified intermediate entity/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 877 | <code>    assert.match(taskPrompt.instructions, /retrieve the parent candidate index/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 878 | <code>    assert.doesNotMatch(taskPrompt.instructions, /Keep ordinary conversation natural/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 879 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 880 | <code>    const exactPersonaPrompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `exactPersonaPrompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 881 | <code>        message: 'What is the minimum guaranteed value?',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 882 | <code>        exactAnswerMode: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 883 | <code>        toolSummary: 'Persona tool surface: handoff_task.'</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 884 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 885 | <code>    assert.match(exactPersonaPrompt.instructions, /arithmetic, multi-step logic, optimization/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 886 | <code>    assert.match(exactPersonaPrompt.instructions, /call handoff_task instead of answering them from intuition/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 887 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 888 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 889 | <code>test('AILIS Persona heartbeat reuses ordinary history and ends with an ephemeral developer item', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 890 | <code>    const prompt = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `prompt`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 891 | <code>        message: '我们继续聊刚才的话题。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 892 | <code>        messageHistory: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 893 | <code>            { role: 'user', content: '我们继续聊刚才的话题。' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 894 | <code>            { role: 'assistant', content: '好，我在这里陪你。' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 895 | <code>        ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 896 | <code>        suppressCurrentUserMessage: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 897 | <code>        ephemeralDeveloperMessage: 'Companion mode heartbeat. This is not a user message.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 898 | <code>        contextMode: 'persona',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 899 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 900 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 901 | <code>    const messages = prompt.input.filter((item) =&gt; item.type === 'message');</code> | 声明局部标识符 `messages`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 902 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 903 | <code>    assert.deepEqual(messages.map((item) =&gt; item.role), ['user', 'assistant', 'developer']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 904 | <code>    assert.equal(</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 905 | <code>        messages.filter((item) =&gt; item.role === 'user').length,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 906 | <code>        1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 907 | <code>    );</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 908 | <code>    assert.match(messages.at(-1).content[0].text, /not a user message/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 909 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 910 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 911 | <code>test('AILIS refreshes ephemeral developer guidance on every reused context turn', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 912 | <code>    const first = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `first`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 913 | <code>        message: 'Continue the task.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 914 | <code>        ephemeralDeveloperMessage: 'First-turn temporary guidance.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 915 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 916 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 917 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 918 | <code>    const second = buildLlmAgentDirectToolPrompt({</code> | 声明局部标识符 `second`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 919 | <code>        message: 'Continue the task.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 920 | <code>        contextManager: first.contextManager,</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 921 | <code>        ephemeralDeveloperMessage: 'Second-turn recovery guidance.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 922 | <code>        contextMode: 'task_agent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 923 | <code>        tools: []</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 924 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 925 | <code>    const developerTexts = second.input</code> | 声明局部标识符 `developerTexts`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 926 | <code>        .filter((item) =&gt; item.type === 'message' &amp;&amp; item.role === 'developer')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 927 | <code>        .flatMap((item) =&gt; item.content &#124;&#124; [])</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 928 | <code>        .map((part) =&gt; part.text &#124;&#124; '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 929 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 930 | <code>    assert.ok(developerTexts.some((text) =&gt; /Second-turn recovery guidance/.test(text)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 931 | <code>    assert.ok(!developerTexts.some((text) =&gt; /First-turn temporary guidance/.test(text)));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 932 | <code>    assert.ok(!(second.contextManager.rawItems?.() &#124;&#124; []).some((item) =&gt;</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 933 | <code>        JSON.stringify(item).includes('Second-turn recovery guidance')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 934 | <code>    ));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 935 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 936 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 937 | <code>test('AILIS Persona receives active preferences and active task state while TaskAgent stays isolated', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 938 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-context-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 939 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 940 | <code>        projectRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 941 | <code>        workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 942 | <code>        auditDir: path.join(rootDir, 'audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 943 | <code>        profileCurationEnabled: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 944 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 945 | <code>    gateway.preferenceState.append({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 946 | <code>        slot: 'tone.response',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 947 | <code>        operation: 'set',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 948 | <code>        value: '自然简洁',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 949 | <code>        scope: 'persistent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 950 | <code>        confidence: 0.98,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 951 | <code>        observedAt: '2026-07-09T10:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 952 | <code>        evidence: { messageId: 'pref-1', quote: '以后说得自然简洁' }</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 953 | <code>    }, { userMessage: '以后说得自然简洁' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 954 | <code>    gateway.taskResultCapsules.save({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 955 | <code>        taskId: 'old-roxy-guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 956 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 957 | <code>        request: '做一套洛茜攻略',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 958 | <code>        generatedAt: '2026-07-09T11:00:00.000Z',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 959 | <code>        taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 960 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 961 | <code>            finalAnswer: '洛茜的核心队伍结论已经整理完成。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 962 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 963 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 964 | <code>    const lookup = await gateway.executeGatewayLocalTool('task_results', {</code> | 声明局部标识符 `lookup`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 965 | <code>        action: 'search',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 966 | <code>        query: '洛茜配队',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 967 | <code>        limit: 2</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 968 | <code>    }, { sessionId: 'main' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 969 | <code>    assert.equal(lookup.isError, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 970 | <code>    assert.equal(lookup.structuredContent.results[0].taskId, 'old-roxy-guide');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 971 | <code>    gateway.taskResultCapsules.recordExecution({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 972 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 973 | <code>        parentRunId: 'parent-roxy-guide',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 974 | <code>        task: '继续完成洛茜攻略并核对配队',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 975 | <code>        status: 'max_loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 976 | <code>        ok: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 977 | <code>        subagent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 978 | <code>            id: 'roxy-worker',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 979 | <code>            childRunId: 'roxy-child'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 980 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 981 | <code>        taskRunHandoff: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 982 | <code>            status: 'max_loop',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 983 | <code>            partialAnswer: '已整理技能，配队仍待核验。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 984 | <code>            failureAnalysis: { bottleneck: '配队证据不足' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 985 | <code>            resume: { checkpointAvailable: true, contextManagerCheckpoint: { history_version: 1, items: [] } }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 986 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 987 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 988 | <code>    const runner = gateway.ensureAgentRunner();</code> | 声明局部标识符 `runner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 989 | <code>    const personaContext = runner.compileMemoryContext({</code> | 声明局部标识符 `personaContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 990 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 991 | <code>        message: '洛茜配队怎么调整',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 992 | <code>        request: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 993 | <code>        contextMode: 'persona'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 994 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 995 | <code>    const taskContext = runner.compileMemoryContext({</code> | 声明局部标识符 `taskContext`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 996 | <code>        sessionId: 'main',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 997 | <code>        message: '洛茜配队怎么调整',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 998 | <code>        request: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 999 | <code>        contextMode: 'task_agent'</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1000 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1001 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1002 | <code>    const personaContextText = personaContext.asDeveloperInstruction();</code> | 声明局部标识符 `personaContextText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1003 | <code>    const taskContextText = taskContext.asDeveloperInstruction();</code> | 声明局部标识符 `taskContextText`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1004 | <code>    assert.match(personaContextText, /tone\.response: 自然简洁/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1005 | <code>    assert.match(personaContextText, /当前活动任务状态/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1006 | <code>    assert.match(personaContextText, /继续完成洛茜攻略并核对配队/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1007 | <code>    assert.doesNotMatch(personaContextText, /洛茜的核心队伍结论/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1008 | <code>    assert.doesNotMatch(taskContextText, /当前活动任务状态&#124;tone\.response: 自然简洁/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1009 | <code>    assert.doesNotMatch(taskContextText, /## Persona&#124;## Relationship/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1010 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1011 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1012 | <code>test('AILIS memory policy can isolate evaluation turns from persistent memory', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1013 | <code>    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-policy-'));</code> | 声明局部标识符 `rootDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1014 | <code>    let compileCalls = 0;</code> | 声明局部标识符 `compileCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1015 | <code>    let recordCalls = 0;</code> | 声明局部标识符 `recordCalls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1016 | <code>    const runner = new AILISAgentRunner({</code> | 声明局部标识符 `runner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1017 | <code>        gateway: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1018 | <code>            workspaceRoot: rootDir,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1019 | <code>            auditDir: path.join(rootDir, 'audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1020 | <code>            emitGatewayEvent() {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1021 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1022 | <code>        memoryRuntime: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1023 | <code>            recordTurn() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1024 | <code>                recordCalls += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1025 | <code>                return { ok: true };</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1026 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1027 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1028 | <code>        contextCompiler: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1029 | <code>            compile() {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1030 | <code>                compileCalls += 1;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1031 | <code>                return 'compiled-memory';</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1032 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1033 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1034 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1035 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1036 | <code>    assert.equal(resolveMemoryPolicy({ memoryPolicy: 'read-only' }), 'read_only');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1037 | <code>    assert.equal(resolveMemoryPolicy({ context: { memory_policy: 'disabled' } }), 'disabled');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1038 | <code>    assert.equal(resolveMemoryPolicy({ memoryPolicy: 'unknown' }), 'read_write');</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1039 | <code>    assert.equal(runner.compileMemoryContext({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1040 | <code>        sessionId: 'eval-task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1041 | <code>        message: 'independent benchmark task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1042 | <code>        request: { memoryPolicy: 'disabled' }</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1043 | <code>    }), '');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1044 | <code>    assert.equal(compileCalls, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1045 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1046 | <code>    runner.recordMemoryTurn({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1047 | <code>        request: { memoryPolicy: 'disabled' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1048 | <code>        result: { finalAnswer: 'answer' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1049 | <code>        message: 'question',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1050 | <code>        sessionId: 'eval-task'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1051 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1052 | <code>    runner.recordMemoryTurn({</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1053 | <code>        request: { memoryPolicy: 'read_only' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1054 | <code>        result: { finalAnswer: 'answer' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1055 | <code>        message: 'question',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1056 | <code>        sessionId: 'eval-task'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1057 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1058 | <code>    assert.equal(recordCalls, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1059 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1060 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1061 | <code>test('AILIS direct tool specs allow model-authored progress notes without passing them to tools', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1062 | <code>    const specs = buildAgentDirectToolSpecs({</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1063 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1064 | <code>            modelVisibleSpecs: () =&gt; [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1065 | <code>                name: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1066 | <code>                description: 'Read a file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1067 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1068 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1069 | <code>                    additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1070 | <code>                    required: ['path'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1071 | <code>                    properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1072 | <code>                        path: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1073 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1074 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1075 | <code>            }]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1076 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1077 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1078 | <code>        requestContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1079 | <code>            directToolLimit: 4</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1080 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1081 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1082 | <code>    const readSpec = specs.find((spec) =&gt; spec.name === 'read');</code> | 声明局部标识符 `readSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1083 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1084 | <code>    assert.ok(readSpec);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1085 | <code>    assert.equal(readSpec.parameters.properties.progress_note.type, 'string');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1086 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1087 | <code>    const split = splitNativeProgressNoteArgs({</code> | 声明局部标识符 `split`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1088 | <code>        path: 'note.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1089 | <code>        progress_note: '我先确认这份文件里有没有可以直接引用的证据。'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1090 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1091 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1092 | <code>    assert.deepEqual(split.args, { path: 'note.txt' });</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1093 | <code>    assert.match(split.progressNote, /确认这份文件/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1094 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1095 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1096 | <code>test('AILIS direct tool specs honor an explicit one-tool allowlist', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1097 | <code>    const specs = buildAgentDirectToolSpecs({</code> | 声明局部标识符 `specs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1098 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1099 | <code>            modelVisibleSpecs: () =&gt; ['first', 'second', 'third'].map((name) =&gt; ({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1100 | <code>                name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1101 | <code>                description: `${name} tool`,</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1102 | <code>                parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1103 | <code>                    type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1104 | <code>                    properties: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1105 | <code>                    additionalProperties: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1106 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1107 | <code>            }))</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1108 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1109 | <code>    }, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1110 | <code>        requestContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1111 | <code>            agentRole: 'task_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1112 | <code>            directToolLimit: 1</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1113 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1114 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1115 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1116 | <code>    assert.deepEqual(specs.map((spec) =&gt; spec.name), ['first']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1117 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1118 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1119 | <code>test('AILIS Agent Runner rejects visible tool protocols', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1120 | <code>    const leaked = `&lt;｜｜DSML｜｜tool_calls&gt;</code> | 声明局部标识符 `leaked`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1121 | <code>&lt;｜｜DSML｜｜invoke name="mcp__ailis_research__web_research"&gt;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1122 | <code>&lt;｜｜DSML｜｜parameter name="query" string="true"&gt;Rossi guide&lt;/｜｜DSML｜｜parameter&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1123 | <code>&lt;/｜｜DSML｜｜invoke&gt;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1124 | <code>&lt;/｜｜DSML｜｜tool_calls&gt;`;</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1125 | <code>    assert.equal(looksLikeLeakedAgentProtocol(leaked), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1126 | <code>    assert.equal(looksLikeLeakedAgentProtocol(JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1127 | <code>        tool_calls: [{ function: { name: 'web_search', arguments: '{}' } }]</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1128 | <code>    })), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1129 | <code>    assert.equal(looksLikeLeakedAgentProtocol('已经整理好洛茜的技能、配队和培养建议。'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1130 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1131 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1132 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1133 | <code>test('web source viewport prompt digest uses only canonical Codex/OAI names', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1134 | <code>    const [digest] = buildToolObservationDigest([{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1135 | <code>        id: 'fetch-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1136 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1137 | <code>        title: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1138 | <code>        args: { url: 'https://example.test/page', lineno: 10 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1139 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1140 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1141 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1142 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1143 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1144 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1145 | <code>                    text: 'Source viewport:\nL10: answer bearing line'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1146 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1147 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1148 | <code>                    sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1149 | <code>                        type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1150 | <code>                        action: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1151 | <code>                            type: 'web_fetch',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1152 | <code>                            url: 'https://example.test/page',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1153 | <code>                            lineno: 10</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1154 | <code>                        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1155 | <code>                        url: 'https://example.test/page',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1156 | <code>                        contentType: 'text/html',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1157 | <code>                        totalLines: 20,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1158 | <code>                        lineStart: 10,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1159 | <code>                        lineEnd: 11,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1160 | <code>                        hasMoreBefore: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1161 | <code>                        hasMoreAfter: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1162 | <code>                        lines: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1163 | <code>                            { lineNumber: 10, line_number: 10, lineno: 10, text: 'answer bearing line' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1164 | <code>                        ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1165 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1166 | <code>                    sourceViewport: { type: 'source_viewport' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1167 | <code>                    modelVisibleMode: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1168 | <code>                    sourceRetrievalComplete: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1169 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1170 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1171 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1172 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1173 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1174 | <code>    assert.match(digest.text, /Opened page source viewport/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1175 | <code>    assert.match(digest.text, /lineno=10/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1176 | <code>    assert.match(digest.text, /L10: answer bearing line/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1177 | <code>    assert.doesNotMatch(digest.text, /sourceWindow&#124;sourceViewport&#124;modelVisibleMode&#124;sourceRetrievalComplete/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1178 | <code>    assert.equal(digest.structuredContent, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1179 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1180 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1181 | <code>test('bounded web source viewport keeps answer-bearing middle lines in the finalization digest', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1182 | <code>    const lines = Array.from({ length: 17 }, (_, index) =&gt; ({</code> | 声明局部标识符 `lines`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1183 | <code>        lineno: 55 + index,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1184 | <code>        text: `${'table-cell '.repeat(24)}${index === 7 ? 'MIDDLE_ANSWER_EVIDENCE' : `row-${index + 1}`}`</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1185 | <code>    }));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1186 | <code>    const [digest] = buildToolObservationDigest([{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1187 | <code>        id: 'bounded-source-viewport-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1188 | <code>        tool: 'web_run',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1189 | <code>        args: { open: [{ ref_id: 'turn0view0', lineno: 55 }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1190 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1191 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1192 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1193 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1194 | <code>                content: [{ type: 'text', text: 'Source viewport model preview' }],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1195 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1196 | <code>                    sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1197 | <code>                        type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1198 | <code>                        action: { type: 'open_page', url: 'https://example.test/table', lineno: 55 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1199 | <code>                        url: 'https://example.test/table',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1200 | <code>                        contentType: 'text/markdown',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1201 | <code>                        totalLines: 110,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1202 | <code>                        lineStart: 55,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1203 | <code>                        lineEnd: 71,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1204 | <code>                        hasMoreBefore: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1205 | <code>                        hasMoreAfter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1206 | <code>                        lines</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1207 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1208 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1209 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1210 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1211 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1212 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1213 | <code>    assert.ok(digest.text.length &gt; 3600);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1214 | <code>    assert.ok(digest.text.length &lt; 8000);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1215 | <code>    assert.match(digest.text, /MIDDLE_ANSWER_EVIDENCE/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1216 | <code>    assert.match(digest.text, /L55:/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1217 | <code>    assert.match(digest.text, /L71:/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1218 | <code>    assert.equal(digest.lossless, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1219 | <code>    assert.equal(digest.compression, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1220 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1221 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1222 | <code>test('TaskAgent finalization digest unwraps nested MCP source viewport evidence', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1223 | <code>    const [digest] = buildToolObservationDigest([{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1224 | <code>        id: 'nested-open-page-digest-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1225 | <code>        tool: 'mcp__ailis_research__open_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1226 | <code>        args: { url: 'https://example.test/article', lineno: 8 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1227 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1228 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1229 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1230 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1231 | <code>                content: [{ type: 'text', text: 'TOOL_OUTPUT_MODEL_PREVIEW:\n... [truncated for model budget] ...' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1232 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1233 | <code>                    status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1234 | <code>                    server: 'ailis_research',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1235 | <code>                    tool: 'open_page',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1236 | <code>                    result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1237 | <code>                        structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1238 | <code>                            sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1239 | <code>                                type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1240 | <code>                                action: { type: 'open_page', url: 'https://example.test/article', lineno: 8 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1241 | <code>                                url: 'https://example.test/article',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1242 | <code>                                totalLines: 94,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1243 | <code>                                lineStart: 8,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1244 | <code>                                lineEnd: 21,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1245 | <code>                                lines: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1246 | <code>                                    { lineno: 17, text: '## Fluffy Dragons' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1247 | <code>                                    { lineno: 18, text: 'Two authors comment with distaste on the increasingly cuddly, "fluffy" nature of dragons.' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1248 | <code>                                ]</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1249 | <code>                            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1250 | <code>                        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1251 | <code>                    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1252 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1253 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1254 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1255 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1256 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1257 | <code>    assert.match(digest.text, /L18: Two authors comment with distaste/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1258 | <code>    assert.match(digest.text, /"fluffy"/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1259 | <code>    assert.doesNotMatch(digest.text, /TOOL_OUTPUT_MODEL_PREVIEW/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1260 | <code>    assert.equal(digest.details, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1261 | <code>    assert.equal(digest.structuredContent, null);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1262 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1263 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1264 | <code>test('web observations keep source content but remove Harness evidence verdicts from model input', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1265 | <code>    const toolOutput = normalizeToolOutput({</code> | 声明局部标识符 `toolOutput`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1266 | <code>        id: 'fetch-verdict-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1267 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1268 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1269 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1270 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1271 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1272 | <code>                content: [{</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1273 | <code>                    type: 'text',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1274 | <code>                    text: [</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1275 | <code>                        'Source viewport:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1276 | <code>                        'L138: 洛茜是六星输出干员。',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1277 | <code>                        'Evidence gap: only metadata was found',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1278 | <code>                        'reasoning_ready=false',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1279 | <code>                        'suggested_next_calls: fetch another page'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1280 | <code>                    ].join('\n')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1281 | <code>                }],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1282 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1283 | <code>                    sourceWindow: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1284 | <code>                        type: 'source_viewport',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1285 | <code>                        action: { type: 'open_page', url: 'https://example.test/guide', lineno: 138 },</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1286 | <code>                        url: 'https://example.test/guide',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1287 | <code>                        lineStart: 138,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1288 | <code>                        lineEnd: 138,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1289 | <code>                        totalLines: 200,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1290 | <code>                        hasMoreAfter: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1291 | <code>                        lines: [{ lineno: 138, text: '洛茜是六星输出干员。' }]</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1292 | <code>                    },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1293 | <code>                    complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1294 | <code>                    reasoningReady: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1295 | <code>                    evidenceGap: 'only metadata was found',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1296 | <code>                    suggestedNextCalls: [{ tool: 'web_fetch' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1297 | <code>                    outputTruncatedForModel: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1298 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1299 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1300 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1301 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1302 | <code>    const serializedItems = JSON.stringify(toolOutputToResponseItems(toolOutput));</code> | 声明局部标识符 `serializedItems`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1303 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1304 | <code>    assert.match(serializedItems, /洛茜是六星输出干员/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1305 | <code>    assert.match(serializedItems, /Has more after: true/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1306 | <code>    assert.doesNotMatch(serializedItems, /Evidence gap&#124;reasoning_ready&#124;suggested_next_calls&#124;outputTruncatedForModel&#124;only metadata/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1307 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1308 | <code>    const [digest] = buildToolObservationDigest([{</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1309 | <code>        id: 'fetch-verdict-1',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1310 | <code>        tool: 'mcp__ailis_research__web_fetch',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1311 | <code>        response: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1312 | <code>            ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1313 | <code>            status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1314 | <code>            result: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1315 | <code>                content: [{ type: 'text', text: 'L138: 洛茜是六星输出干员。\nEvidence gap: only metadata was found\nreasoning_ready=false' }],</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1316 | <code>                structuredContent: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1317 | <code>                    complete: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1318 | <code>                    evidenceGap: 'only metadata was found',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1319 | <code>                    reasoningReady: false</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1320 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1321 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1322 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1323 | <code>    }]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1324 | <code>    assert.match(digest.text, /洛茜是六星输出干员/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1325 | <code>    assert.doesNotMatch(`${digest.text}\n${digest.structuredContent}`, /Evidence gap&#124;reasoning_ready&#124;only metadata&#124;"complete"/);</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1326 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1327 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1328 | <code>test('AILIS Agent Runner passes parent LLM settings only to collaboration tool calls', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1329 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-tool-context-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1330 | <code>    const calls = [];</code> | 声明局部标识符 `calls`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1331 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1332 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1333 | <code>        auditDir: path.join(workspaceRoot, '.audit'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1334 | <code>        runtime: {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1335 | <code>        emitGatewayEvent() {},</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1336 | <code>        async callTool(request) {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1337 | <code>            calls.push(request);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1338 | <code>            return {</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1339 | <code>                ok: true,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1340 | <code>                status: 'completed',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1341 | <code>                content: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1342 | <code>                details: { status: 'completed' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1343 | <code>            };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1344 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1345 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1346 | <code>    const runner = new AILISAgentRunner({</code> | 声明局部标识符 `runner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1347 | <code>        gateway,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1348 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1349 | <code>        pendingStorePath: path.join(workspaceRoot, 'pending-agent-state.json')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1350 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1351 | <code>    const llmSettings = {</code> | 声明局部标识符 `llmSettings`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1352 | <code>        provider: 'deepseek',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1353 | <code>        baseUrl: 'https://api.deepseek.com',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1354 | <code>        model: 'deepseek-chat',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1355 | <code>        apiKey: 'test-key'</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1356 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1357 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1358 | <code>    await runner.executeAgentToolStep({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1359 | <code>        runId: 'run-parent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1360 | <code>        step: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1361 | <code>            id: 'step-agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1362 | <code>            title: 'Spawn task agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1363 | <code>            tool: 'spawn_agent',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1364 | <code>            args: { task_name: 'solve_task', message: 'solve task', fork_turns: 'none' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1365 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1366 | <code>        toolContext: { workspace: workspaceRoot, sessionKey: 'main' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1367 | <code>        request: { llmSettings },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1368 | <code>        iteration: 0</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1369 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1370 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1371 | <code>    assert.deepEqual(calls[0].context.llmSettings, llmSettings);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1372 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1373 | <code>    calls.length = 0;</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1374 | <code>    await runner.executeAgentToolStep({</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1375 | <code>        runId: 'run-parent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1376 | <code>        step: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1377 | <code>            id: 'step-exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1378 | <code>            title: 'Run command',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1379 | <code>            tool: 'exec',</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1380 | <code>            args: { command: 'echo ok' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1381 | <code>        },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1382 | <code>        toolContext: { workspace: workspaceRoot, sessionKey: 'main' },</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1383 | <code>        request: { llmSettings },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1384 | <code>        iteration: 1</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1385 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1386 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1387 | <code>    assert.equal(calls[0].context.llmSettings, undefined);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1388 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1389 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1390 | <code>test('AILIS persona exposes only system handoff while TaskAgent keeps execution tools', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1391 | <code>    const handoffSpec = {</code> | 声明局部标识符 `handoffSpec`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1392 | <code>        name: 'handoff_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1393 | <code>        description: 'Hand the current request to the system TaskAgent.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1394 | <code>        parameters: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1395 | <code>            type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1396 | <code>            additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1397 | <code>            required: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1398 | <code>            properties: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1399 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1400 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1401 | <code>    const collaborationSpecs = Object.fromEntries([</code> | 声明局部标识符 `collaborationSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1402 | <code>        'spawn_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1403 | <code>        'followup_task',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1404 | <code>        'wait_agent',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1405 | <code>        'list_agents',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1406 | <code>        'close_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1407 | <code>    ].map((name) =&gt; [name, {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1408 | <code>        name,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1409 | <code>        description: `${name} contract`,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1410 | <code>        parameters: { type: 'object', additionalProperties: false, properties: {} }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1411 | <code>    }]));</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1412 | <code>    collaborationSpecs.spawn_agent.parameters = {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1413 | <code>        type: 'object',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1414 | <code>        required: ['task_name', 'message'],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1415 | <code>        additionalProperties: false,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1416 | <code>        properties: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1417 | <code>            task_name: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1418 | <code>            message: { type: 'string' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1419 | <code>            fork_turns: { type: 'string' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1420 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1421 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1422 | <code>    const gateway = {</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1423 | <code>        gatewayToolRuntimeRegistry: {</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1424 | <code>            modelVisibleSpecs: () =&gt; [</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1425 | <code>                handoffSpec,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1426 | <code>                collaborationSpecs.spawn_agent,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1427 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1428 | <code>                    name: 'read',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1429 | <code>                    description: 'Read a file.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1430 | <code>                    parameters: { type: 'object', properties: { path: { type: 'string' } } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1431 | <code>                },</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1432 | <code>                {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1433 | <code>                    name: 'exec',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1434 | <code>                    description: 'Run a command.',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1435 | <code>                    parameters: { type: 'object', properties: { command: { type: 'string' } } }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1436 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1437 | <code>            ],</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1438 | <code>            definition: (toolId) =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1439 | <code>                if (toolId === 'handoff_task') return { spec: handoffSpec };</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1440 | <code>                if (collaborationSpecs[toolId]) return { spec: collaborationSpecs[toolId] };</code> | 条件分支：根据当前输入、状态、权限或能力决定是否进入该执行路径。 |
| 1441 | <code>                return null;</code> | 返回语句：结束当前函数，并把值或状态交给调用方。 |
| 1442 | <code>            }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1443 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1444 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1445 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1446 | <code>    const personaSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `personaSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1447 | <code>        requestContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1448 | <code>            agentRole: 'persona_orchestrator'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1449 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1450 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1451 | <code>    assert.deepEqual(personaSpecs.map((spec) =&gt; spec.name), ['handoff_task']);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1452 | <code>    assert.deepEqual(personaSpecs[0].parameters.required, []);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1453 | <code>    assert.equal(personaSpecs[0].parameters.additionalProperties, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1454 | <code>    assert.equal(personaSpecs.some((spec) =&gt; spec.name === 'subagents'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1455 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1456 | <code>    const taskSpecs = buildAgentDirectToolSpecs(gateway, {</code> | 声明局部标识符 `taskSpecs`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1457 | <code>        requestContext: {</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1458 | <code>            agentRole: 'task_agent'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1459 | <code>        }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1460 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1461 | <code>    assert.ok(taskSpecs.some((spec) =&gt; spec.name === 'read'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1462 | <code>    assert.ok(taskSpecs.some((spec) =&gt; spec.name === 'exec'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1463 | <code>    assert.equal(taskSpecs.some((spec) =&gt; spec.name === 'handoff_task'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1464 | <code>    assert.equal(taskSpecs.some((spec) =&gt; spec.name === 'spawn_agent'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1465 | <code>    assert.equal(taskSpecs.some((spec) =&gt; spec.name === 'subagents'), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1466 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1467 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1468 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1469 | <code>test('AILIS sanitized agent fork follows Codex rollout filtering rules', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1470 | <code>    const items = [</code> | 声明局部标识符 `items`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1471 | <code>        { type: 'message', role: 'system', content: [{ type: 'input_text', text: 'system' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1472 | <code>        { type: 'message', role: 'developer', content: [{ type: 'input_text', text: 'developer' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1473 | <code>        { type: 'message', role: 'user', content: [{ type: 'input_text', text: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1474 | <code>            type: 'context',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1475 | <code>            memory_context: 'relationship memory must not enter TaskAgent',</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1476 | <code>            runtime_environment: { current_date: '2026-07-11' }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1477 | <code>        }) }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1478 | <code>        { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'old goal' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1479 | <code>        { type: 'message', role: 'assistant', phase: 'commentary', content: [{ type: 'output_text', text: 'progress' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1480 | <code>        { type: 'message', role: 'assistant', phase: 'final_answer', content: [{ type: 'output_text', text: 'old final' }] },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1481 | <code>        { type: 'function_call', name: 'web_search', call_id: 'call-1', arguments: '{}' },</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1482 | <code>        { type: 'function_call_output', call_id: 'call-1', output: 'large tool output' },</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1483 | <code>        { type: 'message', role: 'user', content: [{ type: 'input_text', text: 'current correction' }] }</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1484 | <code>    ];</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1485 | <code>    const contextManager = {</code> | 声明局部标识符 `contextManager`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1486 | <code>        rawItems: () =&gt; items,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1487 | <code>        historyVersion: () =&gt; 7,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1488 | <code>        referenceContextItem: () =&gt; ({ type: 'turn_context', id: 'ref-1' })</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1489 | <code>    };</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1490 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1491 | <code>    const checkpoint = build_forked_context_checkpoint(contextManager, 'all');</code> | 声明局部标识符 `checkpoint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1492 | <code>    assert.equal(checkpoint.history_version, 7);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1493 | <code>    assert.deepEqual(checkpoint.items.map((item) =&gt; `${item.role &#124;&#124; item.type}:${item.phase &#124;&#124; ''}`), [</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1494 | <code>        'system:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1495 | <code>        'developer:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1496 | <code>        'user:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1497 | <code>        'user:',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1498 | <code>        'assistant:final_answer',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1499 | <code>        'user:'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1500 | <code>    ]);</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1501 | <code>    assert.equal(checkpoint.items.some((item) =&gt; item.type === 'function_call_output'), false);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1502 | <code>    assert.doesNotMatch(JSON.stringify(checkpoint.items), /relationship memory/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1503 | <code>    assert.match(JSON.stringify(checkpoint.items), /2026-07-11/);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1504 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1505 | <code>    const recentCheckpoint = build_forked_context_checkpoint(contextManager, '1');</code> | 声明局部标识符 `recentCheckpoint`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1506 | <code>    assert.deepEqual(recentCheckpoint.items.map((item) =&gt; item.role), ['user']);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1507 | <code>    assert.equal(recentCheckpoint.reference_context_item, null);</code> | 记忆/上下文状态操作：参与数据保留、预算编译、恢复或生命周期连续性。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1508 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1509 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1510 | <code>test('AILIS Agent Runner accepts local vLLM and Ollama settings without API keys', () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1511 | <code>    assert.equal(isAgentLlmSettingsMissing({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1512 | <code>        provider: 'vllm',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1513 | <code>        baseUrl: 'http://127.0.0.1:8000/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1514 | <code>        model: 'Qwen/Qwen2-0.5B-Instruct',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1515 | <code>        apiKey: ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1516 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1517 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1518 | <code>    assert.equal(isAgentLlmSettingsMissing({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1519 | <code>        provider: 'ollama',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1520 | <code>        baseUrl: 'http://127.0.0.1:11434',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1521 | <code>        model: 'llama3.2',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1522 | <code>        apiKey: ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1523 | <code>    }), false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1524 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1525 | <code>    assert.equal(isAgentLlmSettingsMissing({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1526 | <code>        provider: 'openai-compatible',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1527 | <code>        baseUrl: 'https://api.example.test/v1',</code> | 发起或配置网络通信；阅读时重点检查目标地址、超时、认证、错误和重试策略。 |
| 1528 | <code>        model: 'demo-model',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1529 | <code>        apiKey: ''</code> | 敏感信息相关逻辑：阅读时重点检查是否避免明文日志、越权注入和不安全持久化。 |
| 1530 | <code>    }), true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1531 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1532 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1533 | <code>test('AILIS Agent Runner plans chat and executes file tasks through the Gateway', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1534 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1535 | <code>    const gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1536 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1537 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1538 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1539 | <code>        auditDir: path.join(workspaceRoot, '.audit')</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1540 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1541 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1542 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1543 | <code>        const status = await gateway.start();</code> | 声明局部标识符 `status`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1544 | <code>        const baseUrl = status.url;</code> | 声明局部标识符 `baseUrl`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1545 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1546 | <code>        const chat = await runAgent(baseUrl, {</code> | 声明局部标识符 `chat`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1547 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1548 | <code>            message: '你好'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1549 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1550 | <code>        assert.equal(chat.response.status, 200);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1551 | <code>        assert.equal(chat.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1552 | <code>        assert.equal(chat.body.mode, 'conversation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1553 | <code>        assert.equal(chat.body.intent, 'emotional_chat');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1554 | <code>        assert.equal(chat.body.executionRequired, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1555 | <code>        assert.equal(chat.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1556 | <code>        assert.match(chat.body.displayText, /统一的 AILIS Agent 链路/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1557 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1558 | <code>        const classifyConversation = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyConversation`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1559 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1560 | <code>            message: '我今天有点累',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1561 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1562 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1563 | <code>        assert.equal(classifyConversation.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1564 | <code>        assert.equal(classifyConversation.body.status, 'classified');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1565 | <code>        assert.equal(classifyConversation.body.mode, 'conversation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1566 | <code>        assert.equal(classifyConversation.body.executionRequired, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1567 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1568 | <code>        const classifyTask = await runAgent(baseUrl, {</code> | 声明局部标识符 `classifyTask`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1569 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1570 | <code>            message: '/read note.txt',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1571 | <code>            classifyOnly: true</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1572 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1573 | <code>        assert.equal(classifyTask.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1574 | <code>        assert.equal(classifyTask.body.status, 'classified');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1575 | <code>        assert.equal(classifyTask.body.mode, 'task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1576 | <code>        assert.equal(classifyTask.body.executionRequired, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1577 | <code>        assert.equal(classifyTask.body.plan[0].tool, 'read');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1578 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1579 | <code>        const emotional = await runAgent(baseUrl, {</code> | 声明局部标识符 `emotional`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1580 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1581 | <code>            message: '我今天有点累'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1582 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1583 | <code>        assert.equal(emotional.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1584 | <code>        assert.equal(emotional.body.mode, 'conversation');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1585 | <code>        assert.equal(emotional.body.intent, 'emotional_chat');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1586 | <code>        assert.equal(emotional.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1587 | <code>        assert.match(emotional.body.displayText, /慢一点/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1588 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1589 | <code>        const taskClarification = await runAgent(baseUrl, {</code> | 声明局部标识符 `taskClarification`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1590 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1591 | <code>            message: '帮我开发一个网站'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1592 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1593 | <code>        assert.equal(taskClarification.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1594 | <code>        assert.equal(taskClarification.body.mode, 'task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1595 | <code>        assert.equal(taskClarification.body.intent, 'task_clarification');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1596 | <code>        assert.equal(taskClarification.body.executionRequired, false);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1597 | <code>        assert.equal(taskClarification.body.steps.length, 0);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1598 | <code>        assert.match(taskClarification.body.displayText, /识别成任务请求/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1599 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1600 | <code>        const write = await runAgent(baseUrl, {</code> | 声明局部标识符 `write`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1601 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1602 | <code>            message: '/write note.txt hello runner'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1603 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1604 | <code>        assert.equal(write.body.ok, true, write.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1605 | <code>        assert.equal(write.body.status, 'completed');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1606 | <code>        assert.equal(write.body.mode, 'task');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1607 | <code>        assert.equal(write.body.executionRequired, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1608 | <code>        assert.equal(write.body.intent, 'write_file');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1609 | <code>        assert.equal(write.body.steps[0].tool, 'write');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1610 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1611 | <code>        const read = await runAgent(baseUrl, {</code> | 声明局部标识符 `read`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1612 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1613 | <code>            message: '请读取 note.txt'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1614 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1615 | <code>        assert.equal(read.body.ok, true, read.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1616 | <code>        assert.equal(read.body.intent, 'read_file');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1617 | <code>        assert.equal(read.body.steps[0].tool, 'read');</code> | 工具/证据操作：参与能力调用、结果标准化、证据引用或产物管理。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1618 | <code>        assert.match(read.body.displayText, /hello runner/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1619 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1620 | <code>        const approval = await runAgent(baseUrl, {</code> | 声明局部标识符 `approval`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1621 | <code>            sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1622 | <code>            message: '/exec node -e "console.log(1)"'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1623 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1624 | <code>        assert.equal(approval.body.ok, false);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1625 | <code>        assert.equal(approval.body.status, 'needs_approval');</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1626 | <code>        assert.match(approval.body.displayText, /需要.*确认/);</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1627 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1628 | <code>        const rpc = await jsonFetch(`${baseUrl}/rpc`, {</code> | 声明局部标识符 `rpc`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1629 | <code>            method: 'POST',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1630 | <code>            body: JSON.stringify({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1631 | <code>                method: 'agent.run',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1632 | <code>                params: {</code> | 开始赋值或复合结构，后续行将补充其字段、元素或实现。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1633 | <code>                    sessionId: 'agent-test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1634 | <code>                    message: '/read note.txt'</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1635 | <code>                }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1636 | <code>            })</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1637 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1638 | <code>        assert.equal(rpc.body.ok, true, rpc.body.displayText);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1639 | <code>        assert.match(rpc.body.displayText, /hello runner/);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1640 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1641 | <code>        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);</code> | 声明局部标识符 `audit`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1642 | <code>        assert.equal(audit.body.ok, true);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1643 | <code>        assert.ok(audit.body.entries.some((entry) =&gt; entry.type === 'agent.run'));</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1644 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1645 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1646 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1647 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1648 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1649 | <code>test('AILIS Agent Runner restores durable pending plans after Gateway restart', async () =&gt; {</code> | 定义箭头函数/回调，用于事件、异步链、集合处理或延迟执行。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1650 | <code>    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-pending-plan-test-'));</code> | 声明局部标识符 `workspaceRoot`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1651 | <code>    const auditDir = path.join(workspaceRoot, '.audit');</code> | 声明局部标识符 `auditDir`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1652 | <code>    let gateway = new AILISGateway({</code> | 声明局部标识符 `gateway`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1653 | <code>        port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1654 | <code>        workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1655 | <code>        projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1656 | <code>        auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1657 | <code>    });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1658 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1659 | <code>    try {</code> | 异常边界开始：包裹可能失败的 I/O、网络、解析或运行时操作。 |
| 1660 | <code>        await gateway.start();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1661 | <code>        const runner = gateway.ensureAgentRunner();</code> | 声明局部标识符 `runner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1662 | <code>        runner.storePendingPlan({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1663 | <code>            planId: 'plan-restore',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1664 | <code>            sessionId: 'durable-plan-session',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1665 | <code>            message: '需要确认的计划',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1666 | <code>            createdAt: Date.now(),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1667 | <code>            expiresAt: Date.now() + 60000,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1668 | <code>            planner: 'llm-computer-planner',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1669 | <code>            intent: 'durable_plan_test',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1670 | <code>            summary: '持久化计划',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1671 | <code>            riskLevel: 'medium',</code> | 安全/审批相关逻辑：参与权限、风险分级、允许范围或拒绝边界。 |
| 1672 | <code>            model: 'mock',</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1673 | <code>            steps: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1674 | <code>            verificationSteps: [],</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1675 | <code>            raw: {}</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1676 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1677 | <code>        assert.equal(runner.getStatus().pendingPlanCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1678 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1679 | <code>        await gateway.stop();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1680 | <code>␠</code> | 空行：分隔相邻语义块，提高可读性；不产生运行时行为。 |
| 1681 | <code>        gateway = new AILISGateway({</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1682 | <code>            port: 0,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1683 | <code>            workspaceRoot,</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1684 | <code>            projectRoot: path.resolve('.'),</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1685 | <code>            auditDir</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1686 | <code>        });</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1687 | <code>        await gateway.start();</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1688 | <code>        const restoredRunner = gateway.ensureAgentRunner();</code> | 声明局部标识符 `restoredRunner`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1689 | <code>        assert.equal(restoredRunner.getStatus().restoredPendingPlanCount, 1);</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1690 | <code>        const restored = restoredRunner.findPendingPlanForSession('durable-plan-session');</code> | 声明局部标识符 `restored`，后续逻辑通过它保存配置、状态、依赖或中间结果。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1691 | <code>        assert.equal(restored.planId, 'plan-restore');</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1692 | <code>    } finally {</code> | 执行该文件中的一项具体声明、参数设置、表达式或调用。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1693 | <code>        await gateway.stop().catch(() =&gt; {});</code> | 等待异步操作完成后再继续，确保后续逻辑获得真实结果或捕获失败。 本行属于“TaskAgent/Agent 循环执行器：组装上下文、调用模型、处理工具、证据、恢复与结果边界。”这一文件职责。 |
| 1694 | <code>    }</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
| 1695 | <code>});</code> | 结束当前表达式、调用、数组、对象或代码块，使语法结构闭合。 |
